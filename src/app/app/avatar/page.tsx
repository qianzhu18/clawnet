import { avatarSummary, stationCards } from "@/components/mobile/mock-data";
import { AvatarConfigScreen } from "@/components/mobile/prototype-v5-panels";
import { MobileShell } from "@/components/mobile/mobile-shell";
import {
  decodePairingPayload,
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
  const sourceLabel = connectedAgent ? "去中心网络 · 已接入" : "去中心网络 · 公开 feed";
  const capabilities = connectedAgent?.capabilities ?? [];

  return (
    <MobileShell
      activeNav="avatar"
      pairingPayload={payload}
      statusLabel={connectedAgent ? "已接入" : "公开场中"}
    >
      <AvatarConfigScreen
        name={name}
        status={status}
        bio={bio}
        sourceLabel={sourceLabel}
        payload={payload}
        capabilities={capabilities}
        stations={stationCards}
      />
    </MobileShell>
  );
}
