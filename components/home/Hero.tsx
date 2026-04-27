"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import ToyVisual from "@/components/ui/ToyVisual";

const VIDEO_SRC = "/media/3d-educational-toys.mp4";

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const videoY = useTransform(scrollYProgress, [0, 1], [0, 72]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -42]);
  const layerRotate = useTransform(scrollYProgress, [0, 1], [0, -10]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden border-b border-cream-300 bg-ink text-white"
    >
      <motion.video
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        src={VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        style={{ scale: videoScale, y: videoY }}
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(31,36,51,.82)_0%,rgba(31,36,51,.58)_48%,rgba(31,36,51,.22)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-cream via-cream/60 to-transparent" />

      <div className="container-mg grid min-h-[78svh] gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.75fr)] lg:items-center">
        <motion.div
          style={{ y: contentY }}
          className="max-w-3xl pt-8 sm:pt-12 lg:pt-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/14 px-3.5 py-1.5 text-[12.5px] font-semibold text-white backdrop-blur-md"
          >
            <Sparkles size={14} className="text-butter" />
            Nouvelle collection Montessori
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 max-w-[780px] font-display text-[clamp(38px,7vw,78px)] leading-[0.98] tracking-tight text-white"
          >
            Des jouets educatifs qui donnent envie d&apos;apprendre
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-5 max-w-[58ch] text-[17px] leading-relaxed text-white/84"
          >
            Montessori, STEM, sensoriel et creatif: une selection premium pour
            apprendre en jouant, avec livraison partout en Tunisie.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link href="/collection" className="btn-coral btn-lg">
              Decouvrir la collection
              <ArrowRight size={18} />
            </Link>
            <Link href="/collection?age=all" className="btn btn-lg border border-white/20 bg-white/12 text-white shadow-soft backdrop-blur-md hover:bg-white/20">
              Choisir par age
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4"
          >
            <div>
              <div className="flex items-center gap-1 text-butter">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                ))}
                <span className="ml-2 text-sm font-semibold text-white">4,9/5</span>
              </div>
              <p className="text-sm text-white/72">Plus de 900 parents satisfaits</p>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <p className="max-w-[220px] text-sm font-semibold leading-snug text-white/82">
              Jouets choisis pour la curiosite, la motricite et l&apos;imagination.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          aria-hidden
          style={{ rotateY: layerRotate }}
          className="hidden h-[520px] [perspective:1100px] lg:block"
        >
          <div className="relative h-full [transform-style:preserve-3d]">
            <DepthToy className="absolute left-8 top-8 [transform:translateZ(90px)_rotate(-8deg)]">
              <ToyVisual shape="cube" palette="butter" size={128} />
            </DepthToy>
            <DepthToy className="absolute right-8 top-16 [transform:translateZ(150px)_rotate(8deg)]">
              <ToyVisual shape="rocket" palette="sky" size={136} />
            </DepthToy>
            <DepthToy className="absolute left-1/2 top-1/2 [transform:translateX(-50%)_translateY(-50%)_translateZ(210px)]">
              <ToyVisual shape="puzzle" palette="mint" size={170} />
            </DepthToy>
            <DepthToy className="absolute bottom-14 left-12 [transform:translateZ(130px)_rotate(7deg)]">
              <ToyVisual shape="blocks" palette="coral" size={132} />
            </DepthToy>
            <DepthToy className="absolute bottom-8 right-14 [transform:translateZ(70px)_rotate(-10deg)]">
              <ToyVisual shape="ring" palette="lavender" size={118} />
            </DepthToy>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function DepthToy({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75, ease: "easeOut" }}
      className={`drop-shadow-[0_24px_42px_rgba(0,0,0,.28)] ${className}`}
    >
      {children}
    </motion.div>
  );
}
