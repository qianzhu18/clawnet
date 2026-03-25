import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import fs from "node:fs";
import os from "node:os";
import { fileURLToPath } from "node:url";
import path from "node:path";
import process from "node:process";
import { setTimeout as delay } from "node:timers/promises";

const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright");

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
const baseUrl = process.env.CLAWNET_BASE_URL ?? "http://127.0.0.1:3000";
const bridgeHost = process.env.CLAWNET_HOST ?? baseUrl;
const workspaceDir =
  process.env.OPENCLAW_WORKSPACE_DIR ?? path.join(os.homedir(), ".openclaw-t030", "workspace");
const bridgeScriptPath = path.join(
  workspaceDir,
  "skills",
  "clawnet-connect-bridge",
  "bridge.sh",
);
const screenshotDir =
  process.env.CLAWNET_SCREENSHOT_DIR ?? "/tmp/clawnet-openclaw-bridge-regression";

const screenshotPaths = {
  connectDesktop: path.join(screenshotDir, "connect-desktop.png"),
  pairMobile: path.join(screenshotDir, "pair-mobile.png"),
  appMobile: path.join(screenshotDir, "app-mobile.png"),
  networkMobile: path.join(screenshotDir, "network-mobile.png"),
  summary: path.join(screenshotDir, "summary.json"),
};

async function main() {
  if (!fs.existsSync(bridgeScriptPath)) {
    throw new Error(`OpenClaw workspace bridge not found: ${bridgeScriptPath}`);
  }

  await mkdir(screenshotDir, { recursive: true });

  const server = await ensureServer();

  try {
    const bridgeOutput = await runBridge();
    const pairingOutput = parseBridgeOutput(bridgeOutput.stdout);

    const browser = await chromium.launch({ headless: true });

    try {
      await runDesktopConnectFlow(browser, pairingOutput);
      await runMobilePairFlow(browser, pairingOutput);
    } finally {
      await browser.close();
    }

    const summary = {
      baseUrl,
      bridgeHost,
      workspaceDir,
      bridgeScriptPath,
      code: pairingOutput.code,
      connect_url: pairingOutput.connect_url,
      pair_url: pairingOutput.pair_url,
      payload: pairingOutput.payload,
      host_mode: pairingOutput.host_mode,
      scan_ready: pairingOutput.scan_ready,
      agent_name: pairingOutput.agent_preview?.name,
      screenshots: screenshotPaths,
    };

    await writeFile(screenshotPaths.summary, `${JSON.stringify(summary, null, 2)}\n`, "utf8");

    console.log("OpenClaw bridge regression passed.");
    console.log(`code=${pairingOutput.code}`);
    console.log(`connect_url=${pairingOutput.connect_url}`);
    console.log(`pair_url=${pairingOutput.pair_url}`);
    Object.entries(screenshotPaths).forEach(([key, filePath]) => {
      console.log(`${key}=${filePath}`);
    });
  } finally {
    await stopServer(server);
  }
}

async function ensureBuild() {
  const buildIdPath = path.join(rootDir, ".next", "BUILD_ID");

  if (fs.existsSync(buildIdPath)) {
    return;
  }

  await runCommand("build", npmCmd, ["run", "build"], {
    cwd: rootDir,
    env: process.env,
  });
}

async function ensureServer() {
  if (await isServerReady()) {
    console.log(`Reusing running server at ${baseUrl}`);
    return null;
  }

  await ensureBuild();
  const server = startServer();
  await waitForServer();
  return server;
}

function startServer() {
  const hostname = new URL(baseUrl).hostname;
  const startScript =
    hostname === "127.0.0.1" || hostname === "localhost" ? "start" : "start:lan";

  const child = spawn(npmCmd, ["run", startScript], {
    cwd: rootDir,
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stdout.on("data", (chunk) => {
    process.stdout.write(chunk);
  });

  child.stderr.on("data", (chunk) => {
    process.stderr.write(chunk);
  });

  return child;
}

async function stopServer(child) {
  if (!child || child.exitCode !== null) {
    return;
  }

  child.kill("SIGINT");
  await new Promise((resolve) => {
    const timeout = setTimeout(() => {
      child.kill("SIGKILL");
      resolve();
    }, 3000);

    child.once("exit", () => {
      clearTimeout(timeout);
      resolve();
    });
  });
}

async function waitForServer(timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    if (await isServerReady()) {
      return;
    }

    await delay(500);
  }

  throw new Error(`Timed out waiting for server at ${baseUrl}`);
}

async function isServerReady() {
  try {
    const response = await fetch(baseUrl, { redirect: "manual" });
    return response.ok || response.status === 307 || response.status === 308;
  } catch {
    return false;
  }
}

async function runBridge() {
  return runCommand("openclaw-workspace-bridge", bridgeScriptPath, [], {
    cwd: rootDir,
    env: {
      ...process.env,
      CLAWNET_HOST: bridgeHost,
    },
  });
}

async function runDesktopConnectFlow(browser, pairingOutput) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1080 } });
  const page = await context.newPage();

  try {
    await page.goto(pairingOutput.connect_url, { waitUntil: "networkidle" });
    await page.getByText("桌面接入与配对").waitFor();
    await page
      .locator("article")
      .filter({ hasText: "当前 pairing" })
      .getByRole("heading", { name: pairingOutput.agent_preview.name })
      .waitFor();
    await page.getByText(`配对 code · ${pairingOutput.code}`).waitFor();
    await page.getByText(pairingOutput.agent_preview.source).first().waitFor();
    await page.getByText("已导入当前 pairing").waitFor();
    await page.screenshot({ path: screenshotPaths.connectDesktop, fullPage: true });
  } finally {
    await context.close();
  }
}

async function runMobilePairFlow(browser, pairingOutput) {
  const context = await browser.newContext({ ...devices["iPhone 13"] });
  const page = await context.newPage();
  const agentName = pairingOutput.agent_preview.name;

  try {
    await page.goto(pairingOutput.pair_url, { waitUntil: "networkidle" });
    await page.getByText("确认这次配对").waitFor();
    await page.getByText(`名称：${agentName}`).waitFor();
    await page.getByText(pairingOutput.code).first().waitFor();
    await page.getByText(pairingOutput.agent_preview.source).first().waitFor();
    await page.screenshot({ path: screenshotPaths.pairMobile, fullPage: true });

    await page.getByRole("link", { name: "进入移动 Web /app" }).click();
    await page.waitForURL(/\/app/);
    await page.getByText(`${agentName} 已从外部环境接入`).waitFor();
    await page.getByText(`配对 · ${pairingOutput.code}`).waitFor();
    await page.getByText(pairingOutput.agent_preview.source).first().waitFor();
    await page.screenshot({ path: screenshotPaths.appMobile, fullPage: true });

    await page
      .getByRole("link", { name: new RegExp(`立即让 ${escapeRegex(agentName)} 接入`) })
      .click();
    await page.waitForURL(/\/network/);
    await page.getByText("你刚刚加入了 深空协议").waitFor();
    await page.getByText("ClawNet Central Station").waitFor();
    await page.screenshot({ path: screenshotPaths.networkMobile, fullPage: true });
  } finally {
    await context.close();
  }
}

async function runCommand(label, command, args, options = {}) {
  const child = spawn(command, args, {
    cwd: rootDir,
    env: process.env,
    ...options,
    stdio: ["ignore", "pipe", "pipe"],
  });

  let stdout = "";
  let stderr = "";

  child.stdout.on("data", (chunk) => {
    const text = chunk.toString();
    stdout += text;
    process.stdout.write(text);
  });

  child.stderr.on("data", (chunk) => {
    const text = chunk.toString();
    stderr += text;
    process.stderr.write(text);
  });

  const exitCode = await new Promise((resolve) => {
    child.once("exit", resolve);
  });

  if (exitCode !== 0) {
    throw new Error(`${label} failed with exit code ${exitCode}\n${stderr}`);
  }

  return { stdout, stderr };
}

function parseBridgeOutput(stdout) {
  const match = stdout.match(/Output:\s*({[\s\S]*?})\s*(?:\n\nDesktop pairing entry:|\n\nHost mode:)/);

  if (!match) {
    throw new Error("Failed to parse OpenClaw bridge JSON block.");
  }

  const parsed = JSON.parse(match[1]);

  if (!parsed.code || !parsed.connect_url || !parsed.pair_url || !parsed.agent_preview?.name) {
    throw new Error("Bridge output missing code, connect_url, pair_url, or agent_preview.name.");
  }

  const connectUrl = new URL(parsed.connect_url);
  const pairUrl = new URL(parsed.pair_url);
  const connectPayload = connectUrl.searchParams.get("payload");
  const pairPayload = pairUrl.searchParams.get("payload");
  const connectCode = connectUrl.searchParams.get("code");
  const connectPairUrl = connectUrl.searchParams.get("pair_url");

  if (!connectPayload || !pairPayload || connectPayload !== pairPayload) {
    throw new Error("Bridge output did not preserve one stable payload across connect_url and pair_url.");
  }

  if (connectCode !== parsed.code) {
    throw new Error("connect_url code does not match bridge output code.");
  }

  if (connectPairUrl !== parsed.pair_url) {
    throw new Error("connect_url pair_url does not round-trip to the original pair_url.");
  }

  const snapshot = parsePairingSnapshotPayload(pairPayload);

  if (snapshot.code !== parsed.code) {
    throw new Error("Snapshot code does not match bridge output code.");
  }

  if (snapshot.host_mode !== parsed.host_mode) {
    throw new Error("Snapshot host_mode does not match bridge output host_mode.");
  }

  if (snapshot.agent_id !== parsed.agent_preview.agent_id) {
    throw new Error("Snapshot agent_id does not match bridge output agent_preview.agent_id.");
  }

  if (snapshot.name !== parsed.agent_preview.name || snapshot.source !== parsed.agent_preview.source) {
    throw new Error("Snapshot agent identity does not match bridge output agent_preview.");
  }

  return {
    ...parsed,
    payload: pairPayload,
    snapshot,
  };
}

function parsePairingSnapshotPayload(payload) {
  const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));

  if (
    !parsed ||
    typeof parsed !== "object" ||
    typeof parsed.code !== "string" ||
    typeof parsed.agent_id !== "string" ||
    typeof parsed.name !== "string" ||
    typeof parsed.avatar !== "string" ||
    typeof parsed.bio !== "string" ||
    !Array.isArray(parsed.capabilities) ||
    parsed.capabilities.some((item) => typeof item !== "string") ||
    typeof parsed.source !== "string" ||
    !["local", "lan", "public"].includes(parsed.host_mode) ||
    typeof parsed.issued_at !== "string"
  ) {
    throw new Error("Pairing payload is not a valid Pairing Snapshot.");
  }

  return parsed;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
