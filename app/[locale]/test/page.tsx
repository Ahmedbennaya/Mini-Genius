import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AGE_GROUPS } from "@/data/iq/constants";
import { balancedQuestionSet } from "@/data/iq/testQuestions";
import type { AgeGroup } from "@/data/iq/types";
import TestIntro from "@/components/test/TestIntro";
import TestQuestionCard from "@/components/test/TestQuestionCard";
import { isLocale, localizedPath, t } from "@/lib/iq/i18n";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = isLocale(params.locale) ? params.locale : "fr";
  return {
    title: t(locale, "meta.testTitle"),
    description: t(locale, "test.safetyNotice"),
    alternates: { canonical: localizedPath(locale, "/test") },
  };
}

export default function TestPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { age?: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const age = AGE_GROUPS.includes(searchParams?.age as AgeGroup)
    ? (searchParams?.age as AgeGroup)
    : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream via-white to-cream-200 py-10">
      <div className="container-mg">
        {age ? (
          <TestQuestionCard locale={locale} questions={balancedQuestionSet(age, 24)} />
        ) : (
          <TestIntro locale={locale} />
        )}
      </div>
    </div>
  );
}
