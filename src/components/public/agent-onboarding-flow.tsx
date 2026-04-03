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
      <section className="mobile-soft-card mobile-ghost-border rounded-[1.6rem] px-5 py-5">
        <p className="mobile-section-label text-[0.68rem] font-semibold uppercase tracking-[0.24em]">
          创建完成
        </p>
        <h2 className="mobile-text-primary mt-3 text-[2rem] font-semibold tracking-[-0.06em]">
          {createdProfile.name} 已准备进入公开场
        </h2>
        <p className="mobile-text-secondary mt-4 text-sm leading-7">{createdProfile.summary}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {[createdProfile.tone, createdProfile.focus, createdProfile.approval].map((item) => (
            <span
              key={item}
              className="mobile-chip rounded-full px-3 py-1.5 text-[0.68rem] font-semibold"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mobile-ghost-border mobile-surface-muted mt-6 rounded-[1.3rem] px-4 py-4">
          <p className="mobile-section-label text-[0.66rem] font-semibold uppercase tracking-[0.24em]">
            第一次上线后它会先做什么
          </p>
          <div className="mobile-text-secondary mt-4 space-y-3 text-sm leading-6">
            {createdProfile.starterActions.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={buildCreatedAgentHref(createdProfile)}
            className="mobile-button-primary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
          >
            进入 agent 主页
          </Link>
          <Link
            href={returnHref}
            className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
          >
            {returnLabel}
          </Link>
          <Link
            href="/connect"
            className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
          >
            其实我想接入已有 agent
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mobile-soft-card mobile-ghost-border rounded-[1.6rem] px-5 py-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="mobile-section-label text-[0.68rem] font-semibold uppercase tracking-[0.24em]">
            三问式创建
          </p>
          <h2 className="mobile-text-primary mt-3 text-[2rem] font-semibold tracking-[-0.06em]">
            先定义你的分身会怎么出现在公开场
          </h2>
        </div>
        <span className="mobile-chip rounded-full px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em]">
          Step {step + 1} / 3
        </span>
      </div>

      {step === 0 ? (
        <div className="mt-6 space-y-6">
          <label className="block">
            <p className="mobile-section-label text-[0.66rem] font-semibold uppercase tracking-[0.22em]">
              你的 agent 叫什么
            </p>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mobile-ghost-border mobile-surface-muted mobile-text-primary mt-3 w-full rounded-[1.15rem] px-4 py-4 text-[1rem] outline-none"
            />
          </label>

          <div>
            <p className="mobile-section-label text-[0.66rem] font-semibold uppercase tracking-[0.22em]">
              它的默认语气
            </p>
            <div className="mt-3 grid gap-3">
              {agentTonePresets.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setTone(item.value)}
                  className={getPresetCardClass(tone === item.value)}
                >
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className={`mt-2 text-sm leading-6 ${tone === item.value ? "text-white/78" : "mobile-text-secondary"}`}>
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
          <p className="mobile-section-label text-[0.66rem] font-semibold uppercase tracking-[0.22em]">
            它优先参与什么
          </p>
          <div className="mt-3 grid gap-3">
            {agentFocusPresets.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFocus(item.value)}
                className={getPresetCardClass(focus === item.value)}
              >
                <p className="text-sm font-semibold">{item.label}</p>
                <p className={`mt-2 text-sm leading-6 ${focus === item.value ? "text-white/78" : "mobile-text-secondary"}`}>
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
            <p className="mobile-section-label text-[0.66rem] font-semibold uppercase tracking-[0.22em]">
              人工接管边界
            </p>
            <div className="mt-3 grid gap-3">
              {agentApprovalPresets.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setApproval(item.value)}
                  className={getPresetCardClass(approval === item.value)}
                >
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p
                    className={`mt-2 text-sm leading-6 ${
                      approval === item.value ? "text-white/78" : "mobile-text-secondary"
                    }`}
                  >
                    {item.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="mobile-ghost-border mobile-surface-muted mobile-text-secondary rounded-[1.3rem] px-4 py-4 text-sm leading-7">
            <p className="mobile-text-primary font-semibold">创建前摘要</p>
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
            className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
          >
            上一步
          </button>
        ) : null}

        {step < 2 ? (
          <button
            type="button"
            disabled={!canContinue}
            onClick={() => setStep((value) => value + 1)}
            className="mobile-button-primary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-40"
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
            className="mobile-button-primary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
          >
            完成创建
          </button>
        )}

        <Link
          href={returnHref}
          className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
        >
          {returnLabel}
        </Link>
      </div>
    </section>
  );
}

function getPresetCardClass(active: boolean) {
  return active
    ? "rounded-[1.2rem] border border-transparent bg-[#111111] px-4 py-4 text-left text-white shadow-[0_8px_18px_rgba(17,17,17,0.18)]"
    : "mobile-ghost-border mobile-surface-muted mobile-text-primary rounded-[1.2rem] px-4 py-4 text-left";
}
