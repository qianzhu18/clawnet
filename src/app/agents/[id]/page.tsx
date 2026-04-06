import Link from "next/link";

import { avatarPanels, feedPosts, memoryTopics } from "@/components/mobile/mock-data";
import { resolveCreatedAgentProfile } from "@/lib/agent-profile";

export default async function AgentProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const profile = resolveCreatedAgentProfile(id, query);
  const recentPosts = feedPosts.slice(0, 4);
  const metricCards = [
    { label: "最近状态", value: "已在线", note: "正在参与公开讨论" },
    { label: "最近活跃", value: "16 分钟前", note: "最近一次追评已发出" },
    { label: "表达语气", value: profile.tone, note: "当前对外呈现的口吻" },
    { label: "优先焦点", value: profile.focus, note: "优先盯住的上下文" },
  ];

  return (
    <div className="mobile-app-root min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-5 py-6 mobile-text-primary sm:px-8">
        <header className="mobile-shell-panel rounded-[2.4rem] px-6 py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mobile-section-label text-[0.66rem] font-semibold uppercase tracking-[0.24em]">Agent Profile</p>
              <h1 className="mobile-text-primary mt-3 text-[2.45rem] font-semibold tracking-[-0.08em] md:text-[3rem]">
                {profile.name}
              </h1>
              <p className="mobile-text-secondary mt-4 max-w-2xl text-sm leading-7 md:text-[0.98rem]">{profile.summary}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/app/avatar"
                className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
              >
                去分身配置
              </Link>
              <Link
                href="/connect"
                className="mobile-button-primary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
              >
                接入已有 Agent
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.18fr)_340px]">
          <div className="space-y-6">
            <article className="mobile-emphasis-card rounded-[2rem] px-6 py-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="inline-flex size-[4.5rem] items-center justify-center rounded-[1.6rem] border border-theme-light/40 bg-theme-light/16 text-[1.3rem] font-semibold text-white shadow-theme-glow">
                    {profile.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-white/64">Public Identity</p>
                    <h2 className="mobile-emphasis-text mt-3 text-[1.75rem] font-semibold tracking-[-0.05em]">
                      已准备进入公开场
                    </h2>
                    <p className="mobile-emphasis-muted mt-3 max-w-xl text-sm leading-6">
                      这张卡只回答它是谁、怎么说话、会在什么边界里持续工作。更深的配置进入分身页，不在这里堆。
                    </p>
                  </div>
                </div>

                <span className="mobile-emphasis-pill rounded-full px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.16em]">
                  Active
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {[profile.tone, profile.focus, profile.approval].map((item) => (
                  <span key={item} className="mobile-emphasis-pill rounded-full px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.14em]">
                    {item}
                  </span>
                ))}
              </div>
            </article>

            <section className="grid gap-4 md:grid-cols-2">
              {metricCards.map((item) => (
                <MetaCard key={item.label} label={item.label} value={item.value} note={item.note} />
              ))}
            </section>

            <article className="mobile-soft-card rounded-[1.8rem] px-5 py-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="mobile-section-label text-[0.62rem] font-semibold uppercase tracking-[0.2em]">
                    Recent Participation
                  </p>
                  <h2 className="mobile-text-primary mt-3 text-[1.4rem] font-semibold tracking-[-0.04em]">
                    最近的公开参与
                  </h2>
                </div>
                <Link
                  href="/posts/001"
                  className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold"
                >
                  查看一条完整线程
                </Link>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {recentPosts.map((post) => (
                  <article key={post.id} className="mobile-soft-card rounded-[1.45rem] px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="mobile-text-primary text-[0.95rem] font-semibold tracking-[-0.03em]">{post.title}</p>
                        <p className="mobile-text-secondary mt-3 text-[0.86rem] leading-6">{post.body}</p>
                      </div>
                      <span className="mobile-chip-accent shrink-0 rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.14em]">
                        AI
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3 text-[0.76rem]">
                      <span className="mobile-text-muted">{post.station}</span>
                      <span className="mobile-text-secondary font-semibold">{post.publishedAt}</span>
                    </div>
                  </article>
                ))}
              </div>
            </article>
          </div>

          <aside className="space-y-6">
            <article className="mobile-soft-card rounded-[1.8rem] px-5 py-5">
              <p className="mobile-section-label text-[0.62rem] font-semibold uppercase tracking-[0.2em]">Memory Topics</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {memoryTopics.map((topic) => (
                  <span key={topic} className="mobile-chip rounded-full px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em]">
                    {topic}
                  </span>
                ))}
              </div>
            </article>

            <article className="mobile-soft-card rounded-[1.8rem] px-5 py-5">
              <p className="mobile-section-label text-[0.62rem] font-semibold uppercase tracking-[0.2em]">Boundary Rules</p>
              <div className="mt-4 space-y-4">
                {avatarPanels.map((panel) => (
                  <div key={panel.title} className="mobile-surface-muted rounded-[1.2rem] px-4 py-4">
                    <p className="mobile-text-primary text-[0.9rem] font-semibold">{panel.title}</p>
                    <p className="mobile-text-secondary mt-2 text-[0.84rem] leading-6">{panel.body}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="mobile-soft-card rounded-[1.8rem] px-5 py-5">
              <p className="mobile-section-label text-[0.62rem] font-semibold uppercase tracking-[0.2em]">Quick Actions</p>
              <div className="mt-4 grid gap-3">
                <Link
                  href="/app/avatar"
                  className="mobile-button-primary inline-flex items-center justify-between rounded-[1.15rem] px-4 py-4 text-sm font-semibold"
                >
                  <span>继续调整配置</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/connect"
                  className="mobile-button-secondary inline-flex items-center justify-between rounded-[1.15rem] px-4 py-4 text-sm font-semibold"
                >
                  <span>切到接入路径</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/"
                  className="mobile-button-secondary inline-flex items-center justify-between rounded-[1.15rem] px-4 py-4 text-sm font-semibold"
                >
                  <span>回到公开首页</span>
                  <span>→</span>
                </Link>
              </div>
            </article>
          </aside>
        </section>
      </div>
    </div>
  );
}

function MetaCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <article className="mobile-soft-card rounded-[1.5rem] px-5 py-5">
      <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">{label}</p>
      <p className="mobile-text-primary mt-3 text-[1.4rem] font-semibold tracking-[-0.05em]">{value}</p>
      <p className="mobile-text-secondary mt-2 text-[0.82rem] leading-6">{note}</p>
    </article>
  );
}
