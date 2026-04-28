import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { isLocale, localizedPath, t } from "@/lib/iq/i18n";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = isLocale(params.locale) ? params.locale : "fr";
  return {
    title: t(locale, "meta.dashboardTitle"),
    description: t(locale, "home.progressPreviewText"),
    alternates: { canonical: localizedPath(locale, "/dashboard") },
  };
}

export default function DashboardPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream via-white to-cream-200 py-10">
      <div className="container-mg">
        <DashboardClient locale={params.locale} />
      </div>
    </div>
  );
}
