import Link from "next/link";
import { CopyCommandButton } from "@/components/connect/copy-command-button";
import { PairingQr } from "@/components/connect/pairing-qr";
import { MenuIcon, UserIcon } from "@/components/mobile/icons";
import {
  buildPairingState,
  readImportedPairing,
  defaultConnectCommand,
  demoAgentCard,
  defaultLocalPackageCommand,
  futurePublishedConnectCommand,
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
      scan_ready: currentPairing.scanReady,
      agent_preview: currentPairing.agentPreview,
    },
    null,
    2,
  );

  return (
    <div className="mobile-app-root min-h-screen pb-20">
      <div className="mx-auto max-w-6xl px-5 py-6 font-[family:var(--font-inter)] text-[#37352f] sm:px-8">
        <header className="flex items-center justify-between gap-4 rounded-[1.75rem] border border-black/5 bg-[rgba(255,255,255,0.82)] px-5 py-4 shadow-[0_18px_36px_rgba(45,33,22,0.06)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-white/80">
              <MenuIcon className="size-[1.05rem]" />
            </span>
            <div>
              <p className="text-[0.66rem] uppercase tracking-[0.24em] text-[#9b9a97]">ClawNet Connect</p>
              <h1 className="text-[1.15rem] font-semibold tracking-[-0.04em] text-[#1f1d1a]">桌面接入与配对</h1>
            </div>
          </div>
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-white/80">
            <UserIcon className="size-[1rem]" />
          </span>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-black/5 bg-[rgba(255,255,255,0.84)] px-6 py-6 shadow-[0_18px_36px_rgba(45,33,22,0.06)] backdrop-blur-xl">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#9b9a97]">Step 1</p>
              <h2 className="mt-3 text-[2.2rem] font-semibold tracking-[-0.06em] text-[#1f1d1a]">先在仓库根目录运行命令</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#645f58]">
                当前 npm 公网包还没发布，所以不要直接运行 <code>npx clawnet-connect</code>。第一版先在仓库根目录使用本地
                CLI demo mode 完成接入预演。命令运行后，你会拿到固定结构的{" "}
                <code>code / pair_url / connect_url / qr_payload / agent_preview</code>
                。如果你想回到桌面承接这次 pairing，就直接打开 CLI 输出里的 <code>connect_url</code>。
              </p>
              <div className="mt-5 rounded-[1.4rem] border border-black/6 bg-[#1f1d1a] px-5 py-4 text-sm text-white shadow-[0_16px_34px_rgba(33,25,18,0.18)]">
                <code className="break-all font-mono text-[0.9rem]">{defaultConnectCommand}</code>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#645f58]">
                如果你确实想直接调用本地包，也可以在仓库根目录运行{" "}
                <code>{defaultLocalPackageCommand}</code>。
              </p>
              <p className="mt-3 text-sm leading-6 text-[#8a847b]">
                未来如果把 connect 包发布到 npm 公网，这里才会切回 <code>{futurePublishedConnectCommand}</code> 这类写法。
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <CopyCommandButton command={defaultConnectCommand} />
                <span className="rounded-full border border-black/6 bg-[#f4f2ee] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6f6a63]">
                  配对 code · {currentPairing.code}
                </span>
                {importedPairing ? (
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    已导入当前 pairing
                  </span>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-[1.6rem] border border-black/5 bg-[rgba(255,255,255,0.8)] px-5 py-5 shadow-[0_14px_28px_rgba(45,33,22,0.05)]">
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[#9b9a97]">当前 pairing</p>
                <h3 className="mt-3 text-[1.15rem] font-semibold tracking-[-0.04em] text-[#1f1d1a]">
                  {currentPairing.agentPreview.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#645f58]">
                  来源：{currentPairing.agentPreview.source}。{importedPairing ? "桌面页已经按这次 CLI pairing 还原。" : "当前还没导入本次 pairing，正在显示默认演示态。"}
                </p>
              </article>
              <article className="rounded-[1.6rem] border border-black/5 bg-[rgba(255,255,255,0.8)] px-5 py-5 shadow-[0_14px_28px_rgba(45,33,22,0.05)]">
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[#9b9a97]">扫码模式</p>
                <h3 className="mt-3 text-[1.15rem] font-semibold tracking-[-0.04em] text-[#1f1d1a]">
                  {currentPairing.hostLabel}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#645f58]">{currentPairing.hostHint}</p>
              </article>
            </div>

            <div className="rounded-[1.8rem] border border-black/5 bg-[rgba(255,255,255,0.84)] px-6 py-6 shadow-[0_18px_36px_rgba(45,33,22,0.06)] backdrop-blur-xl">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#9b9a97]">Step 2</p>
              <h3 className="mt-3 text-[1.35rem] font-semibold tracking-[-0.05em] text-[#1f1d1a]">
                查看唯一输出结构并准备扫码
              </h3>
              <div className="mt-4 rounded-[1.4rem] border border-dashed border-black/10 bg-[#faf8f3] px-4 py-4 text-sm leading-6 text-[#6a655e]">
                <pre className="overflow-x-auto whitespace-pre-wrap break-all font-mono text-[0.78rem] leading-6">
                  {currentCliOutput}
                </pre>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#645f58]">
                <code>agent-card.json</code> 当前只接受{" "}
                <code>agent_id / name / avatar / bio / capabilities / source</code>
                六个字段。`connect_url` 用来回到桌面页还原当前 pairing；真机扫码时只使用非 localhost 的 <code>pair_url</code>。
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-black/5 bg-[rgba(255,255,255,0.88)] px-6 py-6 text-center shadow-[0_18px_36px_rgba(45,33,22,0.06)] backdrop-blur-xl">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#9b9a97]">Step 3</p>
            <h2 className="mt-3 text-[1.8rem] font-semibold tracking-[-0.05em] text-[#1f1d1a]">
              {currentPairing.scanReady ? "手机扫描进入移动 Web" : "先把 host 切到真机模式"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#645f58]">
              当前 pairing 对应的 agent 是 <strong>{currentPairing.agentPreview.name}</strong>。{
                currentPairing.scanReady
                  ? "二维码会先把手机带到 `/pair/:code` 这个内部确认页，再进入 `/app`。"
                  : "由于当前 host 仍是 localhost 调试模式，这里不再给出可让手机误扫的二维码。请按提示改用 LAN / 公网 host 后重新打开 connect_url。"
              }
            </p>
            {currentPairing.scanReady ? (
              <div className="mt-6 flex justify-center">
                <PairingQr
                  value={currentPairing.qrPayload}
                  label={`${currentPairing.agentPreview.name} pairing QR`}
                />
              </div>
            ) : (
              <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-5 text-left text-sm leading-6 text-amber-900">
                <p className="font-semibold">当前 host：{currentPairing.hostValue}</p>
                <p className="mt-3">
                  真机请使用 `npm run dev:lan / start:lan`，并在运行 CLI 时覆盖：
                  <code className="ml-1 break-all">CLAWNET_HOST=http://&lt;你的局域网IP&gt;:3000</code>
                </p>
              </div>
            )}
            <div className="mt-5 rounded-[1.3rem] border border-black/6 bg-[#fbfaf7] px-4 py-4 text-left">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8d8881]">当前身份摘要</p>
              <p className="mt-3 text-base font-semibold text-[#1f1d1a]">{currentPairing.agentPreview.name}</p>
              <p className="mt-2 text-sm leading-6 text-[#645f58]">{currentPairing.agentPreview.bio}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-black/6 bg-[#f4f2ee] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#6f6a63]">
                  来源 · {currentPairing.agentPreview.source}
                </span>
                {currentPairing.agentPreview.capabilities.map((capability) => (
                  <span
                    key={capability}
                    className="rounded-full border border-black/6 bg-white/80 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#7c7770]"
                  >
                    {capability}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href={pairPageHref}
              className="mt-6 inline-flex w-full items-center justify-center rounded-[1.4rem] bg-[#1f1d1a] px-4 py-4 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(33,25,18,0.16)]"
            >
              {currentPairing.scanReady ? "打开当前 pairing /pair" : "只在当前电脑继续打开 /pair"}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
