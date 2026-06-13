import type { MetadataRoute } from "next";
import { GAMES } from "@/data/iq/games";
import { listProducts } from "@/lib/admin/storage";
import { SUPPORTED_LOCALES } from "@/lib/iq/i18n";
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await listProducts();
  const baseUrl = getSiteUrl();
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path, index) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : index === 1 ? 0.9 : 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/produit/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: product.bestseller ? 0.9 : 0.8,
  }));

  const iqStaticEntries: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) =>
    ["", "/games", "/test", "/test/results", "/dashboard"].map((path) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 0.9 : 0.75,
    })),
  );

  const iqGameEntries: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) =>
    GAMES.map((game) => ({
      url: `${baseUrl}/${locale}/games/${game.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: game.recommended ? 0.75 : 0.65,
    })),
  );

  return [...staticEntries, ...productEntries, ...iqStaticEntries, ...iqGameEntries];
}
