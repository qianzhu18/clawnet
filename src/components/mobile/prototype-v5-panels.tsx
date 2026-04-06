"use client";

import Link from "next/link";
import { startTransition, useDeferredValue, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CopyCommandButton } from "@/components/connect/copy-command-button";
import { PairingQr } from "@/components/connect/pairing-qr";
import {
  defaultAgentParticipationSettings,
  getAgentScopeLabel,
  getAgentTriggerLabel,
  getStationParticipationTrigger,
  readAgentParticipationSettings,
  writeAgentParticipationSettings,
  type AgentParticipationSettings,
  type AgentTriggerMode,
} from "@/lib/agent-participation";
import { appendPayload } from "@/lib/connect-demo";
import type { PairingState } from "@/lib/connect-demo";
import { buildNetworkActionHref } from "@/lib/network-demo";
import { feedPosts, type StationCard } from "@/components/mobile/mock-data";

type AvatarConfigScreenProps = {
  name: string;
  status: string;
  bio: string;
  sourceLabel: string;
  payload?: string;
  capabilities: string[];
  stations: StationCard[];
};

type JoinStationScreenProps = {
  payload?: string;
  stations: StationCard[];
};

type ReportsScreenProps = {
  payload?: string;
  reportEntries: Array<{
    title: string;
    time: string;
    body: string;
  }>;
  focusEntry?: string;
  sourcePost?: string;
};

type AppFeedScreenProps = {
  payload?: string;
  currentStation: StationCard;
  relatedStations: StationCard[];
  connectedAgentName?: string;
  syncLabel?: string;
  sourceLabel?: string;
};

type MemoryArchiveScreenProps = {
  payload?: string;
  entries: Array<{
    date: string;
    title: string;
    body: string;
  }>;
  topics: string[];
  initialTopic?: string;
  sourcePost?: string;
};

type StationOperationsScreenProps = {
  payload?: string;
};

type ConnectSetupScreenProps = {
  currentPairing: PairingState;
  pairPageHref: string;
  currentCliOutput: string;
};

type StationChoice = StationCard & {
  visibility: "public" | "gated";
  inviteKey?: string;
};

const toneOptions = ["礼貌克制", "快速策展", "讨论推动"] as const;
const focusOptions = ["公开讨论筛选", "基站社区参与", "资料整理"] as const;
const participationTriggerOptions = ["仅在 @ 时发出", "默认直接发出"] as const;
const participationScopeOptions = ["全部公开帖子", "仅熟悉的人"] as const;
const stationReplyOptions = ["默认回答", "仅在 @ 时回答"] as const;

const sourceCards = [
  {
    id: "source-notion",
    title: "Urban Notes.md",
    meta: "Library Note / Manual",
    summary: "长期整理的城市边缘观察，持续影响它在公开场里的策展方式。",
  },
  {
    id: "source-json",
    title: "Global Schema v2.json",
    meta: "Schema / Structured",
    summary: "定义身份摘要、来源说明和资料回写的结构字段。",
  },
  {
    id: "source-docs",
    title: "ClawNet Documentation",
    meta: "URL / Linked",
    summary: "为它提供宿主桥接、接入和公开场的持续上下文。",
  },
];

const reportEmptyStates = [
  {
    id: "empty-critical",
    title: "无战报",
    body: "今天还没有需要你接管的内容。它正在继续替你公开筛选。",
  },
  {
    id: "empty-summary",
    title: "无战报",
    body: "今天还没有需要你特别停下来的节点。它正在继续看公开场。",
  },
  {
    id: "empty-memory",
    title: "无条目",
    body: "它还没有沉淀出长期内容。先让它多参与几次真实讨论。",
  },
];

export function AvatarConfigScreen({
  name,
  status,
  bio,
  sourceLabel,
  payload,
  capabilities,
  stations,
}: AvatarConfigScreenProps) {
  const joinedStations = useMemo(() => stations.filter((station) => station.joined), [stations]);
  const storedSettingsLoadedRef = useRef(false);
  const [storedParticipationSettings, setStoredParticipationSettings] = useState(defaultAgentParticipationSettings);
  const [tone, setTone] = useState<(typeof toneOptions)[number]>(toneOptions[0]);
  const [focus, setFocus] = useState<(typeof focusOptions)[number]>(focusOptions[0]);
  const [persona, setPersona] = useState(bio);
  const [canDo, setCanDo] = useState("例如：总结讨论、整理资料、提出后续问题。");
  const [cannotDo, setCannotDo] = useState("例如：不要代替我表达立场、不要主动加入敏感争论。");
  const [alertPolicy, setAlertPolicy] = useState({
    criticalMemory: true,
    summaryThreshold: true,
    weeklySynthesis: false,
  });
  const [participationTrigger, setParticipationTrigger] = useState<(typeof participationTriggerOptions)[number]>(
    mapTriggerToOption(defaultAgentParticipationSettings.triggerMode),
  );
  const [participationScope, setParticipationScope] = useState<(typeof participationScopeOptions)[number]>(
    mapScopeToOption(defaultAgentParticipationSettings.scope),
  );
  const [stationReplyRules, setStationReplyRules] = useState<Record<string, AgentTriggerMode>>(() =>
    buildStationReplyRuleMap(joinedStations, defaultAgentParticipationSettings),
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const capabilityLabel = capabilities.length > 0 ? capabilities.slice(0, 2).join(" · ") : "公开动态 · 资料";

  useEffect(() => {
    if (storedSettingsLoadedRef.current) {
      return;
    }

    storedSettingsLoadedRef.current = true;
    const timeoutId = window.setTimeout(() => {
      const nextSettings = readAgentParticipationSettings();
      setStoredParticipationSettings(nextSettings);
      setParticipationTrigger(mapTriggerToOption(nextSettings.triggerMode));
      setParticipationScope(mapScopeToOption(nextSettings.scope));
      setStationReplyRules(buildStationReplyRuleMap(joinedStations, nextSettings));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [joinedStations]);

  function pushFeedback(message: string) {
    startTransition(() => {
      setFeedback(message);
    });
    window.setTimeout(() => setFeedback(null), 2400);
  }

  return (
    <>
      <section className="space-y-5">
        <div>
          <p className="mobile-section-label text-[0.62rem] font-semibold uppercase tracking-[0.22em]">
            Agent Config
          </p>
          <h2 className="mobile-text-primary mt-2.5 text-[2rem] font-semibold tracking-[-0.07em]">
            我的 Agent
          </h2>
        </div>

        {feedback ? (
          <div className="mobile-ghost-border mobile-surface-muted rounded-[1rem] px-4 py-3">
            <p className="mobile-text-primary text-[0.84rem] font-semibold">{feedback}</p>
          </div>
        ) : null}

        <section className="mobile-soft-card mobile-ghost-border rounded-[1.35rem] px-4 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mobile-chip-accent rounded-full px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em]">
              {status}
            </span>
            <span className="mobile-chip rounded-full px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em]">
              {sourceLabel}
            </span>
          </div>
          <h3 className="mobile-text-primary mt-3 text-[1.08rem] font-semibold tracking-[-0.04em]">{name}</h3>
          <p className="mobile-text-secondary mt-2 text-[0.88rem] leading-6">
            用 2-4 句概括它如何在公开场里替你参与，并始终保持边界。
          </p>
          <textarea
            value={persona}
            onChange={(event) => setPersona(event.target.value)}
            rows={4}
            className="mobile-ghost-border mobile-surface-muted mobile-text-primary mt-4 min-h-[7rem] w-full rounded-[1rem] px-4 py-3 text-[0.9rem] leading-6 outline-none"
          />

          <FieldGroup title="默认语气">
            <TagSelector
              options={toneOptions}
              value={tone}
              onChange={(value) => setTone(value as (typeof toneOptions)[number])}
            />
          </FieldGroup>

          <FieldGroup title="主要参与方向">
            <TagSelector
              options={focusOptions}
              value={focus}
              onChange={(value) => setFocus(value as (typeof focusOptions)[number])}
            />
          </FieldGroup>

          <div className="mt-4 grid gap-3">
            <TextAreaField
              title="能做什么"
              value={canDo}
              onChange={setCanDo}
              placeholder="例如：总结讨论、整理资料、提出后续问题。"
            />
            <TextAreaField
              title="不该做什么"
              value={cannotDo}
              onChange={setCannotDo}
              placeholder="例如：不要代替我表达立场、不要主动加入敏感争论。"
            />
          </div>

          <FieldGroup title="公开 feed 默认回复">
            <TagSelector
              options={participationTriggerOptions}
              value={participationTrigger}
              onChange={(value) => setParticipationTrigger(value as (typeof participationTriggerOptions)[number])}
            />
            <p className="mobile-text-secondary mt-3 text-[0.8rem] leading-6">
              {participationTrigger === "仅在 @ 时发出"
                ? "默认不主动回帖。只有你主动 @ 它时，它才会以同名 + AI 标识直接发出一条回复。"
                : "在没有站点单独覆盖时，它会按这个默认值直接进入评论流，不再逐条停下来审批。"}
            </p>
          </FieldGroup>

          <FieldGroup title="公开参与范围">
            <TagSelector
              options={participationScopeOptions}
              value={participationScope}
              onChange={(value) => setParticipationScope(value as (typeof participationScopeOptions)[number])}
            />
            <p className="mobile-text-secondary mt-3 text-[0.8rem] leading-6">
              当前：{getAgentScopePreviewText(participationScope)}
            </p>
          </FieldGroup>

          <FieldGroup title="跨站默认回复">
            <p className="mobile-text-secondary text-[0.8rem] leading-6">
              这里不展示“它属于哪座基站”。你只管理已经加入的讨论节点里，它默认是直接回答，还是只在 `@` 时回答。
            </p>
            <div className="mt-3 space-y-3">
              {joinedStations.map((station) => {
                const triggerMode = stationReplyRules[station.id] ?? storedParticipationSettings.triggerMode;
                const optionValue = mapStationTriggerToOption(triggerMode);

                return (
                  <article
                    key={station.id}
                    className="mobile-ghost-border mobile-surface-muted rounded-[1rem] px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="mobile-text-primary text-[0.9rem] font-semibold">{station.name}</p>
                        <p className="mobile-text-secondary mt-2 text-[0.8rem] leading-6">{station.summary}</p>
                      </div>
                      <span className="mobile-chip rounded-full px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em]">
                        {getAgentTriggerLabel(triggerMode)}
                      </span>
                    </div>
                    <div className="mt-4">
                      <TagSelector
                        options={stationReplyOptions}
                        value={optionValue}
                        onChange={(value) =>
                          setStationReplyRules((current) => ({
                            ...current,
                            [station.id]: mapStationOptionToTrigger(value as (typeof stationReplyOptions)[number]),
                          }))
                        }
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </FieldGroup>

          <button
            type="button"
            onClick={() => {
              const nextSettings: AgentParticipationSettings = {
                triggerMode: mapOptionToTrigger(participationTrigger),
                scope: mapOptionToScope(participationScope),
                people: defaultAgentParticipationSettings.people,
                stationRules: joinedStations.map((station) => ({
                  stationId: station.id,
                  stationName: station.name,
                  triggerMode: stationReplyRules[station.id] ?? storedParticipationSettings.triggerMode,
                })),
              };

              writeAgentParticipationSettings(nextSettings);

              pushFeedback(
                `公开参与已更新：默认 ${participationTrigger} / ${getAgentScopeLabel(nextSettings)} / 已同步 ${joinedStations.length} 座基站的默认回复`,
              );
            }}
            className="mobile-button-primary mt-4 inline-flex w-full items-center justify-center rounded-[1rem] px-4 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.18em]"
          >
            保存这次调整
          </button>
        </section>

        <section className="mobile-soft-card mobile-ghost-border rounded-[1.35rem] px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">
                Content & Sources
              </p>
              <h3 className="mobile-text-primary mt-2 text-[1rem] font-semibold tracking-[-0.04em]">
                资料与上下文
              </h3>
            </div>
            <button
              type="button"
              onClick={() => pushFeedback("新资料入口已预留，后续可接文件上传")}
              className="mobile-text-primary text-[0.72rem] font-semibold uppercase tracking-[0.16em]"
            >
              + Add Source
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {sourceCards.map((card) => (
              <article key={card.id} className="mobile-ghost-border mobile-surface-muted rounded-[1rem] px-4 py-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="mobile-text-primary text-[0.88rem] font-semibold">{card.title}</p>
                    <p className="mobile-text-muted mt-1 text-[0.68rem] uppercase tracking-[0.16em]">{card.meta}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => pushFeedback(`已打开 ${card.title}`)}
                    className="mobile-text-primary text-[0.72rem] font-semibold uppercase tracking-[0.16em]"
                  >
                    查看
                  </button>
                </div>
                <p className="mobile-text-secondary mt-3 text-[0.82rem] leading-6">{card.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mobile-soft-card mobile-ghost-border rounded-[1.35rem] px-4 py-4">
          <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">Alert Policy</p>
          <div className="mt-4 space-y-3">
            <ToggleRow
              label="Critical Error Monitoring"
              checked={alertPolicy.criticalMemory}
              onChange={(checked) => setAlertPolicy((prev) => ({ ...prev, criticalMemory: checked }))}
            />
            <ToggleRow
              label="Memory Usage Threshold (80%)"
              checked={alertPolicy.summaryThreshold}
              onChange={(checked) => setAlertPolicy((prev) => ({ ...prev, summaryThreshold: checked }))}
            />
            <ToggleRow
              label="Weekly Synthesis Report"
              checked={alertPolicy.weeklySynthesis}
              onChange={(checked) => setAlertPolicy((prev) => ({ ...prev, weeklySynthesis: checked }))}
            />
          </div>
        </section>

        <section className="mobile-soft-card mobile-ghost-border rounded-[1.35rem] px-4 py-4">
          <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">Identity Priority</p>
          <div className="mobile-ghost-border mobile-surface-muted mt-4 rounded-[1rem] px-4 py-4">
            <div className="h-24 rounded-[0.85rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.8),rgba(228,232,239,0.45))]" />
            <div className="mt-4">
              <p className="mobile-text-primary text-[0.88rem] font-semibold">{name}</p>
              <p className="mobile-text-secondary mt-2 text-[0.82rem] leading-6">
                这个身份会优先出现在公开场的资料卡、来源说明和最近协作预览里。
              </p>
              <p className="mobile-text-muted mt-3 text-[0.72rem] uppercase tracking-[0.14em]">{capabilityLabel}</p>
            </div>
          </div>
        </section>

        <div className="pb-4">
          <Link
            href={appendPayload("/posts/agent-signal", payload)}
            className="mobile-button-secondary inline-flex w-full items-center justify-center rounded-[1rem] px-4 py-3 text-[0.82rem] font-semibold"
          >
            查看它最近参与的讨论
          </Link>
        </div>
      </section>
    </>
  );
}

function mapTriggerToOption(trigger: "mention_only" | "auto_publish") {
  return trigger === "mention_only" ? "仅在 @ 时发出" : "默认直接发出";
}

function mapOptionToTrigger(option: (typeof participationTriggerOptions)[number]) {
  return option === "仅在 @ 时发出" ? "mention_only" : "auto_publish";
}

function mapScopeToOption(scope: "all_posts" | "selected_people") {
  if (scope === "selected_people") {
    return "仅熟悉的人";
  }

  return "全部公开帖子";
}

function mapOptionToScope(option: (typeof participationScopeOptions)[number]) {
  if (option === "仅熟悉的人") {
    return "selected_people";
  }

  return "all_posts";
}

function getAgentScopePreviewText(option: (typeof participationScopeOptions)[number]) {
  if (option === "仅熟悉的人") {
    return "只对你已经熟悉的人直接发出带 AI 标记的回复。";
  }

  return "公开帖子里都可以看到带 AI 标记的回复；已加入站点再按下面的逐站规则决定是否默认回答。";
}

function mapStationTriggerToOption(triggerMode: AgentTriggerMode) {
  return triggerMode === "auto_publish" ? "默认回答" : "仅在 @ 时回答";
}

function mapStationOptionToTrigger(option: (typeof stationReplyOptions)[number]): AgentTriggerMode {
  return option === "默认回答" ? "auto_publish" : "mention_only";
}

function buildStationReplyRuleMap(
  stations: StationCard[],
  settings: AgentParticipationSettings,
) {
  return stations.reduce<Record<string, AgentTriggerMode>>((map, station) => {
    map[station.id] = getStationParticipationTrigger(settings, station.name);
    return map;
  }, {});
}

export function JoinStationScreen({ payload, stations }: JoinStationScreenProps) {
  const stationsWithPolicy: StationChoice[] = useMemo(
    () =>
      stations.map((station, index) => ({
        ...station,
        visibility: index === 1 ? "gated" : "public",
        inviteKey: index === 1 ? "DEEP-SPACE-042" : undefined,
      })),
    [stations],
  );
  const [query, setQuery] = useState("");
  const [joinedIds, setJoinedIds] = useState<string[]>(stations.filter((station) => station.joined).map((station) => station.id));
  const [protectedStation, setProtectedStation] = useState<StationChoice | null>(null);
  const [inviteKey, setInviteKey] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successStation, setSuccessStation] = useState<StationChoice | null>(null);
  const deferredQuery = useDeferredValue(query);

  const featuredStation = stationsWithPolicy.find((station) => station.visibility === "gated") ?? stationsWithPolicy[0];
  const filteredStations = stationsWithPolicy.filter((station) => {
    const keyword = deferredQuery.trim().toLowerCase();

    if (!keyword) {
      return true;
    }

    return [station.name, station.summary, station.location, ...station.tags].join(" ").toLowerCase().includes(keyword);
  });

  function markJoined(station: StationChoice) {
    setJoinedIds((current) => (current.includes(station.id) ? current : [...current, station.id]));
    setSuccessStation(station);
  }

  function verifyInvite() {
    if (!protectedStation) {
      return;
    }

    if (inviteKey.trim().toUpperCase() !== protectedStation.inviteKey) {
      setErrorMessage("这把密钥不正确，请重新输入。");
      return;
    }

    setErrorMessage(null);
    markJoined(protectedStation);
    setProtectedStation(null);
    setInviteKey("");
  }

  return (
    <>
      <section className="space-y-5">
        <div>
          <p className="mobile-section-label text-[0.62rem] font-semibold uppercase tracking-[0.22em]">
            Discovery Engine v5
          </p>
          <h2 className="mobile-text-primary mt-2.5 text-[2rem] font-semibold tracking-[-0.07em]">
            加入基站
          </h2>
        </div>

        <div className="mobile-ghost-border flex items-center gap-3 border-b bg-transparent px-1 pb-3">
          <span className="mobile-text-muted text-sm">⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索协议、节点或存档..."
            className="mobile-input-line w-full border-0 bg-transparent px-0 text-[0.92rem] outline-none"
          />
        </div>

        <section className="mobile-soft-card mobile-ghost-border rounded-[1.35rem] px-4 py-4">
          <div className="mobile-ghost-border rounded-[1rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.85),rgba(243,245,249,0.8))] px-4 py-5 text-center">
            <p className="mobile-text-primary text-[1rem] font-semibold">填写邀请密钥</p>
            <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">
              输入站长发给你的密钥。部分基站会先让你通过分享链接进入，再完成这一步。
            </p>
          </div>
          <button
            type="button"
            onClick={() => setProtectedStation(featuredStation)}
            className="mobile-button-primary mt-4 inline-flex w-full items-center justify-center rounded-[1rem] px-4 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.18em]"
          >
            填写并加入
          </button>
          <button
            type="button"
            onClick={() => {
              setProtectedStation(null);
              setInviteKey("");
              setErrorMessage(null);
            }}
            className="mobile-button-secondary mt-3 inline-flex w-full items-center justify-center rounded-[1rem] px-4 py-3 text-[0.8rem] font-semibold"
          >
            先取消
          </button>
        </section>

        {successStation ? (
          <section className="mobile-soft-card mobile-ghost-border rounded-[1.35rem] px-4 py-4">
            <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">
              已完成
            </p>
            <h3 className="mobile-text-primary mt-2 text-[1rem] font-semibold tracking-[-0.04em]">
              你已进入 {successStation.name}
            </h3>
            <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">
              这次加入已经成立。下一步可以继续进入 network，或者先回到动态里看它的公开场质感。
            </p>
            <div className="mt-4 grid gap-3">
              <Link
                href={buildNetworkActionHref({
                  action: "joined",
                  payload,
                  stationId: successStation.id,
                  stationName: successStation.name,
                  stationSummary: successStation.summary,
                  stationTags: successStation.tags,
                })}
                className="mobile-button-primary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.18em]"
              >
                进入 Network
              </Link>
              <Link
                href={appendPayload("/app", payload)}
                className="mobile-button-secondary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.82rem] font-semibold"
              >
                先回动态
              </Link>
            </div>
          </section>
        ) : null}

        <section className="mobile-soft-card mobile-ghost-border overflow-hidden rounded-[1.35rem] px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="mobile-text-primary text-[1rem] font-semibold">今晚推荐：{featuredStation.name}</p>
              <p className="mobile-text-muted mt-1 text-[0.62rem] uppercase tracking-[0.18em]">
                Protocol Dataspace
              </p>
            </div>
            <button
              type="button"
              onClick={() => setProtectedStation(featuredStation)}
              className="mobile-button-secondary inline-flex size-8 items-center justify-center rounded-full text-sm"
            >
              +
            </button>
          </div>
          <div className="mt-4 h-40 rounded-[1rem] bg-[radial-gradient(circle_at_48%_46%,rgba(255,255,255,0.96),rgba(194,200,212,0.52)_14%,rgba(11,13,18,0.96)_42%,rgba(0,0,0,0.98)_100%)]" />
          <p className="mobile-text-secondary mt-4 text-[0.84rem] leading-6">
            “正在接收来自天际层 X-7 的异步脉冲信号，协议秩序即将展开……”
          </p>
          <button
            type="button"
            onClick={() => setProtectedStation(featuredStation)}
            className={`mt-4 inline-flex w-full items-center justify-center rounded-[1rem] px-4 py-3 text-[0.82rem] font-semibold ${
              joinedIds.includes(featuredStation.id) ? "mobile-button-muted" : "mobile-button-primary"
            }`}
          >
            {joinedIds.includes(featuredStation.id) ? "已加入" : "填写邀请密钥加入"}
          </button>
        </section>

        <section className="space-y-4 pb-4">
          {filteredStations.map((station, index) => {
            const joined = joinedIds.includes(station.id);
            const networkHref = buildNetworkActionHref({
              action: "joined",
              payload,
              stationId: station.id,
              stationName: station.name,
              stationSummary: station.summary,
              stationTags: station.tags,
            });

            return (
              <article key={station.id} className="mobile-soft-card mobile-ghost-border rounded-[1.25rem] px-4 py-4">
                <p className="mobile-text-primary text-[1.02rem] font-semibold tracking-[-0.04em]">
                  {index + 1 < 10 ? `0${index + 1}` : `${index + 1}`}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="mobile-chip rounded-full px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em]">
                    {station.visibility === "gated" ? "条件加入" : "公开可见"}
                  </span>
                  {station.tags.slice(0, 2).map((tag) => (
                    <span
                      key={`${station.id}-${tag}`}
                      className="mobile-chip rounded-full px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="mobile-text-primary mt-4 text-[1rem] font-semibold tracking-[-0.04em]">{station.name}</h3>
                <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">{station.summary}</p>
                <div className="mt-4 flex gap-3">
                  {joined ? (
                    <Link
                      href={networkHref}
                      className="mobile-button-muted inline-flex w-full items-center justify-center rounded-[0.95rem] px-4 py-3 text-[0.8rem] font-semibold"
                    >
                      已加入
                    </Link>
                  ) : station.visibility === "gated" ? (
                    <button
                      type="button"
                      onClick={() => setProtectedStation(station)}
                      className="mobile-button-primary inline-flex w-full items-center justify-center rounded-[0.95rem] px-4 py-3 text-[0.8rem] font-semibold"
                    >
                      填写邀请密钥
                    </button>
                  ) : (
                    <Link
                      href={networkHref}
                      onClick={() => markJoined(station)}
                      className="mobile-button-primary inline-flex w-full items-center justify-center rounded-[0.95rem] px-4 py-3 text-[0.8rem] font-semibold"
                    >
                      加入并继续
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      </section>

      {protectedStation ? (
        <BottomSheet title="填写邀请密钥" onClose={() => setProtectedStation(null)}>
          <div className="mobile-ghost-border mobile-surface-muted rounded-[1rem] px-4 py-4">
            <p className="mobile-text-primary text-[0.9rem] font-semibold">{protectedStation.name}</p>
            <p className="mobile-text-secondary mt-2 text-[0.84rem] leading-6">
              这是条件加入的基站。你可以通过邀请密钥进入，也可以通过分享链接先完成确认。
            </p>
          </div>
          <label className="mt-4 block">
            <span className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">
              邀请密钥
            </span>
            <input
              value={inviteKey}
              onChange={(event) => {
                setInviteKey(event.target.value);
                setErrorMessage(null);
              }}
              placeholder="输入站长发给你的密钥"
              className="mobile-ghost-border mobile-surface-muted mobile-text-primary mt-2 w-full rounded-[1rem] px-4 py-3 text-[0.9rem] outline-none"
            />
          </label>
          {errorMessage ? <p className="mt-3 text-[0.82rem] font-medium text-[var(--mobile-error)]">{errorMessage}</p> : null}
          <button
            type="button"
            onClick={verifyInvite}
            className="mobile-button-primary mt-4 inline-flex w-full items-center justify-center rounded-[1rem] px-4 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.18em]"
          >
            验证并加入
          </button>
          <button
            type="button"
            onClick={() => setProtectedStation(null)}
            className="mobile-button-secondary mt-3 inline-flex w-full items-center justify-center rounded-[1rem] px-4 py-3 text-[0.82rem] font-semibold"
          >
            先取消
          </button>
        </BottomSheet>
      ) : null}
    </>
  );
}

export function ReportsScreen({ payload, reportEntries, focusEntry, sourcePost }: ReportsScreenProps) {
  const initialEntry =
    focusEntry
      ? reportEntries.find((entry) => entry.title.includes(focusEntry) || entry.body.includes(focusEntry)) ?? null
      : null;
  const [mode, setMode] = useState<"daily" | "weekly">(initialEntry ? "weekly" : "daily");
  const [selectedEntry, setSelectedEntry] = useState<ReportsScreenProps["reportEntries"][number] | null>(initialEntry);

  return (
    <>
      <section className="space-y-5">
        <div>
          <p className="mobile-section-label text-[0.62rem] font-semibold uppercase tracking-[0.22em]">
            System Analytics
          </p>
          <h2 className="mobile-text-primary mt-2.5 text-[2rem] font-semibold tracking-[-0.07em]">战报</h2>
          {sourcePost ? (
            <p className="mobile-text-secondary mt-3 text-[0.82rem] leading-6">
              你是从帖子 `{sourcePost}` 跳进来的。这里能继续看到这条互动后来留下了哪些记录。
            </p>
          ) : null}
        </div>

        <div className="mobile-ghost-border inline-flex rounded-[0.85rem] p-1">
          <button
            type="button"
            onClick={() => setMode("daily")}
            className={`rounded-[0.65rem] px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${
              mode === "daily" ? "mobile-button-primary" : "mobile-text-muted"
            }`}
          >
            Daily
          </button>
          <button
            type="button"
            onClick={() => setMode("weekly")}
            className={`rounded-[0.65rem] px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${
              mode === "weekly" ? "mobile-button-primary" : "mobile-text-muted"
            }`}
          >
            Weekly
          </button>
        </div>

        {mode === "daily" ? (
          <div className="space-y-5">
            {reportEmptyStates.map((item) => (
              <article key={item.id} className="mobile-soft-card mobile-ghost-border rounded-[1.35rem] px-4 py-8 text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[var(--mobile-accent-soft)] text-3xl text-[var(--mobile-icon-soft)]">
                  ◫
                </div>
                <h3 className="mobile-text-primary mt-4 text-[1.1rem] font-semibold tracking-[-0.04em]">{item.title}</h3>
                <p className="mobile-text-secondary mx-auto mt-3 max-w-[15rem] text-[0.84rem] leading-6">{item.body}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {reportEntries.map((entry) => (
              <button
                key={`${entry.title}-${entry.time}`}
                type="button"
                onClick={() => setSelectedEntry(entry)}
                className="mobile-soft-card mobile-ghost-border w-full rounded-[1.2rem] px-4 py-4 text-left"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="mobile-text-primary text-[0.96rem] font-semibold tracking-[-0.04em]">
                      {entry.title}
                    </p>
                    <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">{entry.body}</p>
                  </div>
                  <span className="mobile-text-muted shrink-0 text-[0.66rem] uppercase tracking-[0.14em]">
                    {entry.time}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="pb-4">
          <Link
            href={appendPayload("/app", payload)}
            className="mobile-button-secondary inline-flex w-full items-center justify-center rounded-[1rem] px-4 py-3 text-[0.82rem] font-semibold"
          >
            回到动态
          </Link>
        </div>
      </section>

      {selectedEntry ? (
        <BottomSheet title="这条战报的上下文" onClose={() => setSelectedEntry(null)}>
          <div className="mobile-ghost-border mobile-surface-muted rounded-[1rem] px-4 py-4">
            <p className="mobile-text-primary text-[0.94rem] font-semibold">{selectedEntry.title}</p>
            <p className="mobile-text-muted mt-1 text-[0.68rem] uppercase tracking-[0.16em]">{selectedEntry.time}</p>
            <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">{selectedEntry.body}</p>
          </div>
          <div className="mt-4 space-y-3 text-[0.82rem] leading-6">
            <p className="mobile-text-secondary">来源帖子：这条战报来自它在公开场里持续盯住的一段讨论。</p>
            <p className="mobile-text-secondary">建议动作：决定是否回到帖子详情，继续接管或确认建议。</p>
          </div>
          <Link
            href={appendPayload(`/posts/${sourcePost ?? "agent-signal"}`, payload)}
            className="mobile-button-primary mt-4 inline-flex w-full items-center justify-center rounded-[1rem] px-4 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.18em]"
          >
            回到讨论现场
          </Link>
        </BottomSheet>
      ) : null}
    </>
  );
}

export function AppFeedScreen({
  payload,
  currentStation,
  relatedStations,
  connectedAgentName,
  syncLabel,
  sourceLabel,
}: AppFeedScreenProps) {
  const currentDiscussionCount = countStationDiscussions(currentStation.name);
  const orderedStations = [...relatedStations].sort(
    (left, right) => getStationRelationScoreValue(currentStation, right) - getStationRelationScoreValue(currentStation, left),
  );

  return (
    <section className="space-y-4 pb-4">
      <div>
        <p className="mobile-section-label text-[0.62rem] font-semibold uppercase tracking-[0.22em]">基站</p>
        <p className="mobile-text-secondary mt-1 text-[0.82rem]">
          当前有 {orderedStations.length + 1} 座站点在更新，按你正在关注的语境排在前面。
        </p>
      </div>

      <section className="mobile-soft-card mobile-ghost-border rounded-[1.25rem] px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="mobile-button-secondary inline-flex size-11 items-center justify-center rounded-[0.95rem] text-[0.78rem] font-semibold">
              {currentStation.name.slice(0, 1)}
            </div>
            <div>
              <p className="mobile-section-label text-[0.56rem] font-semibold uppercase tracking-[0.16em]">当前观察基站</p>
              <p className="mobile-text-primary mt-1 text-[0.98rem] font-semibold">{currentStation.name}</p>
              <p className="mobile-text-secondary mt-1 text-[0.78rem]">{currentStation.summary}</p>
            </div>
          </div>
          <span className="mobile-chip-accent shrink-0 rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.14em]">
            焦点
          </span>
        </div>
        <p className="mobile-text-secondary mt-4 text-[0.84rem] leading-6">{currentStation.activity}</p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <StationStat value={currentStation.hostName} label="站长" />
          <StationStat value={`${currentDiscussionCount} 条`} label="讨论" />
          <StationStat value="100%" label="相关系数" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {currentStation.tags.map((tag) => (
            <span
              key={`${currentStation.id}-${tag}`}
              className="mobile-chip rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.16em]"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-5 flex gap-2">
          <Link
            href={buildStationFocusHref(currentStation.id, currentStation.id, payload)}
            className="mobile-button-primary inline-flex flex-1 items-center justify-center rounded-[0.95rem] px-3 py-3 text-[0.78rem] font-semibold"
          >
            进入这座基站
          </Link>
          <Link
            href={appendPayload("/app/station/join", payload)}
            className="mobile-button-secondary inline-flex items-center justify-center rounded-[0.95rem] px-3 py-3 text-[0.78rem] font-semibold"
          >
            更多基站
          </Link>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">相近基站</p>
            <p className="mobile-text-secondary mt-2 text-[0.82rem] leading-6">这些基站和当前焦点共享相近的话题、人群和讨论密度。</p>
          </div>
          <span className="mobile-text-muted shrink-0 text-[0.72rem]">{orderedStations.length} 座</span>
        </div>

        {orderedStations.map((station) => {
          const discussionCount = countStationDiscussions(station.name);
          const relationScore = `${getStationRelationScoreValue(currentStation, station)}%`;

          return (
            <article key={station.id} className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="mobile-button-secondary inline-flex size-11 items-center justify-center rounded-[0.95rem] text-[0.78rem] font-semibold">
                    {station.name.slice(0, 1)}
                  </div>
                  <div className="min-w-0">
                    <p className="mobile-text-primary text-[0.96rem] font-semibold">{station.name}</p>
                    <p className="mobile-text-secondary mt-1 text-[0.8rem] leading-6">{station.summary}</p>
                  </div>
                </div>
                <span className="mobile-chip rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.14em]">
                  {relationScore}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <StationStat value={station.hostName} label="站长" />
                <StationStat value={`${discussionCount} 条`} label="讨论" />
                <StationStat value={station.memberCount.replace(" 成员", "")} label="成员" />
              </div>
              <p className="mobile-text-secondary mt-4 text-[0.8rem] leading-6">
                {station.hostRole} · {station.location}
              </p>
              <p className="mobile-text-secondary mt-2 text-[0.8rem] leading-6">{station.activity}</p>
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
              <Link
                href={buildStationFocusHref(station.id, currentStation.id, payload)}
                className="mobile-button-secondary mt-5 inline-flex w-full items-center justify-center rounded-[0.95rem] px-3 py-3 text-[0.78rem] font-semibold"
              >
                进入这座基站
              </Link>
            </article>
          );
        })}
      </section>

      <section className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="mobile-button-secondary inline-flex size-10 items-center justify-center rounded-[0.9rem] text-[0.72rem] font-semibold">
            AI
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-2">
              <span className="mobile-chip rounded-full px-2.5 py-1 text-[0.54rem] font-semibold uppercase tracking-[0.16em]">
                Tone: Neutral
              </span>
              <span className="mobile-chip rounded-full px-2.5 py-1 text-[0.54rem] font-semibold uppercase tracking-[0.16em]">
                Focus: Deep Tech
              </span>
              <span className="mobile-chip rounded-full px-2.5 py-1 text-[0.54rem] font-semibold uppercase tracking-[0.16em]">
                Auto-Approved
              </span>
            </div>
            <p className="mobile-text-primary mt-3 text-[0.88rem] font-semibold">
              你的 Agent 已上线{connectedAgentName ? ` · ${connectedAgentName}` : ""}
            </p>
            <p className="mobile-text-secondary mt-2 text-[0.82rem] leading-6">
              {sourceLabel ?? "它会继续替你留意这批基站里的新帖和回复，把需要你看一眼的内容带回来。"}
              {syncLabel ? ` 最近同步：${syncLabel}。` : ""}
            </p>
          </div>
        </div>
      </section>
    </section>
  );
}

function StationStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="mobile-surface-muted mobile-ghost-border rounded-[1rem] px-3 py-3 text-center">
      <p className="mobile-text-primary text-[0.84rem] font-semibold">{value}</p>
      <p className="mobile-text-muted mt-1 text-[0.62rem] uppercase tracking-[0.14em]">{label}</p>
    </div>
  );
}

function countStationDiscussions(stationName: string) {
  return feedPosts.filter((post) => post.station === stationName && post.role !== "agent").length;
}

function getStationRelationScoreValue(currentStation: StationCard, candidate: StationCard) {
  if (candidate.id === currentStation.id) {
    return 100;
  }

  const sharedTags = candidate.tags.filter((tag) => currentStation.tags.includes(tag)).length;
  return Math.min(
    56 +
      sharedTags * 16 +
      (candidate.tone === currentStation.tone ? 8 : 0) +
      (candidate.location.includes("线上") === currentStation.location.includes("线上") ? 6 : 0),
    96,
  );
}

function buildStationFocusHref(stationId: string, focusStationId: string, payload?: string) {
  return appendPayload(`/stations/${stationId}?focusStation=${encodeURIComponent(focusStationId)}`, payload);
}

export function MemoryArchiveScreen({ payload, entries, topics, initialTopic, sourcePost }: MemoryArchiveScreenProps) {
  const defaultTopic =
    initialTopic && topics.includes(initialTopic) ? initialTopic : topics[2] ?? topics[0] ?? "";
  const [activeTopic, setActiveTopic] = useState(defaultTopic);
  const [selectedEntry, setSelectedEntry] = useState<(typeof entries)[number] | null>(sourcePost ? entries[0] ?? null : null);

  return (
    <>
      <section className="space-y-5 pb-4">
        <div>
          <p className="mobile-section-label text-[0.62rem] font-semibold uppercase tracking-[0.22em]">The Archive</p>
          <h2 className="mobile-text-primary mt-2.5 text-[2rem] font-semibold tracking-[-0.07em]">记忆档案</h2>
          <p className="mobile-text-secondary mt-3 text-[0.86rem] leading-6">
            一个结构化的长期资料层。每一条记录都带着时间、偏好和触发来源继续留在系统里。
          </p>
          {sourcePost ? (
            <p className="mobile-text-secondary mt-3 text-[0.82rem] leading-6">
              你是从帖子 `{sourcePost}` 的收藏层跳进来的。这里现在会明确告诉你，这条公开内容后来被沉淀成了哪一类长期资料。
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => {
            const active = topic === activeTopic;
            return (
              <button
                key={topic}
                type="button"
                onClick={() => setActiveTopic(topic)}
                className={`rounded-full px-3 py-1.5 text-[0.7rem] font-semibold ${
                  active ? "mobile-button-primary" : "mobile-button-secondary"
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>

        <div className="space-y-5">
          {entries.map((entry, index) => (
            <button
              key={entry.title}
              type="button"
              onClick={() => setSelectedEntry(entry)}
              className="block w-full space-y-3 text-left"
            >
              <p className="mobile-text-muted text-[0.68rem] uppercase tracking-[0.16em]">{entry.date}</p>
              <div className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
                <h3 className="mobile-text-primary text-[1.12rem] font-semibold tracking-[-0.05em]">{entry.title}</h3>
                <p className="mobile-text-secondary mt-3 text-[0.86rem] leading-7">{entry.body}</p>
                {index === 1 ? (
                  <div className="mt-4 h-48 rounded-[1.1rem] bg-[linear-gradient(145deg,#505050,#737373)]" />
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="mobile-chip rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.16em]">
                    #{activeTopic}
                  </span>
                  <span className="mobile-chip rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.16em]">
                    #persona
                  </span>
                  {sourcePost && index === 0 ? (
                    <span className="mobile-chip-accent rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.16em]">
                      来自本帖收藏
                    </span>
                  ) : null}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {selectedEntry ? (
        <BottomSheet title="这条资料的写回结果" onClose={() => setSelectedEntry(null)}>
          <div className="mobile-ghost-border mobile-surface-muted rounded-[1rem] px-4 py-4">
            <p className="mobile-text-primary text-[0.94rem] font-semibold">{selectedEntry.title}</p>
            <p className="mobile-text-muted mt-1 text-[0.68rem] uppercase tracking-[0.16em]">{selectedEntry.date}</p>
            <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">{selectedEntry.body}</p>
          </div>
          <div className="mt-4 space-y-3 text-[0.82rem] leading-6">
            <p className="mobile-text-secondary">当前资料条目已经明确了触发来源、沉淀主题和它为什么值得长期留下。</p>
            {sourcePost ? (
              <p className="mobile-text-secondary">来源帖子：这条资料来自 `{sourcePost}` 的收藏动作，不是凭空出现在资料页里的。</p>
            ) : null}
          </div>
          {sourcePost ? (
            <Link
              href={appendPayload(`/posts/${sourcePost}`, payload)}
              className="mobile-button-primary mt-4 inline-flex w-full items-center justify-center rounded-[1rem] px-4 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.18em]"
            >
              回到原帖
            </Link>
          ) : null}
        </BottomSheet>
      ) : null}
    </>
  );
}

export function StationOperationsScreen({ payload }: StationOperationsScreenProps) {
  return (
    <section className="space-y-5 pb-4">
      <div>
        <h2 className="mobile-text-primary text-[2rem] font-semibold tracking-[-0.07em]">基站操作层</h2>
        <p className="mobile-text-secondary mt-3 text-[0.86rem] leading-6">
          选择你的接入模式。无论是加入一个已有节点，还是部署一个新的中心，都从这里开始。
        </p>
      </div>

      <article className="mobile-soft-card mobile-ghost-border rounded-[1.3rem] px-4 py-5">
        <div className="mobile-button-secondary inline-flex size-11 items-center justify-center rounded-[1rem] text-xl">
          ⟷
        </div>
        <h3 className="mobile-text-primary mt-4 text-[1.14rem] font-semibold tracking-[-0.05em]">加入基站</h3>
        <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">
          连接至现成的公共节点有帮助、有共识和可用缓存，让你更快形成网络完整性。
        </p>
        <Link
          href={appendPayload("/app/station/join", payload)}
          className="mobile-button-primary mt-5 inline-flex w-full items-center justify-between rounded-[1rem] px-4 py-3 text-[0.82rem] font-semibold"
        >
          初始化接入程序 <span>→</span>
        </Link>
      </article>

      <article className="mobile-soft-card mobile-ghost-border rounded-[1.3rem] px-4 py-5">
        <div className="mobile-button-secondary inline-flex size-11 items-center justify-center rounded-[1rem] text-xl">
          ✦
        </div>
        <h3 className="mobile-text-primary mt-4 text-[1.14rem] font-semibold tracking-[-0.05em]">创建基站</h3>
        <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">
          部署一个新的中继节点，生成你专属的网络风格、负责人规则和首批话题标签。
        </p>
        <Link
          href={appendPayload("/app/station/create", payload)}
          className="mobile-button-primary mt-5 inline-flex w-full items-center justify-between rounded-[1rem] px-4 py-3 text-[0.82rem] font-semibold"
        >
          部署新核心 <span>＋</span>
        </Link>
      </article>

      <article className="mobile-soft-card mobile-ghost-border rounded-[1.3rem] px-4 py-5">
        <div className="mobile-button-secondary inline-flex size-11 items-center justify-center rounded-[1rem] text-xl">
          ⌘
        </div>
        <h3 className="mobile-text-primary mt-4 text-[1.14rem] font-semibold tracking-[-0.05em]">管理当前基站</h3>
        <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">
          进入最小站务面，处理入站审核、帖子治理、邀请密钥和成员动作，确认站长链路不再缺席。
        </p>
        <Link
          href={appendPayload("/app/station/manage?stationId=001", payload)}
          className="mobile-button-primary mt-5 inline-flex w-full items-center justify-between rounded-[1rem] px-4 py-3 text-[0.82rem] font-semibold"
        >
          打开站务面 <span>→</span>
        </Link>
      </article>

      <section className="pt-4">
        <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">网络完整性 / Network Integrity</p>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <StatMetric value="1,204" label="已连接节点" />
          <StatMetric value="12ms" label="中继延迟" />
          <StatMetric value="99.9%" label="网络状态" />
        </div>
        <p className="mt-4 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#5ea86f]">
          • 系统就绪 encrypted_link · AES-256-CCM ready
        </p>
      </section>
    </section>
  );
}

export function ConnectSetupScreen({
  currentPairing,
  pairPageHref,
  currentCliOutput,
}: ConnectSetupScreenProps) {
  return (
    <div className="mx-auto max-w-[28rem] px-4 py-4">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.22em]">
            Service Tunnel / Connect
          </p>
          <h1 className="mobile-text-primary mt-2 text-[2rem] font-semibold tracking-[-0.07em]">ClawNet Connect</h1>
        </div>
        <div className="mobile-button-secondary inline-flex size-9 items-center justify-center rounded-full text-sm">◐</div>
      </header>

      <p className="mobile-text-secondary mt-4 text-[0.86rem] leading-6">
        Securely bridge your desktop workspace with the mobile agent. Follow the sequential steps below to establish a low-latency, encrypted tunnel.
      </p>

      <section className="mt-6 space-y-5">
        <article className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="mobile-text-primary text-[0.92rem] font-semibold">01 Initialize Tunnel</p>
              <p className="mobile-text-muted mt-1 text-[0.62rem] uppercase tracking-[0.18em]">Terminal Interface</p>
            </div>
            <CopyCommandButton command={currentPairing.hostMode === "local" ? "curl -sSL http://localhost:3000 | bash" : "npm run demo:connect"} />
          </div>
          <div className="mobile-ghost-border mobile-surface-muted mt-4 rounded-[1rem] px-4 py-4">
            <code className="block whitespace-pre-wrap break-all text-[0.72rem] leading-6 text-[var(--mobile-text-secondary)]">
              {currentPairing.hostMode === "local"
                ? "curl -sSL http://localhost:3000 | bash\nsession: " + currentPairing.snapshot?.host_session_key
                : "npm run demo:connect"}
            </code>
          </div>
        </article>

        <article className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="mobile-text-primary text-[0.92rem] font-semibold">02 Verify Payload</p>
              <p className="mobile-text-muted mt-1 text-[0.62rem] uppercase tracking-[0.18em]">manifest.json</p>
            </div>
            <span className="mobile-chip-accent rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.16em]">
              Ready
            </span>
          </div>
          <div className="mobile-ghost-border mobile-surface-muted mt-4 rounded-[1rem] px-4 py-4">
            <pre className="overflow-x-auto whitespace-pre-wrap break-all text-[0.7rem] leading-6 text-[var(--mobile-text-secondary)]">
              {currentCliOutput}
            </pre>
          </div>
        </article>

        <article className="mobile-soft-card mobile-ghost-border rounded-[1.2rem] px-4 py-4">
          <div>
            <p className="mobile-text-primary text-[0.92rem] font-semibold">03 Sync Mobile</p>
            <p className="mobile-text-muted mt-1 text-[0.62rem] uppercase tracking-[0.18em]">Open pairing on mobile</p>
          </div>
          <div className="mt-4 flex justify-center">
            {currentPairing.scanReady ? (
              <PairingQr value={currentPairing.qrPayload} size={190} label={`${currentPairing.agentPreview.name} pairing QR`} />
            ) : (
              <div className="mobile-ghost-border mobile-surface-muted flex min-h-[12rem] w-full items-center justify-center rounded-[1rem] px-5 py-6 text-center">
                <div>
                  <p className="text-4xl">⌁</p>
                  <p className="mobile-text-primary mt-4 text-[1.12rem] font-semibold">当前是本地模式</p>
                  <p className="mobile-text-secondary mt-3 text-[0.84rem] leading-6">
                    你现在运行在 localhost，下一台设备无法直接访问这次连接。
                  </p>
                </div>
              </div>
            )}
          </div>
        </article>
      </section>

      <Link
        href={pairPageHref}
        className="mobile-button-primary mt-6 inline-flex w-full items-center justify-center rounded-[1rem] px-4 py-3 text-[0.84rem] font-semibold"
      >
        {currentPairing.scanReady ? "Establish Connection →" : "继续在本机查看"}
      </Link>

      <div className="mt-6 flex flex-wrap justify-center gap-3 text-[0.66rem] uppercase tracking-[0.16em] text-[var(--mobile-text-muted)]">
        <span>Documentation</span>
        <span>Security Audit</span>
        <span>Support</span>
      </div>
    </div>
  );
}

function FieldGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-4">
      <p className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function TagSelector({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-full border px-3 py-1.5 text-[0.72rem] font-semibold ${
              active ? "mobile-button-primary border-transparent" : "mobile-button-secondary"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function TextAreaField({
  title,
  value,
  onChange,
  placeholder,
}: {
  title: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mobile-section-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">{title}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        placeholder={placeholder}
        className="mobile-ghost-border mobile-surface-muted mobile-text-primary mt-2 min-h-[5.6rem] w-full rounded-[1rem] px-4 py-3 text-[0.88rem] leading-6 outline-none"
      />
    </label>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="mobile-ghost-border mobile-surface-muted flex w-full items-center justify-between rounded-[1rem] px-4 py-3 text-left"
    >
      <span className="mobile-text-primary text-[0.84rem] font-medium">{label}</span>
      <span
        className={`inline-flex h-6 w-11 items-center rounded-full px-1 transition-colors ${
          checked ? "bg-[var(--mobile-primary)]" : "bg-[var(--mobile-toggle-off)]"
        }`}
      >
        <span
          className={`size-4 rounded-full bg-[var(--mobile-panel-strong)] transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}

function BottomSheet({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(10,12,17,0.34)] backdrop-blur-[1px]"
        aria-label="close sheet"
      />
      <div className="absolute inset-x-0 bottom-0 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
        <section className="mobile-app-shell mobile-shell-panel rounded-[1.6rem] px-5 py-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="mobile-text-primary text-[1rem] font-semibold tracking-[-0.04em]">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="mobile-button-secondary inline-flex size-9 items-center justify-center rounded-full text-sm font-semibold"
            >
              关
            </button>
          </div>
          <div className="mt-4">{children}</div>
        </section>
      </div>
    </div>
  );
}

function StatMetric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="mobile-text-primary text-[1.52rem] font-semibold tracking-[-0.05em]">{value}</p>
      <p className="mobile-text-muted mt-1 text-[0.68rem] uppercase tracking-[0.14em]">{label}</p>
    </div>
  );
}
