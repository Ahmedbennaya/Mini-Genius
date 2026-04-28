"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Gamepad2, ShieldCheck, Sparkles } from "lucide-react";
import { GAMES } from "@/data/iq/games";
import { CATEGORY_IDS, ZONES } from "@/data/iq/constants";
import type { Locale } from "@/lib/iq/i18n";
import { localizedPath, t } from "@/lib/iq/i18n";
import FloatingToyBrain from "@/components/iq-room/FloatingToyBrain";
import PremiumButton from "@/components/ui/PremiumButton";

export default function IQHero3D({ locale }: { locale: Locale }) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#FBF6EE_0%,#fffdfa_58%,#F5EDDF_100%)] px-5 py-8 sm:py-12">
      <div className="container-mg grid items-center gap-8 lg:grid-cols-[1.05fr_.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-cream-300 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.04em] text-ink-soft shadow-soft">
            <Sparkles size={15} className="text-coral-deep" />
            {t(locale, "home.badge")}
          </span>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.02] text-ink sm:text-6xl">
            {t(locale, "home.heroTitle")}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-ink-soft sm:text-lg">
            {t(locale, "home.heroSubtitle")}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <PremiumButton href={localizedPath(locale, "/test")} tone="coral">
              {t(locale, "cta.startTest")}
            </PremiumButton>
            <PremiumButton href={localizedPath(locale, "/games")} tone="light">
              {t(locale, "cta.exploreGames")}
            </PremiumButton>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <HeroStat icon={<Gamepad2 size={18} />} value={`${GAMES.length}+`} label={t(locale, "home.statsGames")} />
            <HeroStat icon={<Brain size={18} />} value={String(CATEGORY_IDS.length)} label={t(locale, "home.statsSkills")} />
            <HeroStat icon={<ShieldCheck size={18} />} value="3" label={t(locale, "home.statsLanguages")} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, rotateX: 8 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="perspective-hero"
        >
          <div className="relative min-h-[520px] overflow-hidden rounded-[2.25rem] border border-white/70 bg-gradient-to-br from-white via-cream-100 to-sky/30 p-5 shadow-lift preserve-3d">
            <div className="absolute inset-x-8 bottom-12 h-24 rounded-[50%] bg-cream-300/60 blur-2xl" />
            <div className="relative z-10 rounded-[1.75rem] border border-white/70 bg-white/55 p-5 shadow-card backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.05em] text-ink-mute">
                    Mini Genius
                  </p>
                  <h2 className="mt-1 text-2xl">{t(locale, "meta.homeTitle")}</h2>
                </div>
                <span className="rounded-full bg-mint px-3 py-1 text-xs font-extrabold text-ink">
                  Live
                </span>
              </div>
            </div>

            <div className="relative z-10 mt-8">
              <FloatingToyBrain />
            </div>

            <div className="relative z-10 mt-8 grid grid-cols-2 gap-3">
              {ZONES.slice(0, 6).map((zone) => (
                <Link
                  key={zone.id}
                  href={`${localizedPath(locale, "/games")}?skill=${zone.category}`}
                  className="rounded-2xl border border-white/70 bg-white/75 p-3 shadow-soft transition hover:-translate-y-1 hover:shadow-card"
                >
                  <span className="text-xl">{zone.icon}</span>
                  <p className="mt-1 truncate text-xs font-extrabold text-ink">
                    {t(locale, `zones.${zone.id}`)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HeroStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-cream-300 bg-white p-4 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-butter/70 text-ink">
          {icon}
        </span>
        <div>
          <p className="text-2xl font-semibold leading-none text-ink">{value}</p>
          <p className="mt-1 text-xs font-bold text-ink-soft">{label}</p>
        </div>
      </div>
    </div>
  );
}
