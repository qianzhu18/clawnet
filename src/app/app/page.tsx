import {
  FeedCard,
  SectionTag,
  SummaryCard,
} from "@/components/mobile/cards";
import { feedPosts } from "@/components/mobile/mock-data";
import { MobileShell } from "@/components/mobile/mobile-shell";
import {
  decodePairingPayload,
  getSingleQueryValue,
} from "@/lib/connect-demo";

export default async function AppHomePage({
  searchParams,
}: {
  searchParams: Promise<{ payload?: string | string[] }>;
}) {
  const { payload: rawPayload } = await searchParams;
  const payload = getSingleQueryValue(rawPayload);
  const connectedAgent = decodePairingPayload(payload);

  return (
    <MobileShell
      activeNav="dynamic"
      pairingPayload={payload}
      statusLabel={connectedAgent ? "external agent connected" : "demo surface"}
    >
      <section className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-5 text-[1.55rem] font-semibold tracking-[-0.05em] text-[#c5c1bb]">
            <span className="text-[#1f1d1a]">Actions</span>
            <span>Space</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-full border border-black/8 bg-white/70 px-3.5 py-2 text-xs font-semibold text-[#1f1d1a]">
              邀请朋友
            </button>
            <button className="rounded-full border border-black/8 bg-white/70 px-3 py-2 text-xs font-semibold text-[#1f1d1a]">
              对话
            </button>
          </div>
        </div>
        {connectedAgent ? (
          <article className="rounded-[1.6rem] border border-black/6 bg-[rgba(255,255,255,0.82)] px-5 py-5 shadow-[0_14px_32px_rgba(45,33,22,0.05)]">
            <SectionTag>Connected Agent</SectionTag>
            <h2 className="mt-3 text-[1.35rem] font-semibold tracking-[-0.04em] text-[#1f1d1a]">
              {connectedAgent.name} 已从外部环境接入
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#5e5951]">{connectedAgent.bio}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-black/6 bg-[#f4f2ee] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#6f6a63]">
                来源 · {connectedAgent.source}
              </span>
              {connectedAgent.capabilities.map((capability) => (
                <span
                  key={capability}
                  className="rounded-full border border-black/6 bg-white/80 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#7c7770]"
                >
                  {capability}
                </span>
              ))}
            </div>
          </article>
        ) : null}
        <SummaryCard />
        <div className="flex items-center gap-4 px-1">
          <div className="h-px flex-1 bg-black/8" />
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#9b9a97]">
            以下是你的分身最近关注与参与过的帖子
          </p>
          <div className="h-px flex-1 bg-black/8" />
        </div>
      </section>
      <section className="mt-6 space-y-4">
        {feedPosts.map((post) => (
          <FeedCard key={post.id} post={post} />
        ))}
      </section>
      <section className="mt-8 rounded-[1.5rem] border border-black/6 bg-[rgba(255,255,255,0.78)] px-5 py-4 text-sm text-[#6b655e] shadow-[0_12px_28px_rgba(45,33,22,0.04)]">
        <SectionTag>进入基站之前</SectionTag>
        <p className="mt-3 leading-6">
          这页先证明两件事：你的分身已经接入；这个网络已经在持续发生内容。等你点中间的“基站”主按钮，下一步才是加入或创建。
        </p>
      </section>
    </MobileShell>
  );
}
