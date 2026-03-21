import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { Post } from "./types";

const postsDirectory = path.join(process.cwd(), "src/content/posts");

// 빌드 시점 캐시 - 정적 익스포트에서 반복적인 파일시스템 읽기 방지
let _cachedPosts: Post[] | null = null;

export function getAllPosts(): Post[] {
  if (_cachedPosts) return _cachedPosts;
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter((name) => name.endsWith(".mdx") || name.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      const stats = readingTime(content);

      return {
        slug,
        title: data.title || slug,
        description: data.description || "",
        date: data.date || new Date().toISOString(),
        tags: data.tags || [],
        thumbnail: data.thumbnail || undefined,
        readingTime: stats.text,
        content,
        series: data.series || undefined,
      } as Post;
    });

  _cachedPosts = posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  return _cachedPosts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getAllSeries(): string[] {
  const posts = getAllPosts();
  const seriesSet = new Set<string>();
  posts.forEach((post) => {
    if (post.series) seriesSet.add(post.series);
  });
  return Array.from(seriesSet).sort();
}

export function getPostsBySeries(series: string): Post[] {
  return getAllPosts().filter((post) => post.series === series);
}
