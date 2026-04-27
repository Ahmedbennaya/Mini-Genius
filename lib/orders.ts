export type OrderStatus =
  | "new"
  | "confirmed"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type DeliveryMethod = "standard" | "express";

export type PaymentMethod = "cod" | "bank_transfer" | "card";

export type OrderItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  qty: number;
};

export type Order = {
  id: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  customerName: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
  notes?: string;
  delivery: DeliveryMethod;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount?: number;
  total: number;
  paymentMethod: PaymentMethod;
};

export type CreateOrderInput = {
  customerName: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
  notes?: string;
  delivery: DeliveryMethod;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount?: number;
  total: number;
  paymentMethod: PaymentMethod;
  status?: OrderStatus;
};

export const ORDER_STATUSES: OrderStatus[] = [
  "new",
  "confirmed",
  "preparing",
  "shipped",
  "delivered",
  "cancelled",
];

export const DELIVERY_OPTIONS = [
  {
    id: "standard" as const,
    label: "Livraison standard",
    desc: "24-72h selon la region",
    fee: 7,
  },
  {
    id: "express" as const,
    label: "Livraison express",
    desc: "Sous 24h, grandes villes",
    fee: 12,
  },
];

export const PAYMENT_METHODS = [
  {
    id: "cod" as const,
    label: "Paiement a la livraison",
    desc: "Le client paie lorsque la commande arrive.",
  },
  {
    id: "bank_transfer" as const,
    label: "Virement bancaire",
    desc: "Confirmation apres reception du paiement.",
  },
  {
    id: "card" as const,
    label: "Carte bancaire",
    desc: "Paiement en ligne quand le module est active.",
  },
];

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && ORDER_STATUSES.includes(value as OrderStatus);
}

export function isDeliveryMethod(value: unknown): value is DeliveryMethod {
  return value === "standard" || value === "express";
}

export function isPaymentMethod(value: unknown): value is PaymentMethod {
  return value === "cod" || value === "bank_transfer" || value === "card";
}

export function orderStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    new: "Nouvelle",
    confirmed: "Confirmee",
    preparing: "Preparation",
    shipped: "Expediee",
    delivered: "Livree",
    cancelled: "Annulee",
  };

  return labels[status];
}

export function paymentMethodLabel(method: PaymentMethod): string {
  const labels: Record<PaymentMethod, string> = {
    cod: "Paiement a la livraison",
    bank_transfer: "Virement bancaire",
    card: "Carte bancaire",
  };

  return labels[method];
}
