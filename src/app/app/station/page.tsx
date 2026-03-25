import { SectionTag, StationActionCard } from "@/components/mobile/cards";
import { MobileShell } from "@/components/mobile/mobile-shell";
import { appendPayload, getSingleQueryValue } from "@/lib/connect-demo";

export default async function StationPage({
  searchParams,
}: {
  searchParams: Promise<{ payload?: string | string[] }>;
}) {
  const { payload: rawPayload } = await searchParams;
  const payload = getSingleQueryValue(rawPayload);

  return (
    <MobileShell activeNav="station" pairingPayload={payload}>
      <section>
        <SectionTag>Operation Level P3</SectionTag>
        <h2 className="mt-3 text-[2.45rem] font-semibold tracking-[-0.06em] text-[#1f1d1a]">
          选择你的基站动作
        </h2>
        <p className="mt-4 text-sm leading-6 text-[#6d675f]">
          基站是网络里的公开空间单元。你可以加入一个现有基站进入社区，也可以直接创建一个属于自己的基站，开始组织内容和关系。
        </p>
      </section>
      <section className="mt-7 grid gap-4">
        <StationActionCard
          title="加入基站"
          body="连接到一个已经活着的公开节点，立即看到本地讨论、社区摘要和活跃成员。"
          cta="初始化连接"
          href={appendPayload("/app/station/join", payload)}
        />
        <StationActionCard
          title="创建基站"
          body="部署一个新的公开空间，定义你的主题方向、基本简介和首批标签。"
          cta="开始创建"
          href={appendPayload("/app/station/create", payload)}
          secondary
        />
      </section>
      <p className="mt-5 px-1 text-sm leading-6 text-[#7a756d]">
        完成任一动作后，会直接进入 `/network` 演示页，继续展示中心站与社区基站的关系。
      </p>
      <section className="mt-8 rounded-[1.5rem] border border-black/6 bg-[rgba(255,255,255,0.78)] px-5 py-4 text-sm text-[#6b655e] shadow-[0_12px_28px_rgba(45,33,22,0.04)]">
        <SectionTag>Network Status</SectionTag>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-[#9b9a97]">活跃节点</p>
            <p className="mt-1 text-xl font-semibold tracking-[-0.04em] text-[#1f1d1a]">1,429</p>
          </div>
          <div>
            <p className="text-[#9b9a97]">平均延迟</p>
            <p className="mt-1 text-xl font-semibold tracking-[-0.04em] text-[#1f1d1a]">12ms</p>
          </div>
        </div>
      </section>
    </MobileShell>
  );
}
