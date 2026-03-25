---
title: OpenClaw 宿主接入 TDD 计划
status: active
owner: founder
last_updated: 2026-03-25
---

# OpenClaw 宿主接入 TDD 计划

## 目标

把 `T030 / T031` 从“先手工装起来再看”改成“先定义失败条件，再做最小实现”。

## 当前测试分层

### L1：参数与输出层

先验证最小 bridge 输出事实：

- `localhost` 必须得到 `host_mode = local`
- 局域网 host 必须得到 `host_mode = lan`
- `local` 下必须 `scan_ready = false`
- `lan / public` 下必须 `scan_ready = true`
- 输出中必须保留：
  - `code`
  - `connect_url`
  - `pair_url`
  - `host_mode`
  - `scan_ready`
  - `agent_preview`

### L2：bridge 包装层

再验证 `OpenClaw` skill 到本地 bridge 的最小包装是否正确：

- 包装脚本是否把 `CLAWNET_HOST` 透传给底层 CLI
- 包装脚本是否把 `CLAWNET_CARD` 透传给底层 CLI
- 非默认 card 是否会一路还原到桌面 `/connect`

### L3：最小 E2E

最后验证一条真实宿主路径：

- `OpenClaw` 触发 skill
- bridge 产出 `connect_url`
- 桌面 `/connect` 展示本次 pairing
- `/pair -> /app` 保持同一 agent 身份

## 第一轮 Red-Green-Refactor 顺序

### Loop 1

先写失败验证：

- `localhost` 仍被错误标记为可扫码

最小实现目标：

- `host_mode / scan_ready` 判断稳定

### Loop 2

先写失败验证：

- `OpenClaw` 包装脚本没有把 `CLAWNET_HOST` 或 `CLAWNET_CARD` 传给底层 CLI

最小实现目标：

- bridge 包装脚本能稳定透传参数

### Loop 3

先写失败验证：

- 非默认 `agent-card.json` 不能从 bridge 一路还原到 `/connect`

最小实现目标：

- 桌面页展示真实 pairing，而不是静态样例

### Loop 4

先写失败验证：

- 宿主触发后，`/pair -> /app` 仍然丢失身份

最小实现目标：

- 移动端保持身份连续性

## 当前测试工具选择

当前先不引入第二套重型测试框架。

第一版固定为：

- 参数 / 输出层：
  - 最小 Node 断言脚本或现有脚本回归
- 页面与移动链路：
  - 继续使用现有 Playwright 路径验证

只有当宿主桥接测试数量明显增加，才再决定是否补更完整的单测框架。

## 第一批必须补的测试

1. `host_mode` 判断测试
2. `scan_ready` 判断测试
3. `connect_url / pair_url` 生成与还原测试
4. `OpenClaw` bridge 包装脚本参数透传测试
5. `connect_url -> /connect -> /pair -> /app` 最小回归

## 当前不做的测试

- 多宿主兼容矩阵
- 公开 `ClawHub` 安装测试
- webhook 服务端回调测试
- 生产环境压测

## 通过标准

只有以下条件同时满足，才算 `T031` 可以进入实现后验证：

- 至少一条参数层测试先失败再修通过
- 至少一条页面链路测试覆盖真实宿主输出
- 测试结论已写回 `todo-verification-log.md`
