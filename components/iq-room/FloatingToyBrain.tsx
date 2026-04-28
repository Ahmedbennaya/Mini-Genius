"use client";

import { motion } from "framer-motion";
import { Brain } from "lucide-react";

export default function FloatingToyBrain() {
  return (
    <motion.div
      aria-hidden="true"
      className="relative mx-auto flex h-40 w-40 items-center justify-center rounded-[2rem] border border-white/70 bg-gradient-to-br from-white via-lavender/30 to-sky/40 shadow-lift preserve-3d sm:h-52 sm:w-52"
      animate={{ y: [0, -10, 0], rotateY: [0, 8, -8, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="absolute inset-4 rounded-[1.6rem] border border-white/70 bg-white/45" />
      <motion.div
        className="relative flex h-24 w-24 items-center justify-center rounded-[1.6rem] bg-coral/80 text-ink shadow-card sm:h-28 sm:w-28"
        animate={{ rotate: [0, 4, -4, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ transform: "translateZ(38px)" }}
      >
        <Brain size={58} strokeWidth={1.8} />
      </motion.div>
      <span className="absolute -right-5 top-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-butter text-xl shadow-card">
        123
      </span>
      <span className="absolute -bottom-4 left-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-mint text-xl shadow-card">
        ABC
      </span>
      <span className="absolute -left-5 top-10 flex h-11 w-11 items-center justify-center rounded-2xl bg-coral text-lg shadow-card">
        ?
      </span>
    </motion.div>
  );
}
