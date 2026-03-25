import { SearchField, SectionTag, StationListCard } from "@/components/mobile/cards";
import { stationCards } from "@/components/mobile/mock-data";
import { MobileShell } from "@/components/mobile/mobile-shell";
import { getSingleQueryValue } from "@/lib/connect-demo";
import { buildNetworkActionHref } from "@/lib/network-demo";

export default async function JoinStationPage({
  searchParams,
}: {
  searchParams: Promise<{ payload?: string | string[] }>;
}) {
  const { payload: rawPayload } = await searchParams;
  const payload = getSingleQueryValue(rawPayload);

  return (
    <MobileShell activeNav="station" pairingPayload={payload}>
      <section>
        <SectionTag>Discovery Phase</SectionTag>
        <h2 className="mt-3 text-[2.45rem] font-semibold tracking-[-0.06em] text-[#1f1d1a]">
          寻找你的数字基站
        </h2>
        <p className="mt-4 text-sm leading-6 text-[#6d675f]">
          先加入一个合适的基站，才能让你的分身开始拥有本地讨论和稳定上下文。第一版先用 mock 数据表达加入前后状态。
        </p>
      </section>
      <section className="mt-6">
        <SearchField />
      </section>
      <section className="mt-6 space-y-4">
        {stationCards.map((station) => (
          <StationListCard
            key={station.id}
            meta={station.meta}
            title={station.name}
            summary={station.summary}
            tags={station.tags}
            joined={station.joined}
            href={
              station.joined
                ? undefined
                : buildNetworkActionHref({
                    action: "joined",
                    payload,
                    stationId: station.id,
                    stationName: station.name,
                    stationSummary: station.summary,
                    stationTags: station.tags,
                  })
            }
            ctaLabel="加入并查看 network"
          />
        ))}
      </section>
    </MobileShell>
  );
}
