export type DemoAgentCard = {
  agent_id: string;
  name: string;
  avatar: string;
  bio: string;
  capabilities: string[];
  source: string;
};

type SearchParamValue = string | string[] | undefined;

export type PairingHostMode = "local" | "lan" | "public";

export type PairingState = {
  code: string;
  pairUrl: string;
  connectUrl: string;
  qrPayload: string;
  payload: string;
  agentPreview: DemoAgentCard;
  hostValue: string;
  hostMode: PairingHostMode;
  hostLabel: string;
  hostHint: string;
  scanReady: boolean;
};

export type PairingSearchParams = {
  code?: SearchParamValue;
  payload?: SearchParamValue;
  pair_url?: SearchParamValue;
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

function normalizeHost(host: string) {
  try {
    return new URL(host).origin;
  } catch {
    return defaultDemoHost;
  }
}

function isLoopbackHostname(hostname: string) {
  const normalized = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  return normalized === "localhost" || normalized === "127.0.0.1" || normalized === "0.0.0.0" || normalized === "::1";
}

function isLanHostname(hostname: string) {
  const normalized = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  const pieces = normalized.split(".").map((item) => Number(item));

  if (normalized.endsWith(".local")) {
    return true;
  }

  if (pieces.length !== 4 || pieces.some((item) => Number.isNaN(item))) {
    return false;
  }

  if (pieces[0] === 10) {
    return true;
  }

  if (pieces[0] === 172 && pieces[1] >= 16 && pieces[1] <= 31) {
    return true;
  }

  return pieces[0] === 192 && pieces[1] === 168;
}

export function describePairingHost(host: string) {
  const hostValue = normalizeHost(host);
  const hostname = new URL(hostValue).hostname;

  if (isLoopbackHostname(hostname)) {
    return {
      hostValue,
      hostMode: "local" as const,
      hostLabel: "localhost 调试",
      hostHint: "当前 host 只适合这台电脑本机调试。真机扫码必须改用 `npm run dev:lan / start:lan`，并把 `CLAWNET_HOST` 覆盖成局域网或公网地址。",
      scanReady: false,
    };
  }

  if (isLanHostname(hostname)) {
    return {
      hostValue,
      hostMode: "lan" as const,
      hostLabel: "LAN 真机模式",
      hostHint: "当前二维码已经指向局域网地址，同一 Wi-Fi 下的手机可以直接扫码进入 `/pair -> /app`。",
      scanReady: true,
    };
  }

  return {
    hostValue,
    hostMode: "public" as const,
    hostLabel: "公网真机模式",
    hostHint: "当前二维码已经指向公网 host，可以直接给外部手机扫码或打开。",
    scanReady: true,
  };
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

export function buildConnectPageUrl({
  code,
  payload,
  pairUrl,
  host,
}: {
  code: string;
  payload: string;
  pairUrl?: string;
  host?: string;
}) {
  const params = new URLSearchParams();
  params.set("code", code);
  params.set("payload", payload);

  if (pairUrl) {
    params.set("pair_url", pairUrl);
  }

  if (!host) {
    return `/connect?${params.toString()}`;
  }

  return `${normalizeHost(host)}/connect?${params.toString()}`;
}

export function buildPairingState(agentCard: DemoAgentCard, host = defaultDemoHost): PairingState {
  const payload = encodePairingPayload(agentCard);
  const code = buildPairCode(agentCard);
  const hostInfo = describePairingHost(host);
  const pairUrl = `${hostInfo.hostValue}/pair/${code}?payload=${payload}`;
  const connectUrl = buildConnectPageUrl({
    code,
    payload,
    pairUrl,
    host: hostInfo.hostValue,
  });

  return {
    code,
    pairUrl,
    connectUrl,
    qrPayload: pairUrl,
    payload,
    agentPreview: agentCard,
    hostValue: hostInfo.hostValue,
    hostMode: hostInfo.hostMode,
    hostLabel: hostInfo.hostLabel,
    hostHint: hostInfo.hostHint,
    scanReady: hostInfo.scanReady,
  };
}

export function readImportedPairing(searchParams: PairingSearchParams, fallbackHost = defaultDemoHost) {
  const payload = getSingleQueryValue(searchParams.payload);
  const agentPreview = decodePairingPayload(payload);

  if (!payload || !agentPreview) {
    return null;
  }

  const importedPairUrl = getSingleQueryValue(searchParams.pair_url);

  if (importedPairUrl) {
    try {
      return buildPairingState(agentPreview, new URL(importedPairUrl).origin);
    } catch {
      return buildPairingState(agentPreview, fallbackHost);
    }
  }

  return buildPairingState(agentPreview, fallbackHost);
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
