---
title: OpenClaw 本机隔离测试 Runbook
status: active
owner: founder
last_updated: 2026-03-29
---

# OpenClaw 本机隔离测试 Runbook

## 目标

在不污染主工作环境的前提下，用 `OpenClaw` 跑通第一条真实宿主链路：

- `OpenClaw`
- `ClawNet connect bridge`
- 桌面 `/connect`
- 手机 `/pair -> /app`

## 当前原则

- 先本机隔离，再真实宿主
- 先 `workspace skill`，再考虑全局技能目录
- 先本地 CLI bridge，再考虑 webhook
- 先验证桌面配置与移动体验，不做公开技能分发
- 当前 Telegram 本机日常使用默认固定为 `polling`，不再把 `ngrok` 当成稳定前置

## 前置条件

1. 当前仓库已可本地运行
2. 当前机器能跑：
   - `npm run dev:lan`
   - `npm run demo:connect`
3. 手机与电脑在同一网络
4. 当前不接入真实生产数据和生产账号

## 建议的本机隔离方式

当前不建议只用一个目录硬撑。

当前推荐最小安全边界：

1. 新建单独 macOS 测试账户
   - 例如 `clawnet-lab`
2. 只在该账户中安装和运行 `OpenClaw`
3. 在该账户中再使用独立实验目录
   - 例如 `~/clawnet-openclaw-lab/`
4. 只安装自己可审阅的 `ClawNet` bridge
5. 不安装随机 `ClawHub` skill
6. 不导入真实 webhook secret 或生产凭据

如果你后续要接更高权限数据，再升级到虚拟机。

## 推荐步骤

### 步骤 1：进入隔离账户

先切到单独的 macOS 测试账户，例如 `clawnet-lab`。

后续所有 `OpenClaw` 安装、skill 放置和 bridge 调试，都只在这个账户中进行。

### 步骤 2：准备局域网调试基线

这一步可以由主开发账户完成，不要求放进隔离账户。

当前边界是：

- `OpenClaw` 安装、skill 和 bridge：放在隔离账户
- `ClawNet` Web 服务：可以先继续由主开发账户提供

在 `ClawNet` 仓库根目录启动本地服务：

```bash
cd "/Users/mac/qianzhu Vault/project/clawnet"
npm run dev:lan
```

确认手机能手动打开你的局域网地址，例如：

```text
http://172.20.10.3:3000
```

只有这一步成立，后面的扫码才有意义。

### 步骤 3：准备实验目录

```bash
mkdir -p ~/clawnet-openclaw-lab
cd ~/clawnet-openclaw-lab
git clone https://github.com/qianzhu18/clawnet.git clawnet
git clone https://github.com/openclaw/openclaw.git openclaw
cd clawnet
git checkout spec/t029-openclaw-host-strategy
npm install
```

这个 lab clone 只用于：

- `OpenClaw` 实验 workspace
- `ClawNet` 本地 skill / bridge
- 安装与验证记录

### 步骤 4：安装和启动 OpenClaw

按 OpenClaw 官方安装和 onboarding 文档完成，但 `T030` 当前优先采用“Docker 隔离 + 非交互 onboard”的最小路径。

当前只要求最小可运行，不要求先接通所有 channel，也不要求先补模型 API key。

当前最小可复跑命令以 `OpenClaw` 仓库根目录为准：

```bash
cd ~/clawnet-openclaw-lab/openclaw
export OPENCLAW_IMAGE="ghcr.io/openclaw/openclaw:latest"
export OPENCLAW_CONFIG_DIR="$HOME/.openclaw-t030"
export OPENCLAW_WORKSPACE_DIR="$HOME/.openclaw-t030/workspace"
export OPENCLAW_GATEWAY_TOKEN="t030-local-token"

docker compose run --rm --no-deps openclaw-cli onboard --non-interactive \
  --mode local \
  --auth-choice skip \
  --gateway-port 18789 \
  --gateway-bind lan \
  --gateway-auth token \
  --gateway-token "$OPENCLAW_GATEWAY_TOKEN" \
  --accept-risk \
  --skip-skills \
  --skip-health \
  --json

docker compose up -d openclaw-gateway
docker compose ps
```

已验证事实：

- `onboard --non-interactive` 会写出隔离目录下的 `openclaw.json` 和 workspace bootstrap 文件
- 在当前官方镜像上，`gateway.bind = lan` 首次启动时会自动补 `gateway.controlUi.allowedOrigins`
- `docker compose ps` 应显示 `openclaw-gateway` 为 `healthy`
- `auth-choice skip` 不会阻断 `T030` 的 skill loader 验证，但后续真实会话聊天仍需要补 provider auth

如果你更想走官方引导式安装，而不是这条最小命令链，可以改用：

```bash
cd ~/clawnet-openclaw-lab/openclaw
export OPENCLAW_IMAGE="ghcr.io/openclaw/openclaw:latest"
export OPENCLAW_CONFIG_DIR="$HOME/.openclaw-t030"
export OPENCLAW_WORKSPACE_DIR="$HOME/.openclaw-t030/workspace"
./scripts/docker/setup.sh
```

### 步骤 4b：如果要切到智谱 `Z.AI / GLM`

当前项目里已经踩过一个坑：

- `~/.openclaw-t030/openclaw.json` 可能还保留着旧的 `google/*` provider 与默认模型
- 此时即使 `dashboard / devices / config` 都能跑，`agent --local` 也不代表已经在用智谱

因此，对当前 Docker 隔离环境，切换到智谱的首选方式固定为：

1. 不手工先进容器 `bash`
2. 不优先直接改 `openclaw.json`
3. 优先从宿主机终端重新跑一次非交互 `onboard`

如果你不想反复手敲长命令，当前仓库里已经补了一个宿主机脚本：

```bash
cd "/Users/mac/qianzhu Vault/project/clawnet"
export ZAI_API_KEY="你的智谱 API Key"
bash scripts/setup-openclaw-zai.sh
```

推荐命令：

```bash
cd ~/clawnet-openclaw-lab/openclaw
export OPENCLAW_IMAGE="ghcr.io/openclaw/openclaw:latest"
export OPENCLAW_CONFIG_DIR="$HOME/.openclaw-t030"
export OPENCLAW_WORKSPACE_DIR="$HOME/.openclaw-t030/workspace"
export OPENCLAW_GATEWAY_TOKEN="t030-local-token"
export ZAI_API_KEY="你的智谱 API Key"

docker compose run --rm openclaw-cli onboard --non-interactive \
  --mode local \
  --auth-choice zai-coding-cn \
  --zai-api-key "$ZAI_API_KEY" \
  --gateway-port 18789 \
  --gateway-bind lan \
  --gateway-auth token \
  --gateway-token "$OPENCLAW_GATEWAY_TOKEN" \
  --accept-risk \
  --skip-skills \
  --skip-health \
  --json

docker compose restart openclaw-gateway
```

说明：

- 如果你明确使用智谱编程套餐中国区，优先用 `zai-coding-cn`
- 如果你只想让 OpenClaw 自动探测 Z.AI 端点，可改用 `--auth-choice zai-api-key`
- 当前不建议先按旧教程手改 `models.providers.zai.models`，除非 provider 已经成功接入且只是补一个上游新模型 ID
- 如果你当前只打算用智谱完成全部对话与任务，其他未配置 API key 的 provider 不需要继续补；它们不是当前可用性的前置条件
- 切到智谱后，先用 `models list` 看当前账号与套餐实际可见的 `zai/*` 模型，再决定是否把默认模型从 `zai/glm-4.7` 切到 `zai/glm-5` 或其他型号
- 如果 Web UI 的模型下拉框仍只显示 `glm-4.7 + google`，问题通常不在 provider，而在 `agents.defaults.models` 允许列表；只有写进这个列表的模型，才会出现在 `/model` 和模型选择器里
- 如果 Web UI 报 `⚠️ API rate limit reached. Please try again later.`，不要先把它理解成单纯的请求过多；在智谱侧，某些“套餐未开放该模型权限”的错误也会以 `429` 返回，OpenClaw 会把它统一表述成 rate limit

最小检查命令：

```bash
alias oc='docker compose run --rm openclaw-cli'

oc models list
oc config get agents.defaults.model.primary
oc agent --local --agent main --message "reply with ok" --json
```

通过标准：

- `models list` 里已经出现 `zai/*`
- `agents.defaults.model.primary` 不再是 `google/gemini-*`
- `agent --local` 不再因旧 provider 配置而继续走 Google

推荐的 `Z.AI-only` 选择器收口示例：

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "zai/glm-4.7",
        "fallbacks": ["zai/glm-4.6", "zai/glm-4.5-air"]
      },
      "imageModel": {
        "primary": "zai/glm-4.6v",
        "fallbacks": ["zai/glm-4.5v"]
      },
      "models": {
        "zai/glm-4.7": { "alias": "GLM" },
        "zai/glm-4.6": { "alias": "GLM-4.6" },
        "zai/glm-4.5-air": { "alias": "GLM-Air" },
        "zai/glm-4.6v": { "alias": "GLM-V" },
        "zai/glm-4.5v": { "alias": "GLM-V-Lite" }
      }
    }
  }
}
```

如果要定位具体原因，优先看网关日志里的 `rawError`：

```bash
cd ~/clawnet-openclaw-lab/openclaw
export OPENCLAW_IMAGE="ghcr.io/openclaw/openclaw:latest"
export OPENCLAW_CONFIG_DIR="$HOME/.openclaw-t030"
export OPENCLAW_WORKSPACE_DIR="$HOME/.openclaw-t030/workspace"
export OPENCLAW_GATEWAY_TOKEN="t030-local-token"

docker logs --tail 120 openclaw-openclaw-gateway-1
```

### 步骤 4c：固定 Telegram 本机稳定模式

如果你当前目标是：

- 以后重启后还能继续用
- 不想再跟着 `ngrok` 域名变化反复改 webhook
- 只想让本机 `OpenClaw` 稳定收发 Telegram

那当前标准入口固定为：

```bash
cd "/Users/mac/qianzhu Vault/project/clawnet"
npm run openclaw:telegram:local
```

这条命令会做 3 件事：

1. 拉起 `openclaw-gateway`
2. 清理 `channels.telegram.webhook*` 配置
3. 把 Telegram 固定到 `polling` 模式后再输出状态

通过标准：

- `channels status --json --probe` 里看到：
  - `mode = "polling"`
  - `probe.webhook.url = ""`
- 即使本机没有运行 `ngrok`，也不影响 Telegram 收发

辅助命令：

```bash
npm run openclaw:telegram:status
npm run openclaw:telegram:stop
```

当前说明：

- 这条稳定路径不需要再做内网穿透
- 它仍然依赖本机 Docker 正常运行
- 它仍然依赖本机到 `api.telegram.org` 和当前模型提供商的出站网络可用
- 如果你要做“公网可入站”的调试，再单独切回 webhook；那不是当前默认标准

### 步骤 4c：如果要在隔离宿主里接通 Telegram

当前这套 `Docker` 隔离环境，推荐固定为：

- `Telegram bot token`
- `dmPolicy = pairing`
- `polling`

当前不要把它优先配成 `webhook`。

原因：

- 这套本机隔离基线当前没有单独把 `Telegram webhook` 的监听口作为对外入口来维护
- 如果你之前已经对同一个 bot 调过 `setWebhook`，它会和 `polling` 抢更新源
- 只要目标是先跑通“私聊 bot -> pairing -> approve -> 开始对话”，`polling` 更稳、更短，也更适合本机隔离测试

最小配置步骤：

```bash
cd ~/clawnet-openclaw-lab/openclaw
export OPENCLAW_IMAGE="ghcr.io/openclaw/openclaw:latest"
export OPENCLAW_CONFIG_DIR="$HOME/.openclaw-t030"
export OPENCLAW_WORKSPACE_DIR="$HOME/.openclaw-t030/workspace"
export OPENCLAW_GATEWAY_TOKEN="t030-local-token"

alias oc='docker compose run --rm openclaw-cli'

oc channels add --channel telegram --token "<TELEGRAM_BOT_TOKEN>"
oc config set plugins.allow '["clawnet-bridge-dispatch","zai","telegram"]' --strict-json
docker compose restart openclaw-gateway
oc channels status --json --probe
```

如果你之前已经绑过 webhook，先删掉：

```bash
curl "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/deleteWebhook?drop_pending_updates=true"
```

当前通过标准：

- `channels status --json --probe` 里能看到：
  - `channelOrder = ["telegram"]`
  - `configured = true`
  - `running = true`
  - `probe.ok = true`
  - `mode = "polling"`
- `getWebhookInfo` 返回空 `url`

然后再做首次 pairing：

1. 在 Telegram 私聊 bot，先随便发一条消息
2. 回到宿主机终端执行：

```bash
oc pairing list telegram
oc pairing approve telegram <PAIRING_CODE>
```

如果 `openclaw.json` 明明已经有 `channels.telegram`，但 `channels status` 仍是空白，优先检查：

- `plugins.allow` 是否已经显式包含 `telegram`

因为一旦设置了 `plugins.allow`，内建 channel 插件也会受 allowlist 约束；如果没把 `telegram` 放进去，token 配对再对也不会启动 provider。

当前项目里已验证过一种典型情况：

- Web UI 表面错误：`⚠️ API rate limit reached. Please try again later.`
- 上游 `rawError`：`429 当前订阅套餐暂未开放GLM-5权限`
- 含义：不是本地网关坏了，而是你把 `zai/glm-5` 设成主模型，但当前智谱订阅并没有给这个模型放权
- 当前更稳的默认策略应先回落到 `zai/glm-4.7`，把 `glm-5` 从日常默认和选择器里移出，等套餐权限确认后再加回

### 步骤 5：只使用 workspace skill

第一版只把 `ClawNet` 作为当前实验 workspace 的 skill 放进去，不直接改公开分发和全局市场安装路径。

当前仓库里的模板固定为：

- `examples/openclaw-skill/clawnet-connect-bridge/SKILL.md`
- `examples/openclaw-skill/clawnet-connect-bridge/bridge.sh`
- `examples/openclaw-skill/clawnet-connect-bridge/install-workspace-skill.sh`

安装方式固定为“复制进 workspace”，不是把 repo 外部目录直接 symlink 进去：

```bash
cd ~/clawnet-openclaw-lab/clawnet
OPENCLAW_WORKSPACE_DIR="$HOME/.openclaw-t030/workspace" \
  ./examples/openclaw-skill/clawnet-connect-bridge/install-workspace-skill.sh
```

这一步会做 3 件事：

- 把 `SKILL.md` 和 `bridge.sh` 复制到 `~/.openclaw-t030/workspace/skills/clawnet-connect-bridge/`
- 写入 `.clawnet-repo-root`，让被复制后的 `bridge.sh` 还能定位原始 `ClawNet` 仓库
- 保留 workspace 内的真实文件结构，避免被 skill loader 当成越界路径跳过

验收点：

- `OpenClaw` 能发现这个 workspace skill
- 不需要依赖公开 `ClawHub`

当前最小检测命令：

```bash
cd ~/clawnet-openclaw-lab/openclaw
OPENCLAW_CONFIG_DIR="$HOME/.openclaw-t030" \
OPENCLAW_WORKSPACE_DIR="$HOME/.openclaw-t030/workspace" \
OPENCLAW_IMAGE="ghcr.io/openclaw/openclaw:latest" \
docker compose run --rm --no-deps --entrypoint sh openclaw-gateway -lc \
  'cd /home/node/.openclaw/workspace && node /app/dist/index.js skills info clawnet_connect_bridge --json'
```

通过标准：

- `source = openclaw-workspace`
- `eligible = true`
- `filePath` 指向 `/home/node/.openclaw/workspace/skills/clawnet-connect-bridge/SKILL.md`

### 步骤 6：桥接到本地 CLI

第一版 skill 只做一件事：

- shell-out 到本地 `clawnet-connect` bridge

当前目标输出必须保留：

- `code`
- `pair_url`
- `connect_url`
- `host_mode`
- `scan_ready`
- `agent_preview`

如果你要直接在隔离账户里手工跑一次模板 bridge：

```bash
cd ~/clawnet-openclaw-lab/clawnet
CLAWNET_HOST=http://172.20.10.3:3000 ./examples/openclaw-skill/clawnet-connect-bridge/bridge.sh
```

如果你要验证“被复制到 workspace 后的 skill 仍然可执行”，当前最小命令固定为：

```bash
CLAWNET_HOST=http://172.20.10.3:3000 \
  ~/.openclaw-t030/workspace/skills/clawnet-connect-bridge/bridge.sh
```

通过标准：

- 输出中同时包含 `connect_url / pair_url / host_mode / scan_ready`
- `host_mode = lan` 时，`scan_ready = true`
- `Desktop pairing entry` 与 `pair_url` 可继续承接到现有 `ClawNet /connect`

### 步骤 7：桌面承接

由宿主调用产生一次真实 pairing 后：

1. 复制或打开 `connect_url`
2. 在桌面浏览器确认 `/connect` 显示的是本次 pairing
3. 确认页面二维码内容与 `pair_url` 一致

### 步骤 8：手机承接

1. 手机扫码或直接打开 `pair_url`
2. 进入 `/pair`
3. 进入 `/app`
4. 检查 agent 名称、来源和状态连续

### 步骤 9：即时动作验证

接入成功后，立即执行一次动作：

- 例如进入 `/network`
- 或完成一次加入动作

目标不是多功能，而是证明“这次连接真的已经生效”。

### 步骤 10：固定一条可复跑的本地验收命令

当前最小验收基线先固定为：

- `OpenClaw` 已启动
- workspace skill 已安装
- workspace 内 `bridge.sh` 可产出当前 pairing
- 桌面 `/connect` 与手机 `/pair -> /app -> /network` 可重复验证

推荐命令：

```bash
cd "/Users/mac/qianzhu Vault/project/clawnet"
OPENCLAW_WORKSPACE_DIR="$HOME/.openclaw-t030/workspace" \
  npm run demo:openclaw:lan
```

这条命令会自动做两件事：

- 自动探测当前默认网卡和局域网 IP
- 把 `CLAWNET_BASE_URL / CLAWNET_HOST` 设成同一局域网地址，再执行 `demo:openclaw:bridge`

如果你要手动指定 IP，推荐这样覆盖：

```bash
cd "/Users/mac/qianzhu Vault/project/clawnet"
CLAWNET_LAN_IP="172.20.10.3" \
OPENCLAW_WORKSPACE_DIR="$HOME/.openclaw-t030/workspace" \
  npm run demo:openclaw:lan
```

底层展开命令仍然是：

```bash
cd "/Users/mac/qianzhu Vault/project/clawnet"
LAN_IFACE="$(route get default | awk '/interface:/{print $2}')"
LAN_IP="$(ipconfig getifaddr "$LAN_IFACE")"

OPENCLAW_WORKSPACE_DIR="$HOME/.openclaw-t030/workspace" \
CLAWNET_BASE_URL="http://${LAN_IP}:3000" \
CLAWNET_HOST="http://${LAN_IP}:3000" \
npm run demo:openclaw:bridge
```

通过标准：

- 终端输出 `OpenClaw bridge regression passed`
- `host_mode = lan`
- `scan_ready = true`
- `/tmp/clawnet-openclaw-bridge-regression/summary.json` 存在
- 桌面与手机截图都已生成

补充说明：

- 如果 `3000` 端口上已经有当前 `ClawNet` 服务在跑，脚本会直接复用，不会重复起一个 server。
- 如果 `3000` 端口还没有服务，`demo:openclaw:bridge` 会自动 build 并拉起 `start:lan`。
- 这条命令对应当前“本地启动 OpenClaw 后，手机可扫码进入微博客表面”的验收口径。
- 这条一键命令不要求你先手工 export `LAN_IP`，更适合作为当前主线的默认入口。

## T030 最小可复跑摘要

1. 主开发账户启动 `npm run dev:lan`，先拿到手机可访问的 `ClawNet` 局域网地址。
2. 隔离账户准备 `~/clawnet-openclaw-lab/clawnet` 和 `~/clawnet-openclaw-lab/openclaw` 两个仓库。
3. 在 `openclaw/` 根目录执行上面的非交互 `onboard`，并用 `docker compose up -d openclaw-gateway` 拉起隔离宿主。
4. 在 `clawnet/` 根目录执行 `install-workspace-skill.sh`，把 skill 复制到 `~/.openclaw-t030/workspace/skills/`。
5. `install-workspace-skill.sh` 现在会顺带把最小 `clawnet-connect.mjs` 和默认 `agent-card-rhea.json` vendoring 到 `workspace/skills/clawnet-connect-bridge/vendor/`，避免容器内真实 slash 触发时找不到宿主仓库路径。
6. 回到 `openclaw/` 根目录执行 `skills info clawnet_connect_bridge --json`，确认 `source = openclaw-workspace` 且 `eligible = true`。
7. 直接执行 `~/.openclaw-t030/workspace/skills/clawnet-connect-bridge/bridge.sh`，确认输出里同时存在 `connect_url / pair_url / host_mode / scan_ready`。

## T031 严格宿主链复跑

### 1. 先确认宿主与 workspace skill 都已就绪

```bash
cd "/Users/mac/qianzhu Vault/project/clawnet"

OPENCLAW_CONFIG_DIR="$HOME/.openclaw-t030" \
OPENCLAW_WORKSPACE_DIR="$HOME/.openclaw-t030/workspace" \
  docker compose -f openclaw/docker-compose.yml ps

OPENCLAW_CONFIG_DIR="$HOME/.openclaw-t030" \
OPENCLAW_WORKSPACE_DIR="$HOME/.openclaw-t030/workspace" \
  docker compose -f openclaw/docker-compose.yml exec -T openclaw-gateway \
  node /app/dist/index.js skills info clawnet_connect_bridge --json

OPENCLAW_CONFIG_DIR="$HOME/.openclaw-t030" \
OPENCLAW_WORKSPACE_DIR="$HOME/.openclaw-t030/workspace" \
  docker compose -f openclaw/docker-compose.yml exec -T openclaw-gateway \
  node /app/dist/index.js plugins list --json
```

通过标准：

- `openclaw-openclaw-gateway-1` 为 `healthy`
- `clawnet_connect_bridge` 仍然是 `source = openclaw-workspace`、`eligible = true`
- `clawnet-bridge-dispatch` 为 `origin = workspace`、`status = loaded`

### 2. 收窄 provider 404

先证明这不是“没有 key”或“模型列表里没有模型”：

```bash
cd "/Users/mac/qianzhu Vault/project/clawnet"
KEY="$GEMINI_API_KEY"

OPENCLAW_CONFIG_DIR="$HOME/.openclaw-t030" \
OPENCLAW_WORKSPACE_DIR="$HOME/.openclaw-t030/workspace" \
OPENCLAW_IMAGE="ghcr.io/openclaw/openclaw:latest" \
  docker compose -f openclaw/docker-compose.yml run --rm --no-deps \
  -e GEMINI_API_KEY="$KEY" \
  --entrypoint node openclaw-gateway \
  -e 'fetch("https://generativelanguage.googleapis.com/v1beta/models?key="+encodeURIComponent(process.env.GEMINI_API_KEY||"")).then(async (res)=>{console.log("status="+res.status);console.log(await res.text())})'

OPENCLAW_CONFIG_DIR="$HOME/.openclaw-t030" \
OPENCLAW_WORKSPACE_DIR="$HOME/.openclaw-t030/workspace" \
OPENCLAW_IMAGE="ghcr.io/openclaw/openclaw:latest" \
  docker compose -f openclaw/docker-compose.yml run --rm --no-deps \
  -e GEMINI_API_KEY="$KEY" \
  --entrypoint node openclaw-gateway \
  dist/index.js models list --json

OPENCLAW_CONFIG_DIR="$HOME/.openclaw-t030" \
OPENCLAW_WORKSPACE_DIR="$HOME/.openclaw-t030/workspace" \
OPENCLAW_IMAGE="ghcr.io/openclaw/openclaw:latest" \
  docker compose -f openclaw/docker-compose.yml run --rm --no-deps \
  -e GEMINI_API_KEY="$KEY" \
  --entrypoint node openclaw-gateway \
  dist/index.js agent --local --agent main --message 'reply with ok' --json
```

当前缩小结论：

- 同一把 `GEMINI_API_KEY` 直连 Google `models` 接口返回 `status = 200`
- `models list --json` 能看到 `google/gemini-2.5-flash`、`google/gemini-3-flash-preview` 等模型可用
- 但 `agent --local --agent main --message 'reply with ok' --json` 仍会返回 Google provider `404 Not Found`

这说明 `T031` 当前不该等 provider 路径修好再继续。

### 3. 用真实宿主 slash 命令绕过 provider 404

当前最小绕过固定为：

- `SKILL.md` 使用 `disable-model-invocation: true`
- `command-dispatch: tool`
- `command-tool: clawnet_bridge_dispatch`
- `clawnet-bridge-dispatch` 插件直接执行 workspace 内的 `bridge.sh`
- `bridge.sh` 优先使用 vendored `clawnet-connect.mjs` 与 `agent-card-rhea.json`

复跑命令：

```bash
cd "/Users/mac/qianzhu Vault/project/clawnet"
LAN_IP="$(ipconfig getifaddr "$(route get default | awk '/interface:/{print $2; exit}')")"

OPENCLAW_CONFIG_DIR="$HOME/.openclaw-t030" \
OPENCLAW_WORKSPACE_DIR="$HOME/.openclaw-t030/workspace" \
OPENCLAW_GATEWAY_TOKEN="t030-local-token" \
OPENCLAW_BRIDGE_TRIGGER="gateway-chat" \
CLAWNET_BASE_URL="http://${LAN_IP}:3000" \
CLAWNET_HOST="http://${LAN_IP}:3000" \
  npm run demo:openclaw:bridge
```

通过标准：

- 终端输出 `bridge_trigger=gateway-chat`
- 终端输出 `host_mode = lan`
- 终端输出 `scan_ready = true`
- `/tmp/clawnet-openclaw-bridge-regression/summary.json` 中记录：
  - `bridgeTrigger = "gateway-chat"`
  - `trigger_details.gateway_command = "/clawnet_connect_bridge http://<LAN_IP>:3000"`
  - `trigger_details.gateway_run_id`
- `/tmp/clawnet-openclaw-bridge-regression/connect-desktop.png`
- `/tmp/clawnet-openclaw-bridge-regression/pair-mobile.png`
- `/tmp/clawnet-openclaw-bridge-regression/app-mobile.png`
- `/tmp/clawnet-openclaw-bridge-regression/network-mobile.png`

## 当前禁止事项

- 不把 `localhost` 二维码拿给手机扫
- 不在主工作环境安装未知第三方 skill
- 不把 `ClawHub` 上的随机包当主演示依赖
- 不在第一版就接 webhook 服务
- 不把移动端变成宿主配置入口
- 不把没有 frontmatter 的 `SKILL.md` 当作可识别 skill
- 不把 workspace skill 通过越出 workspace root 的 symlink 暴露给宿主

## 常见卡点

### 1. `docker compose ps` 提示 `OPENCLAW_CONFIG_DIR / OPENCLAW_WORKSPACE_DIR` 为空

原因：

- 没有在 `OpenClaw` 仓库根目录执行命令
- 或 `setup.sh` 没有正常写出 `.env`

最小修复：

- 回到 `OpenClaw` 仓库根目录
- 重新运行 `./scripts/docker/setup.sh`
- 或在当前 shell 显式导出 `OPENCLAW_CONFIG_DIR` 与 `OPENCLAW_WORKSPACE_DIR`

### 2. 网关日志提示 `Missing config` 或 `allowedOrigins`

如果 onboarding 被跳过或中断，当前最小修复命令为：

```bash
docker compose run --rm --no-deps --entrypoint node openclaw-gateway \
  dist/index.js config set gateway.mode local

docker compose run --rm --no-deps --entrypoint node openclaw-gateway \
  dist/index.js config set gateway.bind lan

docker compose run --rm --no-deps --entrypoint node openclaw-gateway \
  dist/index.js config set gateway.controlUi.allowedOrigins \
  '["http://localhost:18789","http://127.0.0.1:18789"]' --strict-json

docker compose restart openclaw-gateway
```

### 3. workspace 里明明有 skill 文件，但 `skills list` 看不到

优先检查：

- `SKILL.md` 是否有 `name / description` frontmatter
- skill 是否真实位于 `<workspace>/skills/<name>/`
- `bridge.sh` 是否仍能定位原始 `ClawNet` 仓库

### 4. gateway 已经 `healthy`，但会话里聊天仍报 `No API key found`

原因：

- `T030` 的最小 onboarding 故意使用了 `--auth-choice skip`
- 这只证明隔离环境、gateway 和 workspace skill loader 成立
- 它不证明 OpenClaw 已经具备模型调用能力

最小结论：

- 这不阻断 `T030`
- 如果你要在真实 OpenClaw 会话里直接让 agent 触发 skill，进入 `T031` 前必须补 provider auth

### 5. `OpenClaw` 已启动，provider auth 也已补，但 `agent --local` 或 `/skill` 仍返回 `404 Not Found`

当前已确认一种上游运行时卡点：

- 同一 `GEMINI_API_KEY` 在宿主外直连 Google API 可返回 `200`
- 但 `OpenClaw` Docker 2026.3.23 内嵌 `agent --local` 走 Google provider 时仍可能返回 `404`

当前最小处理原则：

- 不把这个问题和手机扫码体验绑死
- 先用 `npm run demo:openclaw:bridge` 固定本地验收基线
- 把“真实 `/skill` 触发”单独保留在 `T031`

## T030 完成定义

- `OpenClaw` 已在本机隔离环境中可用
- workspace skill 已被识别
- 模板 bridge 可手工执行
- 当前实验过程有可复跑步骤

## T031 完成定义

- `OpenClaw` 真实触发了一次 `ClawNet connect`
- 当前 pairing 已落到桌面 `/connect`
- 手机能进入 `/pair -> /app`
- 至少保留命令输出、桌面截图、手机截图或录屏摘要

当前备注：

- 上面的严格定义还没通过，原因是 `OpenClaw` 内嵌模型调用路径仍有 `404` 阻塞。
- 但“本地启动 OpenClaw 后，workspace bridge 可产出二维码并把手机带进微博客表面”这条初期验收路径已经可复跑。

## 推荐证据

- OpenClaw 识别 skill 的截图
- bridge 输出的终端摘要
- 桌面 `/connect` 截图
- 手机 `/pair` 截图
- 手机 `/app` 截图
- 手机完成即时动作后的截图

## 当前人工验收路径

这部分专门给创始人或测试做手工验证用。

不要再把下面两条命令当成手工入口：

- `npm run demo:openclaw:bridge`
- `npm run demo:openclaw:lan`

原因：

- 它们是自动回归命令，适合证明链路是否成立
- 会临时起服务、自动截图、跑完后自动退出
- 跑完再去手动开 `connect_url / pair_url`，很容易直接遇到 `ERR_CONNECTION_REFUSED`

### 手工验收的正确顺序

#### 终端 A：常驻起 Web 服务

```bash
cd "/Users/mac/qianzhu Vault/project/clawnet"
npm run dev:lan
```

要求：

- 不要关这个终端
- 确认电脑浏览器能打开 `http://<你的局域网IP>:3000`

#### 终端 B：从 OpenClaw 真实触发 bridge

当前推荐两种方式，优先走 dashboard / Control UI：

1. 启动 `OpenClaw` 的 dashboard 或 Control UI
2. 在真实会话里输入：

```text
/clawnet_connect_bridge http://<你的局域网IP>:3000
```

期望结果：

- 会话返回一段文本
- 文本里包含 `connect_url`、`pair_url`、`host_mode = lan`

如果你只是排障，也可以在 shell 里复跑严格宿主链：

```bash
cd "/Users/mac/qianzhu Vault/project/clawnet"
OPENCLAW_CONFIG_DIR="$HOME/.openclaw-t030" \
OPENCLAW_WORKSPACE_DIR="$HOME/.openclaw-t030/workspace" \
OPENCLAW_GATEWAY_TOKEN="t030-local-token" \
OPENCLAW_BRIDGE_TRIGGER="gateway-chat" \
CLAWNET_BASE_URL="http://<你的局域网IP>:3000" \
CLAWNET_HOST="http://<你的局域网IP>:3000" \
npm run demo:openclaw:bridge
```

注意：

- 这里返回的是聊天文本，不是最终扫码入口
- 不要优先扫终端返回的块图二维码

#### 桌面浏览器：打开 `connect_url`

把 `OpenClaw` 返回的 `connect_url` 复制到桌面浏览器打开。

这里才是当前稳定的扫码入口，因为：

- `/connect` 页面里的二维码是 SVG 真码
- 页面还能同时显示本次 pairing 的 agent 身份和 host 模式

#### 手机：扫码进入 `/pair -> /app`

1. 手机和电脑连同一个 Wi-Fi
2. 扫描桌面 `/connect` 页面里的二维码
3. 进入 `/pair`
4. 再进入 `/app`

通过标准：

- `/pair` 与 `/app` 都保留同一 `OpenClaw` 发起的 agent 身份
- `/app` 首屏同时能看到：
  - `OpenClaw` 接入身份
  - 首条微播客动态

### 当前阶段对“共存”的最小定义

当前还没有做“OpenClaw 与微播客双向实时同步”。

当前阶段最小共存只要求：

- `OpenClaw` 真实参与触发接入
- 桌面 `/connect` 能承接这次 pairing
- 手机能进入微博客形式的 `/app`
- `/app` 首屏明确保留 `source = openclaw` 一类接入身份痕迹

如果你要继续往前推进“真正共存”，下一步应补：

- `/app` 内可见的 `OpenClaw` 会话来源 / 状态
- 至少一个从 `/app` 回送到宿主的动作
