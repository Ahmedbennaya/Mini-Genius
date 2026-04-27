"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Star } from "lucide-react";
import ToyVisual from "@/components/ui/ToyVisual";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-10 pb-20 sm:pt-14 sm:pb-28">
      {/* soft background blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-24 h-[480px] w-[480px] rounded-full bg-coral/35 blur-3xl" />
        <div className="absolute top-20 -right-24 h-[420px] w-[420px] rounded-full bg-sky/45 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-butter/40 blur-3xl" />
      </div>

      <div className="container-mg grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        {/* Copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-cream-300 bg-white/70 px-3.5 py-1.5 text-[12.5px] font-semibold text-ink-soft backdrop-blur"
          >
            <Sparkles size={14} className="text-coral-deep" />
            Nouvelle collection Montessori
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 font-display text-[clamp(36px,6vw,68px)] leading-[1.02] tracking-tight"
          >
            Des jouets éducatifs qui développent{" "}
            <span className="relative inline-block">
              <span className="relative z-10">l&apos;intelligence</span>
              <span className="absolute inset-x-0 bottom-1 -z-0 h-3 rounded bg-butter/80" />
            </span>{" "}
            de votre enfant
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-5 max-w-[58ch] text-[17px] leading-relaxed text-ink-soft"
          >
            Découvrez une sélection de jouets Montessori, sensoriels et créatifs pour
            apprendre en jouant. Livraison partout en Tunisie, paiement à la livraison.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link href="/collection" className="btn-coral btn-lg">
              Découvrir la collection
              <ArrowRight size={18} />
            </Link>
            <Link href="/collection?age=all" className="btn-ghost btn-lg">
              Choisir par âge
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex items-center gap-6"
          >
            <div className="flex -space-x-2">
              {(["bg-coral", "bg-mint", "bg-butter", "bg-sky"] as const).map((c, i) => (
                <span
                  key={i}
                  className={`inline-block h-9 w-9 rounded-full ring-2 ring-cream ${c}`}
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-butter-deep">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                ))}
                <span className="ml-2 text-sm font-semibold text-ink">4,9/5</span>
              </div>
              <p className="text-sm text-ink-soft">Plus de 900 parents satisfaits</p>
            </div>
          </motion.div>
        </div>

        {/* Visual cluster */}
        <div className="relative h-[360px] sm:h-[460px] lg:h-[560px]">
          <FloatingItem className="absolute left-2 top-6 sm:left-6 sm:top-10 animate-float-a">
            <ToyVisual shape="cube" palette="butter" size={170} />
          </FloatingItem>
          <FloatingItem className="absolute right-4 top-0 sm:right-10 animate-float-c">
            <ToyVisual shape="rocket" palette="sky" size={180} />
          </FloatingItem>
          <FloatingItem className="absolute left-1/2 top-1/3 -translate-x-1/2 animate-float-b">
            <ToyVisual shape="puzzle" palette="mint" size={210} />
          </FloatingItem>
          <FloatingItem className="absolute left-2 bottom-2 sm:left-12 sm:bottom-6 animate-float-c">
            <ToyVisual shape="blocks" palette="coral" size={170} />
          </FloatingItem>
          <FloatingItem className="absolute right-2 bottom-4 sm:right-10 sm:bottom-10 animate-float-a">
            <ToyVisual shape="ring" palette="lavender" size={150} />
          </FloatingItem>

          {/* sparkles */}
          <span aria-hidden className="absolute right-1/4 top-1/4 h-2.5 w-2.5 rounded-full bg-white shadow-card" />
          <span aria-hidden className="absolute left-1/4 bottom-1/4 h-2 w-2 rounded-full bg-white shadow-card" />
        </div>
      </div>
    </section>
  );
}

function FloatingItem({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
