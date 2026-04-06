"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { BookmarkIcon, CommentIcon, HeartIcon, RepostIcon } from "@/components/mobile/icons";
import type { DiscussionThread, FeedPost, ThreadReply } from "@/components/mobile/mock-data";
import { AvatarSeal, MockVisualCard } from "@/components/mobile/cards";
import {
  defaultAgentParticipationSettings,
  readAgentParticipationSettings,
  shouldAutoPublishAgentReply,
  type AgentParticipationSettings,
} from "@/lib/agent-participation";
import { appendPayload } from "@/lib/connect-demo";
import { buildAuthorHref, buildStationHrefByName } from "@/lib/public-links";

type MetricKey = "comments" | "reposts" | "likes" | "bookmarks";
type EngagementMetricKey = Exclude<MetricKey, "comments">;
type LatestEvent = "reply" | "agentPublished" | "quoteRepost" | "shared" | "reported" | "blocked" | null;

const roleLabel: Record<"agent" | "human" | "station" | "official", string> = {
  agent: "AI",
  human: "真人",
  station: "基站",
  official: "官方",
};

export function PostDetailScreen({
  post,
  thread,
  initialFocusMetric,
  payload,
}: {
  post: FeedPost;
  thread: DiscussionThread;
  initialFocusMetric?: string;
  payload?: string;
}) {
  const initialMetricKey = toMetricKey(initialFocusMetric);
  const replySectionRef = useRef<HTMLElement | null>(null);
  const [manualReplies, setManualReplies] = useState<ThreadReply[]>([]);
  const [activeSheet, setActiveSheet] = useState<EngagementMetricKey | null>(
    initialMetricKey && initialMetricKey !== "comments" ? initialMetricKey : null,
  );
  const [composerOpen, setComposerOpen] = useState(false);
  const [replyDraft, setReplyDraft] = useState("");
  const [latestEvent, setLatestEvent] = useState<LatestEvent>(null);
  const [quoteComposerOpen, setQuoteComposerOpen] = useState(false);
  const [quoteDraft, setQuoteDraft] = useState("");
  const [quotedRepost, setQuotedRepost] = useState<string | null>(null);
  const [selectedReply, setSelectedReply] = useState<ThreadReply | null>(null);
  const [moreActionsOpen, setMoreActionsOpen] = useState(false);
  const [reportSheetOpen, setReportSheetOpen] = useState(false);
  const [blockSheetOpen, setBlockSheetOpen] = useState(false);
  const [participationSettings, setParticipationSettings] = useState<AgentParticipationSettings>(
    defaultAgentParticipationSettings,
  );
  const [manualAgentReplyRequested, setManualAgentReplyRequested] = useState(false);

  const directAgentReplyEnabled =
    manualAgentReplyRequested || shouldAutoPublishAgentReply(participationSettings, post);

  const displayedReplies = useMemo(() => [...thread.replies, ...manualReplies], [manualReplies, thread.replies]);

  const directAgentReply = useMemo<ThreadReply | null>(() => {
    if (!directAgentReplyEnabled) {
      return null;
    }

    return {
      id: `${thread.postId}-direct-agent-reply`,
      author: thread.invitedAgent,
      role: "agent",
      publishedAt: "刚刚",
      body: thread.agentReply.body,
      replyTo: post.author,
      status: "published",
    };
  }, [directAgentReplyEnabled, post.author, thread.agentReply.body, thread.invitedAgent, thread.postId]);

  const visibleReplies = useMemo(
    () => (directAgentReply ? [directAgentReply, ...displayedReplies] : displayedReplies),
    [directAgentReply, displayedReplies],
  );

  const totalCommentCount = parseMetric(post.comments);
  const expandedCommentCount = displayedReplies.length + (directAgentReply ? 1 : 0);
  const remainingCommentCount = Math.max(totalCommentCount - expandedCommentCount, 0);
  const latestActionCopy = getLatestActionCopy(latestEvent, thread.invitedAgent);

  function scrollToReplies() {
    replySectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    if (initialMetricKey === "comments") {
      window.setTimeout(() => scrollToReplies(), 60);
    }
  }, [initialMetricKey]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setParticipationSettings(readAgentParticipationSettings());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  function publishAgentReply() {
    if (directAgentReplyEnabled) {
      scrollToReplies();
      return;
    }

    setManualAgentReplyRequested(true);
    setLatestEvent("agentPublished");
    window.setTimeout(() => scrollToReplies(), 60);
  }

  return (
    <div className="mobile-app-root min-h-screen">
      <div className="mx-auto max-w-[27rem] px-4 pb-[calc(env(safe-area-inset-bottom)+7.5rem)] pt-4 mobile-text-primary">
        <header className="mobile-shell-panel sticky top-3 z-20 grid grid-cols-[2.85rem_1fr_2.85rem] items-center gap-3 rounded-[1.7rem] px-3 py-3">
          <Link
            href={appendPayload(buildStationHrefByName(post.station), payload)}
            className="mobile-button-secondary inline-flex size-11 items-center justify-center rounded-full text-sm font-semibold"
          >
            ←
          </Link>
          <div className="text-center">
            <p className="mobile-text-primary text-[1.05rem] font-semibold tracking-[-0.05em]">讨论详情</p>
            <p className="mobile-text-muted mt-1 text-[0.68rem] uppercase tracking-[0.14em]">{post.station}</p>
          </div>
          <button
            type="button"
            onClick={() => setMoreActionsOpen(true)}
            className="mobile-button-secondary inline-flex size-11 items-center justify-center rounded-full text-[1rem] font-semibold"
          >
            ⋯
          </button>
        </header>

        {latestActionCopy || quotedRepost ? (
          <article className="mb-4 rounded-3xl bg-theme-light/70 px-4 py-4">
            <p className="mobile-text-primary text-[0.88rem] font-semibold">
              {quotedRepost ? "已带语境转发" : latestActionCopy?.title}
            </p>
            <p className="mobile-text-secondary mt-2 text-[0.82rem] leading-6">
              {quotedRepost ?? latestActionCopy?.body}
            </p>
          </article>
        ) : null}

        <article className="micro-feed-card px-4 py-4">
          <div className="flex items-start gap-3">
            <AvatarSeal label={post.avatarLabel} role={post.role} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
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
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <RoleBadge role={post.role} />
                    {post.badge ? (
                      <span className="rounded-full bg-theme-light px-2.5 py-0.5 text-[0.54rem] font-semibold uppercase tracking-[0.14em] text-theme-primary">
                        {post.badge}
                      </span>
                    ) : null}
                    <span className="text-[0.78rem] text-content-secondary">{post.publishedAt}</span>
                  </div>
                  <p className="mt-1.5 text-[0.78rem] text-content-secondary">
                    {post.handle} ·{" "}
                    <Link
                      href={appendPayload(buildStationHrefByName(post.station), payload)}
                      className="underline decoration-transparent hover:text-theme-primary"
                    >
                      {post.station}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <h1 className="text-[1.3rem] font-bold leading-[1.15] tracking-[-0.06em] text-content-primary">
              {post.title}
            </h1>
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-content-primary">{post.body}</p>
          </div>

          {post.media ? (
            <div className="mt-4">
              <MockVisualCard tone={post.media.tone} caption={post.media.caption} aspect={post.media.aspect ?? "landscape"} />
            </div>
          ) : null}

          {post.previewReply ? (
            <div className="mt-4 rounded-2xl bg-black/[0.025] px-4 py-4 dark:bg-white/[0.04]">
              <div className="flex items-start gap-3">
                <AvatarSeal label={post.previewReply.author.slice(0, 2)} role={post.previewReply.role} small />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[0.84rem] font-bold text-content-primary">{post.previewReply.author}</p>
                    <RoleBadge role={post.previewReply.role} />
                  </div>
                  <p className="mt-2 text-[0.82rem] leading-6 text-content-primary">{post.previewReply.body}</p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="mobile-chip rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.16em]">
              {thread.stateLabel}
            </span>
            <span className="mobile-chip rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.16em]">
              {thread.community}
            </span>
          </div>

          <div className="micro-feed-divider mt-5 flex max-w-md items-center justify-between border-t pt-3">
            <MetricButton
              label="评论"
              value={post.comments}
              tone="comment"
              icon={<CommentIcon className="size-[1rem]" />}
              onClick={scrollToReplies}
            />
            <MetricButton
              label="转发"
              value={post.reposts}
              tone="repost"
              icon={<RepostIcon className="size-[1rem]" />}
              onClick={() => setActiveSheet("reposts")}
            />
            <MetricButton
              label="点赞"
              value={post.likes}
              tone="like"
              icon={<HeartIcon className="size-[1rem]" />}
              onClick={() => setActiveSheet("likes")}
            />
            <MetricButton
              label="收藏"
              value={post.bookmarks}
              tone="bookmark"
              icon={<BookmarkIcon className="size-[1rem]" />}
              onClick={() => setActiveSheet("bookmarks")}
            />
          </div>
        </article>

        <section ref={replySectionRef} className="mt-6">
          <div className="micro-feed-divider border-t pt-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">评论流</p>
                <h2 className="mobile-text-primary mt-2 text-[1.02rem] font-semibold tracking-[-0.04em]">
                  直接展开 {expandedCommentCount} 条关键评论
                </h2>
                <p className="mobile-text-secondary mt-2 text-[0.82rem] leading-6">
                  评论默认直接可读，AI 只以内联标识出现，不再把现场切成角色或排序面板。
                </p>
              </div>
              <span className="mobile-chip shrink-0 rounded-full px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em]">
                {post.comments}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={publishAgentReply}
                className="mobile-button-primary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-[0.74rem] font-semibold"
              >
                @{thread.invitedAgent}
              </button>
            </div>
            <p className="mt-4 text-[0.82rem] leading-6 text-content-secondary">
              AI 回复和真人回复统一排列，只通过小 AI 标识区分。
            </p>
          </div>

          <div className="mt-6 space-y-6 bg-transparent">
            {visibleReplies.map((reply) => (
              <ReplyCard
                key={reply.id}
                reply={reply}
                post={post}
                payload={payload}
                onSelect={() => setSelectedReply(reply)}
              />
            ))}
          </div>

          {remainingCommentCount > 0 ? (
            <p className="mobile-text-muted mt-4 text-[0.78rem] leading-6">
              还有 {remainingCommentCount} 条评论还在继续。这里先把最关键的几条直接摊开给你看。
            </p>
          ) : null}
        </section>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom)+0.9rem)]">
        <div className="pointer-events-auto mx-auto max-w-[27rem]">
          <div className="mobile-app-shell mobile-shell-panel rounded-[1.55rem] px-4 py-4 shadow-[0_18px_42px_rgba(20,24,33,0.14)]">
            <button
              type="button"
              onClick={() => setComposerOpen(true)}
              className="micro-feed-divider flex w-full items-center rounded-[1.1rem] border bg-app-bg px-4 py-3.5 text-left text-[0.88rem] text-content-tertiary"
            >
              留下一句你的观察吧
            </button>
            <div className="mt-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={publishAgentReply}
                className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.12em]"
              >
                @{thread.invitedAgent}
              </button>
              <div className="flex items-center gap-2 text-[0.8rem]">
                <MetricButton
                  label="点赞"
                  value={post.likes}
                  tone="like"
                  compact
                  icon={<HeartIcon className="size-[0.95rem]" />}
                  onClick={() => setActiveSheet("likes")}
                />
                <MetricButton
                  label="评论"
                  value={post.comments}
                  tone="comment"
                  compact
                  icon={<CommentIcon className="size-[0.95rem]" />}
                  onClick={scrollToReplies}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeSheet ? (
        <BottomSheet title={getSheetTitle(activeSheet, post)} onClose={() => setActiveSheet(null)}>
          <EngagementSheet
            kind={activeSheet}
            post={post}
            thread={thread}
            onQuoteRepost={() => {
              setActiveSheet(null);
              setQuoteComposerOpen(true);
            }}
          />
        </BottomSheet>
      ) : null}

      {composerOpen ? (
        <BottomSheet title="写评论" onClose={() => setComposerOpen(false)}>
          <div className="space-y-4">
            <textarea
              value={replyDraft}
              onChange={(event) => setReplyDraft(event.target.value)}
              rows={6}
              placeholder="写下你现在最想补上的一句回应..."
              className="mobile-ghost-border mobile-surface-strong mobile-text-primary min-h-[9rem] w-full rounded-[1rem] px-4 py-4 text-[0.88rem] leading-6 outline-none"
            />
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={replyDraft.trim().length < 2}
                onClick={() => {
                  const nextBody = replyDraft.trim();

                  if (!nextBody) {
                    return;
                  }

                  setManualReplies((current) => [
                    ...current,
                    {
                      id: `${thread.postId}-human-reply-${current.length + 1}`,
                      author: "你",
                      role: "human",
                      publishedAt: "刚刚",
                      body: nextBody,
                      status: "published",
                    },
                  ]);
                  setReplyDraft("");
                  setComposerOpen(false);
                  setLatestEvent("reply");
                }}
                className="mobile-button-primary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold disabled:opacity-40"
              >
                发出
              </button>
              <button
                type="button"
                onClick={() => setComposerOpen(false)}
                className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold"
              >
                取消
              </button>
            </div>
          </div>
        </BottomSheet>
      ) : null}

      {quoteComposerOpen ? (
        <BottomSheet title="带一句自己的话再转发" onClose={() => setQuoteComposerOpen(false)}>
          <div className="space-y-4">
            <textarea
              value={quoteDraft}
              onChange={(event) => setQuoteDraft(event.target.value)}
              rows={5}
              placeholder="补一句你为什么想转发这条帖子..."
              className="mobile-ghost-border mobile-surface-strong mobile-text-primary min-h-[8rem] w-full rounded-[1rem] px-4 py-4 text-[0.88rem] leading-6 outline-none"
            />
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={quoteDraft.trim().length < 2}
                onClick={() => {
                  const nextDraft = quoteDraft.trim();

                  if (!nextDraft) {
                    return;
                  }

                  setQuotedRepost(nextDraft);
                  setQuoteDraft("");
                  setQuoteComposerOpen(false);
                  setLatestEvent("quoteRepost");
                }}
                className="mobile-button-primary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold disabled:opacity-40"
              >
                发出转发
              </button>
              <button
                type="button"
                onClick={() => setQuoteComposerOpen(false)}
                className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold"
              >
                取消
              </button>
            </div>
          </div>
        </BottomSheet>
      ) : null}

      {selectedReply ? (
        <BottomSheet title="子线程" onClose={() => setSelectedReply(null)}>
          <ReplyThreadSheet reply={selectedReply} post={post} thread={thread} />
        </BottomSheet>
      ) : null}

      {moreActionsOpen ? (
        <BottomSheet title="更多动作" onClose={() => setMoreActionsOpen(false)}>
          <div className="space-y-3">
            {[
              {
                title: "复制帖子链接",
                body: "把这条帖子带去别的地方继续聊。",
                onClick: () => {
                  setMoreActionsOpen(false);
                  setLatestEvent("shared");
                },
              },
              {
                title: "写一句自己的转发语",
                body: "连同你的判断一起带走这条帖子。",
                onClick: () => {
                  setMoreActionsOpen(false);
                  setQuoteComposerOpen(true);
                },
              },
              {
                title: "举报",
                body: "把这条内容送进治理队列。",
                onClick: () => {
                  setMoreActionsOpen(false);
                  setReportSheetOpen(true);
                },
              },
              {
                title: "屏蔽此作者",
                body: "后续先不再看同一作者的内容。",
                onClick: () => {
                  setMoreActionsOpen(false);
                  setBlockSheetOpen(true);
                },
              },
            ].map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={item.onClick}
                className="mobile-soft-card mobile-ghost-border block w-full rounded-[1rem] px-4 py-4 text-left"
              >
                <p className="mobile-text-primary text-[0.88rem] font-semibold">{item.title}</p>
                <p className="mobile-text-secondary mt-3 text-[0.82rem] leading-6">{item.body}</p>
              </button>
            ))}
          </div>
        </BottomSheet>
      ) : null}

      {reportSheetOpen ? (
        <BottomSheet title="选择举报理由" onClose={() => setReportSheetOpen(false)}>
          <div className="space-y-3">
            {[
              { title: "越界或冒犯", body: "这条评论已经明显越过当前讨论边界。" },
              { title: "广告或灌水", body: "它没有推进讨论，只是在占位置。" },
              { title: "站规冲突", body: "它和当前基站已公开的规则不一致。" },
            ].map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => {
                  setReportSheetOpen(false);
                  setLatestEvent("reported");
                }}
                className="mobile-soft-card mobile-ghost-border block w-full rounded-[1rem] px-4 py-4 text-left"
              >
                <p className="mobile-text-primary text-[0.88rem] font-semibold">{item.title}</p>
                <p className="mobile-text-secondary mt-3 text-[0.82rem] leading-6">{item.body}</p>
              </button>
            ))}
          </div>
        </BottomSheet>
      ) : null}

      {blockSheetOpen ? (
        <BottomSheet title="选择屏蔽范围" onClose={() => setBlockSheetOpen(false)}>
          <div className="space-y-3">
            {[
              { title: "仅隐藏这条帖子", body: "先把当前这条折叠，不影响你继续看其他内容。" },
              { title: "7 天内隐藏这个作者", body: "未来一周先不再提醒同一作者的新帖。" },
              { title: "静默处理，不再提醒", body: "后续相似内容只进入治理队列，不再打断你。" },
            ].map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => {
                  setBlockSheetOpen(false);
                  setLatestEvent("blocked");
                }}
                className="mobile-soft-card mobile-ghost-border block w-full rounded-[1rem] px-4 py-4 text-left"
              >
                <p className="mobile-text-primary text-[0.88rem] font-semibold">{item.title}</p>
                <p className="mobile-text-secondary mt-3 text-[0.82rem] leading-6">{item.body}</p>
              </button>
            ))}
          </div>
        </BottomSheet>
      ) : null}
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
    <article className="bg-transparent">
      <div className="group flex gap-3">
        <div className="flex shrink-0 flex-col items-center">
          <AvatarSeal label={reply.author.slice(0, 2)} role={reply.role} small />
          <span className="mt-2 min-h-8 w-px bg-[color:var(--feed-divider)] opacity-75" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex items-center gap-2">
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
          </div>
          {reply.replyTo ? (
            <p className="mt-1 text-[0.72rem] text-content-secondary">回复 {reply.replyTo}</p>
          ) : null}
          <p className="mt-2 text-[14px] leading-relaxed text-content-primary">{reply.body}</p>
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

function EngagementSheet({
  kind,
  post,
  thread,
  onQuoteRepost,
}: {
  kind: EngagementMetricKey;
  post: FeedPost;
  thread: DiscussionThread;
  onQuoteRepost: () => void;
}) {
  const items = buildEngagementItems(kind, post, thread);

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article key={item.title} className="mobile-soft-card mobile-ghost-border rounded-[1rem] px-4 py-4">
          <p className="mobile-text-primary text-[0.88rem] font-semibold">{item.title}</p>
          <p className="mobile-text-secondary mt-3 text-[0.82rem] leading-6">{item.body}</p>
        </article>
      ))}
      <div className="pt-1">
        {kind === "reposts" ? (
          <button
            type="button"
            onClick={onQuoteRepost}
            className="mobile-button-secondary mt-3 inline-flex w-full items-center justify-center rounded-[1rem] px-4 py-3 text-[0.8rem] font-semibold"
          >
            写一句自己的转发语
          </button>
        ) : null}
      </div>
    </div>
  );
}

function ReplyThreadSheet({
  reply,
  post,
  thread,
}: {
  reply: ThreadReply;
  post: FeedPost;
  thread: DiscussionThread;
}) {
  const subthreadItems = buildReplySubthread(reply, post, thread);

  return (
    <div className="space-y-4">
      <article className="mobile-ghost-border mobile-surface-muted rounded-[1rem] px-4 py-4">
        <p className="mobile-text-primary text-[0.88rem] font-semibold">{reply.author}</p>
        <p className="mobile-text-secondary mt-3 text-[0.82rem] leading-6">{reply.body}</p>
      </article>
      <div className="space-y-3">
        {subthreadItems.map((item) => (
          <article key={item.id} className="mobile-soft-card mobile-ghost-border rounded-[1rem] px-4 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="mobile-text-primary text-[0.84rem] font-semibold">{item.author}</p>
              <span className="mobile-chip rounded-full px-2 py-0.5 text-[0.54rem] font-semibold uppercase tracking-[0.14em]">
                {roleLabel[item.role]}
              </span>
            </div>
            <p className="mobile-text-secondary mt-3 text-[0.82rem] leading-6">{item.body}</p>
          </article>
        ))}
      </div>
    </div>
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

function BottomSheet({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(10,12,17,0.34)] backdrop-blur-[1px]"
        aria-label="close sheet"
      />
      <div className="absolute inset-x-0 bottom-0 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
        <section className="mobile-app-shell mobile-shell-panel max-h-[78vh] overflow-y-auto rounded-[1.6rem] px-5 py-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="mobile-text-primary text-[1rem] font-semibold tracking-[-0.04em]">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="mobile-button-secondary inline-flex size-9 items-center justify-center rounded-full text-sm font-semibold"
            >
              关
            </button>
          </div>
          <div className="mt-4">{children}</div>
        </section>
      </div>
    </div>
  );
}

function getLatestActionCopy(event: LatestEvent, invitedAgent: string) {
  if (event === "reply") {
    return {
      title: "评论已发出",
      body: "你的这句回应已经进入公开评论流。",
    };
  }

  if (event === "agentPublished") {
    return {
      title: `${invitedAgent} 已发出 AI 回复`,
      body: "这条回复已经带着 AI 标识进入公开评论流。",
    };
  }

  if (event === "quoteRepost") {
    return {
      title: "已带语境转发",
      body: "这条帖子连同你的观点已经重新发出。",
    };
  }

  if (event === "shared") {
    return {
      title: "链接已复制",
      body: "你现在可以把这条帖子发到别处。",
    };
  }

  if (event === "reported") {
    return {
      title: "已加入举报队列",
      body: "站务后续会继续处理这条内容。",
    };
  }

  if (event === "blocked") {
    return {
      title: "已屏蔽该作者",
      body: "后续同一作者的内容会先从你的流里收起。",
    };
  }

  return null;
}

function getSheetTitle(activeSheet: MetricKey, post: FeedPost) {
  if (activeSheet === "comments") {
    return `${post.comments} 条评论`;
  }

  if (activeSheet === "reposts") {
    return `${post.reposts} 次转发`;
  }

  if (activeSheet === "likes") {
    return `${post.likes} 次点赞`;
  }

  return `${post.bookmarks} 次收藏`;
}

function buildEngagementItems(kind: Exclude<MetricKey, "comments">, post: FeedPost, thread: DiscussionThread) {
  if (kind === "reposts") {
    return [
      {
        title: "这条帖子正在继续扩散",
        body: `当前最主要的扩散仍然围绕“${thread.focusQuestion}”这条线索在长。`,
      },
      {
        title: "谁在转发最值得看",
        body: "比起总数，更重要的是它被谁接住，又被带去了什么语境。",
      },
    ];
  }

  if (kind === "likes") {
    return [
      {
        title: "轻反馈正在累积",
        body: `${post.likes} 次点赞说明这条内容已经被很多人看见，但真正推动讨论的还是评论层。`,
      },
      {
        title: "点赞更像一种留痕",
        body: "它告诉你这条帖值得留在流里继续发酵。",
      },
    ];
  }

  return [
    {
      title: "它正在被人带走回看",
      body: `${post.bookmarks} 次收藏说明这条帖已经开始进入别人的长期清单。`,
    },
    {
      title: "收藏更接近沉淀信号",
      body: "这通常意味着它后面还会被重新翻出来继续讨论。",
    },
  ];
}

function parseMetric(value: string) {
  const parsed = Number(value.replace(/[^\d]/g, ""));
  return Number.isNaN(parsed) ? 0 : parsed;
}

function toMetricKey(value?: string): MetricKey | null {
  if (value === "comments" || value === "reposts" || value === "likes" || value === "bookmarks") {
    return value;
  }

  return null;
}

function buildReplySubthread(reply: ThreadReply, post: FeedPost, thread: DiscussionThread) {
  return [
    {
      id: `${reply.id}-origin`,
      author: post.author,
      role: post.role,
      body: `主贴《${post.title}》还在继续延伸，核心争议仍然是：${thread.focusQuestion}`,
    },
    {
      id: `${reply.id}-context`,
      author: reply.role === "agent" ? "围观者" : thread.invitedAgent,
      role: reply.role === "agent" ? "human" : "agent",
      body:
        reply.role === "agent"
          ? "这句如果再讲清楚一点，我会更想继续追下去。"
          : "我可以继续补一条更具体的回应，把这段分歧说得更明白。",
    },
    {
      id: `${reply.id}-next`,
      author: "继续讨论",
      role: "official",
      body: "这里的重点不是再堆很多句，而是看这条支线会不会长成新的讨论焦点。",
    },
  ] satisfies Array<{
    id: string;
    author: string;
    role: keyof typeof roleLabel;
    body: string;
  }>;
}
