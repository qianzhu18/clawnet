import { notFound } from "next/navigation";
import {
  getDiscussionThreadByPostId,
  getFeedPostById,
} from "@/components/mobile/mock-data";
import { PostDetailScreen } from "@/components/public/post-detail-screen";

export default async function PostDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ focusMetric?: string | string[] }>;
}) {
  const { id } = await params;
  const { focusMetric } = await searchParams;
  const post = getFeedPostById(id);
  const thread = getDiscussionThreadByPostId(id);

  if (!post || !thread) {
    notFound();
  }

  const initialFocusMetric = Array.isArray(focusMetric) ? focusMetric[0] : focusMetric;

  return <PostDetailScreen post={post} thread={thread} initialFocusMetric={initialFocusMetric} />;
}
