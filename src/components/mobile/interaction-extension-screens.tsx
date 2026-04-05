"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { FeedCard } from "@/components/mobile/cards";
import { SearchIcon, BellIcon } from "@/components/mobile/icons";
import {
  discussionThreads,
  feedPosts,
  friendRelationships,
  stationCards,
  type FriendRelationship,
  type StationCard,
} from "@/components/mobile/mock-data";
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
  getStationById,
  buildStationHrefByName,
  getStationVisibility,
  normalizePublicId,
  resolvePublicPersonProfile,
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
          从这里继续找人、找基站、找帖子，把刚刚看到的线索接着逛下去。
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

      <article className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
        <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">关系入口</p>
        <h3 className="mobile-text-primary mt-3 text-[0.96rem] font-semibold">最近熟起来的人</h3>
        <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">
          发现页不该只管帖子和基站，也该让你回看那些已经反复出现、值得继续认识的人。
        </p>
        <Link
          href={appendPayload("/app/friends", payload)}
          className="mobile-button-primary mt-4 inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.8rem] font-semibold"
        >
          打开好友页
        </Link>
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

const friendStorageKey = "clawnet-friends-v2";
const legacyFriendStorageKey = "clawnet-friends-v1";

type PersistedFriendState = {
  friendIds: string[];
  noteOverrides: Record<string, string>;
  stationFilter: string | null;
};

function readPersistedFriendState(defaultFriendIds: string[]): PersistedFriendState {
  if (typeof window === "undefined") {
    return {
      friendIds: defaultFriendIds,
      noteOverrides: {},
      stationFilter: null,
    };
  }

  const fallbackState: PersistedFriendState = {
    friendIds: defaultFriendIds,
    noteOverrides: {},
    stationFilter: null,
  };

  try {
    const raw = window.localStorage.getItem(friendStorageKey);

    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedFriendState>;

      return {
        friendIds: Array.isArray(parsed.friendIds) && parsed.friendIds.length > 0 ? parsed.friendIds : defaultFriendIds,
        noteOverrides: parsed.noteOverrides && typeof parsed.noteOverrides === "object" ? parsed.noteOverrides : {},
        stationFilter: typeof parsed.stationFilter === "string" && parsed.stationFilter.trim() ? parsed.stationFilter : null,
      };
    }
  } catch {
    return fallbackState;
  }

  try {
    const rawLegacy = window.localStorage.getItem(legacyFriendStorageKey);

    if (rawLegacy) {
      const parsedLegacy = JSON.parse(rawLegacy) as string[];

      if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
        return {
          ...fallbackState,
          friendIds: parsedLegacy,
        };
      }
    }
  } catch {
    return fallbackState;
  }

  return fallbackState;
}

export function FriendsScreen({
  payload,
  highlightId,
  autoAddId,
  sourceStationId,
}: {
  payload?: string;
  highlightId?: string;
  autoAddId?: string;
  sourceStationId?: string;
}) {
  const sourceStation = sourceStationId ? getStationById(sourceStationId) : null;
  const defaultFriendIds = useMemo(
    () => friendRelationships.filter((entry) => entry.relation === "friend").map((entry) => entry.id),
    [],
  );
  const initialRelationshipState = useMemo(() => {
    const persisted = readPersistedFriendState(defaultFriendIds);
    const initialIds = persisted.friendIds;
    const initialStationFilter = sourceStation?.name ?? persisted.stationFilter ?? "all";

    if (!autoAddId) {
      return {
        friendIds: initialIds,
        noteOverrides: persisted.noteOverrides,
        stationFilter: initialStationFilter,
        latestAction: null as string | null,
      };
    }

    const target = friendRelationships.find((entry) => entry.id === autoAddId);

    if (!target) {
      return {
        friendIds: initialIds,
        noteOverrides: persisted.noteOverrides,
        stationFilter: initialStationFilter,
        latestAction: null as string | null,
      };
    }

    if (initialIds.includes(autoAddId)) {
      return {
        friendIds: initialIds,
        noteOverrides: persisted.noteOverrides,
        stationFilter: initialStationFilter,
        latestAction: sourceStation ? `${target.name} 已经在 ${sourceStation.name} 的好友链里了` : `${target.name} 已经在好友页里了`,
      };
    }

    return {
      friendIds: [...initialIds, autoAddId],
      noteOverrides: persisted.noteOverrides,
      stationFilter: initialStationFilter,
      latestAction: sourceStation ? `已把 ${target.name} 从 ${sourceStation.name} 收进好友页` : `已把 ${target.name} 收进好友页`,
    };
  }, [autoAddId, defaultFriendIds, sourceStation]);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const [activeTab, setActiveTab] = useState<"friends" | "candidates">("friends");
  const [latestAction, setLatestAction] = useState<string | null>(initialRelationshipState.latestAction);
  const [friendIds, setFriendIds] = useState<string[]>(initialRelationshipState.friendIds);
  const [noteOverrides, setNoteOverrides] = useState<Record<string, string>>(initialRelationshipState.noteOverrides);
  const [activeStationFilter, setActiveStationFilter] = useState<string>(initialRelationshipState.stationFilter);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      friendStorageKey,
      JSON.stringify({
        friendIds,
        noteOverrides,
        stationFilter: activeStationFilter === "all" ? null : activeStationFilter,
      } satisfies PersistedFriendState),
    );
  }, [activeStationFilter, friendIds, noteOverrides]);

  const focusId = autoAddId ?? highlightId ?? null;
  const friends = friendRelationships.filter((entry) => friendIds.includes(entry.id));
  const candidates = friendRelationships.filter((entry) => !friendIds.includes(entry.id));
  const stationOptions = useMemo(
    () => Array.from(new Set(friendRelationships.map((entry) => entry.station))).sort((left, right) => left.localeCompare(right, "zh-Hans-CN")),
    [],
  );
  const focusedEntry = friendRelationships.find((entry) => entry.id === focusId) ?? null;
  const visibleEntries = (activeTab === "friends" ? friends : candidates).filter((entry) => {
    const note = noteOverrides[entry.id] ?? entry.note;

    if (activeStationFilter !== "all" && entry.station !== activeStationFilter) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return [entry.name, entry.handle, entry.station, entry.sourcePostTitle, entry.sourceSummary, note, ...entry.tags]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);
  });
  const stationCount = new Set(friends.map((entry) => entry.station)).size;
  const sourceStationFriendCount = sourceStation ? friends.filter((entry) => entry.station === sourceStation.name).length : 0;
  const hasActiveFilters = Boolean(normalizedQuery) || activeStationFilter !== "all" || activeTab !== "friends";

  function addFriend(entry: FriendRelationship) {
    if (friendIds.includes(entry.id)) {
      setLatestAction(`${entry.name} 已经在好友页里了`);
      setActiveTab("friends");
      setActiveStationFilter(entry.station);
      return;
    }

    setFriendIds((current) => [...current, entry.id]);
    setLatestAction(sourceStation?.name === entry.station ? `已把 ${entry.name} 从 ${entry.station} 收进好友页` : `已把 ${entry.name} 收进好友页`);
    setActiveTab("friends");
    setActiveStationFilter(entry.station);
  }

  function removeFriend(entry: FriendRelationship) {
    setFriendIds((current) => current.filter((item) => item !== entry.id));
    setLatestAction(`已把 ${entry.name} 移回候选关系`);

    if (editingNoteId === entry.id) {
      setEditingNoteId(null);
      setNoteDraft("");
    }
  }

  function beginEditNote(entry: FriendRelationship) {
    setEditingNoteId(entry.id);
    setNoteDraft(noteOverrides[entry.id] ?? entry.note);
  }

  function saveNote(entry: FriendRelationship) {
    const trimmedDraft = noteDraft.trim();

    setNoteOverrides((current) => {
      const next = { ...current };

      if (!trimmedDraft || trimmedDraft === entry.note) {
        delete next[entry.id];
      } else {
        next[entry.id] = trimmedDraft;
      }

      return next;
    });

    setLatestAction(
      !trimmedDraft || trimmedDraft === entry.note
        ? `已恢复 ${entry.name} 的默认关系备注`
        : `已更新 ${entry.name} 的关系备注`,
    );
    setEditingNoteId(null);
    setNoteDraft("");
  }

  function resetRelationshipState() {
    setFriendIds(defaultFriendIds);
    setNoteOverrides({});
    setActiveStationFilter(sourceStation?.name ?? "all");
    setActiveTab("friends");
    setQuery("");
    setEditingNoteId(null);
    setNoteDraft("");
    setLatestAction("已恢复默认好友状态，方便重新验证这条关系链");
  }

  function clearViewState() {
    setQuery("");
    setActiveStationFilter(sourceStation?.name ?? "all");
    setActiveTab("friends");
    setLatestAction("已清空当前筛选，回到默认查看状态");
  }

  return (
    <section className="space-y-5 pb-4">
      <div>
        <p className="mobile-section-label text-[0.62rem] font-semibold uppercase tracking-[0.22em]">Friends</p>
        <h2 className="mobile-text-primary mt-2.5 text-[2rem] font-semibold tracking-[-0.07em]">好友</h2>
        <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">
          这页不是通讯录，也不是基站成员表。这里只收那些已经在公开互动里反复出现、值得你长期记住的人。
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <RelationshipStat label="已沉淀好友" value={`${friends.length}`} />
        <RelationshipStat label="候选关系" value={`${candidates.length}`} />
        <RelationshipStat label="共同基站" value={`${stationCount || 1}`} />
      </div>

      {sourceStation ? (
        <article className="mobile-soft-card mobile-ghost-border rounded-[1.25rem] px-4 py-4">
          <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">来自基站成员页</p>
          <h3 className="mobile-text-primary mt-3 text-[0.96rem] font-semibold">{sourceStation.name}</h3>
          <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">
            这次关系不是从抽象联系人列表里生出来的，而是从 {sourceStation.name} 的成员页带回来的。
            现在你可以把“人、共同基站、来源帖子”放在一起看。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="mobile-chip-accent rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.14em]">
              该站已沉淀好友 · {sourceStationFriendCount}
            </span>
            <span className="mobile-chip rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.16em]">
              成员转化入口已接通
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link
              href={appendPayload(buildStationHrefByName(sourceStation.name), payload)}
              className="mobile-button-secondary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.8rem] font-semibold"
            >
              回到基站
            </Link>
            <button
              type="button"
              onClick={() => setActiveStationFilter(sourceStation.name)}
              className="mobile-button-primary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.8rem] font-semibold"
            >
              只看这个基站
            </button>
          </div>
        </article>
      ) : null}

      {focusedEntry ? (
        <article className="mobile-soft-card mobile-ghost-border rounded-[1.25rem] px-4 py-4">
          <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">刚带回来的人</p>
          <div className="mt-3 flex items-start justify-between gap-3">
            <div>
              <p className="mobile-text-primary text-[0.96rem] font-semibold">{focusedEntry.name}</p>
              <p className="mobile-text-secondary mt-1 text-[0.8rem]">
                {focusedEntry.station} · {focusedEntry.closeness}
              </p>
            </div>
            <span className="mobile-chip-accent rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.14em]">
              {friendIds.includes(focusedEntry.id) ? "已进好友页" : "候选关系"}
            </span>
          </div>
          <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">{focusedEntry.sourceSummary}</p>
          <p className="mobile-text-secondary mt-3 text-[0.8rem] leading-6">{noteOverrides[focusedEntry.id] ?? focusedEntry.note}</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link
              href={appendPayload(buildPersonHrefByName(focusedEntry.name), payload)}
              className="mobile-button-secondary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.8rem] font-semibold"
            >
              看作者页
            </Link>
            <Link
              href={appendPayload(`/posts/${focusedEntry.sourcePostId}`, payload)}
              className="mobile-button-primary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.8rem] font-semibold"
            >
              看来源帖子
            </Link>
          </div>
        </article>
      ) : null}

      {latestAction ? (
        <article className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
          <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">刚刚完成</p>
          <p className="mobile-text-primary mt-3 text-[0.9rem] font-semibold">{latestAction}</p>
        </article>
      ) : null}

      <article className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
        <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">本地验证</p>
        <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">
          这页当前会把好友状态、关系备注和基站筛选保存在本地，方便你刷新后继续检查；需要重新跑最小链路时，也可以一键恢复默认状态。
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={resetRelationshipState}
            className="mobile-button-secondary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.8rem] font-semibold"
          >
            恢复默认关系
          </button>
          <Link
            href="/validation"
            className="mobile-button-primary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.8rem] font-semibold"
          >
            打开核对板
          </Link>
        </div>
      </article>

      <label className="mobile-soft-card mobile-ghost-border flex items-center gap-3 rounded-[1.2rem] px-4 py-3">
        <SearchIcon className="mobile-text-muted size-[1rem]" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="mobile-text-primary w-full bg-transparent text-[0.9rem] outline-none placeholder:text-[var(--mobile-text-muted)]"
          placeholder="搜索好友、基站或来源帖子..."
        />
      </label>

      <article className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("friends")}
            className={`rounded-full px-3 py-2 text-[0.72rem] font-semibold ${
              activeTab === "friends" ? "mobile-button-primary" : "mobile-button-secondary"
            }`}
          >
            好友列表
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("candidates")}
            className={`rounded-full px-3 py-2 text-[0.72rem] font-semibold ${
              activeTab === "candidates" ? "mobile-button-primary" : "mobile-button-secondary"
            }`}
          >
            候选关系
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveStationFilter("all")}
            className={`rounded-full px-3 py-2 text-[0.72rem] font-semibold ${
              activeStationFilter === "all" ? "mobile-button-primary" : "mobile-button-secondary"
            }`}
          >
            全部基站
          </button>
          {stationOptions.map((station) => (
            <button
              key={station}
              type="button"
              onClick={() => setActiveStationFilter(station)}
              className={`rounded-full px-3 py-2 text-[0.72rem] font-semibold ${
                activeStationFilter === station ? "mobile-button-primary" : "mobile-button-secondary"
              }`}
            >
              {station}
            </button>
          ))}
        </div>
        <p className="mobile-text-secondary mt-4 text-[0.82rem] leading-6">
          {activeTab === "friends"
            ? activeStationFilter === "all"
              ? "这里看的不是谁最火，而是谁已经跟你形成了连续语境。"
              : `当前只看 ${activeStationFilter} 里的已沉淀关系。`
            : activeStationFilter === "all"
              ? "候选关系不是自动好友，而是值得你再点一次、再看一次、再决定是否留下的人。"
              : `当前只看 ${activeStationFilter} 里仍在观察中的候选关系。`}
        </p>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={clearViewState}
            className="mobile-button-secondary mt-4 inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.78rem] font-semibold"
          >
            清空当前筛选
          </button>
        ) : null}
      </article>

      <section className="space-y-3">
        {visibleEntries.length > 0 ? (
          visibleEntries.map((entry) => {
            const active = entry.id === focusId;
            const inFriends = friendIds.includes(entry.id);
            const note = noteOverrides[entry.id] ?? entry.note;
            const hasCustomNote = Boolean(noteOverrides[entry.id]);

            return (
              <article
                key={entry.id}
                className={`mobile-soft-card mobile-ghost-border rounded-[1.25rem] px-4 py-4 ${
                  active ? "ring-1 ring-[var(--mobile-primary)]/20" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mobile-button-secondary inline-flex size-12 items-center justify-center rounded-[1rem] text-[0.88rem] font-semibold">
                      {entry.name.slice(0, 2)}
                    </div>
                    <div>
                      <p className="mobile-text-primary text-[0.96rem] font-semibold">{entry.name}</p>
                      <p className="mobile-text-secondary mt-1 text-[0.8rem]">
                        {entry.handle} · {entry.station}
                      </p>
                    </div>
                  </div>
                  <span className="mobile-chip rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.14em]">
                    {entry.closeness}
                  </span>
                </div>

                <p className="mobile-text-secondary mt-4 text-[0.84rem] leading-6">{entry.sourceSummary}</p>
                <p className="mobile-text-secondary mt-3 text-[0.8rem] leading-6">{note}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="mobile-chip-accent rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.14em]">
                    最近出现 · {entry.lastSeen}
                  </span>
                  {hasCustomNote ? (
                    <span className="mobile-chip-accent rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.14em]">
                      已改备注
                    </span>
                  ) : null}
                  {entry.tags.map((tag) => (
                    <span
                      key={`${entry.id}-${tag}`}
                      className="mobile-chip rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.16em]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <Link
                    href={appendPayload(buildPersonHrefByName(entry.name), payload)}
                    className="mobile-button-secondary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.78rem] font-semibold"
                  >
                    作者页
                  </Link>
                  <Link
                    href={appendPayload(`/posts/${entry.sourcePostId}`, payload)}
                    className="mobile-button-secondary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.78rem] font-semibold"
                  >
                    来源帖子
                  </Link>
                  {inFriends ? (
                    <Link
                      href={appendPayload(buildStationHrefByName(entry.station), payload)}
                      className="mobile-button-primary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.78rem] font-semibold"
                    >
                      看基站
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => addFriend(entry)}
                      className="mobile-button-primary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.78rem] font-semibold"
                    >
                      加为好友
                    </button>
                  )}
                </div>

                {inFriends ? (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => beginEditNote(entry)}
                      className="mobile-button-secondary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.78rem] font-semibold"
                    >
                      {editingNoteId === entry.id ? "正在编辑备注" : "关系备注"}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFriend(entry)}
                      className="mobile-button-secondary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.78rem] font-semibold"
                    >
                      移回候选
                    </button>
                  </div>
                ) : null}

                {editingNoteId === entry.id ? (
                  <div className="mobile-ghost-border mobile-surface-muted mt-3 rounded-[1rem] px-3 py-3">
                    <p className="mobile-section-label text-[0.56rem] font-semibold uppercase tracking-[0.16em]">关系备注</p>
                    <textarea
                      value={noteDraft}
                      onChange={(event) => setNoteDraft(event.target.value)}
                      rows={3}
                      className="mobile-text-primary mt-3 w-full rounded-[0.95rem] border border-[var(--mobile-border)] bg-transparent px-3 py-3 text-[0.82rem] leading-6 outline-none"
                      placeholder="写下你为什么想继续记住这个人..."
                    />
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => saveNote(entry)}
                        className="mobile-button-primary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.78rem] font-semibold"
                      >
                        保存备注
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingNoteId(null);
                          setNoteDraft("");
                        }}
                        className="mobile-button-secondary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.78rem] font-semibold"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : null}

                <p className="mobile-text-muted mt-3 text-[0.72rem] leading-6">
                  来源帖子：{entry.sourcePostTitle}
                </p>
              </article>
            );
          })
        ) : (
          <article className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-6">
            <p className="mobile-text-primary text-[0.92rem] font-semibold">当前筛选下没有结果</p>
            <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">
              你可以换个关键词，或者先回到动态和作者页继续把关系收进来。
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={clearViewState}
                className="mobile-button-secondary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.78rem] font-semibold"
              >
                清空筛选
              </button>
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === "friends" ? "candidates" : "friends")}
                className="mobile-button-primary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.78rem] font-semibold"
              >
                {activeTab === "friends" ? "去看候选关系" : "回到好友列表"}
              </button>
            </div>
          </article>
        )}
      </section>
    </section>
  );
}

function RelationshipStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="mobile-ghost-border mobile-surface-muted rounded-[1rem] px-3 py-3">
      <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">{label}</p>
      <p className="mobile-text-primary mt-2 text-[0.98rem] font-semibold">{value}</p>
    </div>
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

type StationMemberEntry = {
  id: string;
  name: string;
  handle: string;
  summary: string;
  context: string;
  tags: string[];
  relation: "friend" | "candidate" | "member";
  sourcePostId?: string;
  sourcePostTitle?: string;
};

function buildStationMemberEntries(station: StationCard): StationMemberEntry[] {
  const relationMap = new Map(friendRelationships.map((entry) => [entry.id, entry] as const));
  const feedPostTitles = new Map(feedPosts.map((post) => [post.id, post.title] as const));
  const seen = new Set<string>();
  const members: StationMemberEntry[] = [];

  function pushMember({
    name,
    fallbackSummary,
    fallbackContext,
    fallbackTags,
    sourcePostId,
    sourcePostTitle,
  }: {
    name: string;
    fallbackSummary: string;
    fallbackContext: string;
    fallbackTags: string[];
    sourcePostId?: string;
    sourcePostTitle?: string;
  }) {
    const id = normalizePublicId(name);

    if (seen.has(id)) {
      return;
    }

    seen.add(id);

    const profile = resolvePublicPersonProfile(id);
    const relatedRelationship = relationMap.get(id);

    members.push({
      id,
      name: profile.name,
      handle: relatedRelationship?.handle ?? profile.handle,
      summary: relatedRelationship?.sourceSummary ?? fallbackSummary,
      context: relatedRelationship?.note ?? fallbackContext,
      tags: relatedRelationship?.tags.slice(0, 3) ?? fallbackTags.slice(0, 3),
      relation: relatedRelationship?.relation ?? "member",
      sourcePostId: relatedRelationship?.sourcePostId ?? sourcePostId,
      sourcePostTitle: relatedRelationship?.sourcePostTitle ?? sourcePostTitle,
    });
  }

  pushMember({
    name: station.hostName,
    fallbackSummary: `${station.hostName} 负责维护 ${station.name} 的公开边界和讨论节奏。`,
    fallbackContext: `${station.hostName} 是这座基站当前最稳定的关系入口，适合先从主理人开始理解这里的语气和边界。`,
    fallbackTags: [station.hostRole, station.location, ...station.tags],
  });

  feedPosts
    .filter((post) => post.station === station.name)
    .forEach((post) => {
      if (post.role === "human" || post.role === "official") {
        pushMember({
          name: post.author,
          fallbackSummary: `${post.author} 最近在 ${station.name} 主要围绕“${post.title}”持续发言。`,
          fallbackContext: `${post.author} 已经不只是单次出现，而是在 ${station.name} 的公开帖子里留下了连续语境。`,
          fallbackTags: [post.publishedAt, post.title.slice(0, 10), "公开发帖"],
          sourcePostId: post.id,
          sourcePostTitle: post.title,
        });
      }

      if (post.previewReply?.role === "human") {
        pushMember({
          name: post.previewReply.author,
          fallbackSummary: `${post.previewReply.author} 最近在 ${station.name} 的回复里开始持续接话。`,
          fallbackContext: `这类成员最适合从“围观者 -> 候选关系 -> 好友”慢慢转化，而不是继续淹没在成员列表里。`,
          fallbackTags: [post.publishedAt, "公开回复", "持续互动"],
          sourcePostId: post.id,
          sourcePostTitle: post.title,
        });
      }
    });

  Object.values(discussionThreads).forEach((thread) => {
    const threadStation = thread.community.split("/")[0]?.trim();

    if (threadStation !== station.name) {
      return;
    }

    thread.replies.forEach((reply) => {
      if (reply.role !== "human" && reply.role !== "official") {
        return;
      }

      pushMember({
        name: reply.author,
        fallbackSummary: `${reply.author} 最近在 ${station.name} 的讨论串里持续补充自己的判断。`,
        fallbackContext: `${reply.author} 已经在同一条长讨论里多次出现，适合进入候选关系而不是继续只算成员数。`,
        fallbackTags: [reply.publishedAt, reply.status ?? "公开回复", "讨论串"],
        sourcePostId: thread.postId,
        sourcePostTitle: feedPostTitles.get(thread.postId),
      });
    });
  });

  const relationWeight: Record<StationMemberEntry["relation"], number> = {
    friend: 0,
    candidate: 1,
    member: 2,
  };

  return members
    .sort((left, right) => relationWeight[left.relation] - relationWeight[right.relation] || left.name.localeCompare(right.name, "zh-Hans-CN"))
    .slice(0, 6);
}

function getRelationshipTone(relation: StationMemberEntry["relation"]) {
  if (relation === "friend") {
    return "mobile-chip-accent";
  }

  return "mobile-chip";
}

function getRelationshipLabel(relation: StationMemberEntry["relation"]) {
  if (relation === "friend") {
    return "已在好友页";
  }

  if (relation === "candidate") {
    return "候选关系";
  }

  return "站内常见";
}

export function StationDetailScreen({
  station,
  payload,
  focusStation,
}: {
  station: StationCard;
  payload?: string;
  focusStation?: StationCard;
}) {
  const recentPosts = feedPosts.filter((post) => post.station === station.name && post.role !== "agent");
  const stationMembers = buildStationMemberEntries(station);
  const relationScore = focusStation ? getStationRelationScore(focusStation, station) : undefined;

  return (
    <div className="mobile-app-root min-h-screen">
      <div className="mx-auto max-w-[28rem] px-4 py-4">
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.22em]">Station</p>
            <p className="mobile-text-primary mt-1 text-[0.82rem] font-semibold">基站动态</p>
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
          <div className="mt-4 grid grid-cols-3 gap-3">
            <StationMetric value={station.hostName} label="站长" />
            <StationMetric value={`${recentPosts.length} 条`} label="讨论" />
            <StationMetric value={relationScore ?? station.memberCount.replace(" 成员", "")} label={relationScore ? "相关系数" : "成员"} />
          </div>
        </section>

        <section className="mt-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">站内帖子</p>
              <p className="mobile-text-secondary mt-2 text-[0.82rem] leading-6">
                先看看这座站里正在聊什么，再点进其中一条继续往下读。
              </p>
            </div>
            <span className="mobile-text-muted shrink-0 text-[0.72rem]">{recentPosts.length} 帖</span>
          </div>

          {recentPosts.map((post) => (
            <FeedCard
              key={post.id}
              post={post}
              href={appendPayload(`/posts/${post.id}`, payload)}
              ctaLabel="进入这条讨论"
              payload={payload}
            />
          ))}
        </section>

        <section className="mt-5 mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
          <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">站长与边界</p>
          <Link
            href={appendPayload(buildPersonHrefByName(station.hostName), payload)}
            className="mt-3 flex items-center justify-between gap-3"
          >
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

        <section className="mt-5 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">常见成员</p>
              <p className="mobile-text-secondary mt-2 text-[0.82rem] leading-6">
                基站不该只让你加入，也该让你把这里真正熟起来的人带进好友页。
              </p>
            </div>
            <span className="mobile-text-muted shrink-0 text-[0.72rem]">{stationMembers.length} 人</span>
          </div>

          {stationMembers.map((member) => {
            const relationshipHref = appendPayload(
              `/app/friends?highlight=${encodeURIComponent(member.id)}${member.relation === "friend" ? "" : `&add=${encodeURIComponent(member.id)}`}&station=${encodeURIComponent(station.id)}`,
              payload,
            );

            return (
              <article key={member.id} className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mobile-button-secondary inline-flex size-12 items-center justify-center rounded-[1rem] text-[0.88rem] font-semibold">
                      {member.name.slice(0, 2)}
                    </div>
                    <div>
                      <p className="mobile-text-primary text-[0.96rem] font-semibold">{member.name}</p>
                      <p className="mobile-text-secondary mt-1 text-[0.8rem]">{member.handle}</p>
                    </div>
                  </div>
                  <span className={`${getRelationshipTone(member.relation)} rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.14em]`}>
                    {getRelationshipLabel(member.relation)}
                  </span>
                </div>

                <p className="mobile-text-secondary mt-4 text-[0.84rem] leading-6">{member.summary}</p>
                <p className="mobile-text-secondary mt-3 text-[0.8rem] leading-6">{member.context}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {member.tags.map((tag) => (
                    <span
                      key={`${member.id}-${tag}`}
                      className="mobile-chip rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.16em]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Link
                    href={appendPayload(buildPersonHrefByName(member.name), payload)}
                    className="mobile-button-secondary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.78rem] font-semibold"
                  >
                    作者页
                  </Link>
                  <Link
                    href={relationshipHref}
                    className="mobile-button-primary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.78rem] font-semibold"
                  >
                    {member.relation === "friend" ? "看好友页" : "加为好友"}
                  </Link>
                </div>

                {member.sourcePostId ? (
                  <Link
                    href={appendPayload(`/posts/${member.sourcePostId}`, payload)}
                    className="mobile-text-muted mt-3 inline-flex text-[0.72rem] leading-6"
                  >
                    来源帖子：{member.sourcePostTitle ?? "查看原帖"} →
                  </Link>
                ) : null}
              </article>
            );
          })}
        </section>

      </div>
    </div>
  );
}

function StationMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="mobile-surface-muted mobile-ghost-border rounded-[1rem] px-3 py-3 text-center">
      <p className="mobile-text-primary text-[0.84rem] font-semibold">{value}</p>
      <p className="mobile-text-muted mt-1 text-[0.62rem] uppercase tracking-[0.14em]">{label}</p>
    </div>
  );
}

function getStationRelationScore(focusStation: StationCard, targetStation: StationCard) {
  if (focusStation.id === targetStation.id) {
    return "100%";
  }

  const sharedTags = targetStation.tags.filter((tag) => focusStation.tags.includes(tag)).length;
  const score =
    56 +
    sharedTags * 16 +
    (targetStation.tone === focusStation.tone ? 8 : 0) +
    (targetStation.location.includes("线上") === focusStation.location.includes("线上") ? 6 : 0);

  return `${Math.min(score, 96)}%`;
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
                href={appendPayload(buildStationHrefByName(profile.homeStation), payload)}
                className="mobile-button-primary inline-flex items-center justify-center rounded-full px-3 py-2 text-[0.72rem] font-semibold"
              >
                看基站
              </Link>
            ) : null}
            <Link
              href={appendPayload(
                `/app/friends?add=${encodeURIComponent(profile.id)}&highlight=${encodeURIComponent(profile.id)}`,
                payload,
              )}
              className="mobile-button-secondary inline-flex items-center justify-center rounded-full px-3 py-2 text-[0.72rem] font-semibold"
            >
              加为好友
            </Link>
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
              href={appendPayload(buildStationHrefByName(profile.homeStation), payload)}
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
