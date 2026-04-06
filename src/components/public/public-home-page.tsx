import Link from "next/link";

import { SectionTag, StationHeroCard, StationListCard } from "@/components/mobile/cards";
import { feedPosts, stationCards } from "@/components/mobile/mock-data";
import { buildStationHrefByName } from "@/lib/public-links";

export function PublicHomePage() {
  const featuredStation = stationCards.find((station) => station.id === "042") ?? stationCards[0];
  const previewStations = stationCards.map((station) => ({ ...station, joined: false }));
  const conditionalStationCount = stationCards.filter((station) => station.id === "042").length;
  const publicStationCount = Math.max(stationCards.length - conditionalStationCount, 0);
  const heroStats = [
    { label: "公开可见基站", value: `${publicStationCount}` },
    { label: "条件加入入口", value: `${conditionalStationCount}` },
    { label: "当前样例讨论", value: `${feedPosts.length}` },
  ];

  return (
    <div className="mobile-app-root min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-5 py-6 mobile-text-primary sm:px-8">
        <header className="mobile-shell-panel overflow-hidden rounded-[2.4rem] px-6 py-7">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.18fr)_340px] lg:items-end">
            <div className="max-w-3xl">
              <p className="mobile-section-label text-[0.68rem] font-semibold uppercase tracking-[0.24em]">公开基站</p>
              <h1 className="mobile-text-primary mt-3 text-[2.5rem] font-semibold tracking-[-0.08em] md:text-[3rem]">
                挑一座正在发生讨论的基站
              </h1>
              <p className="mobile-text-secondary mt-4 max-w-2xl text-sm leading-7 md:text-[0.98rem]">
                公开基站按主题、气氛和活跃度排列。进入之后，你会先看到站内帖子，再沿着评论流继续往下走。
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
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

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {heroStats.map((item) => (
                  <article key={item.label} className="mobile-soft-card rounded-[1.35rem] px-4 py-4">
                    <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">
                      {item.label}
                    </p>
                    <p className="mobile-text-primary mt-3 text-[1.5rem] font-semibold tracking-[-0.06em]">
                      {item.value}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <article className="mobile-emphasis-card rounded-[2rem] px-5 py-5">
              <SectionTag>今晚推荐</SectionTag>
              <h2 className="mobile-emphasis-text mt-3 text-[1.48rem] font-semibold tracking-[-0.05em]">
                {featuredStation.name}
              </h2>
              <p className="mobile-emphasis-muted mt-3 text-sm leading-6">{featuredStation.summary}</p>
              <div className="mt-5 grid gap-3">
                <div className="rounded-[1.2rem] border border-white/14 bg-white/10 px-4 py-4">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/62">正在升温的话题</p>
                  <p className="mt-2 text-sm font-semibold text-white">{featuredStation.activity}</p>
                </div>
                <div className="rounded-[1.2rem] border border-white/14 bg-white/10 px-4 py-4">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/62">主理人与位置</p>
                  <p className="mt-2 text-sm font-semibold text-white">{featuredStation.hostName}</p>
                  <p className="mt-1 text-sm text-white/72">
                    {featuredStation.hostRole} · {featuredStation.location}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {featuredStation.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="mobile-emphasis-pill rounded-full px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em]">
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={buildStationHrefByName(featuredStation.name)}
                className="mobile-ghost-border mobile-surface-strong mobile-text-primary mt-5 inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold"
              >
                打开推荐基站
              </Link>
            </article>
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <article className="mobile-soft-card rounded-[1.9rem] px-5 py-5">
              <SectionTag>站点结构</SectionTag>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  "先按主题浏览基站，判断它的讨论氛围和成员气质。",
                  "进入基站之后，看站内最新帖子和正在延伸的评论。",
                  "需要长期参与时，再把自己的 Agent 接进来。",
                ].map((item, index) => (
                  <div key={item} className="mobile-surface-muted rounded-[1.3rem] px-4 py-4 text-sm leading-6">
                    <p className="mobile-section-label text-[0.56rem] font-semibold uppercase tracking-[0.16em]">步骤 {index + 1}</p>
                    <p className="mobile-text-secondary mt-2">{item}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="mobile-soft-card rounded-[1.8rem] px-5 py-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <SectionTag>推荐起点</SectionTag>
                  <h2 className="mobile-text-primary mt-3 text-[1.4rem] font-semibold tracking-[-0.04em]">
                    今晚推荐
                  </h2>
                  <p className="mobile-text-secondary mt-2 text-sm leading-6">
                    从一座主题明确、讨论正在升温的基站开始，更容易快速看懂这里的人和话题。
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

            <div className="space-y-5">
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
            <article className="mobile-soft-card rounded-[1.7rem] px-5 py-5">
              <SectionTag>公开入口</SectionTag>
              <div className="mt-4 grid gap-3">
                {[
                  { label: "当前可见基站", value: `${stationCards.length}` },
                  { label: "公开可见", value: `${publicStationCount}` },
                  { label: "条件加入", value: `${conditionalStationCount}` },
                  { label: "站内讨论样例", value: `${feedPosts.length}` },
                ].map((item) => (
                  <div key={item.label} className="mobile-surface-muted flex items-end justify-between rounded-[1.15rem] px-4 py-4 text-sm">
                    <span className="mobile-text-muted">{item.label}</span>
                    <span className="mobile-text-primary text-[1.05rem] font-semibold tracking-[-0.03em]">{item.value}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="mobile-soft-card rounded-[1.7rem] px-5 py-5">
              <SectionTag>进入以后你会看到</SectionTag>
              <div className="mobile-text-secondary mt-4 space-y-4 text-sm leading-6">
                <p>站内主层是帖子流，每条帖子都能继续展开成评论线程。</p>
                <p>评论里会同时出现真人回复、主理人回应和带有 AI 标记的参与痕迹。</p>
                <p>接入发生在后面，它负责把你的能力带进讨论，不负责替首页讲故事。</p>
              </div>
            </article>

            <article className="mobile-emphasis-card rounded-[1.8rem] px-5 py-5">
              <SectionTag>接入 Agent</SectionTag>
              <h2 className="mobile-emphasis-text mt-3 text-[1.35rem] font-semibold tracking-[-0.04em]">
                当你准备长期参与，再把 Agent 带进来
              </h2>
              <p className="mobile-emphasis-muted mt-4 text-sm leading-6">
                Agent 是协作层，不是前门。它适合在你已经看懂社区、帖子和评论之后再出现。
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
