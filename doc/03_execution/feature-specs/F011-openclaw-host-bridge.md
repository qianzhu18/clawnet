---
title: F011 OpenClaw-first 真实宿主接入
status: active
owner: founder
last_updated: 2026-03-25
---

# F011 OpenClaw-first 真实宿主接入

## 目标

把 `ClawNet` 从“本地 demo CLI + 网页承接”推进到“真实 claw 宿主 + 电脑端配置 + 移动端体验”。

第一真实宿主先固定为 `OpenClaw`，但 bridge 层仍需保持未来可迁移到其他 claw 型产品。

## 用户故事

作为一个已经在电脑端使用 `OpenClaw` 的用户，我希望在本机隔离环境中安装 `ClawNet` 对应的 skill 或 bridge，完成一次真实的桌面端配置，然后把体验交给移动端继续使用，而不需要在手机上处理任何复杂配置。

## 范围

包含：

- `OpenClaw-first` 作为第一真实宿主
- 本机隔离测试环境
- `workspace skill` 或等价的本地宿主扩展方式
- 宿主侧触发 `ClawNet connect bridge`
- 生成 `connect_url / pair_url / host_mode / scan_ready`
- 桌面端配置与承接
- 移动端 `/pair -> /app` 体验连续性
- 最小 TDD 与最小 SDD 归档

不包含：

- 公开 `ClawHub` 正式发布
- 同时适配多个 claw 宿主
- 完整 webhook 鉴权体系
- 正式生产级后端 session 服务
- 后台控制台、企业权限体系、多租户

## 验收标准

- 存在一套可复跑的本机隔离 `OpenClaw` 测试环境。
- `ClawNet` 可以作为 `OpenClaw` 的本地 skill / bridge 被调用。
- 电脑端能完成最小配置，不要求移动端参与配置。
- 宿主侧调用后，能拿到 `connect_url / pair_url / host_mode / scan_ready`。
- 用户可以从商业化网页或 `/connect` 承接这次 pairing。
- 移动端可以继续完成 `/pair -> /app`，并保留真实宿主发起的身份连续性。
- 对 `host_mode`、参数还原、扫码可用性和关键链路至少有一层自动化测试。

## 当前落地策略

- 第一真实宿主采用 `OpenClaw-first`。
- 第一版安装方式固定为 `workspace skill`，避免一开始就依赖全局 `~/.openclaw/skills` 或公开技能市场。
- 第一版触发方式固定为本地 CLI bridge，优先复用当前 `clawnet-connect` 生成的 `connect_url / pair_url` 语义，不重新发明第二套承接协议。
- 当前阶段仍坚持“桌面端负责配置、移动端只负责体验”。
- 进入实现前，必须同时具备：
  - SDD：`doc/03_execution/openclaw-local-host-sdd.md`
  - Runbook：`doc/03_execution/openclaw-local-test-runbook.md`

## 安全约束

- 真实宿主测试必须在本机隔离环境中进行。
- 第三方 skills 视为不可信代码；未审阅前，不进入主工作环境。
- 当前阶段不把随机 `ClawHub` 包直接作为主演示依赖。
- 如需额外权限、环境变量或外部 webhook，先进入 SDD 再进入实现。

## TDD 要求

- 单元 / 集成层：
  - `host_mode` 判断
  - `connect_url` 与 `pair_url` 参数生成和还原
  - `scan_ready` 与 host 关系
- E2E 层：
  - 宿主触发 bridge
  - 桌面端承接
  - `/pair -> /app`

## SDD 要求

进入实现前，必须明确：

- 隔离环境方式
- `OpenClaw` 安装方式
- skill 放置路径
- 触发方式是 `workspace skill`、命令转发还是 webhook
- 电脑端配置与移动端体验的边界

## 依赖项

- 当前 `T026` 真机扫码 demo 已通过
- 商业化网页与 `/connect` 已存在可承接入口
- 当前 CLI 输出字段已冻结
- `OpenClaw` 本机隔离环境与 runbook 已建立

## 未决问题

- 第二真实宿主应该是谁，以及什么时候开始做。
