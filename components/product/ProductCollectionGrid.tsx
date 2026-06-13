"use client";

import { useEffect, useState } from "react";
import { LayoutGrid } from "lucide-react";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";
import ProductCard from "./ProductCard";

type ColumnCount = 1 | 2 | 3 | 5;

const OPTIONS: ColumnCount[] = [1, 2, 3, 5];

const GRID_CLASSES: Record<ColumnCount, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
  5: "grid-cols-2 md:grid-cols-3 xl:grid-cols-5",
};

const GAP_CLASSES: Record<ColumnCount, string> = {
  1: "gap-5",
  2: "gap-6",
  3: "gap-6",
  5: "gap-3",
};

export default function ProductCollectionGrid({ products }: { products: Product[] }) {
  const [columns, setColumns] = useState<ColumnCount>(3);

  useEffect(() => {
    const saved = Number(window.localStorage.getItem("mgCollectionColumns"));
    if (OPTIONS.includes(saved as ColumnCount)) setColumns(saved as ColumnCount);
  }, []);

  function chooseColumns(value: ColumnCount) {
    setColumns(value);
    window.localStorage.setItem("mgCollectionColumns", String(value));
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft">
          <LayoutGrid size={16} />
          Vue
        </div>
        <div
          className="inline-flex rounded-full border border-cream-300 bg-white p-1 shadow-soft"
          role="group"
          aria-label="Produits par ligne"
        >
          {OPTIONS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => chooseColumns(value)}
              aria-pressed={columns === value}
              className={cn(
                "inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-bold text-ink-soft transition hover:bg-cream-200",
                columns === value && "bg-ink text-white shadow-soft hover:bg-ink"
              )}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className={cn("grid", GRID_CLASSES[columns], GAP_CLASSES[columns])}>
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            compact={columns === 5}
            wide={columns === 1}
          />
        ))}
      </div>
    </div>
  );
}
