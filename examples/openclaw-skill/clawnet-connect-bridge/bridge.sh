#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MARKER_FILE="${SCRIPT_DIR}/.clawnet-repo-root"
DEFAULT_REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"

if [[ -n "${CLAWNET_REPO_ROOT:-}" ]]; then
  REPO_ROOT="${CLAWNET_REPO_ROOT}"
elif [[ -f "${MARKER_FILE}" ]]; then
  REPO_ROOT="$(tr -d '\r\n' < "${MARKER_FILE}")"
else
  REPO_ROOT="${DEFAULT_REPO_ROOT}"
fi

if [[ ! -f "${REPO_ROOT}/packages/connect/package.json" ]]; then
  echo "ERROR: Cannot locate ClawNet repo root from ${REPO_ROOT}." >&2
  echo "Set CLAWNET_REPO_ROOT explicitly, or install this skill via install-workspace-skill.sh." >&2
  exit 1
fi

CARD_PATH="${CLAWNET_CARD:-${REPO_ROOT}/examples/local-claw-agent/agent-card-rhea.json}"
HOST_VALUE="${CLAWNET_HOST:-http://localhost:3000}"
CLI_ENTRY="${REPO_ROOT}/packages/connect/bin/clawnet-connect.mjs"

if [[ ! -f "${CLI_ENTRY}" ]]; then
  echo "ERROR: Cannot locate ClawNet connect CLI at ${CLI_ENTRY}." >&2
  exit 1
fi

cd "${REPO_ROOT}"
node "${CLI_ENTRY}" pair --card "${CARD_PATH}" --host "${HOST_VALUE}"
