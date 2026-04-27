import StatusBadge from "@/components/admin/StatusBadge";
import { orderStatusLabel, type OrderStatus } from "@/lib/orders";

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  if (status === "delivered") return <StatusBadge tone="success">{orderStatusLabel(status)}</StatusBadge>;
  if (status === "cancelled") return <StatusBadge tone="danger">{orderStatusLabel(status)}</StatusBadge>;
  if (status === "new") return <StatusBadge tone="warning">{orderStatusLabel(status)}</StatusBadge>;
  if (status === "shipped" || status === "confirmed") {
    return <StatusBadge tone="info">{orderStatusLabel(status)}</StatusBadge>;
  }

  return <StatusBadge>{orderStatusLabel(status)}</StatusBadge>;
}
