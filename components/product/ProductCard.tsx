"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Eye, Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { getProductImageFrame, getProductImages, type Product } from "@/data/products";
import { CATEGORIES, PALETTE_HEX } from "@/data/site";
import ToyVisual from "@/components/ui/ToyVisual";
import Stars from "@/components/ui/Stars";
import { useCart } from "@/lib/cart-context";
import { cn, formatTND } from "@/lib/utils";

export default function ProductCard({ product }: { product: Product }) {
  const tint = PALETTE_HEX[product.palette];
  const images = getProductImages(product);
  const imageFrame = getProductImageFrame(product);
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  const visibleImages = images.filter((image) => !failed[image]);
  const primaryImage = visibleImages[0];
  const hoverImage = visibleImages[1];
  const categoryName =
    CATEGORIES.find((category) => category.id === product.category)?.name || product.category;
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  const handleAdd = () => {
    if (!product.inStock) return;
    add(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45 }}
      className="group relative flex h-full min-h-[610px] flex-col overflow-hidden rounded-3xl border border-cream-300 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div
        className="relative overflow-hidden rounded-b-[1.35rem]"
        style={{
          background: `radial-gradient(circle at 28% 20%, ${tint.bg}dd, ${tint.bg}55 62%, #fffaf2 100%)`,
        }}
      >
        <Link
          href={`/produit/${product.slug}`}
          className="relative block overflow-hidden"
          style={{ aspectRatio: imageFrame.aspectRatio }}
        >
          {primaryImage ? (
            <>
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                unoptimized
                sizes="(min-width: 1280px) 280px, (min-width: 768px) 33vw, 90vw"
                className={cn(
                  "transition duration-700 ease-out group-hover:scale-[1.04]",
                  imageFrame.fit === "contain" ? "object-contain p-3" : "object-cover"
                )}
                onError={() => setFailed((current) => ({ ...current, [primaryImage]: true }))}
              />
              {hoverImage ? (
                <Image
                  src={hoverImage}
                  alt=""
                  fill
                  unoptimized
                  sizes="(min-width: 1280px) 280px, (min-width: 768px) 33vw, 90vw"
                  className={cn(
                    "opacity-0 transition duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-100",
                    imageFrame.fit === "contain" ? "object-contain p-3" : "object-cover"
                  )}
                  onError={() => setFailed((current) => ({ ...current, [hoverImage]: true }))}
                />
              ) : null}
              <span className="absolute inset-0 bg-gradient-to-t from-ink/10 via-transparent to-white/10" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-white/25">
              <div className="animate-float-a">
                <ToyVisual shape={product.shape} palette={product.palette} size={150} />
              </div>
            </div>
          )}
        </Link>

        <div className="absolute left-3 top-3 flex max-w-[calc(100%-4rem)] flex-wrap items-start gap-1.5">
          <span className="rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.04em] text-ink-soft shadow-soft backdrop-blur">
            {categoryName}
          </span>
          {product.bestseller ? (
            <span className="rounded-full border border-transparent bg-ink/90 px-3 py-1 text-[11px] font-bold text-white shadow-soft">
              Bestseller
            </span>
          ) : null}
          {product.isNew ? (
            <span className="rounded-full border border-transparent bg-coral-deep px-3 py-1 text-[11px] font-bold text-white shadow-soft">
              Nouveau
            </span>
          ) : null}
          {discount > 0 ? (
            <span className="rounded-full border border-transparent bg-butter-deep px-3 py-1 text-[11px] font-bold text-ink shadow-soft">
              -{discount}%
            </span>
          ) : null}
        </div>

        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setFavorite((value) => !value)}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-ink shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:bg-white",
              favorite && "text-coral-deep"
            )}
            aria-label="Ajouter aux favoris"
            aria-pressed={favorite}
          >
            <Heart size={17} fill={favorite ? "currentColor" : "none"} />
          </button>
          <Link
            href={`/produit/${product.slug}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-ink shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
            aria-label={`Apercu rapide ${product.name}`}
          >
            <Eye size={17} />
          </Link>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
          <span className="rounded-full border border-white/80 bg-white/95 px-3 py-1 text-xs font-bold text-ink shadow-soft">
            {product.age}
          </span>
          {images.length > 1 ? (
            <span className="flex items-center gap-1.5 rounded-full border border-white/70 bg-white/85 px-2.5 py-1.5 shadow-soft backdrop-blur">
              {images.slice(0, 5).map((image, index) => (
                <span
                  key={`${image}-${index}`}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition",
                    index === 0 ? "bg-ink" : "bg-ink/25 group-hover:bg-coral-deep/70"
                  )}
                />
              ))}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex min-h-[248px] flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-ink-soft">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-bold",
              product.inStock ? "bg-mint/45 text-ink" : "bg-coral/20 text-coral-deep"
            )}
          >
            {product.inStock ? "En stock" : "Rupture"}
          </span>
          <span className="flex items-center gap-2">
            <Stars value={product.rating} />
            <span>{product.reviews} avis</span>
          </span>
        </div>

        <h3 className="mt-2 min-h-[48px] font-display text-[18px] font-semibold leading-snug line-clamp-2">
          <Link href={`/produit/${product.slug}`} className="hover:text-coral-deep">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 min-h-[40px] text-sm text-ink-soft line-clamp-2">{product.benefit}</p>

        <div className="mt-auto flex flex-wrap items-baseline gap-2 pt-4">
          <span className="font-display text-2xl font-semibold">{formatTND(product.price)}</span>
          {product.oldPrice ? (
            <span className="text-sm text-ink-mute line-through">{formatTND(product.oldPrice)}</span>
          ) : null}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Link
            href={`/produit/${product.slug}`}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-cream-300 bg-white px-3 py-3 text-center text-sm font-bold text-ink shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
            aria-label={`Voir ${product.name}`}
          >
            <Eye size={15} />
            Voir le produit
          </Link>
          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-ink px-3 py-3 text-center text-sm font-bold text-white shadow-[0_8px_18px_rgba(31,36,51,.18)] transition hover:-translate-y-0.5 hover:bg-[#2C3247] disabled:cursor-not-allowed disabled:opacity-55"
            aria-label={`Ajouter ${product.name} au panier`}
          >
            {added ? <Check size={15} /> : <ShoppingBag size={15} />}
            {added ? "Ajoute" : "Ajouter au panier"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
