"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Sparkles, Star } from "lucide-react";
import type { Game } from "@/data/iq/types";
import type { Locale } from "@/lib/iq/i18n";
import { localizedPath, t } from "@/lib/iq/i18n";

export default function GameCard3D({
  game,
  locale,
}: {
  game: Game;
  locale: Locale;
}) {
  return (
    <motion.article
      layout
      whileHover={{ y: -7, rotateX: 3, rotateY: -2 }}
      className="group perspective-hero"
    >
      <Link
        href={localizedPath(locale, `/games/${game.slug}`)}
        className="block h-full overflow-hidden rounded-[1.65rem] border border-white/70 bg-white shadow-soft transition hover:shadow-lift"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="relative min-h-40 overflow-hidden p-5"
          style={{
            background: `linear-gradient(135deg, ${game.colorPalette.primary}85, #fff 56%, ${game.colorPalette.secondary}65)`,
          }}
        >
          <span className="absolute right-4 top-4 rounded-full bg-white/75 px-3 py-1 text-xs font-extrabold text-ink-soft shadow-soft">
            {t(locale, `difficulty.${game.difficulty}`)}
          </span>
          <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-white/75 text-4xl shadow-clay transition group-hover:scale-105">
            {game.icon}
          </div>
          <div className="mt-5 flex items-center gap-2 text-xs font-extrabold text-ink-soft">
            <Sparkles size={14} />
            {t(locale, `categories.${game.category}`)}
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold leading-tight text-ink">
              {game.title[locale]}
            </h3>
            {game.recommended ? (
              <span className="rounded-full bg-butter px-2.5 py-1 text-[11px] font-extrabold text-ink">
                {t(locale, "common.recommended")}
              </span>
            ) : null}
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-soft">
            {game.description[locale]}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-bold text-ink-soft">
            <span className="inline-flex items-center gap-1 rounded-full bg-cream-100 px-3 py-1">
              <Clock size={13} />
              {game.durationMinutes} {t(locale, "games.minutes")}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-cream-100 px-3 py-1">
              <Star size={13} />
              {game.points} {t(locale, "games.points")}
            </span>
            <span className="rounded-full bg-cream-100 px-3 py-1">
              {t(locale, `ageGroups.${game.ageGroup}`)}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
