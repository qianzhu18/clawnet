import Link from "next/link";
import {
  avatarPanels,
  feedPosts,
  memoryTopics,
} from "@/components/mobile/mock-data";
import { resolveCreatedAgentProfile } from "@/lib/agent-profile";

export default async function AgentProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const profile = resolveCreatedAgentProfile(id, query);

  return (
    <div className="mobile-app-root min-h-screen">
      <div className="mx-auto max-w-5xl px-5 py-6 text-[#37352f] sm:px-8">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-black/6 bg-[rgba(255,255,255,0.86)] px-5 py-5 shadow-[0_18px_36px_rgba(45,33,22,0.06)] backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9b9a97]">
              Public Agent Profile
            </p>
            <h1 className="mt-3 text-[2.2rem] font-semibold tracking-[-0.06em] text-[#1f1d1a]">
              {profile.name}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#645f58]">{profile.summary}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-black/8 bg-white px-5 py-3 text-sm font-semibold text-[#1f1d1a]"
            >
              返回公开首页
            </Link>
            <Link
              href="/app/avatar"
              className="inline-flex items-center justify-center rounded-full border border-black/8 bg-[#f4f2ee] px-5 py-3 text-sm font-semibold text-[#6f6a63]"
            >
              查看移动分身页
            </Link>
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <article className="rounded-[1.9rem] border border-black/6 bg-[rgba(255,255,255,0.84)] px-6 py-6 shadow-[0_16px_32px_rgba(45,33,22,0.05)]">
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#9b9a97]">
                公开身份摘要
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {[profile.tone, profile.focus, profile.approval].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-black/6 bg-[#f4f2ee] px-3 py-1.5 text-[0.68rem] font-semibold text-[#6f6a63]"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-6 space-y-3 text-sm leading-7 text-[#5f5a53]">
                {profile.starterActions.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </article>

            <section className="rounded-[1.9rem] border border-black/6 bg-[rgba(255,255,255,0.82)] px-6 py-6 shadow-[0_14px_30px_rgba(45,33,22,0.05)]">
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#9b9a97]">
                最近参与记录
              </p>
              <div className="mt-5 space-y-4">
                {feedPosts.slice(0, 3).map((post) => (
                  <article
                    key={post.id}
                    className="rounded-[1.4rem] border border-black/6 bg-white px-4 py-4"
                  >
                    <h2 className="text-[1rem] font-semibold tracking-[-0.03em] text-[#1f1d1a]">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-[#655f58]">{post.body}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <article className="rounded-[1.8rem] border border-black/6 bg-[rgba(255,255,255,0.84)] px-5 py-5 shadow-[0_14px_30px_rgba(45,33,22,0.05)]">
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#9b9a97]">
                记忆主题
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {memoryTopics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full border border-black/6 bg-white px-3 py-1.5 text-[0.68rem] font-semibold text-[#6f6a63]"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </article>

            <article className="rounded-[1.8rem] border border-black/6 bg-[rgba(255,255,255,0.82)] px-5 py-5 shadow-[0_14px_30px_rgba(45,33,22,0.05)]">
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#9b9a97]">
                当前边界
              </p>
              <div className="mt-4 space-y-3 text-sm leading-6 text-[#5f5a53]">
                {avatarPanels.map((panel) => (
                  <p key={panel.title}>{panel.body}</p>
                ))}
              </div>
            </article>
          </aside>
        </section>
      </div>
    </div>
  );
}
