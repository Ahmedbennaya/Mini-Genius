import { CATEGORY_IDS, CATEGORY_PALETTES } from "@/data/iq/constants";
import type { CategoryId } from "@/data/iq/types";
import type { Locale } from "@/lib/iq/i18n";
import { t } from "@/lib/iq/i18n";

export default function ProgressRadar({
  locale,
  values,
}: {
  locale: Locale;
  values: Partial<Record<CategoryId, number>>;
}) {
  const size = 260;
  const center = size / 2;
  const maxRadius = 88;
  const points = CATEGORY_IDS.map((category, index) => {
    const angle = (Math.PI * 2 * index) / CATEGORY_IDS.length - Math.PI / 2;
    const value = Math.max(8, values[category] ?? 22);
    const radius = (value / 100) * maxRadius;
    return {
      category,
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
      labelX: center + Math.cos(angle) * (maxRadius + 24),
      labelY: center + Math.sin(angle) * (maxRadius + 24),
    };
  });
  const polygon = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="mx-auto max-w-[290px]">
      <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={t(locale, "dashboard.skillProgress")}>
        {[0.25, 0.5, 0.75, 1].map((scale) => (
          <circle
            key={scale}
            cx={center}
            cy={center}
            r={maxRadius * scale}
            fill="none"
            stroke="#ECE3D2"
            strokeWidth="1.5"
          />
        ))}
        {CATEGORY_IDS.map((category, index) => {
          const angle = (Math.PI * 2 * index) / CATEGORY_IDS.length - Math.PI / 2;
          const x = center + Math.cos(angle) * maxRadius;
          const y = center + Math.sin(angle) * maxRadius;
          return <line key={category} x1={center} y1={center} x2={x} y2={y} stroke="#ECE3D2" strokeWidth="1" />;
        })}
        <polygon points={polygon} fill="#A8D0E6AA" stroke="#6FA8C9" strokeWidth="3" />
        {points.map((point) => (
          <g key={point.category}>
            <circle cx={point.x} cy={point.y} r="5" fill={CATEGORY_PALETTES[point.category].secondary} />
            <text
              x={point.labelX}
              y={point.labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="8"
              fontWeight="700"
              fill="#4A5063"
            >
              {point.category.slice(0, 3).toUpperCase()}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {CATEGORY_IDS.slice(0, 6).map((category) => (
          <div key={category} className="flex items-center gap-2 text-[11px] font-bold text-ink-soft">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: CATEGORY_PALETTES[category].secondary }}
            />
            <span className="truncate">{t(locale, `categories.${category}`)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
