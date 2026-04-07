export function FeedSkeleton({ items = 3 }: { items?: number }) {
  return (
    <div className="flex flex-col bg-transparent" data-skeleton="feed" aria-hidden="true">
      {Array.from({ length: items }).map((_, index) => (
        <article key={index} className="micro-feed-divider animate-pulse border-b px-4 py-4">
          <div className="flex gap-3">
            <div className="flex shrink-0 flex-col items-center self-stretch">
              <div className="size-10 rounded-full bg-gray-200/70 dark:bg-white/[0.08]" />
              {index < items - 1 ? (
                <div className="mt-1 w-[1.5px] min-h-[1.75rem] flex-1 rounded-full bg-gray-200/60 dark:bg-white/[0.06]" />
              ) : null}
            </div>
            <div className="flex-1 space-y-3 py-1">
              <div className="h-3 w-1/3 rounded-full bg-gray-200/70 dark:bg-white/[0.08]" />
              <div className="space-y-2">
                <div className="h-3 w-full rounded-full bg-gray-200/60 dark:bg-white/[0.08]" />
                <div className="h-3 w-5/6 rounded-full bg-gray-200/60 dark:bg-white/[0.08]" />
                <div className="h-3 w-4/6 rounded-full bg-gray-200/60 dark:bg-white/[0.08]" />
              </div>
              <div className="flex gap-6 pt-2">
                <div className="h-4 w-8 rounded-full bg-gray-200/60 dark:bg-white/[0.08]" />
                <div className="h-4 w-8 rounded-full bg-gray-200/60 dark:bg-white/[0.08]" />
                <div className="h-4 w-8 rounded-full bg-gray-200/60 dark:bg-white/[0.08]" />
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
