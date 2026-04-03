"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { SearchIcon, BellIcon } from "@/components/mobile/icons";
import { feedPosts, stationCards, type StationCard } from "@/components/mobile/mock-data";
import { appendPayload } from "@/lib/connect-demo";
import {
  getUnreadNotificationCount,
  readNotifications,
  type NotificationRecord,
  writeNotifications,
} from "@/lib/notification-center";
import {
  buildAuthorHref,
  buildPersonHrefByName,
  buildStationHrefByName,
  getStationVisibility,
  type PublicPersonProfile,
} from "@/lib/public-links";

export function DiscoverScreen({ payload }: { payload?: string }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const filteredStations = useMemo(() => {
    if (!normalizedQuery) {
      return stationCards;
    }

    return stationCards.filter((station) =>
      [station.name, station.summary, station.location, ...station.tags].join(" ").toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery]);

  const filteredPosts = useMemo(() => {
    if (!normalizedQuery) {
      return feedPosts;
    }

    return feedPosts.filter((post) =>
      [post.author, post.title, post.body, post.station].join(" ").toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery]);

  return (
    <section className="space-y-5 pb-4">
      <div>
        <p className="mobile-section-label text-[0.62rem] font-semibold uppercase tracking-[0.22em]">Discover</p>
        <h2 className="mobile-text-primary mt-2.5 text-[2rem] font-semibold tracking-[-0.07em]">发现</h2>
        <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">
          这页负责把“继续逛什么”说清楚。它不再只是排好的预览路线，而是给你一个能长期回流的发现入口。
        </p>
      </div>

      <label className="mobile-soft-card mobile-ghost-border flex items-center gap-3 rounded-[1.2rem] px-4 py-3">
        <SearchIcon className="mobile-text-muted size-[1rem]" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="mobile-text-primary w-full bg-transparent text-[0.9rem] outline-none placeholder:text-[var(--mobile-text-muted)]"
          placeholder="搜索作者、基站、帖子标题..."
        />
      </label>

      <article className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
        <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">今天值得先看</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["公开讨论筛选", "基站治理", "城市影像", "同城路线"].map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => setQuery(topic)}
              className="mobile-button-secondary rounded-full px-3 py-2 text-[0.72rem] font-semibold"
            >
              {topic}
            </button>
          ))}
        </div>
      </article>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="mobile-text-primary text-[0.92rem] font-semibold">推荐基站</p>
          <span className="mobile-text-muted text-[0.72rem]">{filteredStations.length} 个结果</span>
        </div>
        {filteredStations.slice(0, 3).map((station) => (
          <Link
            key={station.id}
            href={buildStationHrefByName(station.name)}
            className="mobile-soft-card mobile-ghost-border block rounded-[1.2rem] px-4 py-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="mobile-text-primary text-[0.96rem] font-semibold">{station.name}</h3>
                <p className="mobile-text-secondary mt-2 text-[0.84rem] leading-6">{station.summary}</p>
              </div>
              <span className="mobile-chip rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.14em]">
                {getStationVisibility(station)}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {station.tags.map((tag) => (
                <span
                  key={`${station.id}-${tag}`}
                  className="mobile-chip rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.16em]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="mobile-text-primary text-[0.92rem] font-semibold">正在升温的讨论</p>
          <span className="mobile-text-muted text-[0.72rem]">{filteredPosts.length} 条结果</span>
        </div>
        {filteredPosts.slice(0, 4).map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className="mobile-soft-card mobile-ghost-border block rounded-[1.2rem] px-4 py-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="mobile-text-primary text-[0.96rem] font-semibold">{post.title}</h3>
                <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">{post.body}</p>
              </div>
              <span className="mobile-text-muted shrink-0 text-[0.66rem] uppercase tracking-[0.14em]">{post.publishedAt}</span>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 text-[0.76rem]">
              <span className="mobile-text-secondary">{post.author} · {post.station}</span>
              <span className="mobile-text-primary font-semibold">进入讨论 →</span>
            </div>
          </Link>
        ))}
      </section>

      <div className="grid grid-cols-2 gap-3">
        <Link
          href={appendPayload("/app/notifications", payload)}
          className="mobile-button-secondary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.82rem] font-semibold"
        >
          去通知
        </Link>
        <Link
          href={appendPayload("/app", payload)}
          className="mobile-button-primary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.82rem] font-semibold"
        >
          回到动态
        </Link>
      </div>
    </section>
  );
}

export function NotificationsScreen({ payload }: { payload?: string }) {
  const [notifications, setNotifications] = useState<NotificationRecord[]>(() => readNotifications(payload));
  const [filter, setFilter] = useState<"all" | "unread" | "actionable">("all");

  useEffect(() => {
    setNotifications(readNotifications(payload));
  }, [payload]);

  useEffect(() => {
    writeNotifications(notifications);
  }, [notifications]);

  const unreadCount = getUnreadNotificationCount(notifications);
  const actionableCount = notifications.filter((item) => ["pending", "task", "discussion"].includes(item.group)).length;
  const visibleNotifications =
    filter === "all"
      ? notifications
      : filter === "unread"
        ? notifications.filter((item) => !item.read)
        : notifications.filter((item) => ["pending", "task", "discussion"].includes(item.group));

  function markNotificationAsRead(id: string) {
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  }

  function markAllAsRead() {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  }

  return (
    <section className="space-y-5 pb-4">
      <div>
        <div className="flex items-center gap-2">
          <BellIcon className="mobile-text-primary size-[1rem]" />
          <p className="mobile-section-label text-[0.62rem] font-semibold uppercase tracking-[0.22em]">Notifications</p>
        </div>
        <h2 className="mobile-text-primary mt-2.5 text-[2rem] font-semibold tracking-[-0.07em]">通知</h2>
        <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">
          这里负责把“现在该你停一下”的动作集中起来。没有这层，产品只剩浏览，不像真实在使用。
        </p>
      </div>

      <article className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
        <div className="grid grid-cols-3 gap-3">
          <NotificationStat label="未读" value={`${unreadCount}`} />
          <NotificationStat label="待处理" value={`${actionableCount}`} />
          <NotificationStat label="全部" value={`${notifications.length}`} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-full px-3 py-2 text-[0.72rem] font-semibold ${
              filter === "all" ? "mobile-button-primary" : "mobile-button-secondary"
            }`}
          >
            全部通知
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`rounded-full px-3 py-2 text-[0.72rem] font-semibold ${
              filter === "unread" ? "mobile-button-primary" : "mobile-button-secondary"
            }`}
          >
            只看未读
          </button>
          <button
            type="button"
            onClick={() => setFilter("actionable")}
            className={`rounded-full px-3 py-2 text-[0.72rem] font-semibold ${
              filter === "actionable" ? "mobile-button-primary" : "mobile-button-secondary"
            }`}
          >
            只看待处理
          </button>
        </div>
        <button
          type="button"
          onClick={markAllAsRead}
          className="mobile-button-secondary mt-4 inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.8rem] font-semibold"
        >
          全部标为已读
        </button>
      </article>

      {visibleNotifications.map((item) => (
        <article key={item.id} className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mobile-chip rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.14em]">
                {item.label}
              </span>
              {!item.read ? (
                <span className="mobile-chip-accent rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.14em]">
                  未读
                </span>
              ) : null}
            </div>
            <span className="mobile-text-muted text-[0.68rem] uppercase tracking-[0.14em]">{item.time}</span>
          </div>
          <h3 className="mobile-text-primary mt-4 text-[0.96rem] font-semibold">{item.title}</h3>
          <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">{item.body}</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link
              href={item.href}
              onClick={() => markNotificationAsRead(item.id)}
              className="mobile-button-primary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.8rem] font-semibold"
            >
              {item.cta}
            </Link>
            <button
              type="button"
              onClick={() => markNotificationAsRead(item.id)}
              className="mobile-button-secondary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.8rem] font-semibold"
            >
              {item.read ? "已读" : "标为已读"}
            </button>
          </div>
        </article>
      ))}

      {visibleNotifications.length === 0 ? (
        <article className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
          <p className="mobile-text-primary text-[0.92rem] font-semibold">这一栏已经清空</p>
          <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">
            当前筛选条件下没有新的通知。你可以回到发现页继续逛，或者等新的待确认动作再回来。
          </p>
        </article>
      ) : null}

      <Link
        href={appendPayload("/app/discover", payload)}
        className="mobile-button-secondary inline-flex w-full items-center justify-center rounded-[1rem] px-4 py-3 text-[0.82rem] font-semibold"
      >
        去发现更多
      </Link>
    </section>
  );
}

function NotificationStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="mobile-ghost-border mobile-surface-muted rounded-[1rem] px-3 py-3">
      <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">{label}</p>
      <p className="mobile-text-primary mt-2 text-[0.98rem] font-semibold">{value}</p>
    </div>
  );
}

export function StationDetailScreen({
  station,
  payload,
}: {
  station: StationCard;
  payload?: string;
}) {
  const recentPosts = feedPosts.filter((post) => post.station === station.name);

  return (
    <div className="mobile-app-root min-h-screen">
      <div className="mx-auto max-w-[28rem] px-4 py-4">
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.22em]">Station</p>
            <p className="mobile-text-primary mt-1 text-[0.82rem] font-semibold">基站详情</p>
          </div>
          <div className="flex gap-2">
            {station.joined ? (
              <Link
                href={appendPayload(`/app/station/manage?stationId=${station.id}`, payload)}
                className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-3 py-2 text-[0.72rem] font-semibold"
              >
                站务
              </Link>
            ) : null}
            <Link
              href={payload ? appendPayload("/app/station", payload) : "/network"}
              className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-3 py-2 text-[0.72rem] font-semibold"
            >
              返回
            </Link>
            <Link
              href={payload ? appendPayload("/app/station/join", payload) : "/preview"}
              className="mobile-button-primary inline-flex items-center justify-center rounded-full px-3 py-2 text-[0.72rem] font-semibold"
            >
              {station.joined ? "回到这里" : "加入"}
            </Link>
          </div>
        </header>

        <section className="mt-5 mobile-soft-card mobile-ghost-border rounded-[1.4rem] px-4 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="mobile-button-secondary inline-flex size-14 items-center justify-center rounded-[1rem] text-[1rem] font-semibold">
              {station.name.slice(0, 1)}
            </div>
            <span className="mobile-chip-accent rounded-full px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em]">
              {getStationVisibility(station)}
            </span>
          </div>
          <h1 className="mobile-text-primary mt-4 text-[1.7rem] font-semibold tracking-[-0.06em]">{station.name}</h1>
          <p className="mobile-text-secondary mt-3 text-[0.86rem] leading-7">{station.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {station.tags.map((tag) => (
              <span
                key={`${station.id}-${tag}`}
                className="mobile-chip rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.16em]"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-4 mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
          <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">站长与边界</p>
          <Link href={buildPersonHrefByName(station.hostName)} className="mt-3 flex items-center justify-between gap-3">
            <div>
              <p className="mobile-text-primary text-[0.92rem] font-semibold">{station.hostName}</p>
              <p className="mobile-text-secondary mt-1 text-[0.8rem]">{station.hostRole} · {station.location}</p>
            </div>
            <span className="mobile-text-primary text-[0.78rem] font-semibold">查看作者 →</span>
          </Link>
          <p className="mobile-text-secondary mt-4 text-[0.84rem] leading-6">
            当前成员规模 {station.memberCount}。最近活动：{station.activity}。
          </p>
        </section>

        <section className="mt-4 space-y-3">
          <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">正在发生</p>
          {recentPosts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="mobile-soft-card mobile-ghost-border block rounded-[1.2rem] px-4 py-4"
            >
              <h3 className="mobile-text-primary text-[0.96rem] font-semibold">{post.title}</h3>
              <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">{post.body}</p>
              <div className="mt-4 flex items-center justify-between gap-3 text-[0.76rem]">
                <span className="mobile-text-secondary">{post.author} · {post.comments} 条讨论</span>
                <span className="mobile-text-primary font-semibold">进入帖子 →</span>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}

export function PublicPersonScreen({
  profile,
  payload,
}: {
  profile: PublicPersonProfile;
  payload?: string;
}) {
  const recentPosts = feedPosts.filter(
    (post) => post.author === profile.name || post.previewReply?.author === profile.name,
  );

  return (
    <div className="mobile-app-root min-h-screen">
      <div className="mx-auto max-w-[28rem] px-4 py-4">
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.22em]">Public Profile</p>
            <p className="mobile-text-primary mt-1 text-[0.82rem] font-semibold">作者详情</p>
          </div>
          <div className="flex gap-2">
            <Link
              href={payload ? appendPayload("/app/discover", payload) : "/preview"}
              className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-3 py-2 text-[0.72rem] font-semibold"
            >
              返回
            </Link>
            {profile.homeStation ? (
              <Link
                href={buildStationHrefByName(profile.homeStation)}
                className="mobile-button-primary inline-flex items-center justify-center rounded-full px-3 py-2 text-[0.72rem] font-semibold"
              >
                看基站
              </Link>
            ) : null}
          </div>
        </header>

        <section className="mt-5 mobile-soft-card mobile-ghost-border rounded-[1.4rem] px-4 py-4">
          <div className="mobile-button-secondary inline-flex size-16 items-center justify-center rounded-[1rem] text-[1rem] font-semibold">
            {profile.name.slice(0, 2)}
          </div>
          <h1 className="mobile-text-primary mt-4 text-[1.7rem] font-semibold tracking-[-0.06em]">{profile.name}</h1>
          <p className="mobile-text-secondary mt-1 text-[0.82rem]">{profile.handle}</p>
          <p className="mobile-text-secondary mt-4 text-[0.86rem] leading-7">{profile.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.traits.map((trait) => (
              <span
                key={`${profile.id}-${trait}`}
                className="mobile-chip rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.16em]"
              >
                {trait}
              </span>
            ))}
          </div>
        </section>

        {profile.homeStation ? (
          <section className="mt-4 mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
            <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">当前归属</p>
            <Link
              href={buildStationHrefByName(profile.homeStation)}
              className="mt-3 flex items-center justify-between gap-3"
            >
              <div>
                <p className="mobile-text-primary text-[0.92rem] font-semibold">{profile.homeStation}</p>
                <p className="mobile-text-secondary mt-1 text-[0.8rem]">查看这位作者主要参与的公开场</p>
              </div>
              <span className="mobile-text-primary text-[0.78rem] font-semibold">进入 →</span>
            </Link>
          </section>
        ) : null}

        <section className="mt-4 space-y-3 pb-4">
          <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">最近留下的内容</p>
          {recentPosts.length > 0 ? (
            recentPosts.map((post) => (
              <article key={post.id} className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="mobile-text-primary text-[0.96rem] font-semibold">{post.title}</h3>
                    <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">{post.body}</p>
                  </div>
                  <span className="mobile-text-muted shrink-0 text-[0.66rem] uppercase tracking-[0.14em]">{post.publishedAt}</span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <Link href={`/posts/${post.id}`} className="mobile-text-primary text-[0.78rem] font-semibold">
                    进入帖子 →
                  </Link>
                  <Link
                    href={buildAuthorHref({
                      author: post.author,
                      role: post.role,
                      handle: post.handle,
                      stationName: post.station,
                    })}
                    className="mobile-text-muted text-[0.72rem]"
                  >
                    原作者页
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <article className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-6">
              <p className="mobile-text-secondary text-[0.84rem] leading-6">
                当前还没有为这个作者补足更多公开帖子，只保留最小资料页和归属链路。
              </p>
            </article>
          )}
        </section>
      </div>
    </div>
  );
}

export function StationGovernanceScreen({
  station,
  payload,
}: {
  station: StationCard;
  payload?: string;
}) {
  const [joinRequests, setJoinRequests] = useState([
    {
      id: "req-1",
      name: "陈野",
      reason: "想长期参与旧城影像征集，也愿意帮忙整理每周精选。",
      status: "pending" as "pending" | "approved" | "rejected",
    },
    {
      id: "req-2",
      name: "Mira",
      reason: "希望把实验社区治理的经验带进来，对比两座基站的规则差异。",
      status: "pending" as "pending" | "approved" | "rejected",
    },
  ]);
  const [moderationQueue, setModerationQueue] = useState([
    {
      id: "mod-1",
      title: "重复灌水回复",
      body: "这条内容没有推进讨论，只是在重复贴无上下文截图。",
      status: "pending" as "pending" | "folded" | "removed",
    },
    {
      id: "mod-2",
      title: "越界推销",
      body: "它已经偏离当前征集主题，开始导流外部群和无关商品。",
      status: "pending" as "pending" | "folded" | "removed",
    },
  ]);
  const [inviteKeys, setInviteKeys] = useState([
    { id: "key-1", code: "UTOPIA-042", scope: "长期观察者", status: "active" as "active" | "revoked" },
    { id: "key-2", code: "ARCHIVE-NIGHT", scope: "本周影像征集", status: "active" as "active" | "revoked" },
  ]);
  const [members, setMembers] = useState([
    { id: "member-1", name: "阿墨", role: "贡献者", state: "normal" as "normal" | "muted" | "removed" },
    { id: "member-2", name: "林野", role: "长期观察者", state: "normal" as "normal" | "muted" | "removed" },
  ]);
  const [latestAction, setLatestAction] = useState<string | null>(null);

  const pendingJoinCount = joinRequests.filter((item) => item.status === "pending").length;
  const pendingModerationCount = moderationQueue.filter((item) => item.status === "pending").length;
  const activeKeyCount = inviteKeys.filter((item) => item.status === "active").length;

  return (
    <section className="space-y-5 pb-4">
      <div>
        <p className="mobile-section-label text-[0.62rem] font-semibold uppercase tracking-[0.22em]">Station Admin</p>
        <h2 className="mobile-text-primary mt-2.5 text-[2rem] font-semibold tracking-[-0.07em]">站务治理</h2>
        <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">
          这页不是抽象权限说明，而是最小可操作站务面：审核谁能进来、折叠什么内容、怎么发密钥、以及成员出了问题怎么办。
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <MetricCard label="待审核加入" value={`${pendingJoinCount}`} />
        <MetricCard label="待处理帖子" value={`${pendingModerationCount}`} />
        <MetricCard label="有效密钥" value={`${activeKeyCount}`} />
      </div>

      {latestAction ? (
        <article className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
          <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">刚刚完成</p>
          <p className="mobile-text-primary mt-3 text-[0.9rem] font-semibold">{latestAction}</p>
        </article>
      ) : null}

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="mobile-text-primary text-[0.96rem] font-semibold">入站审核</p>
          <span className="mobile-text-muted text-[0.72rem]">{pendingJoinCount} 条待处理</span>
        </div>
        {joinRequests.map((item) => (
          <article key={item.id} className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <p className="mobile-text-primary text-[0.9rem] font-semibold">{item.name}</p>
              <span className="mobile-chip rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.16em]">
                {item.status === "pending" ? "待审核" : item.status === "approved" ? "已通过" : "已拒绝"}
              </span>
            </div>
            <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">{item.reason}</p>
            {item.status === "pending" ? (
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setJoinRequests((current) => current.map((entry) => (entry.id === item.id ? { ...entry, status: "approved" } : entry)));
                    setLatestAction(`${item.name} 已通过入站审核`);
                  }}
                  className="mobile-button-primary inline-flex flex-1 items-center justify-center rounded-[1rem] px-4 py-3 text-[0.78rem] font-semibold"
                >
                  通过
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setJoinRequests((current) => current.map((entry) => (entry.id === item.id ? { ...entry, status: "rejected" } : entry)));
                    setLatestAction(`${item.name} 已被拒绝加入`);
                  }}
                  className="mobile-button-secondary inline-flex flex-1 items-center justify-center rounded-[1rem] px-4 py-3 text-[0.78rem] font-semibold"
                >
                  拒绝
                </button>
              </div>
            ) : null}
          </article>
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="mobile-text-primary text-[0.96rem] font-semibold">帖子治理</p>
          <span className="mobile-text-muted text-[0.72rem]">{pendingModerationCount} 条待处理</span>
        </div>
        {moderationQueue.map((item) => (
          <article key={item.id} className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <p className="mobile-text-primary text-[0.9rem] font-semibold">{item.title}</p>
              <span className="mobile-chip rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.16em]">
                {item.status === "pending" ? "待处理" : item.status === "folded" ? "已折叠" : "已移除"}
              </span>
            </div>
            <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">{item.body}</p>
            {item.status === "pending" ? (
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setModerationQueue((current) => current.map((entry) => (entry.id === item.id ? { ...entry, status: "folded" } : entry)));
                    setLatestAction(`帖子“${item.title}”已折叠回围观层`);
                  }}
                  className="mobile-button-secondary inline-flex flex-1 items-center justify-center rounded-[1rem] px-4 py-3 text-[0.78rem] font-semibold"
                >
                  折叠
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModerationQueue((current) => current.map((entry) => (entry.id === item.id ? { ...entry, status: "removed" } : entry)));
                    setLatestAction(`帖子“${item.title}”已移出公开场`);
                  }}
                  className="mobile-button-primary inline-flex flex-1 items-center justify-center rounded-[1rem] px-4 py-3 text-[0.78rem] font-semibold"
                >
                  移除
                </button>
              </div>
            ) : null}
          </article>
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="mobile-text-primary text-[0.96rem] font-semibold">邀请密钥</p>
          <button
            type="button"
            onClick={() => {
              setInviteKeys((current) => [
                {
                  id: `key-${current.length + 1}`,
                  code: `${station.id.toUpperCase()}-${current.length + 3}A`,
                  scope: "临时体验名额",
                  status: "active",
                },
                ...current,
              ]);
              setLatestAction("已生成一枚新的临时邀请密钥");
            }}
            className="mobile-button-primary inline-flex items-center justify-center rounded-full px-3 py-2 text-[0.72rem] font-semibold"
          >
            新建密钥
          </button>
        </div>
        {inviteKeys.map((item) => (
          <article key={item.id} className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="mobile-text-primary text-[0.9rem] font-semibold">{item.code}</p>
                <p className="mobile-text-secondary mt-2 text-[0.82rem]">{item.scope}</p>
              </div>
              <span className="mobile-chip rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.16em]">
                {item.status === "active" ? "有效" : "已撤销"}
              </span>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setLatestAction(`密钥 ${item.code} 已复制`)}
                className="mobile-button-secondary inline-flex flex-1 items-center justify-center rounded-[1rem] px-4 py-3 text-[0.78rem] font-semibold"
              >
                复制
              </button>
              {item.status === "active" ? (
                <button
                  type="button"
                  onClick={() => {
                    setInviteKeys((current) => current.map((entry) => (entry.id === item.id ? { ...entry, status: "revoked" } : entry)));
                    setLatestAction(`密钥 ${item.code} 已撤销`);
                  }}
                  className="mobile-button-primary inline-flex flex-1 items-center justify-center rounded-[1rem] px-4 py-3 text-[0.78rem] font-semibold"
                >
                  撤销
                </button>
              ) : null}
            </div>
          </article>
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="mobile-text-primary text-[0.96rem] font-semibold">成员处理</p>
          <span className="mobile-text-muted text-[0.72rem]">最小站务动作</span>
        </div>
        {members.map((item) => (
          <article key={item.id} className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="mobile-text-primary text-[0.9rem] font-semibold">{item.name}</p>
                <p className="mobile-text-secondary mt-2 text-[0.82rem]">{item.role}</p>
              </div>
              <span className="mobile-chip rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.16em]">
                {item.state === "normal" ? "正常" : item.state === "muted" ? "已静音" : "已移出"}
              </span>
            </div>
            {item.state === "normal" ? (
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMembers((current) => current.map((entry) => (entry.id === item.id ? { ...entry, state: "muted" } : entry)));
                    setLatestAction(`${item.name} 已被静音 7 天`);
                  }}
                  className="mobile-button-secondary inline-flex flex-1 items-center justify-center rounded-[1rem] px-4 py-3 text-[0.78rem] font-semibold"
                >
                  静音 7 天
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMembers((current) => current.map((entry) => (entry.id === item.id ? { ...entry, state: "removed" } : entry)));
                    setLatestAction(`${item.name} 已被移出基站`);
                  }}
                  className="mobile-button-primary inline-flex flex-1 items-center justify-center rounded-[1rem] px-4 py-3 text-[0.78rem] font-semibold"
                >
                  移出
                </button>
              </div>
            ) : null}
          </article>
        ))}
      </section>

      <div className="grid grid-cols-2 gap-3">
        <Link
          href={appendPayload(`/stations/${station.id}`, payload)}
          className="mobile-button-secondary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.82rem] font-semibold"
        >
          看基站详情
        </Link>
        <Link
          href={appendPayload("/app/station", payload)}
          className="mobile-button-primary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.82rem] font-semibold"
        >
          回到基站
        </Link>
      </div>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="mobile-soft-card mobile-ghost-border rounded-[1.15rem] px-3 py-4 text-center">
      <p className="mobile-section-label text-[0.54rem] font-semibold uppercase tracking-[0.16em]">{label}</p>
      <p className="mobile-text-primary mt-2 text-[1rem] font-semibold">{value}</p>
    </article>
  );
}
