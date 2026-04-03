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
ACTION="${1:-start}"

if [[ ! -d "${OPENCLAW_DIR}" ]]; then
  echo "ERROR: OpenClaw repo not found at ${OPENCLAW_DIR}." >&2
  exit 1
fi

mkdir -p "${OPENCLAW_CONFIG_DIR}" "${OPENCLAW_WORKSPACE_DIR}"

dc() {
  OPENCLAW_IMAGE="${OPENCLAW_IMAGE}" \
  OPENCLAW_CONFIG_DIR="${OPENCLAW_CONFIG_DIR}" \
  OPENCLAW_WORKSPACE_DIR="${OPENCLAW_WORKSPACE_DIR}" \
  OPENCLAW_GATEWAY_TOKEN="${OPENCLAW_GATEWAY_TOKEN}" \
  OPENCLAW_GATEWAY_PORT="${OPENCLAW_GATEWAY_PORT}" \
  docker compose -f "${OPENCLAW_DIR}/docker-compose.yml" "$@"
}

ensure_polling_mode() {
  local field
  for field in webhookUrl webhookSecret webhookPath webhookHost webhookPort webhookCertPath; do
    dc run --rm openclaw-cli config unset "channels.telegram.${field}" >/dev/null 2>&1 || true
  done
}

wait_for_gateway() {
  local health_url="http://127.0.0.1:${OPENCLAW_GATEWAY_PORT}/healthz"
  local attempt
  for attempt in $(seq 1 30); do
    if curl -fsS "${health_url}" >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
  done
  echo "ERROR: Gateway did not become healthy at ${health_url}." >&2
  return 1
}

show_status() {
  dc exec -T openclaw-gateway sh -lc 'node dist/index.js channels status --json --probe'
}

start_local() {
  dc up -d openclaw-gateway
  ensure_polling_mode
  dc restart openclaw-gateway >/dev/null
  wait_for_gateway
  echo "OpenClaw Telegram local mode is ready."
  echo "config_dir=${OPENCLAW_CONFIG_DIR}"
  echo "workspace_dir=${OPENCLAW_WORKSPACE_DIR}"
  echo "mode=polling"
  show_status
}

stop_local() {
  dc stop openclaw-gateway
}

case "${ACTION}" in
  start)
    start_local
    ;;
  status)
    show_status
    ;;
  stop)
    stop_local
    ;;
  *)
    echo "Usage: $0 [start|status|stop]" >&2
    exit 1
    ;;
esac
