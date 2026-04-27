import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const ordersFile = path.join(root, "data", "orders.json");

function pad(value) {
  return String(value).padStart(4, "0");
}

async function readOrders() {
  await mkdir(path.dirname(ordersFile), { recursive: true });

  try {
    const raw = await readFile(ordersFile, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error && error.code === "ENOENT") return [];
    throw error;
  }
}

function nextReference(orders) {
  const year = new Date().getFullYear();
  const prefix = `MG-${year}-`;
  const max = orders.reduce((highest, order) => {
    if (!String(order.reference || "").startsWith(prefix)) return highest;
    const next = Number(String(order.reference).slice(prefix.length));
    return Number.isFinite(next) ? Math.max(highest, next) : highest;
  }, 0);

  return `${prefix}${pad(max + 1)}`;
}

const orders = await readOrders();
const now = new Date().toISOString();
const order = {
  id: randomUUID(),
  reference: nextReference(orders),
  createdAt: now,
  updatedAt: now,
  status: "new",
  customerName: "Test Client",
  phone: "50123456",
  city: "Tunis",
  address: "Rue Test 123",
  delivery: "standard",
  items: [
    {
      id: "puzzle-bois",
      slug: "puzzle-montessori-en-bois",
      name: "Puzzle Montessori en Bois",
      price: 79.9,
      qty: 1,
    },
  ],
  subtotal: 79.9,
  deliveryFee: 0,
  total: 79.9,
  paymentMethod: "cod",
};

await writeFile(ordersFile, `${JSON.stringify([order, ...orders], null, 2)}\n`, "utf8");

console.log(`Seeded order ${order.reference} for ${order.customerName}`);
