import { reportEntries } from "@/components/mobile/mock-data";
import { MobileShell } from "@/components/mobile/mobile-shell";
import { ReportsScreen } from "@/components/mobile/prototype-v5-panels";
import { getSingleQueryValue } from "@/lib/connect-demo";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ payload?: string | string[]; focusEntry?: string | string[]; sourcePost?: string | string[] }>;
}) {
  const { payload: rawPayload, focusEntry: rawFocusEntry, sourcePost: rawSourcePost } = await searchParams;
  const payload = getSingleQueryValue(rawPayload);
  const focusEntry = getSingleQueryValue(rawFocusEntry);
  const sourcePost = getSingleQueryValue(rawSourcePost);

  return (
    <MobileShell activeNav="reports" pairingPayload={payload}>
      <ReportsScreen payload={payload} reportEntries={reportEntries} focusEntry={focusEntry} sourcePost={sourcePost} />
    </MobileShell>
  );
}
