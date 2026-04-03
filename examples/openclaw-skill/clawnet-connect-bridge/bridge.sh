#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MARKER_FILE="${SCRIPT_DIR}/.clawnet-repo-root"
VENDOR_DIR="${SCRIPT_DIR}/vendor"
DEFAULT_REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
VENDORED_CARD_PATH="${VENDOR_DIR}/agent-card-rhea.json"
VENDORED_CLI_PATH="${VENDOR_DIR}/clawnet-connect.mjs"

REPO_ROOT=""

if [[ -n "${CLAWNET_REPO_ROOT:-}" ]]; then
  REPO_ROOT="${CLAWNET_REPO_ROOT}"
elif [[ -f "${MARKER_FILE}" ]]; then
  REPO_ROOT="$(tr -d '\r\n' < "${MARKER_FILE}")"
elif [[ -d "${DEFAULT_REPO_ROOT}" ]]; then
  REPO_ROOT="${DEFAULT_REPO_ROOT}"
fi

CARD_PATH="${CLAWNET_CARD:-}"
HOST_VALUE="${CLAWNET_HOST:-http://localhost:3000}"
CLI_ENTRY="${CLAWNET_CONNECT_CLI:-}"
HOST_PRODUCT="${OPENCLAW_HOST_PRODUCT:-openclaw}"
SESSION_KEY="${OPENCLAW_SESSION_KEY:-main}"
BRIDGE_TRIGGER="${OPENCLAW_BRIDGE_TRIGGER:-workspace-bridge}"

if [[ -z "${CLI_ENTRY}" && -f "${VENDORED_CLI_PATH}" ]]; then
  CLI_ENTRY="${VENDORED_CLI_PATH}"
fi

if [[ -z "${CARD_PATH}" && -f "${VENDORED_CARD_PATH}" ]]; then
  CARD_PATH="${VENDORED_CARD_PATH}"
fi

if [[ -n "${REPO_ROOT}" && -f "${REPO_ROOT}/packages/connect/bin/clawnet-connect.mjs" ]]; then
  if [[ -z "${CLI_ENTRY}" ]]; then
    CLI_ENTRY="${REPO_ROOT}/packages/connect/bin/clawnet-connect.mjs"
  fi
  if [[ -z "${CARD_PATH}" ]]; then
    CARD_PATH="${REPO_ROOT}/examples/local-claw-agent/agent-card-rhea.json"
  fi
fi

if [[ -z "${CLI_ENTRY}" || ! -f "${CLI_ENTRY}" ]]; then
  echo "ERROR: Cannot locate ClawNet connect CLI." >&2
  echo "Set CLAWNET_CONNECT_CLI explicitly, or install this skill via install-workspace-skill.sh." >&2
  exit 1
fi

if [[ -z "${CARD_PATH}" || ! -f "${CARD_PATH}" ]]; then
  echo "ERROR: Cannot locate ClawNet agent card." >&2
  echo "Set CLAWNET_CARD explicitly, or install this skill via install-workspace-skill.sh." >&2
  exit 1
fi

if [[ -n "${REPO_ROOT}" && -d "${REPO_ROOT}" ]]; then
  cd "${REPO_ROOT}"
else
  cd "${SCRIPT_DIR}"
fi

export OPENCLAW_HOST_PRODUCT="${HOST_PRODUCT}"
export OPENCLAW_SESSION_KEY="${SESSION_KEY}"
export OPENCLAW_BRIDGE_TRIGGER="${BRIDGE_TRIGGER}"

node "${CLI_ENTRY}" pair --card "${CARD_PATH}" --host "${HOST_VALUE}"
