"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ThreadControlPanelProps = {
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
  autoPreviewEnabled: boolean;
  onInviteAgent?: () => void;
  onSuggestionApproved?: (body: string) => void;
  onSuggestionRejected?: () => void;
  onTaskStateChange?: (state: "hidden" | "draft" | "confirmed") => void;
};

export function ThreadControlPanel({
  invitedAgent,
  suggestionBody,
  suggestionRationale,
  taskReceiptHref,
  taskDraft,
  autoPreviewEnabled,
  onInviteAgent,
  onSuggestionApproved,
  onSuggestionRejected,
  onTaskStateChange,
}: ThreadControlPanelProps) {
  const [previewState, setPreviewState] = useState<"hidden" | "preview" | "editing" | "approved">(
    autoPreviewEnabled ? "preview" : "hidden",
  );
  const [draftText, setDraftText] = useState(suggestionBody);
  const [taskState, setTaskState] = useState<"hidden" | "draft" | "confirmed">("hidden");

  useEffect(() => {
    setDraftText(suggestionBody);
  }, [suggestionBody]);

  useEffect(() => {
    if (autoPreviewEnabled && previewState === "hidden") {
      setPreviewState("preview");
    }
  }, [autoPreviewEnabled, previewState]);

  function updateTaskState(nextState: "hidden" | "draft" | "confirmed") {
    setTaskState(nextState);
    onTaskStateChange?.(nextState);
  }

  function openPreviewByMention() {
    setPreviewState("preview");
    onInviteAgent?.();
  }

  function approveSuggestion() {
    setPreviewState("approved");
    onSuggestionApproved?.(draftText);
  }

  function hidePreview() {
    setPreviewState("hidden");
    onSuggestionRejected?.();
  }

  return (
    <div className="space-y-3">
      <section className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mobile-chip-accent rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.14em]">
            AI
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={openPreviewByMention}
            className="mobile-button-primary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-[0.74rem] font-semibold uppercase tracking-[0.16em]"
          >
            @{invitedAgent}
          </button>
          <button
            type="button"
            onClick={() => updateTaskState("draft")}
            className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-[0.74rem] font-semibold"
          >
            转成任务
          </button>
        </div>
      </section>

      {previewState !== "hidden" ? (
        <section className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="mobile-button-secondary inline-flex size-10 items-center justify-center rounded-[0.9rem] text-[0.72rem] font-semibold">
              AI
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="mobile-text-primary text-[0.9rem] font-semibold">{invitedAgent}</p>
                <span className="mobile-chip rounded-full px-2 py-0.5 text-[0.54rem] font-semibold uppercase tracking-[0.14em]">
                  AI
                </span>
                <span className="mobile-chip-accent rounded-full px-2 py-0.5 text-[0.54rem] font-semibold uppercase tracking-[0.14em]">
                  {previewState === "approved" ? "已公开" : previewState === "editing" ? "编辑中" : "预览中"}
                </span>
              </div>
              <p className="mobile-text-secondary mt-2 text-[0.82rem] leading-6">{suggestionRationale}</p>
            </div>
          </div>

          {previewState === "editing" ? (
            <textarea
              value={draftText}
              onChange={(event) => setDraftText(event.target.value)}
              rows={5}
              className="mobile-ghost-border mobile-surface-strong mobile-text-primary mt-4 w-full resize-none rounded-[1rem] px-4 py-4 text-[0.84rem] leading-6 outline-none"
            />
          ) : (
            <div className="mobile-ghost-border mobile-surface-strong mt-4 rounded-[1rem] px-4 py-4">
              <p className="mobile-text-secondary text-[0.84rem] leading-7">{draftText}</p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {previewState === "editing" ? (
              <>
                <button
                  type="button"
                  onClick={approveSuggestion}
                  className="mobile-button-primary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-[0.74rem] font-semibold"
                >
                  直接发出
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDraftText(suggestionBody);
                    setPreviewState("preview");
                  }}
                  className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-[0.74rem] font-semibold"
                >
                  取消
                </button>
              </>
            ) : previewState === "approved" ? (
              <p className="mobile-text-muted text-[0.74rem]">这条 AI 回复已经出现在主评论流里。</p>
            ) : (
              <>
                <button
                  type="button"
                  onClick={approveSuggestion}
                  className="mobile-button-primary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-[0.74rem] font-semibold"
                >
                  直接发出
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewState("editing")}
                  className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-[0.74rem] font-semibold"
                >
                  先收起
                </button>
                <button
                  type="button"
                  onClick={hidePreview}
                  className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-[0.74rem] font-semibold"
                >
                  不发这条
                </button>
              </>
            )}
          </div>
        </section>
      ) : null}

      {taskState !== "hidden" ? (
        <section className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="mobile-section-label text-[0.56rem] font-semibold uppercase tracking-[0.14em]">Task</p>
              <h3 className="mobile-text-primary mt-2 text-[0.96rem] font-semibold">{taskDraft.title}</h3>
            </div>
            <span className="mobile-chip rounded-full px-2 py-0.5 text-[0.54rem] font-semibold uppercase tracking-[0.14em]">
              {taskState === "confirmed" ? "已记录" : "草案"}
            </span>
          </div>
          <div className="mt-4 space-y-2 text-[0.82rem] leading-6">
            <p className="mobile-text-secondary">{taskDraft.goal}</p>
            <p className="mobile-text-muted">候选执行者：{taskDraft.candidates.join(" / ")}</p>
            <p className="mobile-text-muted">状态：{taskDraft.rewardState}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => updateTaskState("confirmed")}
              className="mobile-button-primary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-[0.74rem] font-semibold"
            >
              记录任务
            </button>
            <button
              type="button"
              onClick={() => updateTaskState("hidden")}
              className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-[0.74rem] font-semibold"
            >
              先留在讨论里
            </button>
            {taskState === "confirmed" && taskReceiptHref ? (
              <Link
                href={taskReceiptHref}
                className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-[0.74rem] font-semibold"
              >
                查看回执
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
