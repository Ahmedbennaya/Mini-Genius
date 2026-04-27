"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import StaggerGroup, { StaggerItem } from "@/components/motion/StaggerGroup";
import SectionHeading from "@/components/ui/SectionHeading";
import ToyVisual from "@/components/ui/ToyVisual";
import { PALETTE_HEX } from "@/data/site";
import type { Palette, ToyShape } from "@/data/products";
import type { AdminCollection } from "@/lib/admin/types";

const FALLBACKS: Array<{ palette: Palette; shape: ToyShape }> = [
  { palette: "coral", shape: "ball" },
  { palette: "butter", shape: "cube" },
  { palette: "sky", shape: "rocket" },
  { palette: "mint", shape: "ring" },
  { palette: "lavender", shape: "blocks" },
];

export default function AgeCategories({ collections }: { collections: AdminCollection[] }) {
  return (
    <section className="container-mg py-14 sm:py-20 lg:py-24">
      <SectionHeading
        eyebrow="Trouver le bon jouet"
        title="Choisir par collection"
        description="Notre selection est pensee pour chaque etape de la croissance, du tout-petit qui decouvre le monde au grand curieux passionne de sciences."
        action={
          <Link href="/collection?age=all" className="btn-ghost">
            Tous les ages
            <ArrowUpRight size={16} />
          </Link>
        }
      />

      <StaggerGroup as="ul" className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-7 [perspective:1200px]">
        {collections.map((collection, index) => {
          const fallback = FALLBACKS[index % FALLBACKS.length];
          const tint = PALETTE_HEX[fallback.palette];

          return (
            <StaggerItem as="li" key={collection.id}>
              <Link
                href={`/collection?collection=${encodeURIComponent(collection.slug)}`}
                className="card-base group block h-full overflow-hidden p-4 transition-all duration-500 [transform-style:preserve-3d] hover:-translate-y-1.5 hover:[transform:rotateX(2deg)_rotateY(-2deg)] hover:shadow-lift sm:p-6"
              >
                <AgeVisual collection={collection} tintBg={tint.bg} fallback={fallback} />
                <div className="mt-4 flex items-start justify-between gap-3 sm:mt-5">
                  <div>
                    <div className="font-display text-xl font-semibold leading-tight sm:text-2xl">
                      {collection.name}
                    </div>
                    <p className="mt-1 text-sm text-ink-soft">{collection.description}</p>
                  </div>
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-white opacity-90 transition group-hover:opacity-100">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </section>
  );
}

function AgeVisual({
  collection,
  tintBg,
  fallback,
}: {
  collection: AdminCollection;
  tintBg: string;
  fallback: { palette: Palette; shape: ToyShape };
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(collection.image) && !imageFailed;

  return (
    <div
      className="relative flex h-48 items-center justify-center overflow-hidden rounded-3xl sm:h-64"
      style={{
        background: `linear-gradient(160deg, ${tintBg}55, ${tintBg}AA)`,
      }}
    >
      <span className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/40" />
      {showImage ? (
        <Image
          src={collection.image}
          alt={`Jouets ${collection.name}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
          className="object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="animate-float-b">
          <ToyVisual shape={fallback.shape} palette={fallback.palette} size={210} />
        </div>
      )}
      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-ink-soft shadow-soft">
        {collection.ageLabel}
      </span>
    </div>
  );
}
