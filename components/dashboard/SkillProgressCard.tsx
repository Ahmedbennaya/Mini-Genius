import { CATEGORY_ICON, CATEGORY_PALETTES } from "@/data/iq/constants";
import type { CategoryId } from "@/data/iq/types";
import type { Locale } from "@/lib/iq/i18n";
import { t } from "@/lib/iq/i18n";

export default function SkillProgressCard({
  locale,
  category,
  value,
}: {
  locale: Locale;
  category: CategoryId;
  value: number;
}) {
  const palette = CATEGORY_PALETTES[category];

  return (
    <article className="rounded-[1.5rem] border border-cream-300 bg-white p-4 shadow-soft">
      <div className="flex items-center gap-3">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl shadow-soft"
          style={{ backgroundColor: palette.primary }}
        >
          {CATEGORY_ICON[category]}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-extrabold text-ink">{t(locale, `categories.${category}`)}</h3>
          <p className="text-xs font-semibold text-ink-soft">{value}%</p>
        </div>
      </div>
      <div className="mt-4 h-2 rounded-full bg-cream-200">
        <div
          className="h-2 rounded-full"
          style={{ width: `${value}%`, backgroundColor: palette.secondary }}
        />
      </div>
    </article>
  );
}
