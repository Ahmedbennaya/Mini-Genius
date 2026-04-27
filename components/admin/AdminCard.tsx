import { cn } from "@/lib/utils";

type AdminCardProps = {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

export default function AdminCard({
  title,
  description,
  icon,
  actions,
  children,
  className,
}: AdminCardProps) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(31,36,51,.06)]",
        className
      )}
    >
      {(title || description || icon || actions) && (
        <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            {icon ? (
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cream-200 text-slate-800">
                {icon}
              </span>
            ) : null}
            <div>
              {title ? <h2 className="text-base font-semibold text-slate-950">{title}</h2> : null}
              {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
            </div>
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </header>
      )}
      {children}
    </section>
  );
}
