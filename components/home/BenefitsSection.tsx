"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ToyVisual from "@/components/ui/ToyVisual";
import { BENEFITS, PALETTE_HEX } from "@/data/site";

export default function BenefitsSection() {
  return (
    <section className="container-mg py-20 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        {/* Visual */}
        <div className="relative order-last lg:order-first">
          <div className="relative mx-auto h-[420px] w-full max-w-md rounded-[2rem] bg-gradient-to-br from-mint/60 via-butter/40 to-coral/50 shadow-card overflow-hidden">
            <div className="absolute -top-6 left-6 animate-float-a">
              <ToyVisual shape="puzzle" palette="mint" size={170} />
            </div>
            <div className="absolute right-6 top-1/3 animate-float-c">
              <ToyVisual shape="cube" palette="butter" size={140} />
            </div>
            <div className="absolute bottom-4 left-1/4 animate-float-b">
              <ToyVisual shape="rocket" palette="coral" size={150} />
            </div>
            <div className="absolute right-2 bottom-2 animate-float-a">
              <ToyVisual shape="ring" palette="lavender" size={110} />
            </div>
          </div>
        </div>

        {/* Copy + benefits */}
        <div>
          <SectionHeading
            eyebrow="Pourquoi les parents nous adorent"
            title="Des jouets qui font la différence, jour après jour"
            description="Choisis avec rigueur, nos jouets sont conçus pour faire grandir l'enfant — la concentration, la confiance et la curiosité — sans écrans."
          />

          <ul className="mt-8 space-y-3">
            {BENEFITS.map((b, i) => {
              const tint = PALETTE_HEX[b.palette];
              return (
                <motion.li
                  key={b.title}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex items-start gap-4 rounded-2xl border border-cream-300 bg-white/80 p-4"
                >
                  <span
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                    style={{ background: tint.deep }}
                  >
                    <Check size={18} />
                  </span>
                  <div>
                    <div className="font-semibold text-ink">{b.title}</div>
                    <p className="text-sm text-ink-soft">{b.desc}</p>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
