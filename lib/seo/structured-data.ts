import { getSiteUrl } from "@/lib/site-url";
import { getProductImages, type Product } from "@/data/products";
import { FACEBOOK_URL, INSTAGRAM_URL, SUPPORT_PHONE_TEL } from "@/lib/utils";
import type { FaqItem } from "@/data/faq";

const SITE_NAME = "Mini Genius";
const SITE_DESCRIPTION =
  "Jouets éducatifs, Montessori, sensoriels et STEM pour enfants. Livraison partout en Tunisie, paiement à la livraison.";
const CURRENCY = process.env.NEXT_PUBLIC_META_CURRENCY || "TND";

function abs(path: string) {
  const base = getSiteUrl();
  if (/^https?:\/\//i.test(path)) return path;
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** Organization — identity used across Google Knowledge Graph / rich results. */
export function organizationSchema() {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${base}/#organization`,
    name: SITE_NAME,
    url: base,
    logo: abs("/images/logo.png"),
    image: abs("/images/logo.png"),
    description: SITE_DESCRIPTION,
    email: "bonjour@minigenius.tn",
    telephone: SUPPORT_PHONE_TEL,
    areaServed: { "@type": "Country", name: "Tunisia" },
    sameAs: [INSTAGRAM_URL, FACEBOOK_URL],
  };
}

/** WebSite + sitelinks search box. */
export function websiteSchema() {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base}/#website`,
    name: SITE_NAME,
    url: base,
    inLanguage: "fr-TN",
    publisher: { "@id": `${base}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${base}/collection?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Product schema with Offer + (optional) AggregateRating. */
export function productSchema(product: Product, categoryName?: string) {
  const base = getSiteUrl();
  const url = `${base}/produit/${product.slug}`;
  const images = getProductImages(product).map(abs);

  // priceValidUntil one year out (recommended for merchant listings).
  const validUntil = new Date();
  validUntil.setFullYear(validUntil.getFullYear() + 1);

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description: product.description,
    sku: product.id,
    category: categoryName ?? product.category,
    brand: { "@type": "Brand", name: SITE_NAME },
    url,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: CURRENCY,
      price: Number(product.price).toFixed(2),
      priceValidUntil: validUntil.toISOString().slice(0, 10),
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${base}/#organization` },
    },
  };

  if (images.length > 0) schema.image = images;

  // Only emit AggregateRating when we genuinely have reviews (Google rejects 0).
  if (product.reviews > 0 && product.rating > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(product.rating).toFixed(1),
      reviewCount: product.reviews,
      bestRating: "5",
      worstRating: "1",
    };
  }

  return schema;
}

/** BreadcrumbList from an ordered list of {name, url} crumbs. */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: abs(item.url),
    })),
  };
}

/** FAQPage schema from FAQ items. */
export function faqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
