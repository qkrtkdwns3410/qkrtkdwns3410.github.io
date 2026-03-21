import { CacheBustLink as Link } from "./CacheBustLink";
import { Post } from "@/lib/types";
import { Calendar, Clock } from "lucide-react";

interface ArticleCardProps {
  post: Post;
}

export function ArticleCard({ post }: ArticleCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/articles/${post.slug}/`} className="group block">
      <article className="py-6 border-b last:border-b-0">
        <div className="flex gap-5">
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs font-medium rounded-full bg-accent text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h2 className="text-lg font-bold mb-1.5 group-hover:text-primary/80 transition-colors line-clamp-2">
              {post.title}
            </h2>

            {/* Description */}
            {post.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {post.description}
              </p>
            )}

            {/* Meta */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readingTime}
              </span>
            </div>
          </div>

          {/* Thumbnail */}
          {post.thumbnail && (
            <div className="w-28 h-28 rounded-lg overflow-hidden shrink-0 bg-muted">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
