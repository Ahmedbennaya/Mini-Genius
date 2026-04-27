"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          aria-label="Retour en haut de la page"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.24 }}
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: shouldReduceMotion ? "auto" : "smooth",
            })
          }
          className="fixed bottom-24 right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white/78 text-ink shadow-lift backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-cream md:bottom-7 md:right-7"
        >
          <ArrowUp size={19} />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
