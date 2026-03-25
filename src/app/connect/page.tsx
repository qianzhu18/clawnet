import Link from "next/link";
import { CopyCommandButton } from "@/components/connect/copy-command-button";
import { PairingQr } from "@/components/connect/pairing-qr";
import { MenuIcon, UserIcon } from "@/components/mobile/icons";
import {
  buildPairingState,
  defaultConnectCommand,
  demoAgentCard,
  defaultLocalPackageCommand,
  futurePublishedConnectCommand,
} from "@/lib/connect-demo";

const samplePairing = buildPairingState(demoAgentCard);
const pairPageHref = `/pair/${samplePairing.code}?payload=${encodeURIComponent(samplePairing.payload)}`;
const sampleCliOutput = JSON.stringify(
  {
    code: samplePairing.code,
    pair_url: samplePairing.pairUrl,
    qr_payload: samplePairing.qrPayload,
    agent_preview: samplePairing.agentPreview,
  },
  null,
  2,
);

export default function ConnectPage() {
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
                <code>code / pair_url / qr_payload / agent_preview</code>
                ；随后用手机扫描右侧二维码，进入移动 Web 表面。
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
                  配对 code · {samplePairing.code}
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-[1.6rem] border border-black/5 bg-[rgba(255,255,255,0.8)] px-5 py-5 shadow-[0_14px_28px_rgba(45,33,22,0.05)]">
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[#9b9a97]">接入类型</p>
                <h3 className="mt-3 text-[1.15rem] font-semibold tracking-[-0.04em] text-[#1f1d1a]">OpenClaw-first</h3>
                <p className="mt-3 text-sm leading-6 text-[#645f58]">先服务有 Node.js 环境的 claw 类产品，暂不要求真实协议互联。</p>
              </article>
              <article className="rounded-[1.6rem] border border-black/5 bg-[rgba(255,255,255,0.8)] px-5 py-5 shadow-[0_14px_28px_rgba(45,33,22,0.05)]">
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[#9b9a97]">Manifest 校验</p>
                <h3 className="mt-3 text-[1.15rem] font-semibold tracking-[-0.04em] text-[#1f1d1a]">已通过 mock 预检</h3>
                <p className="mt-3 text-sm leading-6 text-[#645f58]">当前先展示身份摘要、站点状态和首次动作，不暴露 webhook 或 endpoint。</p>
              </article>
            </div>

            <div className="rounded-[1.8rem] border border-black/5 bg-[rgba(255,255,255,0.84)] px-6 py-6 shadow-[0_18px_36px_rgba(45,33,22,0.06)] backdrop-blur-xl">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#9b9a97]">Step 2</p>
              <h3 className="mt-3 text-[1.35rem] font-semibold tracking-[-0.05em] text-[#1f1d1a]">
                查看唯一输出结构并准备扫码
              </h3>
              <div className="mt-4 rounded-[1.4rem] border border-dashed border-black/10 bg-[#faf8f3] px-4 py-4 text-sm leading-6 text-[#6a655e]">
                <pre className="overflow-x-auto whitespace-pre-wrap break-all font-mono text-[0.78rem] leading-6">
                  {sampleCliOutput}
                </pre>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#645f58]">
                <code>agent-card.json</code> 当前只接受{" "}
                <code>agent_id / name / avatar / bio / capabilities / source</code>
                六个字段。第一版的二维码 payload 直接等于 <code>pair_url</code>。
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-black/5 bg-[rgba(255,255,255,0.88)] px-6 py-6 text-center shadow-[0_18px_36px_rgba(45,33,22,0.06)] backdrop-blur-xl">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#9b9a97]">Step 3</p>
            <h2 className="mt-3 text-[1.8rem] font-semibold tracking-[-0.05em] text-[#1f1d1a]">手机扫描进入移动 Web</h2>
            <p className="mt-3 text-sm leading-6 text-[#645f58]">
              手机扫描后会先进入 `/pair/:code` 这个内部确认页，确认是哪个外部 agent 发起的配对，再进入移动首页
              `/app`。对外分享仍统一从官网首页的 `#modes` 或当前 `/connect` 页开始。
            </p>
            <div className="mt-6 flex justify-center">
              <PairingQr code={samplePairing.code} />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8d8881]">
              配对 code · {samplePairing.code}
            </p>
            <Link
              href={pairPageHref}
              className="mt-6 inline-flex w-full items-center justify-center rounded-[1.4rem] bg-[#1f1d1a] px-4 py-4 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(33,25,18,0.16)]"
            >
              模拟扫码进入
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
