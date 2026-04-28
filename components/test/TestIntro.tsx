"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Brain, Clock, ShieldCheck } from "lucide-react";
import { AGE_GROUPS } from "@/data/iq/constants";
import type { AgeGroup } from "@/data/iq/types";
import {
  LOCALE_LABEL,
  SUPPORTED_LOCALES,
  localizedPath,
  t,
  type Locale,
} from "@/lib/iq/i18n";

export default function TestIntro({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [age, setAge] = useState<AgeGroup>("6-8");
  const [testLocale, setTestLocale] = useState<Locale>(locale);

  function start() {
    router.push(`${localizedPath(testLocale, "/test")}?age=${age}`);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <div className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-lift sm:p-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-mint/60 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.04em] text-ink-soft">
          <Brain size={16} />
          Mini Genius Skills
        </span>
        <h1 className="mt-5 text-4xl sm:text-5xl">{t(locale, "test.introTitle")}</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-ink-soft">
          {t(locale, "test.introSubtitle")}
        </p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-extrabold text-ink">
              {t(locale, "test.chooseAge")}
            </span>
            <select
              value={age}
              onChange={(event) => setAge(event.target.value as AgeGroup)}
              className="h-13 w-full rounded-2xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm font-bold text-ink-soft outline-none focus:border-coral-deep focus:ring-4 focus:ring-coral-deep/15"
            >
              {AGE_GROUPS.map((item) => (
                <option key={item} value={item}>{t(locale, `ageGroups.${item}`)}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-extrabold text-ink">
              {t(locale, "test.chooseLanguage")}
            </span>
            <select
              value={testLocale}
              onChange={(event) => setTestLocale(event.target.value as Locale)}
              className="h-13 w-full rounded-2xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm font-bold text-ink-soft outline-none focus:border-coral-deep focus:ring-4 focus:ring-coral-deep/15"
            >
              {SUPPORTED_LOCALES.map((item) => (
                <option key={item} value={item}>{LOCALE_LABEL[item]}</option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="button"
          onClick={start}
          className="mt-7 inline-flex items-center justify-center rounded-full bg-coral-deep px-7 py-4 text-base font-extrabold text-white shadow-coral transition hover:-translate-y-0.5 hover:bg-[#d86f55]"
        >
          {t(locale, "test.startTest")}
        </button>
      </div>

      <aside className="rounded-[2rem] border border-cream-300 bg-cream-50 p-6 shadow-card">
        <div className="rounded-[1.5rem] bg-white p-5 shadow-soft">
          <Clock className="text-sky-deep" size={26} />
          <p className="mt-3 text-sm font-extrabold text-ink">{t(locale, "test.estimatedTime")}</p>
          <p className="mt-1 text-3xl font-semibold text-ink">8-12 min</p>
        </div>
        <div className="mt-4 rounded-[1.5rem] bg-white p-5 shadow-soft">
          <ShieldCheck className="text-mint-deep" size={26} />
          <p className="mt-3 text-sm leading-6 font-semibold text-ink-soft">
            {t(locale, "test.safetyNotice")}
          </p>
        </div>
      </aside>
    </div>
  );
}
