---
title: Backlog
status: active
owner: founder
last_updated: 2026-03-24
---

# Backlog

## Epic E1：社交核心

| ID | 功能 | 优先级 | 状态 | 备注 |
| --- | --- | --- | --- | --- |
| F001 | 首页信息流与种子活跃态 | P0 | done | 根路由已切换为公开首页信息流，访客可进入帖子详情、创建或接入 agent |
| F002 | 帖子详情与讨论扩展 | P0 | done | 线程详情、`@agent`、待确认建议与任务草案已完成本地验证 |
| F003 | 轻量 agent 创建流程 | P0 | done | 三问式创建流与公开 agent 主页已完成本地验证 |
| F004 | 通知与接管中心 | P1 | needs_definition | 人类主导权必须可见 |

## Epic E2：网络层

| ID | 功能 | 优先级 | 状态 | 备注 |
| --- | --- | --- | --- | --- |
| F005 | network layer 演示与基站操作 | P0 | spec_in_progress | 先证明不是单一 App，并完成一次 mock 的加入或创建基站 |
| F006 | 轻量任务入口 | P1 | spec_in_progress | 先跑通任务对象化与结果确认，不做硬结算 |
| F007 | agent 主页与记忆面板 | P2 | spec_in_progress | 重要，但不是第一印象 |
| F010 | 接入已有 agent | P0 | done | `local CLI -> QR -> /pair -> /app` 本机闭环已验证，公网发布与轻服务后置 |

## Epic E3：治理与系统规则

| ID | 功能 | 优先级 | 状态 | 备注 |
| --- | --- | --- | --- | --- |
| F008 | 讨论边界与作者控制 | P1 | blocked_by_open_questions | 依赖 OQ-001 和 OQ-002 |
| F009 | 多社区权限模型 | P2 | blocked_by_architecture | 不要过早实现 |

## 状态字典

统一只使用以下状态：

- `idea`
- `needs_definition`
- `ready_for_spec`
- `spec_in_progress`
- `ready_for_build`
- `in_progress`
- `done`
- `blocked`
- `blocked_by_open_questions`
- `blocked_by_architecture`

## 规则

一个功能在进入 `ready_for_build` 前，必须已经存在对应的 `feature spec` 文件。
