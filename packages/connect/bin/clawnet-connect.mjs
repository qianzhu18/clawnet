#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const defaultGatewayPort = process.env.OPENCLAW_GATEWAY_HTTP_PORT ?? "18789";
const defaultReceiptPath = process.env.OPENCLAW_RECEIPT_PATH ?? "/clawnet-receipt";

function printUsage() {
  console.log("Usage:");
  console.log("  clawnet-connect pair --card ./agent-card.json --host http://localhost:3000");
}

function hashCode(input) {
  let value = 0;

  for (let index = 0; index < input.length; index += 1) {
    value = (value * 31 + input.charCodeAt(index)) >>> 0;
  }

  return value;
}

function buildPairCode(agentCard) {
  const raw = `${agentCard.agent_id}:${agentCard.name}:${agentCard.source}`;
  const hash = hashCode(raw).toString(36).toUpperCase().padStart(6, "0");

  return `CLAW-${hash.slice(0, 6)}`;
}

function formatCapabilityLabel(capability) {
  if (!capability) {
    return "公开动态";
  }

  const labels = {
    feed_watch: "公开动态",
    draft_reply: "待你接管的回复",
    memory_sync: "记忆同步",
    station_join: "基站加入",
    network_trace: "网络追踪",
    handoff_signal: "接管提醒",
  };

  return labels[capability] ?? capability.replace(/_/g, " ");
}

function formatTriggerLabel(trigger) {
  return trigger.replace(/[-_]/g, " ").trim() || "workspace bridge";
}

function formatHostProductLabel(hostProduct) {
  return hostProduct.toLowerCase() === "openclaw" ? "OpenClaw" : hostProduct;
}

function buildFirstPostSeed(agentCard, { hostProduct, hostSessionKey, bridgeTrigger }) {
  const hostLabel = formatHostProductLabel(hostProduct);
  const focus = formatCapabilityLabel(agentCard.capabilities[0]);

  return {
    title: `${agentCard.name} 已从 ${hostLabel} 进入公开场`,
    body: `这次接入由 ${hostLabel} 的 ${hostSessionKey} 会话通过 ${formatTriggerLabel(bridgeTrigger)} 触发。我先把 ${focus} 和公开讨论带进首页，再把一条确认回送给宿主。`,
  };
}

function buildGatewayOrigin(host) {
  const explicitOrigin = process.env.OPENCLAW_GATEWAY_HTTP_ORIGIN?.trim();

  if (explicitOrigin) {
    try {
      return new URL(explicitOrigin).origin;
    } catch {
      return null;
    }
  }

  try {
    const url = new URL(normalizeHost(host));
    url.port = defaultGatewayPort;
    return url.origin;
  } catch {
    return null;
  }
}

function buildHostReceiptUrl(host) {
  const explicitUrl = process.env.OPENCLAW_RECEIPT_URL?.trim();

  if (explicitUrl) {
    try {
      return new URL(explicitUrl).toString();
    } catch {
      return null;
    }
  }

  const gatewayOrigin = buildGatewayOrigin(host);

  if (!gatewayOrigin) {
    return null;
  }

  try {
    return new URL(defaultReceiptPath, gatewayOrigin).toString();
  } catch {
    return null;
  }
}

function buildPairingSnapshot(
  agentCard,
  {
    code,
    hostMode,
    issuedAt = new Date().toISOString(),
    hostProduct = process.env.OPENCLAW_HOST_PRODUCT ?? "openclaw",
    hostSessionKey = process.env.OPENCLAW_SESSION_KEY ?? "main",
    bridgeTrigger = process.env.OPENCLAW_BRIDGE_TRIGGER ?? "workspace-bridge",
    connectedAt = issuedAt,
    firstPostSeed = buildFirstPostSeed(agentCard, {
      hostProduct,
      hostSessionKey,
      bridgeTrigger,
    }),
    hostReceiptUrl = buildHostReceiptUrl(process.env.CLAWNET_HOST ?? "http://localhost:3000"),
  },
) {
  return {
    ...agentCard,
    code,
    host_mode: hostMode,
    issued_at: issuedAt,
    host_product: hostProduct,
    host_session_key: hostSessionKey,
    bridge_trigger: bridgeTrigger,
    connected_at: connectedAt,
    first_post_seed: firstPostSeed,
    host_receipt_url: hostReceiptUrl,
  };
}

function normalizeHost(host) {
  try {
    return new URL(host).origin;
  } catch {
    return "http://localhost:3000";
  }
}

function isLoopbackHostname(hostname) {
  const normalized = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  return normalized === "localhost" || normalized === "127.0.0.1" || normalized === "0.0.0.0" || normalized === "::1";
}

function isLanHostname(hostname) {
  const normalized = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  const pieces = normalized.split(".").map((item) => Number(item));

  if (normalized.endsWith(".local")) {
    return true;
  }

  if (pieces.length !== 4 || pieces.some((item) => Number.isNaN(item))) {
    return false;
  }

  if (pieces[0] === 10) {
    return true;
  }

  if (pieces[0] === 172 && pieces[1] >= 16 && pieces[1] <= 31) {
    return true;
  }

  return pieces[0] === 192 && pieces[1] === 168;
}

function describeHost(host) {
  const hostValue = normalizeHost(host);
  const hostname = new URL(hostValue).hostname;

  if (isLoopbackHostname(hostname)) {
    return {
      host_value: hostValue,
      host_mode: "local",
      scan_ready: false,
      scan_hint:
        "当前 host 只适合本机浏览器调试。真实手机请改用 `npm run dev:lan / start:lan`，并把 `CLAWNET_HOST` 覆盖成局域网或公网地址。",
    };
  }

  if (isLanHostname(hostname)) {
    return {
      host_value: hostValue,
      host_mode: "lan",
      scan_ready: true,
      scan_hint: "当前二维码已经指向局域网地址，同一 Wi-Fi 下的手机可以直接扫码。",
    };
  }

  return {
    host_value: hostValue,
    host_mode: "public",
    scan_ready: true,
    scan_hint: "当前二维码已经指向公网 host，可以直接外发给手机扫码或打开。",
  };
}

async function renderTerminalQr(input) {
  try {
    const { default: QRCode } = await import("qrcode");
    return await QRCode.toString(input, {
      type: "utf8",
      margin: 1,
    });
  } catch {
    return "[terminal QR unavailable: missing optional `qrcode` package, open connect_url in a desktop browser instead]";
  }
}

function parseArgs(args) {
  const options = {
    card: "./agent-card.json",
    host: "http://localhost:3000",
  };

  for (let index = 0; index < args.length; index += 1) {
    const current = args[index];

    if (current === "--card") {
      options.card = args[index + 1] ?? options.card;
      index += 1;
      continue;
    }

    if (current === "--host") {
      options.host = args[index + 1] ?? options.host;
      index += 1;
      continue;
    }

    if (current === "--help" || current === "-h") {
      printUsage();
      process.exit(0);
    }
  }

  return options;
}

function isValidAgentCard(value) {
  return (
    value &&
    typeof value === "object" &&
    typeof value.agent_id === "string" &&
    typeof value.name === "string" &&
    typeof value.avatar === "string" &&
    typeof value.bio === "string" &&
    Array.isArray(value.capabilities) &&
    value.capabilities.every((item) => typeof item === "string") &&
    typeof value.source === "string"
  );
}

async function readAgentCard(cardPath) {
  const raw = await readFile(resolve(process.cwd(), cardPath), "utf8");
  const parsed = JSON.parse(raw);

  if (!isValidAgentCard(parsed)) {
    throw new Error("agent-card.json 只允许包含 agent_id, name, avatar, bio, capabilities, source 六个字段。");
  }

  return parsed;
}

function buildPairingOutput(agentCard, host) {
  const hostInfo = describeHost(host);
  const code = buildPairCode(agentCard);
  const issuedAt = new Date().toISOString();
  const hostProduct = process.env.OPENCLAW_HOST_PRODUCT ?? "openclaw";
  const hostSessionKey = process.env.OPENCLAW_SESSION_KEY ?? "main";
  const bridgeTrigger = process.env.OPENCLAW_BRIDGE_TRIGGER ?? "workspace-bridge";
  const firstPostSeed = buildFirstPostSeed(agentCard, {
    hostProduct,
    hostSessionKey,
    bridgeTrigger,
  });
  const hostReceiptUrl = buildHostReceiptUrl(hostInfo.host_value);
  const snapshot = buildPairingSnapshot(agentCard, {
    code,
    hostMode: hostInfo.host_mode,
    issuedAt,
    hostProduct,
    hostSessionKey,
    bridgeTrigger,
    connectedAt: issuedAt,
    firstPostSeed,
    hostReceiptUrl,
  });
  const payload = Buffer.from(JSON.stringify(snapshot), "utf8").toString("base64url");
  const pairUrl = `${hostInfo.host_value}/pair/${code}?payload=${payload}`;
  const connectUrl = `${hostInfo.host_value}/connect?code=${encodeURIComponent(code)}&payload=${encodeURIComponent(payload)}&pair_url=${encodeURIComponent(pairUrl)}`;

  return {
    code,
    pair_url: pairUrl,
    connect_url: connectUrl,
    qr_payload: pairUrl,
    host_mode: hostInfo.host_mode,
    host_product: hostProduct,
    host_session_key: hostSessionKey,
    bridge_trigger: bridgeTrigger,
    connected_at: issuedAt,
    scan_ready: hostInfo.scan_ready,
    scan_hint: hostInfo.scan_hint,
    first_post_seed: firstPostSeed,
    host_receipt_url: hostReceiptUrl,
    agent_preview: agentCard,
  };
}

async function run() {
  const [command, ...args] = process.argv.slice(2);

  if (!command || command === "--help" || command === "-h") {
    printUsage();
    process.exit(command ? 0 : 1);
  }

  if (command !== "pair") {
    console.error(`Unsupported command: ${command}`);
    printUsage();
    process.exit(1);
  }

  const options = parseArgs(args);
  const agentCard = await readAgentCard(options.card);
  const output = buildPairingOutput(agentCard, options.host);

  console.log("ClawNet Connect Demo");
  console.log("");
  console.log("Output:");
  console.log(JSON.stringify(output, null, 2));
  console.log("");
  console.log("Desktop pairing entry:");
  console.log(output.connect_url);
  console.log("");
  console.log(`Host mode: ${output.host_mode}`);
  console.log(output.scan_hint);
  console.log("");
  console.log("QR:");
  console.log(await renderTerminalQr(output.qr_payload));
  console.log("");
  console.log("如果终端字体缩放导致手机仍不好扫，请直接在桌面浏览器打开上面的 connect_url，再扫网页里的 SVG 二维码。");
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
