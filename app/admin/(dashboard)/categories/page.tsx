import Link from "next/link";
import { ArrowUpRight, Tags } from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EmptyState from "@/components/admin/EmptyState";
import { CATEGORIES } from "@/data/site";
import { listProducts } from "@/lib/admin/storage";

export default async function CategoriesPage() {
  const products = await listProducts();

  const list = CATEGORIES.map((category) => {
    const items = products.filter((product) => product.category === category.id);
    return {
      ...category,
      count: items.length,
      inStock: items.filter((product) => product.inStock).length,
      promo: items.filter((product) => product.oldPrice).length,
    };
  }).filter((category) => category.count > 0);

  const max = Math.max(1, ...list.map((item) => item.count));

  return (
    <div>
      <AdminPageHeader title="Categories" subtitle="Repartition du catalogue et priorites merchandising." />

      {list.length === 0 ? (
        <EmptyState title="Aucune categorie disponible" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((item) => (
            <AdminCard
              key={item.id}
              title={item.name}
              description={`${item.count} produit(s), ${item.inStock} en stock`}
              icon={<Tags size={18} />}
              actions={
                <Link
                  href={`/admin/products?cat=${item.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-coral-deep"
                >
                  Produits
                  <ArrowUpRight size={13} />
                </Link>
              }
            >
              <div className="space-y-3">
                <div className="h-3 rounded-full bg-slate-100">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-mint-deep via-sky-deep to-coral-deep"
                    style={{ width: `${Math.max(8, (item.count / max) * 100)}%` }}
                  />
                </div>
                <dl className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <dt className="text-xs font-bold uppercase text-slate-400">Total</dt>
                    <dd className="mt-1 font-semibold text-slate-950">{item.count}</dd>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-3">
                    <dt className="text-xs font-bold uppercase text-emerald-600">Stock</dt>
                    <dd className="mt-1 font-semibold text-emerald-800">{item.inStock}</dd>
                  </div>
                  <div className="rounded-2xl bg-amber-50 p-3">
                    <dt className="text-xs font-bold uppercase text-amber-600">Promo</dt>
                    <dd className="mt-1 font-semibold text-amber-800">{item.promo}</dd>
                  </div>
                </dl>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
