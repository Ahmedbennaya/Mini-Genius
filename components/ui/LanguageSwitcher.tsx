"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe2 } from "lucide-react";
import {
  LOCALE_LABEL,
  SUPPORTED_LOCALES,
  isLocale,
  type Locale,
} from "@/lib/iq/i18n";
import { cn } from "@/lib/utils";

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? `/${locale}`;
  const parts = pathname.split("/");
  const current = isLocale(parts[1]) ? parts[1] : locale;

  function hrefFor(next: Locale) {
    const nextParts = [...parts];
    if (isLocale(nextParts[1])) nextParts[1] = next;
    else nextParts.splice(1, 0, next);
    return nextParts.join("/") || `/${next}`;
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-cream-300 bg-white/90 p-1 shadow-soft">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cream-100 text-ink-soft">
        <Globe2 size={16} />
      </span>
      {SUPPORTED_LOCALES.map((item) => (
        <Link
          key={item}
          href={hrefFor(item)}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-bold transition",
            current === item
              ? "bg-ink text-white shadow-soft"
              : "text-ink-soft hover:bg-cream-100 hover:text-ink",
          )}
          aria-label={LOCALE_LABEL[item]}
        >
          {item.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
