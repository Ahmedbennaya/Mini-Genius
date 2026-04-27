"use client";

import { Minus, Plus } from "lucide-react";

type Props = {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  className?: string;
};

export default function QuantitySelector({ value, onChange, min = 1, max = 99, className = "" }: Props) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));
  return (
    <div
      className={`inline-flex h-12 items-center rounded-full border border-cream-300 bg-white ${className}`}
    >
      <button
        onClick={dec}
        aria-label="Diminuer"
        className="inline-flex h-12 w-12 items-center justify-center rounded-l-full text-ink hover:bg-cream-200 disabled:opacity-40"
        disabled={value <= min}
      >
        <Minus size={16} />
      </button>
      <span className="min-w-[28px] text-center font-semibold">{value}</span>
      <button
        onClick={inc}
        aria-label="Augmenter"
        className="inline-flex h-12 w-12 items-center justify-center rounded-r-full text-ink hover:bg-cream-200 disabled:opacity-40"
        disabled={value >= max}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
