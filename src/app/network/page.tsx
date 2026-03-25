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
      statusLabel={stationState ? "network linked" : "network overview"}
    >
      <section className="rounded-[1.9rem] border border-black/6 bg-[linear-gradient(145deg,rgba(20,24,31,0.94),rgba(44,58,73,0.9))] px-5 py-5 text-white shadow-[0_20px_44px_rgba(21,25,31,0.24)]">
        <SectionTag>Network Layer</SectionTag>
        <h2 className="mt-3 text-[2.15rem] font-semibold tracking-[-0.06em] text-white">
          这不是单一 App，而是一个可扩展的基站网络
        </h2>
        <p className="mt-4 text-sm leading-6 text-white/72">
          当前版本只用 mock 状态证明结构方向：中心站负责公开入口和接入承接，社区基站负责本地讨论，自部署节点保留给后续扩展。
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Pill>{connectedAgent ? `${connectedAgent.name} 已接入` : "Demo 观察模式"}</Pill>
          <Pill>{actionCopy.badge}</Pill>
        </div>
      </section>

      <section className="mt-6 rounded-[1.6rem] border border-black/6 bg-[rgba(255,255,255,0.86)] px-5 py-5 shadow-[0_14px_30px_rgba(45,33,22,0.06)]">
        <SectionTag>Current Action</SectionTag>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[1.35rem] font-semibold tracking-[-0.04em] text-[#1f1d1a]">
              {actionCopy.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#655f58]">{actionCopy.body}</p>
          </div>
          <div className="rounded-[1.1rem] border border-black/6 bg-[#f3efe8] px-3 py-2 text-right">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#8f8a84]">
              Network State
            </p>
            <p className="mt-1 text-sm font-semibold text-[#1f1d1a]">{actionCopy.stateLabel}</p>
          </div>
        </div>
      </section>

      <section className="relative mt-7 pl-6">
        <div className="absolute left-[0.72rem] top-4 bottom-4 w-px bg-[linear-gradient(180deg,rgba(31,29,26,0.95),rgba(82,112,140,0.45),rgba(31,29,26,0.12))]" />
        <div className="space-y-4">
          {nodes.map((node) => (
            <NetworkNodeCard key={node.id} node={node} />
          ))}
        </div>
      </section>

      <section className="mt-7 rounded-[1.6rem] border border-black/6 bg-[rgba(255,255,255,0.82)] px-5 py-5 shadow-[0_14px_28px_rgba(45,33,22,0.05)]">
        <SectionTag>What We Are Not Doing Yet</SectionTag>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-[#655f58]">
          <li>不接真实后端，不声明节点真的上线。</li>
          <li>不引入联邦协议术语，不要求观众先理解 ActivityPub 或 ANP。</li>
          <li>不做控制台和权限系统，只证明“中心站可以延展到多个基站”。</li>
        </ul>
      </section>

      <section className="mt-7 grid gap-3">
        <Link
          href={appendSearchParams("/app/station", { payload })}
          className="inline-flex items-center justify-center rounded-[1.3rem] bg-[#1f1d1a] px-4 py-4 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(33,25,18,0.16)]"
        >
          返回基站动作层
        </Link>
        <Link
          href={appendSearchParams("/app", { payload })}
          className="inline-flex items-center justify-center rounded-[1.3rem] border border-black/8 bg-[#fbfaf7] px-4 py-4 text-sm font-semibold text-[#1f1d1a]"
        >
          回到移动 Web 表面
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
              stationState.stationSummary ?? "这个节点目前只做一次 mock 状态承接，用来说明网络层已经有可见的扩展单位。",
            tags: stationState.stationTags.length > 0 ? stationState.stationTags : ["Mock Action"],
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
      badge: "等待一次基站动作",
      title: "先完成一次 mock 加入或创建",
      body: "你可以把这个页面当作方向证明页。真正的动作入口仍然在 `/app/station`，完成一次加入或创建后，这里会显示具体结果。",
      stateLabel: "overview",
    };
  }

  if (stationState.action === "created") {
    return {
      badge: `已创建 ${stationState.stationName}`,
      title: `你刚刚创建了 ${stationState.stationName}`,
      body:
        stationState.stationSummary ??
        "这个创建动作目前是 mock，但已经足够把“我能拥有自己的基站”讲清楚，并把新节点挂到 network layer 上。",
      stateLabel: "created",
    };
  }

  return {
    badge: `已加入 ${stationState.stationName}`,
    title: `你刚刚加入了 ${stationState.stationName}`,
    body:
      stationState.stationSummary ??
      "这次加入动作不做真实同步，只证明用户已经能从移动 Web 表面进入一个具体社区节点，并看到网络层不是单点结构。",
    stateLabel: "joined",
  };
}

function NetworkNodeCard({ node }: { node: NetworkNode }) {
  return (
    <article
      className={`relative rounded-[1.7rem] border px-5 py-5 shadow-[0_16px_32px_rgba(45,33,22,0.06)] ${
        node.emphasis
          ? "border-[#1f1d1a]/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(240,242,246,0.92))]"
          : "border-black/6 bg-[rgba(255,255,255,0.84)]"
      }`}
    >
      <span
        className={`absolute -left-[1.55rem] top-8 size-3 rounded-full border-2 border-[#f6f3ed] ${
          node.type === "中心站"
            ? "bg-[#1f1d1a]"
            : node.type === "自部署节点"
              ? "bg-[#8aa7b7]"
              : "bg-[#5f8db8]"
        }`}
      />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[#8e8881]">
            {node.type}
          </p>
          <h3 className="mt-2 text-[1.2rem] font-semibold tracking-[-0.04em] text-[#1f1d1a]">
            {node.name}
          </h3>
        </div>
        <span className="rounded-full border border-black/6 bg-white/75 px-3 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#6c6760]">
          {node.status}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-[#655f58]">{node.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {node.tags.map((tag) => (
          <span
            key={`${node.id}-${tag}`}
            className="rounded-full border border-black/6 bg-[#fbfaf7] px-2.5 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[#7a756d]"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

function Pill({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-white/82">
      {children}
    </span>
  );
}
