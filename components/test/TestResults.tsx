"use client";

import { useMemo } from "react";
import { Download, Printer, ShieldCheck, Trophy } from "lucide-react";
import { getGame } from "@/data/iq/games";
import type { Locale } from "@/lib/iq/i18n";
import { localizedPath, t } from "@/lib/iq/i18n";
import { formatDuration } from "@/lib/iq/test-scoring";
import { useIqProgressStore } from "@/lib/iq/progress-store";
import PremiumButton from "@/components/ui/PremiumButton";
import ProgressRadar from "@/components/dashboard/ProgressRadar";

export default function TestResults({ locale }: { locale: Locale }) {
  const completedTests = useIqProgressStore((store) => store.completedTests);
  const result = completedTests[0];
  const recommendedGames = useMemo(
    () => (result?.recommendedGameSlugs ?? []).map((slug) => getGame(slug)).filter(Boolean),
    [result?.recommendedGameSlugs],
  );

  function download() {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "mini-genius-learning-score.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (!result) {
    return (
      <div className="rounded-[2rem] border border-cream-300 bg-white p-8 text-center shadow-card">
        <h1 className="text-3xl">{t(locale, "results.title")}</h1>
        <p className="mt-3 text-ink-soft">{t(locale, "dashboard.noData")}</p>
        <PremiumButton href={localizedPath(locale, "/test")} tone="coral" className="mt-6">
          {t(locale, "cta.startTest")}
        </PremiumButton>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
      <div className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-lift sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-butter/70 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.04em] text-ink">
              <Trophy size={16} />
              {t(locale, "results.levelLabel")}
            </span>
            <h1 className="mt-4 text-4xl">{t(locale, "results.title")}</h1>
            <p className="mt-3 max-w-2xl text-ink-soft">{t(locale, "results.subtitle")}</p>
          </div>
          <div className="rounded-[1.5rem] bg-cream-50 p-5 text-center shadow-soft">
            <p className="text-sm font-extrabold text-ink-soft">{t(locale, "results.overall")}</p>
            <p className="mt-1 text-5xl font-semibold text-ink">{result.percentage}%</p>
            <p className="mt-1 text-sm font-bold text-coral-deep">{result.levelLabel}</p>
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          <Metric label={t(locale, "results.overall")} value={`${result.totalScore}/${result.maxScore}`} />
          <Metric label={t(locale, "results.completionTime")} value={formatDuration(result.durationSeconds)} />
          <Metric label={t(locale, "results.levelLabel")} value={result.levelLabel} />
        </div>

        <div className="mt-7">
          <h2 className="text-2xl">{t(locale, "results.skills")}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {result.breakdown.map((item) => (
              <div key={item.category} className="rounded-[1.25rem] border border-cream-300 bg-cream-50 p-4">
                <div className="flex items-center justify-between gap-3 text-sm font-extrabold">
                  <span>{t(locale, `categories.${item.category}`)}</span>
                  <span>{item.percentage}%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white">
                  <div className="h-2 rounded-full bg-mint-deep" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-7 rounded-[1.5rem] bg-cream-50 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck size={22} className="mt-0.5 text-mint-deep" />
            <p className="text-sm leading-6 font-semibold text-ink-soft">{t(locale, "results.safetyNotice")}</p>
          </div>
        </div>
      </div>

      <aside className="space-y-5">
        <div className="rounded-[2rem] border border-cream-300 bg-white p-5 shadow-card">
          <h2 className="text-2xl">{t(locale, "dashboard.skillProgress")}</h2>
          <div className="mt-4">
            <ProgressRadar
              locale={locale}
              values={Object.fromEntries(result.breakdown.map((item) => [item.category, item.percentage]))}
            />
          </div>
        </div>

        <div className="rounded-[2rem] border border-cream-300 bg-white p-5 shadow-card">
          <h2 className="text-xl">{t(locale, "results.recommendedGames")}</h2>
          <div className="mt-4 space-y-3">
            {recommendedGames.map((game) => game ? (
              <a
                key={game.slug}
                href={localizedPath(locale, `/games/${game.slug}`)}
                className="block rounded-[1.25rem] border border-cream-300 bg-cream-50 p-3 transition hover:bg-white hover:shadow-soft"
              >
                <p className="font-extrabold text-ink">{game.title[locale]}</p>
                <p className="text-xs font-semibold text-ink-soft">{t(locale, `categories.${game.category}`)}</p>
              </a>
            ) : null)}
          </div>
        </div>

        <div className="grid gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-cream-300 bg-white px-5 py-3 text-sm font-extrabold text-ink shadow-soft transition hover:shadow-card"
          >
            <Printer size={16} />
            {t(locale, "results.print")}
          </button>
          <button
            type="button"
            onClick={download}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-extrabold text-white shadow-card transition hover:bg-[#2b3144]"
          >
            <Download size={16} />
            {t(locale, "results.download")}
          </button>
        </div>
      </aside>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.35rem] border border-cream-300 bg-cream-50 p-4">
      <p className="text-xs font-extrabold uppercase tracking-[0.04em] text-ink-mute">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}
