"use client";

import Link from "next/link";
import { ComponentProps } from "react";

export const BUILD_TIME = process.env.NEXT_PUBLIC_BUILD_TIME || "";

// URL에 ?v=빌드타임스탬프를 붙여 캐시 우회
export function cacheBustUrl(url: string): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${BUILD_TIME}`;
}

export function CacheBustLink({
  href,
  ...props
}: ComponentProps<typeof Link>) {
  const url = typeof href === "string" ? href : href.pathname || "";
  return <Link href={cacheBustUrl(url)} {...props} />;
}
