import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "박상준 블로그",
  description: "달을 향해 쏴라, 빗나가도 별이 될테니",
  icons: { icon: "/favicon.ico" },
  // GitHub Pages CDN 캐시 이후 브라우저 캐시 방지 - 배포 즉시 최신 콘텐츠 제공
  other: {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <Header />
          <main className="max-w-3xl mx-auto px-4 pb-20">{children}</main>
          <footer className="border-t py-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} 박상준. All rights reserved.</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
