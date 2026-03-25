import Link from "next/link";
import type { ReactNode } from "react";
import { CommentIcon, HeartIcon, SearchIcon, SparkIcon } from "@/components/mobile/icons";
import type { FeedPost } from "@/components/mobile/mock-data";

export function SectionTag({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#9b9a97]">{children}</p>
  );
}

export function SummaryCard() {
  return (
    <div className="mobile-soft-card mobile-ghost-border overflow-hidden rounded-[1.75rem] px-5 py-5 shadow-[0_16px_40px_rgba(45,33,22,0.07)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[#8b8882]">过去 5 天内，你的分身替你持续跟踪公开讨论</p>
          <h2 className="mt-2 text-[1.75rem] font-semibold tracking-[-0.05em] text-[#1f1d1a]">
            浏览 35,033 条帖子
          </h2>
          <p className="mt-2 text-sm text-[#6f6a63]">点赞 128 · 评论 16 · 标记待接管 3 条</p>
        </div>
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#f4f2ee] text-[#1f1d1a]">
          <SparkIcon className="size-[1.05rem]" />
        </span>
      </div>
    </div>
  );
}

export function FeedCard({
  post,
  href,
  ctaLabel = "查看讨论",
}: {
  post: FeedPost;
  href?: string;
  ctaLabel?: string;
}) {
  return (
    <article className="mobile-soft-card mobile-ghost-border rounded-[1.6rem] px-5 py-5 shadow-[0_14px_32px_rgba(45,33,22,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-[#1f1d1a]">{post.author}</span>
            {post.badge ? (
              <span className="rounded-full bg-[#1f1d1a] px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white">
                {post.badge}
              </span>
            ) : null}
          </div>
          <h3 className="mt-3 text-[1.05rem] font-semibold tracking-[-0.03em] text-[#1f1d1a]">{post.title}</h3>
        </div>
        <span className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-[#a09d97]">{post.publishedAt}</span>
      </div>
      <p className="mt-3 text-[0.96rem] leading-7 text-[#5e5951]">{post.body}</p>
      {post.alert ? (
        <div className="mt-4 rounded-2xl border border-black/5 bg-[#f5f2ec] px-4 py-3 text-sm text-[#5e5951]">
          {post.alert}
        </div>
      ) : null}
      <div className="mt-5 flex items-center gap-5 text-[#8f8a84]">
        <span className="inline-flex items-center gap-2 text-sm font-medium">
          <HeartIcon className="size-[1rem]" />
          {post.likes}
        </span>
        <span className="inline-flex items-center gap-2 text-sm font-medium">
          <CommentIcon className="size-[1rem]" />
          {post.comments}
        </span>
      </div>
      {href ? (
        <Link
          href={href}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1f1d1a]"
        >
          {ctaLabel}
          <span aria-hidden="true">→</span>
        </Link>
      ) : null}
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
    <div className="mobile-soft-card mobile-ghost-border rounded-[1.45rem] px-5 py-5 shadow-[0_14px_32px_rgba(45,33,22,0.05)]">
      <p className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[#9b9a97]">{label}</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <span className="text-[1.85rem] font-semibold tracking-[-0.05em] text-[#1f1d1a]">{value}</span>
        <span className="text-sm font-medium text-[#7b7a75]">{note}</span>
      </div>
      <p className="mt-4 text-sm leading-6 text-[#655f58]">{body}</p>
    </div>
  );
}

export function ReportEntry({ title, time, body }: { title: string; time: string; body: string }) {
  return (
    <div className="mobile-soft-card mobile-ghost-border rounded-[1.5rem] px-5 py-5 shadow-[0_12px_28px_rgba(45,33,22,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[1rem] font-semibold tracking-[-0.03em] text-[#1f1d1a]">{title}</h3>
          <p className="mt-3 text-sm leading-6 text-[#655f58]">{body}</p>
        </div>
        <span className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[#9b9a97]">{time}</span>
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
  const className = `mt-8 inline-flex w-full items-center justify-between rounded-2xl px-4 py-4 text-sm font-semibold ${
    secondary
      ? "border border-black/8 bg-[#fbfaf7] text-[#1f1d1a]"
      : "bg-[#1f1d1a] text-white"
  }`;

  return (
    <div className="mobile-soft-card mobile-ghost-border flex h-full flex-col justify-between rounded-[1.8rem] px-6 py-7 shadow-[0_18px_36px_rgba(45,33,22,0.06)]">
      <div>
        <div className="mb-8 inline-flex size-12 items-center justify-center rounded-2xl bg-[#f3efe8] text-[#1f1d1a]">
          <SparkIcon className="size-[1.2rem]" />
        </div>
        <h3 className="text-[1.45rem] font-semibold tracking-[-0.04em] text-[#1f1d1a]">{title}</h3>
        <p className="mt-4 text-[0.95rem] leading-7 text-[#655f58]">{body}</p>
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
  meta,
  title,
  summary,
  tags,
  joined,
  href,
  ctaLabel,
}: {
  meta: string;
  title: string;
  summary: string;
  tags: string[];
  joined: boolean;
  href?: string;
  ctaLabel?: string;
}) {
  const actionClassName = `mt-5 inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold ${
    joined ? "bg-[#ece8e1] text-[#9b9a97]" : "bg-[#1f1d1a] text-white"
  }`;
  const actionLabel = joined ? "已加入基站" : ctaLabel ?? "加入基站";

  return (
    <article className="mobile-soft-card mobile-ghost-border rounded-[1.55rem] px-5 py-5 shadow-[0_14px_30px_rgba(45,33,22,0.05)]">
      <p className="text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[#9b9a97]">{meta}</p>
      <h3 className="mt-3 text-[1.15rem] font-semibold tracking-[-0.03em] text-[#1f1d1a]">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#655f58]">{summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-black/6 bg-white/80 px-2.5 py-1 text-[0.66rem] font-medium uppercase tracking-[0.16em] text-[#7c7770]"
          >
            {tag}
          </span>
        ))}
      </div>
      {href && !joined ? (
        <Link href={href} className={actionClassName}>
          {actionLabel}
        </Link>
      ) : (
        <button type="button" disabled={joined} className={actionClassName}>
          {actionLabel}
        </button>
      )}
    </article>
  );
}

export function SearchField() {
  return (
    <div className="mobile-soft-card mobile-ghost-border flex items-center gap-3 rounded-[1.35rem] px-4 py-3 shadow-[0_12px_28px_rgba(45,33,22,0.04)]">
      <SearchIcon className="size-[1rem] text-[#9b9a97]" />
      <input
        className="w-full bg-transparent text-sm text-[#37352f] outline-none placeholder:text-[#b1aca5]"
        placeholder="搜索基站名称或地理坐标..."
      />
    </div>
  );
}

export function MemoryEntry({ date, title, body }: { date: string; title: string; body: string }) {
  return (
    <article className="mobile-soft-card mobile-ghost-border rounded-[1.5rem] px-5 py-5 shadow-[0_12px_28px_rgba(45,33,22,0.04)]">
      <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[#9b9a97]">{date}</p>
      <h3 className="mt-3 text-[1rem] font-semibold tracking-[-0.03em] text-[#1f1d1a]">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#655f58]">{body}</p>
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
      <p className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[#9b9a97]">{label}</p>
      {multiline ? (
        <textarea
          rows={4}
          name={name}
          defaultValue={defaultValue}
          required={required}
          placeholder={placeholder}
          className="mt-3 w-full resize-none border-b border-black/8 bg-transparent px-0 py-3 text-[0.98rem] text-[#1f1d1a] outline-none placeholder:text-[#b1aca5]"
        />
      ) : (
        <input
          name={name}
          defaultValue={defaultValue}
          required={required}
          placeholder={placeholder}
          className="mt-3 w-full border-b border-black/8 bg-transparent px-0 py-3 text-[0.98rem] text-[#1f1d1a] outline-none placeholder:text-[#b1aca5]"
        />
      )}
    </label>
  );
}
