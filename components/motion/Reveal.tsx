"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { fadeIn, fadeUp, reducedFade, revealViewport, scaleIn, slideInSoft } from "@/lib/motion";

type RevealAs = "div" | "section" | "article" | "header" | "footer" | "nav" | "aside" | "ul" | "li";
type RevealVariant = "fadeUp" | "fadeIn" | "scaleIn" | "slideInSoft";

const tags = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  header: motion.header,
  footer: motion.footer,
  nav: motion.nav,
  aside: motion.aside,
  ul: motion.ul,
  li: motion.li,
};

const variants = {
  fadeUp,
  fadeIn,
  scaleIn,
  slideInSoft,
};

export default function Reveal({
  as = "div",
  variant = "fadeUp",
  children,
  className,
  delay = 0,
  once = false,
  amount = "some",
  id,
  style,
  ariaLabel,
}: {
  as?: RevealAs;
  variant?: RevealVariant;
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
  amount?: number | "some" | "all";
  id?: string;
  style?: CSSProperties;
  ariaLabel?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const Tag = tags[as];
  const selected = shouldReduceMotion ? reducedFade : variants[variant];

  return (
    <Tag
      id={id}
      aria-label={ariaLabel}
      style={style}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ ...revealViewport, once, amount }}
      variants={selected}
      transition={{ delay }}
    >
      {children}
    </Tag>
  );
}
