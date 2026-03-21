import { getAllPosts } from "@/lib/posts";
import { AdminEditClient } from "./client";

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default function AdminEditPage() {
  return <AdminEditClient />;
}
