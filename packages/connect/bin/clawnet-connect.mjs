#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

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

function buildQrMatrix(input) {
  const cells = 21;
  const bits = [];
  let seed = hashCode(input);

  for (let row = 0; row < cells; row += 1) {
    const currentRow = [];

    for (let col = 0; col < cells; col += 1) {
      const inFinder =
        (row < 5 && col < 5) ||
        (row < 5 && col > cells - 6) ||
        (row > cells - 6 && col < 5);

      if (inFinder) {
        const edge = row === 0 || row === 4 || col === 0 || col === 4;
        const center = row >= 1 && row <= 3 && col >= 1 && col <= 3;
        currentRow.push(edge || center);
        continue;
      }

      seed = (seed * 1664525 + 1013904223) >>> 0;
      currentRow.push((seed & 3) === 0 || ((row + col + seed) & 7) === 0);
    }

    bits.push(currentRow);
  }

  return bits;
}

function renderPseudoQr(input) {
  return buildQrMatrix(input)
    .map((row) => row.map((filled) => (filled ? "██" : "  ")).join(""))
    .join("\n");
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
  const payload = Buffer.from(JSON.stringify(agentCard), "utf8").toString("base64url");
  const code = buildPairCode(agentCard);
  const pairUrl = `${hostInfo.host_value}/pair/${code}?payload=${payload}`;
  const connectUrl = `${hostInfo.host_value}/connect?code=${encodeURIComponent(code)}&payload=${encodeURIComponent(payload)}&pair_url=${encodeURIComponent(pairUrl)}`;

  return {
    code,
    pair_url: pairUrl,
    connect_url: connectUrl,
    qr_payload: pairUrl,
    host_mode: hostInfo.host_mode,
    scan_ready: hostInfo.scan_ready,
    scan_hint: hostInfo.scan_hint,
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
  console.log(renderPseudoQr(output.qr_payload));
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
