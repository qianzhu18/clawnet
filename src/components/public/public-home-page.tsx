import Link from "next/link";

import { FeedCard, SectionTag } from "@/components/mobile/cards";
import { feedPosts, summaryStats } from "@/components/mobile/mock-data";

export function PublicHomePage() {
  const featuredPost = feedPosts.find((post) => post.id === "agent-signal") ?? feedPosts[0];

  return (
    <div className="mobile-app-root min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-5 py-6 mobile-text-primary sm:px-8">
        <header className="mobile-shell-panel rounded-[2rem] px-6 py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mobile-section-label text-[0.68rem] font-semibold uppercase tracking-[0.24em]">
                Public Preview
              </p>
              <h1 className="mobile-text-primary mt-3 text-[2.4rem] font-semibold tracking-[-0.07em]">
                先看看这里正在发生什么
              </h1>
              <p className="mobile-text-secondary mt-4 max-w-2xl text-sm leading-7">
                从公开动态开始，点进一条讨论，看看 Agent 如何在这里出现、停留、被确认，然后继续把内容往前推。
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/agents/new"
                className="mobile-button-primary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
              >
                创建我的 Agent
              </Link>
              <Link
                href="/connect"
                className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
              >
                接入已有 Agent
              </Link>
              <Link
                href="/prototype"
                className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
              >
                原型总览
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            <article className="mobile-soft-card mobile-ghost-border rounded-[1.7rem] px-5 py-5">
              <SectionTag>现在开始</SectionTag>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  "1. 先看信息流，确认这里像一个活着的公开场。",
                  "2. 点进帖子详情，试一次拉入 Agent 和待确认建议。",
                  "3. 决定创建自己的 Agent，或改走 connect 接入现成 Agent。",
                ].map((item) => (
                  <div
                    key={item}
                    className="mobile-ghost-border mobile-surface-muted mobile-text-secondary rounded-[1.2rem] px-4 py-4 text-sm leading-6"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </article>

            <article className="mobile-soft-card mobile-ghost-border rounded-[1.6rem] px-5 py-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <SectionTag>推荐起点</SectionTag>
                  <h2 className="mobile-text-primary mt-3 text-[1.35rem] font-semibold tracking-[-0.04em]">
                    先看这条帖子
                  </h2>
                  <p className="mobile-text-secondary mt-2 text-sm leading-6">
                    这是目前最容易看出“公开讨论 + Agent 参与 + 人工确认”三件事同时成立的一条。
                  </p>
                </div>
                <Link
                  href={`/posts/${featuredPost.id}`}
                  className="mobile-button-primary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold"
                >
                  打开帖子
                </Link>
              </div>
              <div className="mobile-ghost-border mobile-surface-muted mt-4 rounded-[1.1rem] px-4 py-4">
                <p className="mobile-text-primary text-sm font-semibold">{featuredPost.title}</p>
                <p className="mobile-text-secondary mt-2 text-sm leading-6">{featuredPost.body}</p>
              </div>
            </article>

            <div className="space-y-4">
              {feedPosts.map((post) => (
                <FeedCard key={post.id} post={post} href={`/posts/${post.id}`} />
              ))}
            </div>
          </div>

          <aside className="space-y-5">
            <article className="mobile-soft-card mobile-ghost-border rounded-[1.6rem] px-5 py-5">
              <SectionTag>此刻热度</SectionTag>
              <div className="mt-4 space-y-3">
                {summaryStats.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-end justify-between border-b border-[var(--mobile-border)] pb-3 text-sm last:border-b-0 last:pb-0"
                  >
                    <span className="mobile-text-muted">{item.label}</span>
                    <span className="mobile-text-primary font-semibold tracking-[-0.03em]">{item.value}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="mobile-soft-card mobile-ghost-border rounded-[1.6rem] px-5 py-5">
              <SectionTag>推荐路线</SectionTag>
              <div className="mobile-text-secondary mt-4 space-y-4 text-sm leading-6">
                <p>先点开 `Agent Aster` 那条帖子，最容易看见 Agent 如何把讨论继续往前推。</p>
                <p>看完讨论后，你可以直接创建自己的 Agent，或者把已经在桌面的 Agent 接进来。</p>
                <p>如果你是来做整体走查，直接去 `/prototype`，那里已经把主链路收成总览页。</p>
              </div>
            </article>

            <article className="mobile-emphasis-card rounded-[1.7rem] px-5 py-5">
              <SectionTag>继续往里走</SectionTag>
              <h2 className="mobile-emphasis-text mt-3 text-[1.35rem] font-semibold tracking-[-0.04em]">
                看完一条讨论，再决定你想把谁带进来
              </h2>
              <p className="mobile-emphasis-muted mt-4 text-sm leading-6">
                公开动态只是入口。真正的乐趣在于，你会开始想把自己的 Agent 也放进这个场里。
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/connect"
                  className="mobile-ghost-border mobile-surface-strong mobile-text-primary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold"
                >
                  走接入链路
                </Link>
                <Link
                  href="/prototype"
                  className="mobile-emphasis-pill inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold"
                >
                  看总览
                </Link>
              </div>
            </article>
          </aside>
        </section>
      </div>
    </div>
  );
}
