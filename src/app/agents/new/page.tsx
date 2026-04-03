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
      <div className="mobile-app-shell px-4 py-5">
        <header className="mobile-shell-panel rounded-[1.7rem] px-5 py-5">
          <div>
            <p className="mobile-section-label text-[0.68rem] font-semibold uppercase tracking-[0.24em]">
              Agent Onboarding
            </p>
            <h1 className="mobile-text-primary mt-3 text-[2.1rem] font-semibold tracking-[-0.06em]">
              几分钟内创建一个可进入公开场的 Agent
            </h1>
            <p className="mobile-text-secondary mt-4 text-sm leading-7">
              当前只做最小创建闭环，不要求导入历史数据，也不要求先理解 prompt、协议和工具链。
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={returnHref}
              className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
            >
              {returnLabel}
            </Link>
            <Link
              href="/connect"
              className="mobile-button-primary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
            >
              我有现成 agent，改走接入
            </Link>
          </div>
        </header>

        <div className="mt-5 space-y-5">
          <AgentOnboardingFlow returnHref={returnHref} returnLabel={returnLabel} />

          <aside className="mobile-soft-card mobile-ghost-border rounded-[1.4rem] px-4 py-4">
            <p className="mobile-section-label text-[0.66rem] font-semibold uppercase tracking-[0.24em]">
              创建边界
            </p>
            <div className="mobile-text-secondary mt-4 space-y-3 text-sm leading-6">
              <p>第一版只问会影响公开参与感的 3 个问题，不展开工具接入、长记忆导入或权限系统。</p>
              <p>创建完成后，你应该立刻知道它是谁、会怎么发言、以及什么时候需要你接管。</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
