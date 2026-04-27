import { NextResponse } from "next/server";
import { getPrimaryProductImage } from "@/data/products";
import { listProducts } from "@/lib/admin/storage";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

const BRAND = "Mini Genius";
const CURRENCY = "TND";

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

function price(value: number) {
  const safe = Number.isFinite(value) ? Math.max(0, value) : 0;
  return `${safe.toFixed(2)} ${CURRENCY}`;
}

export async function GET() {
  const siteUrl = getSiteUrl();
  const products = await listProducts();

  const headers = [
    "id",
    "title",
    "description",
    "availability",
    "condition",
    "price",
    "sale_price",
    "link",
    "image_link",
    "brand",
    "product_type",
    "google_product_category",
    "age_group",
    "gender",
  ];

  const rows = products
    .filter((product) => product.id && product.slug && product.name)
    .map((product) => {
      const productUrl = absoluteUrl(`/produit/${product.slug}`, siteUrl);
      const imageUrl =
        absoluteUrl(getPrimaryProductImage(product), siteUrl) ||
        absoluteUrl("/images/logo.png", siteUrl);
      const hasSalePrice = product.oldPrice && product.oldPrice > product.price;

      return [
        product.id,
        product.name,
        product.description || product.benefit,
        product.inStock ? "in stock" : "out of stock",
        "new",
        price(hasSalePrice ? product.oldPrice! : product.price),
        hasSalePrice ? price(product.price) : "",
        productUrl,
        imageUrl,
        BRAND,
        product.category,
        "Toys & Games > Toys",
        "kids",
        "unisex",
      ];
    });

  const csv = [headers, ...rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\n");

  return new NextResponse(`${csv}\n`, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Content-Disposition": 'inline; filename="mini-genius-meta-catalog.csv"',
      "Content-Type": "text/csv; charset=utf-8",
    },
  });
}
