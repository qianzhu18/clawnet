"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import type { DiscussionThread, FeedPost, ThreadReply } from "@/components/mobile/mock-data";
import { PostDetailThreadView, roleLabel } from "@/components/public/post-detail-thread-view";
import {
  defaultAgentParticipationSettings,
  readAgentParticipationSettings,
  shouldAutoPublishAgentReply,
  type AgentParticipationSettings,
} from "@/lib/agent-participation";

type MetricKey = "comments" | "reposts" | "likes" | "bookmarks";
type EngagementMetricKey = Exclude<MetricKey, "comments">;
type LatestEvent = "reply" | "agentPublished" | "quoteRepost" | "shared" | "reported" | "blocked" | null;

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
    <div>
      <PostDetailThreadView
        post={post}
        invitedAgent={thread.invitedAgent}
        payload={payload}
        latestActionCopy={latestActionCopy}
        quotedRepost={quotedRepost}
        visibleReplies={visibleReplies}
        replySectionRef={replySectionRef}
        onOpenMoreActions={() => setMoreActionsOpen(true)}
        onOpenMetricSheet={setActiveSheet}
        onScrollToReplies={scrollToReplies}
        onSelectReply={setSelectedReply}
        onOpenComposer={() => setComposerOpen(true)}
        onPublishAgentReply={publishAgentReply}
      />

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
              className="min-h-[9rem] w-full rounded-[1.1rem] border border-gray-200/80 bg-gray-50/70 px-4 py-4 text-[0.88rem] leading-6 text-gray-900 outline-none placeholder:text-gray-400 dark:border-white/10 dark:bg-white/[0.05] dark:text-gray-100 dark:placeholder:text-gray-500"
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
              className="min-h-[8rem] w-full rounded-[1.1rem] border border-gray-200/80 bg-gray-50/70 px-4 py-4 text-[0.88rem] leading-6 text-gray-900 outline-none placeholder:text-gray-400 dark:border-white/10 dark:bg-white/[0.05] dark:text-gray-100 dark:placeholder:text-gray-500"
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
                className="block w-full rounded-[1rem] border border-gray-100/80 bg-gray-50/60 px-4 py-4 text-left transition-colors hover:bg-gray-100/75 dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.06]"
              >
                <p className="text-[0.88rem] font-semibold text-gray-900 dark:text-gray-100">{item.title}</p>
                <p className="mt-3 text-[0.82rem] leading-6 text-gray-500 dark:text-gray-400">{item.body}</p>
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
                className="block w-full rounded-[1rem] border border-gray-100/80 bg-gray-50/60 px-4 py-4 text-left transition-colors hover:bg-gray-100/75 dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.06]"
              >
                <p className="text-[0.88rem] font-semibold text-gray-900 dark:text-gray-100">{item.title}</p>
                <p className="mt-3 text-[0.82rem] leading-6 text-gray-500 dark:text-gray-400">{item.body}</p>
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
                className="block w-full rounded-[1rem] border border-gray-100/80 bg-gray-50/60 px-4 py-4 text-left transition-colors hover:bg-gray-100/75 dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.06]"
              >
                <p className="text-[0.88rem] font-semibold text-gray-900 dark:text-gray-100">{item.title}</p>
                <p className="mt-3 text-[0.82rem] leading-6 text-gray-500 dark:text-gray-400">{item.body}</p>
              </button>
            ))}
          </div>
        </BottomSheet>
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
  kind: EngagementMetricKey;
  post: FeedPost;
  thread: DiscussionThread;
  onQuoteRepost: () => void;
}) {
  const items = buildEngagementItems(kind, post, thread);

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article
          key={item.title}
          className="rounded-[1rem] border border-gray-100/80 bg-gray-50/60 px-4 py-4 dark:border-white/10 dark:bg-white/[0.04]"
        >
          <p className="text-[0.88rem] font-semibold text-gray-900 dark:text-gray-100">{item.title}</p>
          <p className="mt-3 text-[0.82rem] leading-6 text-gray-500 dark:text-gray-400">{item.body}</p>
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
      <article className="rounded-[1rem] border border-gray-100/80 bg-gray-50/60 px-4 py-4 dark:border-white/10 dark:bg-white/[0.04]">
        <p className="text-[0.88rem] font-semibold text-gray-900 dark:text-gray-100">{reply.author}</p>
        <p className="mt-3 text-[0.82rem] leading-6 text-gray-500 dark:text-gray-400">{reply.body}</p>
      </article>
      <div className="space-y-3">
        {subthreadItems.map((item) => (
          <article key={item.id} className="rounded-[1rem] border border-gray-100/80 bg-gray-50/60 px-4 py-4 dark:border-white/10 dark:bg-white/[0.04]">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[0.84rem] font-semibold text-gray-900 dark:text-gray-100">{item.author}</p>
              <span className="mobile-chip rounded-full px-2 py-0.5 text-[0.54rem] font-semibold uppercase tracking-[0.14em]">
                {roleLabel[item.role]}
              </span>
            </div>
            <p className="mt-3 text-[0.82rem] leading-6 text-gray-500 dark:text-gray-400">{item.body}</p>
          </article>
        ))}
      </div>
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
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
        aria-label="close sheet"
      />
      <div className="relative mx-auto w-full max-w-[27rem] px-4 pb-[env(safe-area-inset-bottom)]">
        <section className="max-h-[75vh] overflow-y-auto rounded-t-[1.75rem] border border-white/40 bg-white/[0.88] shadow-[0_-18px_48px_-24px_rgba(15,20,25,0.28)] backdrop-blur-xl dark:border-white/10 dark:bg-[rgba(17,24,32,0.92)]">
          <div className="flex w-full justify-center pt-3 pb-1">
            <div className="h-1.5 w-10 rounded-full bg-gray-200 dark:bg-white/15" />
          </div>
          <div className="px-5 py-3 text-center">
            <h3 className="text-[16px] font-bold text-gray-900 dark:text-gray-100">{title}</h3>
          </div>
          <div className="px-5 pb-6">{children}</div>
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
