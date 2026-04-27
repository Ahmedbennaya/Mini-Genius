import { Mail, Phone, Users } from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable, { AdminTableHead, AdminTd, AdminTh } from "@/components/admin/AdminTable";
import EmptyState from "@/components/admin/EmptyState";
import { formatTND } from "@/lib/utils";
import { customersFromOrders, listOrders } from "@/lib/admin/storage";

export default async function CustomersPage() {
  const customers = customersFromOrders(await listOrders());
  const totalSpent = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);

  return (
    <div>
      <AdminPageHeader title="Clients" subtitle="Historique clients base sur les commandes." />

      <section className="mb-5 grid gap-4 sm:grid-cols-3">
        <AdminCard title="Clients" icon={<Users size={18} />}>
          <p className="text-3xl font-semibold text-slate-950">{customers.length}</p>
        </AdminCard>
        <AdminCard title="Depense totale" icon={<Users size={18} />}>
          <p className="text-3xl font-semibold text-slate-950">{formatTND(totalSpent)}</p>
        </AdminCard>
        <AdminCard title="Panier client moyen" icon={<Users size={18} />}>
          <p className="text-3xl font-semibold text-slate-950">
            {formatTND(customers.length ? Math.round(totalSpent / customers.length) : 0)}
          </p>
        </AdminCard>
      </section>

      {customers.length === 0 ? (
        <EmptyState title="Aucun client pour le moment" />
      ) : (
        <AdminTable>
          <AdminTableHead>
            <AdminTh>Client</AdminTh>
            <AdminTh>Ville</AdminTh>
            <AdminTh>Commandes</AdminTh>
            <AdminTh>Total depense</AdminTh>
            <AdminTh>Derniere commande</AdminTh>
            <AdminTh>Contact</AdminTh>
          </AdminTableHead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-slate-100 last:border-none hover:bg-slate-50/60">
                <AdminTd>
                  <p className="font-bold text-slate-950">{customer.fullName}</p>
                  <p className="text-xs text-slate-500">{customer.phone}</p>
                </AdminTd>
                <AdminTd className="font-semibold text-slate-700">{customer.city}</AdminTd>
                <AdminTd className="text-slate-700">{customer.ordersCount}</AdminTd>
                <AdminTd className="font-bold text-slate-950">{formatTND(customer.totalSpent)}</AdminTd>
                <AdminTd className="text-slate-700">{new Date(customer.lastOrderAt).toLocaleDateString("fr-TN")}</AdminTd>
                <AdminTd>
                  <div className="flex gap-2">
                    <a href={`tel:${customer.phone}`} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50" aria-label="Appeler">
                      <Phone size={15} />
                    </a>
                    {customer.email ? (
                      <a href={`mailto:${customer.email}`} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50" aria-label="Email">
                        <Mail size={15} />
                      </a>
                    ) : null}
                  </div>
                </AdminTd>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}
    </div>
  );
}
