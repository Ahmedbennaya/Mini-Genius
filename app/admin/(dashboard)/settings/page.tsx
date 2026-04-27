"use client";

import { useState } from "react";
import { Mail, MessageCircle, Save, Settings, Share2, Store, Truck } from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Toast from "@/components/admin/Toast";
import settingsData from "@/data/admin/settings.json";
import type { AdminSettings } from "@/lib/admin/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<AdminSettings>({
    deliveryText: "Livraison partout en Tunisie sous 24-72h.",
    paymentText: "Paiement a la livraison disponible.",
    instagramUrl: "",
    facebookUrl: "",
    tiktokUrl: "",
    ...(settingsData as AdminSettings),
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [toastTone, setToastTone] = useState<"success" | "error">("success");

  async function save() {
    setSaving(true);

    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    setSaving(false);
    if (!response.ok) {
      setToastTone("error");
      setToast("Sauvegarde impossible.");
      setTimeout(() => setToast(null), 2200);
      return;
    }

    setToastTone("success");
    setToast("Parametres sauvegardes.");
    setTimeout(() => setToast(null), 2200);
  }

  return (
    <div>
      <AdminPageHeader
        title="Parametres"
        subtitle="Coordonnees boutique, livraison, paiement et reseaux."
        actions={
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-slate-800 disabled:opacity-60"
          >
            <Save size={16} />
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </button>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <AdminCard title="Boutique" description="Identite et contacts principaux." icon={<Store size={18} />}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nom boutique" value={settings.storeName} onChange={(value) => setSettings((s) => ({ ...s, storeName: value }))} />
              <Field label="Email support" value={settings.supportEmail} onChange={(value) => setSettings((s) => ({ ...s, supportEmail: value }))} icon={<Mail size={15} />} />
              <Field label="Telephone support" value={settings.supportPhone} onChange={(value) => setSettings((s) => ({ ...s, supportPhone: value }))} />
              <Field label="WhatsApp" value={settings.whatsappNumber} onChange={(value) => setSettings((s) => ({ ...s, whatsappNumber: value }))} icon={<MessageCircle size={15} />} />
            </div>
          </AdminCard>

          <AdminCard title="Livraison et paiement" icon={<Truck size={18} />}>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Livraison standard" type="number" value={String(settings.shippingStandardFee)} onChange={(value) => setSettings((s) => ({ ...s, shippingStandardFee: Number(value) }))} />
              <Field label="Livraison express" type="number" value={String(settings.shippingExpressFee)} onChange={(value) => setSettings((s) => ({ ...s, shippingExpressFee: Number(value) }))} />
              <Field label="Seuil livraison gratuite" type="number" value={String(settings.freeShippingThreshold || 0)} onChange={(value) => setSettings((s) => ({ ...s, freeShippingThreshold: Number(value) || undefined }))} />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <TextArea label="Texte livraison" value={settings.deliveryText || ""} onChange={(value) => setSettings((s) => ({ ...s, deliveryText: value }))} />
              <TextArea label="Texte paiement" value={settings.paymentText || ""} onChange={(value) => setSettings((s) => ({ ...s, paymentText: value }))} />
            </div>
          </AdminCard>

          <AdminCard title="Liens sociaux" icon={<Share2 size={18} />}>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Instagram" value={settings.instagramUrl || ""} onChange={(value) => setSettings((s) => ({ ...s, instagramUrl: value }))} />
              <Field label="Facebook" value={settings.facebookUrl || ""} onChange={(value) => setSettings((s) => ({ ...s, facebookUrl: value }))} />
              <Field label="TikTok" value={settings.tiktokUrl || ""} onChange={(value) => setSettings((s) => ({ ...s, tiktokUrl: value }))} />
            </div>
          </AdminCard>
        </div>

        <aside className="space-y-5">
          <AdminCard title="Etat boutique" icon={<Settings size={18} />}>
            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings((s) => ({ ...s, maintenanceMode: e.target.checked }))}
                className="mt-0.5 h-4 w-4 rounded border-slate-300"
              />
              <span>
                <span className="block font-bold text-slate-950">Mode maintenance</span>
                <span className="mt-1 block text-slate-500">A utiliser pendant une mise a jour majeure.</span>
              </span>
            </label>
          </AdminCard>

          <AdminCard title="Apercu contact">
            <div className="space-y-3 rounded-3xl bg-cream-100 p-4 text-sm">
              <p className="font-bold text-slate-950">{settings.storeName}</p>
              <p className="text-slate-600">{settings.supportEmail}</p>
              <p className="text-slate-600">{settings.supportPhone}</p>
              <p className="rounded-2xl bg-white p-3 text-slate-600 shadow-soft">{settings.deliveryText}</p>
              <p className="rounded-2xl bg-white p-3 text-slate-600 shadow-soft">{settings.paymentText}</p>
            </div>
          </AdminCard>
        </aside>
      </div>

      <Toast message={toast} tone={toastTone} />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  icon?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.04em] text-slate-500">{label}</span>
      <div className="relative">
        {icon ? <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span> : null}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none ring-coral-deep/15 transition focus:border-coral-deep/60 focus:ring-4 ${
            icon ? "pl-9" : ""
          }`}
        />
      </div>
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.04em] text-slate-500">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none ring-coral-deep/15 transition focus:border-coral-deep/60 focus:ring-4"
      />
    </label>
  );
}
