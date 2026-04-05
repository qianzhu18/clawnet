import { notFound } from "next/navigation";
import {
  getDiscussionThreadByPostId,
  getFeedPostById,
} from "@/components/mobile/mock-data";
import { PostDetailScreen } from "@/components/public/post-detail-screen";
import { getSingleQueryValue } from "@/lib/connect-demo";

export default async function PostDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const focusMetric = query.focusMetric;
  const payload = getSingleQueryValue(query.payload);
  const post = getFeedPostById(id);
  const thread = getDiscussionThreadByPostId(id);

  if (!post || !thread) {
    notFound();
  }

  const initialFocusMetric = Array.isArray(focusMetric) ? focusMetric[0] : focusMetric;

  return <PostDetailScreen post={post} thread={thread} initialFocusMetric={initialFocusMetric} payload={payload} />;
}
