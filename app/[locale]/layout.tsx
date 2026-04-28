import Link from "next/link";
import { notFound } from "next/navigation";
import { BrainCircuit, Gamepad2, LayoutDashboard, Store, Trophy } from "lucide-react";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import {
  LOCALE_DIRECTION,
  SUPPORTED_LOCALES,
  isLocale,
  localizedPath,
  t,
  type Locale,
} from "@/lib/iq/i18n";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default function IQLocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;

  return (
    <div lang={locale} dir={LOCALE_DIRECTION[locale]} className="min-h-screen bg-cream text-ink">
      <header className="sticky top-0 z-50 border-b border-cream-300/80 bg-cream/88 backdrop-blur-xl">
        <div className="container-mg flex min-h-20 items-center justify-between gap-4">
          <Link href={localizedPath(locale, "/")} className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-coral text-ink shadow-clay">
              <BrainCircuit size={24} />
            </span>
            <span>
              <span className="block text-lg font-extrabold leading-tight">Mini Genius</span>
              <span className="block text-xs font-bold text-ink-soft">IQ Room</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <IQNavLink href={localizedPath(locale, "/games")} icon={<Gamepad2 size={16} />} label={t(locale, "nav.games")} />
            <IQNavLink href={localizedPath(locale, "/test")} icon={<Trophy size={16} />} label={t(locale, "nav.test")} />
            <IQNavLink href={localizedPath(locale, "/dashboard")} icon={<LayoutDashboard size={16} />} label={t(locale, "nav.dashboard")} />
            <IQNavLink href="/" icon={<Store size={16} />} label={t(locale, "nav.shop")} />
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher locale={locale} />
            <Link
              href={localizedPath(locale, "/test")}
              className="hidden rounded-full bg-ink px-4 py-2 text-sm font-extrabold text-white shadow-soft transition hover:bg-[#2b3144] sm:inline-flex"
            >
              {t(locale, "cta.startTest")}
            </Link>
          </div>
        </div>
      </header>

      <main id="main">{children}</main>

      <footer className="border-t border-cream-300 bg-white/60">
        <div className="container-mg flex flex-col gap-4 py-8 text-sm font-semibold text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>Mini Genius IQ Room - playful learning, not medical diagnosis.</p>
          <div className="flex flex-wrap gap-3">
            <Link href={localizedPath(locale, "/games")} className="hover:text-ink">{t(locale, "nav.games")}</Link>
            <Link href={localizedPath(locale, "/test")} className="hover:text-ink">{t(locale, "nav.test")}</Link>
            <Link href="/admin" className="hover:text-ink">{t(locale, "nav.admin")}</Link>
            <Link href="/" className="hover:text-ink">{t(locale, "nav.backToShop")}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function IQNavLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold text-ink-soft transition hover:bg-white hover:text-ink hover:shadow-soft"
    >
      {icon}
      {label}
    </Link>
  );
}
