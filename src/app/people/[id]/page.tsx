import { PublicPersonScreen } from "@/components/mobile/interaction-extension-screens";
import { getSingleQueryValue } from "@/lib/connect-demo";
import { resolvePublicPersonProfile } from "@/lib/public-links";

export default async function PublicPersonPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const payload = getSingleQueryValue(query.payload);
  const profile = resolvePublicPersonProfile(id);

  return <PublicPersonScreen profile={profile} payload={payload} />;
}
