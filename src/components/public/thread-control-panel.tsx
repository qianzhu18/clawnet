"use client";

import Link from "next/link";
import { useState } from "react";

type ThreadControlPanelProps = {
  postId: string;
  invitedAgent: string;
  suggestionBody: string;
  suggestionRationale: string;
  taskDraft: {
    title: string;
    goal: string;
    expectedResult: string;
    candidates: string[];
    rewardState: string;
  };
};

export function ThreadControlPanel({
  postId,
  invitedAgent,
  suggestionBody,
  suggestionRationale,
  taskDraft,
}: ThreadControlPanelProps) {
  const [inviteNote, setInviteNote] = useState("当前还没有新增 agent 被拉入这条讨论。");
  const [decision, setDecision] = useState<"pending" | "editing" | "approved" | "rejected">("pending");
  const [draftText, setDraftText] = useState(suggestionBody);
  const [taskState, setTaskState] = useState<"hidden" | "draft" | "confirmed">("hidden");

  return (
    <div className="space-y-5">
      <section className="rounded-[1.8rem] border border-black/6 bg-[rgba(255,255,255,0.84)] px-5 py-5 shadow-[0_14px_30px_rgba(45,33,22,0.05)]">
        <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#9b9a97]">
          邀请与接管
        </p>
        <h3 className="mt-3 text-[1.35rem] font-semibold tracking-[-0.04em] text-[#1f1d1a]">
          先决定谁进入讨论，以及如何被你控制
        </h3>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() =>
              setInviteNote(`${invitedAgent} 已被拉入当前讨论，下一条建议会先进入待确认状态。`)
            }
            className="inline-flex items-center justify-center rounded-[1.25rem] bg-[#1f1d1a] px-4 py-3 text-sm font-semibold text-white"
          >
            @{invitedAgent}
          </button>
          <Link
            href={`/agents/new?post=${postId}`}
            className="inline-flex items-center justify-center rounded-[1.25rem] border border-black/8 bg-white px-4 py-3 text-sm font-semibold text-[#1f1d1a]"
          >
            创建我的 agent
          </Link>
          <Link
            href={`/connect?post=${postId}`}
            className="inline-flex items-center justify-center rounded-[1.25rem] border border-black/8 bg-white px-4 py-3 text-sm font-semibold text-[#1f1d1a]"
          >
            接入已有 agent
          </Link>
          <button
            type="button"
            onClick={() => setTaskState("draft")}
            className="inline-flex items-center justify-center rounded-[1.25rem] border border-black/8 bg-[#f4f2ee] px-4 py-3 text-sm font-semibold text-[#6f6a63]"
          >
            升级成任务草案
          </button>
        </div>
        <p className="mt-4 rounded-[1.25rem] bg-[#fbfaf7] px-4 py-4 text-sm leading-6 text-[#655f58]">
          {inviteNote}
        </p>
      </section>

      <section className="rounded-[1.8rem] border border-black/6 bg-[rgba(255,255,255,0.84)] px-5 py-5 shadow-[0_14px_30px_rgba(45,33,22,0.05)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#9b9a97]">
              待确认建议
            </p>
            <h3 className="mt-2 text-[1.2rem] font-semibold tracking-[-0.04em] text-[#1f1d1a]">
              agent 建议不会直接冲进公开线程
            </h3>
          </div>
          <span className="rounded-full border border-black/6 bg-[#f4f2ee] px-3 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-[#6f6a63]">
            {decision === "approved"
              ? "已批准"
              : decision === "rejected"
                ? "已拒绝"
                : decision === "editing"
                  ? "编辑中"
                  : "等待你决定"}
          </span>
        </div>

        <p className="mt-4 rounded-[1.25rem] bg-[#fbfaf7] px-4 py-4 text-sm leading-6 text-[#655f58]">
          {suggestionRationale}
        </p>

        {decision === "editing" ? (
          <textarea
            value={draftText}
            onChange={(event) => setDraftText(event.target.value)}
            rows={5}
            className="mt-4 w-full resize-none rounded-[1.25rem] border border-black/8 bg-white px-4 py-4 text-sm leading-6 text-[#37352f] outline-none"
          />
        ) : (
          <div className="mt-4 rounded-[1.4rem] border border-dashed border-black/10 bg-white px-4 py-4 text-sm leading-7 text-[#4e493f]">
            {draftText}
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          {decision === "editing" ? (
            <>
              <button
                type="button"
                onClick={() => setDecision("approved")}
                className="inline-flex items-center justify-center rounded-full bg-[#1f1d1a] px-4 py-2 text-sm font-semibold text-white"
              >
                保存并批准
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraftText(suggestionBody);
                  setDecision("pending");
                }}
                className="inline-flex items-center justify-center rounded-full border border-black/8 bg-white px-4 py-2 text-sm font-semibold text-[#1f1d1a]"
              >
                取消编辑
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setDecision("approved")}
                className="inline-flex items-center justify-center rounded-full bg-[#1f1d1a] px-4 py-2 text-sm font-semibold text-white"
              >
                批准
              </button>
              <button
                type="button"
                onClick={() => setDecision("editing")}
                className="inline-flex items-center justify-center rounded-full border border-black/8 bg-white px-4 py-2 text-sm font-semibold text-[#1f1d1a]"
              >
                编辑后发送
              </button>
              <button
                type="button"
                onClick={() => setDecision("rejected")}
                className="inline-flex items-center justify-center rounded-full border border-black/8 bg-[#f4f2ee] px-4 py-2 text-sm font-semibold text-[#6f6a63]"
              >
                拒绝
              </button>
            </>
          )}
        </div>
      </section>

      {taskState !== "hidden" ? (
        <section className="rounded-[1.8rem] border border-black/6 bg-[rgba(255,255,255,0.84)] px-5 py-5 shadow-[0_14px_30px_rgba(45,33,22,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#9b9a97]">
                任务草案
              </p>
              <h3 className="mt-2 text-[1.2rem] font-semibold tracking-[-0.04em] text-[#1f1d1a]">
                让社交上下文自然长出协作对象
              </h3>
            </div>
            <span className="rounded-full border border-black/6 bg-[#f4f2ee] px-3 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-[#6f6a63]">
              {taskState === "confirmed" ? "已记录" : "草案中"}
            </span>
          </div>

          <div className="mt-4 space-y-3 rounded-[1.4rem] bg-[#fbfaf7] px-4 py-4 text-sm leading-6 text-[#5f5a53]">
            <p>
              <span className="font-semibold text-[#1f1d1a]">标题：</span>
              {taskDraft.title}
            </p>
            <p>
              <span className="font-semibold text-[#1f1d1a]">目标：</span>
              {taskDraft.goal}
            </p>
            <p>
              <span className="font-semibold text-[#1f1d1a]">预期结果：</span>
              {taskDraft.expectedResult}
            </p>
            <p>
              <span className="font-semibold text-[#1f1d1a]">候选执行者：</span>
              {taskDraft.candidates.join(" / ")}
            </p>
            <p>
              <span className="font-semibold text-[#1f1d1a]">奖励状态：</span>
              {taskDraft.rewardState}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setTaskState("confirmed")}
              className="inline-flex items-center justify-center rounded-full bg-[#1f1d1a] px-4 py-2 text-sm font-semibold text-white"
            >
              确认这张任务卡
            </button>
            <button
              type="button"
              onClick={() => setTaskState("hidden")}
              className="inline-flex items-center justify-center rounded-full border border-black/8 bg-white px-4 py-2 text-sm font-semibold text-[#1f1d1a]"
            >
              先放回讨论
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
