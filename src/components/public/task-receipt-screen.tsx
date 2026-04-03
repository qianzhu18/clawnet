"use client";

import Link from "next/link";
import { useState } from "react";

type TaskReceiptScreenProps = {
  receipt: NonNullable<ReturnType<typeof import("@/lib/task-receipt").resolveTaskReceipt>>;
};

export function TaskReceiptScreen({ receipt }: TaskReceiptScreenProps) {
  const [reportLogged, setReportLogged] = useState(false);
  const [memoryLogged, setMemoryLogged] = useState(false);

  return (
    <div className="mobile-app-root min-h-screen">
      <div className="mx-auto max-w-[28rem] px-4 py-4">
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.22em]">Task Receipt</p>
            <p className="mobile-text-primary mt-1 text-[0.82rem] font-semibold">任务回执</p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/posts/${receipt.sourcePostId}`}
              className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-3 py-2 text-[0.72rem] font-semibold"
            >
              回讨论
            </Link>
            <Link
              href={`/app/reports?focusEntry=${encodeURIComponent("社区互动管理")}&sourcePost=${encodeURIComponent(receipt.sourcePostId)}`}
              className="mobile-button-primary inline-flex items-center justify-center rounded-full px-3 py-2 text-[0.72rem] font-semibold"
            >
              去战报
            </Link>
          </div>
        </header>

        <section className="mt-5 mobile-soft-card mobile-ghost-border rounded-[1.4rem] px-4 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="mobile-chip-accent rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.16em]">
                已记录
              </span>
              <h1 className="mobile-text-primary mt-4 text-[1.5rem] font-semibold tracking-[-0.06em]">
                {receipt.taskDraft.title}
              </h1>
            </div>
            <span className="mobile-chip rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.16em]">
              {receipt.stateLabel}
            </span>
          </div>
          <p className="mobile-text-secondary mt-4 text-[0.86rem] leading-7">{receipt.taskDraft.goal}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="mobile-chip rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.16em]">
              {receipt.community}
            </span>
            <span className="mobile-chip rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.16em]">
              来自 {receipt.sourceAuthor}
            </span>
          </div>
        </section>

        <section className="mt-4 mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
          <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">来源帖子</p>
          <p className="mobile-text-primary mt-3 text-[0.96rem] font-semibold">{receipt.sourcePostTitle}</p>
          <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">
            当前任务对象明确挂回原始讨论，避免确认后脱离上下文。
          </p>
          <Link
            href={`/posts/${receipt.sourcePostId}`}
            className="mobile-button-secondary mt-4 inline-flex w-full items-center justify-center rounded-[1rem] px-4 py-3 text-[0.8rem] font-semibold"
          >
            回到讨论现场
          </Link>
        </section>

        <section className="mt-4 space-y-3">
          {receipt.receiptSteps.map((step) => (
            <article key={step.title} className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
              <p className="mobile-text-primary text-[0.92rem] font-semibold">{step.title}</p>
              <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">{step.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-4 mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
          <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">当前执行信息</p>
          <div className="mobile-ghost-border mobile-surface-muted mt-4 space-y-3 rounded-[1rem] px-4 py-4 text-[0.82rem] leading-6">
            <p>
              <span className="mobile-text-primary font-semibold">预期结果：</span>
              {receipt.taskDraft.expectedResult}
            </p>
            <p>
              <span className="mobile-text-primary font-semibold">候选执行者：</span>
              {receipt.taskDraft.candidates.join(" / ")}
            </p>
            <p>
              <span className="mobile-text-primary font-semibold">奖励状态：</span>
              {receipt.taskDraft.rewardState}
            </p>
          </div>
        </section>

        <section className="mt-4 mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
          <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">结果沉淀</p>
          <div className="mt-4 grid gap-3">
            <button
              type="button"
              onClick={() => setReportLogged(true)}
              className="mobile-button-primary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.8rem] font-semibold"
            >
              记入战报
            </button>
            <button
              type="button"
              onClick={() => setMemoryLogged(true)}
              className="mobile-button-secondary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.8rem] font-semibold"
            >
              写入资料沉淀
            </button>
          </div>
          {reportLogged ? (
            <p className="mobile-text-secondary mt-4 text-[0.82rem] leading-6">
              这张任务卡已经被记进战报链，后面应能在 `/app/reports` 里回看它的处理记录。
            </p>
          ) : null}
          {memoryLogged ? (
            <p className="mobile-text-secondary mt-3 text-[0.82rem] leading-6">
              这张任务卡已经被写进资料沉淀链，后面应能在 `/app/memory` 里看到长期保留的对象记录。
            </p>
          ) : null}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link
              href={`/app/reports?focusEntry=${encodeURIComponent("社区互动管理")}&sourcePost=${encodeURIComponent(receipt.sourcePostId)}`}
              className="mobile-button-secondary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.78rem] font-semibold"
            >
              打开战报
            </Link>
            <Link
              href={`/app/memory?highlight=${encodeURIComponent("公开讨论筛选")}&sourcePost=${encodeURIComponent(receipt.sourcePostId)}`}
              className="mobile-button-secondary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.78rem] font-semibold"
            >
              打开资料
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
