import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/data/products";
import { getSiteUrl } from "@/lib/site-url";

const staticRoutes = [
  "/",
  "/collection",
  "/a-propos",
  "/politique-retour",
  "/contact",
  "/panier",
  "/commande",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path, index) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : index === 1 ? 0.9 : 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = PRODUCTS.map((product) => ({
    url: `${baseUrl}/produit/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: product.bestseller ? 0.9 : 0.8,
  }));

  return [...staticEntries, ...productEntries];
}
