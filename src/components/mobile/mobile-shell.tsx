import Link from "next/link";
import type { ReactNode } from "react";
import {
  AvatarIcon,
  DynamicIcon,
  MenuIcon,
  MemoryIcon,
  ReportsIcon,
  StationIcon,
  UserIcon,
} from "@/components/mobile/icons";
import { appendPayload } from "@/lib/connect-demo";

export type MobileNavKey = "dynamic" | "reports" | "station" | "memory" | "avatar";

type MobileShellProps = {
  activeNav: MobileNavKey;
  children: ReactNode;
  pairingPayload?: string;
  statusLabel?: string;
};

type NavItem = {
  key: MobileNavKey;
  label: string;
  href: string;
  icon: ReactNode;
};

const navItems: NavItem[] = [
  {
    key: "dynamic",
    label: "动态",
    href: "/app",
    icon: <DynamicIcon className="size-[1.15rem]" />,
  },
  {
    key: "reports",
    label: "战报",
    href: "/app/reports",
    icon: <ReportsIcon className="size-[1.15rem]" />,
  },
  {
    key: "station",
    label: "基站",
    href: "/app/station",
    icon: <StationIcon className="size-5" />,
  },
  {
    key: "memory",
    label: "记忆",
    href: "/app/memory",
    icon: <MemoryIcon className="size-[1.1rem]" />,
  },
  {
    key: "avatar",
    label: "分身",
    href: "/app/avatar",
    icon: <AvatarIcon className="size-[1.15rem]" />,
  },
];

export function MobileShell({ activeNav, children, pairingPayload, statusLabel }: MobileShellProps) {
  return (
    <div className="mobile-app-root">
      <div className="mobile-app-shell pb-28">
        <header className="sticky top-0 z-30 border-b border-black/5 bg-[rgba(255,255,255,0.88)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 px-4 py-4">
            <div className="flex items-center gap-3 text-[#1f1d1a]">
              <button
                type="button"
                className="inline-flex size-9 items-center justify-center rounded-full bg-white/70 text-[#1f1d1a] shadow-[0_8px_24px_rgba(32,24,16,0.06)]"
                aria-label="menu"
              >
                <MenuIcon className="size-[1.05rem]" />
              </button>
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[#9b9a97]">ClawNet</p>
                <h1 className="text-[1.05rem] font-semibold tracking-[-0.03em] text-[#1f1d1a]">
                  Mobile Surface
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {statusLabel ? (
                <div className="hidden rounded-full border border-black/5 bg-[#f4f2ee] px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#7b7975] sm:inline-flex">
                  {statusLabel}
                </div>
              ) : null}
              <button
                type="button"
                className="inline-flex size-9 items-center justify-center rounded-full bg-white/70 text-[#1f1d1a] shadow-[0_8px_24px_rgba(32,24,16,0.06)]"
                aria-label="profile"
              >
                <UserIcon className="size-[1rem]" />
              </button>
            </div>
          </div>
        </header>
        <main className="px-4 pt-5">{children}</main>
      </div>
      <MobileBottomNav activeNav={activeNav} pairingPayload={pairingPayload} />
    </div>
  );
}

function MobileBottomNav({
  activeNav,
  pairingPayload,
}: {
  activeNav: MobileNavKey;
  pairingPayload?: string;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-[rgba(255,255,255,0.92)] pb-[calc(env(safe-area-inset-bottom)+0.35rem)] pt-2 backdrop-blur-xl">
      <div className="mobile-app-shell px-3">
        <div className="grid grid-cols-5 items-end gap-1">
          {navItems.map((item) => {
            if (item.key === "station") {
              const active = activeNav === item.key;
              return (
                <Link
                  key={item.key}
                  href={appendPayload(item.href, pairingPayload)}
                  className="flex flex-col items-center justify-end gap-1 text-center"
                >
                  <span
                    className={`inline-flex size-14 items-center justify-center rounded-full border border-black/5 shadow-[0_16px_32px_rgba(32,24,16,0.12)] transition-transform ${
                      active
                        ? "-translate-y-4 bg-[#1f1d1a] text-white"
                        : "-translate-y-4 bg-[#23201b] text-white hover:scale-[1.03]"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-[0.63rem] font-semibold tracking-[0.18em] text-[#5d5a54]">
                    {item.label}
                  </span>
                </Link>
              );
            }

            const active = activeNav === item.key;
            return (
              <Link
                key={item.key}
                href={appendPayload(item.href, pairingPayload)}
                className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-1 pb-1 pt-2 text-center transition-colors ${
                  active ? "text-[#1f1d1a]" : "text-[#9b9a97] hover:text-[#2f2b27]"
                }`}
              >
                <span className={active ? "" : "opacity-80"}>{item.icon}</span>
                <span className="text-[0.6rem] font-semibold tracking-[0.18em]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
