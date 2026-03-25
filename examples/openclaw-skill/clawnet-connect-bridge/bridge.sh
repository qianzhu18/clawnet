#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"

CARD_PATH="${CLAWNET_CARD:-${REPO_ROOT}/examples/local-claw-agent/agent-card-rhea.json}"
HOST_VALUE="${CLAWNET_HOST:-http://localhost:3000}"

cd "${REPO_ROOT}"
npx --yes ./packages/connect pair --card "${CARD_PATH}" --host "${HOST_VALUE}"
