"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Eye, Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import {
  getProductImageFrame,
  getProductImagePosition,
  getProductImages,
  type Product,
} from "@/data/products";
import { CATEGORIES, PALETTE_HEX } from "@/data/site";
import ToyVisual from "@/components/ui/ToyVisual";
import Stars from "@/components/ui/Stars";
import { useCart } from "@/lib/cart-context";
import {
  buildMetaCatalogData,
  createMetaEventId,
  trackMetaEvent,
} from "@/lib/meta-pixel";
import { cn, formatTND } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  index?: number;
  compact?: boolean;
  wide?: boolean;
};

export default function ProductCard({ product, index = 0, compact = false, wide = false }: ProductCardProps) {
  const tint = PALETTE_HEX[product.palette];
  const images = getProductImages(product);
  const imageFrame = getProductImageFrame(product);
  const imagePosition = getProductImagePosition(product);
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
    trackMetaEvent(
      "AddToCart",
      buildMetaCatalogData(
        [
          {
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            qty: 1,
          },
        ],
        product.price,
        { contentName: product.name, contentCategory: product.category }
      ),
      {
        eventId: createMetaEventId("AddToCart", product.id),
        sendToServer: true,
      }
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const handleFavorite = () => {
    const nextFavorite = !favorite;
    setFavorite(nextFavorite);

    if (!nextFavorite) return;

    trackMetaEvent(
      "AddToWishlist",
      buildMetaCatalogData(
        [
          {
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            qty: 1,
          },
        ],
        product.price,
        { contentName: product.name, contentCategory: product.category }
      ),
      {
        eventId: createMetaEventId("AddToWishlist", product.id),
        sendToServer: true,
      }
    );
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.045, 0.28) }}
      whileHover={{ y: -3 }}
      className={cn(
        "group relative flex h-full min-w-0 flex-col overflow-hidden border border-cream-300 bg-white shadow-soft transition-shadow duration-300 hover:shadow-card",
        compact ? "rounded-2xl" : "rounded-[1.35rem]",
        wide && !compact && "md:grid md:grid-cols-[minmax(220px,300px)_minmax(0,1fr)]"
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden border-b border-cream-300/70",
          wide && !compact && "md:border-b-0 md:border-r"
        )}
        style={{
          background: `radial-gradient(circle at 28% 20%, ${tint.bg}dd, ${tint.bg}55 62%, #fffaf2 100%)`,
        }}
      >
        <Link
          href={`/produit/${product.slug}`}
          className={cn(
            "relative block overflow-hidden bg-white/45",
            compact ? "aspect-square" : "aspect-[4/3]",
            wide && !compact && "md:h-full md:min-h-[250px] md:aspect-auto"
          )}
        >
          {primaryImage ? (
            <>
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                unoptimized
                sizes={compact ? "(min-width: 1280px) 180px, 45vw" : "(min-width: 1280px) 320px, (min-width: 768px) 33vw, 90vw"}
                className={cn(
                  "transition duration-700 ease-out group-hover:scale-[1.035]",
                  imageFrame.fit === "cover" ? "object-cover" : "object-contain",
                  imageFrame.fit === "contain" && (compact ? "p-2" : "p-4")
                )}
                style={{ objectPosition: imagePosition.objectPosition }}
                onError={() => setFailed((current) => ({ ...current, [primaryImage]: true }))}
              />
              {hoverImage ? (
                <Image
                  src={hoverImage}
                  alt=""
                  fill
                  unoptimized
                  sizes={compact ? "(min-width: 1280px) 180px, 45vw" : "(min-width: 1280px) 320px, (min-width: 768px) 33vw, 90vw"}
                  className={cn(
                    "opacity-0 transition duration-700 ease-out group-hover:scale-[1.035] group-hover:opacity-100",
                    imageFrame.fit === "cover" ? "object-cover" : "object-contain",
                    imageFrame.fit === "contain" && (compact ? "p-2" : "p-4")
                  )}
                  style={{ objectPosition: imagePosition.objectPosition }}
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

        <div className={cn("absolute flex max-w-[calc(100%-4rem)] flex-wrap items-start gap-1.5", compact ? "left-2 top-2" : "left-3 top-3")}>
          {!compact ? (
            <span className="rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.04em] text-ink-soft shadow-soft backdrop-blur">
              {categoryName}
            </span>
          ) : null}
          {product.bestseller ? (
            <span className={cn("rounded-full border border-transparent bg-ink/90 font-bold text-white shadow-soft", compact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-[11px]")}>
              Bestseller
            </span>
          ) : null}
          {product.isNew ? (
            <span className={cn("rounded-full border border-transparent bg-coral-deep font-bold text-white shadow-soft", compact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-[11px]")}>
              Nouveau
            </span>
          ) : null}
          {discount > 0 ? (
            <span className={cn("rounded-full border border-transparent bg-butter-deep font-bold text-ink shadow-soft", compact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-[11px]")}>
              -{discount}%
            </span>
          ) : null}
        </div>

        <div className={cn("absolute flex flex-col gap-2", compact ? "right-2 top-2" : "right-3 top-3")}>
          <button
            type="button"
            onClick={handleFavorite}
            className={cn(
              "inline-flex items-center justify-center rounded-full border border-white/70 bg-white/90 text-ink shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:bg-white",
              compact ? "h-8 w-8" : "h-10 w-10",
              favorite && "text-coral-deep"
            )}
            aria-label="Ajouter aux favoris"
            aria-pressed={favorite}
          >
            <Heart size={compact ? 14 : 17} fill={favorite ? "currentColor" : "none"} />
          </button>
          {!compact ? (
            <Link
              href={`/produit/${product.slug}`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-ink shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
              aria-label={`Apercu rapide ${product.name}`}
            >
              <Eye size={17} />
            </Link>
          ) : null}
        </div>

        <div className={cn("absolute flex items-center justify-between gap-3", compact ? "bottom-2 left-2 right-2" : "bottom-3 left-3 right-3")}>
          {!compact ? (
            <span className="rounded-full border border-white/80 bg-white/95 px-3 py-1 text-xs font-bold text-ink shadow-soft">
              {product.age}
            </span>
          ) : null}
          {images.length > 1 && !compact ? (
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

      <div className={cn("flex flex-1 flex-col", compact ? "p-3" : "p-5 sm:p-6")}>
        <div className={cn("flex flex-wrap items-center justify-between gap-2 text-ink-soft", compact ? "text-xs" : "text-sm")}>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-bold",
              product.inStock ? "bg-mint/45 text-ink" : "bg-coral/20 text-coral-deep"
            )}
          >
            {product.inStock ? "En stock" : "Rupture"}
          </span>
          <span className={cn("items-center gap-2", compact ? "hidden" : "flex")}>
            <Stars value={product.rating} />
            <span>{product.reviews} avis</span>
          </span>
        </div>

        <h3 className={cn("mt-2 font-display font-semibold leading-snug line-clamp-2", compact ? "min-h-[40px] text-[14px]" : "min-h-[48px] text-[18px]")}>
          <Link href={`/produit/${product.slug}`} className="hover:text-coral-deep">
            {product.name}
          </Link>
        </h3>
        <p className={cn("mt-1 text-ink-soft line-clamp-2", compact ? "hidden" : "min-h-[40px] text-sm")}>{product.benefit}</p>

        <div className={cn("mt-auto flex flex-wrap items-baseline gap-2", compact ? "pt-3" : "pt-4")}>
          <span className={cn("font-display font-semibold", compact ? "text-xl" : "text-2xl")}>{formatTND(product.price)}</span>
          {product.oldPrice ? (
            <span className={cn("text-ink-mute line-through", compact ? "text-xs" : "text-sm")}>{formatTND(product.oldPrice)}</span>
          ) : null}
        </div>

        <div className={cn("grid gap-3", compact ? "mt-3" : "mt-5 sm:grid-cols-2")}>
          {!compact ? (
            <Link
              href={`/produit/${product.slug}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-cream-300 bg-white px-3 py-3 text-center text-sm font-bold text-ink shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
              aria-label={`Voir ${product.name}`}
            >
              <Eye size={15} />
              Voir le produit
            </Link>
          ) : null}
          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-3 text-center font-bold text-white shadow-[0_8px_18px_rgba(31,36,51,.18)] transition hover:-translate-y-0.5 hover:bg-[#2C3247] disabled:cursor-not-allowed disabled:opacity-55",
              compact ? "min-h-10 py-2 text-xs" : "min-h-12 py-3 text-sm"
            )}
            aria-label={`Ajouter ${product.name} au panier`}
          >
            {added ? <Check size={15} /> : <ShoppingBag size={15} />}
            {added ? "Ajoute" : compact ? "Ajouter" : "Ajouter au panier"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
