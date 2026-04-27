"use client";

import { useMemo, useState } from "react";
import { Plus, TicketPercent, Trash2 } from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable, { AdminTableHead, AdminTd, AdminTh } from "@/components/admin/AdminTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";
import Toast from "@/components/admin/Toast";
import couponsData from "@/data/admin/coupons.json";
import type { Coupon } from "@/lib/admin/types";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(couponsData as Coupon[]);
  const [editing, setEditing] = useState<Coupon>({
    code: "",
    description: "",
    type: "percentage",
    value: 10,
    active: true,
    usageCount: 0,
    createdAt: new Date().toISOString(),
  });
  const [deleteCode, setDeleteCode] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...coupons].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [coupons]
  );

  async function saveCoupon() {
    const response = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });

    if (!response.ok) return;

    const result = (await response.json()) as { ok: boolean; data: Coupon };
    if (!result.ok) return;

    setCoupons((prev) => {
      const index = prev.findIndex((coupon) => coupon.code === result.data.code);
      if (index < 0) return [result.data, ...prev];
      const next = [...prev];
      next[index] = result.data;
      return next;
    });

    setEditing({
      code: "",
      description: "",
      type: "percentage",
      value: 10,
      active: true,
      usageCount: 0,
      createdAt: new Date().toISOString(),
    });
    setToast("Coupon sauvegarde.");
    setTimeout(() => setToast(null), 2200);
  }

  async function removeCoupon(code: string) {
    await fetch(`/api/admin/coupons/${code}`, { method: "DELETE" });
    setCoupons((prev) => prev.filter((coupon) => coupon.code !== code));
    setDeleteCode(null);
    setToast("Coupon supprime.");
    setTimeout(() => setToast(null), 2200);
  }

  return (
    <div>
      <AdminPageHeader title="Coupons" subtitle="Promotions, codes actifs et limites d'utilisation." />

      <section className="mb-5 grid gap-4 sm:grid-cols-3">
        <AdminCard title="Coupons" icon={<TicketPercent size={18} />}>
          <p className="text-3xl font-semibold text-slate-950">{coupons.length}</p>
        </AdminCard>
        <AdminCard title="Actifs" icon={<TicketPercent size={18} />}>
          <p className="text-3xl font-semibold text-slate-950">{coupons.filter((coupon) => coupon.active).length}</p>
        </AdminCard>
        <AdminCard title="Utilisations" icon={<TicketPercent size={18} />}>
          <p className="text-3xl font-semibold text-slate-950">{coupons.reduce((sum, coupon) => sum + coupon.usageCount, 0)}</p>
        </AdminCard>
      </section>

      <AdminCard className="mb-5" title="Ajouter / modifier un coupon">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input label="Code" value={editing.code} onChange={(value) => setEditing((s) => ({ ...s, code: value.toUpperCase() }))} />
          <Input label="Description" value={editing.description} onChange={(value) => setEditing((s) => ({ ...s, description: value }))} />
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.04em] text-slate-500">Type</span>
            <select
              value={editing.type}
              onChange={(e) => setEditing((s) => ({ ...s, type: e.target.value as Coupon["type"] }))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm"
            >
              <option value="percentage">Pourcentage</option>
              <option value="fixed">Montant fixe</option>
            </select>
          </label>
          <Input
            label="Valeur"
            value={String(editing.value)}
            type="number"
            onChange={(value) => setEditing((s) => ({ ...s, value: Number(value) }))}
          />
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={editing.active}
              onChange={(e) => setEditing((s) => ({ ...s, active: e.target.checked }))}
              className="h-4 w-4 rounded border-slate-300"
            />
            Actif
          </label>

          <button
            type="button"
            onClick={saveCoupon}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
          >
            <Plus size={16} />
            Sauvegarder
          </button>
        </div>
      </AdminCard>

      <AdminTable>
        <AdminTableHead>
          <AdminTh>Code</AdminTh>
          <AdminTh>Description</AdminTh>
          <AdminTh>Type</AdminTh>
          <AdminTh>Valeur</AdminTh>
          <AdminTh>Statut</AdminTh>
          <AdminTh>Usage</AdminTh>
          <AdminTh />
        </AdminTableHead>
        <tbody>
          {sorted.map((coupon) => (
            <tr key={coupon.code} className="border-b border-slate-100 last:border-none hover:bg-slate-50/60">
              <AdminTd className="font-bold text-slate-950">{coupon.code}</AdminTd>
              <AdminTd className="text-slate-600">{coupon.description}</AdminTd>
              <AdminTd className="text-slate-700">{coupon.type}</AdminTd>
              <AdminTd className="font-semibold text-slate-900">
                {coupon.type === "percentage" ? `${coupon.value}%` : `${coupon.value} TND`}
              </AdminTd>
              <AdminTd>
                <StatusBadge tone={coupon.active ? "success" : "neutral"}>
                  {coupon.active ? "Actif" : "Inactif"}
                </StatusBadge>
              </AdminTd>
              <AdminTd className="text-slate-700">{coupon.usageCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ""}</AdminTd>
              <AdminTd>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing(coupon)}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Editer
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteCode(coupon.code)}
                    className="inline-flex items-center gap-1 rounded-xl border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 size={13} />
                    Supprimer
                  </button>
                </div>
              </AdminTd>
            </tr>
          ))}
        </tbody>
      </AdminTable>

      <ConfirmDialog
        open={Boolean(deleteCode)}
        title="Supprimer coupon"
        message={`Voulez-vous supprimer ${deleteCode || "ce coupon"} ?`}
        danger
        onCancel={() => setDeleteCode(null)}
        onConfirm={() => deleteCode && removeCoupon(deleteCode)}
      />

      <Toast message={toast} />
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.04em] text-slate-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none ring-coral-deep/15 transition focus:border-coral-deep/60 focus:ring-4"
      />
    </label>
  );
}
