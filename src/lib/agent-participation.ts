import type { FeedPost } from "@/components/mobile/mock-data";

export type AgentTriggerMode = "mention_only" | "auto_publish";
export type AgentParticipationScope = "all_posts" | "current_station" | "selected_people";

export type AgentParticipationSettings = {
  triggerMode: AgentTriggerMode;
  scope: AgentParticipationScope;
  stationId?: string;
  stationName?: string;
  people: string[];
};

export const agentParticipationStorageKey = "clawnet-agent-participation-v1";

export const defaultAgentParticipationSettings: AgentParticipationSettings = {
  triggerMode: "auto_publish",
  scope: "all_posts",
  stationId: "042",
  stationName: "深空协议",
  people: ["Mira", "Li Wei", "Michael Yang"],
};

export function readAgentParticipationSettings() {
  if (typeof window === "undefined") {
    return defaultAgentParticipationSettings;
  }

  try {
    const raw = window.localStorage.getItem(agentParticipationStorageKey);

    if (!raw) {
      return defaultAgentParticipationSettings;
    }

    const parsed = JSON.parse(raw) as Partial<AgentParticipationSettings>;
    return normalizeAgentParticipationSettings(parsed);
  } catch {
    return defaultAgentParticipationSettings;
  }
}

export function writeAgentParticipationSettings(settings: AgentParticipationSettings) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    agentParticipationStorageKey,
    JSON.stringify(normalizeAgentParticipationSettings(settings)),
  );
}

export function shouldAutoPublishAgentReply(settings: AgentParticipationSettings, post: FeedPost) {
  if (settings.triggerMode !== "auto_publish") {
    return false;
  }

  if (settings.scope === "all_posts") {
    return true;
  }

  if (settings.scope === "current_station") {
    return !settings.stationName || settings.stationName === post.station;
  }

  return settings.people.includes(post.author);
}

export function getAgentTriggerLabel(triggerMode: AgentTriggerMode) {
  return triggerMode === "mention_only" ? "仅在 @ 时发出" : "默认直接发出";
}

export function getAgentScopeLabel(settings: AgentParticipationSettings) {
  if (settings.scope === "all_posts") {
    return "全部帖子";
  }

  if (settings.scope === "current_station") {
    return settings.stationName ? `仅 ${settings.stationName}` : "仅当前基站";
  }

  return "仅熟悉的人";
}

function normalizeAgentParticipationSettings(
  settings: Partial<AgentParticipationSettings>,
): AgentParticipationSettings {
  const triggerMode = settings.triggerMode === "mention_only" ? "mention_only" : "auto_publish";
  const scope = normalizeScope(settings.scope);
  const people = Array.isArray(settings.people)
    ? settings.people.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : defaultAgentParticipationSettings.people;

  return {
    triggerMode,
    scope,
    stationId: typeof settings.stationId === "string" ? settings.stationId : defaultAgentParticipationSettings.stationId,
    stationName:
      typeof settings.stationName === "string"
        ? settings.stationName
        : defaultAgentParticipationSettings.stationName,
    people,
  };
}

function normalizeScope(value?: AgentParticipationScope) {
  if (value === "current_station" || value === "selected_people") {
    return value;
  }

  return "all_posts";
}
