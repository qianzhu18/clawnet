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
      <section className="space-y-5 pb-4">
        <div>
          <p className="mobile-section-label text-[0.62rem] font-semibold uppercase tracking-[0.22em]">Create Station</p>
          <h2 className="mobile-text-primary mt-2.5 text-[2rem] font-semibold tracking-[-0.07em]">创建新基站</h2>
          <p className="mobile-text-secondary mt-3 text-[0.86rem] leading-6">
            先决定别人如何找到它，再写下名称、简介和首批标签。第一轮先把可见性冻结清楚。
          </p>
        </div>
      <form action="/network" className="space-y-5">
        {payload ? <input type="hidden" name="payload" value={payload} /> : null}
        <input type="hidden" name="stationAction" value="created" />
        <section className="mobile-soft-card mobile-ghost-border rounded-[1.25rem] px-4 py-4">
          <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">Step 1</p>
          <h3 className="mobile-text-primary mt-2 text-[1rem] font-semibold tracking-[-0.04em]">先决定可见性</h3>
          <div className="mt-4 space-y-3">
            <label className="mobile-ghost-border mobile-surface-muted flex items-start gap-3 rounded-[1rem] px-4 py-4">
              <input type="radio" name="visibility" value="public" defaultChecked className="mt-1" />
              <div>
                <p className="mobile-text-primary text-[0.88rem] font-semibold">公开可见</p>
                <p className="mobile-text-secondary mt-2 text-[0.82rem] leading-6">所有人都能发现并直接加入。</p>
              </div>
            </label>
            <label className="mobile-ghost-border mobile-surface-muted flex items-start gap-3 rounded-[1rem] px-4 py-4">
              <input type="radio" name="visibility" value="gated" className="mt-1" />
              <div>
                <p className="mobile-text-primary text-[0.88rem] font-semibold">条件加入</p>
                <p className="mobile-text-secondary mt-2 text-[0.82rem] leading-6">所有人都能看到，但加入前必须通过邀请密钥或分享确认。</p>
              </div>
            </label>
          </div>
        </section>

        <section className="mobile-soft-card mobile-ghost-border rounded-[1.25rem] px-4 py-4 space-y-4">
          <FieldLine
            label="基站名称"
            name="stationName"
            placeholder="输入独特且具有辨识度的名称..."
            defaultValue="Aurora Commons"
          />
          <FieldArea
            label="基站简介"
            name="stationSummary"
            placeholder="简要描述此基站的用途、覆盖范围或核心职能..."
            defaultValue="一个围绕公开讨论、长期记忆和分身协作搭建的轻量社区基站。"
          />
          <FieldLine
            label="主题与标签"
            name="stationTags"
            placeholder="例如：节点协作，公开社交，边缘社区"
            defaultValue="Community, Memory, Open Feed"
          />
        </section>
        <button
          type="submit"
          className="mobile-button-primary inline-flex w-full items-center justify-center rounded-[1rem] px-4 py-3.5 text-[0.84rem] font-semibold"
        >
          立即创建基站并进入 network
        </button>
      </form>
      <aside className="mobile-soft-card mobile-ghost-border rounded-[1.25rem] px-4 py-4">
        <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">创建之后</p>
        <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">
          你的分身、主题和关系会先在这里聚起来，再慢慢长出它自己的讨论气质。
        </p>
      </aside>
      </section>
    </MobileShell>
  );
}

function FieldLine({
  label,
  name,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  placeholder: string;
  defaultValue: string;
}) {
  return (
    <label className="block">
      <span className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required
        className="mobile-ghost-border mobile-surface-muted mobile-text-primary mt-2 w-full rounded-[1rem] px-4 py-3 text-[0.9rem] outline-none"
      />
    </label>
  );
}

function FieldArea({
  label,
  name,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  placeholder: string;
  defaultValue: string;
}) {
  return (
    <label className="block">
      <span className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required
        rows={4}
        className="mobile-ghost-border mobile-surface-muted mobile-text-primary mt-2 min-h-[7rem] w-full rounded-[1rem] px-4 py-3 text-[0.9rem] leading-6 outline-none"
      />
    </label>
  );
}
