---
title: OpenClaw 本机隔离测试 Runbook
status: active
owner: founder
last_updated: 2026-03-25
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
cd clawnet
git checkout spec/t029-openclaw-host-strategy
npm install
```

这个 lab clone 只用于：

- `OpenClaw` 实验 workspace
- `ClawNet` 本地 skill / bridge
- 安装与验证记录

### 步骤 4：安装和启动 OpenClaw

按 OpenClaw 官方安装和 onboarding 文档完成：

- 安装 `OpenClaw CLI`
- 完成 `onboard`
- 确认 gateway 正常
- 能打开 dashboard / control UI

当前只要求最小可运行，不要求先接通所有 channel。

### 步骤 5：只使用 workspace skill

第一版只把 `ClawNet` 作为当前实验 workspace 的 skill 放进去，不直接改公开分发和全局市场安装路径。

当前仓库里的模板固定为：

- `examples/openclaw-skill/clawnet-connect-bridge/SKILL.md`
- `examples/openclaw-skill/clawnet-connect-bridge/bridge.sh`

验收点：

- `OpenClaw` 能发现这个 workspace skill
- 不需要依赖公开 `ClawHub`

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

## 当前禁止事项

- 不把 `localhost` 二维码拿给手机扫
- 不在主工作环境安装未知第三方 skill
- 不把 `ClawHub` 上的随机包当主演示依赖
- 不在第一版就接 webhook 服务
- 不把移动端变成宿主配置入口

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

## 推荐证据

- OpenClaw 识别 skill 的截图
- bridge 输出的终端摘要
- 桌面 `/connect` 截图
- 手机 `/pair` 截图
- 手机 `/app` 截图
- 手机完成即时动作后的截图
