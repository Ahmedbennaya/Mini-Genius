import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoadingState({
  label = "Chargement...",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-white p-8 text-sm font-semibold text-slate-500 shadow-soft",
        className
      )}
    >
      <Loader2 className="animate-spin" size={17} />
      {label}
    </div>
  );
}
