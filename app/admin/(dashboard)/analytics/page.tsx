import { BarChart3, Package, ShoppingCart, WalletCards } from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { CATEGORIES } from "@/data/site";
import { formatTND } from "@/lib/utils";
import { listOrders, listProducts } from "@/lib/admin/storage";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const [orders, products] = await Promise.all([listOrders(), listProducts()]);
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const soldProducts = orders.reduce((sum, order) => sum + order.items.reduce((a, item) => a + item.qty, 0), 0);

  const salesByCategory = CATEGORIES.map((category) => {
    const value = products
      .filter((product) => product.category === category.id)
      .reduce((sum, product) => {
        const soldQty = orders
          .flatMap((order) => order.items)
          .filter((item) => item.id === product.id)
          .reduce((itemSum, item) => itemSum + item.qty, 0);
        return sum + soldQty;
      }, 0);
    return { ...category, value };
  });

  const maxValue = Math.max(1, ...salesByCategory.map((category) => category.value));
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8)
    .reverse();

  return (
    <div>
      <AdminPageHeader title="Analytics" subtitle="Performance commerciale et categories." />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat title="CA total" value={formatTND(revenue)} icon={<WalletCards size={18} />} />
        <Stat title="Commandes" value={String(orders.length)} icon={<ShoppingCart size={18} />} />
        <Stat title="Produits vendus" value={String(soldProducts)} icon={<Package size={18} />} />
      </div>

      <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.8fr)]">
        <AdminCard title="Revenus recents" description="Dernieres commandes visualisees simplement." icon={<BarChart3 size={18} />}>
          <div className="flex h-72 items-end gap-3 rounded-3xl bg-gradient-to-b from-cream-100 to-white p-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.reference} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-2xl bg-gradient-to-t from-coral-deep to-butter-deep shadow-soft"
                    style={{ height: `${Math.max(18, (order.total / Math.max(1, revenue)) * 240)}px` }}
                  />
                  <span className="text-[11px] font-semibold text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString("fr-TN", { day: "2-digit", month: "2-digit" })}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
                Aucune donnee disponible.
              </div>
            )}
          </div>
        </AdminCard>

        <AdminCard title="Ventes par categorie" icon={<BarChart3 size={18} />}>
          <div className="space-y-4">
            {salesByCategory.map((category) => (
              <div key={category.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-semibold text-slate-700">{category.name}</span>
                  <span className="text-slate-500">{category.value}</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-mint-deep via-sky-deep to-coral-deep"
                    style={{ width: `${Math.max(6, (category.value / maxValue) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </section>
    </div>
  );
}

function Stat({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <AdminCard title={title} icon={icon}>
      <p className="text-3xl font-semibold text-slate-950">{value}</p>
    </AdminCard>
  );
}
