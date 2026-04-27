"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastProps = {
  message: string | null;
  tone?: "success" | "error";
};

export default function Toast({ message, tone = "success" }: ToastProps) {
  if (!message) return null;

  return (
    <div
      role="status"
      className={cn(
        "fixed bottom-5 right-5 z-[90] inline-flex max-w-sm items-center gap-2 rounded-2xl border bg-white px-4 py-3 text-sm font-semibold shadow-lift",
        tone === "success" && "border-emerald-200 text-emerald-700",
        tone === "error" && "border-rose-200 text-rose-700"
      )}
    >
      {tone === "success" ? <CheckCircle2 size={17} /> : <XCircle size={17} />}
      {message}
    </div>
  );
}
