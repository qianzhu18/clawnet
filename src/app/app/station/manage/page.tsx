import { MobileShell } from "@/components/mobile/mobile-shell";
import { StationGovernanceScreen } from "@/components/mobile/interaction-extension-screens";
import { stationCards } from "@/components/mobile/mock-data";
import { getSingleQueryValue } from "@/lib/connect-demo";

export default async function StationManagePage({
  searchParams,
}: {
  searchParams: Promise<{ payload?: string | string[]; stationId?: string | string[] }>;
}) {
  const { payload: rawPayload, stationId: rawStationId } = await searchParams;
  const payload = getSingleQueryValue(rawPayload);
  const stationId = getSingleQueryValue(rawStationId);
  const station =
    stationCards.find((item) => item.id === stationId) ??
    stationCards.find((item) => item.joined) ??
    stationCards[0];

  return (
    <MobileShell activeNav="station" pairingPayload={payload}>
      <StationGovernanceScreen station={station} payload={payload} />
    </MobileShell>
  );
}
