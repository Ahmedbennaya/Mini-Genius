import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TestResults from "@/components/test/TestResults";
import { isLocale, localizedPath, t } from "@/lib/iq/i18n";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = isLocale(params.locale) ? params.locale : "fr";
  return {
    title: t(locale, "results.title"),
    description: t(locale, "results.safetyNotice"),
    alternates: { canonical: localizedPath(locale, "/test/results") },
  };
}

export default function ResultsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream via-white to-cream-200 py-10">
      <div className="container-mg">
        <TestResults locale={params.locale} />
      </div>
    </div>
  );
}
