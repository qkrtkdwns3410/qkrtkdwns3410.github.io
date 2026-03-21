"use client";

import { useState, useMemo } from "react";
import { Post } from "@/lib/types";
import { ArticleList } from "./ArticleList";
import { SeriesList } from "./SeriesList";
import { Search } from "lucide-react";

interface HomeContentProps {
  posts: Post[];
  seriesMap: Record<string, Post[]>;
}

const tabs = [
  { key: "articles", label: "전체" },
  { key: "series", label: "시리즈" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export function HomeContent({ posts, seriesMap }: HomeContentProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("articles");
  const [query, setQuery] = useState("");

  const filteredPosts = useMemo(() => {
    if (!query.trim()) return posts;
    const q = query.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [posts, query]);

  const filteredSeriesMap = useMemo(() => {
    if (!query.trim()) return seriesMap;
    const q = query.toLowerCase();
    const result: Record<string, Post[]> = {};
    for (const [name, seriesPosts] of Object.entries(seriesMap)) {
      if (name.toLowerCase().includes(q)) {
        result[name] = seriesPosts;
      }
    }
    return result;
  }, [seriesMap, query]);

  return (
    <>
      {/* Tabs */}
      <nav className="flex items-center gap-1 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Search */}
      <div className="relative mt-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="제목, 설명, 태그로 검색..."
          className="w-full h-10 pl-10 pr-4 text-sm bg-muted rounded-lg border border-transparent focus:border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      {/* Content */}
      <section className="mt-2">
        {activeTab === "series" ? (
          <SeriesList seriesMap={filteredSeriesMap} />
        ) : (
          <ArticleList posts={filteredPosts} />
        )}
      </section>
    </>
  );
}
