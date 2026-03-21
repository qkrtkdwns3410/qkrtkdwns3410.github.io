import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "박상준 블로그",
  description: "달을 향해 쏴라, 빗나가도 별이 될테니",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* 직접 URL 접속 시에도 ?v=빌드타임스탬프를 붙여 캐시 우회 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var v="${process.env.NEXT_PUBLIC_BUILD_TIME}";if(!window.location.search.includes("v="+v)){window.location.replace(window.location.pathname+"?v="+v+window.location.hash)}})()`,
          }}
        />
      </head>
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
