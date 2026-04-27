import { PackageOpen } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
};

export default function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center shadow-soft",
        className
      )}
    >
      <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-cream-200 text-slate-500">
        {icon || <PackageOpen size={22} />}
      </span>
      <h3 className="mt-4 text-lg font-semibold text-slate-950">{title}</h3>
      {description ? <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-500">{description}</p> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
