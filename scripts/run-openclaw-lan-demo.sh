#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
WORKSPACE_DIR="${OPENCLAW_WORKSPACE_DIR:-$HOME/.openclaw-t030/workspace}"
BRIDGE_SCRIPT="${WORKSPACE_DIR}/skills/clawnet-connect-bridge/bridge.sh"

if [[ ! -x "${BRIDGE_SCRIPT}" ]]; then
  echo "ERROR: OpenClaw workspace bridge not found at ${BRIDGE_SCRIPT}." >&2
  echo "Run install-workspace-skill.sh first, or set OPENCLAW_WORKSPACE_DIR." >&2
  exit 1
fi

if [[ -n "${CLAWNET_BASE_URL:-}" ]]; then
  BASE_URL="${CLAWNET_BASE_URL}"
elif [[ -n "${CLAWNET_LAN_IP:-}" ]]; then
  BASE_URL="http://${CLAWNET_LAN_IP}:3000"
else
  LAN_IFACE="${LAN_IFACE:-$(route get default 2>/dev/null | awk '/interface:/{print $2; exit}')}"

  if [[ -z "${LAN_IFACE}" ]]; then
    echo "ERROR: Failed to detect LAN interface. Set CLAWNET_LAN_IP or CLAWNET_BASE_URL." >&2
    exit 1
  fi

  LAN_IP="$(ipconfig getifaddr "${LAN_IFACE}" 2>/dev/null || true)"

  if [[ -z "${LAN_IP}" ]]; then
    echo "ERROR: Failed to detect LAN IP from interface ${LAN_IFACE}." >&2
    echo "Set CLAWNET_LAN_IP or CLAWNET_BASE_URL explicitly." >&2
    exit 1
  fi

  BASE_URL="http://${LAN_IP}:3000"
fi

HOST_VALUE="${CLAWNET_HOST:-${BASE_URL}}"

cat <<EOF
Running OpenClaw LAN bridge regression
repo_root=${REPO_ROOT}
workspace_dir=${WORKSPACE_DIR}
base_url=${BASE_URL}
host_value=${HOST_VALUE}
EOF

cd "${REPO_ROOT}"
CLAWNET_BASE_URL="${BASE_URL}" \
CLAWNET_HOST="${HOST_VALUE}" \
OPENCLAW_WORKSPACE_DIR="${WORKSPACE_DIR}" \
  npm run demo:openclaw:bridge
