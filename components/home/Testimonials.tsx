"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Stars from "@/components/ui/Stars";
import { TESTIMONIALS, PALETTE_HEX } from "@/data/site";

export default function Testimonials() {
  return (
    <section className="bg-cream-200/80 py-20 sm:py-24">
      <div className="container-mg">
        <SectionHeading
          eyebrow="Avis de parents"
          title="Ils ont essayé Mini Genius"
          description="Des familles partout en Tunisie nous font confiance pour offrir le meilleur à leurs enfants."
        />

        <ul className="mt-12 grid gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => {
            const tint = PALETTE_HEX[t.palette];
            return (
              <motion.li
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="card-base relative p-6 lg:p-8"
              >
                <span
                  className="absolute -top-3 left-6 inline-flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-card"
                  style={{ background: tint.deep }}
                >
                  <Quote size={16} />
                </span>
                <Stars value={t.rating} />
                <p className="mt-4 text-[16.5px] leading-relaxed text-ink">“{t.text}”</p>
                <div className="mt-6 flex items-center gap-3">
                  <span
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full font-semibold text-white"
                    style={{ background: tint.deep }}
                  >
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <div className="font-semibold text-ink">{t.name}</div>
                    <div className="text-sm text-ink-soft">{t.city}</div>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
