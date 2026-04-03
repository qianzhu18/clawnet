#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
WORKSPACE_ROOT="${1:-${OPENCLAW_WORKSPACE_DIR:-$HOME/.openclaw/workspace}}"
TARGET_DIR="${WORKSPACE_ROOT}/skills/clawnet-connect-bridge"
VENDOR_DIR="${TARGET_DIR}/vendor"
PLUGIN_ID="clawnet-bridge-dispatch"
PLUGIN_DIR="${WORKSPACE_ROOT}/.openclaw/extensions/${PLUGIN_ID}"
CONFIG_DIR="${OPENCLAW_CONFIG_DIR:-$(cd "${WORKSPACE_ROOT}/.." && pwd)}"
CONFIG_PATH="${CONFIG_DIR}/openclaw.json"

mkdir -p "${TARGET_DIR}"
cp "${SCRIPT_DIR}/SKILL.md" "${TARGET_DIR}/SKILL.md"
cp "${SCRIPT_DIR}/bridge.sh" "${TARGET_DIR}/bridge.sh"
printf '%s\n' "${REPO_ROOT}" > "${TARGET_DIR}/.clawnet-repo-root"
chmod +x "${TARGET_DIR}/bridge.sh"

mkdir -p "${VENDOR_DIR}"
cp "${REPO_ROOT}/packages/connect/bin/clawnet-connect.mjs" "${VENDOR_DIR}/clawnet-connect.mjs"
cp "${REPO_ROOT}/examples/local-claw-agent/agent-card-rhea.json" "${VENDOR_DIR}/agent-card-rhea.json"

mkdir -p "${PLUGIN_DIR}"
cp "${SCRIPT_DIR}/plugin/index.cjs" "${PLUGIN_DIR}/index.cjs"
cp "${SCRIPT_DIR}/plugin/openclaw.plugin.json" "${PLUGIN_DIR}/openclaw.plugin.json"

if [[ -f "${CONFIG_PATH}" ]]; then
  node - "${CONFIG_PATH}" "${PLUGIN_ID}" <<'NODE'
const fs = require("node:fs");

const configPath = process.argv[2];
const pluginId = process.argv[3];
const raw = fs.readFileSync(configPath, "utf8");
const config = JSON.parse(raw);

config.plugins ??= {};
config.plugins.enabled = true;
const allow = Array.isArray(config.plugins.allow) ? config.plugins.allow : [];
if (!allow.includes(pluginId)) {
  allow.push(pluginId);
}
config.plugins.allow = allow;
config.plugins.entries ??= {};
const entry =
  config.plugins.entries[pluginId] && typeof config.plugins.entries[pluginId] === "object"
    ? config.plugins.entries[pluginId]
    : {};
config.plugins.entries[pluginId] = { ...entry, enabled: true };

fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
NODE
fi

echo "Installed workspace skill to ${TARGET_DIR}"
echo "Repo root marker: ${TARGET_DIR}/.clawnet-repo-root"
echo "Vendored connect CLI: ${VENDOR_DIR}/clawnet-connect.mjs"
echo "Vendored agent card: ${VENDOR_DIR}/agent-card-rhea.json"
echo "Installed workspace plugin to ${PLUGIN_DIR}"
if [[ -f "${CONFIG_PATH}" ]]; then
  echo "Enabled plugin in ${CONFIG_PATH}"
fi
echo "Next:"
echo "  1. Restart OpenClaw gateway or start a new session"
echo "  2. Run: openclaw skills list"
echo "  3. Run: openclaw plugins list --json | grep ${PLUGIN_ID}"
echo "  4. In OpenClaw chat/UI, run: /clawnet_connect_bridge http://<LAN_IP>:3000"
