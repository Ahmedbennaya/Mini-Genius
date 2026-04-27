"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionStyle } from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";

export default function Parallax({
  children,
  className,
  distance = 28,
  direction = "up",
  scale = false,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
  direction?: "up" | "down";
  scale?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const start = direction === "up" ? distance : -distance;
  const end = -start;
  const y = useTransform(scrollYProgress, [0, 1], [start, end]);
  const parallaxScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.985, 1, 0.99]);
  const style: MotionStyle = shouldReduceMotion
    ? {}
    : { y, scale: scale ? parallaxScale : undefined, willChange: "transform" };

  return (
    <motion.div ref={ref} style={style} className={className}>
      {children}
    </motion.div>
  );
}
