"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import StaggerGroup, { StaggerItem } from "@/components/motion/StaggerGroup";
import SectionHeading from "@/components/ui/SectionHeading";
import ToyVisual from "@/components/ui/ToyVisual";
import { CATEGORIES, PALETTE_HEX } from "@/data/site";

export default function CategoryCards() {
  return (
    <section className="bg-cream-200/80 py-14 sm:py-20 lg:py-24">
      <div className="container-mg">
        <SectionHeading
          eyebrow="Catégories"
          title="Une sélection pour chaque envie"
          description="Du jouet d'éveil pour les plus petits aux défis STEM pour les grands curieux — tout est testé et choisi avec soin."
        />

        <StaggerGroup as="ul" className="mt-12 grid gap-7 sm:grid-cols-2 [perspective:1200px]">
          {CATEGORIES.map((c) => {
            const tint = PALETTE_HEX[c.palette];
            return (
              <StaggerItem
                as="li"
                key={c.id}
              >
                <Link
                  href={`/collection?cat=${c.id}`}
                  className="card-base group flex h-full flex-col overflow-hidden transition-all duration-500 [transform-style:preserve-3d] hover:-translate-y-1.5 hover:[transform:rotateX(2deg)_rotateY(2deg)] hover:shadow-lift"
                >
                  <div
                    className="relative flex h-64 items-center justify-center"
                    style={{
                      background: `radial-gradient(circle at 30% 20%, ${tint.bg}cc, ${tint.bg}66 65%, transparent 80%)`,
                    }}
                  >
                    <div className="animate-float-a">
                      <ToyVisual shape={c.shape} palette={c.palette} size={220} />
                    </div>
                    <span className="absolute top-4 right-4 pill bg-white/90">
                      {c.count} produits
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-xl font-semibold">{c.name}</h3>
                    <p className="mt-1.5 text-[15px] text-ink-soft">{c.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-coral-deep">
                      Voir la sélection
                      <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
