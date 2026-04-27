"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarDays, Eye, Phone, Search, Send, ShoppingCart } from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable, { AdminTableHead, AdminTd, AdminTh } from "@/components/admin/AdminTable";
import EmptyState from "@/components/admin/EmptyState";
import FilterSelect from "@/components/admin/FilterSelect";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import SearchInput from "@/components/admin/SearchInput";
import { ORDER_STATUSES, orderStatusLabel } from "@/lib/orders";
import { formatTND } from "@/lib/utils";
import type { AdminOrder } from "@/lib/admin/types";

const STATUS_OPTIONS = [
  { label: "Tous", value: "all" },
  ...ORDER_STATUSES.map((status) => ({ label: orderStatusLabel(status), value: status })),
];

export default function AdminOrdersClient({ initialOrders }: { initialOrders: AdminOrder[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [date, setDate] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const now = Date.now();

    return [...initialOrders]
      .filter((order) => {
        const matchesQuery =
          !q ||
          order.reference.toLowerCase().includes(q) ||
          order.customerName.toLowerCase().includes(q) ||
          order.phone.toLowerCase().includes(q) ||
          order.city.toLowerCase().includes(q);
        const matchesStatus = status === "all" || order.status === status;
        const created = new Date(order.createdAt).getTime();
        const matchesDate =
          date === "all" ||
          (date === "today" && new Date(order.createdAt).toDateString() === new Date().toDateString()) ||
          (date === "7d" && now - created <= 7 * 24 * 60 * 60 * 1000) ||
          (date === "30d" && now - created <= 30 * 24 * 60 * 60 * 1000);
        return matchesQuery && matchesStatus && matchesDate;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [initialOrders, query, status, date]);

  const total = filtered.reduce((sum, order) => sum + order.total, 0);
  const newOrders = filtered.filter((order) => order.status === "new").length;

  return (
    <div>
      <AdminPageHeader title="Commandes" subtitle="Recherche, statuts et actions client rapides." />

      <section className="mb-5 grid gap-4 md:grid-cols-3">
        <AdminCard title="Commandes filtrees" icon={<ShoppingCart size={18} />}>
          <p className="text-3xl font-semibold text-slate-950">{filtered.length}</p>
        </AdminCard>
        <AdminCard title="Total filtre" icon={<Search size={18} />}>
          <p className="text-3xl font-semibold text-slate-950">{formatTND(total)}</p>
        </AdminCard>
        <AdminCard title="A traiter" icon={<CalendarDays size={18} />}>
          <p className="text-3xl font-semibold text-slate-950">{newOrders}</p>
        </AdminCard>
      </section>

      <AdminCard className="mb-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(260px,1fr)_190px_190px]">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Reference, nom, telephone, ville..."
          />
          <FilterSelect label="Statut" value={status} onChange={setStatus} options={STATUS_OPTIONS} />
          <FilterSelect
            label="Date"
            value={date}
            onChange={setDate}
            options={[
              { label: "Toutes", value: "all" },
              { label: "Aujourd'hui", value: "today" },
              { label: "7 jours", value: "7d" },
              { label: "30 jours", value: "30d" },
            ]}
          />
        </div>
      </AdminCard>

      {filtered.length === 0 ? (
        <EmptyState title="Aucune commande" description="Aucune commande ne correspond a vos filtres." />
      ) : (
        <AdminTable>
          <AdminTableHead>
            <AdminTh>Reference</AdminTh>
            <AdminTh>Client</AdminTh>
            <AdminTh>Ville</AdminTh>
            <AdminTh>Statut</AdminTh>
            <AdminTh>Total</AdminTh>
            <AdminTh>Contact</AdminTh>
            <AdminTh className="text-right">Detail</AdminTh>
          </AdminTableHead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-slate-100 last:border-none hover:bg-slate-50/60">
                <AdminTd>
                  <p className="font-bold text-slate-950">{order.reference}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString("fr-TN")}
                  </p>
                </AdminTd>
                <AdminTd>
                  <p className="font-semibold text-slate-800">{order.customerName}</p>
                  <p className="text-xs text-slate-500">{order.phone}</p>
                </AdminTd>
                <AdminTd className="text-slate-700">{order.city}</AdminTd>
                <AdminTd>
                  <OrderStatusBadge status={order.status} />
                </AdminTd>
                <AdminTd className="font-bold text-slate-900">{formatTND(order.total)}</AdminTd>
                <AdminTd>
                  <div className="flex gap-2">
                    <a
                      href={`tel:${order.phone}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                      aria-label="Appeler"
                    >
                      <Phone size={15} />
                    </a>
                    <a
                      href={`https://wa.me/${order.phone.replace(/[^\d]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200 text-emerald-600 transition hover:bg-emerald-50"
                      aria-label="WhatsApp"
                    >
                      <Send size={15} />
                    </a>
                  </div>
                </AdminTd>
                <AdminTd className="text-right">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
                  >
                    <Eye size={14} />
                    Voir
                  </Link>
                </AdminTd>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}
    </div>
  );
}
