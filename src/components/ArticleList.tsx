import { Post } from "@/lib/types";
import { ArticleCard } from "./ArticleCard";
import { FileText } from "lucide-react";

interface ArticleListProps {
  posts: Post[];
}

export function ArticleList({ posts }: ArticleListProps) {
  if (posts.length === 0) {
    return (
      <div className="py-20 text-center">
        <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
        <p className="text-muted-foreground">아직 작성된 글이 없습니다.</p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          첫 번째 글을 작성해보세요!
        </p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <ArticleCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
