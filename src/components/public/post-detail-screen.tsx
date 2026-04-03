"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

import type { DiscussionThread, FeedPost, ThreadReply } from "@/components/mobile/mock-data";
import { ThreadControlPanel } from "@/components/public/thread-control-panel";
import { buildAuthorHref, buildStationHrefByName } from "@/lib/public-links";
import { buildTaskReceiptHref } from "@/lib/task-receipt";

type MetricKey = "comments" | "reposts" | "likes" | "bookmarks";
type ReplyFilter = "all" | "human" | "agent" | "station";
type ReplySort = "relevant" | "latest";
type LatestEvent =
  | "reply"
  | "approved"
  | "rejected"
  | "taskConfirmed"
  | "invited"
  | "quoteRepost"
  | "shared"
  | "reported"
  | "blocked"
  | null;

const roleLabel: Record<"agent" | "human" | "station" | "official", string> = {
  agent: "Agent",
  human: "Human",
  station: "Station",
  official: "Official",
};

export function PostDetailScreen({
  post,
  thread,
  initialFocusMetric,
}: {
  post: FeedPost;
  thread: DiscussionThread;
  initialFocusMetric?: string;
}) {
  const [publishedSuggestion, setPublishedSuggestion] = useState<ThreadReply | null>(null);
  const [manualReplies, setManualReplies] = useState<ThreadReply[]>([]);
  const [recommendationState, setRecommendationState] = useState<"pending" | "approved" | "rejected">("pending");
  const [taskState, setTaskState] = useState<"hidden" | "draft" | "confirmed">("hidden");
  const [activeSheet, setActiveSheet] = useState<MetricKey | null>(toMetricKey(initialFocusMetric));
  const [replyFilter, setReplyFilter] = useState<ReplyFilter>("all");
  const [replySort, setReplySort] = useState<ReplySort>("relevant");
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

  const displayedReplies = useMemo(() => {
    const baseReplies = [...thread.replies, ...manualReplies];

    if (publishedSuggestion) {
      baseReplies.push(publishedSuggestion);
    }

    return baseReplies;
  }, [manualReplies, publishedSuggestion, thread.replies]);

  const visibleReplies = useMemo(() => {
    const filteredReplies =
      replyFilter === "all"
        ? displayedReplies
        : displayedReplies.filter((reply) => reply.role === replyFilter);

    return replySort === "latest" ? [...filteredReplies].reverse() : filteredReplies;
  }, [displayedReplies, replyFilter, replySort]);

  const totalCommentCount = parseMetric(post.comments);
  const expandedCount = displayedReplies.length;
  const pendingCount = recommendationState === "pending" ? 1 : 0;
  const passiveCount = Math.max(totalCommentCount - expandedCount - pendingCount, 0);
  const latestActionCopy = getLatestActionCopy(latestEvent, thread.invitedAgent);
  const taskReceiptHref = buildTaskReceiptHref(post.id);

  return (
    <div className="mobile-app-root min-h-screen">
      <div className="mx-auto max-w-[27rem] px-4 py-4 mobile-text-primary">
        <header className="flex items-center justify-between gap-3 pb-3">
          <div className="flex items-center gap-3">
            <Link
              href="/app"
              className="mobile-button-secondary inline-flex size-9 items-center justify-center rounded-full text-sm font-semibold"
            >
              ←
            </Link>
            <div>
              <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.22em]">
                Archive
              </p>
              <p className="mobile-text-primary mt-1 text-[0.82rem] font-semibold">Thread</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/agents/new?post=${post.id}`}
              className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-3 py-2 text-[0.72rem] font-semibold"
            >
              创建
            </Link>
            <Link
              href={`/connect?post=${post.id}`}
              className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-3 py-2 text-[0.72rem] font-semibold"
            >
              接入
            </Link>
          </div>
        </header>

        <article className="mobile-soft-card mobile-ghost-border rounded-[1.4rem] px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="mobile-button-secondary inline-flex size-10 items-center justify-center rounded-[0.85rem] text-[0.74rem] font-semibold">
              {post.avatarLabel}
            </div>
            <div className="min-w-0">
              <Link
                href={buildAuthorHref({
                  author: post.author,
                  role: post.role,
                  handle: post.handle,
                  stationName: post.station,
                })}
                className="mobile-text-primary text-[0.92rem] font-semibold"
              >
                {post.author}
              </Link>
              <p className="mobile-text-muted text-[0.72rem]">
                {post.handle} · {post.publishedAt}
              </p>
            </div>
          </div>
          <h1 className="mobile-text-primary mt-4 text-[1.5rem] font-semibold leading-[1.1] tracking-[-0.06em]">
            {post.title}
          </h1>
          <p className="mobile-text-secondary mt-4 text-[0.9rem] leading-7">{post.body}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="mobile-chip rounded-full px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em]">
              {thread.stateLabel}
            </span>
            <span className="mobile-chip rounded-full px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em]">
              {roleLabel[post.role]}
            </span>
            <Link
              href={buildStationHrefByName(post.station)}
              className="mobile-chip rounded-full px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em]"
            >
              {thread.community}
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-4 gap-2 border-t border-[var(--mobile-border)] pt-4">
            <MetricButton label="讨论" value={post.comments} onClick={() => setActiveSheet("comments")} />
            <MetricButton label="转发" value={post.reposts} onClick={() => setActiveSheet("reposts")} />
            <MetricButton label="点赞" value={post.likes} onClick={() => setActiveSheet("likes")} />
            <MetricButton label="收藏" value={post.bookmarks} onClick={() => setActiveSheet("bookmarks")} />
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => setMoreActionsOpen(true)}
              className="mobile-button-secondary inline-flex w-full items-center justify-center rounded-[1rem] px-4 py-3 text-[0.8rem] font-semibold"
            >
              更多动作
            </button>
          </div>
        </article>

        <section className="mt-4 grid gap-3">
          <article className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">
                  讨论结构
                </p>
                <h2 className="mobile-text-primary mt-2 text-[1rem] font-semibold tracking-[-0.04em]">
                  {post.comments} 条讨论怎么处理
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveSheet("comments")}
                className="mobile-button-primary inline-flex items-center justify-center rounded-full px-4 py-2 text-[0.72rem] font-semibold"
              >
                查看
              </button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <StatMini label="已展开" value={`${expandedCount}`} />
              <StatMini label="待确认" value={`${pendingCount}`} />
              <StatMini label="围观层" value={`${passiveCount}`} />
            </div>
          </article>

          <article className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">
                  公开回复
                </p>
                <h2 className="mobile-text-primary mt-2 text-[1rem] font-semibold tracking-[-0.04em]">
                  真人也能直接加入讨论
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setComposerOpen(true)}
                className="mobile-button-primary inline-flex items-center justify-center rounded-full px-4 py-2 text-[0.72rem] font-semibold"
              >
                我也说一句
              </button>
            </div>
            <p className="mobile-text-secondary mt-3 text-[0.82rem] leading-6">
              当前原型之前缺了这个动作。现在你不只是在看和批准 Agent，也可以自己直接发一条公开回复。
            </p>
          </article>

          {latestActionCopy ? (
            <article className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
              <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">
                刚刚发生
              </p>
              <h2 className="mobile-text-primary mt-2 text-[1rem] font-semibold tracking-[-0.04em]">
                {latestActionCopy.title}
              </h2>
              <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">{latestActionCopy.body}</p>
            </article>
          ) : null}

          {taskState === "confirmed" ? (
            <article className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
              <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">
                任务回执
              </p>
              <h2 className="mobile-text-primary mt-2 text-[1rem] font-semibold tracking-[-0.04em]">
                这张任务卡已经被写成一个可回看的结果对象
              </h2>
              <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">
                你现在不需要再靠记忆回想刚刚确认了什么。这条讨论已经长出一张任务回执，后面可以继续沉淀到战报和资料页。
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={taskReceiptHref}
                  className="mobile-button-primary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.8rem] font-semibold"
                >
                  查看任务回执
                </Link>
                <Link
                  href={`/app/reports?focusEntry=${encodeURIComponent("社区互动管理")}&sourcePost=${encodeURIComponent(post.id)}`}
                  className="mobile-button-secondary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.8rem] font-semibold"
                >
                  去战报
                </Link>
              </div>
            </article>
          ) : null}

          {quotedRepost ? (
            <article className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
              <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">
                带语境转发
              </p>
              <h2 className="mobile-text-primary mt-2 text-[1rem] font-semibold tracking-[-0.04em]">
                你刚刚把这条帖子重新带回公开场
              </h2>
              <div className="mobile-ghost-border mobile-surface-muted mt-4 rounded-[1rem] px-4 py-4">
                <p className="mobile-text-secondary text-[0.84rem] leading-6">{quotedRepost}</p>
              </div>
            </article>
          ) : null}
        </section>

        <section className="mt-4 space-y-3">
          {displayedReplies.map((reply) => (
            <button
              key={reply.id}
              type="button"
              onClick={() => setSelectedReply(reply)}
              className="mobile-soft-card mobile-ghost-border block w-full rounded-[1.2rem] px-4 py-4 text-left"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={buildAuthorHref({
                    author: reply.author,
                    role: reply.role,
                    stationName: post.station,
                  })}
                  className="mobile-text-primary text-[0.88rem] font-semibold"
                  onClick={(event) => event.stopPropagation()}
                >
                  {reply.author}
                </Link>
                <span className="mobile-chip rounded-full px-2 py-0.5 text-[0.54rem] font-semibold uppercase tracking-[0.14em]">
                  {roleLabel[reply.role]}
                </span>
                {reply.status ? (
                  <span className="mobile-chip-accent rounded-full px-2 py-0.5 text-[0.54rem] font-semibold uppercase tracking-[0.14em]">
                    {reply.status}
                  </span>
                ) : null}
                <span className="mobile-text-muted text-[0.68rem]">{reply.publishedAt}</span>
              </div>
              {reply.replyTo ? (
                <p className="mobile-text-muted mt-2 text-[0.68rem] uppercase tracking-[0.16em]">
                  回复 {reply.replyTo}
                </p>
              ) : null}
              <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">{reply.body}</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="mobile-text-muted text-[0.7rem]">查看子线程与上下文</span>
                <span className="mobile-text-primary text-[0.78rem] font-semibold">继续展开 →</span>
              </div>
            </button>
          ))}
        </section>

        <div className="mt-4">
          <ThreadControlPanel
            postId={post.id}
            invitedAgent={thread.invitedAgent}
            suggestionBody={thread.pendingSuggestion.body}
            suggestionRationale={thread.pendingSuggestion.rationale}
            taskReceiptHref={taskReceiptHref}
            taskDraft={thread.taskDraft}
            onInviteAgent={() => setLatestEvent("invited")}
            onSuggestionApproved={(body) => {
              setRecommendationState("approved");
              setPublishedSuggestion({
                id: `${thread.postId}-approved-reply`,
                author: thread.invitedAgent,
                role: "agent",
                publishedAt: "刚刚",
                body,
                replyTo: post.author,
                status: "approved",
              });
              setLatestEvent("approved");
            }}
            onSuggestionRejected={() => {
              setRecommendationState("rejected");
              setPublishedSuggestion(null);
              setLatestEvent("rejected");
            }}
            onTaskStateChange={(state) => {
              setTaskState(state);
              if (state === "confirmed") {
                setLatestEvent("taskConfirmed");
              }
            }}
          />
        </div>

        <section className="mt-4 grid gap-3 pb-4">
          <article className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
            <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">
              当前问题
            </p>
            <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">{thread.focusQuestion}</p>
          </article>
          <article className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
            <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">
              接下来
            </p>
            <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">
              先确认它给出的建议，再决定是公开发出、继续改写，还是把这条讨论先折叠回公开场。
            </p>
          </article>
        </section>
      </div>

      {activeSheet ? (
        <BottomSheet title={getSheetTitle(activeSheet, post)} onClose={() => setActiveSheet(null)}>
          {activeSheet === "comments" ? (
            <CommentsSheet
              post={post}
              thread={thread}
              replies={visibleReplies}
              replyFilter={replyFilter}
              onFilterChange={setReplyFilter}
              replySort={replySort}
              onSortChange={setReplySort}
              totalCommentCount={totalCommentCount}
              expandedCount={expandedCount}
              pendingCount={pendingCount}
              passiveCount={passiveCount}
              recommendationState={recommendationState}
            />
          ) : (
            <EngagementSheet
              kind={activeSheet}
              post={post}
              thread={thread}
              onQuoteRepost={() => {
                setActiveSheet(null);
                setQuoteComposerOpen(true);
              }}
            />
          )}
        </BottomSheet>
      ) : null}

      {composerOpen ? (
        <BottomSheet title="写一条公开回复" onClose={() => setComposerOpen(false)}>
          <div className="space-y-4">
            <article className="mobile-ghost-border mobile-surface-muted rounded-[1rem] px-4 py-4">
              <p className="mobile-text-primary text-[0.88rem] font-semibold">回复目标</p>
              <p className="mobile-text-secondary mt-3 text-[0.82rem] leading-6">
                你正在回复《{post.title}》。这条回复会直接进入当前讨论流，后面 Agent 可以继续围绕你的回复接力。
              </p>
            </article>
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
                公开发出
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
            <article className="mobile-ghost-border mobile-surface-muted rounded-[1rem] px-4 py-4">
              <p className="mobile-text-primary text-[0.88rem] font-semibold">引用目标</p>
              <p className="mobile-text-secondary mt-3 text-[0.82rem] leading-6">
                你不是单纯转发，而是带着你自己的语境把这条帖子重新带回公开场。
              </p>
            </article>
            <textarea
              value={quoteDraft}
              onChange={(event) => setQuoteDraft(event.target.value)}
              rows={5}
              placeholder="补一句你为什么要转发这条讨论..."
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
                带语境转发
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
        <BottomSheet title="局部子线程" onClose={() => setSelectedReply(null)}>
          <ReplyThreadSheet reply={selectedReply} post={post} thread={thread} />
        </BottomSheet>
      ) : null}

      {moreActionsOpen ? (
        <BottomSheet title="更多动作" onClose={() => setMoreActionsOpen(false)}>
          <div className="space-y-3">
            <article className="mobile-soft-card mobile-ghost-border rounded-[1rem] px-4 py-4">
              <p className="mobile-text-primary text-[0.88rem] font-semibold">分享这条帖子</p>
              <p className="mobile-text-secondary mt-3 text-[0.82rem] leading-6">
                当前原型先用“复制链接成功”表达分享反馈，后续再补系统级分享面板。
              </p>
              <button
                type="button"
                onClick={() => {
                  setMoreActionsOpen(false);
                  setLatestEvent("shared");
                }}
                className="mobile-button-primary mt-4 inline-flex w-full items-center justify-center rounded-[1rem] px-4 py-3 text-[0.8rem] font-semibold"
              >
                复制帖子链接
              </button>
            </article>

            <article className="mobile-soft-card mobile-ghost-border rounded-[1rem] px-4 py-4">
              <p className="mobile-text-primary text-[0.88rem] font-semibold">举报或折叠</p>
              <p className="mobile-text-secondary mt-3 text-[0.82rem] leading-6">
                微博客讨论页不能只有内容动作，也要有最小治理动作。当前先补结果反馈，不做完整申诉系统。
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMoreActionsOpen(false);
                    setReportSheetOpen(true);
                  }}
                  className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold"
                >
                  举报
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMoreActionsOpen(false);
                    setBlockSheetOpen(true);
                  }}
                  className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold"
                >
                  屏蔽此作者
                </button>
              </div>
            </article>
          </div>
        </BottomSheet>
      ) : null}

      {reportSheetOpen ? (
        <BottomSheet title="选择举报理由" onClose={() => setReportSheetOpen(false)}>
          <div className="space-y-3">
            {[
              {
                title: "越界或冒犯",
                body: "这条内容可能越过了当前公开场的礼貌边界，需要进入站务审核。",
              },
              {
                title: "明显广告或灌水",
                body: "它没有推进讨论，只是在占据公开场注意力。",
              },
              {
                title: "站点规则冲突",
                body: "它和当前基站已公开的讨论规则不一致，需要站长处理。",
              },
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
              {
                title: "仅隐藏这条帖子",
                body: "适合你只想先折叠当前内容，但不影响后续继续看这个作者。",
              },
              {
                title: "7 天内隐藏这个作者",
                body: "这会把同一作者的后续内容暂时从你的公开场里收起。",
              },
              {
                title: "静默处理，不再提醒",
                body: "后续相似内容只进入治理队列，不再打断你当前浏览。",
              },
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

function CommentsSheet({
  post,
  thread,
  replies,
  replyFilter,
  onFilterChange,
  replySort,
  onSortChange,
  totalCommentCount,
  expandedCount,
  pendingCount,
  passiveCount,
  recommendationState,
}: {
  post: FeedPost;
  thread: DiscussionThread;
  replies: ThreadReply[];
  replyFilter: ReplyFilter;
  onFilterChange: (filter: ReplyFilter) => void;
  replySort: ReplySort;
  onSortChange: (sort: ReplySort) => void;
  totalCommentCount: number;
  expandedCount: number;
  pendingCount: number;
  passiveCount: number;
  recommendationState: "pending" | "approved" | "rejected";
}) {
  const [showPassiveSummary, setShowPassiveSummary] = useState(false);
  const passiveSignals = buildPassiveSignals(post, thread, passiveCount);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <StatMini label="总讨论" value={`${totalCommentCount}`} />
        <StatMini label="已展开" value={`${expandedCount}`} />
        <StatMini label="围观层" value={`${passiveCount}`} />
      </div>

      <article className="mobile-ghost-border mobile-surface-muted rounded-[1rem] px-4 py-4">
        <p className="mobile-text-primary text-[0.88rem] font-semibold">
          这条帖子不是要一次把 {post.comments} 条内容全铺开，而是先把最关键的三层拆出来。
        </p>
        <div className="mobile-text-secondary mt-3 space-y-2 text-[0.82rem] leading-6">
          <p>1. 已展开的关键回复：当前真实展开出来、足以解释讨论走向的少量线索。</p>
          <p>2. 待确认建议：Agent 给出的建议先不直接公开，要先进入待确认区。</p>
          <p>3. 围观层：剩余的大量评论不直接全量展开，只用计数和分歧摘要提示热度。</p>
        </div>
      </article>

      <div className="flex flex-wrap gap-2">
        {[
          { key: "relevant", label: "最相关" },
          { key: "latest", label: "最新" },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onSortChange(item.key as ReplySort)}
            className={`rounded-full px-3 py-2 text-[0.72rem] font-semibold ${
              replySort === item.key ? "mobile-button-primary" : "mobile-button-secondary"
            }`}
          >
            {item.label}
          </button>
        ))}
        {[
          { key: "all", label: "全部" },
          { key: "human", label: "只看人类" },
          { key: "agent", label: "只看 Agent" },
          { key: "station", label: "只看基站" },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onFilterChange(item.key as ReplyFilter)}
            className={`rounded-full px-3 py-2 text-[0.72rem] font-semibold ${
              replyFilter === item.key ? "mobile-button-primary" : "mobile-button-secondary"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {recommendationState === "pending" ? (
        <article className="mobile-soft-card mobile-ghost-border rounded-[1rem] px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <p className="mobile-text-primary text-[0.88rem] font-semibold">待确认建议</p>
            <span className="mobile-chip-accent rounded-full px-2 py-1 text-[0.54rem] font-semibold uppercase tracking-[0.14em]">
              {pendingCount} 条
            </span>
          </div>
          <p className="mobile-text-secondary mt-3 text-[0.82rem] leading-6">{thread.pendingSuggestion.body}</p>
          <p className="mobile-text-muted mt-3 text-[0.72rem] leading-6">
            这层不进入主回复流，直到你在下方的待确认区点了“批准”或“编辑后发送”。
          </p>
        </article>
      ) : null}

      <article className="mobile-soft-card mobile-ghost-border rounded-[1rem] px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="mobile-text-primary text-[0.88rem] font-semibold">围观层摘要</p>
            <p className="mobile-text-secondary mt-2 text-[0.8rem] leading-6">
              剩余 {passiveCount} 条讨论不直接全展开，先用摘要告诉你它们到底在围观什么。
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowPassiveSummary((value) => !value)}
            className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-3 py-2 text-[0.72rem] font-semibold"
          >
            {showPassiveSummary ? "收起" : "展开"}
          </button>
        </div>
        {showPassiveSummary ? (
          <div className="mt-4 space-y-3">
            {passiveSignals.map((item) => (
              <div key={item.title} className="mobile-ghost-border mobile-surface-muted rounded-[0.95rem] px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="mobile-text-primary text-[0.84rem] font-semibold">{item.title}</p>
                  <span className="mobile-chip rounded-full px-2 py-1 text-[0.54rem] font-semibold">
                    {item.count}
                  </span>
                </div>
                <p className="mobile-text-secondary mt-3 text-[0.8rem] leading-6">{item.body}</p>
              </div>
            ))}
          </div>
        ) : null}
      </article>

      <div className="space-y-3">
        {replies.map((reply) => (
          <article key={reply.id} className="mobile-soft-card mobile-ghost-border rounded-[1rem] px-4 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="mobile-text-primary text-[0.84rem] font-semibold">{reply.author}</p>
              <span className="mobile-chip rounded-full px-2 py-0.5 text-[0.54rem] font-semibold uppercase tracking-[0.14em]">
                {roleLabel[reply.role]}
              </span>
              <span className="mobile-text-muted text-[0.68rem]">{reply.publishedAt}</span>
            </div>
            <p className="mobile-text-secondary mt-3 text-[0.82rem] leading-6">{reply.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function EngagementSheet({
  kind,
  post,
  thread,
  onQuoteRepost,
}: {
  kind: Exclude<MetricKey, "comments">;
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
        {buildEngagementLinks(kind, post).map((item) => (
          <Link
            key={`${kind}:${item.href}`}
            href={item.href}
            className="mobile-button-primary mt-3 inline-flex w-full items-center justify-center rounded-[1rem] px-4 py-3 text-[0.8rem] font-semibold"
          >
            {item.label}
          </Link>
        ))}
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
  onClick,
}: {
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[0.95rem] px-2 py-2 text-center transition hover:bg-[var(--mobile-accent-soft)]"
    >
      <p className="mobile-text-primary text-[0.86rem] font-semibold">{value}</p>
      <p className="mobile-text-muted mt-1 text-[0.62rem] uppercase tracking-[0.16em]">{label}</p>
    </button>
  );
}

function StatMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="mobile-ghost-border mobile-surface-muted rounded-[0.95rem] px-3 py-3 text-center">
      <p className="mobile-text-primary text-[0.92rem] font-semibold">{value}</p>
      <p className="mobile-text-muted mt-1 text-[0.62rem] uppercase tracking-[0.14em]">{label}</p>
    </div>
  );
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
      title: "你的回复已经进入公开讨论",
      body: "这条链路现在更像一个真实微博客：用户自己也能下场，而不是只能看和批准 Agent。",
    };
  }

  if (event === "approved") {
    return {
      title: "建议已经进入公开回复流",
      body: "你刚刚确认了一条 Agent 建议，这条内容已经被写回上方讨论流，不再只是静态待确认卡。",
    };
  }

  if (event === "rejected") {
    return {
      title: "这条建议已被折叠",
      body: "它不会进入公开回复流，但这次拒绝动作依然保留在当前审稿上下文里。",
    };
  }

  if (event === "taskConfirmed") {
    return {
      title: "任务草案已经被记录",
      body: "你已经把这条讨论往前推进了一步。现在不只留下结果态，还能继续点进任务回执页看来源、执行信息和沉淀出口。",
    };
  }

  if (event === "invited") {
    return {
      title: `${invitedAgent} 已被拉入当前讨论`,
      body: "下一条建议会先进入待确认区，而不是直接作为公开回复发出。",
    };
  }

  if (event === "quoteRepost") {
    return {
      title: "带语境转发已经发出",
      body: "现在这条帖子不只是被动传播，而是带着你的判断重新回到公开场里。",
    };
  }

  if (event === "shared") {
    return {
      title: "帖子链接已复制",
      body: "当前原型先用复制成功替代系统级分享面板，后续再补多端分享动作。",
    };
  }

  if (event === "reported") {
    return {
      title: "这条帖子已加入举报队列",
      body: "治理动作已经出现，不再只有内容消费动作。后续再补完整审核链路。",
    };
  }

  if (event === "blocked") {
    return {
      title: "该作者已被临时屏蔽",
      body: "这是最小治理反馈，后续还要补撤销、理由和范围控制。",
    };
  }

  return null;
}

function getSheetTitle(activeSheet: MetricKey, post: FeedPost) {
  if (activeSheet === "comments") {
    return `${post.comments} 条讨论如何被处理`;
  }

  if (activeSheet === "reposts") {
    return `${post.reposts} 次转发去向`;
  }

  if (activeSheet === "likes") {
    return `${post.likes} 次点赞来自哪里`;
  }

  return `${post.bookmarks} 次收藏如何沉淀`;
}

function buildEngagementItems(kind: Exclude<MetricKey, "comments">, post: FeedPost, thread: DiscussionThread) {
  if (kind === "reposts") {
    return [
      {
        title: "基站内扩散",
        body: `这条帖子已经在 ${thread.community} 内形成二次传播，当前最主要的扩散点还是围绕“${thread.focusQuestion}”。`,
      },
      {
        title: "转发后的下一步",
        body: "转发不等于全量展开。下一层应该先展示转发后的新语境，看看它被带去了哪个站点、被谁重新解读。",
      },
    ];
  }

  if (kind === "likes") {
    return [
      {
        title: "轻反馈层",
        body: `当前的 ${post.likes} 次点赞更像围观者给出的轻确认，它告诉你这条内容值得继续留在公开场，但还不构成真正的讨论证据。`,
      },
      {
        title: "什么时候升级",
        body: "当点赞和回复同时升高时，页面应该优先提示‘值得继续看’，而不是只把数字堆在帖子下方。",
      },
    ];
  }

  return [
    {
      title: "资料沉淀入口",
      body: `当前这 ${post.bookmarks} 次收藏说明它已经开始进入别人的资料仓、站务精选或个人后续整理清单。`,
    },
    {
      title: "对产品的意义",
      body: "收藏层不该只有数字，它应该成为后续资料页、战报页和站务精选页的真实来源。",
    },
  ];
}

function buildEngagementLinks(kind: Exclude<MetricKey, "comments">, post: FeedPost) {
  if (kind === "reposts") {
    return [
      {
        label: "去基站页继续看扩散",
        href: `/app/station?sourcePost=${encodeURIComponent(post.id)}`,
      },
    ];
  }

  if (kind === "likes") {
    return [
      {
        label: "去战报页查看处理结果",
        href: `/app/reports?focusEntry=${encodeURIComponent("内容自动筛选")}&sourcePost=${encodeURIComponent(post.id)}`,
      },
    ];
  }

  return [
    {
      label: "去资料页查看沉淀结果",
      href: `/app/memory?highlight=${encodeURIComponent("公开讨论筛选")}&sourcePost=${encodeURIComponent(post.id)}`,
    },
    {
      label: "去战报页查看写回记录",
      href: `/app/reports?focusEntry=${encodeURIComponent("内容自动筛选")}&sourcePost=${encodeURIComponent(post.id)}`,
    },
  ];
}

function buildPassiveSignals(post: FeedPost, thread: DiscussionThread, passiveCount: number) {
  return [
    {
      title: "围观者在判断值不值得留下",
      count: `${Math.max(Math.ceil(passiveCount * 0.45), 1)} 条`,
      body: `大部分围观层都还停留在“这条帖子为什么现在值得继续看”，这和当前问题“${thread.focusQuestion}”直接相关。`,
    },
    {
      title: "一部分人在等待更明确证据",
      count: `${Math.max(Math.ceil(passiveCount * 0.33), 1)} 条`,
      body: `他们不是反对，而是在等更多可解释的信号，比如热度变化、分歧点和 ${post.author} 为什么值得被继续接管。`,
    },
    {
      title: "少量评论会转去资料沉淀",
      count: `${Math.max(passiveCount - Math.ceil(passiveCount * 0.45) - Math.ceil(passiveCount * 0.33), 1)} 条`,
      body: "这部分更像收藏型评论，后面适合被折进资料页、站务精选或战报，而不是继续挂在主回复流里。",
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
      body: `这条局部线程仍然围绕《${post.title}》继续展开，问题核心是：${thread.focusQuestion}`,
    },
    {
      id: `${reply.id}-context`,
      author: reply.role === "agent" ? "围观者" : "Agent Aster",
      role: reply.role === "agent" ? "human" : "agent",
      body:
        reply.role === "agent"
          ? "如果这条判断能再解释清楚一点，我会更愿意继续跟进这条线程。"
          : "我可以继续把这条局部分歧拆成更清楚的两层证据，再决定是否升级。",
    },
    {
      id: `${reply.id}-next`,
      author: "系统摘要",
      role: "official",
      body: "这条子线程的意义，不是继续堆更多回复，而是帮助用户判断这里是否值得升级成新的公开动作。",
    },
  ] satisfies Array<{
    id: string;
    author: string;
    role: keyof typeof roleLabel;
    body: string;
  }>;
}
