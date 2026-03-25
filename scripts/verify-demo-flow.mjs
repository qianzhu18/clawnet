import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import process from "node:process";
import { setTimeout as delay } from "node:timers/promises";

const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright");

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
const baseUrl = process.env.CLAWNET_BASE_URL ?? "http://127.0.0.1:3000";
const screenshotDir = process.env.CLAWNET_SCREENSHOT_DIR ?? "/tmp/clawnet-demo-regression";

const screenshotPaths = {
  connectDesktop: path.join(screenshotDir, "connect-desktop.png"),
  pairMobile: path.join(screenshotDir, "pair-mobile.png"),
  appMobile: path.join(screenshotDir, "app-mobile.png"),
  networkMobile: path.join(screenshotDir, "network-mobile.png"),
  createdMobile: path.join(screenshotDir, "created-mobile.png"),
  networkDesktop: path.join(screenshotDir, "network-desktop.png"),
  summary: path.join(screenshotDir, "summary.json"),
};

async function main() {
  await mkdir(screenshotDir, { recursive: true });
  await runCommand("demo:connect:install", ["run", "demo:connect:install"]);

  const server = startServer();

  try {
    await waitForServer();

    const cliOutput = await runCommand("demo:connect", ["run", "demo:connect"], {
      env: { ...process.env, CLAWNET_HOST: baseUrl },
    });
    const pairingOutput = parsePairingOutput(cliOutput.stdout);

    const browser = await chromium.launch({ headless: true });

    try {
      await runDesktopFlow(browser, pairingOutput.pair_url);
      await runMobileJoinFlow(browser, pairingOutput.pair_url);
      await runMobileCreateFlow(browser, pairingOutput.payload);
    } finally {
      await browser.close();
    }

    const summary = {
      baseUrl,
      code: pairingOutput.code,
      pair_url: pairingOutput.pair_url,
      screenshots: screenshotPaths,
    };

    await writeFile(screenshotPaths.summary, `${JSON.stringify(summary, null, 2)}\n`, "utf8");

    console.log("Demo regression passed.");
    console.log(`code=${pairingOutput.code}`);
    console.log(`pair_url=${pairingOutput.pair_url}`);
    Object.entries(screenshotPaths).forEach(([key, filePath]) => {
      console.log(`${key}=${filePath}`);
    });
  } finally {
    await stopServer(server);
  }
}

function startServer() {
  const child = spawn(npmCmd, ["run", "start"], {
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
    try {
      const response = await fetch(baseUrl, { redirect: "manual" });

      if (response.ok || response.status === 307 || response.status === 308) {
        return;
      }
    } catch {
      // Keep polling until the server is ready.
    }

    await delay(500);
  }

  throw new Error(`Timed out waiting for server at ${baseUrl}`);
}

async function runDesktopFlow(browser, pairUrl) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1080 } });
  const page = await context.newPage();

  try {
    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    await page.getByRole("link", { name: "Pair local agent" }).click();
    await page.waitForURL(/\/connect/);
    await page.getByText("桌面接入与配对").waitFor();
    await page.screenshot({ path: screenshotPaths.connectDesktop, fullPage: true });

    await page.goto(pairUrl, { waitUntil: "networkidle" });
    await page.getByText("确认这次配对").waitFor();
    await page.getByRole("link", { name: "进入移动 Web /app" }).waitFor();
  } finally {
    await context.close();
  }
}

async function runMobileJoinFlow(browser, pairUrl) {
  const context = await browser.newContext({ ...devices["iPhone 13"] });
  const page = await context.newPage();

  try {
    await page.goto(pairUrl, { waitUntil: "networkidle" });
    await page.getByText("确认这次配对").waitFor();
    await page.screenshot({ path: screenshotPaths.pairMobile, fullPage: true });

    await page.getByRole("link", { name: "进入移动 Web /app" }).click();
    await page.waitForURL(/\/app/);
    await page.getByText("Agent Aster 已从外部环境接入").waitFor();
    await page.screenshot({ path: screenshotPaths.appMobile, fullPage: true });

    await page.getByRole("link", { name: "基站", exact: true }).click();
    await page.waitForURL(/\/app\/station/);
    await page.getByRole("link", { name: "初始化连接" }).click();
    await page.waitForURL(/\/app\/station\/join/);
    await page.getByRole("link", { name: "加入并查看 network" }).first().click();
    await page.waitForURL(/\/network/);
    await page.getByText("你刚刚加入了 深空协议").waitFor();
    await page.getByText("ClawNet Central Station").waitFor();
    await page.screenshot({ path: screenshotPaths.networkMobile, fullPage: true });

    await page.getByRole("link", { name: "回到移动 Web 表面" }).click();
    await page.waitForURL(/\/app\?/);
    await page.getByText("Agent Aster 已从外部环境接入").waitFor();
  } finally {
    await context.close();
  }
}

async function runMobileCreateFlow(browser, payload) {
  const context = await browser.newContext({ ...devices["iPhone 13"] });
  const page = await context.newPage();

  try {
    await page.goto(`${baseUrl}/app/station/create?payload=${encodeURIComponent(payload)}`, {
      waitUntil: "networkidle",
    });
    await page.getByText("创建新基站").waitFor();
    await page.getByRole("button", { name: "立即创建基站并进入 network" }).click();
    await page.waitForURL(/\/network/);
    await page.getByText("你刚刚创建了 Aurora Commons").waitFor();
    await page.screenshot({ path: screenshotPaths.createdMobile, fullPage: true });

    const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 1080 } });
    const desktopPage = await desktopContext.newPage();

    try {
      await desktopPage.goto(page.url(), { waitUntil: "networkidle" });
      await desktopPage.getByText("ClawNet Central Station").waitFor();
      await desktopPage.getByText("Future Self-Hosted Node").waitFor();
      await desktopPage.screenshot({ path: screenshotPaths.networkDesktop, fullPage: true });
    } finally {
      await desktopContext.close();
    }
  } finally {
    await context.close();
  }
}

async function runCommand(label, args, options = {}) {
  const child = spawn(npmCmd, args, {
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

function parsePairingOutput(stdout) {
  const match = stdout.match(/Output:\s*({[\s\S]*?})\s*(?:\n\nDesktop pairing entry:|\n\nQR:)/);

  if (!match) {
    throw new Error("Failed to parse CLI output JSON block.");
  }

  const parsed = JSON.parse(match[1]);
  const payloadMatch = parsed.pair_url?.match(/[?&]payload=([^&]+)/);

  if (!parsed.code || !parsed.pair_url || !payloadMatch) {
    throw new Error("CLI output missing code, pair_url, or payload.");
  }

  return {
    code: parsed.code,
    pair_url: parsed.pair_url,
    payload: decodeURIComponent(payloadMatch[1]),
  };
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
