type AdminPageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
};

export default function AdminPageHeader({
  title,
  subtitle,
  actions,
}: AdminPageHeaderProps) {
  return (
    <header className="mb-6 flex flex-col gap-4 rounded-3xl border border-white/70 bg-white/70 p-4 shadow-soft backdrop-blur sm:flex-row sm:items-end sm:justify-between sm:p-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}
