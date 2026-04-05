"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

import type { DiscussionThread, FeedPost, ThreadReply } from "@/components/mobile/mock-data";
import { AvatarSeal, MockVisualCard } from "@/components/mobile/cards";
import {
  defaultAgentParticipationSettings,
  getAgentScopeLabel,
  getAgentTriggerLabel,
  readAgentParticipationSettings,
  shouldAutoPreviewAgentReply,
  type AgentParticipationSettings,
} from "@/lib/agent-participation";
import { appendPayload } from "@/lib/connect-demo";
import { buildAuthorHref, buildStationHrefByName } from "@/lib/public-links";

type MetricKey = "comments" | "reposts" | "likes" | "bookmarks";
type ReplyFilter = "all" | "human" | "agent" | "station";
type ReplySort = "relevant" | "latest";
type LatestEvent = "reply" | "approved" | "rejected" | "invited" | "quoteRepost" | "shared" | "reported" | "blocked" | null;
type PreviewMode = "hidden" | "preview" | "editing";

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
  const [publishedSuggestion, setPublishedSuggestion] = useState<ThreadReply | null>(null);
  const [manualReplies, setManualReplies] = useState<ThreadReply[]>([]);
  const [recommendationState, setRecommendationState] = useState<"pending" | "approved" | "rejected">("pending");
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
  const [participationSettings] = useState<AgentParticipationSettings>(
    typeof window === "undefined" ? defaultAgentParticipationSettings : readAgentParticipationSettings(),
  );
  const [manualPreviewRequested, setManualPreviewRequested] = useState(false);
  const [previewModeOverride, setPreviewModeOverride] = useState<PreviewMode | null>(null);
  const [suggestionDraft, setSuggestionDraft] = useState(thread.pendingSuggestion.body);

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
  const autoPreviewEnabled =
    recommendationState === "pending" &&
    (manualPreviewRequested || shouldAutoPreviewAgentReply(participationSettings, post));
  const previewMode = previewModeOverride ?? (autoPreviewEnabled ? "preview" : "hidden");
  const previewVisible = autoPreviewEnabled && previewMode !== "hidden";
  const pendingCount = previewVisible ? 1 : 0;
  const passiveCount = Math.max(totalCommentCount - displayedReplies.length - pendingCount, 0);
  const latestActionCopy = getLatestActionCopy(latestEvent, thread.invitedAgent);

  function openAgentPreview() {
    setManualPreviewRequested(true);
    setPreviewModeOverride("preview");
    setLatestEvent("invited");
  }

  function approveSuggestion() {
    const nextBody = suggestionDraft.trim();

    if (!nextBody) {
      return;
    }

    setPublishedSuggestion({
      id: `${thread.postId}-approved-reply`,
      author: thread.invitedAgent,
      role: "agent",
      publishedAt: "刚刚",
      body: nextBody,
      replyTo: post.author,
      status: "approved",
    });
    setRecommendationState("approved");
    setPreviewModeOverride("hidden");
    setLatestEvent("approved");
  }

  function rejectSuggestion() {
    setRecommendationState("rejected");
    setManualPreviewRequested(false);
    setPreviewModeOverride("hidden");
    setLatestEvent("rejected");
  }

  return (
    <div className="mobile-app-root min-h-screen">
      <div className="mx-auto max-w-[27rem] px-4 pb-[calc(env(safe-area-inset-bottom)+7.5rem)] pt-4 mobile-text-primary">
        <header className="grid grid-cols-[2.75rem_1fr_2.75rem] items-center gap-3 pb-4">
          <Link
            href={appendPayload(buildStationHrefByName(post.station), payload)}
            className="mobile-button-secondary inline-flex size-11 items-center justify-center rounded-full text-sm font-semibold"
          >
            ←
          </Link>
          <div className="text-center">
            <p className="mobile-text-primary text-[1.16rem] font-semibold tracking-[-0.05em]">详情</p>
            <p className="mobile-text-muted mt-1 text-[0.68rem]">{post.station}</p>
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
          <article className="mobile-soft-card mobile-ghost-border mb-4 rounded-[1.2rem] px-4 py-4">
            <p className="mobile-text-primary text-[0.88rem] font-semibold">
              {quotedRepost ? "已带语境转发" : latestActionCopy?.title}
            </p>
            <p className="mobile-text-secondary mt-2 text-[0.82rem] leading-6">
              {quotedRepost ?? latestActionCopy?.body}
            </p>
          </article>
        ) : null}

        <article className="mobile-soft-card mobile-ghost-border rounded-[1.45rem] px-4 py-4">
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
                    className="mobile-text-primary block truncate text-[1rem] font-semibold"
                  >
                    {post.author}
                  </Link>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="mobile-chip rounded-full px-2 py-0.5 text-[0.54rem] font-semibold uppercase tracking-[0.14em]">
                      {roleLabel[post.role]}
                    </span>
                    {post.badge ? (
                      <span className="mobile-chip rounded-full px-2 py-0.5 text-[0.54rem] font-semibold uppercase tracking-[0.14em]">
                        {post.badge}
                      </span>
                    ) : null}
                    <span className="mobile-text-muted text-[0.68rem]">{post.publishedAt}</span>
                  </div>
                  <p className="mobile-text-muted mt-2 text-[0.72rem]">
                    {post.handle} ·{" "}
                    <Link href={appendPayload(buildStationHrefByName(post.station), payload)} className="underline decoration-transparent">
                      {post.station}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <h1 className="mobile-text-primary text-[1.36rem] font-semibold leading-[1.15] tracking-[-0.06em]">
              {post.title}
            </h1>
            <p className="mobile-text-secondary text-[0.92rem] leading-7">{post.body}</p>
          </div>

          {post.media ? (
            <div className="mt-4">
              <MockVisualCard tone={post.media.tone} caption={post.media.caption} aspect={post.media.aspect ?? "landscape"} />
            </div>
          ) : null}

          {post.previewReply ? (
            <div className="mobile-ghost-border mobile-surface-muted mt-4 rounded-[1rem] px-4 py-4">
              <div className="flex items-start gap-3">
                <AvatarSeal label={post.previewReply.author.slice(0, 2)} role={post.previewReply.role} small />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="mobile-text-primary text-[0.84rem] font-semibold">{post.previewReply.author}</p>
                    <span className="mobile-chip rounded-full px-2 py-0.5 text-[0.54rem] font-semibold uppercase tracking-[0.14em]">
                      {roleLabel[post.previewReply.role]}
                    </span>
                  </div>
                  <p className="mobile-text-secondary mt-2 text-[0.82rem] leading-6">{post.previewReply.body}</p>
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

          <div className="mt-5 grid grid-cols-4 gap-2 border-t border-[var(--mobile-border)] pt-4">
            <MetricButton label="评论" value={post.comments} onClick={() => setActiveSheet("comments")} />
            <MetricButton label="转发" value={post.reposts} onClick={() => setActiveSheet("reposts")} />
            <MetricButton label="点赞" value={post.likes} onClick={() => setActiveSheet("likes")} />
            <MetricButton label="收藏" value={post.bookmarks} onClick={() => setActiveSheet("bookmarks")} />
          </div>
        </article>

        <section className="mt-4 mobile-soft-card mobile-ghost-border rounded-[1.25rem] px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">评论流</p>
              <h2 className="mobile-text-primary mt-2 text-[1rem] font-semibold tracking-[-0.04em]">
                {post.comments} 条评论
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveSheet("comments")}
              className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-4 py-2 text-[0.72rem] font-semibold"
            >
              全部评论
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { key: "all", label: "全部" },
              { key: "human", label: "只看真人" },
              { key: "agent", label: "只看 AI" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setReplyFilter(item.key as ReplyFilter)}
                className={`rounded-full px-3 py-2 text-[0.72rem] font-semibold ${
                  replyFilter === item.key ? "mobile-button-primary" : "mobile-button-secondary"
                }`}
              >
                {item.label}
              </button>
            ))}
            {[
              { key: "relevant", label: "推荐" },
              { key: "latest", label: "最新" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setReplySort(item.key as ReplySort)}
                className={`rounded-full px-3 py-2 text-[0.72rem] font-semibold ${
                  replySort === item.key ? "mobile-button-primary" : "mobile-button-secondary"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={openAgentPreview}
              className="mobile-button-primary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-[0.74rem] font-semibold uppercase tracking-[0.14em]"
            >
              @{thread.invitedAgent}
            </button>
            <Link
              href={appendPayload("/app/avatar", payload)}
              className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-[0.74rem] font-semibold"
            >
              参与设置
            </Link>
            <Link
              href={appendPayload(`/connect?post=${post.id}`, payload)}
              className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-[0.74rem] font-semibold"
            >
              接入 Agent
            </Link>
          </div>
          <p className="mobile-text-secondary mt-4 text-[0.82rem] leading-6">
            当前配置：{getAgentTriggerLabel(participationSettings.triggerMode)} · {getAgentScopeLabel(participationSettings)}
          </p>
        </section>

        <section className="mt-4 space-y-3">
          {previewVisible && visibleReplies.length === 0 ? (
            <AgentPreviewCard
              invitedAgent={thread.invitedAgent}
              suggestionDraft={suggestionDraft}
              rationale={thread.pendingSuggestion.rationale}
              previewMode={previewMode}
              onDraftChange={setSuggestionDraft}
              onApprove={approveSuggestion}
              onEdit={() => setPreviewModeOverride("editing")}
              onBackToPreview={() => {
                setSuggestionDraft(thread.pendingSuggestion.body);
                setPreviewModeOverride("preview");
              }}
              onHide={rejectSuggestion}
            />
          ) : null}

          {visibleReplies.map((reply, index) => (
            <div key={reply.id} className="space-y-3">
              <ReplyCard
                reply={reply}
                post={post}
                payload={payload}
                onSelect={() => setSelectedReply(reply)}
              />
              {previewVisible && index === 0 ? (
                <AgentPreviewCard
                  invitedAgent={thread.invitedAgent}
                  suggestionDraft={suggestionDraft}
                  rationale={thread.pendingSuggestion.rationale}
                  previewMode={previewMode}
                  onDraftChange={setSuggestionDraft}
                  onApprove={approveSuggestion}
                  onEdit={() => setPreviewModeOverride("editing")}
                  onBackToPreview={() => {
                    setSuggestionDraft(thread.pendingSuggestion.body);
                    setPreviewModeOverride("preview");
                  }}
                  onHide={rejectSuggestion}
                />
              ) : null}
            </div>
          ))}

          {passiveCount > 0 ? (
            <article className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="mobile-text-primary text-[0.92rem] font-semibold">还有 {passiveCount} 条评论未展开</p>
                  <p className="mobile-text-secondary mt-2 text-[0.82rem] leading-6">点进全部评论可以继续看完整线程和筛选结果。</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSheet("comments")}
                  className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-4 py-2 text-[0.72rem] font-semibold"
                >
                  展开
                </button>
              </div>
            </article>
          ) : null}
        </section>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom)+0.9rem)]">
        <div className="pointer-events-auto mx-auto max-w-[27rem]">
          <div className="mobile-app-shell mobile-shell-panel rounded-[1.35rem] px-3 py-3 shadow-[0_18px_42px_rgba(20,24,33,0.14)]">
            <button
              type="button"
              onClick={() => setComposerOpen(true)}
              className="mobile-ghost-border mobile-surface-muted mobile-text-muted flex w-full items-center rounded-[1rem] px-4 py-3 text-left text-[0.88rem]"
            >
              留下一句你的观察吧
            </button>
            <div className="mt-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={openAgentPreview}
                className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.12em]"
              >
                @{thread.invitedAgent}
              </button>
              <div className="flex items-center gap-4 text-[0.8rem]">
                <button
                  type="button"
                  onClick={() => setActiveSheet("likes")}
                  className="mobile-text-secondary inline-flex items-center gap-1 font-semibold"
                >
                  ♡ {post.likes}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSheet("comments")}
                  className="mobile-text-secondary inline-flex items-center gap-1 font-semibold"
                >
                  💬 {post.comments}
                </button>
              </div>
            </div>
          </div>
        </div>
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
              expandedCount={displayedReplies.length}
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
  return (
    <article className="mobile-soft-card mobile-ghost-border rounded-[1.25rem] px-4 py-4">
      <div className="flex items-start gap-3">
        <AvatarSeal label={reply.author.slice(0, 2)} role={reply.role} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                href={appendPayload(
                  buildAuthorHref({
                    author: reply.author,
                    role: reply.role,
                    stationName: post.station,
                  }),
                  payload,
                )}
                className="mobile-text-primary block truncate text-[0.92rem] font-semibold"
              >
                {reply.author}
              </Link>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="mobile-chip rounded-full px-2 py-0.5 text-[0.54rem] font-semibold uppercase tracking-[0.14em]">
                  {roleLabel[reply.role]}
                </span>
                {reply.status ? (
                  <span className="mobile-chip-accent rounded-full px-2 py-0.5 text-[0.54rem] font-semibold uppercase tracking-[0.14em]">
                    {reply.status === "approved" ? "已公开" : reply.status === "pending" ? "待确认" : "已发布"}
                  </span>
                ) : null}
              </div>
            </div>
            <button
              type="button"
              onClick={onSelect}
              className="mobile-text-muted inline-flex items-center justify-center rounded-full px-2 py-1 text-[0.78rem] font-semibold"
            >
              ♡
            </button>
          </div>
          {reply.replyTo ? (
            <p className="mobile-text-muted mt-2 text-[0.68rem] uppercase tracking-[0.16em]">回复 {reply.replyTo}</p>
          ) : null}
          <p className="mobile-text-secondary mt-3 text-[0.88rem] leading-7">{reply.body}</p>
          <div className="mt-4 flex items-center gap-4 text-[0.74rem]">
            <span className="mobile-text-muted">{reply.publishedAt}</span>
            <button type="button" onClick={onSelect} className="mobile-text-secondary font-semibold">
              回复
            </button>
            <button type="button" onClick={onSelect} className="mobile-text-secondary font-semibold">
              展开子线程
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function AgentPreviewCard({
  invitedAgent,
  suggestionDraft,
  rationale,
  previewMode,
  onDraftChange,
  onApprove,
  onEdit,
  onBackToPreview,
  onHide,
}: {
  invitedAgent: string;
  suggestionDraft: string;
  rationale: string;
  previewMode: PreviewMode;
  onDraftChange: (value: string) => void;
  onApprove: () => void;
  onEdit: () => void;
  onBackToPreview: () => void;
  onHide: () => void;
}) {
  return (
    <article className="mobile-soft-card mobile-ghost-border rounded-[1.25rem] px-4 py-4">
      <div className="flex items-start gap-3">
        <AvatarSeal label={invitedAgent.slice(0, 2)} role="agent" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="mobile-text-primary text-[0.92rem] font-semibold">{invitedAgent}</p>
            <span className="mobile-chip rounded-full px-2 py-0.5 text-[0.54rem] font-semibold uppercase tracking-[0.14em]">
              AI
            </span>
            <span className="mobile-chip-accent rounded-full px-2 py-0.5 text-[0.54rem] font-semibold uppercase tracking-[0.14em]">
              待你确认
            </span>
          </div>
          <p className="mobile-text-secondary mt-2 text-[0.8rem] leading-6">{rationale}</p>
        </div>
      </div>

      {previewMode === "editing" ? (
        <textarea
          value={suggestionDraft}
          onChange={(event) => onDraftChange(event.target.value)}
          rows={5}
          className="mobile-ghost-border mobile-surface-strong mobile-text-primary mt-4 w-full resize-none rounded-[1rem] px-4 py-4 text-[0.84rem] leading-6 outline-none"
        />
      ) : (
        <div className="mobile-ghost-border mobile-surface-muted mt-4 rounded-[1rem] px-4 py-4">
          <p className="mobile-text-secondary text-[0.84rem] leading-7">{suggestionDraft}</p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {previewMode === "editing" ? (
          <>
            <button
              type="button"
              onClick={onApprove}
              className="mobile-button-primary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-[0.74rem] font-semibold"
            >
              公开
            </button>
            <button
              type="button"
              onClick={onBackToPreview}
              className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-[0.74rem] font-semibold"
            >
              取消
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onApprove}
              className="mobile-button-primary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-[0.74rem] font-semibold"
            >
              同意公开
            </button>
            <button
              type="button"
              onClick={onEdit}
              className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-[0.74rem] font-semibold"
            >
              改一下
            </button>
            <button
              type="button"
              onClick={onHide}
              className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-[0.74rem] font-semibold"
            >
              隐藏
            </button>
          </>
        )}
      </div>
    </article>
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
        <StatMini label="总评论" value={`${totalCommentCount}`} />
        <StatMini label="已展开" value={`${expandedCount}`} />
        <StatMini label="待确认" value={`${pendingCount}`} />
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { key: "relevant", label: "推荐" },
          { key: "latest", label: "最新" },
          { key: "all", label: "全部" },
          { key: "human", label: "真人" },
          { key: "agent", label: "AI" },
          { key: "station", label: "基站" },
        ].map((item) => {
          const isActive =
            item.key === "relevant" || item.key === "latest"
              ? replySort === item.key
              : replyFilter === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                if (item.key === "relevant" || item.key === "latest") {
                  onSortChange(item.key as ReplySort);
                } else {
                  onFilterChange(item.key as ReplyFilter);
                }
              }}
              className={`rounded-full px-3 py-2 text-[0.72rem] font-semibold ${
                isActive ? "mobile-button-primary" : "mobile-button-secondary"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {recommendationState === "pending" ? (
        <article className="mobile-soft-card mobile-ghost-border rounded-[1rem] px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <p className="mobile-text-primary text-[0.88rem] font-semibold">AI 预览仍在等待确认</p>
            <span className="mobile-chip-accent rounded-full px-2 py-1 text-[0.54rem] font-semibold uppercase tracking-[0.14em]">
              {pendingCount} 条
            </span>
          </div>
          <p className="mobile-text-secondary mt-3 text-[0.82rem] leading-6">{thread.pendingSuggestion.body}</p>
        </article>
      ) : null}

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

      {passiveCount > 0 ? (
        <article className="mobile-soft-card mobile-ghost-border rounded-[1rem] px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="mobile-text-primary text-[0.88rem] font-semibold">其余评论已折叠</p>
              <p className="mobile-text-secondary mt-2 text-[0.8rem] leading-6">还有 {passiveCount} 条评论留在折叠区。</p>
            </div>
            <button
              type="button"
              onClick={() => setShowPassiveSummary((value) => !value)}
              className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-3 py-2 text-[0.72rem] font-semibold"
            >
              {showPassiveSummary ? "收起" : "查看"}
            </button>
          </div>
          {showPassiveSummary ? (
            <div className="mt-4 space-y-3">
              {passiveSignals.map((item) => (
                <div key={item.title} className="mobile-ghost-border mobile-surface-muted rounded-[0.95rem] px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="mobile-text-primary text-[0.84rem] font-semibold">{item.title}</p>
                    <span className="mobile-chip rounded-full px-2 py-1 text-[0.54rem] font-semibold">{item.count}</span>
                  </div>
                  <p className="mobile-text-secondary mt-3 text-[0.8rem] leading-6">{item.body}</p>
                </div>
              ))}
            </div>
          ) : null}
        </article>
      ) : null}
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
      title: "评论已发出",
      body: "你的这句回应已经进入公开评论流。",
    };
  }

  if (event === "approved") {
    return {
      title: "AI 回复已公开",
      body: "这条 AI 回应已经带着标记出现在评论里。",
    };
  }

  if (event === "rejected") {
    return {
      title: "AI 预览已隐藏",
      body: "它不会出现在公开评论里。",
    };
  }

  if (event === "invited") {
    return {
      title: `${invitedAgent} 已加入讨论`,
      body: "新的 AI 回复会先以预览状态出现。",
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

function buildPassiveSignals(post: FeedPost, thread: DiscussionThread, passiveCount: number) {
  return [
    {
      title: "更多人在补自己的立场",
      count: `${Math.max(Math.ceil(passiveCount * 0.45), 1)} 条`,
      body: `他们大多还在围绕“${thread.focusQuestion}”补充自己的角度。`,
    },
    {
      title: "有人在继续追问细节",
      count: `${Math.max(Math.ceil(passiveCount * 0.33), 1)} 条`,
      body: `这部分评论更关心 ${post.author} 的原帖到底还能往哪里展开。`,
    },
    {
      title: "少量评论偏向收藏留档",
      count: `${Math.max(passiveCount - Math.ceil(passiveCount * 0.45) - Math.ceil(passiveCount * 0.33), 1)} 条`,
      body: "它们更像补充资料，而不是继续把主线程往前推。",
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
