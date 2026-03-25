import { SectionTag } from "@/components/mobile/cards";
import { avatarPanels, avatarSummary } from "@/components/mobile/mock-data";
import { MobileShell } from "@/components/mobile/mobile-shell";
import {
  decodePairingPayload,
  getAgentInitials,
  getSingleQueryValue,
} from "@/lib/connect-demo";

export default async function AvatarPage({
  searchParams,
}: {
  searchParams: Promise<{ payload?: string | string[] }>;
}) {
  const { payload: rawPayload } = await searchParams;
  const payload = getSingleQueryValue(rawPayload);
  const connectedAgent = decodePairingPayload(payload);
  const name = connectedAgent?.name ?? avatarSummary.name;
  const status = connectedAgent ? "已接入，等待你的下一次接管" : avatarSummary.status;
  const bio = connectedAgent?.bio ?? avatarSummary.bio;
  const sourceLabel = connectedAgent ? `接入来源 · ${connectedAgent.source}` : `当前基站 · ${avatarSummary.station}`;

  return (
    <MobileShell
      activeNav="avatar"
      pairingPayload={payload}
      statusLabel={connectedAgent ? "identity synced" : "demo identity"}
    >
      <section className="rounded-[1.8rem] border border-black/6 bg-[rgba(255,255,255,0.84)] px-5 py-6 shadow-[0_16px_36px_rgba(45,33,22,0.06)]">
        <SectionTag>Connected Proxy</SectionTag>
        <div className="mt-4 flex items-start gap-4">
          <div className="inline-flex size-16 items-center justify-center rounded-[1.6rem] bg-[#1f1d1a] text-xl font-semibold text-white">
            {getAgentInitials(name)}
          </div>
          <div>
            <h2 className="text-[1.55rem] font-semibold tracking-[-0.05em] text-[#1f1d1a]">{name}</h2>
            <p className="mt-1 text-sm text-[#7a756d]">{status}</p>
            <p className="mt-3 text-sm leading-6 text-[#615d56]">{bio}</p>
            <div className="mt-4 inline-flex rounded-full border border-black/6 bg-[#f4f2ee] px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#6f6a63]">
              {sourceLabel}
            </div>
          </div>
        </div>
      </section>
      {connectedAgent ? (
        <section className="mt-6 rounded-[1.5rem] border border-black/6 bg-[rgba(255,255,255,0.82)] px-5 py-5 shadow-[0_12px_28px_rgba(45,33,22,0.04)]">
          <SectionTag>Capability Snapshot</SectionTag>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {connectedAgent.capabilities.map((capability) => (
              <span
                key={capability}
                className="rounded-full border border-black/6 bg-white/80 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-[#6f695f]"
              >
                {capability}
              </span>
            ))}
          </div>
        </section>
      ) : null}
      <section className="mt-6 space-y-4">
        {avatarPanels.map((panel) => (
          <article
            key={panel.title}
            className="rounded-[1.5rem] border border-black/6 bg-[rgba(255,255,255,0.82)] px-5 py-5 shadow-[0_12px_28px_rgba(45,33,22,0.04)]"
          >
            <SectionTag>{panel.title}</SectionTag>
            <p className="mt-4 text-sm leading-6 text-[#615d56]">{panel.body}</p>
          </article>
        ))}
      </section>
    </MobileShell>
  );
}
