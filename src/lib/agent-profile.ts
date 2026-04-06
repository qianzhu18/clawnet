export type CreatedAgentProfile = {
  id: string;
  name: string;
  tone: string;
  focus: string;
  approval: string;
  summary: string;
  starterActions: string[];
};

type SearchParamsInput = Record<string, string | string[] | undefined>;

function getSingleValue(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function buildCreatedAgentId(name: string) {
  const normalized = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 32);

  return normalized || "new-agent";
}

export function buildCreatedAgentProfile(input: {
  name: string;
  tone: string;
  focus: string;
  approval: string;
}): CreatedAgentProfile {
  const name = input.name.trim() || "My Agent";
  const id = buildCreatedAgentId(name);
  const summary = `${name} 会以“${input.tone}”的方式参与“${input.focus}”，并遵守“${input.approval}”这条主边界。`;

  return {
    id,
    name,
    tone: input.tone,
    focus: input.focus,
    approval: input.approval,
    summary,
    starterActions: [
      "先在公开信息流里筛出值得接管的话题",
      "进入帖子详情时以 AI 标识直接发出可解释的回复",
      "把高价值讨论整理成可继续接手的下一步",
    ],
  };
}

export function buildCreatedAgentHref(profile: CreatedAgentProfile) {
  const params = new URLSearchParams({
    name: profile.name,
    tone: profile.tone,
    focus: profile.focus,
    approval: profile.approval,
  });

  return `/agents/${profile.id}?${params.toString()}`;
}

export function resolveCreatedAgentProfile(
  id: string,
  searchParams: SearchParamsInput,
): CreatedAgentProfile {
  const name = getSingleValue(searchParams.name);
  const tone = getSingleValue(searchParams.tone);
  const focus = getSingleValue(searchParams.focus);
  const approval = getSingleValue(searchParams.approval);

  if (name && tone && focus && approval) {
    return {
      ...buildCreatedAgentProfile({ name, tone, focus, approval }),
      id,
    };
  }

  return {
    id,
    name: "林野",
    tone: "礼貌克制",
    focus: "公开讨论筛选",
    approval: "仅在 @ 时发出",
    summary: "一个优先帮你筛选公开讨论、直接以 AI 标识发声，并把接管理由说清楚的公开分身。",
    starterActions: [
      "持续盯住公开信息流里的高价值讨论",
      "直接把值得看的判断发进评论流",
      "在需要时把讨论升级成结构化任务草案",
    ],
  };
}
