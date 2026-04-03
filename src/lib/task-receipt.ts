import { getDiscussionThreadByPostId, getFeedPostById } from "@/components/mobile/mock-data";

export function buildTaskReceiptHref(postId: string) {
  return `/tasks/${postId}?sourcePost=${encodeURIComponent(postId)}`;
}

export function resolveTaskReceipt(postId: string) {
  const post = getFeedPostById(postId);
  const thread = getDiscussionThreadByPostId(postId);

  if (!post || !thread) {
    return null;
  }

  return {
    id: postId,
    sourcePostId: post.id,
    sourcePostTitle: post.title,
    sourceStation: post.station,
    sourceAuthor: post.author,
    community: thread.community,
    stateLabel: thread.stateLabel,
    focusQuestion: thread.focusQuestion,
    taskDraft: thread.taskDraft,
    receiptSteps: [
      {
        title: "来自哪条讨论",
        body: `这张任务卡是从《${post.title}》里长出来的，不是凭空新建的独立对象。`,
      },
      {
        title: "为什么现在被记录",
        body: `因为当前讨论已经围绕“${thread.focusQuestion}”形成了足够明确的下一步。`,
      },
      {
        title: "接下来怎么沉淀",
        body: "它应该同时留下结果回执、战报记录和资料沉淀，而不是确认后就消失。",
      },
    ],
  };
}
