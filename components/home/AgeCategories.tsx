"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import StaggerGroup, { StaggerItem } from "@/components/motion/StaggerGroup";
import SectionHeading from "@/components/ui/SectionHeading";
import ToyVisual from "@/components/ui/ToyVisual";
import { AGES, PALETTE_HEX } from "@/data/site";
import type { AgeDef } from "@/data/site";

export default function AgeCategories() {
  return (
    <section className="container-mg py-14 sm:py-20 lg:py-24">
      <SectionHeading
        eyebrow="Trouver le bon jouet"
        title="Choisir par âge"
        description="Notre sélection est pensée pour chaque étape de la croissance — du tout-petit qui découvre le monde au grand curieux passionné de sciences."
        action={
          <Link href="/collection?age=all" className="btn-ghost">
            Tous les âges
            <ArrowUpRight size={16} />
          </Link>
        }
      />

      <StaggerGroup as="ul" className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-7 [perspective:1200px]">
        {AGES.map((a) => {
          const tint = PALETTE_HEX[a.palette];
          return (
            <StaggerItem
              as="li"
              key={a.id}
            >
              <Link
                href={`/collection?age=${a.id}`}
                className="card-base group block h-full overflow-hidden p-4 transition-all duration-500 [transform-style:preserve-3d] hover:-translate-y-1.5 hover:[transform:rotateX(2deg)_rotateY(-2deg)] hover:shadow-lift sm:p-6"
              >
                <AgeVisual age={a} tintBg={tint.bg} />
                <div className="mt-4 flex items-start justify-between gap-3 sm:mt-5">
                  <div>
                    <div className="font-display text-xl font-semibold leading-tight sm:text-2xl">{a.label}</div>
                    <p className="mt-1 text-sm text-ink-soft">{a.desc}</p>
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

function AgeVisual({ age, tintBg }: { age: AgeDef; tintBg: string }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = !!age.image && !imageFailed;

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
          src={age.image!}
          alt={`Jouets ${age.label}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
          className="object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="animate-float-b">
          <ToyVisual shape={age.shape} palette={age.palette} size={210} />
        </div>
      )}
    </div>
  );
}
