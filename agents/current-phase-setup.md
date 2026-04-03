---
title: 当前阶段多窗口执行方案
status: active
owner: founder
last_updated: 2026-03-26
---

# 当前阶段多窗口执行方案

## 当前判断

当前阶段已经不是“证明二维码链路存在”，而是：

1. 保持 `OpenClaw -> bridge -> /connect -> /pair -> /app -> /network` 这条本地同网验收基线稳定可复跑
2. 单独追 `OpenClaw` 严格宿主动作链的上游 `404` 阻塞
3. 在已通过的接入链路上开始收口“接入成功后的微播客 UI”

当前最重要的事实：

- `T030` 已通过：本机隔离 `OpenClaw` 环境和 `workspace skill` 识别成立
- `T031` 仍是 `blocked`：严格的 `OpenClaw` 会话内 `/skill` 触发还被上游 provider `404` 卡住
- `T032` 已通过：仓库根目录已固定 `npm run demo:openclaw:lan` 作为当前同网验收的一键入口

所以当前阶段必须拆成两条并行线，而不是继续让一个研发在一个分支里混做所有事。

## 当前推荐激活的窗口

### 必开

1. `项目主管`
2. `研发A`
3. `研发B`
4. `测试`

### 按需再开

5. `产品经理`

## 当前阶段的主从关系

- `项目主管`
  - 唯一总控
  - 负责决定当前唯一目标、分支归属和是否通过
- `研发A`
  - 只盯严格宿主链
  - 目标是缩小或绕开 `OpenClaw` provider `404`
- `研发B`
  - 只盯已通过基线上的 Web 承接与微播客 UI
  - 目标是在不破坏二维码链路的前提下推进 `T027 / T028`
- `测试`
  - 分别复核 A、B 两条线
  - 不代替研发补实现
- `产品经理`
  - 只在 `T027` 未冻结或 UI 方向摇摆时介入

## 两条研发线的写入边界

### 研发A：严格宿主链 / 运行时排障线

目标：

- 保留当前 `T031 blocked` 的真相
- 只研究“如何让 `OpenClaw` 会话或 UI 真正触发 `clawnet_connect_bridge`”
- 不改微播客 UI

建议分支：

- `spike/openclaw-provider-404`

建议写入范围：

- `examples/openclaw-skill/*`
- `scripts/verify-openclaw-bridge-flow.mjs`
- `doc/03_execution/openclaw-local-test-runbook.md`
- `doc/05_todo/*`
- 必要时少量 `packages/connect/*`

不要改：

- `src/app/app/*`
- 微播客首屏布局
- 泛产品文案

### 研发B：微播客 UI 主线

目标：

- 基于已通过的二维码接入基线，推进 `T027 / T028`
- 强化“已接入 agent”的存在感
- 不改坏 `demo:openclaw:lan`

建议分支：

- `feat/t028-connected-microblog-ui`

建议写入范围：

- `src/app/app/*`
- `src/app/connect/*`
- `src/app/pair/*`
- `src/lib/connect-demo.ts`
- `doc/02_product/ui-decomposition.md`
- `doc/02_product/mobile-web-design-brief.md`
- `doc/05_todo/*`

不要改：

- `examples/openclaw-skill/*`
- `OpenClaw` 安装 / onboarding 路径
- 宿主 Docker / provider 调试脚本

## 当前推荐推进顺序

1. `项目主管` 先固定当前唯一主线
2. `研发A` 与 `研发B` 并行，但必须分支隔离
3. `测试` 先验证 `研发A` 的严格宿主证据，再验证 `研发B` 的 UI 收口
4. `项目主管` 回收结果，决定：
   - `T031` 是否继续 blocked
   - `T027 / T028` 是否进入实现或通过

## 当前阶段建议的唯一目标写法

推荐主管窗口始终用这种句式发任务：

> 当前唯一目标是：保持 `OpenClaw` 同网二维码接入基线稳定可复跑，同时把严格宿主触发问题和微播客 UI 收口拆成两条并行线，不互相污染。

## 当前阶段暂时不要做的事

- 不把 `T031 blocked` 假装改成 `done`
- 不把正式后端建表塞回当前主线
- 不把 webhook、ClawHub、第二宿主一起拉进来
- 不让 `研发A` 和 `研发B` 同时修改同一批页面文件
- 不让测试窗口替研发补实现
