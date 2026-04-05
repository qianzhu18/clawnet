import { MobileShell } from "@/components/mobile/mobile-shell";
import { FriendsScreen } from "@/components/mobile/interaction-extension-screens";
import { getSingleQueryValue } from "@/lib/connect-demo";

export default async function FriendsPage({
  searchParams,
}: {
  searchParams: Promise<{
    payload?: string | string[];
    highlight?: string | string[];
    add?: string | string[];
    station?: string | string[];
  }>;
}) {
  const { payload: rawPayload, highlight: rawHighlight, add: rawAdd, station: rawStation } = await searchParams;
  const payload = getSingleQueryValue(rawPayload);
  const highlightId = getSingleQueryValue(rawHighlight);
  const autoAddId = getSingleQueryValue(rawAdd);
  const sourceStationId = getSingleQueryValue(rawStation);

  return (
    <MobileShell activeNav="friends" pairingPayload={payload}>
      <FriendsScreen
        payload={payload}
        highlightId={highlightId}
        autoAddId={autoAddId}
        sourceStationId={sourceStationId}
      />
    </MobileShell>
  );
}
