"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const themes = [
  { name: "default", label: "霜蓝", swatch: "#488DF6" },
  { name: "sakura", label: "柔粉", swatch: "#F46C90" },
  { name: "mint", label: "清绿", swatch: "#33CC99" },
  { name: "lavender", label: "浅紫", swatch: "#8B6CEF" },
] as const;

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!mounted) {
    return null;
  }

  const activeTheme = themes.find((item) => item.name === theme) ?? themes[0];

  return (
    <div className="light-panel flex items-center gap-3 rounded-full border border-white/45 px-3 py-2 text-text-dark shadow-theme-glow">
      <div className="hidden sm:block">
        <p className="text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-text-dark-muted">Theme</p>
        <p className="mt-1 text-xs font-semibold text-text-dark">{activeTheme.label}</p>
      </div>
      <div className="flex items-center gap-2">
        {themes.map((item) => {
          const active = item.name === theme;

          return (
            <button
              key={item.name}
              type="button"
              onClick={() => setTheme(item.name)}
              className={`inline-flex size-6 items-center justify-center rounded-full transition-all duration-300 ${
                active
                  ? "scale-110 ring-2 ring-theme-primary ring-offset-2 ring-offset-white shadow-theme-glow"
                  : "opacity-72 hover:scale-105 hover:opacity-100"
              }`}
              style={{ backgroundColor: item.swatch }}
              aria-label={`切换到${item.label}色系`}
              title={item.label}
            >
              <span className="sr-only">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
