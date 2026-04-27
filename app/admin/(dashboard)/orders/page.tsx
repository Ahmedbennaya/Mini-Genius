import AdminOrdersClient from "@/components/admin/AdminOrdersClient";
import { listOrders } from "@/lib/admin/storage";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await listOrders();
  return <AdminOrdersClient initialOrders={orders} />;
}
