"use client";

import { Trophy } from "lucide-react";
import type { Game } from "@/data/iq/types";
import type { Locale } from "@/lib/iq/i18n";
import { localizedPath, t } from "@/lib/iq/i18n";
import PremiumButton from "@/components/ui/PremiumButton";

export default function GameResultCard({
  game,
  locale,
  score,
  maxScore,
  correct,
  total,
}: {
  game: Game;
  locale: Locale;
  score: number;
  maxScore: number;
  correct: number;
  total: number;
}) {
  const percentage = maxScore ? Math.round((score / maxScore) * 100) : 0;

  return (
    <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/70 bg-white p-6 text-center shadow-lift">
      <div
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] text-ink shadow-clay"
        style={{ backgroundColor: game.colorPalette.primary }}
      >
        <Trophy size={38} />
      </div>
      <h2 className="mt-5 text-3xl">{game.title[locale]}</h2>
      <p className="mt-2 text-sm font-semibold text-ink-soft">
        {correct}/{total} - {score}/{maxScore} {t(locale, "games.points")}
      </p>
      <div className="mx-auto mt-5 h-4 max-w-sm rounded-full bg-cream-200">
        <div
          className="h-4 rounded-full bg-gradient-to-r from-mint-deep via-butter-deep to-coral-deep"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-3 text-4xl font-semibold text-ink">{percentage}%</p>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <PremiumButton href={localizedPath(locale, `/play/${game.slug}`)} tone="coral">
          {t(locale, "cta.retry")}
        </PremiumButton>
        <PremiumButton href={localizedPath(locale, "/games")} tone="light">
          {t(locale, "cta.backToGames")}
        </PremiumButton>
      </div>
    </div>
  );
}
