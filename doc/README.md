# 文档系统说明

`doc/` 是本项目唯一的正式文档系统，用来管理战略、产品、执行、研究与治理。

## 如果当前只做 MVP Demo，先看这 7 个文件

先不要试图同时维护所有文档。  
当前如果目标是 `做一个能对外讲解的最小演示`，默认只看：

- `02_product/product-direction.md`
- `02_product/ui-decomposition.md`
- `02_product/mobile-web-design-brief.md`（对外可交付的 Web App 设计交付文档）
- `02_product/information-architecture.md`
- `02_product/open-questions.md`
- `03_execution/backlog.md`
- `03_execution/decision-log.md`
- `03_execution/mvp-validation-runbook.md`
- 当前阶段对应的 `03_execution/feature-specs/`

其余文件先视为背景资料，不参与日常推进。

## 如果当前已经进入执行周，再多看 3 个文件

- `05_todo/todo-list.md`
- `05_todo/todo-verification-log.md`
- `06_learning/learning-atoms.md`

前两者回答“这周到底做什么、怎么检查完成”，最后一者回答“边做边学到底学到了什么”。

## 目录结构

```text
doc/
├── README.md
├── 00_governance/
├── 01_strategy/
├── 02_product/
├── 03_execution/
├── 04_templates/
├── 05_todo/
├── 06_learning/
└── 99_archive/
```

## 各目录职责

- `00_governance/`：文档规则、协作规则、开发流程。
- `00_governance/` 也包含给新手使用的简化入口文档。
- `01_strategy/`：当前有效的商业计划、对标背景、市场定位。
- `01_strategy/` 也承载正式参考研究，例如协议调研、网络形态调研、对标拆解。
- `02_product/`：产品方向、信息架构、UI 拆解、未决问题。
- `02_product/` 也承载稳定的数据模型和核心用户流。
- `03_execution/`：路线图、Backlog、决策日志、功能规格。
- `04_templates/`：后续复用的模板。
- `05_todo/`：本周执行队列、优先级排布与检测日志。
- `06_learning/`：边做边学的知识原子沉淀。
- `99_archive/`：历史版本、原始材料、已归档文件。归档文件默认不再直接编辑。

## 当前有效文档

项目发生变化时，优先更新这些文件：

- `01_strategy/business-plan.md`
- `01_strategy/reference-baselines.md`
- `01_strategy/reference-ingestion-log.md`
- `01_strategy/agent-network-research.md`
- `01_strategy/agent-network-research-xmind.md`
- `02_product/product-direction.md`
- `02_product/information-architecture.md`
- `02_product/ui-decomposition.md`
- `02_product/mobile-web-design-brief.md`
- `02_product/core-domain-model.md`
- `02_product/core-user-flows.md`
- `02_product/website-image-prompts.md`
- `02_product/open-questions.md`
- `03_execution/roadmap.md`
- `03_execution/backlog.md`
- `03_execution/decision-log.md`

## 文件管理原则

1. 一个主题只保留一个当前有效文件。
2. 当前文件不再使用 `final`、`最终版`、`v2-final` 这类命名。
3. 历史版本一律移动到 `99_archive/`。
4. 新功能规格统一放在 `03_execution/feature-specs/`，命名为 `F###-slug.md`。
5. 未定规则必须进入 `02_product/open-questions.md`，不能只停留在聊天记录里。
6. 重要结论和取舍必须进入 `03_execution/decision-log.md`。
7. 开始开发之前，必须先有功能规格文件。
8. 本项目文档默认使用中文；文件名可保留英文 kebab-case 以便维护。

## 推荐更新顺序

1. 战略变化：更新 `01_strategy/business-plan.md`。
2. 对标和参考变化：先更新 `01_strategy/reference-ingestion-log.md`，再同步 `01_strategy/reference-baselines.md`。
3. 需要长期保留的深度调研：新建或更新 `01_strategy/` 下的专题研究文件。
4. 产品定义变化：更新 `02_product/product-direction.md`。
5. 页面与交互变化：更新 `02_product/information-architecture.md` 和 `02_product/ui-decomposition.md`。
6. 新的不确定项：更新 `02_product/open-questions.md`。
7. 新工作项：更新 `03_execution/backlog.md`。
8. 新功能进入实现前：创建或更新对应的 `feature spec`。
9. 重大结论形成后：更新 `03_execution/decision-log.md`。

## 为什么这样管理

- 把“当前真相”和“历史草稿”彻底分开。
- 把“战略问题”“产品问题”“执行问题”分开管理。
- 把聊天里的隐性结论沉淀到文件里，避免换一个会话就丢失上下文。
- 让任何一次开发都必须经过规格、澄清、任务、实现的完整链路。

开始新工作前，先读 `00_governance/development-process.md` 和项目根目录 `AGENTS.md`。

如果对整个文件系统和推进顺序仍不熟，先读：

- `00_governance/newcomer-guide.md`

## 外部资料如何入库

用户在聊天里持续提供：

- GitHub 仓库
- 文章与长文
- 截图
- 链接和项目简介

这些内容如果会影响后续判断，就不能只停留在聊天里。

固定动作：

1. 先写入 `01_strategy/reference-ingestion-log.md`
2. 再提炼并写回 `01_strategy/reference-baselines.md`
3. 如果产生新取舍，更新 `03_execution/decision-log.md`
4. 如果产生新未决项，更新 `02_product/open-questions.md`

这样做的目的，是确保更换对话窗口后，新的 AI 助手能直接从文档恢复上下文，而不是重新依赖聊天历史。
