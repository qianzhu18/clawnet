"use strict";
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("node:fs");
const path = require("node:path");
const { execFile } = require("node:child_process");

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

module.exports = {
  id: "clawnet-bridge-dispatch",
  name: "ClawNet Bridge Dispatch",
  description: "Dispatch /clawnet_connect_bridge directly to the workspace bridge script.",
  register(api) {
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
