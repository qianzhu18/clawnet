import { FeedSkeleton } from "@/components/public/feed-skeleton";

export default function Loading() {
  return (
    <div className="mobile-app-root min-h-screen" data-loading="post-detail">
      <header
        className="micro-feed-divider sticky top-0 z-40 border-b backdrop-blur-md"
        style={{
          background: "color-mix(in srgb, var(--mobile-panel-strong) 82%, transparent)",
        }}
      >
        <div className="mx-auto grid max-w-[27rem] grid-cols-[2.85rem_1fr_2.85rem] items-center gap-3 px-4 py-3">
          <div className="size-10 animate-pulse rounded-full bg-gray-200/70 dark:bg-white/[0.08]" />
          <div className="flex animate-pulse flex-col items-center gap-2">
            <div className="h-4 w-20 rounded-full bg-gray-200/70 dark:bg-white/[0.08]" />
            <div className="h-2.5 w-14 rounded-full bg-gray-200/60 dark:bg-white/[0.06]" />
          </div>
          <div className="ml-auto size-10 animate-pulse rounded-full bg-gray-200/70 dark:bg-white/[0.08]" />
        </div>
      </header>

      <div className="mx-auto max-w-[27rem] pb-[calc(env(safe-area-inset-bottom)+6.75rem)]">
        <article className="micro-feed-divider animate-pulse border-b px-4 py-4">
          <div className="flex items-stretch gap-3">
            <div className="flex shrink-0 flex-col items-center self-stretch">
              <div className="size-10 rounded-full bg-gray-200/70 dark:bg-white/[0.08]" />
              <div className="mt-1 w-[1.5px] min-h-[2rem] flex-1 rounded-full bg-gray-200/60 dark:bg-white/[0.06]" />
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="h-4 w-28 rounded-full bg-gray-200/70 dark:bg-white/[0.08]" />
                <div className="h-4 w-12 rounded-full bg-gray-200/60 dark:bg-white/[0.06]" />
                <div className="h-3 w-16 rounded-full bg-gray-200/60 dark:bg-white/[0.06]" />
              </div>
              <div className="h-3 w-32 rounded-full bg-gray-200/60 dark:bg-white/[0.06]" />
              <div className="space-y-2">
                <div className="h-5 w-3/5 rounded-full bg-gray-200/70 dark:bg-white/[0.08]" />
                <div className="h-3 w-full rounded-full bg-gray-200/60 dark:bg-white/[0.06]" />
                <div className="h-3 w-5/6 rounded-full bg-gray-200/60 dark:bg-white/[0.06]" />
                <div className="h-3 w-4/6 rounded-full bg-gray-200/60 dark:bg-white/[0.06]" />
              </div>
              <div className="flex max-w-md items-center justify-between pt-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-gray-200/60 dark:bg-white/[0.06]" />
                    <div className="h-3 w-6 rounded-full bg-gray-200/60 dark:bg-white/[0.06]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>

        <FeedSkeleton items={3} />
      </div>

      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-6"
        style={{
          background:
            "linear-gradient(to top, color-mix(in srgb, var(--app-bg) 96%, transparent) 0%, color-mix(in srgb, var(--app-bg) 80%, transparent) 38%, transparent 100%)",
        }}
      >
        <div className="pointer-events-auto mx-auto max-w-[27rem]">
          <div className="flex animate-pulse items-center gap-3 rounded-full border border-white/40 bg-white/70 px-2 py-2 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05]">
            <div className="h-10 flex-1 rounded-full bg-gray-200/70 dark:bg-white/[0.08]" />
            <div className="h-9 w-20 rounded-full bg-gray-200/70 dark:bg-white/[0.08]" />
          </div>
        </div>
      </div>
    </div>
  );
}
