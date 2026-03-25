---
title: 本周 TO DO
status: active
owner: founder
last_updated: 2026-03-25
---

# 本周 TO DO

## 用途

这份文件只回答 4 个问题：

- 这周实际要完成什么？
- 当前先做哪几项？
- 每项怎么检测是否真的完成？
- 现在做到哪一步？

它不是新的 `backlog`，也不替代 `feature spec`。

## 使用规则

- `ID` 只做稳定引用，不代表执行顺序。
- 执行顺序按 `P0 -> P1 -> P2` 推进，不按 `T001 / T002 / T003` 顺序推进。
- 一项任务如果没有 `完成定义` 和 `检测方式`，不准进入 `doing`。
- 一项任务只有在 `检测状态 = passed` 后，才可以改成 `done`。
- 每次检测都要同步写入 `todo-verification-log.md`，不允许只在聊天里说“测过了”。

## 状态字典

- `todo`
- `doing`
- `blocked`
- `done`

## 检测状态字典

- `pending`
- `checking`
- `passed`
- `failed`
- `blocked`

## P0：当前必须完成

| ID | P级 | 事项 | 类型 | 完成定义 | 检测方式 | 检测状态 | 状态 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T026 | P0 | 打通真机扫码的“这是我的 agent 连进来了” aha 时刻 | build | 当前 CLI 生成的 pairing 状态可以回到桌面 `/connect` 被真实还原；手机可通过局域网或公网 host 真扫进入 `/pair -> /app`；`/pair` 与 `/app` 都展示这次真实接入的 agent 身份，并给出一次立即可完成的成功动作 | 用一张非默认 `agent-card.json` 在真机模式下执行命令，检查桌面 `/connect` 的二维码是否来自本次 pairing，手机扫码后是否在 `/pair`、`/app` 看到同一 agent 名称 / 来源，并记录整条链路截图或视频 | passed | done |
| T027 | P0 | 冻结接入成功后的微播客存在感与移动 Web 首屏 UI 优化清单 | product | 明确 `/app` 在 agent 已接入后第一屏必须出现什么、哪些演示感元素应降级、即时动作该放哪里，以及微播客流与已接入状态如何共存；冻结一版最小 UI 改动清单 | 产品窗口基于 `T026` 已跑通的接入结果，产出 3-5 条明确 UI 调整项、保留项和不做项，主管拍板后进入实现 | pending | doing |
| T028 | P0 | 实现并验证接入成功后的微播客 UI 第一轮收口 | build | `/app` 首屏在 agent 已接入时更像真实微播客产品，而不是 demo 页面；已接入状态、即时动作和信息流层级清晰，桌面与手机视口都可用 | 研发按 `T027` 冻结结果实现后，执行 `npm run lint`、`npm run build`，再由 QA 在桌面、`iPhone 13` 和真机接入模式下复核首屏层级与关键动作 | pending | todo |
| T015 | P0 | 冻结 connect CLI 的最小参数、输出格式与默认命令写法 | doc | `F010`、本地 demo 执行文档、`/connect` 页面统一使用同一条命令和同一组输出字段 | 对照 `F010-agent-connect.md`、`local-cli-demo-execution.md`、`src/app/connect/page.tsx` 三处是否一致 | passed | done |
| T019 | P0 | 冻结 demo mode 的最小输入字段与 URL 编码结构 | doc | 文档里明确只使用 `agent_id / name / avatar / bio / capabilities / source` 与 URL 编码或 mock payload | 检查 `F010`、本地 demo 执行文档、未决问题与决策日志是否一致 | passed | done |
| T018 | P0 | 实现本地 `connect CLI demo mode`，让任意本地 `Node.js / claw` 目录里都能执行命令并输出二维码 | build | 在一个独立本地样例目录里运行命令后，终端能拿到 `code / URL / QR` | 在本地样例目录真实运行 CLI，并记录输出结果 | passed | done |
| T020 | P0 | 打通 `CLI -> /pair/:code -> /app` 的 mock 数据承接 | build | CLI 输出的 mock payload 能被 `/pair/:code` 或其配套链接读到，进入 `/app` 后可以看到对应 agent 身份与状态 | 用 CLI 生成的链接跑一遍浏览器链路，并在手机视口检查 `/pair` 与 `/app` 展示 | passed | done |
| T003 | P0 | 完成移动 Web 表面的首版内容，以 `Elys-like` 首屏信息流为主，并固定底部功能栏为“动态 / 战报 / 基站 / 记忆 / 分身” | build | 首页先呈现信息流，底部 5 个入口完整可点，中间 `基站` 主按钮明显 | 在移动视口手测 `/app` 与 5 个入口页面，并截图或记录问题 | passed | done |
| T017 | P0 | 准备一个 `OpenClaw / Node.js` 接入样例与本机演示脚本 | doc | 存在一份最小样例目录和一条本机演示脚本，能跑一次 `命令 -> 扫码 -> 进入 app` | 检查样例目录、脚本文档存在，并按脚本走一遍 | passed | done |
| T006 | P0 | 做一轮最小手测并记录问题 | test | 至少覆盖桌面端、手机端、二维码跳转、页面可达性，并写入检测日志 | 按 `todo-verification-log.md` 逐项记录结果与问题 | passed | done |
| T021 | P0 | 将根路由切回商业化官网，并把公开预览保留到单独路径 | build | `/` 进入商业化官网叙事页，但首页必须直接暴露 `/preview`、`/connect`、`/app` 三个试玩入口；原公开预览仍可访问 | 构建后检查 `/`、`/preview`、`/connect`、`/app` 四条路径都可访问，并验证首页试玩 CTA 完整 | passed | done |
| T022 | P0 | 实现帖子详情页最小闭环，支持 `@agent`、待确认建议和任务草案 | build | `/posts/:id` 可区分原帖、线程、agent 建议和控制动作；用户可以在页面内完成批准 / 编辑 / 拒绝 | 构建后通过浏览器点击一次 `@agent`、编辑后发送和任务草案动作 | passed | done |
| T023 | P0 | 实现三问式 agent 创建流和公开 agent 主页 | build | `/agents/new` 可完成最小创建，并进入 `/agents/:id` 看到公开摘要、边界和参与记录 | 构建后用浏览器完成创建并跳转到 agent 主页 | passed | done |
| T024 | P0 | 跑通 `首页 -> 帖子详情 -> 创建 agent -> agent 主页` 的 MVP 验证路径 | test | 存在一条可重复试玩的闭环路径，且桌面与手机视口都可完成关键动作 | 用 Playwright 实际点击一遍并输出截图 | passed | done |
| T025 | P0 | 把首页 `#modes` 改成真实前门分发层，并明确 `/pair/:code` 只作内部第二步 | build | 首页 `#modes` 三张卡片都能直接进入 `/preview`、`/connect`、`/network`；首页与 `connect/pair` 文案都明确 `/pair/:code` 不是公网首链 | 执行 `npm run lint`、`npm run build`，再用 Playwright 在桌面首页点击三张模式 CTA，并检查 `/connect` 与 `/pair/:code` 的定位文案 | passed | done |

## P1：支撑展示

| ID | P级 | 事项 | 类型 | 完成定义 | 检测方式 | 检测状态 | 状态 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T007 | P1 | 把冻结后的默认命令同步到 `/connect` 页面、功能规格和 Demo 文案 | doc | 页面、规格、脚本都使用同一条命令，不再摇摆 | 检查三处文案是否完全一致 | passed | done |
| T005 | P1 | 用 mock 数据串起完整 Demo 剧本并走通一遍 | demo | 可以按“首页 -> connect/CLI -> 扫码 -> app -> 基站操作 -> network”完整演一遍 | 运行 `npm run demo:regression`，或按演示脚本手走一遍并记录卡点 | passed | done |
| T004 | P1 | 完成 `/network` 的 network layer 演示页，并支持一次 mock 的“加入 / 创建基站”动作 | build | 能讲清楚网络层，不只是单一 App；并能完成一次加入或创建基站 | 执行 `npm run lint`、`npm run build`，再用 Playwright 在 `iPhone 13` 与桌面视口检查 `/app/station/* -> /network` 的状态变化与截图证据 | passed | done |

## P2：后置与阻塞

| ID | P级 | 事项 | 类型 | 完成定义 | 检测方式 | 检测状态 | 状态 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T016 | P2 | 决定 connect 包的发布方式与 pairing session 方案 | doc | 明确第一版是 `npm 公网 / GitHub 包 / 本地包` 哪一种，以及 pairing session 是 `URL 编码 / 轻服务` 哪一种 | 在 local CLI demo 跑通后，再统一做一次方案决策检查 | blocked | blocked |

## 已完成基础

| ID | 事项 | 状态 |
| --- | --- | --- |
| T001 | `/connect` 页面骨架、命令展示与二维码视觉已落地 | done |
| T002 | `/pair/:code` 与 `/app` 的页面骨架已落地 | done |
| T008 | `基站` 入口固定为底部中间主按钮 | done |
| T009 | 可交付设计 agent 的 Web App 单文档设计交付件已完成 | done |
| T010 | `stitch` 已拆成统一移动 Web 路由骨架 | done |
| T011 | 共享移动组件与主题变量已抽出 | done |
| T012 | `分身` 页面与底部 5 个入口已接通 | done |
| T013 | `/pair/:code` 页面已建好 | done |
| T014 | `/connect` 命令使用页与复制流程已建好 | done |
