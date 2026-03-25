---
title: TO DO 检测日志
status: active
owner: founder
last_updated: 2026-03-25
---

# TO DO 检测日志

## 用途

这份文件只负责一件事：

- 记录每个 `TO DO` 是怎么被检查、检查结果是什么、下一步怎么处理

## 使用规则

- `todo-list.md` 中任何任务要从 `doing / todo` 变成 `done`，都必须先在这里留下检测记录。
- 检测记录不写空话，必须写清：
  - 检查了什么
  - 怎么检查的
  - 结果如何
  - 下一步是什么
- 如果失败，不删除记录，继续追加下一次检测。

## 检测状态字典

- `passed`
- `failed`
- `blocked`
- `pending`

## 当前检测队列

| 日期 | 任务 ID | P级 | 检查目标 | 检测方式 | 结果 | 证据 / 备注 | 下一步 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-03-24 | T015 | P0 | 命令格式与输出字段是否统一 | 对照 `F010`、`local-cli-demo-execution.md`、`/connect` 页面 | pending | 尚未冻结唯一命令写法 | 先定默认命令 |
| 2026-03-24 | T019 | P0 | demo mode 字段与 URL 编码结构是否统一 | 对照规格、决策、未决问题 | pending | 字段已初步收口，但 URL payload 结构未落代码 | 先给出最终 payload 形态 |
| 2026-03-24 | T018 | P0 | 本地 CLI 是否能真实输出 `code / URL / QR` | 在本地样例目录运行命令 | pending | CLI 尚未实现 | 开始实现本地 CLI |
| 2026-03-24 | T020 | P0 | CLI 生成的链接是否能驱动 `/pair -> /app` | 用 CLI 输出链接跑一遍浏览器和移动视口 | pending | 依赖 T018 完成 | 等 CLI 可输出 payload 后联调 |
| 2026-03-24 | T003 | P0 | 移动 Web 首屏与底部 5 个入口是否满足展示要求 | 在移动视口手测 `/app` 与各入口 | pending | 页面已存在，尚未做本轮展示验收 | 联调后统一手测 |
| 2026-03-24 | T017 | P0 | 本机样例和演示脚本是否可直接复跑 | 检查样例目录与脚本文档，并走一遍 | pending | 尚未准备独立样例目录 | 在 CLI 实现后补样例 |
| 2026-03-24 | T006 | P0 | 当前主链路是否能完整演示 | 按脚本跑全链路并记录问题 | pending | 依赖前面 P0 项 | 放在联调末尾执行 |
| 2026-03-24 | T015 | P0 | 命令格式与输出字段是否统一 | 对照 `F010`、`local-cli-demo-execution.md`、`/connect` 页面 | passed | 三处已统一为 `npx clawnet-connect pair --card ./agent-card.json --host http://localhost:3000`，输出字段统一为 `code / pair_url / qr_payload / agent_preview` | 进入 CLI 实装 |
| 2026-03-24 | T019 | P0 | demo mode 字段与 URL 编码结构是否统一 | 对照规格、决策、未决问题与共享 helper | passed | `agent_id / name / avatar / bio / capabilities / source` 已冻结；`pair_url` 固定为 `/pair/<code>?payload=<base64url-json>` | 用这套结构联调 `/pair -> /app` |
| 2026-03-24 | T017 | P0 | 本机样例和演示脚本是否可直接复跑 | 检查样例目录、脚本文档，并执行 `npm install --no-package-lock` 与 `./run-demo.sh` | passed | 已新增 `examples/local-claw-agent/`、`agent-card.json`、`run-demo.sh`；样例目录可直接复跑 | 继续验证 CLI 输出与网页承接 |
| 2026-03-24 | T018 | P0 | 本地 CLI 是否能真实输出 `code / URL / QR` | 在样例目录执行 `./run-demo.sh` 与 `npm run connect` | passed | 两种命令都输出 `CLAW-1R8CIQ`、`pair_url`、`qr_payload`、`agent_preview` 与终端二维码 | 进入 `/pair -> /app` 联调 |
| 2026-03-24 | T020 | P0 | CLI 生成的链接是否能驱动 `/pair -> /app` | `npm run build`、`npm run start` 后用 CLI 输出的 `pair_url` 与 `/app?payload=...` 做 `curl` 检查 | passed | `/pair` 页能显示 `Agent Aster / local-openclaw / ready_for_mobile`，`/app` 和 `/app/avatar` 能显示接入身份与能力标签；底部导航保留 payload | 剩余真实浏览器与手机视口手测并入 `T006` |
| 2026-03-24 | T003 | P0 | 移动 Web 首屏与底部 5 个入口是否满足展示要求 | `npm run build` 检查路由，再用本地 server 请求 `/app`、`/app/avatar` 等页面 | checking | `/app`、`/app/avatar`、`/app/memory`、`/app/reports`、`/app/station` 路由均可构建，且接入 payload 能在底部导航中延续；尚未做真实移动视口截图 | 下一步做浏览器级手测 |
| 2026-03-24 | T006 | P0 | 当前主链路是否能完整演示 | 执行 `npm run lint`、`npm run build`、样例 CLI、`curl` 本地 server 页面 | checking | 代码构建和路由承接已通过，CLI 演示已通过；真实桌面浏览器点击流与手机扫码仍未实机验证 | 下一步做一轮浏览器级手测并补问题记录 |
| 2026-03-24 | T007 | P1 | 默认命令是否已经同步到页面、规格和 Demo 文案 | 对照 `/connect` 页面、`F010-agent-connect.md`、`local-cli-demo-execution.md` | passed | 三处命令已一致，样例目录脚本也采用同一写法 | 保持后续文案不再分叉 |
| 2026-03-24 | T003 | P0 | 移动 Web 首屏与底部 5 个入口是否满足展示要求 | 启动本地 server 后，用 Playwright 分别截取桌面 `/connect`、手机 `/app`、手机 `/app/avatar` 视图 | passed | `/app` 首屏信息流、已接入 agent 卡片、底部 5 个入口和中间 `基站` 主按钮在 `iPhone 13` 视口下显示正常；接入 payload 在 `/app/avatar` 继续保持 | 进入完整 Demo 剧本联排 |
| 2026-03-24 | T006 | P0 | 当前主链路是否能完整演示 | 结合 `npm run lint`、`npm run build`、样例 CLI、`curl` 页面检查与 Playwright 截图 | passed | 桌面 `/connect`、手机 `/pair`、手机 `/app` 已完成浏览器级验证；CLI 产出的 `pair_url` 能驱动配对页和移动首页展示；当前未发现阻断性问题 | 下一步转入 `T005` 的完整 Demo 剧本串联 |
| 2026-03-24 | T021 | P0 | 根路由是否已切回商业化官网，且试玩入口仍完整可达 | 启动本地 server 后，对 `/`、`/preview`、`/connect`、`/app` 做 `curl` 检查 | passed | `/` 已返回商业化官网；首页存在 `Live validation path / Open public preview / Pair local agent / Open mobile web`；`/connect` 已显示 `172.20.10.7:3000` 的命令 host | 当前可直接用商业化前台承接试玩 |
| 2026-03-24 | T022 | P0 | 帖子详情页是否支持 `@agent`、待确认建议和任务草案 | 用 Playwright 打开 `/posts/agent-signal`，依次执行 `@Agent Aster`、`编辑后发送`、`保存并批准`、`升级成任务草案` | passed | 详情页动作均可执行；已输出桌面截图 `/tmp/clawnet-post-detail-desktop.png` 作为证据 | 继续验证创建流与回跳 |
| 2026-03-24 | T023 | P0 | 三问式创建流和公开 agent 主页是否可完成 | 用 Playwright 打开 `/agents/new?post=agent-signal`，连续点击两次 `下一步`、一次 `完成创建`，再进入 agent 主页 | passed | 创建流可在 3 步内完成，最终成功进入 `/agents/:id`；已输出手机截图 `/tmp/clawnet-agent-profile-mobile.png` | 与帖子详情组合成最短试玩闭环 |
| 2026-03-24 | T024 | P0 | `首页 -> 帖子详情 -> 创建 agent -> agent 主页` 的 MVP 路径是否可重复试玩 | 运行 Playwright 脚本，实际点击 `/ -> /posts/agent-signal -> /agents/new?post=agent-signal -> /agents/:id` | passed | 脚本输出 `MVP flow verified`；桌面和 `iPhone 13` 视口都已覆盖关键动作 | 将试玩步骤固化到 `mvp-validation-runbook.md`，供创始人自测 |
| 2026-03-25 | T004 | P1 | `/network` 的 network layer 演示页是否满足规格，并能完成一次 mock 的加入 / 创建基站 | 研发交付后执行 `npm run build`，再用桌面与 `iPhone 13` 视口分别手测 `/network`、入口跳转、加入 / 创建动作与状态变化，并保留前后截图 | pending | 已先冻结验收口径：必须能区分中心站与社区节点、避免协议术语、完成一次 mock 动作并看到状态变化；当前代码里尚未看到独立 `src/app/network` 路由，待研发交付后实测 | 研发完成 `/network` 后立即接手验证、截图、记缺陷并判断是否通过 |
| 2026-03-25 | T004 | P1 | `/network` 的 network layer 演示页是否满足规格，并能完成一次 mock 的加入 / 创建基站 | 执行 `npm run lint`、`npm run build`；启动 `npm start` 后先用 `curl` 检查 `/app/station/join` 生成的 `/network` 链接，再用 Playwright 在 `iPhone 13` 视口点击一次加入、提交一次创建，并在桌面视口截取 `/network` | passed | 已新增独立 `src/app/network/page.tsx`，并用 query state 承接 mock 的 `joined / created`；`/app/station/join` 可点击进入 `/network`，`/app/station/create` 可提交到 `/network`；截图证据为 `/tmp/clawnet-t004-joined-iphone13.png`、`/tmp/clawnet-t004-created-iphone13.png`、`/tmp/clawnet-t004-network-desktop.png` | 转入 `T005`，按完整 Demo 剧本联排 `首页 -> connect/CLI -> 扫码 -> app -> 基站操作 -> /network` |
| 2026-03-25 | T005 | P1 | 完整 Demo 剧本能否按 `首页 -> connect/CLI -> 扫码 -> app -> 基站操作 -> /network` 走通一遍 | 研发交付后按 `mvp-validation-runbook.md` 的完整 Demo 联排路径执行；结合 CLI 输出、手机扫码、Playwright 截图和手测记录验证整条链路 | pending | 已先冻结最小验证路径与截图点；当前 `connect -> /pair -> /app` 已有通过记录，但 `基站 -> /network` 仍未纳入已验证闭环，且依赖 T004 交付 | 等 T004 交付后一并执行完整 Demo 验证，并把结果同步回本日志 |
| 2026-03-25 | T004 | P1 | `/network` 的 network layer 演示页是否能被测试独立复核，而不是沿用研发口径 | 在 QA 环境独立执行 `npm run lint`、`npm run build`、`npm run start`，再用 Playwright 分别复核 `join -> /network`、`create -> /network` 与桌面 `/network` 概览 | passed | 独立复核通过：`join` 路径可显示 `你刚刚加入了 深空协议`，`create` 路径可显示 `你刚刚创建了 Aurora Commons`，桌面 `/network` 可见 `ClawNet Central Station`、`你刚加入的基站` 与 `Future Self-Hosted Node`；QA 截图为 `/tmp/clawnet-qa-t004-created-mobile.png`、`/tmp/clawnet-qa-t004-network-desktop.png` | `T004` 保持 `passed / done`，继续检查整条 Demo 联排是否成立 |
| 2026-03-25 | T005 | P1 | 完整 Demo 剧本能否按 `首页 -> connect/CLI -> 扫码 -> app -> 基站操作 -> /network` 走通一遍 | 执行 `npm run demo:connect:install`、`npm run demo:connect` 产出真实 `pair_url`，再用 Playwright 从 `/ -> /connect -> /pair/:code -> /app -> /app/station -> /app/station/join -> /network -> /app` 跑一遍，并保留桌面与 `iPhone 13` 截图 | passed | QA 已独立走通完整链路：CLI 输出 `CLAW-1R8CIQ` 与 `pair_url`；`/pair/:code` 显示 `Agent Aster` 摘要；`/app` 显示 `Agent Aster 已从外部环境接入`；进入基站后可完成一次 `加入并查看 network`，并在 `/network` 显示 `Agent Aster 已接入` 与 `你刚刚加入了 深空协议`；截图证据为 `/tmp/clawnet-qa-t005-connect-desktop.png`、`/tmp/clawnet-qa-t005-pair-mobile.png`、`/tmp/clawnet-qa-t005-app-mobile.png`、`/tmp/clawnet-qa-t005-network-mobile.png` | `T005` 允许进入 `passed / done`；如需后续稳定回归，可再补固定 Playwright 脚本 |
| 2026-03-25 | T005 | P1 | 完整 Demo 剧本是否已固化为仓库内可复跑的回归命令 | 执行 `npm run demo:regression`，让脚本依次完成 `lint -> build -> demo:connect -> start -> Playwright`，并检查 `/tmp/clawnet-demo-regression/` 下的截图与 `summary.json` | passed | 新增根命令 `npm run demo:regression` 与 `scripts/verify-demo-flow.mjs`；脚本已真实输出 `CLAW-1R8CIQ` 和 `pair_url`，并产出 `/tmp/clawnet-demo-regression/connect-desktop.png`、`pair-mobile.png`、`app-mobile.png`、`network-mobile.png`、`created-mobile.png`、`network-desktop.png`、`summary.json` | 后续回归优先跑这条脚本，不再每次手工拼步骤 |
| 2026-03-25 | T025 | P0 | 首页 `#modes` 是否已成为真实分发层，且 `/pair/:code` 是否已降级为内部第二步 | 执行 `npm run lint`、`npm run build`；启动 `npm run start` 后用 Playwright 在桌面首页点击三张模式 CTA，并检查 `/connect`、`/pair/:code` 页面文案 | pending | 当前已冻结验收口径：`#modes` 必须直达 `/preview`、`/connect`、`/network`，且首页、`/connect`、`/pair` 文案都要明确 `/pair/:code` 不是公网首链 | 完成代码后立刻做一轮桌面点击验证并补证据 |
| 2026-03-25 | T025 | P0 | 首页 `#modes` 是否已成为真实分发层，且 `/pair/:code` 是否已降级为内部第二步 | 执行 `npm run lint`、`npm run build`；启动 `npm run start` 后用 Playwright 真实点击 `/#modes` 下的 `/preview`、`/connect`、`/network` 三张卡，并检查 `/connect` 与 `/pair/TEST` 的定位文案 | passed | `npm run lint` 与 `npm run build` 已通过；Playwright 验证结果写入 `/tmp/clawnet-t025/summary.json`，其中 `modeResults` 依次命中 `/preview`、`/connect`、`/network`，且 `connectHasInternalStepCopy = true`、`pairHasInternalStepCopy = true` | `T025` 保持 `passed / done`；后续对外测试默认分享 `/#modes`，不再把 `/pair/:code` 当成公网首链 |
| 2026-03-25 | T026 | P0 | 真机扫码能否形成“这是我的 agent 连进来了” aha 时刻 | 在真机模式下使用一张非默认 `agent-card.json`，启动 `dev:lan / start:lan` 或等价公网 host，执行当前 CLI，确认桌面 `/connect` 不是静态样例二维码，手机扫码进入 `/pair` 与 `/app` 后能看到同一 agent 身份，并完成一次立即动作 | pending | 当前缺口已确认：`/connect` 仍渲染静态 `samplePairing`，而不是本次 CLI 真正生成的 pairing；如果继续使用 `localhost` host，真机扫码也无法直接成立 | 研发先补“当前 pairing 导入 / 还原”和真机 host 指引，QA 再做实机复核 |
