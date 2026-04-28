import type { Locale } from "@/lib/iq/i18n";
import { t } from "@/lib/iq/i18n";

export default function TestProgress({
  locale,
  current,
  total,
}: {
  locale: Locale;
  current: number;
  total: number;
}) {
  const percent = total ? Math.round((current / total) * 100) : 0;

  return (
    <div className="rounded-[1.5rem] border border-cream-300 bg-white p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between text-sm font-bold text-ink-soft">
        <span>{t(locale, "test.progress")}</span>
        <span>
          {current} {t(locale, "test.of")} {total}
        </span>
      </div>
      <div className="h-3 rounded-full bg-cream-200">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-mint-deep via-sky-deep to-coral-deep"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
