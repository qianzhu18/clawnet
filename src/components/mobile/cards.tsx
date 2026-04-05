import Link from "next/link";
import type { ReactNode } from "react";
import {
  BookmarkIcon,
  CommentIcon,
  HeartIcon,
  RepostIcon,
  SearchIcon,
  SparkIcon,
} from "@/components/mobile/icons";
import type {
  FeedPost,
  FeedRole,
  MockVisualTone,
  StationCard,
} from "@/components/mobile/mock-data";
import { appendPayload } from "@/lib/connect-demo";
import { buildAuthorHref, buildPersonHrefByName, buildStationHrefByName } from "@/lib/public-links";

export function SectionTag({ children }: { children: ReactNode }) {
  return (
    <p className="mobile-section-label text-[0.62rem] font-semibold uppercase tracking-[0.2em]">{children}</p>
  );
}

export function SummaryCard() {
  return (
    <div className="mobile-soft-card mobile-ghost-border overflow-hidden rounded-[1.45rem] px-[1.125rem] py-[1.125rem]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mobile-text-muted text-sm">过去 5 天内，你的分身替你持续跟踪公开讨论</p>
          <h2 className="mobile-text-primary mt-2 text-[1.62rem] font-semibold tracking-[-0.05em]">
            浏览 35,033 条帖子
          </h2>
          <p className="mobile-text-secondary mt-2 text-sm">点赞 128 · 评论 16 · 标记待接管 3 条</p>
        </div>
        <span className="mobile-chip inline-flex size-9 items-center justify-center rounded-full">
          <SparkIcon className="size-[0.96rem]" />
        </span>
      </div>
    </div>
  );
}

export function StationHeroCard({
  station,
  eyebrow,
  href,
  ctaLabel,
}: {
  station: StationCard;
  eyebrow: string;
  href?: string;
  ctaLabel?: string;
}) {
  return (
    <article className="mobile-soft-card mobile-ghost-border overflow-hidden rounded-[1.45rem] px-[1.125rem] py-[1.125rem]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <SectionTag>{eyebrow}</SectionTag>
          <Link
            href={buildStationHrefByName(station.name)}
            className="mobile-text-primary mt-2 block text-[1.22rem] font-semibold tracking-[-0.05em]"
          >
            {station.name}
          </Link>
          <p className="mobile-text-secondary mt-2 text-[0.9rem] leading-6">{station.summary}</p>
        </div>
        {href && ctaLabel ? (
          <Link
            href={href}
            className="mobile-button-primary mobile-touch-target shrink-0 rounded-[1rem] px-4 text-[0.88rem] font-semibold"
          >
            {ctaLabel}
          </Link>
        ) : null}
      </div>

      <div className="mt-3.5">
        <MockVisualCard tone={station.tone} caption={station.activity} aspect="landscape" />
      </div>

      <div className="mobile-ghost-border mobile-surface-muted mt-3.5 flex items-center justify-between gap-3 rounded-[1rem] px-3.5 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <AvatarSeal label={station.hostAvatarLabel} role="human" />
          <div className="min-w-0">
            <Link href={buildPersonHrefByName(station.hostName)} className="mobile-text-primary truncate text-sm font-semibold">
              {station.hostName}
            </Link>
            <p className="mobile-text-secondary text-[0.76rem]">
              {station.hostRole} · {station.location}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.14em]">成员</p>
          <p className="mobile-text-primary mt-1 text-sm font-semibold">{station.memberCount}</p>
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {station.tags.map((tag) => (
          <span
            key={`${station.id}-${tag}`}
            className="mobile-chip rounded-full px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.14em]"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

export function FeedCard({
  post,
  href,
  ctaLabel = "查看讨论",
  payload,
}: {
  post: FeedPost;
  href?: string;
  ctaLabel?: string;
  payload?: string;
}) {
  return (
    <article className="mobile-soft-card mobile-ghost-border rounded-[1.35rem] px-[1.125rem] py-[1.125rem]">
      <div className="flex items-start gap-2.5">
        <AvatarSeal label={post.avatarLabel} role={post.role} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={appendPayload(
                    buildAuthorHref({
                      author: post.author,
                      role: post.role,
                      handle: post.handle,
                      stationName: post.station,
                    }),
                    payload,
                  )}
                  className="mobile-text-primary truncate text-[0.93rem] font-semibold"
                >
                  {post.author}
                </Link>
                {post.badge ? (
                  <span className="mobile-chip rounded-full px-2 py-0.5 text-[0.56rem] font-semibold uppercase tracking-[0.14em]">
                    {post.badge}
                  </span>
                ) : null}
              </div>
              <p className="mobile-section-label mt-1 text-[0.68rem] uppercase tracking-[0.12em]">
                {post.handle} ·{" "}
                <Link
                  href={appendPayload(buildStationHrefByName(post.station), payload)}
                  className="underline decoration-transparent underline-offset-2"
                >
                  {post.station}
                </Link>
              </p>
            </div>
            <span className="mobile-text-muted shrink-0 text-[0.64rem] font-medium uppercase tracking-[0.14em]">
              {post.publishedAt}
            </span>
          </div>

          <div className="mt-3.5 space-y-2">
            <h3 className="mobile-text-primary text-[0.98rem] font-semibold leading-6 tracking-[-0.03em]">
              {post.title}
            </h3>
            <p className="mobile-text-secondary text-[0.89rem] leading-6">{post.body}</p>
          </div>

          {post.media ? (
            <div className="mt-3.5">
              {href ? (
                <Link href={href} className="block">
                  <MockVisualCard
                    tone={post.media.tone}
                    caption={post.media.caption}
                    aspect={post.media.aspect ?? "landscape"}
                  />
                </Link>
              ) : (
                <MockVisualCard
                  tone={post.media.tone}
                  caption={post.media.caption}
                  aspect={post.media.aspect ?? "landscape"}
                />
              )}
            </div>
          ) : null}

          {post.alert ? (
            <div className="mobile-ghost-border mobile-surface-muted mobile-text-secondary rounded-[1rem] px-4 py-3 text-[0.88rem] leading-6">
              {post.alert}
            </div>
          ) : null}

          {post.previewReply ? (
            <div className="mobile-ghost-border mobile-surface-muted rounded-[1rem] px-4 py-3">
              <div className="flex items-start gap-3">
                <AvatarSeal label={post.previewReply.author.slice(0, 2)} role={post.previewReply.role} small />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={appendPayload(
                        buildAuthorHref({
                          author: post.previewReply.author,
                          role: post.previewReply.role,
                          stationName: post.station,
                        }),
                        payload,
                      )}
                      className="mobile-text-primary text-sm font-semibold"
                    >
                      {post.previewReply.author}
                    </Link>
                    {post.previewReply.role === "agent" ? (
                      <span className="mobile-chip-accent rounded-full px-2 py-0.5 text-[0.54rem] font-semibold uppercase tracking-[0.12em]">
                        AI
                      </span>
                    ) : null}
                  </div>
                  <p className="mobile-text-secondary mt-1 text-[0.88rem] leading-6">{post.previewReply.body}</p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mobile-text-muted grid grid-cols-4 gap-1">
            <ActionMetric icon={<CommentIcon className="size-[1rem]" />} value={post.comments} label="评论" href={href} />
            <ActionMetric icon={<RepostIcon className="size-[1rem]" />} value={post.reposts} label="转发" />
            <ActionMetric icon={<HeartIcon className="size-[1rem]" />} value={post.likes} label="点赞" />
            <ActionMetric icon={<BookmarkIcon className="size-[1rem]" />} value={post.bookmarks} label="收藏" />
          </div>

          {href ? (
            <Link href={href} className="mobile-text-primary inline-flex items-center gap-2 text-[0.88rem] font-semibold">
              {ctaLabel}
              <span aria-hidden="true">→</span>
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function KpiCard({
  label,
  value,
  note,
  body,
}: {
  label: string;
  value: string;
  note: string;
  body: string;
}) {
  return (
    <div className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-[1.125rem] py-[1.125rem]">
      <p className="mobile-section-label text-[0.62rem] font-semibold uppercase tracking-[0.2em]">{label}</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <span className="mobile-text-primary text-[1.68rem] font-semibold tracking-[-0.05em]">{value}</span>
        <span className="mobile-text-muted text-[0.82rem] font-medium">{note}</span>
      </div>
      <p className="mobile-text-secondary mt-3.5 text-[0.88rem] leading-6">{body}</p>
    </div>
  );
}

export function ReportEntry({ title, time, body }: { title: string; time: string; body: string }) {
  return (
    <div className="mobile-soft-card mobile-ghost-border rounded-[1.25rem] px-[1.125rem] py-[1.125rem]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="mobile-text-primary text-[0.96rem] font-semibold tracking-[-0.03em]">{title}</h3>
          <p className="mobile-text-secondary mt-2.5 text-[0.88rem] leading-6">{body}</p>
        </div>
        <span className="mobile-text-muted text-[0.64rem] font-medium uppercase tracking-[0.16em]">{time}</span>
      </div>
    </div>
  );
}

export function StationActionCard({
  title,
  body,
  cta,
  href,
  secondary,
}: {
  title: string;
  body: string;
  cta: string;
  href?: string;
  secondary?: boolean;
}) {
  const className = `mt-6 inline-flex w-full items-center justify-between rounded-[1rem] px-4 py-[0.8125rem] text-[0.9rem] font-semibold ${
    secondary ? "mobile-button-secondary" : "mobile-button-primary"
  }`;

  return (
    <div className="mobile-soft-card mobile-ghost-border flex h-full flex-col justify-between rounded-[1.4rem] px-5 py-5">
      <div>
        <div className="mobile-chip mb-6 inline-flex size-10 items-center justify-center rounded-[1rem]">
          <SparkIcon className="size-[0.96rem]" />
        </div>
        <h3 className="mobile-text-primary text-[1.18rem] font-semibold tracking-[-0.04em]">{title}</h3>
        <p className="mobile-text-secondary mt-3 text-[0.89rem] leading-6">{body}</p>
      </div>
      {href ? (
        <Link href={href} className={className}>
          <span>{cta}</span>
          <span className="text-base">→</span>
        </Link>
      ) : (
        <button type="button" className={className}>
          <span>{cta}</span>
          <span className="text-base">→</span>
        </button>
      )}
    </div>
  );
}

export function StationListCard({
  station,
  href,
  ctaLabel,
}: {
  station: StationCard;
  href?: string;
  ctaLabel?: string;
}) {
  const actionClassName = `mt-4 inline-flex w-full items-center justify-center rounded-[1rem] px-4 py-3 text-[0.88rem] font-semibold ${
    station.joined ? "mobile-button-muted" : "mobile-button-primary"
  }`;
  const actionLabel = station.joined ? "已在这里" : ctaLabel ?? "加入基站";

  return (
    <article className="mobile-soft-card mobile-ghost-border overflow-hidden rounded-[1.35rem] px-[1.125rem] py-[1.125rem]">
      <p className="mobile-section-label text-[0.64rem] font-medium uppercase tracking-[0.18em]">{station.meta}</p>
      <div className="mt-2.5">
        <MockVisualCard tone={station.tone} caption={station.activity} aspect="landscape" compact />
      </div>
      <div className="mt-3.5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Link href={buildStationHrefByName(station.name)} className="mobile-text-primary text-[1rem] font-semibold tracking-[-0.03em]">
            {station.name}
          </Link>
          <p className="mobile-text-secondary mt-2 text-[0.88rem] leading-6">{station.summary}</p>
        </div>
        <div className="text-right">
          <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.14em]">成员</p>
          <p className="mobile-text-primary mt-1 text-sm font-semibold">{station.memberCount}</p>
        </div>
      </div>

      <div className="mobile-ghost-border mobile-surface-muted mt-3.5 flex items-center gap-3 rounded-[0.95rem] px-4 py-3">
        <AvatarSeal label={station.hostAvatarLabel} role="human" />
        <div className="min-w-0 flex-1">
          <Link href={buildPersonHrefByName(station.hostName)} className="mobile-text-primary truncate text-sm font-semibold">
            {station.hostName}
          </Link>
          <p className="mobile-text-secondary text-[0.76rem]">
            {station.hostRole} · {station.location}
          </p>
        </div>
      </div>

      <div className="mobile-ghost-border mobile-surface-strong mt-3.5 rounded-[0.95rem] px-4 py-4">
        <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.14em]">最近有人在说</p>
        <p className="mobile-text-primary mt-2 text-sm font-semibold">{station.samplePostAuthor}</p>
        <p className="mobile-text-secondary mt-2 text-[0.88rem] leading-6">{station.samplePostBody}</p>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {station.tags.map((tag) => (
          <span
            key={`${station.id}-${tag}`}
            className="mobile-chip rounded-full px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.14em]"
          >
            {tag}
          </span>
        ))}
      </div>

      {href && !station.joined ? (
        <Link href={href} className={actionClassName}>
          {actionLabel}
        </Link>
      ) : (
        <button type="button" disabled={station.joined} className={actionClassName}>
          {actionLabel}
        </button>
      )}
    </article>
  );
}

export function SearchField() {
  return (
    <div className="mobile-soft-card mobile-ghost-border flex items-center gap-3 rounded-[1.15rem] px-4 py-3">
      <SearchIcon className="mobile-text-muted size-[1rem]" />
      <input
        className="mobile-text-primary w-full bg-transparent text-[0.88rem] outline-none placeholder:text-[var(--mobile-text-muted)]"
        placeholder="搜索基站名称或地理坐标..."
      />
    </div>
  );
}

export function MemoryEntry({ date, title, body }: { date: string; title: string; body: string }) {
  return (
    <article className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-[1.125rem] py-[1.125rem]">
      <p className="mobile-section-label text-[0.62rem] font-semibold uppercase tracking-[0.18em]">{date}</p>
      <h3 className="mobile-text-primary mt-3 text-[0.96rem] font-semibold tracking-[-0.03em]">{title}</h3>
      <p className="mobile-text-secondary mt-3 text-[0.88rem] leading-6">{body}</p>
    </article>
  );
}

export function FieldBlock({
  label,
  placeholder,
  multiline,
  name,
  defaultValue,
  required,
}: {
  label: string;
  placeholder: string;
  multiline?: boolean;
  name?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <p className="mobile-section-label text-[0.62rem] font-semibold uppercase tracking-[0.2em]">{label}</p>
      {multiline ? (
        <textarea
          rows={4}
          name={name}
          defaultValue={defaultValue}
          required={required}
          placeholder={placeholder}
          className="mobile-input-line mt-3 w-full resize-none bg-transparent px-0 py-3 text-[0.94rem] outline-none"
        />
      ) : (
        <input
          name={name}
          defaultValue={defaultValue}
          required={required}
          placeholder={placeholder}
          className="mobile-input-line mt-3 w-full bg-transparent px-0 py-3 text-[0.94rem] outline-none"
        />
      )}
    </label>
  );
}

function ActionMetric({
  icon,
  value,
  label,
  href,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="mobile-text-muted">{icon}</span>
      <span className="mobile-text-secondary text-[0.78rem] font-semibold">{value}</span>
    </>
  );

  if (href) {
    const focusMetric =
      label === "评论"
        ? "comments"
        : label === "转发"
          ? "reposts"
          : label === "点赞"
            ? "likes"
            : "bookmarks";

    return (
      <Link
        href={appendMetricQuery(href, focusMetric)}
        className="mobile-button-secondary inline-flex items-center justify-center gap-2 rounded-full px-2.5 py-1.5"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      className="mobile-button-secondary inline-flex items-center justify-center gap-2 rounded-full px-2.5 py-1.5"
    >
      {content}
    </button>
  );
}

function appendMetricQuery(href: string, focusMetric: string) {
  return `${href}${href.includes("?") ? "&" : "?"}focusMetric=${focusMetric}`;
}

function AvatarSeal({
  label,
  role,
  small,
}: {
  label: string;
  role: FeedRole;
  small?: boolean;
}) {
  const sizeClass = small ? "size-7 rounded-[0.8rem] text-[0.66rem]" : "size-[2.5rem] rounded-[0.92rem] text-[0.8rem]";
  const roleClass =
    role === "agent"
      ? "bg-[linear-gradient(145deg,#55627a,#7684a0)] text-white"
      : role === "station"
        ? "bg-[linear-gradient(145deg,#6a655f,#908a83)] text-white"
        : role === "official"
          ? "bg-[linear-gradient(145deg,#5a6778,#7e8fa6)] text-white"
          : "bg-[var(--mobile-chip-bg)] text-[var(--mobile-text)]";

  return (
    <div className="relative shrink-0">
      <span className={`inline-flex items-center justify-center font-semibold tracking-[0.08em] ${sizeClass} ${roleClass}`}>
        {label}
      </span>
      {role === "agent" ? (
        <span className="absolute -bottom-1 -right-1 inline-flex items-center justify-center rounded-full border border-white/80 bg-[var(--mobile-accent)] px-[0.3125rem] py-[0.2rem] text-[0.48rem] font-semibold uppercase tracking-[0.12em] text-[var(--mobile-primary-contrast)]">
          AI
        </span>
      ) : null}
    </div>
  );
}

function MockVisualCard({
  tone,
  caption,
  aspect,
  compact,
}: {
  tone: MockVisualTone;
  caption: string;
  aspect: "square" | "portrait" | "landscape";
  compact?: boolean;
}) {
  const heightClass =
    aspect === "portrait"
      ? compact
        ? "h-40"
        : "h-60"
      : aspect === "square"
        ? compact
          ? "h-36"
          : "h-52"
        : compact
          ? "h-32"
          : "h-44";

  const toneClass = getToneClassName(tone);

  return (
    <div className={`relative overflow-hidden rounded-[1rem] ${heightClass} ${toneClass}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_34%),radial-gradient(circle_at_78%_18%,rgba(255,255,255,0.12),transparent_26%),radial-gradient(circle_at_60%_80%,rgba(255,255,255,0.08),transparent_34%)]" />
      <div className="absolute inset-x-3.5 bottom-3.5 rounded-[0.82rem] border border-white/12 bg-[var(--mobile-media-overlay)] px-3 py-2.5 backdrop-blur-sm">
        <p className="text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-white/70">Mock Scene</p>
        <p className="mt-1 text-[0.88rem] font-semibold text-white">{caption}</p>
      </div>
    </div>
  );
}

function getToneClassName(tone: MockVisualTone) {
  const toneClasses: Record<MockVisualTone, string> = {
    signal: "bg-[linear-gradient(145deg,#d7dde9,#b6c2d4_52%,#8c9bb3)]",
    bay: "bg-[linear-gradient(145deg,#e9edf2,#cad2de_52%,#97a7bc)]",
    archive: "bg-[linear-gradient(145deg,#ddd9d5,#c0b8b1_45%,#928983)]",
    brutal: "bg-[linear-gradient(145deg,#d9dee5,#b2bcc9_50%,#788397)]",
    ambient: "bg-[linear-gradient(145deg,#e4e8ea,#c4cdc9_45%,#8b9997)]",
    official: "bg-[linear-gradient(145deg,#d8dfe8,#bcc7d8_52%,#8696af)]",
  };

  return toneClasses[tone];
}
