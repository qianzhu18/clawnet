---
title: 开发流程
status: active
owner: founder
last_updated: 2026-03-20
---

# 开发流程

## 目标

用纪律驱动开发，而不是从想法直接跳到代码。

本项目采用两层方法组合：

- `BMAD-METHOD`：负责项目级分析、规划、架构、Epic 与 Story 拆分。
- `Spec Kit`：负责功能级规格、澄清、技术计划、任务拆解与实现。

简单理解：

- `BMAD` 决定“做什么、为什么这样做、阶段怎么排”。
- `Spec Kit` 决定“这个功能如何从描述走到可实现”。

## 阶段 1：方向冻结

进入条件：

- 项目已经有方向，但边界还不稳定。

动作：

- 先把新增外部参考写入 `01_strategy/reference-ingestion-log.md`。
- 更新 `01_strategy/business-plan.md`。
- 更新 `01_strategy/reference-baselines.md`。
- 更新 `02_product/product-direction.md`。
- 把未定项记录到 `02_product/open-questions.md`。

退出条件：

- 明确目标用户。
- 明确当前阶段要验证的核心问题。
- 明确当前阶段不做什么。

## 阶段 2：产品与 UI 拆解

进入条件：

- 产品方向已经能描述主要用户路径。

动作：

- 更新 `02_product/information-architecture.md`。
- 更新 `02_product/ui-decomposition.md`。
- 把产品拆成 Epic 和 Feature，写入 `03_execution/backlog.md`。

退出条件：

- 每个关键页面都有清晰目的。
- 每个关键页面都知道模块、状态、动作。
- Phase 0 和 Phase 1 的范围已经清楚。

## 阶段 3：项目级规划，使用 BMAD

建议输出：

- PRD 摘要
- 架构摘要
- Epic / Story 清单
- 风险清单

最终经人工确认后的结论，必须写回：

- `01_strategy/business-plan.md`
- `01_strategy/reference-ingestion-log.md`
- `02_product/product-direction.md`
- `02_product/open-questions.md`
- `03_execution/backlog.md`

不要把关键结论只留在聊天里。

## 阶段 4：功能级执行，使用 Spec Kit

每个功能按下面顺序推进：

1. 在 `03_execution/feature-specs/` 创建对应文件。
2. 写清楚用户目标、范围、验收标准、明确不做什么。
3. 先澄清未知问题，再写技术方案。
4. 写技术计划。
5. 拆任务。
6. 前五步完成后再进入实现。

如果后续安装 `Spec Kit`，建议命令映射如下：

- `/speckit.constitution`：仓库级原则
- `/speckit.specify`：起草单个功能规格
- `/speckit.clarify`：补齐缺失决策
- `/speckit.plan`：确定技术方案
- `/speckit.tasks`：生成任务清单
- `/speckit.analyze`：找不一致、过度设计、遗漏项
- `/speckit.implement`：在规格稳定后实现

## 阶段 5：实现复盘

编码前检查：

- 功能规格是否存在。
- 未决问题是否已解决或已明确延期。
- 当前功能是否属于当前阶段范围。

编码后检查：

- 是否逐条满足验收标准。
- 是否记录了关键取舍到 `decision-log.md`。
- 是否更新了 `backlog.md` 状态。
- 如果范围变化，是否同步更新 `roadmap.md`。

## Ready 的定义

一个功能只有满足以下条件，才算 ready：

- 目标已写清楚。
- 范围已写清楚。
- 验收标准已写清楚。
- 明确不做什么已写清楚。
- 依赖项已知。
- 未知决策已被跟踪。

## Done 的定义

一个功能只有满足以下条件，才算 done：

- 验收标准满足。
- 测试或人工验证方式已记录。
- 后续工作已写入 backlog 或 open questions。
- 如有架构或范围变化，decision log 已更新。

## 反模式

避免以下情况：

- 没有规格先写代码。
- 把历史 BP 当成当前真相。
- 把战略、产品、任务、草稿混在一个文件里。
- 让未决规则只存在于聊天记录里。
- 同时把 `BMAD` 和 `Spec Kit` 都当主流程，导致双重维护。
