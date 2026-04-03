"use strict";
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("node:fs");
const path = require("node:path");
const { execFile } = require("node:child_process");

const receiptRoutePath = "/clawnet-receipt";
const defaultHostProduct = "openclaw";

function runExecFile(file, args, options) {
  return new Promise((resolve, reject) => {
    execFile(file, args, options, (error, stdout, stderr) => {
      if (error) {
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

function buildTextResult(text, details) {
  return {
    content: [{ type: "text", text }],
    details,
  };
}

function getOptionalString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function normalizeSessionKey(value) {
  const sessionKey = getOptionalString(value) ?? "main";
  const match = sessionKey.match(/^agent:([^:]+):/);
  return match?.[1] ?? sessionKey;
}

function decodeBase64UrlJson(value) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

function parseReceiptPayload(value) {
  const parsed = decodeBase64UrlJson(value);

  if (!parsed || typeof parsed !== "object") {
    return null;
  }

  const payload = {
    code: getOptionalString(parsed.code),
    agentName: getOptionalString(parsed.agent_name),
    source: getOptionalString(parsed.source),
    hostProduct: getOptionalString(parsed.host_product) ?? defaultHostProduct,
    hostSessionKey: normalizeSessionKey(parsed.host_session_key),
    bridgeTrigger: getOptionalString(parsed.bridge_trigger) ?? "workspace-bridge",
    connectedAt: getOptionalString(parsed.connected_at),
    summary: getOptionalString(parsed.summary),
    postTitle: getOptionalString(parsed.post_title),
    postPreview: getOptionalString(parsed.post_preview),
  };

  if (!payload.code || !payload.agentName || !payload.summary) {
    return null;
  }

  return payload;
}

function buildReturnTarget(returnTo) {
  const fallbackHost = process.env.CLAWNET_HOST || "http://localhost:3000";
  const fallback = `${fallbackHost.replace(/\/$/, "")}/app`;

  try {
    return new URL(returnTo || fallback);
  } catch {
    return new URL(fallback);
  }
}

function buildRedirectUrl(returnTo, params) {
  const url = buildReturnTarget(returnTo);

  Object.entries(params).forEach(([key, value]) => {
    if (!value) {
      return;
    }
    url.searchParams.set(key, value);
  });

  return url.toString();
}

function normalizeBridgeTrigger(messageChannel) {
  const channel = getOptionalString(messageChannel);

  if (!channel) {
    return "openclaw-session";
  }

  return `openclaw-${channel.replace(/[^a-z0-9_-]/gi, "-").toLowerCase()}`;
}

function buildReceiptText(payload) {
  const lines = [
    "ClawNet coexistence receipt",
    `agent: ${payload.agentName}`,
    `pairing: ${payload.code}`,
    `host: ${payload.hostProduct}/${payload.hostSessionKey}`,
    `trigger: ${payload.bridgeTrigger}`,
    `summary: ${payload.summary}`,
  ];

  if (payload.postTitle) {
    lines.push(`post: ${payload.postTitle}`);
  }

  if (payload.postPreview) {
    lines.push(`preview: ${payload.postPreview}`);
  }

  if (payload.connectedAt) {
    lines.push(`connected_at: ${payload.connectedAt}`);
  }

  if (payload.source) {
    lines.push(`source: ${payload.source}`);
  }

  return lines.join("\n");
}

module.exports = {
  id: "clawnet-bridge-dispatch",
  name: "ClawNet Bridge Dispatch",
  description:
    "Dispatch /clawnet_connect_bridge directly to the workspace bridge script and accept ClawNet receipts.",
  register(api) {
    api.registerCommand({
      name: "clawnet_ack",
      description: "Record one ClawNet coexistence receipt in the current OpenClaw session.",
      acceptsArgs: true,
      handler: async ({ args }) => {
        const payload = parseReceiptPayload(args);

        if (!payload) {
          return { text: "ClawNet receipt malformed." };
        }

        return { text: buildReceiptText(payload) };
      },
    });

    api.registerHttpRoute({
      path: receiptRoutePath,
      auth: "plugin",
      handler: async (req, res) => {
        const requestUrl = new URL(req.url || receiptRoutePath, "http://localhost");
        const payload = parseReceiptPayload(
          requestUrl.searchParams.get("payload") || requestUrl.searchParams.get("receipt"),
        );
        const returnTo = requestUrl.searchParams.get("return_to");
        const ackAt = new Date().toISOString();

        if (!payload) {
          res.statusCode = 302;
          res.setHeader(
            "Location",
            buildRedirectUrl(returnTo, {
              ack_status: "failed",
              ack_at: ackAt,
              ack_error: "Malformed ClawNet receipt payload.",
            }),
          );
          res.end();
          return true;
        }

        const sessionKey = normalizeSessionKey(
          payload.hostSessionKey || process.env.OPENCLAW_SESSION_KEY || "main",
        );
        const commandPayload = Buffer.from(
          JSON.stringify({
            code: payload.code,
            agent_name: payload.agentName,
            source: payload.source,
            host_product: payload.hostProduct,
            host_session_key: sessionKey,
            bridge_trigger: payload.bridgeTrigger,
            connected_at: payload.connectedAt,
            summary: payload.summary,
            post_title: payload.postTitle,
            post_preview: payload.postPreview,
          }),
          "utf8",
        ).toString("base64url");

        try {
          const run = await api.runtime.subagent.run({
            sessionKey,
            message: `/clawnet_ack ${commandPayload}`,
            deliver: false,
            idempotencyKey: `clawnet-ack:${payload.code}:${payload.connectedAt || ackAt}`,
          });
          const wait = await api.runtime.subagent.waitForRun({
            runId: run.runId,
            timeoutMs: 10_000,
          });
          const ackStatus =
            wait.status === "ok" ? "sent" : wait.status === "timeout" ? "queued" : "failed";

          res.statusCode = 302;
          res.setHeader(
            "Location",
            buildRedirectUrl(returnTo, {
              ack_status: ackStatus,
              ack_at: ackAt,
              ack_session_key: sessionKey,
              ack_run_id: run.runId,
              ack_error: wait.status === "error" ? wait.error || "OpenClaw receipt run failed." : "",
            }),
          );
          res.end();
          return true;
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          res.statusCode = 302;
          res.setHeader(
            "Location",
            buildRedirectUrl(returnTo, {
              ack_status: "failed",
              ack_at: ackAt,
              ack_session_key: sessionKey,
              ack_error: message,
            }),
          );
          res.end();
          return true;
        }
      },
    });

    api.registerTool((ctx) => ({
      name: "clawnet_bridge_dispatch",
      label: "ClawNet Bridge Dispatch",
      description:
        "Run the workspace clawnet-connect bridge and return connect_url / pair_url without model invocation.",
      parameters: {
        type: "object",
        properties: {
          command: {
            type: "string",
            description: "Optional CLAWNET_HOST override, for example http://172.20.10.3:3000",
          },
          commandName: { type: "string" },
          skillName: { type: "string" },
        },
        additionalProperties: true,
      },
      async execute(_toolCallId, params) {
        const workspaceDir = ctx.workspaceDir || process.env.OPENCLAW_WORKSPACE_DIR || "";
        const skillDir = path.join(workspaceDir, "skills", "clawnet-connect-bridge");
        const bridgePath = path.join(skillDir, "bridge.sh");
        if (!workspaceDir) {
          return buildTextResult("ERROR: Missing workspaceDir for clawnet bridge dispatch.", {
            status: "failed",
          });
        }
        if (!fs.existsSync(bridgePath)) {
          return buildTextResult(`ERROR: Missing bridge script at ${bridgePath}`, {
            status: "failed",
          });
        }

        const rawHost =
          params && typeof params.command === "string" ? params.command.trim() : "";
        const env = { ...process.env };
        if (rawHost) {
          env.CLAWNET_HOST = rawHost;
        }
        env.OPENCLAW_HOST_PRODUCT = defaultHostProduct;
        env.OPENCLAW_SESSION_KEY = normalizeSessionKey(
          ctx.sessionKey || env.OPENCLAW_SESSION_KEY || "main",
        );
        env.OPENCLAW_BRIDGE_TRIGGER =
          env.OPENCLAW_BRIDGE_TRIGGER || normalizeBridgeTrigger(ctx.messageChannel);

        try {
          const { stdout, stderr } = await runExecFile("bash", [bridgePath], {
            cwd: skillDir,
            env,
            maxBuffer: 1024 * 1024,
          });
          const text = stdout.trim() || stderr.trim() || "bridge completed with empty output";
          return buildTextResult(text, { status: "ok" });
        } catch (error) {
          const stdout = typeof error.stdout === "string" ? error.stdout.trim() : "";
          const stderr = typeof error.stderr === "string" ? error.stderr.trim() : "";
          const message = error instanceof Error ? error.message : String(error);
          const text = [stdout, stderr, `ERROR: ${message}`].filter(Boolean).join("\n");
          return buildTextResult(text, { status: "failed" });
        }
      },
    }));
  },
};
