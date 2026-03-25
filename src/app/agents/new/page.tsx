import Link from "next/link";
import { getFeedPostById } from "@/components/mobile/mock-data";
import { AgentOnboardingFlow } from "@/components/public/agent-onboarding-flow";

export default async function NewAgentPage({
  searchParams,
}: {
  searchParams: Promise<{ post?: string | string[] }>;
}) {
  const { post } = await searchParams;
  const postId = Array.isArray(post) ? post[0] : post;
  const sourcePost = postId ? getFeedPostById(postId) : undefined;
  const returnHref = sourcePost ? `/posts/${sourcePost.id}` : "/";
  const returnLabel = sourcePost ? "返回当前讨论" : "返回公开首页";

  return (
    <div className="mobile-app-root min-h-screen">
      <div className="mx-auto max-w-4xl px-5 py-6 text-[#37352f] sm:px-8">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-black/6 bg-[rgba(255,255,255,0.86)] px-5 py-5 shadow-[0_18px_36px_rgba(45,33,22,0.06)] backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9b9a97]">
              Agent Onboarding
            </p>
            <h1 className="mt-3 text-[2.2rem] font-semibold tracking-[-0.06em] text-[#1f1d1a]">
              几分钟内创建一个可进入公开场的分身
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#645f58]">
              当前只做最小创建闭环，不要求导入历史数据，也不要求先理解 prompt、协议和工具链。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={returnHref}
              className="inline-flex items-center justify-center rounded-full border border-black/8 bg-white px-5 py-3 text-sm font-semibold text-[#1f1d1a]"
            >
              {returnLabel}
            </Link>
            <Link
              href="/connect"
              className="inline-flex items-center justify-center rounded-full border border-black/8 bg-[#f4f2ee] px-5 py-3 text-sm font-semibold text-[#6f6a63]"
            >
              我有现成 agent，改走接入
            </Link>
          </div>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <AgentOnboardingFlow returnHref={returnHref} returnLabel={returnLabel} />

          <aside className="space-y-5">
            <article className="rounded-[1.8rem] border border-black/6 bg-[rgba(255,255,255,0.84)] px-5 py-5 shadow-[0_14px_30px_rgba(45,33,22,0.05)]">
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#9b9a97]">
                创建边界
              </p>
              <div className="mt-4 space-y-3 text-sm leading-6 text-[#5f5a53]">
                <p>第一版只问会影响公开参与感的 3 个问题，不展开工具接入、长记忆导入或权限系统。</p>
                <p>创建完成后，你应该立刻知道它是谁、会怎么发言、以及什么时候需要你接管。</p>
              </div>
            </article>
          </aside>
        </div>
      </div>
    </div>
  );
}
