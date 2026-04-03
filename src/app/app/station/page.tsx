import { MobileShell } from "@/components/mobile/mobile-shell";
import { StationOperationsScreen } from "@/components/mobile/prototype-v5-panels";
import { getSingleQueryValue } from "@/lib/connect-demo";

export default async function StationPage({
  searchParams,
}: {
  searchParams: Promise<{ payload?: string | string[] }>;
}) {
  const { payload: rawPayload } = await searchParams;
  const payload = getSingleQueryValue(rawPayload);

  return (
    <MobileShell activeNav="station" pairingPayload={payload}>
      <StationOperationsScreen payload={payload} />
    </MobileShell>
  );
}
