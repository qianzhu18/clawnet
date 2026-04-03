import {
  discussionThreads,
  feedPosts,
  stationCards,
  type FeedRole,
  type StationCard,
} from "@/components/mobile/mock-data";
import { buildCreatedAgentHref, buildCreatedAgentProfile } from "@/lib/agent-profile";

export type PublicPersonProfile = {
  id: string;
  name: string;
  handle: string;
  role: "human" | "official";
  homeStation?: string;
  summary: string;
  traits: string[];
};

export function normalizePublicId(value: string) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 48);

  return normalized || "unknown";
}

export function getStationById(id: string) {
  return (
    stationCards.find((station) => station.id === id) ??
    stationCards.find((station) => normalizePublicId(station.id) === id) ??
    stationCards.find((station) => normalizePublicId(station.name) === id) ??
    null
  );
}

export function getStationByName(name: string) {
  return stationCards.find((station) => station.name === name) ?? null;
}

export function buildStationHrefByName(name: string) {
  const station = getStationByName(name);
  return `/stations/${station ? station.id : normalizePublicId(name)}`;
}

export function getStationVisibility(station: StationCard) {
  return station.id === "042" ? "条件加入" : "公开可见";
}

export function buildAuthorHref(input: {
  author: string;
  role: FeedRole;
  handle?: string;
  stationName?: string;
}) {
  if (input.role === "station") {
    return buildStationHrefByName(input.stationName ?? input.author);
  }

  if (input.role === "agent") {
    return buildAgentHref(input.author);
  }

  return buildPersonHrefByName(input.author);
}

export function buildPersonHrefByName(name: string) {
  return `/people/${normalizePublicId(name)}`;
}

export function buildAgentHref(name: string) {
  const preset = resolveAgentPreset(name);
  const profile = buildCreatedAgentProfile({
    name,
    tone: preset.tone,
    focus: preset.focus,
    approval: preset.approval,
  });

  return buildCreatedAgentHref(profile);
}

export function resolvePublicPersonProfile(id: string): PublicPersonProfile {
  const people = buildPublicPeople();
  const matched =
    people.find((person) => person.id === id) ??
    people.find((person) => normalizePublicId(person.name) === id);

  if (matched) {
    return matched;
  }

  const fallbackName = id.replace(/-/g, " ").trim() || "Unknown";

  return {
    id,
    name: fallbackName,
    handle: `@${normalizePublicId(fallbackName)}`,
    role: "human",
    summary: "这是一个还没有补齐资料的公开参与者占位页。后续需要继续补他的长期参与、最近回复和归属基站。",
    traits: ["公开参与", "资料待补", "占位页"],
  };
}

function buildPublicPeople() {
  const seen = new Set<string>();
  const people: PublicPersonProfile[] = [];

  for (const station of stationCards) {
    pushPerson(
      people,
      seen,
      station.hostName,
      "human",
      `@${normalizePublicId(station.hostName)}`,
      station.name,
      `${station.hostName} 负责 ${station.name} 的日常维护、议题节奏和公开边界。`,
      [station.hostRole, station.location, ...station.tags.slice(0, 2)],
    );
  }

  for (const post of feedPosts) {
    if (post.role === "human" || post.role === "official") {
      pushPerson(
        people,
        seen,
        post.author,
        post.role === "official" ? "official" : "human",
        post.handle,
        post.station,
        `${post.author} 最近主要在 ${post.station} 公开参与关于“${post.title}”的讨论。`,
        [post.station, post.publishedAt, post.title.slice(0, 10)],
      );
    }

    if (post.previewReply && post.previewReply.role === "human") {
      pushPerson(
        people,
        seen,
        post.previewReply.author,
        "human",
        `@${normalizePublicId(post.previewReply.author)}`,
        post.station,
        `${post.previewReply.author} 最近在 ${post.station} 的公开讨论里留下了持续互动。`,
        [post.station, "公开回复", "讨论参与"],
      );
    }
  }

  for (const thread of Object.values(discussionThreads)) {
    const stationName = thread.community.split("/")[0].trim();

    for (const reply of thread.replies) {
      if (reply.role === "human" || reply.role === "official") {
        pushPerson(
          people,
          seen,
          reply.author,
          reply.role === "official" ? "official" : "human",
          `@${normalizePublicId(reply.author)}`,
          stationName,
          `${reply.author} 最近在 ${stationName} 的讨论里持续补充自己的观察和判断。`,
          [stationName, reply.publishedAt, reply.status ?? "公开回复"],
        );
      }
    }
  }

  return people;
}

function pushPerson(
  people: PublicPersonProfile[],
  seen: Set<string>,
  name: string,
  role: "human" | "official",
  handle: string,
  homeStation: string | undefined,
  summary: string,
  traits: string[],
) {
  const id = normalizePublicId(name);

  if (seen.has(id)) {
    return;
  }

  seen.add(id);
  people.push({
    id,
    name,
    handle,
    role,
    homeStation,
    summary,
    traits,
  });
}

function resolveAgentPreset(name: string) {
  if (/scout/i.test(name)) {
    return {
      tone: "快速策展",
      focus: "基站社区参与",
      approval: "公开发言前先人工确认",
    };
  }

  return {
    tone: "礼貌克制",
    focus: "公开讨论筛选",
    approval: "公开发言前先人工确认",
  };
}
