import Link from "next/link";
import { PairingQr } from "@/components/connect/pairing-qr";
import { MenuIcon, UserIcon } from "@/components/mobile/icons";
import {
  appendPayload,
  buildConnectPageUrl,
  decodePairingPayload,
  demoAgentCard,
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
  const agentPreview = decodePairingPayload(payload) ?? demoAgentCard;
  const requestOrigin = (await getRequestOrigin()) ?? "http://localhost:3000";
  const currentPairUrl = `${requestOrigin}/pair/${code}?payload=${payload ?? ""}`;
  const connectPageHref = buildConnectPageUrl({
    code,
    payload: payload ?? "",
    pairUrl: currentPairUrl,
  });

  return (
    <div className="mobile-app-root min-h-screen px-4 py-6 font-[family:var(--font-inter)] text-[#37352f]">
      <div className="mobile-app-shell">
        <header className="flex items-center justify-between gap-3 rounded-[1.75rem] border border-black/5 bg-[rgba(255,255,255,0.82)] px-4 py-4 shadow-[0_18px_36px_rgba(45,33,22,0.06)] backdrop-blur-xl">
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-white/80">
            <MenuIcon className="size-[1.05rem]" />
          </span>
          <div className="text-center">
            <p className="text-[0.66rem] uppercase tracking-[0.24em] text-[#9b9a97]">Pairing</p>
            <h1 className="text-[1.05rem] font-semibold tracking-[-0.04em] text-[#1f1d1a]">手机配对确认</h1>
          </div>
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-white/80">
            <UserIcon className="size-[1rem]" />
          </span>
        </header>

        <main className="mt-6 space-y-6">
          <section className="rounded-[2rem] border border-black/5 bg-[rgba(255,255,255,0.84)] px-6 py-6 text-center shadow-[0_18px_36px_rgba(45,33,22,0.06)] backdrop-blur-xl">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#9b9a97]">ready for mobile</p>
            <h2 className="mt-3 text-[2rem] font-semibold tracking-[-0.06em] text-[#1f1d1a]">确认这次配对</h2>
            <p className="mt-4 text-sm leading-7 text-[#645f58]">
              这个二维码来自外部 claw 环境中的 <code>{agentPreview.name}</code>。确认后，你会进入移动 Web
              首页，并保持当前配对 code 的身份连续感。
            </p>
            <p className="mt-3 text-xs leading-6 text-[#8b857d]">
              这是 connect 流程扫码后的内部第二步，不作为对外公开首链。
            </p>
            <div className="mt-6 flex justify-center">
              <PairingQr value={currentPairUrl} size={170} label={`${agentPreview.name} current pair URL`} />
            </div>
            <div className="mt-5 inline-flex rounded-full border border-black/6 bg-[#f4f2ee] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6f6a63]">
              {code}
            </div>
          </section>

          <section className="rounded-[1.8rem] border border-black/5 bg-[rgba(255,255,255,0.82)] px-5 py-5 shadow-[0_14px_30px_rgba(45,33,22,0.05)]">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#9b9a97]">外部 agent 摘要</p>
            <div className="mt-4 space-y-3 text-sm text-[#615d56]">
              <p>名称：{agentPreview.name}</p>
              <p>状态：ready_for_mobile</p>
              <p>来源：{agentPreview.source}</p>
              <p>能力：{agentPreview.capabilities.join(" / ")}</p>
              <p>简介：{agentPreview.bio}</p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link
                href={appendPayload("/app", payload)}
                className="inline-flex items-center justify-center rounded-[1.35rem] bg-[#1f1d1a] px-4 py-4 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(33,25,18,0.16)]"
              >
                进入移动 Web /app
              </Link>
              <Link
                href="/connect"
                className="inline-flex items-center justify-center rounded-[1.35rem] border border-black/8 bg-white px-4 py-4 text-sm font-semibold text-[#1f1d1a]"
              >
                返回桌面接入页
              </Link>
              <Link
                href={connectPageHref}
                className="inline-flex items-center justify-center rounded-[1.35rem] border border-black/8 bg-white px-4 py-4 text-sm font-semibold text-[#1f1d1a]"
              >
                回到当前 pairing 桌面页
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
