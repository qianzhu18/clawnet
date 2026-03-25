#!/usr/bin/env bash
set -euo pipefail

npx clawnet-connect pair --card ./agent-card.json --host "${CLAWNET_HOST:-http://localhost:3000}"
