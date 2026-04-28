import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  Boxes,
  FileJson,
  Gamepad2,
  Languages,
  Package,
  Plus,
  ShoppingCart,
  Sparkles,
  Truck,
  WalletCards,
} from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminGameTable from "@/components/admin/AdminGameTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminQuestionTable from "@/components/admin/AdminQuestionTable";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTable, { AdminTableHead, AdminTd, AdminTh } from "@/components/admin/AdminTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { CATEGORY_IDS, DIFFICULTIES } from "@/data/iq/constants";
import { GAMES } from "@/data/iq/games";
import { TEST_QUESTIONS } from "@/data/iq/testQuestions";
import { CATEGORIES } from "@/data/site";
import { formatTND } from "@/lib/utils";
import { customersFromOrders, listCoupons, listOrders, listProducts } from "@/lib/admin/storage";
import { orderStatusLabel } from "@/lib/orders";
import type { AdminOrderStatus } from "@/lib/admin/types";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [products, orders, coupons] = await Promise.all([
    listProducts(),
    listOrders(),
    listCoupons(),
  ]);

  const customers = customersFromOrders(orders);
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const newOrders = orders.filter((order) => order.status === "new").length;
  const outOfStock = products.filter((product) => !product.inStock).length;
  const activeCoupons = coupons.filter((coupon) => coupon.active).length;
  const averageOrder = orders.length ? Math.round(revenue / orders.length) : 0;

  const categoryStats = CATEGORIES.map((category) => {
    const count = products.filter((product) => product.category === category.id).length;
    return { ...category, count };
  }).sort((a, b) => b.count - a.count);

  const statusStats = getStatusStats(orders.map((order) => order.status));
  const maxCategory = Math.max(1, ...categoryStats.map((category) => category.count));
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div>
      <AdminPageHeader
        title="Bonjour, Mini Genius"
        subtitle="Pilotage boutique, commandes et catalogue en un coup d'oeil."
        actions={
          <>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-slate-800"
            >
              <Plus size={16} />
              Nouveau produit
            </Link>
            <Link
              href="/admin/analytics"
              className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-soft transition hover:bg-slate-50 sm:inline-flex"
            >
              Analytics
              <ArrowUpRight size={15} />
            </Link>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Revenus" value={formatTND(revenue)} icon={<WalletCards size={18} />} hint={`Panier moyen ${formatTND(averageOrder)}`} tone="rose" />
        <StatCard title="Commandes" value={String(orders.length)} icon={<ShoppingCart size={18} />} hint={`${newOrders} nouvelles`} tone="blue" />
        <StatCard title="Nouvelles" value={String(newOrders)} icon={<Truck size={18} />} hint="A traiter rapidement" tone="amber" />
        <StatCard title="Produits" value={String(products.length)} icon={<Package size={18} />} hint={`${outOfStock} rupture`} tone="emerald" />
        <StatCard title="Coupons" value={String(activeCoupons)} icon={<Sparkles size={18} />} hint={`${customers.length} clients`} tone="lavender" />
      </section>

      <section id="iq-overview" className="mt-6 grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
        <AdminSidebar />
        <div className="space-y-5">
          <AdminCard
            title="Mini Genius IQ Room"
            description="Mock CMS for games, skill tests, categories, translations and progress data."
            icon={<BrainCircuit size={18} />}
            actions={
              <Link
                href="/fr"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-soft transition hover:bg-slate-50"
              >
                Open IQ Room
                <ArrowUpRight size={15} />
              </Link>
            }
          >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard title="IQ games" value={String(GAMES.length)} icon={<Gamepad2 size={18} />} hint="Local data ready" tone="blue" />
              <StatCard title="Questions" value={String(TEST_QUESTIONS.length)} icon={<BrainCircuit size={18} />} hint="Child-friendly" tone="rose" />
              <StatCard title="Categories" value={String(CATEGORY_IDS.length)} icon={<Boxes size={18} />} hint="10 skill areas" tone="emerald" />
              <StatCard title="Languages" value="3" icon={<Languages size={18} />} hint="FR / AR / EN" tone="lavender" />
            </div>
          </AdminCard>

          <section id="iq-games">
            <AdminCard
              title="Manage IQ games"
              description="Preview table for add/edit/delete flows. Replace local data with database mutations later."
              icon={<Gamepad2 size={18} />}
              actions={
                <div className="flex flex-wrap gap-2">
                  <button className="rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-soft">Add game</button>
                  <a
                    href="data:application/json;charset=utf-8,%5B%5D"
                    download="mini-genius-games-export.json"
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-soft"
                  >
                    <FileJson size={15} />
                    Export JSON
                  </a>
                </div>
              }
            >
              <AdminGameTable games={GAMES} />
            </AdminCard>
          </section>

          <section id="iq-questions">
            <AdminCard
              title="Manage IQ questions"
              description="Questions are grouped by age, category, difficulty and points."
              icon={<BrainCircuit size={18} />}
              actions={
                <button className="rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-soft">
                  Add question
                </button>
              }
            >
              <AdminQuestionTable questions={TEST_QUESTIONS} />
            </AdminCard>
          </section>

          <section id="iq-translations" className="grid gap-5 lg:grid-cols-2">
            <AdminCard title="Translations" description="French, Arabic RTL and English dictionaries." icon={<Languages size={18} />}>
              <div className="grid gap-3 sm:grid-cols-3">
                {["fr", "ar", "en"].map((locale) => (
                  <div key={locale} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-2xl font-semibold uppercase text-slate-950">{locale}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">Navigation, games, test, admin UI</p>
                  </div>
                ))}
              </div>
            </AdminCard>
            <AdminCard title="Difficulty" description="Editable scale for child-friendly challenge levels." icon={<BarChart3 size={18} />}>
              <div id="iq-difficulty" className="grid gap-3">
                {DIFFICULTIES.map((difficulty, index) => (
                  <div key={difficulty} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
                    <span className="font-bold capitalize text-slate-800">{difficulty}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">Level {index + 1}</span>
                  </div>
                ))}
              </div>
            </AdminCard>
          </section>
        </div>
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
        <AdminCard
          title="Dernieres commandes"
          description="Suivi rapide des commandes recentes."
          icon={<ShoppingCart size={18} />}
          actions={
            <Link href="/admin/orders" className="text-sm font-bold text-coral-deep hover:text-coral-deep/80">
              Tout voir
            </Link>
          }
        >
          <AdminTable className="rounded-2xl shadow-none">
            <AdminTableHead>
              <AdminTh>Reference</AdminTh>
              <AdminTh>Client</AdminTh>
              <AdminTh>Statut</AdminTh>
              <AdminTh>Total</AdminTh>
              <AdminTh />
            </AdminTableHead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.reference} className="border-b border-slate-100 last:border-none">
                  <AdminTd className="font-bold text-slate-950">{order.reference}</AdminTd>
                  <AdminTd>
                    <p className="font-semibold text-slate-800">{order.customerName}</p>
                    <p className="text-xs text-slate-500">{order.city}</p>
                  </AdminTd>
                  <AdminTd>
                    <OrderStatus status={order.status} />
                  </AdminTd>
                  <AdminTd className="font-semibold text-slate-800">{formatTND(order.total)}</AdminTd>
                  <AdminTd>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      Ouvrir
                      <ArrowUpRight size={13} />
                    </Link>
                  </AdminTd>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        </AdminCard>

        <div className="grid gap-5">
          <AdminCard title="Actions rapides" icon={<Boxes size={18} />}>
            <div className="grid gap-2">
              <QuickAction href="/admin/products/new" label="Ajouter un produit" />
              <QuickAction href="/admin/collections" label="Creer une collection" />
              <QuickAction href="/admin/media" label="Completer les images manquantes" />
              <QuickAction href="/admin/orders" label="Traiter les commandes" />
              <QuickAction href="/admin/settings" label="Regler livraison et contact" />
            </div>
          </AdminCard>

          <AdminCard title="Statuts commandes" icon={<Truck size={18} />}>
            <div className="space-y-3">
              {statusStats.map((item) => (
                <div key={item.status}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700">{orderStatusLabel(item.status)}</span>
                    <span className="text-slate-500">{item.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-coral-deep to-butter-deep"
                      style={{ width: `${Math.max(8, (item.count / Math.max(1, orders.length)) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-2">
        <AdminCard title="Best categories" description="Repartition catalogue par univers." icon={<BarChart3 size={18} />}>
          <div className="space-y-3">
            {categoryStats.map((category) => (
              <div key={category.id}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">{category.name}</span>
                  <span className="text-slate-500">{category.count} produits</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-mint-deep via-sky-deep to-coral-deep"
                    style={{ width: `${Math.max(6, (category.count / maxCategory) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Courbe simple" description="Apercu visuel des revenus recents." icon={<BarChart3 size={18} />}>
          <div className="flex h-56 items-end gap-3 rounded-3xl bg-gradient-to-b from-cream-100 to-white p-4">
            {recentOrders.length > 0 ? (
              recentOrders
                .slice()
                .reverse()
                .map((order) => (
                  <div key={order.reference} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-2xl bg-gradient-to-t from-coral-deep to-butter-deep shadow-soft"
                      style={{ height: `${Math.max(18, (order.total / Math.max(1, revenue)) * 190)}px` }}
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
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  hint,
  tone,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  hint: string;
  tone: "rose" | "blue" | "emerald" | "amber" | "lavender";
}) {
  const tones: Record<typeof tone, string> = {
    rose: "bg-rose-50 text-rose-600",
    blue: "bg-sky-50 text-sky-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    lavender: "bg-violet-50 text-violet-600",
  };

  return (
    <article className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(31,36,51,.06)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
        </div>
        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${tones[tone]}`}>
          {icon}
        </span>
      </div>
      <p className="mt-3 text-xs font-semibold text-slate-400">{hint}</p>
    </article>
  );
}

function QuickAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold text-slate-700 transition hover:border-coral-deep/40 hover:bg-cream-50"
    >
      {label}
      <ArrowUpRight size={14} />
    </Link>
  );
}

function getStatusStats(statuses: AdminOrderStatus[]) {
  const order: AdminOrderStatus[] = ["new", "confirmed", "preparing", "shipped", "delivered", "cancelled"];
  return order.map((status) => ({
    status,
    count: statuses.filter((value) => value === status).length,
  }));
}

function OrderStatus({ status }: { status: AdminOrderStatus }) {
  if (status === "delivered") return <StatusBadge tone="success">Livree</StatusBadge>;
  if (status === "cancelled") return <StatusBadge tone="danger">Annulee</StatusBadge>;
  if (status === "new") return <StatusBadge tone="warning">Nouvelle</StatusBadge>;
  if (status === "confirmed") return <StatusBadge tone="info">Confirmee</StatusBadge>;
  if (status === "preparing") return <StatusBadge>Preparation</StatusBadge>;
  if (status === "shipped") return <StatusBadge tone="info">Expediee</StatusBadge>;
  return <StatusBadge>{status}</StatusBadge>;
}
