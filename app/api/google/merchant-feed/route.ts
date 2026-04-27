import { NextResponse } from "next/server";
import { getPrimaryProductImage } from "@/data/products";
import { listProducts } from "@/lib/admin/storage";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

const BRAND = "Mini Genius";
const CURRENCY = "TND";
const GOOGLE_PRODUCT_CATEGORY = "Toys & Games > Toys";

function absoluteUrl(value: string | undefined, baseUrl: string) {
  const clean = value?.trim();
  if (!clean) return "";

  try {
    return new URL(clean, baseUrl).toString();
  } catch {
    return "";
  }
}

function csvCell(value: unknown) {
  const text = String(value ?? "")
    .replace(/\r?\n|\r/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return `"${text.replace(/"/g, '""')}"`;
}

function formatPrice(value: number) {
  const safe = Number.isFinite(value) ? Math.max(0, value) : 0;
  return `${safe.toFixed(2)} ${CURRENCY}`;
}

function productType(category: string) {
  const labels: Record<string, string> = {
    montessori: "Toys & Games > Educational Toys > Montessori Toys",
    stem: "Toys & Games > Educational Toys > STEM Toys",
    sensoriel: "Toys & Games > Educational Toys > Sensory Toys",
    puzzles: "Toys & Games > Puzzles",
    construction: "Toys & Games > Building Toys",
    cadeaux: "Toys & Games > Gift Sets",
  };

  return labels[category] || GOOGLE_PRODUCT_CATEGORY;
}

export async function GET() {
  const siteUrl = getSiteUrl();
  const products = await listProducts();

  const headers = [
    "id",
    "title",
    "description",
    "link",
    "image_link",
    "availability",
    "price",
    "sale_price",
    "condition",
    "brand",
    "google_product_category",
    "product_type",
    "identifier_exists",
    "age_group",
    "gender",
    "adult",
  ];

  const rows = products
    .filter((product) => product.id && product.slug && product.name)
    .map((product) => {
      const imageUrl =
        absoluteUrl(getPrimaryProductImage(product), siteUrl) ||
        absoluteUrl("/images/logo.png", siteUrl);
      const hasSalePrice = product.oldPrice && product.oldPrice > product.price;

      return [
        product.id,
        product.name,
        product.description || product.benefit,
        absoluteUrl(`/produit/${product.slug}`, siteUrl),
        imageUrl,
        product.inStock ? "in_stock" : "out_of_stock",
        formatPrice(hasSalePrice ? product.oldPrice! : product.price),
        hasSalePrice ? formatPrice(product.price) : "",
        "new",
        BRAND,
        GOOGLE_PRODUCT_CATEGORY,
        productType(product.category),
        "no",
        "kids",
        "unisex",
        "no",
      ];
    });

  const csv = [headers, ...rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\n");

  return new NextResponse(`${csv}\n`, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Content-Disposition": 'inline; filename="mini-genius-google-merchant-feed.csv"',
      "Content-Type": "text/csv; charset=utf-8",
    },
  });
}
