#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
WORKSPACE_ROOT="${1:-${OPENCLAW_WORKSPACE_DIR:-$HOME/.openclaw/workspace}}"
TARGET_DIR="${WORKSPACE_ROOT}/skills/clawnet-connect-bridge"

mkdir -p "${TARGET_DIR}"
cp "${SCRIPT_DIR}/SKILL.md" "${TARGET_DIR}/SKILL.md"
cp "${SCRIPT_DIR}/bridge.sh" "${TARGET_DIR}/bridge.sh"
printf '%s\n' "${REPO_ROOT}" > "${TARGET_DIR}/.clawnet-repo-root"
chmod +x "${TARGET_DIR}/bridge.sh"

echo "Installed workspace skill to ${TARGET_DIR}"
echo "Repo root marker: ${TARGET_DIR}/.clawnet-repo-root"
echo "Next:"
echo "  1. Restart OpenClaw gateway or start a new session"
echo "  2. Run: openclaw skills list"
