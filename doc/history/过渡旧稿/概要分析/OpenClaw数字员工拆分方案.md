---
title: OpenClaw数字员工拆分方案
status: active
owner: founder
last_updated: 2026-03-29
---

# OpenClaw 数字员工拆分方案

## 1. 这份文件回答什么

这份文件只回答 5 个问题：

- 当前 `OpenClaw` 里最值得先拆哪几类数字员工
- 每个数字员工负责什么，不负责什么
- 它们应该怎么隔离，避免上下文污染
- `Lightpanda` 应该接在哪一层
- “公众号排版 Skill” 这类能力应放在谁手里

它不负责：

- 最终公司组织架构
- 正式 CRM / 工单系统建表
- 多租户 SaaS 平台
- 第二宿主接入

## 2. 先定一个总原则

当前不推荐一上来做“所有岗位都能聊天、都能直接对外”。

更合理的最小结构是：

- 一个前台主人格
- 多个后台专职工种

也就是：

- 对外只有一个主要说话的人
- 后台由多个隔离 Agent 分工

这样可以避免：

- 人设混乱
- 上下文污染
- 职责不清
- 工具权限过大

## 3. 当前最小数字员工编制

当前建议固定为 4 个角色。

### 3.1 Front Desk / 主对话人设

定位：

- 对外唯一主入口
- 负责和用户聊天
- 负责判断该把任务转给谁

负责：

- 日常对话
- 任务分发
- 汇总多个专职 Agent 的结果
- 保持统一语气、人设和品牌感

不负责：

- 自己去大量爬网页
- 自己长时间跑浏览器
- 自己做公众号最终排版脚本

推荐工具边界：

- `read`
- `browser` 只读可选
- `message send`
- 不默认给重度 `exec`

### 3.2 Topic Scout / 每日选题助手

定位：

- 负责搜集素材和生成候选选题池

负责：

- 抓取网页、社媒、行业站点
- 汇总热点、趋势、竞品更新
- 形成“选题卡片”
- 输出结构化素材包给写作 Agent

不负责：

- 直接对外聊天
- 最终公众号发布
- 客服对话

推荐工具边界：

- `browser`
- `web search`
- `read`
- 必要时 `exec`

输出物建议：

- `topics/YYYY-MM-DD.md`
- 每条包含：
  - 标题
  - 来源
  - 摘要
  - 为什么值得写
  - 风险 / 待核实点

### 3.3 Writer / 公众号写作与 Markdown 成文助手

定位：

- 把选题素材包变成可审阅的公众号 Markdown 初稿

负责：

- 确认文章结构
- 生成 Markdown 草稿
- 保持栏目语气和写作格式
- 补标题、提纲、摘要、金句、图注

不负责：

- 自己满网搜索
- 直接回复客服问题
- 直接扮演前台人格

推荐工具边界：

- `read`
- `write`
- 轻量 `browser` 可选
- 不默认开放重度爬取

输出物建议：

- `articles/drafts/YYYY-MM-DD-topic-slug.md`
- `articles/briefs/YYYY-MM-DD-topic-slug.md`

### 3.4 Support / 智能客服助手

定位：

- 处理 FAQ、售前咨询、常见问题、分流转人工

负责：

- 标准问答
- 产品说明
- 线索初筛
- 收集用户问题并回写知识库

不负责：

- 写公众号
- 跑浏览器搜热点
- 承担品牌主人格

推荐工具边界：

- `read`
- `message send`
- FAQ / 知识库检索
- 不默认开放 `browser`

输出物建议：

- `support/faq.md`
- `support/escalations.md`
- `support/lead-notes/YYYY-MM-DD.md`

## 4. 当前不建议的拆法

### 4.1 不建议“一个 Agent 干完全部”

原因：

- 很快会把“聊天、写作、客服、爬虫”全混进一个脑子里
- 记忆和风格污染会越来越严重

### 4.2 不建议“每个岗位都直接接一个频道”

当前阶段更合理的是：

- 前台主人格接频道
- 后台工种不直接对外

否则用户会面对多个 bot，同一个任务多口径回复。

### 4.3 不建议把浏览器能力给所有 Agent

浏览器是高成本、高风险工具。

当前最适合给它的只有：

- `Topic Scout`

最多再给：

- `Writer` 的只读补查能力

## 5. 公众号排版 Skill 该放哪

这里要明确一个事实：

- `xiaohu-wechat-format` 上游仓库是 **Claude/Codex 风格 Skill**
- 它的 `SKILL.md` 不是当前 `OpenClaw` 直接可识别的 frontmatter 格式

所以它当前不能被当成“原样可装的 OpenClaw Skill”。

正确做法是：

1. 保留它的 Python 脚本和主题系统
2. 在 `OpenClaw` 里包装一个新的 workspace skill
3. 由 `Writer` 或独立 `Formatter / Publisher` 调用

当前建议：

- 第一阶段先让 `Writer` 产出 Markdown
- 第二阶段再补一个 `wechat-format` workspace skill，负责：
  - Markdown -> 微信兼容 HTML
  - 可选封面
  - 可选推草稿箱

## 6. `Lightpanda` 应该接在哪

当前建议把 `Lightpanda` 作为：

- `Topic Scout` 的浏览器执行层

不建议把它当成：

- 所有 Agent 共用的唯一浏览器底座
- 当前客服和前台主人格的主浏览器

原因：

- 它对 AI agent 很友好
- 支持通过 `CDP` 接入 Playwright / Puppeteer
- 但当前仍是 `Beta / WIP`

所以更稳妥的接法是：

- 只给 `Topic Scout` 建一个 `lightpanda` profile
- 用它执行抓取、截图、页面快照、信息提取
- 前台和客服先继续保持轻浏览器或无浏览器

## 7. 代理隔离怎么做

这里要分 4 层隔离。

### 7.1 Workspace 隔离

每个 Agent 独立一个 workspace：

- `workspace-frontdesk`
- `workspace-topic-scout`
- `workspace-writer`
- `workspace-support`

里面各自有：

- `AGENTS.md`
- `SOUL.md`
- `USER.md`
- `TOOLS.md`
- `HEARTBEAT.md`
- `memory/`
- `skills/`

### 7.2 AgentDir / Session 隔离

每个 Agent 也要有独立：

- `agentDir`
- `sessions`

这样身份、认证、历史记录才不会串。

### 7.3 Tool 隔离

每个岗位只给自己需要的工具：

- `Front Desk`：轻交互、轻检索
- `Topic Scout`：浏览器、搜索、读写
- `Writer`：读写、排版
- `Support`：知识库读取、消息回复

### 7.4 Channel 隔离

当前建议：

- `Telegram` / `Feishu` 等真实对外入口，先只绑 `Front Desk`
- 其他 Agent 先不直接绑外部频道

## 8. 推荐的最小落地顺序

### 第一步：先冻结编制，不急着接频道

固定 4 个角色：

- `frontdesk`
- `topic-scout`
- `writer`
- `support`

### 第二步：先把现有空壳工作区重写成人设文件

当前机器上虽然已有：

- `main`
- `coder`
- `security`
- `assistant`

但它们还是通用模板，尚未形成业务岗位。

更合理的做法是：

- 重写为业务岗位
- 或新建更语义化的 Agent 并逐步替换旧壳

### 第三步：先只让 Front Desk 接 Telegram

这样用户永远只面对一个主入口。

### 第四步：让 Topic Scout 先接 `Lightpanda`

先验证：

- 浏览器起得来
- 页面抓取得动
- 输出主题卡片

### 第五步：把公众号排版包装成 OpenClaw skill

先别急着发公众号。

先做到：

- Markdown 草稿可自动排版成微信 HTML

## 9. 当前最值得先做的 3 件事

1. 冻结 4 个岗位的人设、职责和工具边界
2. 把 `xiaohu-wechat-format` 包成 OpenClaw workspace skill
3. 给 `Topic Scout` 补 `Lightpanda` 浏览器 profile 并做一次抓取验证

## 10. 一句话结论

当前最合理的不是“一个大而全的万能数字员工”，而是：

- 一个前台主人格
- 一个选题侦察兵
- 一个写作成文助手
- 一个客服助手

再把 `Lightpanda` 收进选题助手的浏览器层，把公众号排版 Skill 收进写作链路。
