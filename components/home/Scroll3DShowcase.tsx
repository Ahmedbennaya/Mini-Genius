"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Brain, Shapes, Sparkles } from "lucide-react";
import ToyVisual from "@/components/ui/ToyVisual";

const STEPS = [
  {
    title: "Observer",
    copy: "Des couleurs douces, des formes lisibles et des pieces faciles a manipuler.",
    icon: Shapes,
    shape: "blocks",
    palette: "coral",
  },
  {
    title: "Comprendre",
    copy: "Des activites progressives pour compter, classer, construire et imaginer.",
    icon: Brain,
    shape: "puzzle",
    palette: "mint",
  },
  {
    title: "Creer",
    copy: "Chaque jouet invite l'enfant a tester, recommencer et etre fier du resultat.",
    icon: Sparkles,
    shape: "rocket",
    palette: "sky",
  },
] as const;

export default function Scroll3DShowcase() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [13, 0, -10]);
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-14, 0, 12]);
  const lift = useTransform(scrollYProgress, [0, 1], [54, -54]);
  const videoScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1.04, 0.98]);

  return (
    <section ref={ref} className="overflow-hidden bg-cream py-14 sm:py-20">
      <div className="container-mg grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <span className="eyebrow">Apprendre en mouvement</span>
          <h2 className="mt-3 max-w-xl font-display text-[clamp(30px,4.5vw,54px)] leading-tight">
            Des jouets qui transforment la curiosite en jeu
          </h2>
          <p className="mt-4 max-w-[55ch] text-ink-soft">
            Une selection douce, tactile et coloree pour aider chaque enfant a
            observer, comprendre et creer avec confiance.
          </p>
        </div>

        <div className="relative min-h-[520px] [perspective:1200px]">
          <motion.div
            style={{ rotateX, rotateY, y: lift, scale: videoScale }}
            className="absolute inset-x-2 top-0 mx-auto h-[360px] max-w-[560px] overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-lift [transform-style:preserve-3d] sm:h-[410px]"
          >
            <video
              src="/media/3d-educational-toys.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/28 via-transparent to-white/10" />
          </motion.div>

          <div className="absolute inset-x-0 bottom-0 grid gap-3 sm:grid-cols-3">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.article
                  key={step.title}
                  initial={{ opacity: 0, y: 28, rotateX: 10 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="relative overflow-hidden rounded-3xl border border-cream-300 bg-white p-4 shadow-card"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-cream-200 text-coral-deep">
                      <Icon size={18} />
                    </span>
                    <ToyVisual shape={step.shape} palette={step.palette} size={58} />
                  </div>
                  <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{step.copy}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
