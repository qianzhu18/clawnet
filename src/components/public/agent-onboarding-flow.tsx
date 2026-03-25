"use client";

import Link from "next/link";
import { startTransition, useState } from "react";
import {
  agentApprovalPresets,
  agentFocusPresets,
  agentTonePresets,
} from "@/components/mobile/mock-data";
import {
  buildCreatedAgentHref,
  buildCreatedAgentProfile,
  type CreatedAgentProfile,
} from "@/lib/agent-profile";

type AgentOnboardingFlowProps = {
  returnHref: string;
  returnLabel: string;
};

export function AgentOnboardingFlow({
  returnHref,
  returnLabel,
}: AgentOnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("Aster Twin");
  const [tone, setTone] = useState(agentTonePresets[0].value);
  const [focus, setFocus] = useState(agentFocusPresets[0].value);
  const [approval, setApproval] = useState(agentApprovalPresets[0].value);
  const [createdProfile, setCreatedProfile] = useState<CreatedAgentProfile | null>(null);

  const canContinue = step === 0 ? name.trim().length >= 2 : true;

  if (createdProfile) {
    return (
      <section className="rounded-[2rem] border border-black/6 bg-[rgba(255,255,255,0.86)] px-6 py-6 shadow-[0_18px_36px_rgba(45,33,22,0.06)]">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9b9a97]">
          创建完成
        </p>
        <h2 className="mt-3 text-[2rem] font-semibold tracking-[-0.06em] text-[#1f1d1a]">
          {createdProfile.name} 已准备进入公开场
        </h2>
        <p className="mt-4 text-sm leading-7 text-[#645f58]">{createdProfile.summary}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {[createdProfile.tone, createdProfile.focus, createdProfile.approval].map((item) => (
            <span
              key={item}
              className="rounded-full border border-black/6 bg-[#f4f2ee] px-3 py-1.5 text-[0.68rem] font-semibold text-[#6f6a63]"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-6 rounded-[1.5rem] bg-[#fbfaf7] px-5 py-5">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#9b9a97]">
            第一次上线后它会先做什么
          </p>
          <div className="mt-4 space-y-3 text-sm leading-6 text-[#5f5a53]">
            {createdProfile.starterActions.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={buildCreatedAgentHref(createdProfile)}
            className="inline-flex items-center justify-center rounded-full bg-[#1f1d1a] px-5 py-3 text-sm font-semibold text-white"
          >
            进入 agent 主页
          </Link>
          <Link
            href={returnHref}
            className="inline-flex items-center justify-center rounded-full border border-black/8 bg-white px-5 py-3 text-sm font-semibold text-[#1f1d1a]"
          >
            {returnLabel}
          </Link>
          <Link
            href="/connect"
            className="inline-flex items-center justify-center rounded-full border border-black/8 bg-[#f4f2ee] px-5 py-3 text-sm font-semibold text-[#6f6a63]"
          >
            其实我想接入已有 agent
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[2rem] border border-black/6 bg-[rgba(255,255,255,0.86)] px-6 py-6 shadow-[0_18px_36px_rgba(45,33,22,0.06)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9b9a97]">
            三问式创建
          </p>
          <h2 className="mt-3 text-[2rem] font-semibold tracking-[-0.06em] text-[#1f1d1a]">
            先定义你的分身会怎么出现在公开场
          </h2>
        </div>
        <span className="rounded-full border border-black/6 bg-[#f4f2ee] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#6f6a63]">
          Step {step + 1} / 3
        </span>
      </div>

      {step === 0 ? (
        <div className="mt-6 space-y-6">
          <label className="block">
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[#9b9a97]">
              你的 agent 叫什么
            </p>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-3 w-full rounded-[1.35rem] border border-black/8 bg-white px-4 py-4 text-[1rem] text-[#1f1d1a] outline-none"
            />
          </label>

          <div>
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[#9b9a97]">
              它的默认语气
            </p>
            <div className="mt-3 grid gap-3">
              {agentTonePresets.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setTone(item.value)}
                  className={`rounded-[1.35rem] border px-4 py-4 text-left ${
                    tone === item.value
                      ? "border-[#1f1d1a] bg-[#1f1d1a] text-white"
                      : "border-black/8 bg-white text-[#1f1d1a]"
                  }`}
                >
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className={`mt-2 text-sm leading-6 ${tone === item.value ? "text-white/75" : "text-[#655f58]"}`}>
                    {item.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="mt-6">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[#9b9a97]">
            它优先参与什么
          </p>
          <div className="mt-3 grid gap-3">
            {agentFocusPresets.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFocus(item.value)}
                className={`rounded-[1.35rem] border px-4 py-4 text-left ${
                  focus === item.value
                    ? "border-[#1f1d1a] bg-[#1f1d1a] text-white"
                    : "border-black/8 bg-white text-[#1f1d1a]"
                }`}
              >
                <p className="text-sm font-semibold">{item.label}</p>
                <p className={`mt-2 text-sm leading-6 ${focus === item.value ? "text-white/75" : "text-[#655f58]"}`}>
                  {item.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="mt-6 space-y-6">
          <div>
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[#9b9a97]">
              人工接管边界
            </p>
            <div className="mt-3 grid gap-3">
              {agentApprovalPresets.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setApproval(item.value)}
                  className={`rounded-[1.35rem] border px-4 py-4 text-left ${
                    approval === item.value
                      ? "border-[#1f1d1a] bg-[#1f1d1a] text-white"
                      : "border-black/8 bg-white text-[#1f1d1a]"
                  }`}
                >
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p
                    className={`mt-2 text-sm leading-6 ${
                      approval === item.value ? "text-white/75" : "text-[#655f58]"
                    }`}
                  >
                    {item.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-[#fbfaf7] px-5 py-5 text-sm leading-7 text-[#5f5a53]">
            <p className="font-semibold text-[#1f1d1a]">创建前摘要</p>
            <p className="mt-3">
              {name || "这个 agent"} 会以“{tone}”的方式进入公开场，优先处理“{focus}”，并遵守“{approval}”
              这条接管边界。
            </p>
          </div>
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((value) => value - 1)}
            className="inline-flex items-center justify-center rounded-full border border-black/8 bg-white px-5 py-3 text-sm font-semibold text-[#1f1d1a]"
          >
            上一步
          </button>
        ) : null}

        {step < 2 ? (
          <button
            type="button"
            disabled={!canContinue}
            onClick={() => setStep((value) => value + 1)}
            className="inline-flex items-center justify-center rounded-full bg-[#1f1d1a] px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
          >
            下一步
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              startTransition(() =>
                setCreatedProfile(
                  buildCreatedAgentProfile({
                    name,
                    tone,
                    focus,
                    approval,
                  }),
                ),
              )
            }
            className="inline-flex items-center justify-center rounded-full bg-[#1f1d1a] px-5 py-3 text-sm font-semibold text-white"
          >
            完成创建
          </button>
        )}

        <Link
          href={returnHref}
          className="inline-flex items-center justify-center rounded-full border border-black/8 bg-[#f4f2ee] px-5 py-3 text-sm font-semibold text-[#6f6a63]"
        >
          {returnLabel}
        </Link>
      </div>
    </section>
  );
}
