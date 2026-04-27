import { promises as fs } from "node:fs";
import path from "node:path";
import { normalizeProduct, normalizeProducts, type Product } from "@/data/products";
import {
  getOrderById as getStoredOrderById,
  getOrders as getStoredOrders,
  updateOrderStatus as updateStoredOrderStatus,
} from "@/lib/orders-store";
import type {
  AdminCollection,
  AdminOrder,
  AdminSettings,
  CollectionInput,
  Coupon,
  CustomerSnapshot,
  MediaAsset,
  ProductInput,
} from "@/lib/admin/types";

const ROOT = process.cwd();
const CATALOG_FILE = path.join(ROOT, "data", "catalog.json");
const CATALOG_BACKUP_DIR = path.join(ROOT, "data", "backups");
const ADMIN_DIR = path.join(ROOT, "data", "admin");
const COLLECTIONS_FILE = path.join(ADMIN_DIR, "collections.json");
const COUPONS_FILE = path.join(ADMIN_DIR, "coupons.json");
const MEDIA_FILE = path.join(ADMIN_DIR, "media.json");
const SETTINGS_FILE = path.join(ADMIN_DIR, "settings.json");
const PRODUCT_CATEGORY_IDS = [
  "montessori",
  "stem",
  "sensoriel",
  "puzzles",
  "construction",
  "cadeaux",
] as const;

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile<T>(filePath: string, value: T): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), "utf8");
}

async function backupCatalog(reason: string): Promise<void> {
  try {
    const raw = await fs.readFile(CATALOG_FILE, "utf8");
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    await fs.mkdir(CATALOG_BACKUP_DIR, { recursive: true });
    await fs.writeFile(
      path.join(CATALOG_BACKUP_DIR, `catalog-${stamp}-${reason}.json`),
      raw,
      "utf8"
    );
  } catch {
    /* No catalog to back up yet. */
  }
}

async function writeCatalogProducts(products: Product[], reason: string): Promise<void> {
  await backupCatalog(reason);
  await writeJsonFile(CATALOG_FILE, normalizeProducts(products));
}

function safeId(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function normalizeCollectionSlug(input: string) {
  return safeId(input).replace(/-plus$/g, "-plus");
}

function ageLabel(min: number, max: number) {
  if (max >= 99) return `${min}+ ans`;
  if (min === max) return `${min} ans`;
  return `${min}-${max} ans`;
}

function normalizeAge(value: unknown, fallback: number) {
  const next = Number(value);
  if (!Number.isFinite(next)) return fallback;
  return Math.min(99, Math.max(0, Math.round(next)));
}

function normalizeCollection(input: CollectionInput | AdminCollection, existing?: AdminCollection): AdminCollection {
  const now = new Date().toISOString();
  const name = input.name?.trim();
  if (!name) throw new Error("Collection name is required");

  const slug = normalizeCollectionSlug(input.slug || existing?.slug || name);
  if (!slug) throw new Error("Collection slug is required");

  const rawMin = normalizeAge(input.ageMin, existing?.ageMin ?? 1);
  const rawMax = normalizeAge(input.ageMax, existing?.ageMax ?? rawMin);
  const ageMin = Math.min(rawMin, rawMax);
  const ageMax = Math.max(rawMin, rawMax);
  const rawCategory = input.category || existing?.category || "all";
  const category = PRODUCT_CATEGORY_IDS.includes(rawCategory as (typeof PRODUCT_CATEGORY_IDS)[number])
    ? rawCategory
    : "all";

  return {
    id: safeId(input.id || existing?.id || slug),
    slug,
    name,
    description: input.description?.trim() || existing?.description || "",
    image: input.image?.trim() || existing?.image || "",
    ageLabel: input.ageLabel?.trim() || ageLabel(ageMin, ageMax),
    ageMin,
    ageMax,
    category,
    active: input.active ?? existing?.active ?? true,
    sortOrder: Number.isFinite(Number(input.sortOrder))
      ? Number(input.sortOrder)
      : existing?.sortOrder ?? 0,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
}

const DEFAULT_COLLECTIONS: AdminCollection[] = [
  normalizeCollection({
    id: "age-1-2",
    slug: "age-1-2",
    name: "1-2 ans",
    description: "Eveil sensoriel et premiers gestes",
    image: "/images/age-1-2.jpg",
    ageMin: 1,
    ageMax: 2,
    category: "all",
    active: true,
    sortOrder: 10,
  }),
  normalizeCollection({
    id: "age-3-5",
    slug: "age-3-5",
    name: "3-5 ans",
    description: "Imagination et apprentissages",
    image: "/images/age-3-5.jpg",
    ageMin: 3,
    ageMax: 5,
    category: "all",
    active: true,
    sortOrder: 20,
  }),
  normalizeCollection({
    id: "age-6-8",
    slug: "age-6-8",
    name: "6-8 ans",
    description: "Logique, lecture et creativite",
    image: "/images/age-6-8.jpg",
    ageMin: 6,
    ageMax: 8,
    category: "all",
    active: true,
    sortOrder: 30,
  }),
  normalizeCollection({
    id: "age-9-plus",
    slug: "age-9-plus",
    name: "9+ ans",
    description: "STEM, defis et grands projets",
    image: "/images/age-9-plus.jpg",
    ageMin: 9,
    ageMax: 99,
    category: "all",
    active: true,
    sortOrder: 40,
  }),
];

export async function listProducts(): Promise<Product[]> {
  const products = await readJsonFile<Product[]>(CATALOG_FILE, []);
  return normalizeProducts(products);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await listProducts();
  return products.find((p) => p.id === id);
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const products = await listProducts();
  const idBase = input.id?.trim() || input.slug || input.name;
  const id = safeId(idBase);

  if (!id) throw new Error("Invalid product id");
  if (products.some((p) => p.id === id)) throw new Error("Product id already exists");
  if (products.some((p) => p.slug === input.slug)) throw new Error("Product slug already exists");

  const product: Product = {
    ...input,
    id,
    oldPrice: input.oldPrice || undefined,
    isNew: input.isNew || false,
    bestseller: input.bestseller || false,
  };

  const normalized = normalizeProduct(product);
  products.unshift(normalized);
  await writeCatalogProducts(products, "create");
  return normalized;
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product> {
  const products = await listProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index < 0) throw new Error("Product not found");

  if (products.some((p) => p.id !== id && p.slug === input.slug)) {
    throw new Error("Product slug already exists");
  }

  const next: Product = normalizeProduct({
    ...products[index],
    ...input,
    id,
    oldPrice: input.oldPrice || undefined,
  });

  products[index] = next;
  await writeCatalogProducts(products, "update");
  return next;
}

export async function deleteProduct(id: string): Promise<void> {
  const products = await listProducts();
  const next = products.filter((p) => p.id !== id);
  if (next.length === products.length) throw new Error("Product not found");
  await writeCatalogProducts(next, "delete");
}

export async function replaceProducts(inputs: ProductInput[]): Promise<Product[]> {
  if (!Array.isArray(inputs)) throw new Error("Invalid import payload");

  const next = inputs.map((input) => normalizeProduct(input as Product));
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const product of next) {
    if (!product.id || !product.slug || !product.name) {
      throw new Error("Every product needs id, slug and name");
    }
    if (ids.has(product.id)) throw new Error(`Duplicate product id: ${product.id}`);
    if (slugs.has(product.slug)) throw new Error(`Duplicate product slug: ${product.slug}`);
    ids.add(product.id);
    slugs.add(product.slug);
  }

  await writeCatalogProducts(next, "import");
  return next;
}

export async function listCollections(): Promise<AdminCollection[]> {
  const collections = await readJsonFile<AdminCollection[]>(COLLECTIONS_FILE, DEFAULT_COLLECTIONS);
  return collections
    .map((collection) => normalizeCollection(collection, collection))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
}

export async function getCollectionById(id: string): Promise<AdminCollection | undefined> {
  const collections = await listCollections();
  return collections.find((collection) => collection.id === id || collection.slug === id);
}

export async function createCollection(input: CollectionInput): Promise<AdminCollection> {
  const collections = await listCollections();
  const collection = normalizeCollection(input);

  if (!collection.id) throw new Error("Invalid collection id");
  if (collections.some((item) => item.id === collection.id)) {
    throw new Error("Collection id already exists");
  }
  if (collections.some((item) => item.slug === collection.slug)) {
    throw new Error("Collection slug already exists");
  }

  const next = [collection, ...collections];
  await writeJsonFile(COLLECTIONS_FILE, next);
  return collection;
}

export async function updateCollection(id: string, input: CollectionInput): Promise<AdminCollection> {
  const collections = await listCollections();
  const index = collections.findIndex((collection) => collection.id === id || collection.slug === id);
  if (index < 0) throw new Error("Collection not found");

  const updated = normalizeCollection(input, collections[index]);
  if (collections.some((item) => item.id !== collections[index].id && item.slug === updated.slug)) {
    throw new Error("Collection slug already exists");
  }

  collections[index] = updated;
  await writeJsonFile(COLLECTIONS_FILE, collections);
  return updated;
}

export async function deleteCollection(id: string): Promise<void> {
  const collections = await listCollections();
  const next = collections.filter((collection) => collection.id !== id && collection.slug !== id);
  if (next.length === collections.length) throw new Error("Collection not found");
  await writeJsonFile(COLLECTIONS_FILE, next);
}

export async function listOrders(): Promise<AdminOrder[]> {
  return getStoredOrders();
}

export async function getOrder(id: string): Promise<AdminOrder | undefined> {
  return getStoredOrderById(id);
}

export async function updateOrderStatus(
  id: string,
  status: AdminOrder["status"]
): Promise<AdminOrder> {
  return updateStoredOrderStatus(id, status);
}

export async function listCoupons(): Promise<Coupon[]> {
  return readJsonFile<Coupon[]>(COUPONS_FILE, []);
}

export async function upsertCoupon(code: string, payload: Coupon): Promise<Coupon> {
  const coupons = await listCoupons();
  const normalized = code.toUpperCase().trim();
  const index = coupons.findIndex((c) => c.code.toUpperCase() === normalized);
  const next = { ...payload, code: normalized };
  if (index < 0) coupons.unshift(next);
  else coupons[index] = next;
  await writeJsonFile(COUPONS_FILE, coupons);
  return next;
}

export async function deleteCoupon(code: string): Promise<void> {
  const coupons = await listCoupons();
  const next = coupons.filter((c) => c.code.toUpperCase() !== code.toUpperCase());
  await writeJsonFile(COUPONS_FILE, next);
}

export async function listMedia(): Promise<MediaAsset[]> {
  return readJsonFile<MediaAsset[]>(MEDIA_FILE, []);
}

export async function addMedia(asset: MediaAsset): Promise<MediaAsset> {
  const media = await listMedia();
  media.unshift(asset);
  await writeJsonFile(MEDIA_FILE, media);
  return asset;
}

export async function removeMedia(id: string): Promise<void> {
  const media = await listMedia();
  const next = media.filter((m) => m.id !== id);
  await writeJsonFile(MEDIA_FILE, next);
}

export async function getSettings(): Promise<AdminSettings> {
  return readJsonFile<AdminSettings>(SETTINGS_FILE, {
    storeName: "Mini Genius",
    supportEmail: "support@minigenius.tn",
    supportPhone: "+216 00 000 000",
    currency: "TND",
    shippingStandardFee: 7,
    shippingExpressFee: 12,
    freeShippingThreshold: 250,
    whatsappNumber: "21600000000",
    maintenanceMode: false,
    updatedAt: new Date().toISOString(),
  });
}

export async function updateSettings(next: AdminSettings): Promise<AdminSettings> {
  const withDate = { ...next, updatedAt: new Date().toISOString() };
  await writeJsonFile(SETTINGS_FILE, withDate);
  return withDate;
}

export function customersFromOrders(orders: AdminOrder[]): CustomerSnapshot[] {
  const map = new Map<string, CustomerSnapshot>();

  for (const order of orders) {
    const key = (order.email || order.phone).toLowerCase();
    const prev = map.get(key);

    if (!prev) {
      map.set(key, {
        id: key,
        fullName: order.customerName,
        phone: order.phone,
        email: order.email,
        city: order.city,
        ordersCount: 1,
        totalSpent: order.total,
        lastOrderAt: order.createdAt,
      });
      continue;
    }

    prev.ordersCount += 1;
    prev.totalSpent += order.total;
    if (new Date(order.createdAt).getTime() > new Date(prev.lastOrderAt).getTime()) {
      prev.lastOrderAt = order.createdAt;
      prev.city = order.city;
      prev.phone = order.phone;
      prev.fullName = order.customerName;
      prev.email = order.email;
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => new Date(b.lastOrderAt).getTime() - new Date(a.lastOrderAt).getTime()
  );
}
