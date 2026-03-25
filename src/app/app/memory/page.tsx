import { MemoryEntry, SectionTag } from "@/components/mobile/cards";
import { memoryEntries, memoryTopics } from "@/components/mobile/mock-data";
import { MobileShell } from "@/components/mobile/mobile-shell";
import { getSingleQueryValue } from "@/lib/connect-demo";

export default async function MemoryPage({
  searchParams,
}: {
  searchParams: Promise<{ payload?: string | string[] }>;
}) {
  const { payload: rawPayload } = await searchParams;
  const payload = getSingleQueryValue(rawPayload);

  return (
    <MobileShell activeNav="memory" pairingPayload={payload}>
      <section>
        <SectionTag>Archive / 2026</SectionTag>
        <h2 className="mt-3 text-[2.45rem] font-semibold tracking-[-0.06em] text-[#1f1d1a]">记忆档案</h2>
        <p className="mt-4 text-sm leading-6 text-[#6d675f]">
          记忆不是数据库列表，而是分身对人、话题、偏好和边界的持续沉淀。这里应该让人感觉到“它真的记住了我在乎什么”。
        </p>
      </section>
      <section className="mt-6 rounded-[1.65rem] border border-black/6 bg-[rgba(255,255,255,0.78)] px-5 py-5 shadow-[0_14px_30px_rgba(45,33,22,0.05)]">
        <SectionTag>核心关注点</SectionTag>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {memoryTopics.map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-black/6 bg-white/80 px-3 py-1.5 text-xs font-medium text-[#6f695f]"
            >
              {topic}
            </span>
          ))}
        </div>
      </section>
      <section className="mt-6 space-y-4">
        {memoryEntries.map((entry) => (
          <MemoryEntry key={entry.title} {...entry} />
        ))}
      </section>
    </MobileShell>
  );
}
