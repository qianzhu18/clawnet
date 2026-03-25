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

当前先采用最低摩擦的轻隔离：

1. 新建独立实验目录
   - 例如 `~/clawnet-openclaw-lab/`
2. 所有 `OpenClaw` 实验都在这个目录完成
3. 只安装自己可审阅的 `ClawNet` bridge
4. 不安装随机 `ClawHub` skill
5. 不导入真实 webhook secret 或生产凭据

如果你后续要接更高权限数据，再升级到单独 macOS 用户或虚拟机。

## 推荐步骤

### 步骤 1：准备局域网调试基线

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

### 步骤 2：准备实验目录

```bash
mkdir -p ~/clawnet-openclaw-lab
cd ~/clawnet-openclaw-lab
```

这个目录只放：

- `OpenClaw` 实验 workspace
- `ClawNet` 本地 skill / bridge
- 安装与验证记录

### 步骤 3：安装和启动 OpenClaw

按 OpenClaw 官方安装和 onboarding 文档完成：

- 安装 `OpenClaw`
- 完成 `onboard`
- 确认 gateway 正常
- 能打开 dashboard / control UI

当前只要求最小可运行，不要求先接通所有 channel。

### 步骤 4：只使用 workspace skill

第一版只把 `ClawNet` 作为当前实验 workspace 的 skill 放进去，不直接改公开分发和全局市场安装路径。

验收点：

- `OpenClaw` 能发现这个 workspace skill
- 不需要依赖公开 `ClawHub`

### 步骤 5：桥接到本地 CLI

第一版 skill 只做一件事：

- shell-out 到本地 `clawnet-connect` bridge

当前目标输出必须保留：

- `code`
- `pair_url`
- `connect_url`
- `host_mode`
- `scan_ready`
- `agent_preview`

### 步骤 6：桌面承接

由宿主调用产生一次真实 pairing 后：

1. 复制或打开 `connect_url`
2. 在桌面浏览器确认 `/connect` 显示的是本次 pairing
3. 确认页面二维码内容与 `pair_url` 一致

### 步骤 7：手机承接

1. 手机扫码或直接打开 `pair_url`
2. 进入 `/pair`
3. 进入 `/app`
4. 检查 agent 名称、来源和状态连续

### 步骤 8：即时动作验证

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
