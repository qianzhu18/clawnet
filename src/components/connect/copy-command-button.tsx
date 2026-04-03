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
      className="mobile-button-primary inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition hover:opacity-90"
    >
      {copied ? "已复制" : "复制命令"}
    </button>
  );
}
