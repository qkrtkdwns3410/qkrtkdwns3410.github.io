"use client";

import { siteConfig } from "@/lib/config";
import { Mail, Github, Globe } from "lucide-react";

interface ProfileSectionProps {
  postCount: number;
}

export function ProfileSection({ postCount }: ProfileSectionProps) {
  return (
    <section className="py-10 border-b">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shrink-0 overflow-hidden">
          {siteConfig.avatar ? (
            <img
              src={siteConfig.avatar}
              alt={siteConfig.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                target.parentElement!.textContent = siteConfig.name[0];
              }}
            />
          ) : (
            siteConfig.name[0]
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col items-center sm:items-start gap-3">
          <h1 className="text-2xl font-bold">{siteConfig.name}</h1>
          <p className="text-muted-foreground text-center sm:text-left">
            {siteConfig.bio}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              <strong className="text-foreground">{postCount}</strong> 게시글
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            <a
              href={`mailto:${siteConfig.email}`}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Email"
            >
              <Mail className="w-[18px] h-[18px]" />
            </a>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              aria-label="GitHub"
            >
              <Github className="w-[18px] h-[18px]" />
            </a>
            <a
              href={siteConfig.website}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Website"
            >
              <Globe className="w-[18px] h-[18px]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
