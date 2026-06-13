import catalog from "@/data/catalog.json";

export type ToyShape =
  | "puzzle"
  | "cube"
  | "blocks"
  | "board"
  | "balls"
  | "rocket"
  | "cards"
  | "gift"
  | "ring"
  | "ball";

export type Palette = "mint" | "sky" | "coral" | "butter" | "lavender";
export type ProductImageFit = "cover" | "contain";

export type Product = {
  id: string;
  slug: string;
  name: string;
  image?: string;
  image_url?: string;
  images?: string[];
  imagePrompt?: string;
  imageSearchQuery?: string;
  imageFrameWidth?: number;
  imageFrameHeight?: number;
  imageFit?: ProductImageFit;
  imagePositionX?: number;
  imagePositionY?: number;
  age: string;
  ageMin: number;
  ageMax: number;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  benefit: string;
  description: string;
  develops: string[];
  material: string;
  safety: string[];
  category: "montessori" | "stem" | "sensoriel" | "puzzles" | "construction" | "cadeaux";
  palette: Palette;
  shape: ToyShape;
  isNew?: boolean;
  bestseller?: boolean;
  inStock: boolean;
};

const MAX_PRODUCT_IMAGES = 5;
const DEFAULT_IMAGE_FRAME = { width: 1080, height: 1080, fit: "cover" as ProductImageFit };

function uniqueUrls(urls: Array<string | undefined | null>) {
  const seen = new Set<string>();
  return urls
    .map((url) => (typeof url === "string" ? url.trim() : ""))
    .filter((url) => {
      if (!url || seen.has(url)) return false;
      seen.add(url);
      return true;
    })
    .slice(0, MAX_PRODUCT_IMAGES);
}

export function getProductImages(product: Pick<Product, "images" | "image" | "image_url">): string[] {
  const gallery = uniqueUrls(Array.isArray(product.images) ? product.images : []);
  if (gallery.length > 0) return gallery;
  return uniqueUrls([product.image_url, product.image]);
}

export function getPrimaryProductImage(product: Pick<Product, "images" | "image" | "image_url">): string | undefined {
  return getProductImages(product)[0];
}

export function hasProductImages(product: Pick<Product, "images" | "image" | "image_url">): boolean {
  return getProductImages(product).length > 0;
}

function normalizeDimension(value: unknown, fallback: number) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(4000, Math.max(240, Math.round(number)));
}

function normalizePercent(value: unknown, fallback = 50) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(100, Math.max(0, Math.round(number)));
}

export function getProductImageFrame(
  product: Pick<Product, "imageFrameWidth" | "imageFrameHeight" | "imageFit">
) {
  const width = normalizeDimension(product.imageFrameWidth, DEFAULT_IMAGE_FRAME.width);
  const height = normalizeDimension(product.imageFrameHeight, DEFAULT_IMAGE_FRAME.height);
  const fit = product.imageFit === "contain" ? "contain" : DEFAULT_IMAGE_FRAME.fit;

  return {
    width,
    height,
    fit,
    aspectRatio: `${width} / ${height}`,
  };
}

export function getProductImagePosition(
  product: Pick<Product, "imagePositionX" | "imagePositionY">
) {
  const x = normalizePercent(product.imagePositionX, 50);
  const y = normalizePercent(product.imagePositionY, 50);

  return {
    x,
    y,
    objectPosition: `${x}% ${y}%`,
  };
}

export function normalizeProduct(product: Product): Product {
  const images = getProductImages(product);
  const primary = images[0];
  const imageFrame = getProductImageFrame(product);

  return {
    ...product,
    image: primary || product.image || product.image_url || undefined,
    image_url: primary || product.image_url || product.image || undefined,
    images: images.length > 0 ? images : undefined,
    imageFrameWidth: imageFrame.width,
    imageFrameHeight: imageFrame.height,
    imageFit: imageFrame.fit,
    oldPrice: product.oldPrice || undefined,
    isNew: product.isNew || false,
    bestseller: product.bestseller || false,
  };
}

export function normalizeProducts(products: Product[]): Product[] {
  return products.map(normalizeProduct);
}

export const PRODUCTS: Product[] = normalizeProducts(catalog as Product[]);

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getRelated(product: Product, limit = 4) {
  return PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit)
    .concat(PRODUCTS.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, limit);
}

/* -----------------------------------------------------------------
 * Catalog-ready public API
 *
 * These helpers are the stable surface the rest of the app uses.
 * When the real catalog (mini_genius_750_dropshipping_products.json)
 * is dropped into the project, only the data source below changes —
 * the function signatures stay identical so no callers break.
 * --------------------------------------------------------------- */

export const allProducts: Product[] = PRODUCTS;

export const featuredProducts: Product[] = PRODUCTS.filter(
  (p) => p.bestseller || p.isNew
);

export function getProductBySlug(slug: string): Product | undefined {
  return allProducts.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return allProducts.filter((p) => p.category === category);
}

export function getCategories(): string[] {
  return Array.from(new Set(allProducts.map((p) => p.category)));
}

/**
 * Returns subcategory list. The current sample data has no subcategory
 * field — the real catalog will. Until then, this returns a deduped
 * list scoped to a parent category if provided.
 */
export function getSubcategories(category?: string): string[] {
  const list = category ? getProductsByCategory(category) : allProducts;
  // Subcategory will exist on Product once the real catalog lands.
  // For now, fall back to category to keep filter components working.
  const subs = list
    .map((p) => (p as Product & { subcategory?: string }).subcategory)
    .filter((s): s is string => Boolean(s));
  if (subs.length === 0) return [];
  return Array.from(new Set(subs));
}

export function getProductsByAge(ageId: string): Product[] {
  // Accepts the age bucket ids from data/site.ts (1-2, 3-5, 6-8, 9+)
  const map: Record<string, [number, number]> = {
    "1-2": [1, 2],
    "3-5": [3, 5],
    "6-8": [6, 8],
    "9+": [9, 99],
  };
  const range = map[ageId];
  if (!range) return [];
  const [min, max] = range;
  return allProducts.filter((p) => p.ageMax >= min && p.ageMin <= max);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.benefit.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
}

export function getProductImageUrl(product: Product): string {
  const primary = getPrimaryProductImage(product);
  if (primary) return primary;

  const label = encodeURIComponent(product.name || "Mini Genius");
  return `https://placehold.co/960x960/f8fafc/334155?text=${label}`;
}
