"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { getProductImageFrame, getProductImages, type Product } from "@/data/products";
import { PALETTE_HEX } from "@/data/site";
import ToyVisual from "@/components/ui/ToyVisual";
import { cn } from "@/lib/utils";

type ProductImageGalleryProps = {
  product: Product;
};

const SWIPE_THRESHOLD = 42;

export default function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const images = useMemo(() => getProductImages(product).slice(0, 5), [product]);
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const usableImages = images.filter((image) => !failed[image]);
  const image = usableImages[active] || usableImages[0];
  const imageFrame = getProductImageFrame(product);
  const tint = PALETTE_HEX[product.palette];
  const hasMultiple = usableImages.length > 1;

  function setSafeActive(index: number) {
    if (usableImages.length === 0) return;
    const next = (index + usableImages.length) % usableImages.length;
    setActive(next);
  }

  function onTouchEnd(x: number) {
    if (touchStart === null || !hasMultiple) return;
    const delta = touchStart - x;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      setSafeActive(active + (delta > 0 ? 1 : -1));
    }
    setTouchStart(null);
  }

  return (
    <div className="grid gap-4">
      <div
        className="relative flex items-center justify-center overflow-hidden rounded-[2rem] border border-cream-300 bg-white shadow-card"
        style={{
          aspectRatio: imageFrame.aspectRatio,
          maxHeight: 520,
          background: `radial-gradient(circle at 30% 20%, ${tint.bg}dd, ${tint.bg}66 58%, #fff8ec 100%)`,
        }}
        onTouchStart={(event) => setTouchStart(event.changedTouches[0]?.clientX ?? null)}
        onTouchEnd={(event) => onTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
      >
        {image ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={image}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0"
            >
              <Image
                src={image}
                alt={product.name}
                fill
                unoptimized
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className={cn(
                  "transition duration-700 ease-out lg:hover:scale-[1.035]",
                  imageFrame.fit === "contain" ? "object-contain p-5" : "object-cover"
                )}
                onError={() => {
                  setFailed((current) => ({ ...current, [image]: true }));
                  setActive(0);
                }}
              />
              <span className="absolute inset-0 bg-gradient-to-t from-ink/10 via-transparent to-white/10" />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="animate-float-a">
              <ToyVisual shape={product.shape} palette={product.palette} size={290} />
            </div>
            {images.length > 0 ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-3 py-1.5 text-xs font-semibold text-ink-soft shadow-soft">
                <ImageOff size={14} />
                Image indisponible
              </span>
            ) : null}
          </div>
        )}

        {hasMultiple ? (
          <>
            <button
              type="button"
              onClick={() => setSafeActive(active - 1)}
              className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-ink shadow-soft transition hover:bg-white lg:inline-flex"
              aria-label="Image precedente"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => setSafeActive(active + 1)}
              className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-ink shadow-soft transition hover:bg-white lg:inline-flex"
              aria-label="Image suivante"
            >
              <ChevronRight size={18} />
            </button>
          </>
        ) : null}
      </div>

      <ul className="grid grid-cols-5 gap-2 sm:gap-3">
        {(usableImages.length > 0 ? usableImages : [undefined]).slice(0, 5).map((thumb, index) => {
          const isActive = index === active && Boolean(thumb);
          return (
            <li key={thumb || `fallback-${index}`}>
              <button
                type="button"
                onClick={() => setActive(index)}
                className={cn(
                  "relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border bg-white transition",
                  isActive
                    ? "border-ink shadow-card"
                    : "border-cream-300 hover:border-ink/30 hover:shadow-soft"
                )}
                aria-label={`Voir image ${index + 1}`}
                aria-current={isActive ? "true" : undefined}
              >
                {thumb ? (
                  <Image
                    src={thumb}
                    alt=""
                    fill
                    unoptimized
                    sizes="96px"
                    className="object-cover"
                    onError={() => setFailed((current) => ({ ...current, [thumb]: true }))}
                  />
                ) : (
                  <ToyVisual shape={product.shape} palette={product.palette} size={70} />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
