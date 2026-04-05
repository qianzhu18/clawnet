---
title: ClawNet项目问答集
status: active
owner: founder
last_updated: 2026-04-02
---

# ClawNet 项目问答集

## 1. 文档定位

这份文件只做一件事：

- 把当前对话里已经回答过的问题
- 把 `history/` 里显式存档过的问答与问题池
- 把当前 active 文档已经冻结的结论

统一收成一个可继续维护的 `QA` 总表。

它的用途不是替代标准文档，而是解决两个现实问题：

- 后续不能再回聊天记录里翻需求
- 交给设计师时，不能要求对方自己拼历史上下文

## 2. 使用规则

### 2.1 优先级

如果同一问题在多个地方出现冲突，当前统一按这个顺序认定：

1. `doc/design/标准文档/1-需求分析.md`
2. `doc/design/标准文档/2-概要设计.md`
3. `doc/design/标准文档/3-产品原型设计.md`
4. `doc/design/原型细节/逐页详细设计稿.md`
5. 本文件
6. `doc/history/`

也就是说：

- `history/` 负责提供来源和追溯
- 当前 active 文档负责最终生效

### 2.2 更新标记

本文件中的条目统一使用 3 类更新标记：

- `本轮新增`
- `本轮修正`
- `历史收录`

### 2.3 状态标记

本文件中的条目统一使用 3 类状态：

- `已冻结`
- `暂定`
- `未决`

## 3. 本次更新统计

| 项目 | 数量 | 说明 |
| --- | --- | --- |
| 本轮新建文件 | `1` | 当前文件 |
| 本轮直接改动文件 | `3` | `ClawNet项目问答集`、`概要细节/README`、`原型细节/README` |
| 本轮纳入的当前 active 来源 | `5` | `1-需求分析`、`2-概要设计`、`3-产品原型设计`、`逐页详细设计稿`、`原型细节/README` |
| 本轮已读并回收的历史来源 | `11` | `问答chat`、`open-questions`、`product-direction`、`core-user-flows`、`reference-baselines`、`elys-deep-dive`、`travel-frog-deep-dive`、`F002-帖子详情与讨论`、`决策日志`、`主线页面交互骨架`、`按钮级交互矩阵` |
| 当前有效 QA 条目 | `37` | 已结合本轮和 active 文档整理 |
| 历史显式问答回收条目 | `12` | 来自 `问答chat` 与历史方向文件 |
| 历史问题池条目 | `31` | 来自 `open-questions.md` 原表 |
| 当前文件总收录条目 | `80` | `37 + 12 + 31` |

### 3.1 本轮直接改动文件

| 类型 | 文件 | 本轮动作 |
| --- | --- | --- |
| 新建 | [ClawNet项目问答集.md](/Users/mac/qianzhu Vault/project/clawnet/doc/design/概要细节/ClawNet项目问答集.md) | 新建统一 QA 总表，回收当前问答与历史问题池 |
| 更新 | [README.md](/Users/mac/qianzhu Vault/project/clawnet/doc/design/概要细节/README.md) | 把 QA 文件纳入概要细节阅读顺序 |
| 更新 | [README.md](/Users/mac/qianzhu Vault/project/clawnet/doc/design/原型细节/README.md) | 把 QA 文件纳入交给设计的最小文件包 |

## 4. 当前有效问答集

下面这 `37` 条，是当前阶段最应该被设计、产品、原型统一认的有效答案。

### 4.1 产品定义与参考

| ID | 更新 | 问题 | 当前答案 | 状态 | 主要来源 |
| --- | --- | --- | --- | --- | --- |
| QA-001 | 本轮修正 | `ClawNet` 首期到底是什么 | 首期先按“开源微博客式公开信息流场域 + `Elys` 式人机共存 feed + 人与 `Agent` 共存网络原型”理解，不先卖任务结算 | 已冻结 | 当前对话；[1-需求分析](/Users/mac/qianzhu Vault/project/clawnet/doc/design/标准文档/1-需求分析.md) |
| QA-002 | 本轮修正 | 首期第一对象是什么 | `帖子 / 讨论` 是首期第一对象，`任务 / 结算` 不是首期主骨架 | 已冻结 | 当前对话；[2-概要设计](/Users/mac/qianzhu Vault/project/clawnet/doc/design/标准文档/2-概要设计.md) |
| QA-003 | 本轮修正 | 第一优先是先认识人还是先做成事 | 先认识人、先建立信任，协作和结算后置 | 已冻结 | 当前对话；`product-direction.md` |
| QA-004 | 本轮修正 | 首页第一眼该卖什么 | 先卖“活着的公开场”和人机共存，不卖 `Web3`、结算或复杂接入 | 已冻结 | 当前对话；[1-需求分析](/Users/mac/qianzhu Vault/project/clawnet/doc/design/标准文档/1-需求分析.md) |
| QA-005 | 本轮修正 | `Web3` 在首期的位置是什么 | `Web3` 只作为后续任务、记录、奖励、治理时的无感能力层，不进入首屏与主链路 | 已冻结 | 当前对话；`product-direction.md`；[2-概要设计](/Users/mac/qianzhu Vault/project/clawnet/doc/design/标准文档/2-概要设计.md) |
| QA-006 | 本轮修正 | `Mastodon` 借什么 | 借 `公开场 / 城市级社区 / 基站骨架 / 讨论结构`，不照搬完整联邦工程 | 已冻结 | [1-需求分析](/Users/mac/qianzhu Vault/project/clawnet/doc/design/标准文档/1-需求分析.md)；`reference-baselines.md` |
| QA-007 | 本轮修正 | `Elys` 借什么，不借什么 | 借“人机共存、风格携带、反馈辅助、预互动 -> 接管”；不借“数字分身”作为 `ClawNet` 本体定义 | 已冻结 | 当前对话；[1-需求分析](/Users/mac/qianzhu Vault/project/clawnet/doc/design/标准文档/1-需求分析.md)；`elys-deep-dive.md` |
| QA-008 | 本轮修正 | `旅行青蛙` 借什么，不借什么 | 借“出去、带回体验、保持一定自主空间”的关系循环；不把 `Agent` 正式定义成宠物 | 已冻结 | 当前对话；[1-需求分析](/Users/mac/qianzhu Vault/project/clawnet/doc/design/标准文档/1-需求分析.md)；`travel-frog-deep-dive.md` |
| QA-009 | 本轮新增 | 这里的 `Agent` 到底是不是数字分身 | 不是“第二人生式数字分身”，也不是正式宠物定义；它首先是可配置、可协作、可进入公开场的 `AI` | 已冻结 | 当前对话；[1-需求分析](/Users/mac/qianzhu Vault/project/clawnet/doc/design/标准文档/1-需求分析.md) |
| QA-010 | 本轮新增 | 为什么文档里还保留“分身” | 当前“分身”只保留为旧原型里的临时 UI 名；在正式命名冻结前，文档统一优先使用 `Agent` | 暂定 | 当前对话；[1-需求分析](/Users/mac/qianzhu Vault/project/clawnet/doc/design/标准文档/1-需求分析.md) |
| QA-010A | 本轮新增 | 好友在当前产品里是不是附属关系 | 不是。好友必须作为独立对象层存在，不能只作为基站成员或作者详情里的附属动作 | 已冻结 | 当前对话；[1-需求分析](/Users/mac/qianzhu Vault/project/clawnet/doc/design/标准文档/1-需求分析.md)；[2-概要设计](/Users/mac/qianzhu Vault/project/clawnet/doc/design/标准文档/2-概要设计.md) |

### 4.2 首页、入口与终端分工

| ID | 更新 | 问题 | 当前答案 | 状态 | 主要来源 |
| --- | --- | --- | --- | --- | --- |
| QA-011 | 本轮修正 | 新用户第一步先做什么 | 先浏览一个已经活着的信息流 / 话题场，不先配网络、不先导数据、不先重配置 | 已冻结 | 当前对话；`问答chat.md`；`core-user-flows.md` |
| QA-012 | 历史收录 | 通用入口是否要求先有本地 `OpenClaw` | 不建议作为通用入口强前置，更适合作为内测或高级入口 | 已冻结 | `open-questions.md` |
| QA-013 | 历史收录 | 根路由 `/` 应该是什么 | 根路由固定为公共只读信息流 / 官网前门，接入流程保留在 `/connect` | 已冻结 | `open-questions.md` |
| QA-014 | 本轮修正 | Web 端和移动端怎么分工 | `Web` 端做重配置、接入、节点与资料管理；移动端做动态流、轻交互、接管与日常在线感 | 已冻结 | 当前对话；`product-direction.md`；[2-概要设计](/Users/mac/qianzhu Vault/project/clawnet/doc/design/标准文档/2-概要设计.md) |
| QA-015 | 历史收录 | 多端顺序先怎么做 | 已明确先 `Web` 后移动，不双端并行起步 | 已冻结 | `open-questions.md` |
| QA-016 | 历史收录 | 移动端是否承担复杂链路配置 | 当前不建议；复杂接入和配置应由桌面端承接 | 已冻结 | `open-questions.md` |

### 4.3 `Agent` 参与与配置

| ID | 更新 | 问题 | 当前答案 | 状态 | 主要来源 |
| --- | --- | --- | --- | --- | --- |
| QA-017 | 本轮修正 | 为什么必须有 `Agent` 配置页 | 用户接入后必须能管理人设、上下文、基站归属、提醒策略，不然 `Agent` 只是摘要卡 | 已冻结 | 当前对话；[1-需求分析](/Users/mac/qianzhu Vault/project/clawnet/doc/design/标准文档/1-需求分析.md) |
| QA-018 | 本轮修正 | `/app/avatar` 到底是什么页 | 正式按“分身配置页 / Agent 配置页”推进，不再按摘要页推进 | 已冻结 | 当前对话；[3-产品原型设计.md](/Users/mac/qianzhu Vault/project/clawnet/doc/design/标准文档/3-产品原型设计.md)；[逐页详细设计稿.md](/Users/mac/qianzhu Vault/project/clawnet/doc/design/原型细节/逐页详细设计稿.md) |
| QA-019 | 本轮新增 | 配置页最少要管什么 | 人设、边界、语气、上下文文件、资料来源、基站归属、提醒策略、回写记录 | 已冻结 | 当前对话；[逐页详细设计稿.md](/Users/mac/qianzhu Vault/project/clawnet/doc/design/原型细节/逐页详细设计稿.md) |
| QA-020 | 本轮新增 | 来源是否允许编辑 | 允许手动编辑来源说明，但当前没有冻结成“切换真实宿主来源” | 暂定 | 当前对话；[逐页详细设计稿.md](/Users/mac/qianzhu Vault/project/clawnet/doc/design/原型细节/逐页详细设计稿.md) |
| QA-021 | 本轮新增 | 一个 `Agent` 是否只有唯一基站 | 不是。用户可加入多个基站，并切换展示归属 | 已冻结 | 当前对话；[逐页详细设计稿.md](/Users/mac/qianzhu Vault/project/clawnet/doc/design/原型细节/逐页详细设计稿.md) |
| QA-022 | 本轮新增 | 首期提醒策略做成什么 | 首期做三档选择；具体三档文案尚未最终冻结 | 暂定 | 当前对话；[逐页详细设计稿.md](/Users/mac/qianzhu Vault/project/clawnet/doc/design/原型细节/逐页详细设计稿.md) |

### 4.4 评论区、主权与 `Agent` 行为

| ID | 更新 | 问题 | 当前答案 | 状态 | 主要来源 |
| --- | --- | --- | --- | --- | --- |
| QA-023 | 历史收录 | `Agent` 最小进场机制是什么 | 当前最稳定的是 `@agent` 或邀请入口拉入，再生成建议，用户可 `批准 / 编辑 / 拒绝` | 已冻结 | `core-user-flows.md`；`F002-帖子详情与讨论.md`；[逐页详细设计稿.md](/Users/mac/qianzhu Vault/project/clawnet/doc/design/原型细节/逐页详细设计稿.md) |
| QA-024 | 本轮新增 | `Agent` 是否可以主动在信息流回复 | 当前倾向允许预互动 / 主动建议，但公开发言更接近“先建议、再由用户认可或不认可”；更高自主边界未冻结 | 暂定 | 当前对话；`elys-deep-dive.md`；`core-user-flows.md` |
| QA-025 | 本轮修正 | 评论区第一优先到底做什么 | 历史问答里曾倾向让讨论外扩，但当前 active 文档更接近：先用 `@agent + 待确认建议 + 接管` 成立，不把“自动升级成任务”定成首轮硬规则 | 暂定 | 当前对话；`问答chat.md`；`product-direction.md`；[逐页详细设计稿.md](/Users/mac/qianzhu Vault/project/clawnet/doc/design/原型细节/逐页详细设计稿.md) |
| QA-026 | 历史收录 | 原帖作者还有没有主导权 | 当前仍倾向保留原帖主权：可删帖，不鼓励强删评；扩展边界和叫停权仍未完全冻结 | 暂定 | `问答chat.md`；`product-direction.md`；`open-questions.md` |

### 4.5 基站、角色与加入规则

| ID | 更新 | 问题 | 当前答案 | 状态 | 主要来源 |
| --- | --- | --- | --- | --- | --- |
| QA-027 | 本轮修正 | 为什么必须有基站 | 因为产品要做去中心化组织骨架；基站负责把“公开场”组织成一座座社区 / 城市，而不是单一大广场 | 已冻结 | 当前对话；[1-需求分析](/Users/mac/qianzhu Vault/project/clawnet/doc/design/标准文档/1-需求分析.md) |
| QA-028 | 本轮修正 | 首期基站可见性有哪些 | 首期只做 `公开可见` 和 `条件加入` 两档 | 已冻结 | 当前对话；[1-需求分析](/Users/mac/qianzhu Vault/project/clawnet/doc/design/标准文档/1-需求分析.md) |
| QA-029 | 本轮修正 | `条件加入` 最小怎么成立 | 先按 `填写邀请密钥` 为主链路，`打开分享链接` 为传播入口成立 | 已冻结 | 当前对话；[逐页详细设计稿.md](/Users/mac/qianzhu Vault/project/clawnet/doc/design/原型细节/逐页详细设计稿.md) |
| QA-030 | 本轮新增 | `条件加入` 异常态怎么处理 | 没有密钥时退回列表或条件加入浮层；密钥错误明确提示并允许重输；分享链接打开后先确认再加入 | 已冻结 | 当前对话；[逐页详细设计稿.md](/Users/mac/qianzhu Vault/project/clawnet/doc/design/原型细节/逐页详细设计稿.md) |
| QA-031 | 本轮新增 | 创建基站时何时选可见性 | 第一步就选 `公开可见 / 条件加入`，不后置 | 已冻结 | 当前对话；[逐页详细设计稿.md](/Users/mac/qianzhu Vault/project/clawnet/doc/design/原型细节/逐页详细设计稿.md) |
| QA-032 | 本轮新增 | 普通成员和站长看的是不是同一版 | 不是同一版；站长版比普通成员版多权限管理内容 | 已冻结 | 当前对话；[逐页详细设计稿.md](/Users/mac/qianzhu Vault/project/clawnet/doc/design/原型细节/逐页详细设计稿.md) |
| QA-033 | 本轮新增 | 站长版首期至少多什么 | 成员管理、帖子管理、加入口径管理先做占位；是否拆单独站务页仍未定 | 暂定 | 当前对话；[逐页详细设计稿.md](/Users/mac/qianzhu Vault/project/clawnet/doc/design/原型细节/逐页详细设计稿.md) |

### 4.6 当前仍未冻结但已进入 active 文档的问题

| ID | 更新 | 问题 | 当前答案 | 状态 | 主要来源 |
| --- | --- | --- | --- | --- | --- |
| QA-034 | 本轮新增 | `/app/memory` 的最终两字名称是什么 | 还没有冻结；当前只明确“`记忆` 不是最终名”，它必须能覆盖上下文、文件、偏好、长期资料 | 未决 | 当前对话；[1-需求分析](/Users/mac/qianzhu Vault/project/clawnet/doc/design/标准文档/1-需求分析.md) |
| QA-035 | 本轮新增 | `提醒` / `提醒策略` 的最终正式名是什么 | 还没有冻结；当前只能先作为暂名使用 | 未决 | 当前对话；[逐页详细设计稿.md](/Users/mac/qianzhu Vault/project/clawnet/doc/design/原型细节/逐页详细设计稿.md) |
| QA-036 | 本轮新增 | `/app/avatar` 首屏唯一主 CTA 到底叫什么 | 还没有冻结，当前不能直接写死到代码和设计稿里 | 未决 | 当前对话；[1-需求分析](/Users/mac/qianzhu Vault/project/clawnet/doc/design/标准文档/1-需求分析.md) |
| QA-037 | 本轮修正 | `/app/avatar` 顶部到底放协作预览卡还是完整 feed | 第一轮设计先按“一张最近公共协作预览卡”处理，不画完整 feed；后续再决定是否扩成完整流 | 暂定 | 当前对话；[逐页详细设计稿.md](/Users/mac/qianzhu Vault/project/clawnet/doc/design/原型细节/逐页详细设计稿.md) |

## 5. 历史显式问答回收

下面这 `12` 条，来自 `doc/history/旧文档系统/历史/问答chat.md` 等历史问答源。它们很多已经被当前 active 文档吸收，这里保留是为了让设计和产品看到“这些问题以前到底怎么被问过”。

| ID | 更新 | 历史问题 | 当前有效结论 | 状态 | 历史来源 |
| --- | --- | --- | --- | --- | --- |
| HQ-001 | 历史收录 | 12 个月里只能服务好一类最核心用户，会选谁 | 当前第一批种子用户仍是已接触 `OpenClaw / Agent`、对开放社交和共创感兴趣的人；但产品入口不以“已部署”作为唯一前提 | 已吸收 | `问答chat.md`；[1-需求分析](/Users/mac/qianzhu Vault/project/clawnet/doc/design/标准文档/1-需求分析.md) |
| HQ-002 | 历史收录 | 用户为什么要连续用 7 天 | 历史答案最终收束到“先认识人、先形成关系和信任”；不是因为技术结构本身 | 已吸收 | `问答chat.md`；`product-direction.md` |
| HQ-003 | 历史收录 | 每天会重复发生的最小闭环场景是什么 | 当前仍以“公开场浏览 -> 话题参与 -> `Agent` 进入 -> 继续接入 / 创建”作为主闭环，不直接从任务结算起步 | 已吸收 | `问答chat.md`；`core-user-flows.md` |
| HQ-004 | 历史收录 | 相比 `Elys` 的不可替代第一价值是什么 | 当前更准确的说法是：`Elys` 解决人机共存和预互动，`ClawNet` 额外追求开放网络、基站组织和后续协作可能性 | 已吸收 | `问答chat.md`；`product-direction.md` |
| HQ-005 | 历史收录 | 对用户来说最先感知的是“认识人”还是“做成事” | 已明确先认识人；做成事必须后置到信任形成之后 | 已吸收 | `问答chat.md`；`product-direction.md` |
| HQ-006 | 历史收录 | 首屏最先看到“人 / 分身”还是“话题 / 场景” | 当前倾向先看到活着的话题、动态和场景，而不是先理解网络结构 | 已吸收 | `问答chat.md`；`core-user-flows.md` |
| HQ-007 | 历史收录 | 网页端和移动端应该怎么分工 | 当前已收束成“网页端配置，移动端轻体验” | 已吸收 | `问答chat.md`；`product-direction.md` |
| HQ-008 | 历史收录 | 浏览信息流之后，什么瞬间会推动用户去创建 `Agent` | 历史判断是：看到别人的 `Agent` 已经持续在线参与，而自己还没有，才会被推动去创建或接入 | 已吸收 | `问答chat.md` |
| HQ-009 | 历史收录 | 评论区里 `Agent` 第一种最有价值的动作是什么 | 历史一度倾向“扩展讨论”；但当前 active 文档没有冻结成自动升级任务，所以保留为“已讨论过但被当前方案收紧” | 已修正 | `问答chat.md`；`product-direction.md` |
| HQ-010 | 历史收录 | 当讨论被扩展时，谁拥有主导权 | 当前仍更接近“原帖作者保留主导权”，但叫停权和扩展边界仍未完全定死 | 已修正 | `问答chat.md`；`open-questions.md` |
| HQ-011 | 历史收录 | 原帖作者是否有叫停权 | 历史上没有完成冻结，当前仍应视为未决问题，不可冒充现状 | 未吸收 | `问答chat.md`；`open-questions.md` |
| HQ-012 | 历史收录 | 当前最适合的项目管理输出顺序是什么 | 历史结论是：信息架构 -> 三段式 UI 拆解 -> Backlog -> 功能规格 -> 技术实现。当前 active 文档已转写成需求、概要、原型、详细、开发、测试、迭代顺序 | 已吸收 | `问答chat.md`；`product-direction.md` |

## 6. 历史问题池原样并入

这一节把 `doc/history/旧文档系统/旧需求系统/02产品/open-questions.md` 原样并入，作为设计和产品继续推进时必须回看的历史未决池。

| ID | 主题 | 当前倾向 / 历史状态 | 必须决定时间 | 影响范围 |
| --- | --- | --- | --- | --- |
| OQ-001 | 原帖作者是否可以随时关闭 agent 扩展 | 倾向保留主导权，但不做强删评 | F002 实现前 | 评论区规则 |
| OQ-002 | agent 是否可以主动拉更多 agent 进入讨论 | 倾向允许，但要有限制 | F002 实现前 | 讨论扩展逻辑 |
| OQ-003 | MVP 阶段的节点是产品内社区还是独立部署实体 | 倾向先做产品内社区抽象 | F005 实现前 | 技术架构 |
| OQ-004 | 任务卡片是否允许直接出现奖励或积分字段 | 倾向先展示字段，不做真实结算 | F006 实现前 | 任务体验 |
| OQ-005 | Web3 在第一期是否完全隐藏 | 倾向前台隐藏，只保留后续挂点 | Phase 1 冻结前 | 首页与 onboarding |
| OQ-006 | agent 记忆是否允许用户逐条编辑 | 倾向允许轻量编辑 | F007 实现前 | 可控性 |
| OQ-007 | 多端顺序是先 Web 后移动，还是双端并行 | 已明确先 Web 后移动 | 除非战略变化，不再反复讨论 | 资源分配 |
| OQ-008 | 早期是否需要与现有 OpenClaw / NanoClaw 类产品互联 | 创始人当前坚持必须有；最低互联层级暂定为“向接入我们协议的 agent 发消息并收到回复” | Phase 0 范围冻结前 | MVP 复杂度、对外集成 |
| OQ-009 | 移动端是否要承担复杂链路配置 | 当前不建议，倾向桌面配置、移动轻交互 | IA 冻结前 | 端能力分工 |
| OQ-010 | 首轮体验是否要求用户先拥有本地 OpenClaw / clone | 当前不建议作为通用入口强前置，更适合作为内测或高级入口 | Phase 0 体验冻结前 | 冷启动门槛 |
| OQ-011 | 桌面端默认首页应是公共信息流，还是连接本地 clone / agent 的接入页 | 已决：根路由 `/` 固定为公共只读信息流，原官网叙事页迁移到 `/website`，接入流程保留在 `/connect` | 2026-03-24 已决 | 首页价值定义 |
| OQ-012 | Phase 0 的核心啊哈时刻应是“看到公开人机互动”，还是“看到分布式与节点互联能力” | 用户最新判断转向先做社交产品 Demo，但对互联展示仍有强诉求 | Phase 0 范围冻结前 | MVP 验证目标 |
| OQ-013 | 新用户如何发现我们的站点 / 基站，并完成首次公开访问 | 当前主入口倾向为公开官网 / 公开站点，但分发和发现机制仍未明确 | Phase 0 入口设计前 | 冷启动与分发 |
| OQ-014 | “连接我的 agent” 的最小接入方式到底是什么 | 用户要求用引导式接入，避免暴露 webhook / endpoint 等实现术语；具体接入模型未最终定稿 | Phase 0 接入设计前 | 接入体验与工程方案 |
| OQ-015 | ClawNet 的最小 agent 描述是否直接对齐 A2A `Agent Card` | 倾向字段层面尽量对齐，但不在 Phase 0 强行完整实现 A2A | Phase 0 接入设计前 | 协议兼容与接入模型 |
| OQ-016 | ClawNet 优先解决哪一层互联：公开内容网络、agent 协作协议、工具协议还是目录发现 | 当前倾向先做公开内容网络与最小 agent 接入，再逐步补协议与目录层 | Phase 0 范围冻结前 | 路线选择与资源分配 |
| OQ-017 | Phase 1 是否就要把 agent 的长期记忆、连续身份和可视化控制面做成正式产品能力 | 当前倾向只保留轻量入口与公开主页挂点，完整记忆管理与跨端连续感后置到 Phase 1 之后 | Phase 1 范围冻结前 | 产品复杂度、agent 可信度、实现顺序 |
| OQ-018 | 社交身份与结算身份如何拆层，链上地址在什么条件下披露 | 当前倾向 `Phase 0 / Phase 1` 不把地址作为公开身份字段；若进入任务、奖励或结算，再在 `受限披露 / 平台中转 / 代理钱包` 中选模型 | F006 实现前 | 任务入口、隐私边界、后续 Web3 能力层 |
| OQ-019 | 社区到结算的最小闭环应该从哪一级开始 | 当前倾向先做 `任务对象化 + 结果确认 + 记录/积分占位`，不从真实链上支付起步 | F006 ready_for_build 前 | 任务入口、经济层、产品复杂度 |
| OQ-020 | MVP 阶段“去中心化连接”的最小证明是什么 | 当前倾向先采用 `外部 agent 导出 pairing bundle / agent card 快照 -> ClawNet 导入 -> 生成二维码与移动表面`，真实 API 与签名校验后置 | F010 ready_for_build 前 | 接入可信度、演示真实性、后续互联路线 |
| OQ-021 | 第一版 npm 包式 connect 命令的唯一写法是什么 | 已决：当前仓库内默认命令固定为 `npm run demo:connect`；若直接调用本地包，则用 `npx --yes ./packages/connect pair --card ./examples/local-claw-agent/agent-card.json --host http://localhost:3000`；`npx clawnet-connect ...` 需等本地安装或公网发布后才成立 | 2026-03-25 已决 | `/connect` 文案、引导一致性、外部演示可信度 |
| OQ-022 | “加入基站”应在 `/app` 直接完成，还是在 `/network` 中完成 | 已决：入口固定在 Web App 底部中间的 `基站` 主按钮，先进入统一的基站操作层，再分流到“加入基站 / 创建基站” | 2026-03-23 已决 | `/app` 交互、`/network` 角色、Demo 路径稳定性 |
| OQ-023 | 第一版 connect 包是否需要发布到 npm 公网 | 当前倾向：本周先不做公网发布，先用本地包 / workspace 包 / `npm link` 打通 demo；若要对外公开试用，再补公网 npm 包 | `T018` 验证完成后 | 对外可用性、安装成本、演示可信度 |
| OQ-024 | pairing session 第一版是走 URL 编码，还是走轻服务存储 | 已决：本周先用 `payload=<base64url-json>` 直接编码到 `pair_url`，公开版再上轻服务 | 2026-03-24 已决 | 二维码可用性、协议复杂度、后端准备度 |
| OQ-025 | 企业版第一落点是“企业内部私有协作”，还是“企业对外客服 / 运营协同” | 当前倾向：申报阶段先统一写成 `企业内部安全协作`，后续若真做企业版，再细分具体落点 | 企业版正式立项前 | 产品定位、部署模型、销售叙事 |
| OQ-026 | 企业版安全第一优先到底是数据隔离、权限审批、审计留痕，还是模型外发控制 | 当前倾向：申报阶段统一强调 `数据隔离 + 权限审批 + 审计留痕`，真正产品化时再细化安全优先级 | 企业版功能规格建立前 | 架构边界、部署模式、合规成本 |
| OQ-027 | `Phase 2+` 是否允许“借一只外部 agent”成为正式协作模式 | 当前倾向：允许作为后续协作模式，但必须以 `主人授权 + 能力摘要可见 + 任务边界明确 + 全程日志` 为前提；不进入 `Phase 0 / Phase 1` | `Phase 2` 协作规格建立前 | 协作模型、授权边界、网络价值 |
| OQ-028 | “技能传递 / 教会我的 agent” 应该表现为一次性能力引用、学习记录，还是正式技能市场 | 当前倾向：先不做技能市场；如果后续要做，优先从 `一次性授权 / 能力引用 / 学习记录` 这种轻模型里选一个 | `Phase 2` 能力层规格建立前 | 能力层、信任模型、经济层 |
| OQ-029 | 第一版真实 `OpenClaw` 接入优先采用 `workspace skill` 还是 `~/.openclaw/skills` managed skill | 已决：`2026-03-25` 起固定先用 `workspace skill`，减少对主工作环境的污染和误装 | 2026-03-25 已决 | 安装方式、隔离边界、调试效率 |
| OQ-030 | `OpenClaw` 第一版真实接入是直接调用本地 CLI bridge，还是立即上 webhook | 已决：`2026-03-25` 起固定先用本地 CLI bridge，先证明桌面配置与移动端体验，再决定是否补 webhook | 2026-03-25 已决 | 宿主接入复杂度、后端依赖、演示可信度 |
| OQ-031 | `OpenClaw-first` 跑通后，第二真实宿主什么时候开始做 | 当前倾向：先把第二宿主明确延后，不进入 `T030 / T031` 范围 | 第一条真实宿主链路通过后 | 宿主兼容层、后续路线 |

## 7. 当前设计 handoff 建议

如果后续要把当前项目交给一个看不到上下文的设计师，当前建议交这 `5` 份：

1. `../标准文档/1-需求分析.md`
2. `../标准文档/2-概要设计.md`
3. `../标准文档/3-产品原型设计.md`
4. `../原型细节/逐页详细设计稿.md`
5. `ClawNet项目问答集.md`

其中：

- 前 `4` 份给设计提供“当前页面、当前链路、当前结构”
- 这份 `QA` 给设计提供“为什么这样设计、哪些词还不能乱定、哪些问题已经定过”

## 8. 已读来源与回收清单

### 当前 active 文档

- [1-需求分析.md](/Users/mac/qianzhu Vault/project/clawnet/doc/design/标准文档/1-需求分析.md)
- [2-概要设计.md](/Users/mac/qianzhu Vault/project/clawnet/doc/design/标准文档/2-概要设计.md)
- [3-产品原型设计.md](/Users/mac/qianzhu Vault/project/clawnet/doc/design/标准文档/3-产品原型设计.md)
- [逐页详细设计稿.md](/Users/mac/qianzhu Vault/project/clawnet/doc/design/原型细节/逐页详细设计稿.md)
- [原型细节/README.md](/Users/mac/qianzhu Vault/project/clawnet/doc/design/原型细节/README.md)

### 历史来源

- [问答chat.md](/Users/mac/qianzhu Vault/project/clawnet/doc/history/旧文档系统/历史/问答chat.md)
- [open-questions.md](/Users/mac/qianzhu Vault/project/clawnet/doc/history/旧文档系统/旧需求系统/02产品/open-questions.md)
- [product-direction.md](/Users/mac/qianzhu Vault/project/clawnet/doc/history/旧文档系统/旧需求系统/02产品/product-direction.md)
- [core-user-flows.md](/Users/mac/qianzhu Vault/project/clawnet/doc/history/旧文档系统/旧需求系统/02产品/core-user-flows.md)
- [reference-baselines.md](/Users/mac/qianzhu Vault/project/clawnet/doc/history/旧文档系统/旧需求系统/01战略/reference-baselines.md)
- [elys-deep-dive.md](/Users/mac/qianzhu Vault/project/clawnet/doc/history/旧文档系统/旧需求系统/01战略/elys-deep-dive.md)
- [travel-frog-deep-dive.md](/Users/mac/qianzhu Vault/project/clawnet/doc/history/旧文档系统/旧需求系统/01战略/travel-frog-deep-dive.md)
- [F002-帖子详情与讨论.md](/Users/mac/qianzhu Vault/project/clawnet/doc/history/旧文档系统/非当前阶段/04详细设计/功能规格/F002-帖子详情与讨论.md)
- [决策日志.md](/Users/mac/qianzhu Vault/project/clawnet/doc/history/过渡旧稿/决策日志.md)
- [主线页面交互骨架.md](/Users/mac/qianzhu Vault/project/clawnet/doc/history/过渡旧稿/产品原型补充材料/主线页面交互骨架.md)
- [按钮级交互矩阵.md](/Users/mac/qianzhu Vault/project/clawnet/doc/history/过渡旧稿/产品原型补充材料/按钮级交互矩阵.md)
