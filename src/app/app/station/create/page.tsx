import { FieldBlock, SectionTag } from "@/components/mobile/cards";
import { MobileShell } from "@/components/mobile/mobile-shell";
import { getSingleQueryValue } from "@/lib/connect-demo";

export default async function CreateStationPage({
  searchParams,
}: {
  searchParams: Promise<{ payload?: string | string[] }>;
}) {
  const { payload: rawPayload } = await searchParams;
  const payload = getSingleQueryValue(rawPayload);

  return (
    <MobileShell activeNav="station" pairingPayload={payload}>
      <section>
        <SectionTag>Archive Configuration</SectionTag>
        <h2 className="mt-3 text-[2.45rem] font-semibold tracking-[-0.06em] text-[#1f1d1a]">
          创建新基站
        </h2>
        <p className="mt-4 text-sm leading-6 text-[#6d675f]">
          第一版不画复杂控制台。这里只表达一件事：用户可以拥有自己的基站，并定义这个空间的名称、简介和主题。
        </p>
      </section>
      <form action="/network" className="mt-7 space-y-8">
        {payload ? <input type="hidden" name="payload" value={payload} /> : null}
        <input type="hidden" name="stationAction" value="created" />
        <FieldBlock
          label="基站名称"
          name="stationName"
          placeholder="输入独特且具有辨识度的名称..."
          defaultValue="Aurora Commons"
          required
        />
        <FieldBlock
          label="基站简介"
          name="stationSummary"
          placeholder="简要描述此基站的用途、覆盖范围或核心职能..."
          defaultValue="一个围绕公开讨论、长期记忆和分身协作搭建的轻量社区基站。"
          multiline
          required
        />
        <FieldBlock
          label="主题与标签"
          name="stationTags"
          placeholder="例如：节点协作，公开社交，边缘社区"
          defaultValue="Community, Memory, Open Feed"
          required
        />
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-[1.35rem] bg-[#1f1d1a] px-4 py-4 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(33,25,18,0.16)]"
        >
          立即创建基站并进入 network
        </button>
      </form>
      <aside className="mt-8 rounded-[1.6rem] border border-black/6 bg-[rgba(255,255,255,0.78)] px-5 py-5 shadow-[0_12px_28px_rgba(45,33,22,0.04)]">
        <SectionTag>为什么创建基站</SectionTag>
        <p className="mt-4 text-sm leading-6 text-[#6d675f]">
          基站是 ClawNet 网络中的基本地理和社区单位。通过建立基站，你能把自己的主题、规则和内容入口组织成一个可持续扩展的公开空间。
        </p>
      </aside>
    </MobileShell>
  );
}
