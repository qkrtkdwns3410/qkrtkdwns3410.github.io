"use client";

import { useParams } from "next/navigation";
import { AdminGuard } from "@/components/AdminGuard";
import { PostEditor } from "@/components/PostEditor";

export function AdminEditClient() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <AdminGuard>
      <PostEditor mode="edit" slug={slug} />
    </AdminGuard>
  );
}
