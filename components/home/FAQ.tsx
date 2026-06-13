"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, MessageCircle } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { whatsappOrderLink } from "@/lib/utils";
import { HOME_FAQS, type FaqItem } from "@/data/faq";

type QA = FaqItem;

const FAQS = HOME_FAQS;

export default function FAQ() {
  return (
    <section id="faq" className="relative overflow-hidden bg-cream-200/70 py-14 sm:py-20 lg:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(31,36,51,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(31,36,51,.07)_1px,transparent_1px)] [background-size:52px_52px]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(245,215,122,.14),transparent_34%,rgba(194,172,230,.14)_70%,transparent)]" />
      </div>

      <div className="container-mg grid gap-12 lg:grid-cols-[0.9fr_1.2fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <SectionHeading
            eyebrow="Questions fréquentes"
            title="Tout ce que les parents nous demandent"
            description="Une réponse claire à chaque question. Si vous ne trouvez pas, notre équipe est à un message WhatsApp."
          />
          <Link
            href={whatsappOrderLink()}
            target="_blank"
            rel="noopener"
            className="btn-whatsapp btn-lg mt-8 inline-flex"
          >
            <MessageCircle size={18} />
            Poser une question
          </Link>
        </div>

        <ul className="space-y-3">
          {FAQS.map((item, i) => (
            <FAQItem key={item.q} item={item} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function FAQItem({ item, index }: { item: QA; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      className="overflow-hidden rounded-3xl border border-cream-300 bg-white shadow-soft transition-shadow duration-300 hover:shadow-card"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-display text-[17px] font-semibold leading-snug text-ink sm:text-[18px]">
          {item.q}
        </span>
        <span
          className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cream-300 bg-cream-100 text-ink transition-transform duration-300 ${
            open ? "rotate-180 bg-coral-deep text-white border-transparent" : ""
          }`}
        >
          <ChevronDown size={16} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="content"
            initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-[15.5px] leading-relaxed text-ink-soft">
              {item.a}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.li>
  );
}
