import { Star } from "lucide-react";

export default function Stars({ value, size = 14 }: { value: number; size?: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span className="inline-flex items-center gap-0.5 text-butter-deep" aria-label={`${value} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full || (i === full && half);
        return (
          <Star
            key={i}
            size={size}
            strokeWidth={2}
            fill={filled ? "currentColor" : "transparent"}
          />
        );
      })}
    </span>
  );
}
