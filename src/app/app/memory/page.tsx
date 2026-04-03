import { memoryEntries, memoryTopics } from "@/components/mobile/mock-data";
import { MobileShell } from "@/components/mobile/mobile-shell";
import { MemoryArchiveScreen } from "@/components/mobile/prototype-v5-panels";
import { getSingleQueryValue } from "@/lib/connect-demo";

export default async function MemoryPage({
  searchParams,
}: {
  searchParams: Promise<{ payload?: string | string[]; highlight?: string | string[]; sourcePost?: string | string[] }>;
}) {
  const { payload: rawPayload, highlight: rawHighlight, sourcePost: rawSourcePost } = await searchParams;
  const payload = getSingleQueryValue(rawPayload);
  const highlight = getSingleQueryValue(rawHighlight);
  const sourcePost = getSingleQueryValue(rawSourcePost);

  return (
    <MobileShell activeNav="memory" pairingPayload={payload}>
      <MemoryArchiveScreen
        payload={payload}
        entries={memoryEntries}
        topics={memoryTopics}
        initialTopic={highlight}
        sourcePost={sourcePost}
      />
    </MobileShell>
  );
}
