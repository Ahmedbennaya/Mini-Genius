"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, PackageCheck, Sparkles, Truck, Wand2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ToyVisual from "@/components/ui/ToyVisual";
import type { Palette, ToyShape } from "@/data/products";

type Step = {
  index: string;
  title: string;
  desc: string;
  icon: typeof Sparkles;
  shape: ToyShape;
  palette: Palette;
};

const STEPS: Step[] = [
  {
    index: "01",
    title: "Choisissez l'âge",
    desc: "Filtrez la collection par tranche d'âge pour trouver le jouet parfaitement adapté.",
    icon: Sparkles,
    shape: "ball",
    palette: "coral",
  },
  {
    index: "02",
    title: "Sélectionnez le jouet",
    desc: "Montessori, sensoriel, STEM ou cadeau — chaque produit indique ses bienfaits.",
    icon: Wand2,
    shape: "puzzle",
    palette: "mint",
  },
  {
    index: "03",
    title: "Commandez en 1 minute",
    desc: "Ajoutez au panier puis remplissez un court formulaire — paiement à la livraison.",
    icon: PackageCheck,
    shape: "gift",
    palette: "butter",
  },
  {
    index: "04",
    title: "Livraison en Tunisie",
    desc: "Nous livrons partout en Tunisie en 24–72h. Suivi par WhatsApp inclus.",
    icon: Truck,
    shape: "rocket",
    palette: "sky",
  },
];

export default function HowItWorks() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-cream py-14 sm:py-20 lg:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(31,36,51,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(31,36,51,.07)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(184,224,201,.16),transparent_36%,rgba(244,167,143,.12)_68%,transparent)]" />
      </div>

      <div className="container-mg">
        <SectionHeading
          eyebrow="Comment ça marche"
          title="De la sélection à la livraison, simple et serein"
          description="Une expérience pensée pour les parents pressés et les enfants impatients de jouer."
          action={
            <Link href="/collection" className="btn-ghost">
              Commencer maintenant
              <ArrowRight size={16} />
            </Link>
          }
        />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.li
                key={step.index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 0.61, 0.36, 1] }}
                className="group relative"
              >
                <div className="relative h-full overflow-hidden rounded-3xl border border-cream-300 bg-white p-6 shadow-card transition-all duration-500 [transform-style:preserve-3d] group-hover:-translate-y-1.5 group-hover:[transform:rotateX(2deg)_rotateY(-2deg)] group-hover:shadow-lift">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-white to-cream-200 opacity-70"
                  />

                  <div className="relative flex items-center justify-between">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-cream-200 text-coral-deep">
                      <Icon size={20} />
                    </span>
                    <span className="font-display text-[44px] font-semibold leading-none text-ink/8 [text-shadow:0_2px_0_rgba(31,36,51,.04)]">
                      {step.index}
                    </span>
                  </div>

                  <div className="relative mt-6 flex h-28 items-end justify-center">
                    <motion.div
                      animate={
                        shouldReduceMotion
                          ? undefined
                          : { y: [0, -8, 0], rotate: [0, 4, 0] }
                      }
                      transition={{
                        duration: 6 + i * 0.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="will-change-transform"
                    >
                      <ToyVisual shape={step.shape} palette={step.palette} size={108} />
                    </motion.div>
                  </div>

                  <h3 className="relative mt-5 font-display text-[20px] font-semibold leading-snug">
                    {step.title}
                  </h3>
                  <p className="relative mt-1.5 text-[14.5px] leading-relaxed text-ink-soft">
                    {step.desc}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
