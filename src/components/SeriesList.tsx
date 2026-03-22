import Link from "next/link";
import { Post } from "@/lib/types";
import { BookOpen, ChevronRight } from "lucide-react";

interface SeriesListProps {
  seriesMap: Record<string, Post[]>;
}

export function SeriesList({ seriesMap }: SeriesListProps) {
  const seriesEntries = Object.entries(seriesMap);

  if (seriesEntries.length === 0) {
    return (
      <div className="py-20 text-center">
        <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
        <p className="text-muted-foreground">아직 시리즈가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="py-4 grid gap-3">
      {seriesEntries.map(([series, posts]) => (
        <Link
          key={series}
          href={`/series/${encodeURIComponent(series)}/`}
          className="group flex items-center justify-between p-5 rounded-xl border hover:border-primary/30 hover:bg-accent/50 transition-all"
        >
          <div>
            <h3 className="font-bold text-lg mb-1 group-hover:text-primary/80 transition-colors">
              {series}
            </h3>
            <p className="text-sm text-muted-foreground">
              {posts.length}개의 포스트
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </Link>
      ))}
    </div>
  );
}
