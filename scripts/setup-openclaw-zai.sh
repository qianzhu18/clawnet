#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
OPENCLAW_DIR="${OPENCLAW_DIR:-${REPO_ROOT}/openclaw}"

OPENCLAW_IMAGE="${OPENCLAW_IMAGE:-ghcr.io/openclaw/openclaw:latest}"
OPENCLAW_CONFIG_DIR="${OPENCLAW_CONFIG_DIR:-$HOME/.openclaw-t030}"
OPENCLAW_WORKSPACE_DIR="${OPENCLAW_WORKSPACE_DIR:-${OPENCLAW_CONFIG_DIR}/workspace}"
OPENCLAW_GATEWAY_TOKEN="${OPENCLAW_GATEWAY_TOKEN:-t030-local-token}"
OPENCLAW_GATEWAY_PORT="${OPENCLAW_GATEWAY_PORT:-18789}"
OPENCLAW_GATEWAY_BIND="${OPENCLAW_GATEWAY_BIND:-lan}"
OPENCLAW_ZAI_AUTH_CHOICE="${OPENCLAW_ZAI_AUTH_CHOICE:-zai-coding-cn}"

if [[ -z "${ZAI_API_KEY:-}" ]]; then
  echo "ERROR: ZAI_API_KEY is not set." >&2
  echo "Run: export ZAI_API_KEY='your-zhipu-api-key'" >&2
  exit 1
fi

if [[ ! -d "${OPENCLAW_DIR}" ]]; then
  echo "ERROR: OpenClaw repo not found at ${OPENCLAW_DIR}." >&2
  echo "Set OPENCLAW_DIR to your local openclaw checkout." >&2
  exit 1
fi

mkdir -p "${OPENCLAW_CONFIG_DIR}" "${OPENCLAW_WORKSPACE_DIR}"

MASKED_KEY="${ZAI_API_KEY:0:6}******"

cat <<EOF
Configuring Docker OpenClaw for Z.AI
openclaw_dir=${OPENCLAW_DIR}
config_dir=${OPENCLAW_CONFIG_DIR}
workspace_dir=${OPENCLAW_WORKSPACE_DIR}
gateway_port=${OPENCLAW_GATEWAY_PORT}
gateway_bind=${OPENCLAW_GATEWAY_BIND}
auth_choice=${OPENCLAW_ZAI_AUTH_CHOICE}
zai_api_key=${MASKED_KEY}
EOF

export OPENCLAW_IMAGE
export OPENCLAW_CONFIG_DIR
export OPENCLAW_WORKSPACE_DIR
export OPENCLAW_GATEWAY_TOKEN
export OPENCLAW_GATEWAY_PORT
export OPENCLAW_GATEWAY_BIND

cd "${OPENCLAW_DIR}"

docker compose up -d openclaw-gateway

docker compose run --rm openclaw-cli onboard --non-interactive \
  --mode local \
  --auth-choice "${OPENCLAW_ZAI_AUTH_CHOICE}" \
  --zai-api-key "${ZAI_API_KEY}" \
  --gateway-port "${OPENCLAW_GATEWAY_PORT}" \
  --gateway-bind "${OPENCLAW_GATEWAY_BIND}" \
  --gateway-auth token \
  --gateway-token "${OPENCLAW_GATEWAY_TOKEN}" \
  --accept-risk \
  --skip-skills \
  --skip-health \
  --json

docker compose restart openclaw-gateway

cat <<'EOF'

Minimal verification:
docker compose run --rm openclaw-cli models list
docker compose run --rm openclaw-cli config get agents.defaults.model.primary
docker compose run --rm openclaw-cli agent --local --agent main --message "reply with ok" --json

If `models list` still does not show `zai/*`, the provider is not attached yet.
If it shows `zai/*` but not `zai/glm-5.1`, your current OpenClaw build likely does not bundle that model id yet.
EOF
