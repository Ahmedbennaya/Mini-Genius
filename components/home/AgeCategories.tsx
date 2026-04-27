"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ToyVisual from "@/components/ui/ToyVisual";
import { AGES, PALETTE_HEX } from "@/data/site";

export default function AgeCategories() {
  return (
    <section className="container-mg py-20 sm:py-24">
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

      <ul className="mt-10 grid gap-7 sm:grid-cols-2">
        {AGES.map((a, i) => {
          const tint = PALETTE_HEX[a.palette];
          return (
            <motion.li
              key={a.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <Link
                href={`/collection?age=${a.id}`}
                className="card-base group block h-full overflow-hidden p-6 hover:shadow-card"
              >
                <div
                  className="relative flex h-64 items-center justify-center rounded-3xl"
                  style={{
                    background: `linear-gradient(160deg, ${tint.bg}55, ${tint.bg}AA)`,
                  }}
                >
                  <span className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/40" />
                  <div className="animate-float-b">
                    <ToyVisual shape={a.shape} palette={a.palette} size={210} />
                  </div>
                </div>
                <div className="mt-5 flex items-start justify-between gap-3">
                  <div>
                    <div className="font-display text-2xl font-semibold leading-tight">{a.label}</div>
                    <p className="mt-1 text-sm text-ink-soft">{a.desc}</p>
                  </div>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white opacity-90 group-hover:opacity-100 transition">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
