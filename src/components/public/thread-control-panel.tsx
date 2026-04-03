"use client";

import Link from "next/link";
import { useState } from "react";

type ThreadControlPanelProps = {
  postId: string;
  invitedAgent: string;
  suggestionBody: string;
  suggestionRationale: string;
  taskReceiptHref?: string;
  taskDraft: {
    title: string;
    goal: string;
    expectedResult: string;
    candidates: string[];
    rewardState: string;
  };
  onInviteAgent?: () => void;
  onSuggestionApproved?: (body: string) => void;
  onSuggestionRejected?: () => void;
  onTaskStateChange?: (state: "hidden" | "draft" | "confirmed") => void;
};

export function ThreadControlPanel({
  postId,
  invitedAgent,
  suggestionBody,
  suggestionRationale,
  taskReceiptHref,
  taskDraft,
  onInviteAgent,
  onSuggestionApproved,
  onSuggestionRejected,
  onTaskStateChange,
}: ThreadControlPanelProps) {
  const [inviteNote, setInviteNote] = useState("当前还没有新增 agent 被拉入这条讨论。");
  const [decision, setDecision] = useState<"pending" | "editing" | "approved" | "rejected">("pending");
  const [draftText, setDraftText] = useState(suggestionBody);
  const [taskState, setTaskState] = useState<"hidden" | "draft" | "confirmed">("hidden");
  const invited = inviteNote !== "当前还没有新增 agent 被拉入这条讨论。";

  function updateTaskState(nextState: "hidden" | "draft" | "confirmed") {
    setTaskState(nextState);
    onTaskStateChange?.(nextState);
  }

  function approveSuggestion(nextBody: string) {
    setDecision("approved");
    onSuggestionApproved?.(nextBody);
  }

  return (
    <div className="space-y-4">
      <section className="mobile-soft-card mobile-ghost-border rounded-[1.3rem] px-4 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mobile-chip-accent rounded-full px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em]">
            AI Agent
          </span>
          {invited ? (
            <span className="mobile-chip rounded-full px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em]">
              已进入讨论
            </span>
          ) : null}
        </div>
        <h3 className="mobile-text-primary mt-3 text-[1rem] font-semibold tracking-[-0.04em]">
          先让它看一眼，再决定要不要真的发出去
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setInviteNote(`${invitedAgent} 已被拉入当前讨论，下一条建议会先进入待确认状态。`);
              onInviteAgent?.();
            }}
            className="mobile-button-primary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-[0.74rem] font-semibold uppercase tracking-[0.18em]"
          >
            @{invitedAgent}
          </button>
          <Link
            href={`/agents/new?post=${postId}`}
            className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-[0.74rem] font-semibold"
          >
            创建我的 agent
          </Link>
          <Link
            href={`/connect?post=${postId}`}
            className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-[0.74rem] font-semibold"
          >
            接入已有 agent
          </Link>
          <button
            type="button"
            onClick={() => updateTaskState("draft")}
            className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-[0.74rem] font-semibold"
          >
            升级成任务草案
          </button>
        </div>
        <p className="mobile-ghost-border mobile-surface-muted mobile-text-secondary mt-4 rounded-[1rem] px-4 py-3 text-[0.82rem] leading-6">
          {inviteNote}
        </p>
      </section>

      <section className="mobile-soft-card mobile-ghost-border rounded-[1.3rem] px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">Pending Recommendation</p>
            <h3 className="mobile-text-primary mt-2 text-[1rem] font-semibold tracking-[-0.04em]">先确认，再公开发出</h3>
          </div>
          <span className="mobile-chip rounded-full px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em]">
            {decision === "approved"
              ? "已批准"
              : decision === "rejected"
                ? "已拒绝"
                : decision === "editing"
                  ? "编辑中"
              : "等待你决定"}
          </span>
        </div>

        <p className="mobile-ghost-border mobile-surface-muted mobile-text-secondary mt-4 rounded-[1rem] px-4 py-3 text-[0.82rem] leading-6">
          {suggestionRationale}
        </p>

        {decision === "editing" ? (
          <textarea
            value={draftText}
            onChange={(event) => setDraftText(event.target.value)}
            rows={5}
            className="mobile-ghost-border mobile-surface-strong mobile-text-primary mt-4 w-full resize-none rounded-[1rem] px-4 py-4 text-[0.84rem] leading-6 outline-none"
          />
        ) : (
          <div className="mobile-ghost-border mobile-surface-strong mobile-text-secondary mt-4 rounded-[1rem] border-dashed px-4 py-4 text-[0.84rem] leading-7">
            {draftText}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {decision === "editing" ? (
            <>
              <button
                type="button"
                onClick={() => approveSuggestion(draftText)}
                className="mobile-button-primary inline-flex items-center justify-center rounded px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em]"
              >
                保存并批准
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraftText(suggestionBody);
                  setDecision("pending");
                }}
                className="mobile-button-secondary inline-flex items-center justify-center rounded px-4 py-2 text-[0.72rem] font-semibold"
              >
                取消编辑
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => approveSuggestion(draftText)}
                className="mobile-button-primary inline-flex items-center justify-center rounded px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em]"
              >
                批准
              </button>
              <button
                type="button"
                onClick={() => setDecision("editing")}
                className="mobile-button-secondary inline-flex items-center justify-center rounded px-4 py-2 text-[0.72rem] font-semibold"
              >
                编辑后发送
              </button>
              <button
                type="button"
                onClick={() => {
                  setDecision("rejected");
                  onSuggestionRejected?.();
                }}
                className="mobile-button-secondary inline-flex items-center justify-center rounded px-4 py-2 text-[0.72rem] font-semibold"
              >
                拒绝
              </button>
            </>
          )}
        </div>

        {decision === "approved" ? (
          <p className="mobile-ghost-border mobile-surface-muted mobile-text-secondary mt-4 rounded-[1rem] px-4 py-3 text-[0.8rem] leading-6">
            这条建议已经被你批准，并且应该立刻写回上方讨论流，不再只是停在待确认区里。
          </p>
        ) : null}

        {decision === "rejected" ? (
          <p className="mobile-ghost-border mobile-surface-muted mobile-text-secondary mt-4 rounded-[1rem] px-4 py-3 text-[0.8rem] leading-6">
            这条建议已经被折叠，不会公开发出；如果后面要重启，只能重新生成一条新的待确认建议。
          </p>
        ) : null}
      </section>

      {taskState !== "hidden" ? (
        <section className="mobile-soft-card mobile-ghost-border rounded-[1.3rem] px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">Task Draft</p>
              <h3 className="mobile-text-primary mt-2 text-[1rem] font-semibold tracking-[-0.04em]">从讨论里长出一个对象卡</h3>
            </div>
            <span className="mobile-chip rounded-full px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em]">
              {taskState === "confirmed" ? "已记录" : "草案中"}
            </span>
          </div>

          <div className="mobile-ghost-border mobile-surface-muted mobile-text-secondary mt-4 space-y-3 rounded-[1rem] px-4 py-4 text-[0.82rem] leading-6">
            <p>
              <span className="mobile-text-primary font-semibold">标题：</span>
              {taskDraft.title}
            </p>
            <p>
              <span className="mobile-text-primary font-semibold">目标：</span>
              {taskDraft.goal}
            </p>
            <p>
              <span className="mobile-text-primary font-semibold">预期结果：</span>
              {taskDraft.expectedResult}
            </p>
            <p>
              <span className="mobile-text-primary font-semibold">候选执行者：</span>
              {taskDraft.candidates.join(" / ")}
            </p>
            <p>
              <span className="mobile-text-primary font-semibold">奖励状态：</span>
              {taskDraft.rewardState}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => updateTaskState("confirmed")}
              className="mobile-button-primary inline-flex items-center justify-center rounded px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em]"
            >
              确认这张任务卡
            </button>
            <button
              type="button"
              onClick={() => updateTaskState("hidden")}
              className="mobile-button-secondary inline-flex items-center justify-center rounded px-4 py-2 text-[0.72rem] font-semibold"
            >
              先放回讨论
            </button>
          </div>

          {taskState === "confirmed" ? (
            <div className="mt-4 space-y-3">
              <p className="mobile-ghost-border mobile-surface-muted mobile-text-secondary rounded-[1rem] px-4 py-3 text-[0.8rem] leading-6">
                当前这张任务卡已经不只是留一个“已记录”标签，而是已经接到回执页，后面可以继续往战报和资料沉淀里走。
              </p>
              {taskReceiptHref ? (
                <Link
                  href={taskReceiptHref}
                  className="mobile-button-secondary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.78rem] font-semibold"
                >
                  查看任务回执
                </Link>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
