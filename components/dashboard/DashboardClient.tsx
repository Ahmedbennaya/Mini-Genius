"use client";

import { BADGES } from "@/data/iq/badges";
import { CATEGORY_IDS } from "@/data/iq/constants";
import type { Locale } from "@/lib/iq/i18n";
import { localizedPath, t } from "@/lib/iq/i18n";
import { useIqProgressStore } from "@/lib/iq/progress-store";
import PremiumButton from "@/components/ui/PremiumButton";
import ProgressRadar from "@/components/dashboard/ProgressRadar";
import SkillProgressCard from "@/components/dashboard/SkillProgressCard";

export default function DashboardClient({ locale }: { locale: Locale }) {
  const { child, recentGames, completedTests, skillProgress, badges } = useIqProgressStore();
  const earnedBadges = BADGES.filter((badge) => badges.includes(badge.id));

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
      <section className="space-y-6">
        <div className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-lift sm:p-8">
          <p className="eyebrow">{t(locale, "dashboard.welcome")}</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">{t(locale, "dashboard.title")}</h1>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Metric label={t(locale, "dashboard.childProfile")} value={`${child.name} · ${child.ageGroup}`} />
            <Metric label={t(locale, "dashboard.completedTests")} value={String(completedTests.length)} />
            <Metric label={t(locale, "dashboard.badges")} value={String(earnedBadges.length)} />
          </div>
        </div>

        <div className="rounded-[2rem] border border-cream-300 bg-white p-6 shadow-card">
          <h2 className="text-2xl">{t(locale, "dashboard.skillProgress")}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {CATEGORY_IDS.map((category) => (
              <SkillProgressCard
                key={category}
                locale={locale}
                category={category}
                value={skillProgress[category] ?? 0}
              />
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-cream-300 bg-white p-6 shadow-card">
          <h2 className="text-2xl">{t(locale, "dashboard.recentGames")}</h2>
          {recentGames.length ? (
            <div className="mt-5 grid gap-3">
              {recentGames.map((game) => (
                <a
                  key={`${game.slug}-${game.playedAt}`}
                  href={localizedPath(locale, `/games/${game.slug}`)}
                  className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-cream-300 bg-cream-50 p-4 transition hover:bg-white hover:shadow-soft"
                >
                  <div>
                    <p className="font-extrabold text-ink">{game.title}</p>
                    <p className="text-xs font-semibold text-ink-soft">{t(locale, `categories.${game.category}`)}</p>
                  </div>
                  <span className="rounded-full bg-butter/70 px-3 py-1 text-sm font-extrabold text-ink">
                    {game.score}/{game.maxScore}
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-[1.25rem] bg-cream-50 p-4 font-semibold text-ink-soft">
              {t(locale, "dashboard.noData")}
            </p>
          )}
        </div>
      </section>

      <aside className="space-y-5">
        <div className="rounded-[2rem] border border-cream-300 bg-white p-5 shadow-card">
          <h2 className="text-2xl">{t(locale, "dashboard.weeklyProgress")}</h2>
          <div className="mt-4">
            <ProgressRadar locale={locale} values={skillProgress} />
          </div>
        </div>

        <div className="rounded-[2rem] border border-cream-300 bg-white p-5 shadow-card">
          <h2 className="text-2xl">{t(locale, "dashboard.badges")}</h2>
          <div className="mt-4 grid gap-3">
            {earnedBadges.map((badge) => (
              <div key={badge.id} className="flex items-center gap-3 rounded-[1.25rem] bg-cream-50 p-3">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl shadow-soft"
                  style={{ backgroundColor: badge.color }}
                >
                  {badge.icon}
                </span>
                <div>
                  <p className="font-extrabold text-ink">{badge.title[locale]}</p>
                  <p className="text-xs font-semibold text-ink-soft">{badge.description[locale]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-cream-300 bg-white p-5 shadow-card">
          <h2 className="text-2xl">{t(locale, "dashboard.nextActivities")}</h2>
          <div className="mt-5 grid gap-3">
            <PremiumButton href={localizedPath(locale, "/test")} tone="coral" className="w-full">
              {t(locale, "cta.startTest")}
            </PremiumButton>
            <PremiumButton href={localizedPath(locale, "/games")} tone="light" className="w-full">
              {t(locale, "cta.exploreGames")}
            </PremiumButton>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-cream-300 bg-cream-50 p-4">
      <p className="text-xs font-extrabold uppercase tracking-[0.04em] text-ink-mute">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}
