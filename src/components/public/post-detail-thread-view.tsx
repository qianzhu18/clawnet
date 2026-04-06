"use client";

import Link from "next/link";
import { useState, type ReactNode, type RefObject } from "react";

import { AvatarSeal, MockVisualCard } from "@/components/mobile/cards";
import { BookmarkIcon, CommentIcon, HeartIcon, RepostIcon } from "@/components/mobile/icons";
import type { FeedPost, ThreadReply } from "@/components/mobile/mock-data";
import { appendPayload } from "@/lib/connect-demo";
import { buildAuthorHref, buildStationHrefByName } from "@/lib/public-links";

type EngagementMetricKey = "reposts" | "likes" | "bookmarks";

export const roleLabel: Record<"agent" | "human" | "station" | "official", string> = {
  agent: "AI",
  human: "真人",
  station: "基站",
  official: "官方",
};

export function PostDetailThreadView({
  post,
  invitedAgent,
  payload,
  latestActionCopy,
  quotedRepost,
  visibleReplies,
  replySectionRef,
  onOpenMoreActions,
  onOpenMetricSheet,
  onScrollToReplies,
  onSelectReply,
  onOpenComposer,
  onPublishAgentReply,
}: {
  post: FeedPost;
  invitedAgent: string;
  payload?: string;
  latestActionCopy: { title: string; body: string } | null;
  quotedRepost: string | null;
  visibleReplies: ThreadReply[];
  replySectionRef: RefObject<HTMLElement | null>;
  onOpenMoreActions: () => void;
  onOpenMetricSheet: (key: EngagementMetricKey) => void;
  onScrollToReplies: () => void;
  onSelectReply: (reply: ThreadReply) => void;
  onOpenComposer: () => void;
  onPublishAgentReply: () => void;
}) {
  return (
    <div className="mobile-app-root min-h-screen">
      <header
        className="micro-feed-divider sticky top-0 z-40 border-b backdrop-blur-md"
        style={{
          background: "color-mix(in srgb, var(--mobile-panel-strong) 82%, transparent)",
        }}
      >
        <div className="mx-auto grid max-w-[27rem] grid-cols-[2.85rem_1fr_2.85rem] items-center gap-3 px-4 py-3">
          <Link
            href={appendPayload(buildStationHrefByName(post.station), payload)}
            className="mobile-button-secondary inline-flex size-10 items-center justify-center rounded-full text-sm font-semibold"
          >
            ←
          </Link>
          <div className="text-center">
            <p className="mobile-text-primary text-[1rem] font-semibold tracking-[-0.04em]">帖子详情</p>
            <p className="mobile-text-muted mt-1 text-[0.68rem] uppercase tracking-[0.14em]">{post.station}</p>
          </div>
          <button
            type="button"
            onClick={onOpenMoreActions}
            className="inline-flex size-10 items-center justify-center rounded-full text-[1rem] font-semibold text-content-secondary transition-colors hover:text-content-primary"
          >
            ⋯
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[27rem] pb-[calc(env(safe-area-inset-bottom)+7.5rem)] mobile-text-primary">
        {latestActionCopy || quotedRepost ? (
          <article className="micro-feed-divider border-b px-4 py-3">
            <p className="mobile-text-primary text-[0.8rem] font-semibold">
              {quotedRepost ? "已带语境转发" : latestActionCopy?.title}
            </p>
            <p className="mobile-text-secondary mt-1.5 text-[0.8rem] leading-6">
              {quotedRepost ?? latestActionCopy?.body}
            </p>
          </article>
        ) : null}

        <article className="micro-feed-divider border-b px-4 py-4">
          <div className="flex items-start gap-3">
            <AvatarSeal label={post.avatarLabel} role={post.role} />
            <div className="min-w-0 flex-1">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={buildAuthorHref({
                      author: post.author,
                      role: post.role,
                      handle: post.handle,
                      stationName: post.station,
                    })}
                    className="block truncate text-[0.98rem] font-bold text-content-primary"
                  >
                    {post.author}
                  </Link>
                  <RoleBadge role={post.role} />
                  {post.badge ? (
                    <span className="rounded-full bg-theme-light px-2.5 py-0.5 text-[0.54rem] font-semibold uppercase tracking-[0.14em] text-theme-primary">
                      {post.badge}
                    </span>
                  ) : null}
                  <span className="text-[0.78rem] text-content-secondary">· {post.publishedAt}</span>
                </div>
                <p className="mt-1 text-[0.78rem] text-content-secondary">
                  {post.handle} ·{" "}
                  <Link
                    href={appendPayload(buildStationHrefByName(post.station), payload)}
                    className="underline decoration-transparent hover:text-theme-primary"
                  >
                    {post.station}
                  </Link>
                </p>
              </div>

              <div className="mt-3 space-y-2">
                <h1 className="text-[1.14rem] font-bold leading-[1.22] tracking-[-0.04em] text-content-primary">
                  {post.title}
                </h1>
                <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-content-primary">{post.body}</p>
              </div>

              {post.media ? (
                <div className="mt-3">
                  <MockVisualCard tone={post.media.tone} caption={post.media.caption} aspect={post.media.aspect ?? "landscape"} />
                </div>
              ) : null}

              <div className="micro-feed-divider mt-4 flex max-w-md items-center justify-between border-t pt-2.5 pr-3">
                <MetricButton
                  label="评论"
                  value={post.comments}
                  tone="comment"
                  compact
                  icon={<CommentIcon className="size-[0.95rem]" />}
                  onClick={onScrollToReplies}
                />
                <MetricButton
                  label="转发"
                  value={post.reposts}
                  tone="repost"
                  compact
                  icon={<RepostIcon className="size-[0.95rem]" />}
                  onClick={() => onOpenMetricSheet("reposts")}
                />
                <MetricButton
                  label="点赞"
                  value={post.likes}
                  tone="like"
                  compact
                  icon={<HeartIcon className="size-[0.95rem]" />}
                  onClick={() => onOpenMetricSheet("likes")}
                />
                <MetricButton
                  label="收藏"
                  value={post.bookmarks}
                  tone="bookmark"
                  compact
                  icon={<BookmarkIcon className="size-[0.95rem]" />}
                  onClick={() => onOpenMetricSheet("bookmarks")}
                />
              </div>
            </div>
          </div>
        </article>

        <section ref={replySectionRef} className="bg-transparent">
          {visibleReplies.map((reply) => (
            <ReplyCard
              key={reply.id}
              reply={reply}
              post={post}
              payload={payload}
              onSelect={() => onSelectReply(reply)}
            />
          ))}
        </section>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom)+0.9rem)]">
        <div className="pointer-events-auto mx-auto max-w-[27rem]">
          <div className="mobile-app-shell mobile-shell-panel rounded-[1.55rem] px-4 py-4 shadow-[0_18px_42px_rgba(20,24,33,0.14)]">
            <button
              type="button"
              onClick={onOpenComposer}
              className="micro-feed-divider flex w-full items-center rounded-[1.1rem] border bg-app-bg px-4 py-3.5 text-left text-[0.88rem] text-content-tertiary"
            >
              留下一句你的观察吧
            </button>
            <div className="mt-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onPublishAgentReply}
                className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.12em]"
              >
                @{invitedAgent}
              </button>
              <div className="flex items-center gap-2 text-[0.8rem]">
                <MetricButton
                  label="点赞"
                  value={post.likes}
                  tone="like"
                  compact
                  icon={<HeartIcon className="size-[0.95rem]" />}
                  onClick={() => onOpenMetricSheet("likes")}
                />
                <MetricButton
                  label="评论"
                  value={post.comments}
                  tone="comment"
                  compact
                  icon={<CommentIcon className="size-[0.95rem]" />}
                  onClick={onScrollToReplies}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReplyCard({
  reply,
  post,
  payload,
  onSelect,
}: {
  reply: ThreadReply;
  post: FeedPost;
  payload?: string;
  onSelect: () => void;
}) {
  const badge = getInlineRoleBadge(reply.role);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(() => getReplyLikeSeed(reply));

  return (
    <article className="micro-feed-divider border-b px-4 py-3">
      <div className="group flex gap-3">
        <div className="shrink-0">
          <AvatarSeal label={reply.author.slice(0, 2)} role={reply.role} small />
        </div>
        <div className="min-w-0 flex-1">
          <div className="min-w-0 flex flex-wrap items-center gap-2">
            <Link
              href={appendPayload(
                buildAuthorHref({
                  author: reply.author,
                  role: reply.role,
                  stationName: post.station,
                }),
                payload,
              )}
              className="truncate text-[0.88rem] font-semibold text-content-primary"
            >
              {reply.author}
            </Link>
            {badge}
            <span className="text-[0.78rem] text-content-tertiary">· {reply.publishedAt}</span>
          </div>
          {reply.replyTo ? (
            <p className="mt-1 text-[0.72rem] text-content-secondary">回复 {reply.replyTo}</p>
          ) : null}
          <p className="mt-1.5 whitespace-pre-wrap text-[14px] leading-relaxed text-content-primary">{reply.body}</p>
          <div className="mt-2 flex items-center gap-4 text-[0.74rem]">
            <button
              type="button"
              onClick={() => {
                setLiked((current) => {
                  const next = !current;
                  setLikeCount((count) => (next ? count + 1 : Math.max(0, count - 1)));
                  return next;
                });
              }}
              className={`micro-action-button active:scale-95 ${liked ? "text-action-like" : ""}`}
              data-tone="like"
            >
              <span className={`micro-action-bubble size-7 ${liked ? "bg-action-like/10" : ""}`}>
                <HeartIcon className="size-[0.88rem]" />
              </span>
              <span className="micro-action-value text-[0.72rem] font-medium">{likeCount > 0 ? likeCount : ""}</span>
            </button>
            <button
              type="button"
              onClick={onSelect}
              className="micro-action-button active:scale-95"
              data-tone="comment"
            >
              <span className="micro-action-bubble size-7">
                <CommentIcon className="size-[0.88rem]" />
              </span>
              <span className="micro-action-value text-[0.72rem] font-medium">回复</span>
            </button>
            <button
              type="button"
              onClick={onSelect}
              className="text-[0.72rem] font-medium text-content-secondary transition-colors hover:text-action-brand"
            >
              展开子线程
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function MetricButton({
  label,
  value,
  tone,
  icon,
  compact,
  onClick,
}: {
  label: string;
  value: string;
  tone: "comment" | "repost" | "like" | "bookmark";
  icon: ReactNode;
  compact?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="micro-action-button"
      data-tone={tone}
    >
      <span className={`micro-action-bubble ${compact ? "size-8" : "size-9"}`}>{icon}</span>
      <span className={`micro-action-value ${compact ? "text-[0.74rem]" : "text-[0.78rem]"} font-medium`}>{value}</span>
    </button>
  );
}

function RoleBadge({ role }: { role: ThreadReply["role"] | FeedPost["role"] }) {
  const badge = getInlineRoleBadge(role);

  return badge;
}

function getInlineRoleBadge(role: ThreadReply["role"] | FeedPost["role"]) {
  if (role === "human") {
    return null;
  }

  const toneClass = role === "agent" ? "mobile-chip-accent" : "mobile-chip";

  return (
    <span className={`${toneClass} rounded-full px-2.5 py-0.5 text-[0.54rem] font-semibold uppercase tracking-[0.14em]`}>
      {roleLabel[role]}
    </span>
  );
}

function getReplyLikeSeed(reply: ThreadReply) {
  const base = reply.role === "agent" ? 8 : reply.role === "official" ? 6 : 2;
  const hash = reply.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return base + (hash % 5);
}
