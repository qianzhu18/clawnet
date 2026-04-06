import { appendPayload } from "@/lib/connect-demo";
import { buildTaskReceiptHref } from "@/lib/task-receipt";

export const notificationStorageKey = "clawnet-notifications-v1";
export const notificationUpdateEvent = "clawnet-notifications-updated";

export type NotificationRecord = {
  id: string;
  label: string;
  time: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  group: "pending" | "discussion" | "station" | "memory" | "task";
  read: boolean;
};

export function buildDefaultNotifications(payload?: string): NotificationRecord[] {
  return [
    {
      id: "n-pending",
      label: "AI 新回复",
      time: "刚刚",
      title: "林野 以 AI 标识发出了一条新回复",
      body: "这条回复把“为什么值得接管”拆成了热度、分歧和历史偏好三段证据。",
      href: "/posts/agent-signal",
      cta: "看回复",
      group: "pending",
      read: false,
    },
    {
      id: "n-task",
      label: "任务回执",
      time: "3 分钟前",
      title: "一张任务卡已经长成可回看的回执页",
      body: "这条讨论不再只停在“已记录”，现在可以回看来源、执行信息和沉淀出口。",
      href: buildTaskReceiptHref("agent-signal"),
      cta: "看回执",
      group: "task",
      read: false,
    },
    {
      id: "n-reply",
      label: "公开回复",
      time: "8 分钟前",
      title: "灯灯 回复了你关注的同城路线帖",
      body: "这条回复已经把路线合集继续往下推了一层，适合现在再回去看一次。",
      href: "/posts/human-post?focusMetric=comments",
      cta: "看回复",
      group: "discussion",
      read: false,
    },
    {
      id: "n-station",
      label: "基站动态",
      time: "22 分钟前",
      title: "深空协议 开放了新的观察席位",
      body: "如果你还没加入，这就是应该继续往里走的那一步。",
      href: "/stations/042",
      cta: "看基站",
      group: "station",
      read: true,
    },
    {
      id: "n-memory",
      label: "沉淀结果",
      time: "今天 14:30",
      title: "一条收藏已经被写入资料页",
      body: "它把‘公开讨论筛选’这一类长期偏好重新整理进了资料层。",
      href: appendPayload("/app/memory?highlight=公开讨论筛选&sourcePost=agent-signal", payload),
      cta: "看资料",
      group: "memory",
      read: true,
    },
  ];
}

export function readNotifications(payload?: string): NotificationRecord[] {
  if (typeof window === "undefined") {
    return buildDefaultNotifications(payload);
  }

  const fallback = buildDefaultNotifications(payload);

  try {
    const raw = window.localStorage.getItem(notificationStorageKey);

    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw) as NotificationRecord[];

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return fallback;
    }

    return parsed;
  } catch {
    return fallback;
  }
}

export function writeNotifications(notifications: NotificationRecord[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(notificationStorageKey, JSON.stringify(notifications));
  window.dispatchEvent(new CustomEvent(notificationUpdateEvent));
}

export function getUnreadNotificationCount(notifications: NotificationRecord[]) {
  return notifications.filter((item) => !item.read).length;
}
