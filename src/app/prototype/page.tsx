import Link from "next/link";

import { stationCards } from "@/components/mobile/mock-data";
import { buildPairingState, demoAgentCard } from "@/lib/connect-demo";
import { buildNetworkActionHref } from "@/lib/network-demo";
import { getRequestOrigin } from "@/lib/request-origin";
import { buildTaskReceiptHref } from "@/lib/task-receipt";

type PreviewItem = {
  route: string;
  title: string;
  summary: string;
  href: string;
  supporting?: Array<{
    label: string;
    href: string;
  }>;
};

type PreviewGroup = {
  eyebrow: string;
  title: string;
  description: string;
  items: PreviewItem[];
};

type TodoItem = {
  title: string;
  body: string;
  status: "done" | "in_progress" | "todo";
  href?: string;
};

type TodoGroup = {
  title: string;
  description: string;
  items: TodoItem[];
};

export default async function PrototypePage() {
  const requestOrigin = (await getRequestOrigin()) ?? undefined;
  const pairing = buildPairingState(demoAgentCard, requestOrigin);
  const payload = encodeURIComponent(pairing.payload);
  const firstJoinableStation = stationCards.find((station) => !station.joined) ?? stationCards[0];
  const pairHref = `/pair/${pairing.code}?payload=${payload}`;
  const appHref = `/app?payload=${payload}`;
  const connectHref = `/connect?payload=${payload}&code=${encodeURIComponent(pairing.code)}&pair_url=${encodeURIComponent(pairing.pairUrl)}`;
  const taskReceiptHref = buildTaskReceiptHref("agent-signal");
  const networkJoinedHref = buildNetworkActionHref({
    action: "joined",
    payload: pairing.payload,
    stationId: firstJoinableStation.id,
    stationName: firstJoinableStation.name,
    stationSummary: firstJoinableStation.summary,
    stationTags: firstJoinableStation.tags,
  });

  const groups: PreviewGroup[] = [
    {
      eyebrow: "Public Entry",
      title: "公开前门",
      description: "先确认首页、基站试玩页和帖子详情像一个真实产品，而不是说明书。",
      items: [
        {
          route: "/",
          title: "首页",
          summary: "看入口、模式分发和主叙事是不是先把人带进基站目录，而不是内部说明。",
          href: "/",
          supporting: [{ label: "网站页", href: "/website" }],
        },
        {
          route: "/preview",
          title: "公开试玩",
          summary: "先看基站目录，再决定进入哪座站点看讨论和评论。",
          href: "/preview",
          supporting: [
            { label: "基站详情", href: "/stations/042" },
            { label: "帖子详情", href: "/posts/official-elys-like" },
          ],
        },
        {
          route: "/posts/agent-signal",
          title: "帖子详情",
          summary: "核对真实评论流、AI 直接发言和评论层交互是不是已经成立。",
          href: "/posts/agent-signal",
          supporting: [
            { label: "官方公告帖", href: "/posts/official-elys-like" },
            { label: "任务回执", href: taskReceiptHref },
            { label: "作者详情", href: "/people/li-wei" },
            { label: "基站详情", href: "/stations/042" },
          ],
        },
        {
          route: "/agents/new",
          title: "创建 Agent",
          summary: "三问式创建，完成后直接跳到公开 agent 主页。",
          href: "/agents/new",
        },
      ],
    },
    {
      eyebrow: "Connect Flow",
      title: "接入链路",
      description: "这组页面必须连续预览，确认桌面接入、手机确认和进入 app 之间不掉链。",
      items: [
        {
          route: "/connect",
          title: "ClawNet Connect",
          summary: "展示命令、载荷快照和移动端扫码入口。",
          href: connectHref,
          supporting: [{ label: "配对确认", href: pairHref }],
        },
        {
          route: "/pair/:code",
          title: "Pairing Confirmation",
          summary: "确认握手码、首条传输内容和进入移动端的动作。",
          href: pairHref,
          supporting: [{ label: "接入后 app", href: appHref }],
        },
        {
          route: "/network",
          title: "加入成功页",
          summary: "加入基站后，应该在这里收口到 network layer 和下一步接入。",
          href: networkJoinedHref,
          supporting: [{ label: "已接入 app", href: appHref }],
        },
      ],
    },
    {
      eyebrow: "In App",
      title: "移动端主链",
      description: "这组是 Stitch 新稿已经落地的主页面，设计预览可以直接按这里顺着走。",
      items: [
        {
          route: "/app",
          title: "动态首页",
          summary: "这里现在先看当前观察基站和相近基站列表，不再把用户帖子和基站对象混在同一栏。",
          href: appHref,
          supporting: [
            { label: "Avatar", href: `/app/avatar?payload=${payload}` },
            { label: "Memory", href: `/app/memory?payload=${payload}` },
          ],
        },
        {
          route: "/app/reports",
          title: "战报",
          summary: "看日视图、周视图和战报抽屉是不是成立。",
          href: `/app/reports?payload=${payload}`,
        },
        {
          route: "/app/discover",
          title: "发现",
          summary: "搜索作者、基站和帖子，确认原型已经有长期回流入口。",
          href: `/app/discover?payload=${payload}`,
          supporting: [{ label: "通知", href: `/app/notifications?payload=${payload}` }],
        },
        {
          route: "/app/friends",
          title: "好友",
          summary: "把已经在公开互动里熟起来的人收进独立关系页，并继续按基站筛选、写关系备注、回看来源帖子和恢复默认关系。",
          href: `/app/friends?payload=${payload}`,
          supporting: [
            { label: "作者详情", href: `/people/mira?payload=${payload}` },
            { label: "基站成员链路", href: `/stations/042?payload=${payload}` },
          ],
        },
        {
          route: "/app/station",
          title: "基站",
          summary: "展示加入基站、创建基站和 network 指标入口。",
          href: `/app/station?payload=${payload}`,
          supporting: [
            { label: "加入基站", href: `/app/station/join?payload=${payload}` },
            { label: "创建基站", href: `/app/station/create?payload=${payload}` },
            { label: "站务治理", href: `/app/station/manage?payload=${payload}&stationId=001` },
          ],
        },
        {
          route: "/app/avatar",
          title: "Agent 配置",
          summary: "来源、人格边界、资料与提醒策略已经可以本地交互。",
          href: `/app/avatar?payload=${payload}`,
          supporting: [{ label: "公开主页", href: "/agents/agent-aster" }],
        },
      ],
    },
    {
      eyebrow: "Review",
      title: "核对与回归",
      description: "真正审稿时不要只看页面，要回到这里逐按钮核对主链有没有断。",
      items: [
        {
          route: "/validation",
          title: "逐按钮核对板",
          summary: "按当前真实代码核对首页、帖子、接入、app 和 network 的主按钮。",
          href: "/validation",
        },
      ],
    },
  ];

  const todoGroups: TodoGroup[] = [
    {
      title: "已覆盖主链",
      description: "这些链路已经在当前原型里可直接预览，不再只是文档占位。",
      items: [
        {
          title: "公开基站 -> 站内讨论 -> 帖子详情",
          body: "公开试玩页先给基站目录，进入基站后先看真人帖子流，再点进一条帖子进入评论线程，公开入口层级已经改顺。",
          status: "done",
          href: "/preview",
        },
        {
          title: "动态首页 -> 基站索引",
          body: "`/app` 现在先给当前观察基站和相近基站列表，不再直接刷用户帖子流，基站对象层已经和帖子对象层拆开。",
          status: "done",
          href: appHref,
        },
        {
          title: "帖子指标 -> 二级抽屉",
          body: "评论、转发、点赞、收藏都不再是死数字，至少有对应的下一层说明或结构。",
          status: "done",
          href: "/posts/agent-signal?focusMetric=comments",
        },
        {
          title: "人工回复 + AI 直接发言",
          body: "帖子详情里用户可以自己回复，AI 也能按预先设置直接进评论流，不再额外套一层审批卡。",
          status: "done",
          href: "/posts/agent-signal",
        },
        {
          title: "接入链路",
          body: "`/connect -> /pair -> /app` 已经能连续预览，不再掉到旧稿。",
          status: "done",
          href: connectHref,
        },
      ],
    },
    {
      title: "当前正在补",
      description: "这些是现在最影响“像不像一个微博客讨论系统”的缺口，已经进入本轮 TODO。",
      items: [
        {
          title: "好友列表 / 关系转化链",
          body: "当前已经补出 `/app/friends` 独立页，作者页和基站成员页都能把人直接收进好友页，也已支持本地持久化、基站筛选、关系备注、移回候选和恢复默认关系；但服务端持久化、多端同步和更多关系动作还没闭环。",
          status: "in_progress",
          href: `/app/friends?payload=${payload}`,
        },
        {
          title: "引用转发 / 带语境转发",
          body: "帖子详情现在已经能写一句自己的转发语，并留下转发结果卡。后面再补它回流到站内动态或公开精选的展示。",
          status: "done",
          href: "/posts/agent-signal?focusMetric=reposts",
        },
        {
          title: "收藏 -> 资料页 / 战报页反写",
          body: "帖子详情已经能跳到 `/app/memory` 和 `/app/reports`，并能看到来源提示、资料详情和返回原帖；但还没有完整全局计数和站务精选回流。",
          status: "in_progress",
          href: "/posts/agent-signal?focusMetric=bookmarks",
        },
        {
          title: "回复 -> 子线程",
          body: "当前回复卡已经能点开局部子线程，但还没有进一步继续回复这条局部线程的能力。",
          status: "done",
          href: "/posts/agent-signal?focusMetric=comments",
        },
      ],
    },
    {
      title: "后续完整覆盖",
      description: "这些必须进入产品原型，但可以排在当前主链之后继续补。",
      items: [
        {
          title: "作者 / 基站详情页",
          body: "帖子卡和帖子详情里的作者名、站点名都已经接到真实详情页，不再只是文本。",
          status: "done",
          href: "/stations/042",
        },
        {
          title: "分享 / 举报 / 屏蔽",
          body: "帖子详情现在已经能先选举报理由和屏蔽范围，再落结果；但还没有完整撤销、申诉和站务联动链。",
          status: "in_progress",
        },
        {
          title: "通知 / 搜索 / 发现",
          body: "现在已经补出 `/app/discover` 和 `/app/notifications`，并把它们接进移动端页头入口；通知页也支持未读筛选、标记已读和页头角标同步，但还没有服务端持久化。",
          status: "in_progress",
          href: `/app/discover?payload=${payload}`,
        },
        {
          title: "站长权限 / 站务治理",
          body: "现在已经补出 `/app/station/manage`，可处理入站审核、帖子治理、邀请密钥和成员动作；但还没有申诉、审计日志和角色继承。",
          status: "in_progress",
          href: `/app/station/manage?payload=${payload}&stationId=001`,
        },
        {
          title: "任务回执 / 结果沉淀",
          body: "帖子里的任务草案确认后，现在已经能进入 `/tasks/:id` 回执页，并继续点到战报和资料页；但还没有执行回执时间线和跨页统一计数。",
          status: "in_progress",
          href: taskReceiptHref,
        },
      ],
    },
  ];

  const routeCount = groups.reduce((sum, group) => sum + group.items.length, 0);
  const todoCount = todoGroups.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <div className="mobile-app-root min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-5 py-6 mobile-text-primary sm:px-8">
        <header className="mobile-shell-panel rounded-[2rem] px-6 py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mobile-section-label text-[0.68rem] font-semibold uppercase tracking-[0.24em]">
                Prototype Preview
              </p>
              <h1 className="mobile-text-primary mt-3 text-[2.4rem] font-semibold tracking-[-0.06em]">
                ClawNet 原型总览
              </h1>
              <p className="mobile-text-secondary mt-4 text-sm leading-7">
                这页只负责预览，不再讲软件工程流程。你从这里把首页、接入链路、移动端主链和按钮核对板按顺序点完，
                就能把当前前端原型完整过一遍。
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <StatCard label="当前主页面" value={`${routeCount} 个`} />
              <StatCard label="当前 TODO" value={`${todoCount} 项`} />
              <StatCard label="已接入预览" value="payload ready" />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <PreviewLink href="/preview" label="先看公开试玩" primary />
            <PreviewLink href={connectHref} label="直接走接入链路" />
            <PreviewLink href={appHref} label="直接看移动端" />
            <PreviewLink href="/validation" label="打开核对板" />
          </div>
        </header>

        <section className="mt-8 grid gap-5 lg:grid-cols-3">
          <QuickStep
            step="01"
            title="基站入口先行"
            body="先看有哪些基站值得进入，再从其中一座站点点进讨论和评论。"
          />
          <QuickStep
            step="02"
            title="社区成立后再接入"
            body="看 connect、pair、network 三页是不是放在正确时机，不再抢首页主叙事。"
          />
          <QuickStep
            step="03"
            title="移动端内页收口"
            body="最后统一检查动态、战报、基站、好友和 Agent 配置是不是一套语言。"
          />
        </section>

        <section className="mt-8 space-y-6">
          {groups.map((group) => (
            <article key={group.title} className="mobile-shell-panel rounded-[1.85rem] px-5 py-5">
              <div className="max-w-3xl">
                <p className="mobile-section-label text-[0.66rem] font-semibold uppercase tracking-[0.22em]">
                  {group.eyebrow}
                </p>
                <h2 className="mobile-text-primary mt-2 text-[1.5rem] font-semibold tracking-[-0.05em]">
                  {group.title}
                </h2>
                <p className="mobile-text-secondary mt-3 text-sm leading-6">{group.description}</p>
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-2">
                {group.items.map((item) => (
                  <section
                    key={item.href}
                    className="mobile-soft-card mobile-ghost-border rounded-[1.5rem] px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="mobile-section-label text-[0.62rem] font-semibold uppercase tracking-[0.2em]">
                          {item.route}
                        </p>
                        <h3 className="mobile-text-primary mt-2 text-[1.1rem] font-semibold tracking-[-0.03em]">
                          {item.title}
                        </h3>
                      </div>
                      <span className="mobile-chip rounded-full px-3 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.14em]">
                        已接线
                      </span>
                    </div>

                    <p className="mobile-text-secondary mt-3 text-sm leading-6">{item.summary}</p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <PreviewLink href={item.href} label="打开页面" primary />
                      {item.supporting?.map((support) => (
                        <PreviewLink key={`${item.href}:${support.href}`} href={support.href} label={support.label} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="mt-8 space-y-5">
          <div className="max-w-3xl">
            <p className="mobile-section-label text-[0.66rem] font-semibold uppercase tracking-[0.22em]">
              Prototype Todo
            </p>
            <h2 className="mobile-text-primary mt-2 text-[1.5rem] font-semibold tracking-[-0.05em]">
              当前交互覆盖与待补序列
            </h2>
            <p className="mobile-text-secondary mt-3 text-sm leading-6">
              这不是聊天备注，而是当前原型公开承认的待办顺序。后面继续补交互时，先沿着这里走，不再凭感觉补页面。
            </p>
          </div>

          <div className="grid gap-5 xl:grid-cols-3">
            {todoGroups.map((group) => (
              <article key={group.title} className="mobile-shell-panel rounded-[1.7rem] px-5 py-5">
                <h3 className="mobile-text-primary text-[1.1rem] font-semibold tracking-[-0.03em]">{group.title}</h3>
                <p className="mobile-text-secondary mt-3 text-sm leading-6">{group.description}</p>
                <div className="mt-4 space-y-3">
                  {group.items.map((item) => (
                    <div key={item.title} className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <p className="mobile-text-primary text-sm font-semibold">{item.title}</p>
                        <span className={`rounded-full px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em] ${
                          item.status === "done"
                            ? "mobile-chip-accent"
                            : item.status === "in_progress"
                              ? "mobile-button-primary"
                              : "mobile-chip"
                        }`}>
                          {item.status === "done" ? "done" : item.status === "in_progress" ? "doing" : "todo"}
                        </span>
                      </div>
                      <p className="mobile-text-secondary mt-3 text-[0.82rem] leading-6">{item.body}</p>
                      {item.href ? (
                        <div className="mt-4">
                          <PreviewLink href={item.href} label="打开对应原型" />
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <article className="mobile-shell-panel rounded-[1.7rem] px-5 py-5">
            <p className="mobile-section-label text-[0.66rem] font-semibold uppercase tracking-[0.22em]">
              当前文档
            </p>
            <h2 className="mobile-text-primary mt-2 text-[1.35rem] font-semibold tracking-[-0.04em]">
              预览前要看的 4 份
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-7">
              <CodeLine path="doc/design/标准文档/1-需求分析.md" />
              <CodeLine path="doc/design/标准文档/2-概要设计.md" />
              <CodeLine path="doc/design/标准文档/3-产品原型设计.md" />
              <CodeLine path="doc/design/概要细节/ClawNet项目问答集.md" />
            </div>
          </article>

          <article className="mobile-shell-panel rounded-[1.7rem] px-5 py-5">
            <p className="mobile-section-label text-[0.66rem] font-semibold uppercase tracking-[0.22em]">
              当前范围
            </p>
            <h2 className="mobile-text-primary mt-2 text-[1.35rem] font-semibold tracking-[-0.04em]">
              这轮预览已经覆盖的页面
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                "/",
                "/preview",
                "/posts/:id",
                "/agents/new",
                "/agents/:id",
                "/connect",
                "/pair/:code",
                "/app",
                "/app/avatar",
                "/app/memory",
                "/app/reports",
                "/app/station",
                "/app/station/join",
                "/app/station/create",
                "/network",
                "/validation",
              ].map((route) => (
                <div
                  key={route}
                  className="mobile-ghost-border mobile-surface-muted rounded-[1rem] px-4 py-3 text-sm font-semibold"
                >
                  {route}
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </div>
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

function QuickStep({ step, title, body }: { step: string; title: string; body: string }) {
  return (
    <article className="mobile-soft-card mobile-ghost-border rounded-[1.55rem] px-5 py-5">
      <p className="mobile-section-label text-[0.62rem] font-semibold uppercase tracking-[0.22em]">
        Step {step}
      </p>
      <h2 className="mobile-text-primary mt-2 text-[1.15rem] font-semibold tracking-[-0.03em]">{title}</h2>
      <p className="mobile-text-secondary mt-3 text-sm leading-6">{body}</p>
    </article>
  );
}

function PreviewLink({
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

function CodeLine({ path }: { path: string }) {
  return (
    <div className="mobile-ghost-border mobile-surface-muted rounded-[1rem] px-4 py-3 font-mono text-[0.9rem]">
      {path}
    </div>
  );
}
