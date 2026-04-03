import { ConnectSetupScreen } from "@/components/mobile/prototype-v5-panels";
import {
  buildPairingState,
  readImportedPairing,
  demoAgentCard,
} from "@/lib/connect-demo";
import { getRequestOrigin } from "@/lib/request-origin";

export default async function ConnectPage({
  searchParams,
}: {
  searchParams: Promise<{
    code?: string | string[];
    payload?: string | string[];
    pair_url?: string | string[];
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const requestOrigin = (await getRequestOrigin()) ?? undefined;
  const importedPairing = readImportedPairing(resolvedSearchParams, requestOrigin);
  const currentPairing = importedPairing ?? buildPairingState(demoAgentCard, requestOrigin);
  const pairPageHref = `/pair/${currentPairing.code}?payload=${encodeURIComponent(currentPairing.payload)}`;
  const currentCliOutput = JSON.stringify(
    {
      code: currentPairing.code,
      pair_url: currentPairing.pairUrl,
      connect_url: currentPairing.connectUrl,
      qr_payload: currentPairing.qrPayload,
      host_mode: currentPairing.hostMode,
      host_product: currentPairing.snapshot?.host_product,
      host_session_key: currentPairing.snapshot?.host_session_key,
      bridge_trigger: currentPairing.snapshot?.bridge_trigger,
      connected_at: currentPairing.snapshot?.connected_at,
      scan_ready: currentPairing.scanReady,
      scan_hint: currentPairing.hostHint,
      first_post_seed: currentPairing.snapshot?.first_post_seed,
      host_receipt_url: currentPairing.snapshot?.host_receipt_url,
      agent_preview: currentPairing.agentPreview,
    },
    null,
    2,
  );

  return (
    <div className="mobile-app-root min-h-screen pb-20">
      <ConnectSetupScreen
        currentPairing={currentPairing}
        pairPageHref={pairPageHref}
        currentCliOutput={currentCliOutput}
      />
    </div>
  );
}
