import { CacheBustLink as Link } from "@/components/CacheBustLink";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="py-32 text-center">
      <h1 className="text-6xl font-extrabold mb-4">404</h1>
      <p className="text-lg text-muted-foreground mb-8">
        페이지를 찾을 수 없습니다.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
      >
        <Home className="w-4 h-4" />
        홈으로 돌아가기
      </Link>
    </div>
  );
}
