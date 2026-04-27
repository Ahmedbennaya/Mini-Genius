"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "ul";
} & Pick<HTMLMotionProps<"div">, "id" | "style">;

export default function SectionReveal({
  children,
  delay = 0,
  className,
  as = "div",
  ...rest
}: Props) {
  const shouldReduceMotion = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      {...rest}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 0.61, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </Tag>
  );
}
