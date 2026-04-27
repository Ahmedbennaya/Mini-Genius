"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type LogoProps = {
  className?: string;
  variant?: "header" | "footer" | "admin";
  showWordmark?: boolean;
};

const LOGO_SRC = "/images/logo.png";

export default function Logo({
  className = "",
  variant = "header",
  showWordmark = true,
}: LogoProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const dimensions = {
    header: { width: 154, height: 48, imageClass: "h-10 max-h-12 w-auto sm:h-12" },
    footer: { width: 180, height: 56, imageClass: "h-auto max-h-14 w-auto max-w-[180px]" },
    admin: { width: 220, height: 72, imageClass: "h-auto max-h-[72px] w-auto max-w-[220px]" },
  }[variant];

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 ${className}`}
      aria-label="Mini Genius logo - Accueil"
    >
      {!imageFailed ? (
        <Image
          src={LOGO_SRC}
          alt="Mini Genius logo"
          width={dimensions.width}
          height={dimensions.height}
          priority={variant === "header"}
          className={`${dimensions.imageClass} object-contain`}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <FallbackLogo showWordmark={showWordmark} />
      )}
    </Link>
  );
}

function FallbackLogo({ showWordmark }: { showWordmark: boolean }) {
  return (
    <>
      <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-coral to-coral-deep text-white shadow-clay">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
          <path d="M5 12c0-3 3-5 7-5s7 2 7 5-3 5-7 5c-1 0-2 0-3-.3L5 18l1-3c-.6-.9-1-2-1-3z" fill="currentColor" />
          <circle cx="9.5" cy="12" r="1.2" fill="#1F2433" />
          <circle cx="14.5" cy="12" r="1.2" fill="#1F2433" />
        </svg>
      </span>
      {showWordmark ? (
        <span className="font-display text-lg font-semibold tracking-tight">
          Mini <span className="text-coral-deep">Genius</span>
        </span>
      ) : null}
    </>
  );
}
