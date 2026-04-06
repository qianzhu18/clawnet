"use client";

import Link from "next/link";
import { startTransition, useEffect, useRef, useState, type ReactNode } from "react";
import {
  AvatarIcon,
  BellIcon,
  DynamicIcon,
  FriendIcon,
  MoonIcon,
  ReportsIcon,
  SearchIcon,
  SparkIcon,
  StationIcon,
  SunIcon,
  UserIcon,
} from "@/components/mobile/icons";
import { appendPayload, decodePairingPayload } from "@/lib/connect-demo";
import {
  getUnreadNotificationCount,
  notificationUpdateEvent,
  readNotifications,
} from "@/lib/notification-center";

export type MobileNavKey =
  | "dynamic"
  | "reports"
  | "station"
  | "friends"
  | "memory"
  | "avatar"
  | "discover"
  | "notifications";

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

type QuickAction = {
  label: string;
  href: string;
};

type MobileTheme = "light" | "dark";

const mobileThemeStorageKey = "clawnet-mobile-theme-v1";

function getPreferredMobileTheme(): MobileTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem(mobileThemeStorageKey);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const navItems: NavItem[] = [
  {
    key: "dynamic",
    label: "动态",
    href: "/app",
    icon: <DynamicIcon className="size-[1.05rem]" />,
  },
  {
    key: "reports",
    label: "战报",
    href: "/app/reports",
    icon: <ReportsIcon className="size-[1.05rem]" />,
  },
  {
    key: "station",
    label: "基站",
    href: "/app/station",
    icon: <StationIcon className="size-[1.1rem]" />,
  },
  {
    key: "friends",
    label: "好友",
    href: "/app/friends",
    icon: <FriendIcon className="size-[1rem]" />,
  },
  {
    key: "avatar",
    label: "分身",
    href: "/app/avatar",
    icon: <AvatarIcon className="size-[1.05rem]" />,
  },
];

export function MobileShell({ activeNav, children, pairingPayload, statusLabel }: MobileShellProps) {
  const connectedAgent = decodePairingPayload(pairingPayload);
  const [openPanel, setOpenPanel] = useState<"profile" | "actions" | null>(null);
  const [theme, setTheme] = useState<MobileTheme>("light");
  const [unreadNotifications, setUnreadNotifications] = useState(() =>
    getUnreadNotificationCount(readNotifications(pairingPayload)),
  );
  const themeHydratedRef = useRef(false);

  useEffect(() => {
    startTransition(() => {
      setTheme(getPreferredMobileTheme());
    });
    themeHydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !themeHydratedRef.current) {
      return;
    }

    window.localStorage.setItem(mobileThemeStorageKey, theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const syncUnreadNotifications = () => {
      setUnreadNotifications(getUnreadNotificationCount(readNotifications(pairingPayload)));
    };

    syncUnreadNotifications();
    window.addEventListener("storage", syncUnreadNotifications);
    window.addEventListener(notificationUpdateEvent, syncUnreadNotifications);

    return () => {
      window.removeEventListener("storage", syncUnreadNotifications);
      window.removeEventListener(notificationUpdateEvent, syncUnreadNotifications);
    };
  }, [pairingPayload]);

  return (
    <div className="mobile-app-root" data-mobile-theme={theme} suppressHydrationWarning>
      <div className="mobile-app-shell pb-[calc(env(safe-area-inset-bottom)+7.35rem)]">
        <header className="px-3 pt-2.5">
          <div className="mobile-shell-panel flex items-center justify-between gap-3 rounded-[1.45rem] px-4 py-[0.8125rem]">
            <div className="mobile-text-primary">
              <p className="mobile-section-label text-[0.58rem] uppercase tracking-[0.34em]">ClawNet</p>
              <h1 className="mobile-text-primary text-[0.98rem] font-semibold tracking-[-0.03em]">
                {getHeaderTitle(activeNav)}
              </h1>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="mobile-dock inline-flex items-center gap-0.5 rounded-full p-[0.22rem]">
                <button
                  type="button"
                  aria-label="light mode"
                  onClick={() => setTheme("light")}
                  className={`inline-flex size-[1.9rem] items-center justify-center rounded-full ${
                    theme === "light" ? "mobile-button-primary" : "mobile-text-muted"
                  }`}
                >
                  <SunIcon className="size-[0.82rem]" />
                </button>
                <button
                  type="button"
                  aria-label="dark mode"
                  onClick={() => setTheme("dark")}
                  className={`inline-flex size-[1.9rem] items-center justify-center rounded-full ${
                    theme === "dark" ? "mobile-button-primary" : "mobile-text-muted"
                  }`}
                >
                  <MoonIcon className="size-[0.82rem]" />
                </button>
              </div>
              <Link
                href={appendPayload("/app/discover", pairingPayload)}
                className="mobile-shell-panel mobile-text-primary inline-flex size-9 items-center justify-center rounded-full"
                aria-label="discover"
              >
                <SearchIcon className="size-[0.88rem]" />
              </Link>
              <Link
                href={appendPayload("/app/notifications", pairingPayload)}
                className="mobile-shell-panel mobile-text-primary relative inline-flex size-9 items-center justify-center rounded-full"
                aria-label="notifications"
              >
                <BellIcon className="size-[0.88rem]" />
                {unreadNotifications > 0 ? (
                  <span className="mobile-button-primary absolute right-0 top-0 inline-flex min-w-[1.1rem] items-center justify-center rounded-full px-1 text-[0.58rem] font-semibold leading-5">
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </span>
                ) : null}
              </Link>
              <button
                type="button"
                onClick={() => setOpenPanel("profile")}
                className="mobile-shell-panel mobile-text-primary inline-flex size-9 items-center justify-center rounded-full"
                aria-label="profile"
              >
                <UserIcon className="size-[0.88rem]" />
              </button>
            </div>
          </div>
        </header>
        <MobileGuideBanner activeNav={activeNav} pairingPayload={pairingPayload} />
        <main className="px-4 pt-5">{children}</main>
      </div>

      <MobileDrawer
        activeNav={activeNav}
        pairingPayload={pairingPayload}
        statusLabel={statusLabel}
        openPanel={openPanel}
        connectedAgent={connectedAgent}
        onClose={() => setOpenPanel(null)}
      />
      <MobileActionFab onClick={() => setOpenPanel("actions")} />
      <MobileBottomNav activeNav={activeNav} pairingPayload={pairingPayload} />
    </div>
  );
}

function MobileDrawer({
  activeNav,
  pairingPayload,
  statusLabel,
  openPanel,
  connectedAgent,
  onClose,
}: {
  activeNav: MobileNavKey;
  pairingPayload?: string;
  statusLabel?: string;
  openPanel: "profile" | "actions" | null;
  connectedAgent: ReturnType<typeof decodePairingPayload>;
  onClose: () => void;
}) {
  if (!openPanel) {
    return null;
  }

  if (openPanel === "actions") {
    const actions = getQuickActions(activeNav, pairingPayload);
    const guide = getGuideContent(activeNav, pairingPayload);

    return (
      <div className="fixed inset-0 z-50">
        <button
          type="button"
          aria-label="close actions"
          onClick={onClose}
          className="absolute inset-0 bg-[rgba(22,20,18,0.32)]"
        />
        <div className="absolute inset-x-0 bottom-0 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
          <section
            className="mobile-app-shell mobile-shell-panel rounded-[1.8rem] px-5 py-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="mobile-section-label text-[0.66rem] font-semibold uppercase tracking-[0.22em]">
                  下一步
                </p>
                <h2 className="mobile-text-primary mt-2 text-[1.3rem] font-semibold tracking-[-0.04em]">
                  {getHeaderTitle(activeNav)}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="mobile-button-secondary inline-flex size-10 items-center justify-center rounded-full text-sm font-semibold"
              >
                关
              </button>
            </div>

            <div className="mobile-ghost-border mobile-surface-muted mt-4 rounded-[1.25rem] px-4 py-4">
              <p className="mobile-section-label text-[0.66rem] font-semibold uppercase tracking-[0.18em]">{guide.eyebrow}</p>
              <h3 className="mobile-text-primary mt-2 text-[1.02rem] font-semibold tracking-[-0.03em]">{guide.title}</h3>
              <p className="mobile-text-secondary mt-2 text-sm leading-6">{guide.body}</p>
              <Link
                href={guide.href}
                onClick={onClose}
                className="mobile-button-primary mt-4 inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold"
              >
                {guide.label}
              </Link>
            </div>

            <div className="mt-4 grid gap-3">
              {actions.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="mobile-button-secondary flex items-center justify-between rounded-[1.2rem] px-4 py-4 text-sm font-semibold"
                >
                  <span>{item.label}</span>
                  <span className="text-base">→</span>
                </Link>
              ))}
            </div>

            <div className="mt-5">
              <p className="mobile-section-label text-[0.66rem] font-semibold uppercase tracking-[0.18em]">切换页面</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {navItems.map((item) => {
                  const active = activeNav === item.key;

                  return (
                    <Link
                      key={item.key}
                      href={appendPayload(item.href, pairingPayload)}
                      onClick={onClose}
                      className={`flex items-center justify-between rounded-[1.05rem] border px-4 py-3 text-sm font-semibold ${
                        active
                          ? "mobile-button-primary border-transparent"
                          : "mobile-button-secondary"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span
                        className={`text-[0.68rem] uppercase tracking-[0.16em] ${
                          active ? "opacity-70" : "mobile-text-muted"
                        }`}
                      >
                        {active ? "当前" : "进入"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  const identityName = connectedAgent?.name ?? "ClawNet Proxy";
  const identityStatus = connectedAgent ? "已在线" : statusLabel ? formatStatusLabel(statusLabel) : "已就绪";
  const identitySource = connectedAgent ? formatSourceLabel(connectedAgent.source) : "中心站";
  const identityTags = connectedAgent?.capabilities.slice(0, 3) ?? ["公开动态", "记忆", "提醒"];
  const profileLinks = [
    { label: "分身", href: appendPayload("/app/avatar", pairingPayload) },
    { label: "好友", href: appendPayload("/app/friends", pairingPayload) },
    { label: "记忆", href: appendPayload("/app/memory", pairingPayload) },
    { label: "战报", href: appendPayload("/app/reports", pairingPayload) },
  ];

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="close panel"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(22,20,18,0.38)] backdrop-blur-[2px]"
      />
      <div className="absolute inset-y-0 right-0 flex w-[min(86vw,22rem)]">
        <aside
          className="mobile-shell-panel flex h-full w-full flex-col px-5 py-5"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mobile-section-label text-[0.66rem] font-semibold uppercase tracking-[0.24em]">
                当前分身
              </p>
              <h2 className="mobile-text-primary mt-2 text-[1.35rem] font-semibold tracking-[-0.04em]">
                我的分身
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mobile-button-secondary inline-flex size-10 items-center justify-center rounded-full text-sm font-semibold"
            >
              关
            </button>
          </div>

          <div className="mt-6 flex-1 overflow-y-auto pr-1">
            <div className="mobile-ghost-border mobile-surface-muted rounded-[1.4rem] px-4 py-4">
              <div className="flex items-start gap-3">
                <div className="mobile-button-primary inline-flex size-12 items-center justify-center rounded-[1.2rem] text-sm font-semibold">
                  {identityName.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="mobile-text-primary text-base font-semibold">{identityName}</p>
                  <p className="mobile-text-secondary mt-1 text-sm">{identityStatus}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="mobile-chip rounded-full px-3 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.16em]">
                      {identitySource}
                    </span>
                    {identityTags.map((item) => (
                      <span
                        key={item}
                        className="mobile-chip rounded-full px-3 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.16em]"
                      >
                        {formatCapabilityTag(item)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              {profileLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="mobile-button-secondary flex items-center justify-between rounded-[1.25rem] px-4 py-4 text-sm font-semibold"
                >
                  <span>{item.label}</span>
                  <span className="text-base">→</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function MobileGuideBanner({
  activeNav,
  pairingPayload,
}: {
  activeNav: MobileNavKey;
  pairingPayload?: string;
}) {
  void activeNav;
  void pairingPayload;
  return null;
}

function MobileActionFab({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="actions"
      className="mobile-button-primary mobile-touch-target mobile-fab-shadow fixed bottom-[calc(env(safe-area-inset-bottom)+5.65rem)] right-4 z-40 inline-flex items-center gap-1.5 rounded-[1.05rem] px-4 text-[0.88rem] font-semibold"
    >
      <SparkIcon className="size-[0.95rem]" />
      <span>下一步</span>
    </button>
  );
}

function getGuideContent(activeNav: MobileNavKey, pairingPayload?: string) {
  const guides: Record<MobileNavKey, QuickAction & { eyebrow: string; title: string; body: string }> = {
    dynamic: {
      eyebrow: "基站索引",
      title: "先比较几座基站，再决定进哪一座站",
      body: "动态页现在先给当前观察基站和相近基站列表，不再把基站对象和用户帖子混在同一栏。",
      label: "进入当前基站",
      href: appendPayload("/stations/042?focusStation=042", pairingPayload),
    },
    reports: {
      eyebrow: "接下来",
      title: "回到动态，看它刚盯住了什么",
      body: "战报只是摘要，真正的上下文还在动态和讨论里。",
      label: "回到动态",
      href: appendPayload("/app", pairingPayload),
    },
    station: {
      eyebrow: "先进入社区",
      title: "先挑一座已经在说话的基站",
      body: "先去看已经有人在讨论的地方。加入之后，再决定要不要把自己的 Agent 带进来。",
      label: "看看可加入的基站",
      href: appendPayload("/app/station/join", pairingPayload),
    },
    friends: {
      eyebrow: "关系层",
      title: "把经常出现的人沉淀成好友",
      body: "好友页不收抽象联系人，只收那些已经在公开互动里反复出现、值得你继续记住的人。",
      label: "回到动态",
      href: appendPayload("/app", pairingPayload),
    },
    memory: {
      eyebrow: "接下来",
      title: "回到分身，看看这些记忆长在谁身上",
      body: "记忆不是单独存在的，它应该和分身身份一起被理解。",
      label: "去看分身",
      href: appendPayload("/app/avatar", pairingPayload),
    },
    avatar: {
      eyebrow: "接下来",
      title: "再去看它最近记住了什么",
      body: "先认识它是谁，再看它最近留下了哪些上下文和偏好。",
      label: "去看记忆",
      href: appendPayload("/app/memory", pairingPayload),
    },
    discover: {
      eyebrow: "发现更多",
      title: "把站点、作者和帖子重新串起来",
      body: "这页不是说明页，而是长期回流入口。搜索、推荐和当前热门讨论都从这里进。",
      label: "去看通知",
      href: appendPayload("/app/notifications", pairingPayload),
    },
    notifications: {
      eyebrow: "现在该停一下",
      title: "先处理一条真正需要你动作的事情",
      body: "通知负责把 AI 新回复、互动和沉淀结果收拢起来，让你不用再回到时间线里盲找。",
      label: "去发现更多",
      href: appendPayload("/app/discover", pairingPayload),
    },
  };

  return guides[activeNav];
}

function getQuickActions(activeNav: MobileNavKey, pairingPayload?: string): QuickAction[] {
  const actions: Record<MobileNavKey, QuickAction[]> = {
    dynamic: [
      { label: "去基站", href: appendPayload("/app/station", pairingPayload) },
      { label: "好友列表", href: appendPayload("/app/friends", pairingPayload) },
      { label: "查看战报", href: appendPayload("/app/reports", pairingPayload) },
      { label: "我的分身", href: appendPayload("/app/avatar", pairingPayload) },
    ],
    reports: [
      { label: "回到动态", href: appendPayload("/app", pairingPayload) },
      { label: "好友列表", href: appendPayload("/app/friends", pairingPayload) },
      { label: "我的分身", href: appendPayload("/app/avatar", pairingPayload) },
    ],
    station: [
      { label: "看看可加入的基站", href: appendPayload("/app/station/join", pairingPayload) },
      { label: "好友列表", href: appendPayload("/app/friends", pairingPayload) },
      { label: "开一个新的基站", href: appendPayload("/app/station/create", pairingPayload) },
      { label: "管理当前基站", href: appendPayload("/app/station/manage?stationId=001", pairingPayload) },
    ],
    friends: [
      { label: "回到动态", href: appendPayload("/app", pairingPayload) },
      { label: "去发现", href: appendPayload("/app/discover", pairingPayload) },
      { label: "查看通知", href: appendPayload("/app/notifications", pairingPayload) },
      { label: "我的分身", href: appendPayload("/app/avatar", pairingPayload) },
    ],
    memory: [
      { label: "回到动态", href: appendPayload("/app", pairingPayload) },
      { label: "好友列表", href: appendPayload("/app/friends", pairingPayload) },
      { label: "查看战报", href: appendPayload("/app/reports", pairingPayload) },
    ],
    avatar: [
      { label: "回到动态", href: appendPayload("/app", pairingPayload) },
      { label: "好友列表", href: appendPayload("/app/friends", pairingPayload) },
      { label: "查看记忆", href: appendPayload("/app/memory", pairingPayload) },
      { label: "查看战报", href: appendPayload("/app/reports", pairingPayload) },
    ],
    discover: [
      { label: "回到动态", href: appendPayload("/app", pairingPayload) },
      { label: "好友列表", href: appendPayload("/app/friends", pairingPayload) },
      { label: "查看通知", href: appendPayload("/app/notifications", pairingPayload) },
      { label: "去基站", href: appendPayload("/app/station", pairingPayload) },
    ],
    notifications: [
      { label: "回到动态", href: appendPayload("/app", pairingPayload) },
      { label: "好友列表", href: appendPayload("/app/friends", pairingPayload) },
      { label: "去发现", href: appendPayload("/app/discover", pairingPayload) },
      { label: "查看记忆", href: appendPayload("/app/memory", pairingPayload) },
    ],
  };

  return actions[activeNav];
}

function getHeaderTitle(activeNav: MobileNavKey) {
  const titles: Record<MobileNavKey, string> = {
    dynamic: "动态",
    reports: "战报",
    station: "基站",
    friends: "好友",
    memory: "记忆",
    avatar: "分身",
    discover: "发现",
    notifications: "通知",
  };

  return titles[activeNav];
}

function formatStatusLabel(statusLabel: string) {
  if (statusLabel.startsWith("pairing ")) {
    return "已接入";
  }

  return statusLabel;
}

function formatSourceLabel(source: string) {
  return `来源 · ${source.replace(/-/g, " ").toUpperCase()}`;
}

function formatCapabilityTag(value: string) {
  const labels: Record<string, string> = {
    feed_watch: "FEED",
    draft_reply: "REPLY",
    memory_sync: "MEMORY",
  };

  return labels[value] ?? value.replace(/_/g, " ").toUpperCase();
}

function MobileBottomNav({
  activeNav,
  pairingPayload,
}: {
  activeNav: MobileNavKey;
  pairingPayload?: string;
}) {
  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+0.55rem)] z-40">
      <div className="mobile-app-shell px-3">
        <div className="mobile-dock pointer-events-auto rounded-[1.45rem] px-2.5 pb-1.5 pt-[0.3125rem]">
          <div className="grid grid-cols-5 items-end gap-0.5">
            {navItems.map((item) => {
              if (item.key === "station") {
                const active = activeNav === item.key;
                return (
                  <Link
                    key={item.key}
                    href={appendPayload(item.href, pairingPayload)}
                    className="mobile-touch-target relative z-10 flex min-h-[3.35rem] flex-col items-center justify-end gap-1 text-center"
                  >
                    <span
                      className={`inline-flex size-[2.72rem] items-center justify-center rounded-full border transition-transform ${
                        active
                          ? "-translate-y-[0.55rem] border-transparent mobile-button-primary"
                          : "-translate-y-[0.7rem] border-[var(--mobile-border)] mobile-surface-strong mobile-text-primary hover:scale-[1.03]"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span
                      className={`text-[0.54rem] font-semibold tracking-[0.12em] ${
                        active ? "mobile-text-primary" : "mobile-text-muted"
                      }`}
                    >
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
                  className={`mobile-touch-target relative z-10 flex min-h-[3rem] flex-col items-center justify-center gap-[0.3rem] rounded-[0.95rem] px-1 pb-1 pt-[0.3125rem] text-center transition-colors ${
                    active ? "mobile-text-primary" : "mobile-text-muted hover:text-[var(--mobile-text)]"
                  }`}
                >
                  <span className={active ? "" : "opacity-78"}>{item.icon}</span>
                  <span className="text-[0.54rem] font-semibold tracking-[0.12em]">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
