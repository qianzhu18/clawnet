---
title: OpenClaw 本机隔离接入 SDD
status: active
owner: founder
last_updated: 2026-03-25
---

# OpenClaw 本机隔离接入 SDD

## 目标

把当前已经跑通的 `ClawNet demo CLI -> /connect -> /pair -> /app` 链路，升级为第一条真实宿主链路：

- 宿主固定为 `OpenClaw`
- 电脑端负责安装、配置和触发
- 手机端只负责扫码和体验
- 当前阶段不引入正式 webhook 服务和多宿主兼容层

## 当前阶段结论

- 第一真实宿主固定为 `OpenClaw`
- 第一版安装方式固定为 `workspace skill`
- 第一版 bridge 固定为本地 CLI bridge
- 第一版环境固定为本机隔离测试环境
- 当前阶段不从 `ClawHub` 直接安装第三方 skill 作为主演示依赖

## 非目标

- 公开发布到 `ClawHub`
- 同时兼容多个 claw 型宿主
- 用 webhook 替代本地 bridge
- 生产级鉴权、配额、签名和 session 服务
- 企业权限、多租户、后台控制台

## 环境边界

### 桌面端负责什么

- 安装并启动 `OpenClaw`
- 安装 `ClawNet` 的本地 skill / bridge
- 发起一次真实宿主调用
- 打开 `connect_url`
- 确认本次 pairing 与二维码一致

### 移动端负责什么

- 扫描本次 pairing 的二维码
- 完成 `/pair -> /app`
- 看到同一 agent 身份与成功动作

### 当前明确不让移动端承担什么

- 安装宿主
- 管理 skill
- 填写宿主配置
- 处理 webhook / endpoint / token

## 隔离环境设计

当前采用“轻隔离优先”的本机测试方案：

1. 单独的测试目录
   - 例如 `~/clawnet-openclaw-lab/`
   - 只放 `OpenClaw` 相关实验文件、样例 skill 和截图证据
2. 单独的 workspace skill
   - 只在当前实验 workspace 中可见
   - 不改公共技能市场和公开安装入口
3. 禁止引入未知第三方 skill
   - 当前只安装自己可审阅的 `ClawNet` bridge
4. 禁止绑定真实生产凭据
   - 不接公司数据
   - 不接真实 webhook 密钥
   - 不接个人主账号工作流

如果后续需要更强隔离，再升级到“单独 macOS 用户”或虚拟机；当前 `T030/T031` 不把这一步作为前置门槛。

## 安装策略

当前采用 `workspace skill first`，理由如下：

- 污染面最小，回滚最简单
- 更符合本阶段“先验证桌面配置，再验证移动体验”
- 更适合快速迭代本地 skill
- 不需要先依赖 `~/.openclaw/skills` 或公开分发

当前不采用 `ClawHub-first`，原因如下：

- 当前目标是先证明真实宿主链路，不是先证明公共分发
- 公开市场安装会引入额外信任面和安全面
- 现在还没有稳定的对外安装口径

## Bridge 架构

### 当前选型

第一版 bridge 采用“OpenClaw skill shell-out 到本地 CLI”的方式。

### 调用顺序

1. 用户在 `OpenClaw` 里触发 `ClawNet connect`
2. `OpenClaw` skill 调用本地 `clawnet-connect` 或等价脚本
3. 本地 CLI 输出：
   - `code`
   - `pair_url`
   - `connect_url`
   - `host_mode`
   - `scan_ready`
   - `agent_preview`
4. 桌面浏览器打开 `connect_url`
5. 手机扫码进入 `pair_url`
6. 用户继续完成 `/pair -> /app`

### 为什么先不用 webhook

- 当前目标是先证明“真实宿主可触发 + 桌面配置成立 + 手机体验连续”
- webhook 会引入服务端可用性、鉴权和回调安全，超出本阶段最小范围
- 本地 CLI bridge 更贴近现有 `T026` 已验证链路

## 与现有代码的接口约束

第一版真实宿主接入必须复用现有字段语义：

- `connect_url`
- `pair_url`
- `host_mode`
- `scan_ready`
- `agent_preview`

不允许因为换宿主而再发明第二套桌面承接协议。

## TDD 落地方式

当前阶段不做“大而全测试”，只对真实宿主最小链路采用 test-first：

### L1：单元 / 集成

- `host_mode` 判断
- `connect_url` 生成与还原
- `pair_url` 与二维码内容一致性
- `scan_ready` 与 host 的关系

### L2：宿主接入集成

- skill 触发本地 bridge 后，是否真实输出当前 pairing
- 桌面 `/connect` 是否展示本次 pairing，而不是静态样例

### L3：E2E

- `OpenClaw -> bridge -> /connect -> /pair -> /app`

## 目录与文件

- 功能规格：`doc/03_execution/feature-specs/F011-openclaw-host-bridge.md`
- 本机测试 runbook：`doc/03_execution/openclaw-local-test-runbook.md`
- 周任务：`doc/05_todo/todo-list.md`
- 检测日志：`doc/05_todo/todo-verification-log.md`

## Ready for Build 定义

`T030` 进入实现前，必须同时满足：

- `F011` 已冻结
- 本 SDD 已冻结
- runbook 已写出最小可复跑步骤
- `workspace skill` 与 `CLI bridge` 两个决策不再摇摆

`T031` 进入实现前，必须同时满足：

- `T030` 已证明本机隔离环境成立
- 已明确 skill 如何调用本地 bridge
- 已明确桌面和移动端各自的边界
