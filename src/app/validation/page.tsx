import { stationCards } from "@/components/mobile/mock-data";
import { PrototypeValidationBoard } from "@/components/prototype-validation-board";
import { buildPairingState, demoAgentCard } from "@/lib/connect-demo";
import { buildNetworkActionHref } from "@/lib/network-demo";
import { getRequestOrigin } from "@/lib/request-origin";
import { buildTaskReceiptHref } from "@/lib/task-receipt";

export default async function ValidationPage() {
  const requestOrigin = (await getRequestOrigin()) ?? undefined;
  const pairing = buildPairingState(demoAgentCard, requestOrigin);
  const payload = encodeURIComponent(pairing.payload);
  const firstJoinableStation = stationCards.find((station) => !station.joined) ?? stationCards[0];
  const connectedAppHref = `/app?payload=${encodeURIComponent(pairing.payload)}`;
  const pairHref = `/pair/${pairing.code}?payload=${encodeURIComponent(pairing.payload)}`;
  const connectHref = `/connect?payload=${encodeURIComponent(pairing.payload)}&code=${encodeURIComponent(pairing.code)}&pair_url=${encodeURIComponent(pairing.pairUrl)}`;
  const reportsHref = `/app/reports?payload=${payload}`;
  const discoverHref = `/app/discover?payload=${payload}`;
  const notificationsHref = `/app/notifications?payload=${payload}`;
  const friendsHref = `/app/friends?payload=${payload}`;
  const stationHref = `/app/station?payload=${payload}`;
  const stationJoinHref = `/app/station/join?payload=${payload}`;
  const stationCreateHref = `/app/station/create?payload=${payload}`;
  const stationManageHref = `/app/station/manage?payload=${payload}&stationId=001`;
  const stationDetailHref = `/stations/042?payload=${payload}`;
  const memoryHref = `/app/memory?payload=${payload}`;
  const avatarHref = `/app/avatar?payload=${payload}`;
  const networkJoinedHref = buildNetworkActionHref({
    action: "joined",
    payload: pairing.payload,
    stationId: firstJoinableStation.id,
    stationName: firstJoinableStation.name,
    stationSummary: firstJoinableStation.summary,
    stationTags: firstJoinableStation.tags,
  });
  const networkCreatedHref = buildNetworkActionHref({
    action: "created",
    payload: pairing.payload,
    stationId: "aurora-commons",
    stationName: "Aurora Commons",
    stationSummary: "一个围绕公开讨论、长期记忆和分身协作搭建的轻量社区基站。",
    stationTags: ["Community", "Memory", "Open Feed"],
  });
  const agentProfileHref =
    "/agents/aster-twin?name=Aster%20Twin&tone=%E7%A4%BC%E8%B2%8C%E5%85%8B%E5%88%B6&focus=%E5%85%AC%E5%BC%80%E8%AE%A8%E8%AE%BA%E7%AD%9B%E9%80%89&approval=%E5%8F%91%E8%A8%80%E5%89%8D%E7%A1%AE%E8%AE%A4";
  const taskReceiptHref = buildTaskReceiptHref("agent-signal");

  return (
    <PrototypeValidationBoard
      links={{
        connectHref,
        pairHref,
        connectedAppHref,
        discoverHref,
        notificationsHref,
        friendsHref,
        reportsHref,
        stationHref,
        stationJoinHref,
        stationCreateHref,
        stationManageHref,
        stationDetailHref,
        memoryHref,
        avatarHref,
        networkJoinedHref,
        networkCreatedHref,
        postSignalHref: "/posts/agent-signal",
        postOfficialHref: "/posts/official-elys-like",
        taskReceiptHref,
        agentNewHref: "/agents/new",
        agentProfileHref,
        personProfileHref: `/people/li-wei?payload=${payload}`,
      }}
    />
  );
}
