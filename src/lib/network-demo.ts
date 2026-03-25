import { appendSearchParams, getSingleQueryValue } from "@/lib/connect-demo";

type SearchParamValue = string | string[] | undefined;

export type StationAction = "joined" | "created";

export type NetworkSearchParams = {
  payload?: SearchParamValue;
  stationAction?: SearchParamValue;
  stationId?: SearchParamValue;
  stationName?: SearchParamValue;
  stationSummary?: SearchParamValue;
  stationTags?: SearchParamValue;
};

export type StationActionState = {
  action: StationAction;
  stationId?: string;
  stationName: string;
  stationSummary?: string;
  stationTags: string[];
};

export function buildNetworkActionHref({
  action,
  payload,
  stationId,
  stationName,
  stationSummary,
  stationTags,
}: {
  action: StationAction;
  payload?: string;
  stationId?: string;
  stationName: string;
  stationSummary?: string;
  stationTags?: string[];
}) {
  return appendSearchParams("/network", {
    payload,
    stationAction: action,
    stationId,
    stationName,
    stationSummary,
    stationTags: stationTags?.join(", "),
  });
}

export function readStationActionState(searchParams: NetworkSearchParams): StationActionState | null {
  const action = getSingleQueryValue(searchParams.stationAction);
  const stationName = getSingleQueryValue(searchParams.stationName);

  if ((action !== "joined" && action !== "created") || !stationName) {
    return null;
  }

  const stationTagsValue = getSingleQueryValue(searchParams.stationTags);

  return {
    action,
    stationId: getSingleQueryValue(searchParams.stationId),
    stationName,
    stationSummary: getSingleQueryValue(searchParams.stationSummary),
    stationTags: stationTagsValue
      ? stationTagsValue
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [],
  };
}
