import "server-only";

import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  isDeliveryMethod,
  isOrderStatus,
  isPaymentMethod,
  type CreateOrderInput,
  type Order,
  type OrderItem,
  type OrderStatus,
} from "@/lib/orders";

const ROOT = process.cwd();
const ORDERS_FILE = path.join(ROOT, "data", "orders.json");

type LegacyOrder = Partial<Order> & {
  customer?: {
    fullName?: string;
    phone?: string;
    email?: string;
    city?: string;
    address?: string;
    notes?: string;
  };
  paymentStatus?: string;
  status?: string;
};

function pad(value: number) {
  return String(value).padStart(4, "0");
}

async function ensureOrdersFile() {
  await fs.mkdir(path.dirname(ORDERS_FILE), { recursive: true });
  try {
    await fs.access(ORDERS_FILE);
  } catch {
    // Local file storage works in local/server environments. For production, connect orders to a real database.
    await fs.writeFile(ORDERS_FILE, "[]\n", "utf8");
  }
}

async function readOrdersFile(): Promise<LegacyOrder[]> {
  await ensureOrdersFile();
  const raw = await fs.readFile(ORDERS_FILE, "utf8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error("Orders file must contain a JSON array");
  }
  return parsed as LegacyOrder[];
}

async function writeOrdersFile(orders: Order[]) {
  await ensureOrdersFile();
  await fs.writeFile(ORDERS_FILE, `${JSON.stringify(orders, null, 2)}\n`, "utf8");
}

function normalizeStatus(status: unknown): OrderStatus {
  if (status === "pending") return "new";
  return isOrderStatus(status) ? status : "new";
}

function normalizeItems(items: unknown): OrderItem[] {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      const candidate = item as Partial<OrderItem>;
      return {
        id: String(candidate.id || candidate.slug || "").trim(),
        slug: String(candidate.slug || candidate.id || "").trim(),
        name: String(candidate.name || "").trim(),
        price: Number(candidate.price) || 0,
        qty: Math.max(1, Number(candidate.qty) || 1),
      };
    })
    .filter((item) => item.id && item.slug && item.name);
}

function normalizeOrder(input: LegacyOrder): Order {
  const now = new Date().toISOString();
  const reference = String(input.reference || "").trim();
  const createdAt = String(input.createdAt || now);
  const items = normalizeItems(input.items);
  const subtotal =
    Number(input.subtotal) ||
    items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = Number(input.deliveryFee) || 0;
  const discount = Number(input.discount) || 0;
  const total = Number(input.total) || subtotal + deliveryFee - discount;
  const paymentMethod = isPaymentMethod(input.paymentMethod) ? input.paymentMethod : "cod";
  const delivery = isDeliveryMethod(input.delivery) ? input.delivery : "standard";

  return {
    id: String(input.id || reference || randomUUID()),
    reference,
    createdAt,
    updatedAt: String(input.updatedAt || createdAt),
    status: normalizeStatus(input.status),
    customerName: String(input.customerName || input.customer?.fullName || "").trim(),
    phone: String(input.phone || input.customer?.phone || "").trim(),
    email: String(input.email || input.customer?.email || "").trim() || undefined,
    city: String(input.city || input.customer?.city || "").trim(),
    address: String(input.address || input.customer?.address || "").trim(),
    notes: String(input.notes || input.customer?.notes || "").trim() || undefined,
    delivery,
    items,
    subtotal,
    deliveryFee,
    discount: discount > 0 ? discount : undefined,
    total,
    paymentMethod,
  };
}

function nextReference(orders: Order[]) {
  const year = new Date().getFullYear();
  const prefix = `MG-${year}-`;
  const max = orders.reduce((highest, order) => {
    if (!order.reference.startsWith(prefix)) return highest;
    const next = Number(order.reference.slice(prefix.length));
    return Number.isFinite(next) ? Math.max(highest, next) : highest;
  }, 0);

  return `${prefix}${pad(max + 1)}`;
}

export async function getOrders(): Promise<Order[]> {
  const orders = (await readOrdersFile()).map(normalizeOrder);
  return orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const orders = await getOrders();
  return orders.find((order) => order.id === id || order.reference === id);
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const orders = (await readOrdersFile()).map(normalizeOrder);
  const now = new Date().toISOString();
  const order: Order = {
    id: randomUUID(),
    reference: nextReference(orders),
    createdAt: now,
    updatedAt: now,
    status: input.status ?? "new",
    customerName: input.customerName.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || undefined,
    city: input.city.trim(),
    address: input.address.trim(),
    notes: input.notes?.trim() || undefined,
    delivery: input.delivery,
    items: normalizeItems(input.items),
    subtotal: input.subtotal,
    deliveryFee: input.deliveryFee,
    discount: input.discount && input.discount > 0 ? input.discount : undefined,
    total: input.total,
    paymentMethod: input.paymentMethod,
  };

  await writeOrdersFile([order, ...orders]);
  return order;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  return updateOrder(id, { status });
}

export async function updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
  const orders = (await readOrdersFile()).map(normalizeOrder);
  const index = orders.findIndex((order) => order.id === id || order.reference === id);

  if (index < 0) throw new Error("Order not found");

  const updated: Order = normalizeOrder({
    ...orders[index],
    ...updates,
    id: orders[index].id,
    reference: orders[index].reference,
    createdAt: orders[index].createdAt,
    updatedAt: new Date().toISOString(),
  });

  orders[index] = updated;
  await writeOrdersFile(orders);
  return updated;
}
