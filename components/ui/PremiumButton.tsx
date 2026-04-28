import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PremiumButtonProps = ComponentPropsWithoutRef<typeof Link> & {
  tone?: "dark" | "coral" | "light";
};

export default function PremiumButton({
  className,
  children,
  tone = "dark",
  ...props
}: PremiumButtonProps) {
  const tones = {
    dark: "bg-ink text-white shadow-[0_16px_34px_rgba(31,36,51,.18)] hover:bg-[#2b3144]",
    coral: "bg-coral-deep text-white shadow-[0_16px_34px_rgba(224,127,98,.25)] hover:bg-[#d86f55]",
    light: "border border-cream-300 bg-white text-ink shadow-soft hover:shadow-card",
  };

  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2",
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
      <ArrowRight size={16} />
    </Link>
  );
}
