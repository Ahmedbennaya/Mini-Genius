"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const response = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = (await response.json()) as { ok: boolean; message?: string };

    if (!response.ok || !result.ok) {
      setError(result.message || "Connexion impossible");
      setLoading(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffaf4] via-[#f8fafc] to-[#f5f7fb] px-4 py-12">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white/95 p-7 shadow-2xl backdrop-blur">
        <div className="mb-7 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-500">Mini Genius</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Admin Login</h1>
          <p className="mt-2 text-sm text-slate-500">Connectez-vous pour gerer la boutique.</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Email admin</span>
            <span className="relative block">
              <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none ring-rose-200 transition focus:border-rose-300 focus:ring-4"
                placeholder="admin@minigenius.tn"
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Mot de passe</span>
            <span className="relative block">
              <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none ring-rose-200 transition focus:border-rose-300 focus:ring-4"
                placeholder="********"
              />
            </span>
          </label>

          {error ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
