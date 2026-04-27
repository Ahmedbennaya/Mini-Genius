"use client";

import type { ReactNode } from "react";
import Reveal from "./Reveal";

export default function FadeInView({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "header" | "footer" | "nav" | "aside" | "ul" | "li";
}) {
  return (
    <Reveal as={as} variant="fadeIn" className={className}>
      {children}
    </Reveal>
  );
}
