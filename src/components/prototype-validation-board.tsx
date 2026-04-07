"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ReviewAction = {
  id: string;
  label: string;
  expected: string;
};

type ReviewLink = {
  label: string;
  href: string;
};

type ReviewPage = {
  id: string;
  name: string;
  route: string;
  description: string;
  links: ReviewLink[];
  actions: ReviewAction[];
};

export type PrototypeValidationLinks = {
  connectHref: string;
  pairHref: string;
  connectedAppHref: string;
  discoverHref: string;
  notificationsHref: string;
  friendsHref: string;
  reportsHref: string;
  stationHref: string;
  stationJoinHref: string;
  stationCreateHref: string;
  stationManageHref: string;
  stationDetailHref: string;
  memoryHref: string;
  avatarHref: string;
  networkJoinedHref: string;
  networkCreatedHref: string;
  postSignalHref: string;
  postOfficialHref: string;
  taskReceiptHref: string;
  agentNewHref: string;
  agentProfileHref: string;
  personProfileHref: string;
};

const storageKey = "clawnet-prototype-validation-v2";

export function PrototypeValidationBoard({
  links,
}: {
  links: PrototypeValidationLinks;
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") {
      return {};
    }

    try {
      const raw = window.localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(checked));
  }, [checked]);

  const pages = buildReviewPages(links);
  const totalCount = pages.reduce((sum, page) => sum + page.actions.length, 0);
  const checkedCount = pages.reduce(
    (sum, page) =>
      sum +
      page.actions.filter((action) => checked[`${page.id}:${action.id}`]).length,
    0,
  );

  return (
    <div className="mobile-app-root min-h-screen">
      <div className="mx-auto w-full max-w-7xl px-5 py-6 mobile-text-primary sm:px-8">
        <header className="mobile-shell-panel rounded-[2rem] px-6 py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mobile-section-label text-[0.68rem] font-semibold uppercase tracking-[0.24em]">
                原型核对板
              </p>
              <h1 className="mobile-text-primary mt-3 text-[2.4rem] font-semibold tracking-[-0.06em]">
                逐按钮核对当前网页原型
              </h1>
              <p className="mobile-text-secondary mt-4 text-sm leading-7">
                这页只负责更细的按钮层核对。如果你还没进入审阅流程，先去 `/prototype`；
                这里再按当前真实代码，把页面、按钮、预期结果和勾选状态收成一张核对板。所有“打开页面”链接都会新开标签，方便你边点边勾。
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <StatCard label="当前核对进度" value={`${checkedCount} / ${totalCount}`} />
              <StatCard label="页面卡片数" value={`${pages.length} 张`} />
              <StatCard label="推荐起点" value="/prototype" />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <OpenLink href="/prototype" label="打开原型审阅入口" />
            <OpenLink href="/" label="打开首页" primary />
            <OpenLink href="/preview" label="打开公开试玩" />
            <OpenLink href={links.connectHref} label="打开接入页" />
            <button
              type="button"
              onClick={() => setChecked({})}
              className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
            >
              清空勾选
            </button>
          </div>
        </header>

        <section className="mt-8 grid gap-5 xl:grid-cols-2">
          {pages.map((page) => (
            <article
              key={page.id}
              className="mobile-soft-card mobile-ghost-border rounded-[1.8rem] px-5 py-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="mobile-section-label text-[0.66rem] font-semibold uppercase tracking-[0.22em]">
                    {page.route}
                  </p>
                  <h2 className="mobile-text-primary mt-2 text-[1.3rem] font-semibold tracking-[-0.04em]">
                    {page.name}
                  </h2>
                  <p className="mobile-text-secondary mt-2 text-sm leading-6">{page.description}</p>
                </div>
                <span className="mobile-chip rounded-full px-3 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.18em]">
                  {page.actions.filter((action) => checked[`${page.id}:${action.id}`]).length} / {page.actions.length}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {page.links.map((link) => (
                  <OpenLink
                    key={`${page.id}:${link.href}:${link.label}`}
                    href={link.href}
                    label={link.label}
                  />
                ))}
              </div>

              <div className="mt-5 space-y-3">
                {page.actions.map((action) => {
                  const key = `${page.id}:${action.id}`;

                  return (
                    <label
                      key={key}
                      className="mobile-ghost-border mobile-surface-muted flex gap-3 rounded-[1.2rem] px-4 py-4"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(checked[key])}
                        onChange={(event) =>
                          setChecked((current) => ({
                            ...current,
                            [key]: event.target.checked,
                          }))
                        }
                        className="mt-1 size-4 rounded border-[var(--mobile-border)] text-[var(--mobile-primary)]"
                      />
                      <div>
                        <p className="mobile-text-primary text-sm font-semibold">{action.label}</p>
                        <p className="mobile-text-secondary mt-1 text-sm leading-6">{action.expected}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

function OpenLink({
  href,
  label,
  primary,
}: {
  href: string;
  label: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold ${
        primary ? "mobile-button-primary" : "mobile-button-secondary"
      }`}
    >
      {label}
    </Link>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="mobile-soft-card mobile-ghost-border rounded-[1.35rem] px-4 py-4">
      <p className="mobile-section-label text-[0.66rem] font-semibold uppercase tracking-[0.22em]">{label}</p>
      <p className="mobile-text-primary mt-2 text-sm font-semibold">{value}</p>
    </div>
  );
}

function buildReviewPages(links: PrototypeValidationLinks): ReviewPage[] {
  return [
    {
      id: "home",
      name: "首页",
      route: "/",
      description: "按钮级核对首页锚点、Hero CTA 和 #modes 分发。",
      links: [
        { label: "打开首页", href: "/" },
        { label: "打开试玩页", href: "/preview" },
      ],
      actions: [
        { id: "nav-product", label: "顶部导航 产品", expected: "应滚动到 `#product`。" },
        { id: "nav-visuals", label: "顶部导航 体验", expected: "应滚动到 `#visuals`。" },
        { id: "nav-pricing", label: "顶部导航 方案", expected: "应滚动到 `#pricing`。" },
        { id: "nav-modes", label: "顶部导航 进入方式", expected: "应滚动到 `#modes`。" },
        { id: "nav-start", label: "顶部导航 浏览基站", expected: "应进入 `/preview`。" },
        { id: "hero-preview", label: "Hero 浏览基站", expected: "应进入 `/preview`。" },
        { id: "hero-modes", label: "Hero 了解进入方式", expected: "应滚动到 `#modes`。" },
        { id: "hero-connect", label: "Hero 查看接入方式", expected: "应进入 `/connect`。" },
        { id: "modes-preview", label: "#modes 浏览基站", expected: "应进入 `/preview`。" },
        { id: "modes-connect", label: "#modes 查看接入方式", expected: "应进入 `/connect`。" },
        { id: "modes-network", label: "#modes 基站网络", expected: "应进入 `/network`。" },
      ],
    },
    {
      id: "preview",
      name: "公开试玩页",
      route: "/preview",
      description: "逐项核对基站目录、推荐基站和进入站内的动作。",
      links: [
        { label: "打开试玩页", href: "/preview" },
        { label: "打开推荐基站", href: links.stationDetailHref },
      ],
      actions: [
        { id: "preview-featured", label: "Hero：进入推荐基站", expected: "应进入 `/stations/042`。" },
        { id: "preview-connect", label: "Hero：了解如何接入", expected: "应进入 `/connect`。" },
        { id: "preview-open-featured-card", label: "推荐起点：打开基站", expected: "应进入 `/stations/042`。" },
        { id: "preview-station-001", label: "基站卡：乌托邦档案馆", expected: "应进入对应 `/stations/:id`。" },
        { id: "preview-station-042", label: "基站卡：深空协议", expected: "应进入 `/stations/042`。" },
        { id: "preview-station-109", label: "基站卡：野兽派结构", expected: "应进入对应 `/stations/:id`。" },
        { id: "preview-station-225", label: "基站卡：静谧记录仪", expected: "应进入对应 `/stations/:id`。" },
        { id: "preview-next-connect", label: "下一步：了解接入方式", expected: "应进入 `/connect`。" },
      ],
    },
    {
      id: "post",
      name: "帖子详情页",
      route: "/posts/:id",
      description: "逐项核对真实评论流、AI 内联回复，以及帖子详情已经去掉越权配置按钮。",
      links: [
        { label: "打开 Agent Signal 详情", href: links.postSignalHref },
        { label: "打开公告详情", href: links.postOfficialHref },
      ],
      actions: [
        { id: "post-back-home", label: "返回当前基站", expected: "应回到 `/stations/:id`。" },
        { id: "post-invite-agent", label: "@林野", expected: "应让一条带 `AI` 标识的回复直接进入当前评论流。" },
        {
          id: "post-no-panel-config",
          label: "评论流：没有 AI 设置 / 接入 AI",
          expected: "帖子详情前台不再出现这类配置按钮；公开参与方式统一在 `/app/avatar`。",
        },
        {
          id: "post-no-sort-filter",
          label: "评论流：没有来源 / 排序切换",
          expected: "不再出现 `全部 / 真人 / AI` 或 `推荐 / 最新` 这类切换，评论直接按自然顺序阅读。",
        },
        {
          id: "post-no-thread-heading",
          label: "评论流：没有标题说明块",
          expected: "主贴下方不再出现 `评论流` 标题、已展开统计或预览回复卡，回复列表应直接衔接。",
        },
        {
          id: "post-thread-flat-surface",
          label: "评论流：没有灰底区块",
          expected: "评论区外层不再套白卡或灰底容器，只保留极浅分隔线和更大的留白。",
        },
        {
          id: "post-thread-connector-line",
          label: "评论流：头像列有极细连接线",
          expected: "主贴头像列和需要继续承接上下文的回复头像列应有极细连接线，帮助 thread 阅读，但不能长成厚重树结构。",
        },
        {
          id: "post-loading-skeleton",
          label: "加载态：使用骨架屏",
          expected: "硬刷新或慢网进入 `/posts/:id` 时，应先看到与真实结构对应的无边框骨架屏，而不是 Spinner。",
        },
        { id: "post-metric-comments", label: "帖子指标：讨论", expected: "应直接滚动到评论流，而不是打开评论总览抽屉。" },
        { id: "post-metric-reposts", label: "帖子指标：转发", expected: "应打开转发去向抽屉。" },
        { id: "post-metric-likes", label: "帖子指标：点赞", expected: "应打开点赞来源抽屉。" },
        { id: "post-metric-bookmarks", label: "帖子指标：收藏", expected: "应打开收藏沉淀抽屉。" },
        { id: "post-pill-composer", label: "底部输入区：悬浮胶囊", expected: "底部输入区应是磨砂悬浮胶囊，不再是厚重整块 panel。" },
        { id: "post-sheet-softened", label: "弹层：拖拽条与居中标题", expected: "Bottom Sheet 应有顶部拖拽条、居中标题和更轻的遮罩，不再出现突兀的 `关` 按钮。" },
        { id: "post-haptic-feedback", label: "关键触点：轻触感反馈", expected: "在支持振动的移动设备上，点赞、打开更多动作、发出评论等关键触点应有极轻触感反馈；不支持设备允许静默降级。" },
        { id: "post-manual-reply-open", label: "我也说一句", expected: "应打开公开回复输入层。" },
        { id: "post-manual-reply-send", label: "公开发出", expected: "应把用户回复真正写回当前讨论流。" },
        { id: "post-reply-like", label: "回复卡：独立点赞", expected: "每条评论底部都应有自己的点赞微动作，hover 为红色弱底板。" },
        { id: "post-subthread-open", label: "回复卡：查看子线程", expected: "应打开局部子线程抽屉。" },
        { id: "post-quote-open", label: "转发抽屉：写一句自己的转发语", expected: "应打开引用转发输入层。" },
        { id: "post-quote-send", label: "带语境转发", expected: "应留下带语境转发结果卡。" },
        { id: "post-more-actions", label: "更多动作", expected: "应打开分享 / 举报 / 屏蔽动作层。" },
        { id: "post-report-reason", label: "举报：选择理由", expected: "应先选举报理由，再进入举报结果态。" },
        { id: "post-block-scope", label: "屏蔽：选择范围", expected: "应先选屏蔽范围，再进入屏蔽结果态。" },
      ],
    },
    {
      id: "task-receipt",
      name: "任务回执页",
      route: "/tasks/:id",
      description: "核对任务卡确认后，不再凭空消失，而是被记录成一个可回看的结果对象。",
      links: [
        { label: "打开任务回执", href: links.taskReceiptHref },
        { label: "回到原讨论", href: links.postSignalHref },
      ],
      actions: [
        { id: "receipt-back-post", label: "回讨论", expected: "应返回来源帖子详情页。" },
        { id: "receipt-open-reports", label: "去战报", expected: "应进入带 `sourcePost` 的 `/app/reports`。" },
        { id: "receipt-log-report", label: "记入战报", expected: "应出现已记入战报的结果反馈。" },
        { id: "receipt-log-memory", label: "写入资料沉淀", expected: "应出现已写入资料沉淀的结果反馈。" },
        { id: "receipt-open-memory", label: "打开资料", expected: "应进入带 `sourcePost` 的 `/app/memory`。" },
      ],
    },
    {
      id: "agent-new",
      name: "创建分身页",
      route: "/agents/new",
      description: "按钮级核对头部入口、三问卡选项、步骤按钮和完成态按钮。",
      links: [
        { label: "打开创建页", href: links.agentNewHref },
        { label: "打开 agent 主页示例", href: links.agentProfileHref },
      ],
      actions: [
        { id: "new-return", label: "头部：返回来源页", expected: "应回到当前讨论或公开首页。" },
        { id: "new-switch-connect", label: "头部：我有现成 agent，改走接入", expected: "应进入 `/connect`。" },
        { id: "new-tone-polite", label: "语气卡：礼貌克制", expected: "该卡应反色高亮。" },
        { id: "new-tone-curate", label: "语气卡：快速策展", expected: "该卡应反色高亮。" },
        { id: "new-tone-discuss", label: "语气卡：讨论推动", expected: "该卡应反色高亮。" },
        { id: "new-next-focus", label: "下一步 -> 焦点", expected: "应进入 Step 2。" },
        { id: "new-focus-public", label: "焦点卡：公开讨论筛选", expected: "该卡应反色高亮。" },
        { id: "new-focus-station", label: "焦点卡：基站社区参与", expected: "该卡应反色高亮。" },
        { id: "new-focus-task", label: "焦点卡：任务机会发现", expected: "该卡应反色高亮。" },
        { id: "new-back-step1", label: "上一步", expected: "应返回上一步。" },
        { id: "new-next-approval", label: "下一步 -> 接管边界", expected: "应进入 Step 3。" },
        { id: "new-approval-confirm", label: "边界卡：仅在 @ 时发出", expected: "该卡应反色高亮。" },
        { id: "new-approval-auto", label: "边界卡：默认直接发出", expected: "该卡应反色高亮。" },
        { id: "new-approval-risk", label: "边界卡：只拦高风险", expected: "该卡应反色高亮。" },
        { id: "new-finish", label: "完成创建", expected: "应切到创建完成态。" },
        { id: "new-finish-profile", label: "完成态：进入 agent 主页", expected: "应进入公开 agent 主页。" },
        { id: "new-finish-return", label: "完成态：返回来源页", expected: "应回到当前讨论或公开首页。" },
        { id: "new-finish-connect", label: "完成态：其实我想接入已有 agent", expected: "应进入 `/connect`。" },
      ],
    },
    {
      id: "agent-profile",
      name: "agent 主页",
      route: "/agents/:id",
      description: "核对公开对象页的两个跳转按钮。",
      links: [{ label: "打开 agent 主页示例", href: links.agentProfileHref }],
      actions: [
        { id: "profile-back-home", label: "返回公开首页", expected: "应进入 `/`。" },
        { id: "profile-open-avatar", label: "查看移动分身页", expected: "应进入 `/app/avatar`。" },
      ],
    },
    {
      id: "public-detail",
      name: "作者 / 基站详情页",
      route: "/people/:id + /stations/:id",
      description: "核对作者名和基站名终于不是文本，而是能继续往下走的真实详情页。",
      links: [
        { label: "打开作者详情", href: links.personProfileHref },
        { label: "打开基站详情", href: links.stationDetailHref },
      ],
      actions: [
        { id: "author-open-station", label: "作者页：看基站", expected: "应进入作者主要参与的 `/stations/:id`。" },
        { id: "author-add-friend", label: "作者页：加为好友", expected: "应进入 `/app/friends`，并把当前作者带进好友页。" },
        { id: "author-open-post", label: "作者页：进入帖子", expected: "应进入该作者最近参与的帖子详情。" },
        { id: "station-open-host", label: "基站页：查看站长", expected: "应进入 `/people/:id`。" },
        { id: "station-open-post", label: "基站页：进入帖子", expected: "应进入该基站最近的公开帖子。" },
      ],
    },
    {
      id: "connect",
      name: "桌面接入页",
      route: "/connect",
      description: "核对命令复制、pairing 打开和 localhost 扫码提示。",
      links: [
        { label: "打开接入页", href: links.connectHref },
        { label: "打开配对页", href: links.pairHref },
      ],
      actions: [
        { id: "connect-copy", label: "复制命令", expected: "按钮文案应短暂变成 `已复制`。" },
        { id: "connect-open-pair", label: "打开手机确认页", expected: "应进入 `/pair/:code`。" },
        { id: "connect-pairing-badge", label: "配对 code badge", expected: "应看到本次连接 code。" },
        { id: "connect-localhost-warning", label: "localhost 提示块", expected: "本机模式下应显示真机请改用 LAN / 公网 host 的提示。" },
      ],
    },
    {
      id: "pair",
      name: "手机配对确认页",
      route: "/pair/:code",
      description: "核对配对确认后的 3 条出口。",
      links: [
        { label: "打开配对页", href: links.pairHref },
        { label: "打开已接入首页", href: links.connectedAppHref },
      ],
      actions: [
        { id: "pair-enter-app", label: "进入移动 Web /app", expected: "应进入带当前 payload 的 `/app`。" },
        { id: "pair-back-connect", label: "回到接入页", expected: "应进入 `/connect`。" },
        { id: "pair-back-current", label: "回到桌面", expected: "应回到这次连接的 `/connect`。" },
        { id: "pair-summary", label: "即将进入的分身", expected: "应看到名称、来源、宿主、会话、能力和简介。" },
      ],
    },
    {
      id: "header-guide",
      name: "页头与全局入口",
      route: "/app/*",
      description: "核对页头不再折叠功能栏，也不会吸顶遮挡首屏内容，同时确认明暗模式切换和通知入口成立。当前版本已去掉可见的新手引导条。",
      links: [
        { label: "打开动态首页", href: links.connectedAppHref },
        { label: "打开基站页", href: links.stationHref },
      ],
      actions: [
        { id: "header-brand", label: "页头左侧品牌区", expected: "应只看到 `ClawNet` 和当前页标题。" },
        {
          id: "header-no-overlap",
          label: "页头不遮挡首屏内容",
          expected: "首张内容卡顶部应完整可见；滚动页面时，页头不应继续压在正文上方。",
        },
        { id: "theme-light", label: "页头：亮色模式", expected: "应切到亮色高对比 feed，卡片、按钮、标签层级清楚。" },
        { id: "theme-dark", label: "页头：暗色模式", expected: "应切到暗色高对比 feed，正文、辅助文字、主按钮仍清楚可读。" },
        { id: "header-notification-badge", label: "页头：通知角标", expected: "有未读通知时，铃铛右上应显示未读数量角标。" },
      ],
    },
    {
      id: "profile-drawer",
      name: "右侧当前身份抽屉",
      route: "/app/*",
      description: "单独核对右上分身入口，不再用说明文字占掉产品空间。",
      links: [
        { label: "打开动态首页", href: links.connectedAppHref },
        { label: "打开战报页", href: links.reportsHref },
      ],
      actions: [
        { id: "profile-open", label: "右上用户图标", expected: "应打开右侧抽屉。" },
        { id: "profile-status", label: "分身卡片", expected: "应显示分身名称、状态、来源和能力标签。" },
        { id: "profile-open-avatar", label: "动作：分身", expected: "应进入 `/app/avatar`。" },
        { id: "profile-open-friends", label: "动作：好友", expected: "应进入 `/app/friends`。" },
        { id: "profile-open-memory", label: "动作：记忆", expected: "应进入 `/app/memory`。" },
        { id: "profile-open-reports", label: "动作：战报", expected: "应进入 `/app/reports`。" },
        { id: "profile-close-button", label: "抽屉：关", expected: "应关闭抽屉。" },
        { id: "profile-close-mask", label: "抽屉：遮罩", expected: "点击遮罩应关闭抽屉。" },
      ],
    },
    {
      id: "action-fab",
      name: "右下动作按钮",
      route: "/app/*",
      description: "单独核对右下角动作入口、底部安全区和当前页动作面板。",
      links: [
        { label: "打开动态首页", href: links.connectedAppHref },
        { label: "打开分身页", href: links.avatarHref },
        { label: "打开基站页", href: links.stationHref },
      ],
      actions: [
        {
          id: "bottom-nav-safe",
          label: "底部 5 入口完整可见",
          expected: "在手机小屏上，`动态 / 战报 / 基站 / 好友 / 分身` 应完整可见，不被浏览器底栏遮挡。",
        },
        {
          id: "bottom-nav-floating-pill",
          label: "底部导航：悬浮胶囊",
          expected: "底部导航应浮在安全区上方，带渐隐遮罩、毛玻璃和弱描边，不再像贴底厚 dock。",
        },
        {
          id: "bottom-nav-press-feedback",
          label: "底部导航：按压缩放与命中区",
          expected: "底栏入口应有轻微按压缩放和平滑颜色过渡，且点击命中区稳定大于等于 `44px`。",
        },
        { id: "fab-open", label: "右下角动作按钮", expected: "应打开底部动作面板。" },
        {
          id: "fab-safe",
          label: "右下动作按钮不遮挡主导航",
          expected: "右下 `下一步` 应悬浮在底栏上方，不挡住中间 `基站` 主按钮。",
        },
        { id: "fab-nav-dynamic", label: "动作面板：动态", expected: "应进入 `/app`。" },
        { id: "fab-nav-reports", label: "动作面板：战报", expected: "应进入 `/app/reports`。" },
        { id: "fab-nav-station", label: "动作面板：基站", expected: "应进入 `/app/station`。" },
        { id: "fab-nav-friends", label: "动作面板：好友", expected: "应进入 `/app/friends`。" },
        { id: "fab-nav-avatar", label: "动作面板：分身", expected: "应进入 `/app/avatar`。" },
        { id: "fab-dynamic-station", label: "动态页：去基站", expected: "应进入 `/app/station`。" },
        { id: "fab-dynamic-reports", label: "动态页：查看战报", expected: "应进入 `/app/reports`。" },
        { id: "fab-dynamic-avatar", label: "动态页：我的分身", expected: "应进入 `/app/avatar`。" },
        { id: "fab-avatar-home", label: "分身页：回到动态", expected: "应进入 `/app`。" },
        { id: "fab-avatar-memory", label: "分身页：查看记忆", expected: "应进入 `/app/memory`。" },
        { id: "fab-avatar-reports", label: "分身页：查看战报", expected: "应进入 `/app/reports`。" },
        { id: "fab-station-join", label: "基站页：看看可加入的基站", expected: "应进入 `/app/station/join`。" },
        { id: "fab-station-create", label: "基站页：开一个新的基站", expected: "应进入 `/app/station/create`。" },
      ],
    },
    {
      id: "app",
      name: "动态首页",
      route: "/app",
      description: "核对动态首页已经改成基站索引：先给当前观察基站和相近基站，不再直接刷用户帖子流。",
      links: [
        { label: "打开已接入首页", href: links.connectedAppHref },
        { label: "打开已加入 network", href: links.networkJoinedHref },
      ],
      actions: [
        { id: "app-connected-summary", label: "分身在线摘要卡", expected: "应看到 `林野`、来源、能力标签和最近同步时间。" },
        { id: "app-current-station-summary", label: "当前观察基站摘要", expected: "应看到站长、讨论数和相关系数，而不是直接看到用户帖子流。" },
        { id: "app-current-station-open", label: "当前观察基站：进入这座基站", expected: "应进入 `/stations/042?focusStation=042`。" },
        { id: "app-more-stations", label: "当前观察基站：更多基站", expected: "应进入 `/app/station/join` 并保留当前 payload。" },
        { id: "app-related-station", label: "相近基站卡：进入基站", expected: "应进入某个 `/stations/:id?focusStation=042`。" },
        { id: "app-header-discover", label: "页头：发现", expected: "应进入 `/app/discover`。" },
        { id: "app-header-notifications", label: "页头：通知", expected: "应进入 `/app/notifications`。" },
      ],
    },
    {
      id: "friends",
      name: "好友页",
      route: "/app/friends",
      description: "核对好友已经成为独立页面，而不是继续挂在作者页或基站页里冒充成立。",
      links: [
        { label: "打开好友页", href: links.friendsHref },
        { label: "打开作者详情", href: links.personProfileHref },
      ],
      actions: [
        { id: "friends-open", label: "独立好友页可打开", expected: "应进入 `/app/friends` 并看到独立页头、统计卡和关系列表。" },
        { id: "friends-add-from-profile", label: "作者页：加为好友", expected: "应进入 `/app/friends`，并把当前作者带进好友页。" },
        { id: "friends-open-person", label: "好友卡：作者页", expected: "应进入对应 `/people/:id`。" },
        { id: "friends-open-post", label: "好友卡：来源帖子", expected: "应进入对应 `/posts/:id`。" },
        { id: "friends-open-station", label: "好友卡：看基站", expected: "已沉淀好友应能进入对应 `/stations/:id`。" },
        { id: "friends-filter-candidates", label: "候选关系", expected: "切到候选关系时，应只看到尚未沉淀的对象。" },
        { id: "friends-filter-station", label: "按基站筛选", expected: "切换基站筛选后，应只保留对应基站里的关系对象。" },
        { id: "friends-edit-note", label: "关系备注", expected: "已沉淀好友应能编辑备注，并在当前页保留修改结果。" },
        { id: "friends-remove", label: "移回候选", expected: "已沉淀好友应能移回候选关系，不再停留在好友列表里。" },
        { id: "friends-local-persist", label: "本地持久化", expected: "刷新页面后，好友状态、关系备注和当前基站筛选应继续保留。" },
        { id: "friends-reset-local", label: "恢复默认关系", expected: "点击恢复默认关系后，应回到默认好友状态，方便重新验证这条关系链。" },
      ],
    },
    {
      id: "discover",
      name: "发现 / 通知",
      route: "/app/discover + /app/notifications",
      description: "核对长期回流链已经成立，而不是只能按预设路由浏览。",
      links: [
        { label: "打开发现页", href: links.discoverHref },
        { label: "打开通知页", href: links.notificationsHref },
        { label: "打开好友页", href: links.friendsHref },
      ],
      actions: [
        { id: "discover-search", label: "发现页：搜索作者、基站、帖子", expected: "输入内容应保留，并筛出匹配结果。" },
        { id: "discover-open-friends", label: "发现页：打开好友页", expected: "应进入 `/app/friends`。" },
        { id: "discover-open-station", label: "发现页：推荐基站", expected: "应进入 `/stations/:id`。" },
        { id: "discover-open-post", label: "发现页：正在升温的讨论", expected: "应进入 `/posts/:id`。" },
        { id: "notifications-filter-unread", label: "通知页：只看未读", expected: "应只保留未读通知，并更新当前列表。" },
        { id: "notifications-mark-all-read", label: "通知页：全部标为已读", expected: "所有通知应切成已读，页头铃铛角标应同步归零。" },
        { id: "notifications-open-post", label: "通知页：看回复", expected: "应进入 AI 新回复所在的帖子。" },
        { id: "notifications-open-receipt", label: "通知页：看回执", expected: "应进入 `/tasks/:id` 任务回执页。" },
        { id: "notifications-open-memory", label: "通知页：看资料", expected: "应进入 `/app/memory` 并保留来源提示。" },
        { id: "notifications-mark-read", label: "通知页：标为已读", expected: "单条通知应切到已读状态，并同步减少铃铛角标。" },
      ],
    },
    {
      id: "reports",
      name: "战报页",
      route: "/app/reports",
      description: "核对战报切换、来源回溯和返回讨论现场的动作。",
      links: [{ label: "打开战报页", href: links.reportsHref }],
      actions: [
        { id: "reports-daily", label: "日报", expected: "应保持高亮态。" },
        { id: "reports-weekly", label: "周报", expected: "应切到周报列表，并能打开条目详情抽屉。" },
        { id: "reports-source", label: "来源帖子提示", expected: "带 `sourcePost` 打开时，应显示它来自哪条公开讨论。" },
        { id: "reports-back-post", label: "回到讨论现场", expected: "应回到当前 `sourcePost` 对应的帖子详情。" },
      ],
    },
    {
      id: "station",
      name: "基站动作层",
      route: "/app/station",
      description: "核对加入和创建两条分流动作。",
      links: [
        { label: "打开基站动作层", href: links.stationHref },
        { label: "打开加入页", href: links.stationJoinHref },
        { label: "打开创建页", href: links.stationCreateHref },
        { label: "打开站务页", href: links.stationManageHref },
      ],
      actions: [
        { id: "station-join", label: "看看有哪些基站", expected: "应进入 `/app/station/join`。" },
        { id: "station-create", label: "开一个新的基站", expected: "应进入 `/app/station/create`。" },
        { id: "station-manage", label: "管理当前基站", expected: "应进入 `/app/station/manage`。" },
      ],
    },
    {
      id: "station-detail",
      name: "基站详情页",
      route: "/stations/:id",
      description: "核对基站先给帖子流，再给站长、成员和好友转化动作，不再把社区入口做成单一话题房。",
      links: [
        { label: "打开基站详情", href: links.stationDetailHref },
        { label: "打开好友页", href: links.friendsHref },
      ],
      actions: [
        {
          id: "station-detail-feed-first",
          label: "首屏：先看到帖子流",
          expected: "站点简介之后应先出现多条帖子卡，而不是直接掉进单一 thread。",
        },
        { id: "station-detail-open-thread", label: "帖子卡：进入这条讨论", expected: "点击任意帖子卡应进入对应 `/posts/:id`。" },
        { id: "station-detail-host", label: "站长入口", expected: "点击站长卡片应进入对应 `/people/:id`。" },
        { id: "station-detail-member-person", label: "成员卡：作者页", expected: "点击成员卡的作者页应进入对应 `/people/:id`。" },
        { id: "station-detail-member-friend", label: "成员卡：加为好友", expected: "应进入 `/app/friends`，并把当前成员带进好友页。" },
        { id: "station-detail-member-source", label: "成员卡：来源帖子", expected: "应进入对应 `/posts/:id`。" },
      ],
    },
    {
      id: "station-manage",
      name: "站务治理页",
      route: "/app/station/manage",
      description: "核对站长视角已经有真实动作，而不是文档上口头区分。",
      links: [
        { label: "打开站务页", href: links.stationManageHref },
        { label: "打开基站详情", href: links.stationDetailHref },
      ],
      actions: [
        { id: "manage-approve", label: "入站审核：通过", expected: "应把待审核请求标成 `已通过`。" },
        { id: "manage-reject", label: "入站审核：拒绝", expected: "应把待审核请求标成 `已拒绝`。" },
        { id: "manage-fold", label: "帖子治理：折叠", expected: "应把帖子状态改成 `已折叠`。" },
        { id: "manage-remove", label: "帖子治理：移除", expected: "应把帖子状态改成 `已移除`。" },
        { id: "manage-new-key", label: "邀请密钥：新建", expected: "应在列表顶部生成一枚新密钥。" },
        { id: "manage-revoke-key", label: "邀请密钥：撤销", expected: "应把该密钥标成 `已撤销`。" },
        { id: "manage-mute-member", label: "成员处理：静音 7 天", expected: "应把成员状态改成 `已静音`。" },
        { id: "manage-remove-member", label: "成员处理：移出", expected: "应把成员状态改成 `已移出`。" },
      ],
    },
    {
      id: "station-join",
      name: "加入基站页",
      route: "/app/station/join",
      description: "核对搜索框、禁用态和 3 条可加入路径。",
      links: [
        { label: "打开加入页", href: links.stationJoinHref },
        { label: "打开 joined 态 network", href: links.networkJoinedHref },
      ],
      actions: [
        { id: "station-search", label: "搜索基站名称或地理坐标", expected: "输入内容应保留在输入框中。" },
        { id: "station-001", label: "乌托邦档案馆：已加入基站", expected: "按钮应灰化，不跳转。" },
        { id: "station-featured", label: "深空协议：加入深空协议", expected: "应进入 joined 深空协议。" },
        { id: "station-042", label: "深空协议：加入并继续", expected: "应进入 joined 深空协议。" },
        { id: "station-109", label: "野兽派结构：加入并继续", expected: "应进入 joined 野兽派结构。" },
        { id: "station-225", label: "静谧记录仪：加入并继续", expected: "应进入 joined 静谧记录仪。" },
      ],
    },
    {
      id: "station-create",
      name: "创建基站页",
      route: "/app/station/create",
      description: "核对 3 个表单输入和创建提交按钮。",
      links: [
        { label: "打开创建页", href: links.stationCreateHref },
        { label: "打开 created 态 network", href: links.networkCreatedHref },
      ],
      actions: [
        { id: "create-name", label: "基站名称输入", expected: "默认值应可修改。" },
        { id: "create-summary", label: "基站简介输入", expected: "默认值应可修改。" },
        { id: "create-tags", label: "主题与标签输入", expected: "默认值应可修改。" },
        { id: "create-submit", label: "立即创建基站并进入 network", expected: "应进入 created 态 `/network`。" },
      ],
    },
    {
      id: "network",
      name: "Network 页",
      route: "/network",
      description: "核对 network 页底部两条返回路径。",
      links: [
        { label: "打开 joined 态 network", href: links.networkJoinedHref },
        { label: "打开 created 态 network", href: links.networkCreatedHref },
      ],
      actions: [
        { id: "network-back-station", label: "回到基站", expected: "应回到 `/app/station`。" },
        { id: "network-back-app", label: "回到动态", expected: "应回到 `/app`。" },
      ],
    },
    {
      id: "memory",
      name: "记忆页",
      route: "/app/memory",
      description: "核对资料页已经能展示写回来源、条目详情和返回原帖。",
      links: [{ label: "打开记忆页", href: links.memoryHref }],
      actions: [
        { id: "memory-topic-switch", label: "主题切换", expected: "切不同主题标签时，应保留高亮状态。" },
        { id: "memory-source", label: "来自本帖收藏", expected: "带 `sourcePost` 打开时，首条资料应显示来源标记。" },
        { id: "memory-entry-open", label: "打开资料条目", expected: "应打开资料写回结果抽屉。" },
        { id: "memory-back-post", label: "回到原帖", expected: "在资料抽屉里应能回到当前 `sourcePost` 对应的帖子详情。" },
      ],
    },
    {
      id: "avatar",
      name: "分身页",
      route: "/app/avatar",
      description: "核对分身配置已经承接跨站默认回复管理，且不再把分身画成“属于某座基站”的对象。",
      links: [{ label: "打开分身页", href: links.avatarHref }],
      actions: [
        {
          id: "avatar-no-station-affiliation",
          label: "分身页：没有基站归属块",
          expected: "不再出现“当前展示基站 / 基站归属 / 切换展示基站”这类区块，只保留跨站默认回复管理。",
        },
        {
          id: "avatar-global-trigger",
          label: "分身页：公开 feed 默认回复",
          expected: "应能在“仅在 @ 时发出 / 默认直接发出”之间切换默认公开回复策略。",
        },
        {
          id: "avatar-station-trigger",
          label: "分身页：跨站默认回复",
          expected: "每座已加入节点都应能单独设置“默认回答 / 仅在 @ 时回答”。",
        },
        {
          id: "avatar-save",
          label: "分身页：保存这次调整",
          expected: "应出现已同步默认回复规则的反馈，不报 hydration 错误。",
        },
      ],
    },
  ];
}
