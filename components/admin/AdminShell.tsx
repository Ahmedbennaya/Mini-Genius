"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Bell,
  LogOut,
  Menu,
  Plus,
  Search,
  X,
} from "lucide-react";
import { ADMIN_NAV, ADMIN_SECONDARY_NAV } from "@/components/admin/admin-nav";
import { cn } from "@/lib/utils";

type AdminShellProps = {
  children: React.ReactNode;
  adminEmail: string;
};

export default function AdminShell({ children, adminEmail }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const currentPath = pathname ?? "";

  const adminName = useMemo(() => {
    const local = adminEmail.split("@")[0] || "admin";
    return local.charAt(0).toUpperCase() + local.slice(1);
  }, [adminEmail]);

  async function logout() {
    setLoadingLogout(true);
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffdfa] via-[#f8fafc] to-[#f6f7fb]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200/80 bg-white/95 p-4 shadow-xl backdrop-blur-xl transition-transform lg:static lg:translate-x-0 lg:shadow-none",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="mb-5 flex items-center justify-between">
            <Link href="/admin" className="rounded-xl px-2 py-1 text-lg font-bold tracking-tight text-slate-900">
              Mini Genius <span className="text-rose-500">Admin</span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
              aria-label="Fermer le menu"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="space-y-1">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const active = currentPath === item.href || currentPath.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    active
                      ? "bg-rose-50 text-rose-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Icon size={17} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 border-t border-slate-200 pt-4">
            {ADMIN_SECONDARY_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <Icon size={17} />
                  {item.label}
                </Link>
              );
            })}

            <button
              type="button"
              onClick={logout}
              disabled={loadingLogout}
              className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-60"
            >
              <LogOut size={17} />
              {loadingLogout ? "Deconnexion..." : "Deconnexion"}
            </button>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 px-4 py-3 backdrop-blur-xl sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 lg:hidden"
                aria-label="Ouvrir le menu"
              >
                <Menu size={18} />
              </button>

              <label className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="search"
                  placeholder="Rechercher produits, commandes, clients..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none ring-rose-200 transition placeholder:text-slate-400 focus:border-rose-300 focus:ring-4"
                />
              </label>

              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                aria-label="Notifications"
              >
                <Bell size={17} />
              </button>

              <Link
                href="/admin/products/new"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Ajouter produit</span>
              </Link>

              <div className="hidden rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 sm:block">
                {adminName}
              </div>
            </div>
          </header>

          <main id="main" className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>

      {open ? (
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/35 lg:hidden"
          aria-label="Fermer"
        />
      ) : null}
    </div>
  );
}
