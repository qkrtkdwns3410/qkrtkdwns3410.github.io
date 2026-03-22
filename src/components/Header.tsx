"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight hover:opacity-80 transition-opacity"
        >
          <span className="text-primary">@박상준</span>
        </Link>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link
            href="/admin/"
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
            aria-label="Admin"
          >
            <Settings className="w-[18px] h-[18px]" />
          </Link>
        </div>
      </div>
    </header>
  );
}
