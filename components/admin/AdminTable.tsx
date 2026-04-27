import { cn } from "@/lib/utils";

type AdminTableProps = {
  children: React.ReactNode;
  className?: string;
};

export default function AdminTable({ children, className }: AdminTableProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_10px_30px_rgba(31,36,51,.06)]",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">{children}</table>
      </div>
    </div>
  );
}

export function AdminTableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-slate-100 bg-slate-50/90 text-left text-xs font-bold uppercase tracking-[0.04em] text-slate-500">
        {children}
      </tr>
    </thead>
  );
}

export function AdminTh({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <th className={cn("px-4 py-3.5", className)}>{children}</th>;
}

export function AdminTd({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn("px-4 py-4 align-middle", className)}>{children}</td>;
}
