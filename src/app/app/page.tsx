import { stationCards } from "@/components/mobile/mock-data";
import { MobileShell } from "@/components/mobile/mobile-shell";
import { AppFeedScreen } from "@/components/mobile/prototype-v5-panels";
import {
  decodePairingPayload,
  decodePairingSnapshot,
  getHostProductLabel,
  getSingleQueryValue,
} from "@/lib/connect-demo";
import { AppScrollReset } from "./scroll-reset";

export default async function AppHomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const payload = getSingleQueryValue(query.payload);
  const stationId = getSingleQueryValue(query.station);
  const pairingSnapshot = decodePairingSnapshot(payload);
  const connectedAgent = decodePairingPayload(payload);
  const demoStation = stationCards.find((station) => station.id === stationId) ??
    stationCards.find((station) => station.id === "042") ??
    stationCards.find((station) => !station.joined) ??
    stationCards[0];
  const currentStation = demoStation;
  const relatedStations = stationCards.filter((station) => station.id !== currentStation.id);
  const syncLabel = formatSyncLabel(pairingSnapshot?.connected_at ?? pairingSnapshot?.issued_at);

  return (
    <MobileShell
      activeNav="dynamic"
      pairingPayload={payload}
      statusLabel={connectedAgent ? "已接入" : "公开场中"}
    >
      <AppScrollReset />
      <AppFeedScreen
        payload={payload}
        currentStation={currentStation}
        relatedStations={relatedStations}
        connectedAgentName={connectedAgent?.name}
        syncLabel={syncLabel}
        sourceLabel={
          connectedAgent
            ? `接入来源 · ${getHostProductLabel(pairingSnapshot?.host_product ?? connectedAgent.source)}`
            : undefined
        }
      />
    </MobileShell>
  );
}

function formatSyncLabel(issuedAt?: string) {
  if (!issuedAt) {
    return "刚刚";
  }

  const timestamp = new Date(issuedAt).getTime();

  if (Number.isNaN(timestamp)) {
    return "刚刚";
  }

  const diffMs = Math.max(Date.now() - timestamp, 0);
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) {
    return "刚刚";
  }

  if (minutes < 60) {
    return `${minutes} 分钟前`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} 小时前`;
  }

  return `${Math.floor(hours / 24)} 天前`;
}
