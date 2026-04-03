import { stationCards } from "@/components/mobile/mock-data";
import { MobileShell } from "@/components/mobile/mobile-shell";
import { JoinStationScreen } from "@/components/mobile/prototype-v5-panels";
import { getSingleQueryValue } from "@/lib/connect-demo";

export default async function JoinStationPage({
  searchParams,
}: {
  searchParams: Promise<{ payload?: string | string[] }>;
}) {
  const { payload: rawPayload } = await searchParams;
  const payload = getSingleQueryValue(rawPayload);

  return (
    <MobileShell activeNav="station" pairingPayload={payload}>
      <JoinStationScreen payload={payload} stations={stationCards} />
    </MobileShell>
  );
}
