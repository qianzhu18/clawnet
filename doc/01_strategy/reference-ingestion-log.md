---
title: 参考资料入库日志
status: active
owner: founder
last_updated: 2026-03-23
---

# 参考资料入库日志

## 目标

本文件用于解决两个问题：

- 用户在对话中持续投喂的新资料，如何不丢失。
- 新对话窗口里的 AI 助手，如何快速理解这些资料已经被吸收到了哪里。

使用规则：

- 任何新的外部参考、文章、仓库、访谈、截图、长文材料，只要被认定为“后续还会影响判断”，都应在这里登记。
- 本文件只记录 `资料 -> 判断 -> 落点文件`，不替代正式分析文档。
- 正式结论仍应写回 `reference-baselines.md`、`agent-network-research.md`、`product-direction.md` 等当前真相文件。

## 当前已入库资料

| 日期 | 资料 | 类型 | 提炼出的主要判断 | 已同步文件 |
| --- | --- | --- | --- | --- |
| 2026-03-17 | `Elys` App Store 页面 | 产品参考 | 主要提供 `AI 分身如何被用户理解、预交互如何呈现、人类如何接管` 的产品体验参考 | `reference-baselines.md` |
| 2026-03-17 | `Mastodon` 官方仓库与联邦文档 | 架构参考 | 主要提供 `公开信息流、节点/实例抽象、联邦思维、审核治理` 的架构参考 | `reference-baselines.md`、`agent-network-research.md` |
| 2026-03-17 | `Clawith` 官方仓库与用户补充材料 | 机制参考 | 主要提供 `多 agent 协作、持续触发、关系系统、广场式动态流` 的机制参考 | `reference-baselines.md` |
| 2026-03-18 | `A2A / MCP / AGNTCY / ACP / ANP` | 协议研究 | 明确 `公开内容网络、agent 协作协议、工具协议、目录发现层` 不能混为一谈 | `agent-network-research.md`、`agent-network-research-xmind.md` |
| 2026-03-18 | OpenBuild 编译整理文章《AI 智能体时代：OpenClaw 重新定义链上金融》 | 能力层参考 | `agent + Web3` 更适合作为后续能力层，不应前置到首页主叙事；链上能力适合 7x24 小时 agent 承接；文中案例包括 `Aster_DEX`、`bankrbot`、`virtuals_io`、`Senpi`、`ZyFAI`、`Polymarket Skills` | `reference-baselines.md` |
| 2026-03-20 | `VCPToolBox` 官方仓库 README | 机制 / 产品面参考 | 主要提供 `统一身份、长期记忆、跨端连续存在感、可视化 agent 控制面` 的强化方向 | `reference-baselines.md`、`open-questions.md` |
| 2026-03-22 | 用户提供的对话截图 + 原始 X 线程 `We’re Entering the Agentic Era of Crypto` | 能力层参考 / 截图说明 | 新增稳定判断：文中案例主要证明 `skill` 是链上能力接入层，而不是产品闭环；同时暴露出 `社交身份` 与 `结算身份` 未拆层时，会被追问地址暴露、隐私和授权边界 | `reference-baselines.md`、`product-direction.md`、`open-questions.md`、`decision-log.md` |
| 2026-03-22 | 复核 `VCPToolBox` 官方仓库 README 与仓库结构 | 机制 / 产品面参考 | 新增稳定判断：`VCPToolBox` 已明确展示 `论坛 / VChat / 任务版 / 日程 / HumanBox` 等人机共生子应用，说明它不只是“记忆中间层”；但它更像高权限存在基础设施和系统内社区，不等价于 `ClawNet` 当前要验证的公开微博客网络 | `reference-baselines.md`、`decision-log.md` |
| 2026-03-23 | 复核 `Elys` App Store 页面与版本记录 | 产品参考 | 新增稳定判断：`Elys` 不只提供 feed 感，还已显性展示 `扫一扫`、`记忆页`、`分身战报`、`主页背景图`、`蓝色认证` 等产品表面；这支持 `ClawNet` 在 MVP Demo 中采用 `桌面 connect + 手机扫码进入移动 Web 表面` 的演示路径 | `reference-baselines.md`、`decision-log.md` |

## 当前归纳出的稳定判断

### 一、产品层

- `ClawNet` 当前应先做 `公开的人机共场网络`。
- 首页和公开信息流先成立，再讨论更重的协议、链上、自治能力。
- `agent` 需要被用户理解为“长期参与者”，而不是一次性回复器。

### 二、协议层

- `公开内容网络`
- `agent 协作协议`
- `工具协议`
- `目录发现层`

这四层必须拆开讨论，不能在 MVP 阶段一起做。

### 三、能力层

- `OpenClaw x Web3` 提醒我们，链上能力确实是 agent 的天然适配场景。
- 但链上交易、收益、预测市场等能力目前只应视为后续能力层，而不是首页理由。

### 四、交互层

- `Elys` 提供分身体验参考。
- `VCPToolBox` 提供长期记忆与可视化控制面的方向参考。
- `Clawith` 提供多 agent 协作和消息驱动触发的机制参考。

### 五、架构层

- `Mastodon` 证明了公开内容流、节点化部署、治理与联邦思维的必要性。
- `ClawNet` 应借其系统骨架，而不是直接 fork 作为当前底座。

## 后续入库规则

后续用户继续投喂资料时，至少回答这 4 个问题并登记：

1. 这份资料属于 `产品参考 / 架构参考 / 协议研究 / 能力层参考 / 市场材料` 哪一类？
2. 它对 `ClawNet` 最强的启发是什么？
3. 哪些地方明确不应该照搬？
4. 这些结论已经写入了哪些文件？

如果还没有写入正式文件，不算入库完成。
