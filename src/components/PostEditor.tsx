"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Tag, Loader2 } from "lucide-react";
import { CacheBustLink as Link } from "./CacheBustLink";
import { getGithubPat } from "@/lib/auth";
import { getPost, createPost, updatePost } from "@/lib/github";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

interface PostEditorProps {
  mode: "create" | "edit";
  slug?: string;
}

function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { title: "", description: "", tags: "", series: "", date: "", body: raw };

  const meta = match[1];
  const body = match[2];

  const get = (key: string) => {
    const m = meta.match(new RegExp(`^${key}:\\s*"?(.*?)"?\\s*$`, "m"));
    return m ? m[1] : "";
  };

  const tagsMatch = meta.match(/tags:\s*\[(.*?)\]/);
  const tags = tagsMatch
    ? tagsMatch[1].replace(/"/g, "").trim()
    : "";

  return {
    title: get("title"),
    description: get("description"),
    date: get("date"),
    tags,
    series: get("series"),
    body: body.trim(),
  };
}

export function PostEditor({ mode, slug }: PostEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [series, setSeries] = useState("");
  const [content, setContent] = useState("");
  // 수정 모드에서 원래 발행일을 보존하기 위한 상태
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [sha, setSha] = useState("");
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [showMeta, setShowMeta] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode === "edit" && slug) {
      const pat = getGithubPat();
      if (!pat) return;
      getPost(slug, pat)
        .then(({ content: raw, sha }) => {
          const parsed = parseFrontmatter(raw);
          setTitle(parsed.title);
          setDescription(parsed.description);
          setTags(parsed.tags);
          setSeries(parsed.series);
          setContent(parsed.body);
          // 원래 발행일이 있으면 보존, 없으면 오늘 날짜 사용
          if (parsed.date) setDate(parsed.date);
          setSha(sha);
        })
        .catch(() => setError("글을 불러오는데 실패했습니다."))
        .finally(() => setLoading(false));
    }
  }, [mode, slug]);

  // MDX frontmatter를 조립하여 최종 파일 콘텐츠를 생성
  const buildMdx = (body: string) => {
    const tagList = tags
      .split(",")
      .map((t) => `"${t.trim()}"`)
      .filter((t) => t !== '""')
      .join(", ");

    const lines = [
      "---",
      `title: "${title}"`,
      `description: "${description}"`,
      `date: "${date}"`,
      `tags: [${tagList}]`,
    ];
    if (series) lines.push(`series: "${series}"`);
    lines.push("---", "", body);
    return lines.join("\n");
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }

    const pat = getGithubPat();
    if (!pat) {
      setError("GitHub PAT가 설정되지 않았습니다.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      // 슬러그는 ASCII만 사용 (한글 URL은 GitHub Pages에서 이중 인코딩 문제 발생)
      // 영문/숫자만 추출하고, 한글만 있는 제목은 날짜 기반 슬러그 생성
      const asciiSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const fileSlug =
        slug ||
        (asciiSlug || `post-${Date.now()}`);

      const mdx = buildMdx(content);

      if (mode === "edit" && sha) {
        await updatePost(fileSlug, mdx, sha, pat);
      } else {
        await createPost(fileSlug, mdx, pat);
      }

      router.push(`/admin/?v=${process.env.NEXT_PUBLIC_BUILD_TIME}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "저장에 실패했습니다.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 text-center text-muted-foreground">
        <Loader2 className="w-6 h-6 mx-auto mb-3 animate-spin" />
        글을 불러오는 중...
      </div>
    );
  }

  return (
    <div className="py-6 flex flex-col min-h-[calc(100vh-8rem)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/admin/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          관리자로 돌아가기
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMeta(!showMeta)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              showMeta
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            <Tag className="w-4 h-4" />
            메타 정보
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {mode === "edit" ? "수정 저장" : "발행"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Meta panel */}
      {showMeta && (
        <div className="mb-6 p-5 rounded-xl border bg-card space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">설명</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="글에 대한 짧은 설명"
              className="w-full h-10 px-3 text-sm bg-background rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                태그 (쉼표로 구분)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Java, Spring, JPA"
                className="w-full h-10 px-3 text-sm bg-background rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">시리즈</label>
              <input
                type="text"
                value={series}
                onChange={(e) => setSeries(e.target.value)}
                placeholder="시리즈 이름 (선택)"
                className="w-full h-10 px-3 text-sm bg-background rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>
      )}

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
        className="w-full text-3xl sm:text-4xl font-extrabold bg-transparent border-none outline-none placeholder:text-muted-foreground/40 mb-6"
      />

      {/* Editor - 노션처럼 화면 전체를 채우는 에디터 영역 */}
      <div className="flex-1 [&_.bn-container]:h-full [&_.bn-editor]:min-h-full">
        <Editor onChange={setContent} initialContent={content} />
      </div>
    </div>
  );
}
