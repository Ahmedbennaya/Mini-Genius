import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { GAMES } from "@/data/iq/games";
import { CATEGORY_IDS, ZONES } from "@/data/iq/constants";
import IQHero3D from "@/components/iq-room/IQHero3D";
import ZonePortal3D from "@/components/iq-room/ZonePortal3D";
import GameCard3D from "@/components/games/GameCard3D";
import SkillCard3D from "@/components/iq-room/SkillCard3D";
import PremiumButton from "@/components/ui/PremiumButton";
import { isLocale, localizedPath, t, type Locale } from "@/lib/iq/i18n";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = isLocale(params.locale) ? params.locale : "fr";
  return {
    title: t(locale, "meta.siteTitle"),
    description: t(locale, "meta.siteDescription"),
    alternates: { canonical: localizedPath(locale, "/") },
  };
}

export default function IQHomePage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const featured = GAMES.filter((game) => game.recommended).slice(0, 8);

  return (
    <>
      <IQHero3D locale={locale} />

      <section className="bg-white/45 py-14">
        <div className="container-mg">
          <div className="max-w-3xl">
            <p className="eyebrow">{t(locale, "home.zonesTitle")}</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">{t(locale, "home.zonesTitle")}</h2>
            <p className="mt-3 text-ink-soft">{t(locale, "home.zonesSubtitle")}</p>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {ZONES.map((zone) => (
              <ZonePortal3D key={zone.id} zone={zone} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-mg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">{t(locale, "home.featuredTitle")}</p>
              <h2 className="mt-3 text-3xl sm:text-4xl">{t(locale, "home.featuredTitle")}</h2>
              <p className="mt-3 text-ink-soft">{t(locale, "home.featuredSubtitle")}</p>
            </div>
            <PremiumButton href={localizedPath(locale, "/games")} tone="light">
              {t(locale, "cta.exploreGames")}
            </PremiumButton>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((game) => (
              <GameCard3D key={game.id} game={game} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream-50 py-14">
        <div className="container-mg grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-cream-300 bg-white p-7 shadow-card">
            <ShieldCheck className="text-mint-deep" size={34} />
            <h2 className="mt-4 text-3xl">{t(locale, "home.parentTrust")}</h2>
            <p className="mt-3 leading-8 text-ink-soft">{t(locale, "home.parentTrustText")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <PremiumButton href={localizedPath(locale, "/test")} tone="coral">
                {t(locale, "cta.startTest")}
              </PremiumButton>
              <PremiumButton href={localizedPath(locale, "/dashboard")} tone="light">
                {t(locale, "nav.dashboard")}
              </PremiumButton>
            </div>
          </div>

          <div className="rounded-[2rem] border border-cream-300 bg-white p-7 shadow-card">
            <h2 className="text-3xl">{t(locale, "home.progressPreviewTitle")}</h2>
            <p className="mt-3 text-ink-soft">{t(locale, "home.progressPreviewText")}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {CATEGORY_IDS.slice(0, 6).map((category, index) => (
                <SkillCard3D
                  key={category}
                  category={category}
                  locale={locale}
                  value={[82, 76, 68, 73, 61, 79][index] ?? 70}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-mg">
          <h2 className="text-3xl sm:text-4xl">{t(locale, "home.faqTitle")}</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <article key={item} className="rounded-[1.5rem] border border-cream-300 bg-white p-5 shadow-soft">
                <h3 className="text-lg">{t(locale, `faq.q${item}`)}</h3>
                <p className="mt-2 leading-7 text-ink-soft">{t(locale, `faq.a${item}`)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
