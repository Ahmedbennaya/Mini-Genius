import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GAMES } from "@/data/iq/games";
import GameFilters from "@/components/games/GameFilters";
import { isLocale, localizedPath, t } from "@/lib/iq/i18n";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = isLocale(params.locale) ? params.locale : "fr";
  return {
    title: t(locale, "meta.gamesTitle"),
    description: t(locale, "meta.siteDescription"),
    alternates: { canonical: localizedPath(locale, "/games") },
  };
}

export default function GamesPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { skill?: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;

  return (
    <div className="bg-cream py-10">
      <div className="container-mg">
        <div className="mb-8 max-w-3xl">
          <p className="eyebrow">{t(locale, "nav.games")}</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">{t(locale, "games.title")}</h1>
          <p className="mt-3 text-lg text-ink-soft">{t(locale, "games.subtitle")}</p>
        </div>
        <GameFilters games={GAMES} locale={locale} initialSkill={searchParams?.skill} />
      </div>
    </div>
  );
}
