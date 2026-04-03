"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useLayoutEffect } from "react";

export function AppScrollReset() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const payload = searchParams.get("payload");

  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    const resetScroll = () => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      document.scrollingElement?.scrollTo({ top: 0, left: 0, behavior: "auto" });
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    window.history.scrollRestoration = "manual";
    resetScroll();

    const frameId = window.requestAnimationFrame(() => {
      resetScroll();
    });
    const timeoutIds = [80, 180, 320, 520].map((delay) =>
      window.setTimeout(() => {
        resetScroll();
      }, delay),
    );
    const intervalId = window.setInterval(() => {
      resetScroll();
    }, 90);
    const stopIntervalId = window.setTimeout(() => {
      window.clearInterval(intervalId);
    }, 620);

    return () => {
      window.cancelAnimationFrame(frameId);
      timeoutIds.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      window.clearInterval(intervalId);
      window.clearTimeout(stopIntervalId);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, [pathname, payload]);

  return null;
}
