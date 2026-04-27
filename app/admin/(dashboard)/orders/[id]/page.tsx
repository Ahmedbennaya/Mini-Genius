"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, MessageCircle, PackageCheck, Phone, Printer, Save } from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable, { AdminTableHead, AdminTd, AdminTh } from "@/components/admin/AdminTable";
import StatusBadge from "@/components/admin/StatusBadge";
import Toast from "@/components/admin/Toast";
import ordersData from "@/data/admin/orders.json";
import { formatTND } from "@/lib/utils";
import type { AdminOrder, AdminOrderStatus } from "@/lib/admin/types";

const ORDER_LIST = ordersData as AdminOrder[];

const STATUS_OPTIONS: AdminOrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const order = useMemo(() => ORDER_LIST.find((item) => item.reference === params.id), [params.id]);
  const [status, setStatus] = useState<AdminOrderStatus>((order?.status as AdminOrderStatus) || "pending");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  if (!order) {
    return (
      <AdminCard>
        <p className="text-sm font-semibold text-slate-500">Commande introuvable.</p>
      </AdminCard>
    );
  }

  const currentOrder = order;

  async function saveStatus() {
    setSaving(true);
    await fetch(`/api/admin/orders/${currentOrder.reference}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setSaving(false);
    setToast("Statut mis a jour.");
    setTimeout(() => setToast(null), 1800);
    router.refresh();
  }

  const whatsappUrl = `https://wa.me/${currentOrder.customer.phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
    `Bonjour ${currentOrder.customer.fullName}, votre commande ${currentOrder.reference} Mini Genius est en cours de suivi.`
  )}`;

  return (
    <div>
      <AdminPageHeader
        title={`Commande ${currentOrder.reference}`}
        subtitle={`Creee le ${new Date(currentOrder.createdAt).toLocaleDateString("fr-TN")}`}
        actions={
          <>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-soft transition hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Retour
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-soft transition hover:bg-slate-50 sm:inline-flex"
            >
              <Printer size={16} />
              Imprimer
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-emerald-700"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </>
        }
      />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.9fr)]">
        <div className="space-y-5">
          <AdminCard title="Produits commandes" icon={<PackageCheck size={18} />}>
            <AdminTable className="rounded-2xl shadow-none">
              <AdminTableHead>
                <AdminTh>Produit</AdminTh>
                <AdminTh>Quantite</AdminTh>
                <AdminTh>Prix</AdminTh>
                <AdminTh>Total</AdminTh>
              </AdminTableHead>
              <tbody>
                {currentOrder.items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 last:border-none">
                    <AdminTd>
                      <p className="font-bold text-slate-950">{item.name}</p>
                      <Link href={`/produit/${item.slug}`} className="text-xs font-semibold text-coral-deep">
                        Voir sur le site
                      </Link>
                    </AdminTd>
                    <AdminTd className="font-semibold text-slate-700">{item.qty}</AdminTd>
                    <AdminTd className="text-slate-700">{formatTND(item.price)}</AdminTd>
                    <AdminTd className="font-bold text-slate-950">{formatTND(item.price * item.qty)}</AdminTd>
                  </tr>
                ))}
              </tbody>
            </AdminTable>

            <dl className="mt-5 space-y-2 rounded-2xl bg-slate-50 p-4 text-sm">
              <div className="flex justify-between"><dt className="text-slate-500">Sous-total</dt><dd className="font-semibold">{formatTND(currentOrder.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Livraison</dt><dd className="font-semibold">{formatTND(currentOrder.deliveryFee)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Reduction</dt><dd className="font-semibold">{formatTND(currentOrder.discount || 0)}</dd></div>
              <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-950"><dt>Total</dt><dd>{formatTND(currentOrder.total)}</dd></div>
            </dl>
          </AdminCard>

          <AdminCard title="Timeline" description="Vue simple du cycle de traitement.">
            <ol className="space-y-3">
              {STATUS_OPTIONS.filter((item) => item !== "cancelled").map((item, index) => {
                const currentIndex = STATUS_OPTIONS.indexOf(status);
                const done = currentIndex >= index && status !== "cancelled";
                return (
                  <li key={item} className="flex items-center gap-3">
                    <span className={`h-3 w-3 rounded-full ${done ? "bg-coral-deep" : "bg-slate-200"}`} />
                    <span className={`text-sm font-semibold capitalize ${done ? "text-slate-900" : "text-slate-400"}`}>
                      {item}
                    </span>
                  </li>
                );
              })}
            </ol>
          </AdminCard>
        </div>

        <aside className="space-y-5">
          <AdminCard title="Client" icon={<Phone size={18} />}>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">Nom</dt>
                <dd className="font-bold text-slate-950">{currentOrder.customer.fullName}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Telephone</dt>
                <dd className="flex items-center gap-2 font-semibold text-slate-800">
                  {currentOrder.customer.phone}
                  <a href={`tel:${currentOrder.customer.phone}`} className="text-coral-deep">
                    <Phone size={14} />
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Email</dt>
                <dd className="font-semibold text-slate-800">{currentOrder.customer.email || "-"}</dd>
              </div>
            </dl>
          </AdminCard>

          <AdminCard title="Adresse livraison" icon={<MapPin size={18} />}>
            <p className="text-sm font-semibold leading-relaxed text-slate-800">
              {currentOrder.customer.address}
              <br />
              {currentOrder.customer.city}
            </p>
            {currentOrder.customer.notes ? (
              <div className="mt-4 rounded-2xl bg-amber-50 p-3 text-sm font-semibold text-amber-800">
                {currentOrder.customer.notes}
              </div>
            ) : null}
          </AdminCard>

          <AdminCard title="Statut commande">
            <div className="mb-3">
              <OrderStatus status={status} />
            </div>
            <div className="flex gap-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AdminOrderStatus)}
                className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700 outline-none"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={saveStatus}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                <Save size={15} />
                {saving ? "..." : "Sauver"}
              </button>
            </div>
          </AdminCard>
        </aside>
      </section>

      <Toast message={toast} />
    </div>
  );
}

function OrderStatus({ status }: { status: AdminOrderStatus }) {
  if (status === "delivered") return <StatusBadge tone="success">Livree</StatusBadge>;
  if (status === "cancelled") return <StatusBadge tone="danger">Annulee</StatusBadge>;
  if (status === "pending") return <StatusBadge tone="warning">En attente</StatusBadge>;
  if (status === "shipped") return <StatusBadge tone="info">Expediee</StatusBadge>;
  if (status === "confirmed") return <StatusBadge tone="info">Confirmee</StatusBadge>;
  return <StatusBadge>{status}</StatusBadge>;
}
