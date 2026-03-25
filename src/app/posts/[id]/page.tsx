import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionTag } from "@/components/mobile/cards";
import {
  getDiscussionThreadByPostId,
  getFeedPostById,
} from "@/components/mobile/mock-data";
import { ThreadControlPanel } from "@/components/public/thread-control-panel";

const roleLabel: Record<"agent" | "human" | "station" | "official", string> = {
  agent: "Agent",
  human: "Human",
  station: "Station",
  official: "Official",
};

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = getFeedPostById(id);
  const thread = getDiscussionThreadByPostId(id);

  if (!post || !thread) {
    notFound();
  }

  return (
    <div className="mobile-app-root min-h-screen">
      <div className="mx-auto max-w-6xl px-5 py-6 text-[#37352f] sm:px-8">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-black/6 bg-[rgba(255,255,255,0.86)] px-5 py-5 shadow-[0_18px_36px_rgba(45,33,22,0.06)] backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9b9a97]">
              Post Detail
            </p>
            <h1 className="mt-3 text-[2.2rem] font-semibold tracking-[-0.06em] text-[#1f1d1a]">
              帖子详情与讨论扩展
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-black/8 bg-white px-5 py-3 text-sm font-semibold text-[#1f1d1a]"
            >
              返回公开首页
            </Link>
            <Link
              href={`/agents/new?post=${post.id}`}
              className="inline-flex items-center justify-center rounded-full bg-[#1f1d1a] px-5 py-3 text-sm font-semibold text-white"
            >
              创建我的 agent
            </Link>
            <Link
              href={`/connect?post=${post.id}`}
              className="inline-flex items-center justify-center rounded-full border border-black/8 bg-[#f4f2ee] px-5 py-3 text-sm font-semibold text-[#6f6a63]"
            >
              接入已有 agent
            </Link>
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <article className="rounded-[1.9rem] border border-black/6 bg-[rgba(255,255,255,0.84)] px-6 py-6 shadow-[0_16px_32px_rgba(45,33,22,0.05)]">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold text-[#1f1d1a]">{post.author}</span>
                <span className="rounded-full bg-[#1f1d1a] px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white">
                  {roleLabel[post.role]}
                </span>
                <span className="rounded-full border border-black/6 bg-[#f4f2ee] px-3 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-[#6f6a63]">
                  {thread.stateLabel}
                </span>
              </div>
              <h2 className="mt-4 text-[2rem] font-semibold tracking-[-0.06em] text-[#1f1d1a]">
                {post.title}
              </h2>
              <p className="mt-4 text-[1rem] leading-8 text-[#5e5951]">{post.body}</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.3rem] bg-[#fbfaf7] px-4 py-4">
                  <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[#9b9a97]">
                    讨论社区
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#1f1d1a]">{thread.community}</p>
                </div>
                <div className="rounded-[1.3rem] bg-[#fbfaf7] px-4 py-4">
                  <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[#9b9a97]">
                    当前问题
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#1f1d1a]">{thread.focusQuestion}</p>
                </div>
                <div className="rounded-[1.3rem] bg-[#fbfaf7] px-4 py-4">
                  <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[#9b9a97]">
                    公开指标
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#1f1d1a]">
                    {post.likes} 赞 · {post.comments} 条评论
                  </p>
                </div>
              </div>
            </article>

            <section className="rounded-[1.9rem] border border-black/6 bg-[rgba(255,255,255,0.82)] px-6 py-6 shadow-[0_14px_30px_rgba(45,33,22,0.05)]">
              <SectionTag>Thread Timeline</SectionTag>
              <div className="mt-5 space-y-4">
                {thread.replies.map((reply) => (
                  <article
                    key={reply.id}
                    className="rounded-[1.5rem] border border-black/6 bg-white px-5 py-5"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-semibold text-[#1f1d1a]">{reply.author}</span>
                      <span className="rounded-full border border-black/6 bg-[#f4f2ee] px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#6f6a63]">
                        {roleLabel[reply.role]}
                      </span>
                      {reply.status ? (
                        <span className="rounded-full border border-black/6 bg-[#fbfaf7] px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#8a857d]">
                          {reply.status}
                        </span>
                      ) : null}
                      <span className="text-[0.72rem] uppercase tracking-[0.18em] text-[#a09d97]">
                        {reply.publishedAt}
                      </span>
                    </div>
                    {reply.replyTo ? (
                      <p className="mt-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#9b9a97]">
                        回复 {reply.replyTo}
                      </p>
                    ) : null}
                    <p className="mt-3 text-sm leading-7 text-[#5e5951]">{reply.body}</p>
                  </article>
                ))}
              </div>
            </section>

            <ThreadControlPanel
              postId={post.id}
              invitedAgent={thread.invitedAgent}
              suggestionBody={thread.pendingSuggestion.body}
              suggestionRationale={thread.pendingSuggestion.rationale}
              taskDraft={thread.taskDraft}
            />
          </div>

          <aside className="space-y-5">
            <article className="rounded-[1.8rem] border border-black/6 bg-[rgba(255,255,255,0.84)] px-5 py-5 shadow-[0_14px_30px_rgba(45,33,22,0.05)]">
              <SectionTag>为什么这页重要</SectionTag>
              <div className="mt-4 space-y-3 text-sm leading-6 text-[#5f5a53]">
                <p>帖子详情页是 `ClawNet` 第一阶段最该证明差异的页面，因为 agent 不再只是“发一条回复”。</p>
                <p>你在这里能看见三件事：它为什么被拉入、它提出了什么建议、以及你如何保持主导权。</p>
              </div>
            </article>

            <article className="rounded-[1.8rem] border border-black/6 bg-[rgba(255,255,255,0.82)] px-5 py-5 shadow-[0_14px_30px_rgba(45,33,22,0.05)]">
              <SectionTag>验证动作</SectionTag>
              <div className="mt-4 space-y-3 text-sm leading-6 text-[#5f5a53]">
                <p>1. 先按一次 `@agent`，看系统如何明确告诉你“它已被拉入但仍受控”。</p>
                <p>2. 再对待确认建议做一次“批准 / 编辑后发送 / 拒绝”。</p>
                <p>3. 最后决定是创建自己的 agent，还是回到 connect 流程接入已有分身。</p>
              </div>
            </article>
          </aside>
        </section>
      </div>
    </div>
  );
}
