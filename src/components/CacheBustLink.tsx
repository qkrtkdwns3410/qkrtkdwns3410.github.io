"use client";

import Link from "next/link";
import { ComponentProps } from "react";

const BUILD_TIME = process.env.NEXT_PUBLIC_BUILD_TIME || "";

// 모든 내부 링크에 ?v=빌드타임스탬프를 붙여 브라우저 캐시 우회
export function CacheBustLink({
  href,
  ...props
}: ComponentProps<typeof Link>) {
  const url = typeof href === "string" ? href : href.pathname || "";
  const separator = url.includes("?") ? "&" : "?";
  const cacheBustedHref = `${url}${separator}v=${BUILD_TIME}`;

  return <Link href={cacheBustedHref} {...props} />;
}
