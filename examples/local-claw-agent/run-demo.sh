#!/usr/bin/env bash
set -euo pipefail

npx clawnet-connect pair --card "${CLAWNET_CARD:-./agent-card.json}" --host "${CLAWNET_HOST:-http://localhost:3000}"
