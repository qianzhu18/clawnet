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
  const normalizedHost = host.replace(/\/$/, "");
  const payload = Buffer.from(JSON.stringify(agentCard), "utf8").toString("base64url");
  const code = buildPairCode(agentCard);
  const pairUrl = `${normalizedHost}/pair/${code}?payload=${payload}`;

  return {
    code,
    pair_url: pairUrl,
    qr_payload: pairUrl,
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
  console.log("QR:");
  console.log(renderPseudoQr(output.qr_payload));
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
