"use client";

import { useEffect, useState } from "react";
import { AdminGuard } from "@/components/AdminGuard";
import { listPosts, deletePost } from "@/lib/github";
import { getGithubPat, setAuthState, clearGithubPat } from "@/lib/auth";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  FileText,
  ArrowLeft,
  Loader2,
  LogOut,
} from "lucide-react";

interface PostItem {
  name: string;
  path: string;
  sha: string;
}

function AdminDashboard() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const pat = getGithubPat();
      if (!pat) {
        setError("GitHub PAT가 설정되지 않았습니다. 다시 로그인해주세요.");
        return;
      }
      const items = await listPosts(pat);
      setPosts(items);
    } catch {
      setError("글 목록을 불러오는데 실패했습니다. PAT를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (post: PostItem) => {
    const slug = post.name.replace(/\.mdx?$/, "");
    if (!confirm(`"${slug}" 글을 삭제하시겠습니까?`)) return;

    setDeleting(slug);
    try {
      const pat = getGithubPat();
      if (!pat) {
        alert("GitHub PAT가 설정되지 않았습니다.");
        return;
      }
      await deletePost(slug, post.sha, pat);
      setPosts((prev) => prev.filter((p) => p.name !== post.name));
    } catch {
      alert("삭제에 실패했습니다.");
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = () => {
    setAuthState(false);
    clearGithubPat();
    window.location.href = "/admin/";
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">관리자</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/write/"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />새 글 작성
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground border rounded-lg hover:bg-accent transition-colors"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Post list */}
      {loading ? (
        <div className="py-20 text-center text-muted-foreground">
          <Loader2 className="w-6 h-6 mx-auto mb-3 animate-spin" />
          글 목록 로딩 중...
        </div>
      ) : posts.length === 0 ? (
        <div className="py-20 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground">작성된 글이 없습니다.</p>
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden">
          {posts.map((post, i) => {
            const slug = post.name.replace(/\.mdx?$/, "");
            return (
              <div
                key={post.name}
                className={`flex items-center justify-between px-5 py-4 ${
                  i < posts.length - 1 ? "border-b" : ""
                } hover:bg-accent/50 transition-colors`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                  <Link
                    href={`/articles/${slug}/`}
                    className="font-medium truncate hover:text-primary/80 transition-colors"
                  >
                    {slug}
                  </Link>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-4">
                  <Link
                    href={`/admin/edit/${slug}/`}
                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                    title="수정"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(post)}
                    disabled={deleting === slug}
                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 text-muted-foreground hover:text-red-600 transition-colors disabled:opacity-50"
                    title="삭제"
                  >
                    {deleting === slug ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  );
}
