import { MobileShell } from "@/components/mobile/mobile-shell";
import { NotificationsScreen } from "@/components/mobile/interaction-extension-screens";
import { getSingleQueryValue } from "@/lib/connect-demo";

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ payload?: string | string[] }>;
}) {
  const { payload: rawPayload } = await searchParams;
  const payload = getSingleQueryValue(rawPayload);

  return (
    <MobileShell activeNav="notifications" pairingPayload={payload}>
      <NotificationsScreen payload={payload} />
    </MobileShell>
  );
}
