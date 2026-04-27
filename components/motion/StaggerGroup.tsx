"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { reducedFade, revealViewport, staggerContainer, staggerItem } from "@/lib/motion";

type MotionAs = "div" | "section" | "article" | "ul" | "li";

const tags = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  ul: motion.ul,
  li: motion.li,
};

export default function StaggerGroup({
  as = "div",
  children,
  className,
  once = false,
  amount = "some",
  id,
  style,
}: {
  as?: MotionAs;
  children: ReactNode;
  className?: string;
  once?: boolean;
  amount?: number | "some" | "all";
  id?: string;
  style?: CSSProperties;
}) {
  const shouldReduceMotion = useReducedMotion();
  const Tag = tags[as];

  return (
    <Tag
      id={id}
      style={style}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ ...revealViewport, once, amount }}
      variants={shouldReduceMotion ? reducedFade : staggerContainer}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({
  as = "div",
  children,
  className,
  style,
}: {
  as?: MotionAs;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const shouldReduceMotion = useReducedMotion();
  const Tag = tags[as];

  return (
    <Tag className={className} style={style} variants={shouldReduceMotion ? reducedFade : staggerItem}>
      {children}
    </Tag>
  );
}
