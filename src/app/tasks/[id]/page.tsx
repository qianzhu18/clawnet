import { notFound } from "next/navigation";

import { TaskReceiptScreen } from "@/components/public/task-receipt-screen";
import { resolveTaskReceipt } from "@/lib/task-receipt";

export default async function TaskReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const receipt = resolveTaskReceipt(id);

  if (!receipt) {
    notFound();
  }

  return <TaskReceiptScreen receipt={receipt} />;
}
