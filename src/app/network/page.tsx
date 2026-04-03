import Link from "next/link";
import { SectionTag } from "@/components/mobile/cards";
import { stationCards } from "@/components/mobile/mock-data";
import { MobileShell } from "@/components/mobile/mobile-shell";
import {
  appendSearchParams,
  decodePairingPayload,
  getSingleQueryValue,
} from "@/lib/connect-demo";
import {
  type NetworkSearchParams,
  type StationActionState,
  readStationActionState,
} from "@/lib/network-demo";

type NodeType = "中心站" | "社区基站" | "自部署节点";

type NetworkNode = {
  id: string;
  name: string;
  type: NodeType;
  status: string;
  summary: string;
  tags: string[];
  emphasis?: boolean;
};

export default async function NetworkPage({
  searchParams,
}: {
  searchParams: Promise<NetworkSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const payload = getSingleQueryValue(resolvedSearchParams.payload);
  const connectedAgent = decodePairingPayload(payload);
  const stationState = readStationActionState(resolvedSearchParams);
  const nodes = buildNetworkNodes(stationState);
  const actionCopy = getActionCopy(stationState);

  return (
    <MobileShell
      activeNav="station"
      pairingPayload={payload}
      statusLabel={stationState ? "已连接" : "网络中"}
    >
      <section className="mobile-emphasis-card rounded-[1.5rem] px-5 py-5">
        <div className="flex flex-wrap gap-2">
          <Pill>{stationState ? `joined ${stationState.stationName}` : "public mode"}</Pill>
        </div>
        <h2 className="mobile-emphasis-text mt-3 text-[2rem] font-semibold tracking-[-0.07em]">Network Layer</h2>
        <p className="mobile-emphasis-muted mt-3 text-[0.88rem] leading-6">
          {connectedAgent
            ? `${connectedAgent.name} 已接入这张网络，你现在看到的是它会穿过的中心站、社区基站和后续节点。`
            : "你正在看当前加入动作落到哪一层。先把结构看懂，再继续把 Agent 接进来。"}
        </p>
      </section>

      <section className="mobile-soft-card mobile-ghost-border mt-6 rounded-[1.4rem] px-4 py-5">
        <div className="space-y-3">
          {nodes.slice(0, 4).map((node, index) => (
            <div
              key={node.id}
              className={`rounded-[1rem] border px-4 py-3 ${
                index === 1 ? "mobile-emphasis-card border-transparent" : "mobile-surface-muted border-[var(--mobile-border)]"
              }`}
            >
              <p className={`text-[0.58rem] font-semibold uppercase tracking-[0.18em] ${index === 1 ? "mobile-emphasis-muted" : "mobile-text-muted"}`}>
                {node.type}
              </p>
              <p className={`mt-2 text-[0.92rem] font-semibold ${index === 1 ? "mobile-emphasis-text" : "mobile-text-primary"}`}>
                {node.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <SectionTag>System Status</SectionTag>
        <h3 className="mobile-text-primary mt-2.5 text-[1.42rem] font-semibold tracking-[-0.05em]">
          {actionCopy.title}
        </h3>
        <p className="mobile-text-secondary mt-3 text-[0.88rem] leading-6">{actionCopy.body}</p>
      </section>

      <section className="mt-5 grid grid-cols-2 gap-3">
        <StatusCard label="连接成功率" value="99.9%" note="UPTIME" />
        <StatusCard label="加密层" value="P2P-AES" note="ENCRYPTION" />
      </section>

      {stationState ? (
        <section className="mt-6 grid gap-3">
          <Link
            href={appendSearchParams(connectedAgent ? "/app" : "/connect", { payload })}
            className="mobile-button-primary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.84rem] font-semibold"
          >
            {connectedAgent ? "Return to Feed" : "Connect my Agent"}
          </Link>
          <Link
            href={appendSearchParams("/app", { payload })}
            className="mobile-button-secondary inline-flex items-center justify-center rounded-[1rem] px-4 py-3 text-[0.84rem] font-semibold"
          >
            Return to Feed
          </Link>
        </section>
      ) : null}

      <section className="mt-6 grid gap-3 pb-4">
        <FeatureCard
          title="Multi-Relay Protocol"
          body="中心站、社区基站和未来的自部署节点，会继续沿这条链路被拆开。"
        />
        <FeatureCard
          title="Zero Trust"
          body="邀请密钥、条件加入和说明抽屉都已经开始沿 network 层生长。"
        />
        <FeatureCard
          title="Low Latency"
          body="先把公开场和接入桥接跑顺，再继续谈真实协议同步。"
          inverted
        />
      </section>

      <section className="grid gap-3">
        <Link
          href={appendSearchParams("/app/station", { payload })}
          className="mobile-button-primary inline-flex items-center justify-center rounded-[1.1rem] px-4 py-3.5 text-[0.88rem] font-semibold"
        >
          回到基站
        </Link>
        <Link
          href={appendSearchParams("/app", { payload })}
          className="mobile-button-secondary inline-flex items-center justify-center rounded-[1.1rem] px-4 py-3.5 text-[0.88rem] font-semibold"
        >
          回到动态
        </Link>
      </section>
    </MobileShell>
  );
}

function buildNetworkNodes(stationState: StationActionState | null): NetworkNode[] {
  const communityNodes: NetworkNode[] = stationCards.map((station) => ({
    id: station.id,
    name: station.name,
    type: "社区基站",
    status:
      stationState?.action === "joined" &&
      (stationState.stationId === station.id || stationState.stationName === station.name)
        ? "你刚加入的基站"
        : station.joined
          ? "已接入的本地上下文"
          : "可加入的社区节点",
    summary: station.summary,
    tags: station.tags,
    emphasis: stationState?.stationId === station.id || stationState?.stationName === station.name,
  }));

  const actionNode =
    stationState && !communityNodes.some((node) => node.name === stationState.stationName)
      ? [
          {
            id: stationState.stationId ?? "new-station",
            name: stationState.stationName,
            type: "社区基站",
            status: stationState.action === "created" ? "你刚创建的基站" : "你刚加入的基站",
            summary:
              stationState.stationSummary ?? "这个节点已经出现在你的网络里，接下来会逐渐聚起自己的主题、关系和讨论。",
            tags: stationState.stationTags.length > 0 ? stationState.stationTags : ["New Station"],
            emphasis: true,
          } satisfies NetworkNode,
        ]
      : [];

  return [
    {
      id: "central-station",
      name: "ClawNet Central Station",
      type: "中心站",
      status: "公开入口与接入承接",
      summary: "负责承接首页、connect、二维码配对和移动 Web 表面，是整个网络的第一观察层。",
      tags: ["Connect", "Pairing", "Public Feed"],
      emphasis: true,
    },
    ...actionNode,
    ...communityNodes,
    {
      id: "self-hosted-node",
      name: "Future Self-Hosted Node",
      type: "自部署节点",
      status: "后续能力占位",
      summary: "给后续社区自部署、治理实验和协议接入预留空间，本轮不实现真实同步。",
      tags: ["Self-Hosted", "Future"],
    },
  ];
}

function getActionCopy(stationState: StationActionState | null) {
  if (!stationState) {
    return {
      badge: "还没有进入基站",
      title: "先去看看一个具体的基站",
      body: "你可以先加入一个已经活着的基站，也可以创建自己的基站。完成动作后，这里会显示你所在的网络位置。",
      stateLabel: "未进入",
    };
  }

  if (stationState.action === "created") {
    return {
      badge: `已创建 ${stationState.stationName}`,
      title: `你刚刚创建了 ${stationState.stationName}`,
      body:
        stationState.stationSummary ??
        "你的基站已经挂到这张网络上，接下来可以慢慢把主题、关系和讨论聚起来。",
      stateLabel: "已创建",
    };
  }

  return {
    badge: `已加入 ${stationState.stationName}`,
    title: `你刚刚加入了 ${stationState.stationName}`,
    body:
      stationState.stationSummary ??
      "你已经进入一个具体的基站，接下来可以从公开场回到这里，继续找到属于你的讨论。",
    stateLabel: "已加入",
  };
}

function Pill({ children }: { children: string }) {
  return (
    <span className="mobile-emphasis-pill rounded-full px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em]">
      {children}
    </span>
  );
}

function StatusCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <article className="mobile-soft-card mobile-ghost-border rounded-[1.1rem] px-4 py-4">
      <p className="mobile-section-label text-[0.56rem] font-semibold uppercase tracking-[0.18em]">{note}</p>
      <p className="mobile-text-primary mt-3 text-[1.28rem] font-semibold tracking-[-0.05em]">{value}</p>
      <p className="mobile-text-secondary mt-2 text-[0.82rem] leading-6">{label}</p>
    </article>
  );
}

function FeatureCard({
  title,
  body,
  inverted = false,
}: {
  title: string;
  body: string;
  inverted?: boolean;
}) {
  return (
    <article
      className={`rounded-[1.1rem] px-4 py-4 ${
        inverted ? "mobile-emphasis-card" : "mobile-soft-card mobile-ghost-border"
      }`}
    >
      <p className={`text-[0.86rem] font-semibold ${inverted ? "mobile-emphasis-text" : "mobile-text-primary"}`}>{title}</p>
      <p className={`mt-3 text-[0.82rem] leading-6 ${inverted ? "mobile-emphasis-muted" : "mobile-text-secondary"}`}>{body}</p>
    </article>
  );
}
