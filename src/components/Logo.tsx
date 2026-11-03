"use client";

import Link from "next/link";
import { useId } from "react";

type LogoProps = {
  href?: string;
  onClick?: () => void;
  compact?: boolean;
};

export function Logo({ href = "/", onClick, compact = false }: LogoProps) {
  const gradId = useId().replace(/:/g, "");

  const mark = (
    <span className="brand-mark" aria-hidden>
      <svg
        viewBox="0 0 48 48"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="48" height="48" rx="14" fill={`url(#${gradId})`} />
        <path
          d="M11 34V14h4.4v7.6L21.8 14H27l-7.2 9.2L27.4 34h-5.3l-5.3-8.1V34H11z"
          fill="#F7FAF8"
        />
        <path
          d="M29.2 14h4.2c4.1 0 6.8 2.3 6.8 5.9 0 2.5-1.3 4.3-3.5 5.1L40.2 34h-4.7l-3.1-8.4h-0.8V34h-4.2V14zm4.3 9.2c1.7 0 2.7-.9 2.7-2.3s-1-2.3-2.7-2.3h-1.5v4.6h1.5z"
          fill="#E8C96A"
        />
        <defs>
          <linearGradient
            id={gradId}
            x1="8"
            y1="4"
            x2="42"
            y2="46"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#2F6B49" />
            <stop offset="1" stopColor="#163628" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );

  const content = (
    <>
      {mark}
      {!compact ? (
        <span className="brand-text">
          <strong>KaCollection</strong>
          <em>Curated Rwanda</em>
        </span>
      ) : null}
    </>
  );

  if (!href) {
    return <span className="brand">{content}</span>;
  }

  return (
    <Link href={href} className="brand" onClick={onClick}>
      {content}
    </Link>
  );
}
