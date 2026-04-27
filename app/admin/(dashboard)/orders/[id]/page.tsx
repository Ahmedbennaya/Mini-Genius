import AdminCard from "@/components/admin/AdminCard";
import OrderDetailClient from "@/components/admin/OrderDetailClient";
import { getOrder } from "@/lib/admin/storage";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id);

  if (!order) {
    return (
      <AdminCard>
        <p className="text-sm font-semibold text-slate-500">Commande introuvable.</p>
      </AdminCard>
    );
  }

  return <OrderDetailClient initialOrder={order} />;
}
