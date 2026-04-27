"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ToyVisual from "@/components/ui/ToyVisual";
import { CATEGORIES, PALETTE_HEX } from "@/data/site";

export default function CategoryCards() {
  return (
    <section className="bg-cream-200/80 py-20 sm:py-24">
      <div className="container-mg">
        <SectionHeading
          eyebrow="Catégories"
          title="Une sélection pour chaque envie"
          description="Du jouet d'éveil pour les plus petits aux défis STEM pour les grands curieux — tout est testé et choisi avec soin."
        />

        <ul className="mt-12 grid gap-7 sm:grid-cols-2">
          {CATEGORIES.map((c, i) => {
            const tint = PALETTE_HEX[c.palette];
            return (
              <motion.li
                key={c.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
              >
                <Link
                  href={`/collection?cat=${c.id}`}
                  className="card-base group flex h-full flex-col overflow-hidden hover:shadow-lift"
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
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
