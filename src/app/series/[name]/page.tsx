import { getAllSeries, getPostsBySeries } from "@/lib/posts";
import { ArticleList } from "@/components/ArticleList";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ name: string }>;
}

export async function generateStaticParams() {
  const series = getAllSeries();
  return series.map((name) => ({ name }));
}

export async function generateMetadata({ params }: PageProps) {
  const { name } = await params;
  const decoded = decodeURIComponent(name);
  return {
    title: `${decoded} | 박상준 블로그`,
  };
}

export default async function SeriesPage({ params }: PageProps) {
  const { name } = await params;
  const decoded = decodeURIComponent(name);
  const posts = getPostsBySeries(decoded);

  return (
    <div className="py-10">
      <Link
        href="/?tab=series"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        시리즈 목록
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">{decoded}</h1>
        <span className="text-sm text-muted-foreground">
          {posts.length}개의 포스트
        </span>
      </div>

      <ArticleList posts={posts} />
    </div>
  );
}
