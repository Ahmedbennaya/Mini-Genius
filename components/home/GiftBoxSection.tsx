"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Gift } from "lucide-react";
import ToyVisual from "@/components/ui/ToyVisual";

export default function GiftBoxSection() {
  return (
    <section className="container-mg py-20 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-coral/85 via-coral to-coral-deep p-10 text-white shadow-lift sm:p-14 lg:p-20"
      >
        {/* decorative blobs */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-12 h-72 w-72 rounded-full bg-butter/40 blur-3xl" />
        </div>

        <div className="relative grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur">
              <Gift size={14} />
              COFFRETS CADEAUX
            </span>
            <h2 className="mt-4 font-display text-[clamp(28px,4.4vw,52px)] leading-[1.05]">
              Des coffrets cadeaux intelligents pour chaque âge
            </h2>
            <p className="mt-4 max-w-xl text-white/90">
              Anniversaire, naissance ou occasion spéciale&nbsp;: trouvez le cadeau qui
              fera briller les yeux de l&apos;enfant et qui l&apos;accompagnera longtemps.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/collection?cat=cadeaux"
                className="btn bg-white text-ink hover:bg-cream-100 btn-lg"
              >
                Trouver le cadeau parfait
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/collection"
                className="btn border border-white/30 text-white hover:bg-white/10 btn-lg"
              >
                Voir tous les jouets
              </Link>
            </div>
          </div>

          <div className="relative h-[260px] lg:h-[340px]">
            <div className="absolute right-4 top-2 animate-float-a">
              <ToyVisual shape="gift" palette="butter" size={200} />
            </div>
            <div className="absolute left-2 bottom-2 animate-float-c">
              <ToyVisual shape="ring" palette="lavender" size={130} />
            </div>
            <div className="absolute right-1/3 bottom-2 animate-float-b">
              <ToyVisual shape="ball" palette="mint" size={110} />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
