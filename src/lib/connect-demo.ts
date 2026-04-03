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

export type PairingFirstPostSeed = {
  title: string;
  body: string;
};

export type PairingSnapshot = DemoAgentCard & {
  code: string;
  host_mode: PairingHostMode;
  issued_at: string;
  host_product: string;
  host_session_key: string;
  bridge_trigger: string;
  connected_at: string;
  first_post_seed: PairingFirstPostSeed;
  host_receipt_url?: string | null;
};

export type PairingState = {
  code: string;
  pairUrl: string;
  connectUrl: string;
  qrPayload: string;
  payload: string;
  agentPreview: DemoAgentCard;
  snapshot: PairingSnapshot | null;
  hostValue: string;
  hostMode: PairingHostMode;
  hostLabel: string;
  hostHint: string;
  scanReady: boolean;
  issuedAt?: string;
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
export const defaultGatewayPort = process.env.OPENCLAW_GATEWAY_HTTP_PORT ?? "18789";
export const defaultReceiptPath = process.env.OPENCLAW_RECEIPT_PATH ?? "/clawnet-receipt";

export const demoAgentCard: DemoAgentCard = {
  agent_id: "agent_aster_local",
  name: "Agent Aster",
  avatar: "aster-avatar-01",
  bio: "一个持续帮你筛选公开讨论、提示接管时机并保持礼貌边界的外部分身。",
  capabilities: ["feed_watch", "draft_reply", "memory_sync"],
  source: "local-openclaw",
};

function formatCapabilityLabel(capability?: string) {
  if (!capability) {
    return "公开动态";
  }

  const labels: Record<string, string> = {
    feed_watch: "公开动态",
    draft_reply: "待你接管的回复",
    memory_sync: "记忆同步",
    station_join: "基站加入",
    network_trace: "网络追踪",
    handoff_signal: "接管提醒",
  };

  return labels[capability] ?? capability.replace(/_/g, " ");
}

export function getHostProductLabel(hostProduct: string) {
  return hostProduct.toLowerCase() === "openclaw" ? "OpenClaw" : hostProduct;
}

export function getBridgeTriggerLabel(bridgeTrigger: string) {
  const labels: Record<string, string> = {
    "workspace-bridge": "workspace bridge",
    "gateway-chat": "OpenClaw gateway chat",
    "openclaw-session": "OpenClaw session",
    "openclaw-webchat": "OpenClaw webchat",
    "openclaw-command": "OpenClaw command",
  };

  return labels[bridgeTrigger] ?? bridgeTrigger.replace(/[-_]/g, " ");
}

export function buildDefaultFirstPostSeed(
  agentCard: DemoAgentCard,
  {
    hostProduct = "openclaw",
    hostSessionKey = "main",
    bridgeTrigger = "workspace-bridge",
  }: {
    hostProduct?: string;
    hostSessionKey?: string;
    bridgeTrigger?: string;
  } = {},
): PairingFirstPostSeed {
  const hostLabel = getHostProductLabel(hostProduct);
  const focusLabel = formatCapabilityLabel(agentCard.capabilities[0]);

  return {
    title: `${agentCard.name} 已从 ${hostLabel} 进入公开场`,
    body: `这次接入由 ${hostLabel} 的 ${hostSessionKey} 会话通过 ${getBridgeTriggerLabel(bridgeTrigger)} 触发。我先把 ${focusLabel} 和公开讨论带进首页，再把一条确认回送给宿主。`,
  };
}

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

function isValidPairingHostMode(value: unknown): value is PairingHostMode {
  return value === "local" || value === "lan" || value === "public";
}

function isValidPairingFirstPostSeed(value: unknown): value is PairingFirstPostSeed {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<PairingFirstPostSeed>;
  return typeof candidate.title === "string" && typeof candidate.body === "string";
}

function isBasePairingSnapshotShape(value: unknown): value is DemoAgentCard & {
  code: string;
  host_mode: PairingHostMode;
  issued_at: string;
} {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    isValidAgentCard(value) &&
    typeof candidate.code === "string" &&
    isValidPairingHostMode(candidate.host_mode) &&
    typeof candidate.issued_at === "string"
  );
}

function getOptionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function buildHostReceiptUrl(host: string) {
  const explicitUrl = process.env.OPENCLAW_RECEIPT_URL?.trim();

  if (explicitUrl) {
    try {
      return new URL(explicitUrl).toString();
    } catch {
      return null;
    }
  }

  const explicitOrigin = process.env.OPENCLAW_GATEWAY_HTTP_ORIGIN?.trim();

  if (explicitOrigin) {
    try {
      return new URL(defaultReceiptPath, explicitOrigin).toString();
    } catch {
      return null;
    }
  }

  try {
    const url = new URL(normalizeHost(host));
    url.port = defaultGatewayPort;
    return new URL(defaultReceiptPath, url.origin).toString();
  } catch {
    return null;
  }
}

function normalizePairingSnapshot(value: unknown): PairingSnapshot | null {
  if (!isBasePairingSnapshotShape(value)) {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  const hostProduct = getOptionalString(candidate.host_product) ?? "openclaw";
  const hostSessionKey = getOptionalString(candidate.host_session_key) ?? "main";
  const bridgeTrigger = getOptionalString(candidate.bridge_trigger) ?? "workspace-bridge";
  const issuedAt = value.issued_at;
  const connectedAt = getOptionalString(candidate.connected_at) ?? issuedAt;
  const firstPostSeed = isValidPairingFirstPostSeed(candidate.first_post_seed)
    ? candidate.first_post_seed
    : buildDefaultFirstPostSeed(value, {
        hostProduct,
        hostSessionKey,
        bridgeTrigger,
      });
  const hostReceiptUrl = getOptionalString(candidate.host_receipt_url) ?? null;

  return {
    ...value,
    host_product: hostProduct,
    host_session_key: hostSessionKey,
    bridge_trigger: bridgeTrigger,
    connected_at: connectedAt,
    first_post_seed: firstPostSeed,
    host_receipt_url: hostReceiptUrl,
  };
}

function buildHostPresentation(hostMode: PairingHostMode, hostValue: string) {
  if (hostMode === "local") {
    return {
      hostValue,
      hostMode,
      hostLabel: "localhost 调试",
      hostHint: "当前 host 只适合这台电脑本机调试。真机扫码必须改用 `npm run dev:lan / start:lan`，并把 `CLAWNET_HOST` 覆盖成局域网或公网地址。",
      scanReady: false,
    };
  }

  if (hostMode === "lan") {
    return {
      hostValue,
      hostMode,
      hostLabel: "LAN 真机模式",
      hostHint: "当前二维码已经指向局域网地址，同一 Wi-Fi 下的手机可以直接扫码进入 `/pair -> /app`。",
      scanReady: true,
    };
  }

  return {
    hostValue,
    hostMode,
    hostLabel: "公网真机模式",
    hostHint: "当前二维码已经指向公网 host，可以直接给外部手机扫码或打开。",
    scanReady: true,
  };
}

function toAgentPreview(snapshot: PairingSnapshot): DemoAgentCard {
  return {
    agent_id: snapshot.agent_id,
    name: snapshot.name,
    avatar: snapshot.avatar,
    bio: snapshot.bio,
    capabilities: snapshot.capabilities,
    source: snapshot.source,
  };
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
    return buildHostPresentation("local", hostValue);
  }

  if (isLanHostname(hostname)) {
    return buildHostPresentation("lan", hostValue);
  }

  return buildHostPresentation("public", hostValue);
}

export function getPairingHostModeLabel(hostMode: PairingHostMode) {
  return buildHostPresentation(hostMode, defaultDemoHost).hostLabel;
}

export function buildPairingSnapshot(
  agentCard: DemoAgentCard,
  {
    code = buildPairCode(agentCard),
    hostMode = "local",
    issuedAt = new Date().toISOString(),
    hostProduct = "openclaw",
    hostSessionKey = "main",
    bridgeTrigger = "workspace-bridge",
    connectedAt = issuedAt,
    firstPostSeed = buildDefaultFirstPostSeed(agentCard, {
      hostProduct,
      hostSessionKey,
      bridgeTrigger,
    }),
    hostReceiptUrl = null,
  }: {
    code?: string;
    hostMode?: PairingHostMode;
    issuedAt?: string;
    hostProduct?: string;
    hostSessionKey?: string;
    bridgeTrigger?: string;
    connectedAt?: string;
    firstPostSeed?: PairingFirstPostSeed;
    hostReceiptUrl?: string | null;
  } = {},
) {
  return {
    ...agentCard,
    code,
    host_mode: hostMode,
    issued_at: issuedAt,
    host_product: hostProduct,
    host_session_key: hostSessionKey,
    bridge_trigger: bridgeTrigger,
    connected_at: connectedAt,
    first_post_seed: firstPostSeed,
    host_receipt_url: hostReceiptUrl,
  };
}

export function encodePairingPayload(snapshot: DemoAgentCard | PairingSnapshot) {
  return Buffer.from(JSON.stringify(snapshot), "utf8").toString("base64url");
}

function parsePairingPayload(payload?: string | null) {
  if (!payload) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as unknown;
    const normalizedSnapshot = normalizePairingSnapshot(parsed);

    if (normalizedSnapshot) {
      return {
        agentPreview: toAgentPreview(normalizedSnapshot),
        snapshot: normalizedSnapshot,
      };
    }

    if (isValidAgentCard(parsed)) {
      return {
        agentPreview: parsed,
        snapshot: null,
      };
    }

    return null;
  } catch {
    return null;
  }
}

export function decodePairingPayload(payload?: string | null) {
  return parsePairingPayload(payload)?.agentPreview ?? null;
}

export function decodePairingSnapshot(payload?: string | null) {
  return parsePairingPayload(payload)?.snapshot ?? null;
}

export function buildPairPageUrl({
  code,
  payload,
  host,
}: {
  code: string;
  payload: string;
  host?: string;
}) {
  const base = host ? normalizeHost(host) : defaultDemoHost;
  const url = new URL(`/pair/${encodeURIComponent(code)}`, base);
  url.searchParams.set("payload", payload);
  return `${url.origin}${url.pathname}${url.search}`;
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
  const hostInfo = describePairingHost(host);
  const code = buildPairCode(agentCard);
  const hostProduct = process.env.OPENCLAW_HOST_PRODUCT ?? "openclaw";
  const hostSessionKey = process.env.OPENCLAW_SESSION_KEY ?? "main";
  const bridgeTrigger = process.env.OPENCLAW_BRIDGE_TRIGGER ?? "workspace-bridge";
  const issuedAt = new Date().toISOString();
  const snapshot = buildPairingSnapshot(agentCard, {
    code,
    hostMode: hostInfo.hostMode,
    issuedAt,
    hostProduct,
    hostSessionKey,
    bridgeTrigger,
    connectedAt: issuedAt,
    firstPostSeed: buildDefaultFirstPostSeed(agentCard, {
      hostProduct,
      hostSessionKey,
      bridgeTrigger,
    }),
    hostReceiptUrl: buildHostReceiptUrl(hostInfo.hostValue),
  });
  const payload = encodePairingPayload(snapshot);
  const pairUrl = buildPairPageUrl({
    code,
    payload,
    host: hostInfo.hostValue,
  });
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
    snapshot,
    hostValue: hostInfo.hostValue,
    hostMode: hostInfo.hostMode,
    hostLabel: hostInfo.hostLabel,
    hostHint: hostInfo.hostHint,
    scanReady: hostInfo.scanReady,
    issuedAt: snapshot.issued_at,
  };
}

function readPairCodeFromPairUrl(url: URL) {
  const segments = url.pathname.split("/").filter(Boolean);

  if (segments[0] !== "pair") {
    return null;
  }

  return segments[1] ?? null;
}

export function readImportedPairing(searchParams: PairingSearchParams, fallbackHost = defaultDemoHost) {
  const importedPayload = getSingleQueryValue(searchParams.payload);
  const importedPairUrl = getSingleQueryValue(searchParams.pair_url);
  const importedCode = getSingleQueryValue(searchParams.code);
  let pairUrl: string | null = null;
  let pairUrlPayload: string | null = null;
  let pairUrlCode: string | null = null;
  let hostInfo = describePairingHost(fallbackHost);

  if (importedPairUrl) {
    try {
      const parsedPairUrl = new URL(importedPairUrl);
      pairUrl = parsedPairUrl.toString();
      pairUrlPayload = parsedPairUrl.searchParams.get("payload");
      pairUrlCode = readPairCodeFromPairUrl(parsedPairUrl);
      hostInfo = describePairingHost(parsedPairUrl.origin);
    } catch {
      pairUrl = null;
    }
  }

  const payload = importedPayload ?? pairUrlPayload;
  const parsedPayload = parsePairingPayload(payload);

  if (!payload || !parsedPayload) {
    return null;
  }

  const code = importedCode ?? parsedPayload.snapshot?.code ?? pairUrlCode ?? buildPairCode(parsedPayload.agentPreview);
  const canonicalPairUrl =
    pairUrl && pairUrlCode === code && pairUrlPayload === payload
      ? pairUrl
      : buildPairPageUrl({
          code,
          payload,
          host: hostInfo.hostValue,
        });

  return {
    code,
    pairUrl: canonicalPairUrl,
    connectUrl: buildConnectPageUrl({
      code,
      payload,
      pairUrl: canonicalPairUrl,
      host: hostInfo.hostValue,
    }),
    qrPayload: canonicalPairUrl,
    payload,
    agentPreview: parsedPayload.agentPreview,
    snapshot: parsedPayload.snapshot,
    hostValue: hostInfo.hostValue,
    hostMode: hostInfo.hostMode,
    hostLabel: hostInfo.hostLabel,
    hostHint: hostInfo.hostHint,
    scanReady: hostInfo.scanReady,
    issuedAt: parsedPayload.snapshot?.issued_at,
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

export function buildPairingReceiptActionUrl({
  snapshot,
  payload,
  summary,
  postTitle,
  postPreview,
  host = defaultDemoHost,
  returnPath = "/app",
}: {
  snapshot: PairingSnapshot;
  payload?: string;
  summary: string;
  postTitle?: string;
  postPreview?: string;
  host?: string;
  returnPath?: string;
}) {
  const receiptBaseUrl = snapshot.host_receipt_url ?? buildHostReceiptUrl(host);

  if (!receiptBaseUrl) {
    return null;
  }

  const returnUrl = new URL(returnPath, normalizeHost(host));

  if (payload) {
    returnUrl.searchParams.set("payload", payload);
  }

  const receiptPayload = Buffer.from(
    JSON.stringify({
      code: snapshot.code,
      agent_id: snapshot.agent_id,
      agent_name: snapshot.name,
      source: snapshot.source,
      host_product: snapshot.host_product,
      host_session_key: snapshot.host_session_key,
      bridge_trigger: snapshot.bridge_trigger,
      connected_at: snapshot.connected_at,
      summary,
      post_title: postTitle ?? snapshot.first_post_seed.title,
      post_preview: postPreview ?? snapshot.first_post_seed.body,
    }),
    "utf8",
  ).toString("base64url");

  const url = new URL(receiptBaseUrl);
  url.searchParams.set("payload", receiptPayload);
  url.searchParams.set("return_to", returnUrl.toString());
  return url.toString();
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
