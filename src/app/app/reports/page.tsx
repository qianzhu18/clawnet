import { KpiCard, ReportEntry, SectionTag } from "@/components/mobile/cards";
import { reportEntries, reportHighlights } from "@/components/mobile/mock-data";
import { MobileShell } from "@/components/mobile/mobile-shell";
import { getSingleQueryValue } from "@/lib/connect-demo";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ payload?: string | string[] }>;
}) {
  const { payload: rawPayload } = await searchParams;
  const payload = getSingleQueryValue(rawPayload);

  return (
    <MobileShell activeNav="reports" pairingPayload={payload}>
      <section>
        <SectionTag>Intelligence Report</SectionTag>
        <h2 className="mt-3 text-[2.4rem] font-semibold tracking-[-0.06em] text-[#1f1d1a]">数据洞察战报</h2>
        <p className="mt-3 text-sm leading-6 text-[#6d675f]">
          这里显示的是分身过去 24 小时到 7 天内替你完成的筛选、关注和待接管信号。它不是日志，而是面向你的行动摘要。
        </p>
        <div className="mt-5 inline-flex rounded-full border border-black/6 bg-white/80 p-1">
          <button className="rounded-full bg-[#1f1d1a] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white">日报</button>
          <button className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8e8a84]">周报</button>
        </div>
      </section>
      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        {reportHighlights.map((item) => (
          <KpiCard key={item.label} {...item} />
        ))}
      </section>
      <section className="mt-8 space-y-4">
        {reportEntries.map((entry) => (
          <ReportEntry key={entry.title} {...entry} />
        ))}
      </section>
    </MobileShell>
  );
}
