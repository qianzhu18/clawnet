import { StationDetailScreen } from "@/components/mobile/interaction-extension-screens";
import { getSingleQueryValue } from "@/lib/connect-demo";
import { getStationById } from "@/lib/public-links";

export default async function StationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const payload = getSingleQueryValue(query.payload);
  const station = getStationById(id);

  if (!station) {
    return <StationDetailScreen station={{
      id,
      name: "未知基站",
      summary: "这个基站还没有补进当前原型数据里，所以这里只能显示最小占位内容。",
      tags: ["TODO"],
      meta: "Station / Missing",
      joined: false,
      tone: "signal",
      hostName: "待补",
      hostRole: "站长",
      hostAvatarLabel: "待",
      memberCount: "0 成员",
      location: "未定义",
      activity: "等待补充",
      samplePostAuthor: "待补",
      samplePostBody: "当前还没有为这个基站补足公开讨论样本。",
    }} payload={payload} />;
  }

  return <StationDetailScreen station={station} payload={payload} />;
}
