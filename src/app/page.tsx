import { getAllPosts, getPostsBySeries, getAllSeries } from "@/lib/posts";
import { ProfileSection } from "@/components/ProfileSection";
import { HomeContent } from "@/components/HomeContent";

export default function Home() {
  const posts = getAllPosts();

  const seriesMap: Record<string, typeof posts> = {};
  const seriesNames = getAllSeries();
  seriesNames.forEach((name) => {
    seriesMap[name] = getPostsBySeries(name);
  });

  return (
    <>
      <ProfileSection postCount={posts.length} />
      <HomeContent posts={posts} seriesMap={seriesMap} />
    </>
  );
}
