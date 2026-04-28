"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BackButton({
  label = "Back",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-cream-300 bg-white px-4 py-2 text-sm font-bold text-ink-soft shadow-soft transition hover:-translate-y-0.5 hover:text-ink hover:shadow-card",
        className,
      )}
    >
      <ArrowLeft size={16} />
      {label}
    </button>
  );
}
