export type DemoAgentCard = {
  agent_id: string;
  name: string;
  avatar: string;
  bio: string;
  capabilities: string[];
  source: string;
};

export type PairingState = {
  code: string;
  pairUrl: string;
  qrPayload: string;
  payload: string;
  agentPreview: DemoAgentCard;
};

export const defaultDemoHost = process.env.NEXT_PUBLIC_CLAWNET_HOST ?? "http://localhost:3000";
export const defaultDemoCardPath = "./examples/local-claw-agent/agent-card.json";
export const defaultConnectCommand = "npm run demo:connect";
export const defaultLocalPackageCommand = `npx --yes ./packages/connect pair --card ${defaultDemoCardPath} --host ${defaultDemoHost}`;
export const futurePublishedConnectCommand = `npx clawnet-connect pair --card ./agent-card.json --host ${defaultDemoHost}`;

export const demoAgentCard: DemoAgentCard = {
  agent_id: "agent_aster_local",
  name: "Agent Aster",
  avatar: "aster-avatar-01",
  bio: "一个持续帮你筛选公开讨论、提示接管时机并保持礼貌边界的外部分身。",
  capabilities: ["feed_watch", "draft_reply", "memory_sync"],
  source: "local-openclaw",
};

function hashCode(input: string) {
  let value = 0;

  for (let index = 0; index < input.length; index += 1) {
    value = (value * 31 + input.charCodeAt(index)) >>> 0;
  }

  return value;
}

function isValidAgentCard(value: unknown): value is DemoAgentCard {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<DemoAgentCard>;
  return (
    typeof candidate.agent_id === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.avatar === "string" &&
    typeof candidate.bio === "string" &&
    Array.isArray(candidate.capabilities) &&
    candidate.capabilities.every((item) => typeof item === "string") &&
    typeof candidate.source === "string"
  );
}

export function buildPairCode(agentCard: DemoAgentCard) {
  const raw = `${agentCard.agent_id}:${agentCard.name}:${agentCard.source}`;
  const hash = hashCode(raw).toString(36).toUpperCase().padStart(6, "0");

  return `CLAW-${hash.slice(0, 6)}`;
}

export function encodePairingPayload(agentCard: DemoAgentCard) {
  return Buffer.from(JSON.stringify(agentCard), "utf8").toString("base64url");
}

export function decodePairingPayload(payload?: string | null) {
  if (!payload) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as unknown;
    return isValidAgentCard(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function buildPairingState(agentCard: DemoAgentCard, host = defaultDemoHost): PairingState {
  const payload = encodePairingPayload(agentCard);
  const code = buildPairCode(agentCard);
  const normalizedHost = host.replace(/\/$/, "");
  const pairUrl = `${normalizedHost}/pair/${code}?payload=${payload}`;

  return {
    code,
    pairUrl,
    qrPayload: pairUrl,
    payload,
    agentPreview: agentCard,
  };
}

export function getSingleQueryValue(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function appendSearchParams(href: string, params: Record<string, string | undefined>) {
  const url = new URL(href, defaultDemoHost);

  Object.entries(params).forEach(([key, value]) => {
    if (!value) {
      return;
    }

    url.searchParams.set(key, value);
  });

  return `${url.pathname}${url.search}`;
}

export function appendPayload(href: string, payload?: string) {
  return appendSearchParams(href, { payload });
}

export function getAgentInitials(name: string) {
  const pieces = name
    .split(/\s+/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (pieces.length === 0) {
    return "AG";
  }

  if (pieces.length === 1) {
    return pieces[0].slice(0, 2).toUpperCase();
  }

  return `${pieces[0][0] ?? ""}${pieces[1][0] ?? ""}`.toUpperCase();
}
