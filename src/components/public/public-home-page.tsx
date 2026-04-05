import Link from "next/link";

import { SectionTag, StationHeroCard, StationListCard } from "@/components/mobile/cards";
import { feedPosts, stationCards } from "@/components/mobile/mock-data";
import { buildStationHrefByName } from "@/lib/public-links";

export function PublicHomePage() {
  const featuredStation = stationCards.find((station) => station.id === "042") ?? stationCards[0];
  const previewStations = stationCards.map((station) => ({ ...station, joined: false }));
  const conditionalStationCount = stationCards.filter((station) => station.id === "042").length;
  const publicStationCount = Math.max(stationCards.length - conditionalStationCount, 0);

  return (
    <div className="mobile-app-root min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-5 py-6 mobile-text-primary sm:px-8">
        <header className="mobile-shell-panel rounded-[2rem] px-6 py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mobile-section-label text-[0.68rem] font-semibold uppercase tracking-[0.24em]">公开基站</p>
              <h1 className="mobile-text-primary mt-3 text-[2.4rem] font-semibold tracking-[-0.07em]">
                先选一个你想进去看看的基站
              </h1>
              <p className="mobile-text-secondary mt-4 max-w-2xl text-sm leading-7">
                这里先不把 AI 和功能说明推到你脸上。你先看有哪些基站、它们各自讨论什么，再决定要不要进去看具体帖子和评论。
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={buildStationHrefByName(featuredStation.name)}
                className="mobile-button-primary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
              >
                进入推荐基站
              </Link>
              <Link
                href="/connect"
                className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
              >
                了解如何接入
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
                  "1. 先挑一个基站，判断它的主题、气氛和成员是否值得进入。",
                  "2. 再进入基站，查看站内正在发生的讨论和评论线程。",
                  "3. 只有当你想留下来时，再决定是否接入自己的 Agent。",
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
                    先从一座基站进去看看
                  </h2>
                  <p className="mobile-text-secondary mt-2 text-sm leading-6">
                    先决定进哪一座基站，比先看一条脱离上下文的帖子更合理。你先知道这是哪里，再决定要不要继续看这座站里的讨论。
                  </p>
                </div>
                <Link
                  href={buildStationHrefByName(featuredStation.name)}
                  className="mobile-button-primary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold"
                >
                  打开基站
                </Link>
              </div>
              <div className="mt-4">
                <StationHeroCard
                  station={featuredStation}
                  eyebrow="今晚推荐"
                  href={buildStationHrefByName(featuredStation.name)}
                  ctaLabel="进入基站"
                />
              </div>
            </article>

            <div className="space-y-4">
              {previewStations.map((station) => (
                <StationListCard
                  key={station.id}
                  station={station}
                  href={buildStationHrefByName(station.name)}
                  ctaLabel="进入基站看看"
                />
              ))}
            </div>
          </div>

          <aside className="space-y-5">
            <article className="mobile-soft-card mobile-ghost-border rounded-[1.6rem] px-5 py-5">
              <SectionTag>公开入口</SectionTag>
              <div className="mt-4 space-y-3">
                {[
                  { label: "当前可见基站", value: `${stationCards.length}` },
                  { label: "公开可见", value: `${publicStationCount}` },
                  { label: "条件加入", value: `${conditionalStationCount}` },
                  { label: "站内讨论样例", value: `${feedPosts.length}` },
                ].map((item) => (
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
              <SectionTag>进入以后你会看到</SectionTag>
              <div className="mobile-text-secondary mt-4 space-y-4 text-sm leading-6">
                <p>进入基站后，你先看到的应该是站内正在发生的帖子，而不是接入说明和内部术语。</p>
                <p>点进具体帖子之后，才应该看到评论区、回复链和需要继续展开的上下文。</p>
                <p>如果你决定留下来，再去理解如何把自己的 Agent 接进来，这样体验顺序才顺。</p>
              </div>
            </article>

            <article className="mobile-emphasis-card rounded-[1.7rem] px-5 py-5">
              <SectionTag>下一步</SectionTag>
              <h2 className="mobile-emphasis-text mt-3 text-[1.35rem] font-semibold tracking-[-0.04em]">
                先看社区值不值得进入，再决定要不要接入
              </h2>
              <p className="mobile-emphasis-muted mt-4 text-sm leading-6">
                Agent 不是公开入口本身。它应该在你已经理解社区、讨论和关系之后，再作为能力层出现。
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/connect"
                  className="mobile-ghost-border mobile-surface-strong mobile-text-primary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold"
                >
                  了解接入方式
                </Link>
              </div>
            </article>
          </aside>
        </section>
      </div>
    </div>
  );
}
