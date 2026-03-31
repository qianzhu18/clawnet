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

当前不再把“单独目录”视为充分隔离。

当前推荐顺序固定为：

1. 单独的 macOS 测试账户
   - 例如 `clawnet-lab`
   - 只在这个账户里安装和运行 `OpenClaw`
2. 单独的测试目录
   - 例如 `~/clawnet-openclaw-lab/`
   - 只放 `OpenClaw` 相关实验文件、样例 skill 和截图证据
3. 单独的 lab clone
   - 在隔离账户里单独 clone 一份 `ClawNet`
   - 不直接复用主工作账户下的开发目录
4. 单独的 workspace skill
   - 只在当前实验 workspace 中可见
   - 不改公共技能市场和公开安装入口
5. 禁止引入未知第三方 skill
   - 当前只安装自己可审阅的 `ClawNet` bridge
6. 禁止绑定真实生产凭据
   - 不接公司数据
   - 不接真实 webhook 密钥
   - 不接个人主账号工作流

原因：

- `OpenClaw` 默认配置位于 `~/.openclaw/` 下
- 只隔离目录，不足以把宿主配置和主工作账户切开

如果后续需要更强隔离，再升级到虚拟机；当前 `T030/T031` 先以“单独 macOS 测试账户”作为最小安全边界。

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

补充约束：

- `examples/openclaw-skill/clawnet-connect-bridge/` 只是模板源目录，不会自动被宿主识别。
- 要让宿主识别，必须把它实体化到 `~/.openclaw/workspace/skills/clawnet-connect-bridge/` 或等价 workspace 根下。
- `SKILL.md` 必须带最小 YAML frontmatter，至少包含 `name` 和 `description`；没有 frontmatter 时，OpenClaw 的 skill loader 不会把它计入可见 workspace skills。
- 第一版不要把 workspace skill 通过 symlink 指到 workspace 外部；优先复制真实文件到 workspace 内，避免被 workspace root 边界检查跳过。

## Bridge 架构

### 当前选型

第一版 bridge 采用“OpenClaw skill shell-out 到本地 CLI”的方式。

补充约束：

- 被复制进 workspace 后的 `bridge.sh` 不能再假设自己与 `ClawNet` 仓库保持原始相对路径。
- 第一版通过 `install-workspace-skill.sh` 在目标 skill 目录里写入 `.clawnet-repo-root` 标记文件，让 `bridge.sh` 仍能定位原始 `ClawNet` 仓库。
- 如需显式覆盖，仍允许用 `CLAWNET_REPO_ROOT` 环境变量指定仓库路径。

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

### 当前验收分层

当前把真实宿主阶段拆成两层验收，不再混成一个结论：

1. 本地可验收基线
   - `OpenClaw` 已在隔离环境中启动
   - workspace skill 已安装
   - 直接执行 workspace 内 `bridge.sh`，能产出当前 pairing
   - 桌面 `/connect` 与手机 `/pair -> /app -> /network` 可复跑
2. 严格宿主动作链
   - 由 `OpenClaw` 内部动作或 `/skill` 真正触发 bridge
   - 当前仍保留为 `T031` 的关闭条件

这样拆分的原因不是放宽标准，而是避免被宿主上游运行时问题误判成“手机体验本身还没成立”。

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

- 功能规格：`doc/04详细设计/功能规格/F011-OpenClaw宿主桥接.md`
- TDD 计划：`doc/04详细设计/OpenClaw宿主测试计划.md`
- 本机测试 runbook：`doc/06测试/OpenClaw本地测试手册.md`
- 周任务：`doc/07迭代/本周待办.md`
- 检测日志：`doc/06测试/验证日志.md`

## Ready for Build 定义

`T030` 进入实现前，必须同时满足：

- `F011` 已冻结
- 本 SDD 已冻结
- TDD 计划已存在
- runbook 已写出最小可复跑步骤
- `workspace skill` 与 `CLI bridge` 两个决策不再摇摆

`T031` 进入实现前，必须同时满足：

- `T030` 已证明本机隔离环境成立
- 已明确 skill 如何调用本地 bridge
- 已明确桌面和移动端各自的边界
