"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { getPrimaryProductImage, type Product } from "@/data/products";
import { PALETTE_HEX } from "@/data/site";
import ToyVisual from "@/components/ui/ToyVisual";
import { useCart } from "@/lib/cart-context";
import { formatTND } from "@/lib/utils";
import { track } from "@/lib/analytics/track";
import { CURRENCY } from "@/lib/analytics/config";
import QuantitySelector from "@/components/product/QuantitySelector";

export default function CartItem({ product, qty }: { product: Product; qty: number }) {
  const { setQty, remove } = useCart();
  const tint = PALETTE_HEX[product.palette];
  const image = getPrimaryProductImage(product);

  const handleRemove = () => {
    track("remove_from_cart", {
      currency: CURRENCY,
      value: Number((product.price * qty).toFixed(2)),
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          price: product.price,
          quantity: qty,
        },
      ],
    });
    remove(product.id);
  };

  return (
    <div className="grid grid-cols-[96px_1fr] gap-4 rounded-3xl border border-cream-300 bg-white p-4 sm:grid-cols-[120px_1fr_auto] sm:p-5">
      <Link
        href={`/produit/${product.slug}`}
        className="relative flex h-24 items-center justify-center overflow-hidden rounded-2xl sm:h-28"
        style={{ background: `linear-gradient(160deg, ${tint.bg}55, ${tint.bg}aa)` }}
      >
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            unoptimized
            sizes="120px"
            className="object-cover"
          />
        ) : (
          <ToyVisual shape={product.shape} palette={product.palette} size={88} />
        )}
      </Link>

      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/produit/${product.slug}`}
              className="block truncate font-display text-lg font-semibold hover:text-coral-deep"
            >
              {product.name}
            </Link>
            <div className="mt-1 text-sm text-ink-soft">{product.age}</div>
          </div>
          <button
            onClick={handleRemove}
            aria-label="Retirer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-ink-soft hover:bg-cream-200 hover:text-coral-deep transition"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 sm:hidden">
          <QuantitySelector value={qty} onChange={(n) => setQty(product.id, n)} />
          <span className="font-display text-lg font-semibold">
            {formatTND(product.price * qty)}
          </span>
        </div>
      </div>

      <div className="hidden flex-col items-end justify-between sm:flex">
        <QuantitySelector value={qty} onChange={(n) => setQty(product.id, n)} />
        <span className="font-display text-xl font-semibold">
          {formatTND(product.price * qty)}
        </span>
      </div>
    </div>
  );
}
