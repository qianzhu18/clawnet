import type { FeedPost } from "@/components/mobile/mock-data";

export type AgentTriggerMode = "mention_only" | "auto_publish";
export type AgentParticipationScope = "all_posts" | "selected_people";

export type AgentStationParticipationRule = {
  stationId: string;
  stationName: string;
  triggerMode: AgentTriggerMode;
};

export type AgentParticipationSettings = {
  triggerMode: AgentTriggerMode;
  scope: AgentParticipationScope;
  people: string[];
  stationRules: AgentStationParticipationRule[];
};

type LegacyAgentParticipationSettings = Partial<Omit<AgentParticipationSettings, "scope" | "stationRules">> & {
  scope?: AgentParticipationScope | "current_station";
  stationId?: string;
  stationName?: string;
  stationRules?: unknown;
};

export const agentParticipationStorageKey = "clawnet-agent-participation-v1";

export const defaultAgentParticipationSettings: AgentParticipationSettings = {
  triggerMode: "mention_only",
  scope: "all_posts",
  people: ["Mira", "Li Wei", "Michael Yang"],
  stationRules: [
    { stationId: "042", stationName: "深空协议", triggerMode: "auto_publish" },
    { stationId: "109", stationName: "野兽派结构", triggerMode: "mention_only" },
    { stationId: "225", stationName: "静谧记录仪", triggerMode: "auto_publish" },
  ],
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

    const parsed = JSON.parse(raw) as LegacyAgentParticipationSettings;
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
  const stationRule = getStationParticipationRule(settings, post.station);
  const effectiveTrigger = stationRule?.triggerMode ?? settings.triggerMode;

  if (effectiveTrigger !== "auto_publish") {
    return false;
  }

  if (settings.scope === "selected_people") {
    return settings.people.includes(post.author);
  }

  return true;
}

export function getAgentTriggerLabel(triggerMode: AgentTriggerMode) {
  return triggerMode === "mention_only" ? "仅在 @ 时发出" : "默认直接发出";
}

export function getAgentScopeLabel(settings: AgentParticipationSettings) {
  if (settings.scope === "selected_people") {
    return "仅熟悉的人";
  }

  return "全部公开帖子";
}

export function getStationParticipationTrigger(
  settings: AgentParticipationSettings,
  stationName: string,
) {
  return getStationParticipationRule(settings, stationName)?.triggerMode ?? settings.triggerMode;
}

function normalizeAgentParticipationSettings(
  settings: LegacyAgentParticipationSettings,
): AgentParticipationSettings {
  const triggerMode = settings.triggerMode === "mention_only" ? "mention_only" : "auto_publish";
  const scope = normalizeScope(settings.scope);
  const people = Array.isArray(settings.people)
    ? settings.people.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : defaultAgentParticipationSettings.people;
  const stationRules = normalizeStationRules(settings, triggerMode);

  return {
    triggerMode: shouldMigrateLegacyCurrentStation(settings) ? "mention_only" : triggerMode,
    scope,
    stationRules,
    people,
  };
}

function normalizeScope(value?: AgentParticipationScope | "current_station") {
  if (value === "selected_people") {
    return value;
  }

  return "all_posts";
}

function normalizeStationRules(
  settings: LegacyAgentParticipationSettings,
  triggerMode: AgentTriggerMode,
) {
  const parsedRules = Array.isArray(settings.stationRules)
    ? settings.stationRules.flatMap((rule) => normalizeStationRule(rule))
    : defaultAgentParticipationSettings.stationRules;

  if (!shouldMigrateLegacyCurrentStation(settings)) {
    return parsedRules;
  }

  const legacyStationId =
    typeof settings.stationId === "string" && settings.stationId.trim().length > 0
      ? settings.stationId
      : defaultAgentParticipationSettings.stationRules[0]?.stationId ?? "042";
  const legacyStationName =
    typeof settings.stationName === "string" && settings.stationName.trim().length > 0
      ? settings.stationName
      : defaultAgentParticipationSettings.stationRules[0]?.stationName ?? "深空协议";

  return upsertStationRule(parsedRules, {
    stationId: legacyStationId,
    stationName: legacyStationName,
    triggerMode,
  });
}

function normalizeStationRule(value: unknown): AgentStationParticipationRule[] {
  if (!value || typeof value !== "object") {
    return [];
  }

  const rule = value as Partial<AgentStationParticipationRule>;
  if (typeof rule.stationId !== "string" || typeof rule.stationName !== "string") {
    return [];
  }

  return [
    {
      stationId: rule.stationId,
      stationName: rule.stationName,
      triggerMode: rule.triggerMode === "auto_publish" ? "auto_publish" : "mention_only",
    },
  ];
}

function upsertStationRule(
  rules: AgentStationParticipationRule[],
  nextRule: AgentStationParticipationRule,
) {
  const nextRules = rules.filter(
    (rule) => rule.stationId !== nextRule.stationId && rule.stationName !== nextRule.stationName,
  );
  nextRules.push(nextRule);
  return nextRules;
}

function shouldMigrateLegacyCurrentStation(
  settings: LegacyAgentParticipationSettings,
) {
  return settings.scope === "current_station";
}

function getStationParticipationRule(
  settings: AgentParticipationSettings,
  stationName: string,
) {
  return settings.stationRules.find((rule) => rule.stationName === stationName);
}
