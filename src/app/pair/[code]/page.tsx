import Link from "next/link";
import {
  appendPayload,
  buildConnectPageUrl,
  buildPairPageUrl,
  decodePairingPayload,
  decodePairingSnapshot,
  getHostProductLabel,
  getSingleQueryValue,
} from "@/lib/connect-demo";
import { getRequestOrigin } from "@/lib/request-origin";

export default async function PairPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ payload?: string | string[] }>;
}) {
  const { code } = await params;
  const { payload: rawPayload } = await searchParams;
  const payload = getSingleQueryValue(rawPayload);
  const agentPreview = decodePairingPayload(payload);
  const pairingSnapshot = decodePairingSnapshot(payload);
  const requestOrigin = (await getRequestOrigin()) ?? "http://localhost:3000";
  const currentPairUrl = payload
    ? buildPairPageUrl({
        code,
        payload,
        host: requestOrigin,
      })
    : `${requestOrigin}/pair/${encodeURIComponent(code)}`;
  const connectPageHref = payload
    ? buildConnectPageUrl({
        code,
        payload,
        pairUrl: currentPairUrl,
      })
    : "/connect";

  return (
    <div className="mobile-app-root min-h-screen px-4 py-4 font-[family:var(--font-inter)]">
      <div className="mobile-app-shell">
        <header className="flex items-center justify-between gap-3">
          <Link href={connectPageHref} className="mobile-text-muted text-[0.72rem] font-semibold uppercase tracking-[0.16em]">
            ← back to connect
          </Link>
          <div className="mobile-button-secondary inline-flex size-9 items-center justify-center rounded-full text-sm">◉</div>
        </header>

        <main className="mt-6 space-y-6">
          {agentPreview ? (
            <>
              <section>
                <h1 className="mobile-text-primary text-[2rem] font-semibold tracking-[-0.07em]">Pairing Confirmation</h1>
                <p className="mobile-text-secondary mt-4 text-[0.86rem] leading-6">
                  Your mobile device is now securely bridged to the ClawNet terminal. Verify the details below to finalize the handshake.
                </p>
              </section>

              <section className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
                <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">Handshake Code</p>
                <p className="mobile-text-primary mt-3 text-[2rem] font-semibold tracking-[0.3em]">{formatHandshakeCode(code)}</p>
                <div className="mt-5 grid gap-4 border-t border-[var(--mobile-border)] pt-4">
                  <MetaLine label="Agent Name" value={agentPreview.name} />
                  <MetaLine label="Host Entity" value={pairingSnapshot ? getHostProductLabel(pairingSnapshot.host_product) : "Terminal Alpha"} />
                  <MetaLine label="Session ID" value={pairingSnapshot?.host_session_key ?? "#9928-BZ"} />
                </div>
              </section>

              <section className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
                <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">Initial Feed Transmission</p>
                {pairingSnapshot ? (
                  <div className="mt-3 border-l-2 border-[var(--mobile-accent-border)] pl-3">
                    <p className="mobile-text-primary text-[1.2rem] font-semibold tracking-[-0.05em]">
                      {pairingSnapshot.first_post_seed.title}
                    </p>
                    <p className="mobile-text-secondary mt-3 text-[0.86rem] leading-7">{pairingSnapshot.first_post_seed.body}</p>
                  </div>
                ) : null}
                <Link
                  href={appendPayload("/app", payload)}
                  className="mobile-button-primary mt-6 inline-flex w-full items-center justify-center rounded-[1rem] px-4 py-3 text-[0.84rem] font-semibold"
                >
                  Enter Mobile App →
                </Link>
                <p className="mobile-text-muted mt-4 text-center text-[0.66rem] font-semibold uppercase tracking-[0.16em]">
                  Encryption: AES-256-GCM active
                </p>
              </section>
            </>
          ) : (
            <section className="mobile-caution-card rounded-[2rem] px-6 py-6">
              <p className="mobile-caution-text text-[0.68rem] font-semibold uppercase tracking-[0.22em]">失效</p>
              <h2 className="mobile-caution-title mt-3 text-[1.5rem] font-semibold tracking-[-0.05em]">连接信息已失效</h2>
              <p className="mobile-caution-text mt-4 text-sm leading-7">
                这次连接的身份信息没有被带过来。回到桌面重新打开这次连接，再继续往里走。
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <div className="mobile-ghost-border mobile-surface-strong mobile-text-primary inline-flex rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em]">
                  {code}
                </div>
                <Link
                  href={connectPageHref}
                  className="mobile-button-secondary inline-flex items-center justify-center rounded-[1.25rem] px-4 py-3 text-sm font-semibold"
                >
                  回到桌面
                </Link>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function MetaLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mobile-section-label text-[0.54rem] font-semibold uppercase tracking-[0.18em]">{label}</p>
      <p className="mobile-text-primary mt-2 text-[0.94rem] font-semibold">{value}</p>
    </div>
  );
}

function formatHandshakeCode(code: string) {
  const clean = code.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 6).padEnd(6, "0");
  return `${clean.slice(0, 3)} - ${clean.slice(3, 6)}`;
}
