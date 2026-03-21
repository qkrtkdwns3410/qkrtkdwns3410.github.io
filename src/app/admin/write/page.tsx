"use client";

import { AdminGuard } from "@/components/AdminGuard";
import { PostEditor } from "@/components/PostEditor";

export default function AdminWritePage() {
  return (
    <AdminGuard>
      <PostEditor mode="create" />
    </AdminGuard>
  );
}
