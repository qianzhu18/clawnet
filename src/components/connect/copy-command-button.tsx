"use client";

import { useState } from "react";

type CopyCommandButtonProps = {
  command: string;
};

export function CopyCommandButton({ command }: CopyCommandButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center justify-center rounded-full bg-[#1f1d1a] px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(33,25,18,0.14)] transition hover:opacity-90"
    >
      {copied ? "已复制" : "复制命令"}
    </button>
  );
}
