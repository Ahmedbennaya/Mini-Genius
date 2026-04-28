import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, Gauge, Star, Target } from "lucide-react";
import { getGame, relatedGames } from "@/data/iq/games";
import GameCard3D from "@/components/games/GameCard3D";
import BackButton from "@/components/ui/BackButton";
import PremiumButton from "@/components/ui/PremiumButton";
import { isLocale, localizedPath, t } from "@/lib/iq/i18n";

export function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Metadata {
  const locale = isLocale(params.locale) ? params.locale : "fr";
  const game = getGame(params.slug);
  return {
    title: game ? game.title[locale] : t(locale, "common.notFound"),
    description: game ? game.description[locale] : t(locale, "meta.siteDescription"),
  };
}

export default function GameDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const game = getGame(params.slug);
  if (!game) notFound();
  const related = relatedGames(game.slug, 4);

  return (
    <div className="bg-cream py-10">
      <div className="container-mg">
        <BackButton label={t(locale, "cta.backToGames")} />
        <div className="mt-6 grid gap-7 lg:grid-cols-[minmax(0,1fr)_390px]">
          <section className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-lift sm:p-8">
            <div
              className="rounded-[1.75rem] p-7"
              style={{
                background: `linear-gradient(135deg, ${game.colorPalette.primary}80, #fff 56%, ${game.colorPalette.secondary}55)`,
              }}
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-white/80 text-4xl shadow-clay">
                {game.icon}
              </span>
              <h1 className="mt-6 text-4xl sm:text-5xl">{game.title[locale]}</h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-soft">{game.description[locale]}</p>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Info icon={<Target size={18} />} label={t(locale, "games.skill")} value={t(locale, `categories.${game.category}`)} />
              <Info icon={<Gauge size={18} />} label={t(locale, "games.difficulty")} value={t(locale, `difficulty.${game.difficulty}`)} />
              <Info icon={<Clock size={18} />} label={t(locale, "games.duration")} value={`${game.durationMinutes} ${t(locale, "games.minutes")}`} />
              <Info icon={<Star size={18} />} label="Score" value={`${game.points} ${t(locale, "games.points")}`} />
            </div>

            <div className="mt-7 rounded-[1.5rem] border border-cream-300 bg-cream-50 p-5">
              <h2 className="text-2xl">{t(locale, "games.instructions")}</h2>
              <p className="mt-3 leading-8 text-ink-soft">{game.instructions[locale]}</p>
            </div>
          </section>

          <aside className="space-y-5">
            <div className="rounded-[2rem] border border-cream-300 bg-white p-6 shadow-card">
              <PremiumButton href={localizedPath(locale, `/play/${game.slug}`)} tone="coral" className="w-full">
                {t(locale, "games.play")}
              </PremiumButton>
              <div className="mt-5 rounded-[1.5rem] bg-cream-50 p-4">
                <p className="text-sm font-bold text-ink-soft">{t(locale, "home.parentTrustText")}</p>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-12">
          <h2 className="text-3xl">{t(locale, "games.relatedGames")}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <GameCard3D key={item.id} game={item} locale={locale} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-cream-300 bg-cream-50 p-4">
      <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.04em] text-ink-mute">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-sm font-extrabold text-ink">{value}</p>
    </div>
  );
}
