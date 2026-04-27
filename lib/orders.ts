export type OrderItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  qty: number;
};

export type Order = {
  reference: string;
  createdAt: string;
  customer: {
    fullName: string;
    phone: string;
    email?: string;
    city: string;
    address: string;
    notes?: string;
  };
  delivery: "standard" | "express";
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
};

const STORAGE_KEY = "mini_genius_orders";
const COUNTER_KEY = "mini_genius_order_counter";

function pad(n: number, width = 4) {
  return n.toString().padStart(width, "0");
}

export function generateOrderReference(): string {
  if (typeof window === "undefined") {
    return `MG-${new Date().getFullYear()}-0000`;
  }
  const year = new Date().getFullYear();
  let counter = 0;
  try {
    const raw = localStorage.getItem(COUNTER_KEY);
    counter = raw ? Number(JSON.parse(raw)) || 0 : 0;
  } catch {
    counter = 0;
  }
  counter += 1;
  try {
    localStorage.setItem(COUNTER_KEY, JSON.stringify(counter));
  } catch {
    /* ignore */
  }
  return `MG-${year}-${pad(counter)}`;
}

export function saveOrder(order: Order): void {
  if (typeof window === "undefined") return;
  let list: Order[] = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    list = raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    list = [];
  }
  list.unshift(order);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

export const DELIVERY_OPTIONS = [
  {
    id: "standard" as const,
    label: "Livraison standard",
    desc: "24–72h selon la région",
    fee: 7,
  },
  {
    id: "express" as const,
    label: "Livraison express",
    desc: "Sous 24h, grandes villes",
    fee: 12,
  },
];
