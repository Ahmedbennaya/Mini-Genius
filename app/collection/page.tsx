import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PackageX } from "lucide-react";
import { AGES, CATEGORIES } from "@/data/site";
import ProductCollectionGrid from "@/components/product/ProductCollectionGrid";
import FilterSidebar from "@/components/product/FilterSidebar";
import SearchTracker from "@/components/analytics/SearchTracker";
import Reveal from "@/components/motion/Reveal";
import { listCollections, listProducts } from "@/lib/admin/storage";
import type { AdminCollection } from "@/lib/admin/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Collection — Jouets éducatifs Montessori, STEM & sensoriels",
  description:
    "Parcourez toute la collection Mini Genius : jouets Montessori, STEM, sensoriels, puzzles, construction et coffrets cadeaux. Filtrez par âge et catégorie. Livraison partout en Tunisie.",
  alternates: { canonical: "/collection" },
  openGraph: {
    type: "website",
    title: "Collection — Jouets éducatifs Montessori, STEM & sensoriels",
    description:
      "Toute la collection Mini Genius : Montessori, STEM, sensoriels, puzzles, construction et coffrets cadeaux. Livraison partout en Tunisie.",
  },
};

type SP = {
  cat?: string;
  age?: string;
  collection?: string;
  sort?: string;
  q?: string;
  max?: string;
};

export default async function CollectionPage({ searchParams }: { searchParams: SP }) {
  const [products, savedCollections] = await Promise.all([listProducts(), listCollections()]);
  const collections = savedCollections.filter((collection) => collection.active);

  const cat = searchParams.cat ?? "all";
  const age = searchParams.age ?? "all";
  const collectionKey = searchParams.collection ?? "all";
  const sort = searchParams.sort ?? "popular";
  const q = (searchParams.q ?? "").toLowerCase().trim();
  const max = Number(searchParams.max ?? 250);

  const ageDef = AGES.find((item) => item.id === age);
  const collectionDef = collections.find(
    (item) => item.slug === collectionKey || item.id === collectionKey
  );

  let list = products.slice();

  if (collectionDef) {
    list = list.filter((product) => {
      const matchesAge =
        product.ageMax >= collectionDef.ageMin && product.ageMin <= collectionDef.ageMax;
      const matchesCategory =
        collectionDef.category === "all" || product.category === collectionDef.category;
      return matchesAge && matchesCategory;
    });
  } else {
    if (cat !== "all") list = list.filter((product) => product.category === cat);
    if (ageDef) {
      list = list.filter(
        (product) => product.ageMax >= ageDef.min && product.ageMin <= ageDef.max
      );
    }
  }

  if (q) {
    list = list.filter(
      (product) =>
        product.name.toLowerCase().includes(q) ||
        product.benefit.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q)
    );
  }
  list = list.filter((product) => product.price <= max);

  if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
  else if (sort === "new") list.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
  else list.sort((a, b) => b.rating * b.reviews - a.rating * a.reviews);

  const catDef = CATEGORIES.find((item) => item.id === cat);
  const heading = collectionDef
    ? collectionDef.name
    : catDef
      ? catDef.name
      : ageDef
        ? `Jouets ${ageDef.label}`
        : "Toute la collection";
  const description = collectionDef?.description;

  return (
    <div className="container-mg py-12 sm:py-16">
      {q ? <SearchTracker query={q} resultCount={list.length} /> : null}

      <Reveal as="header" className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow">Collection</span>
          <h1 className="mt-3 font-display text-[clamp(28px,4vw,46px)] leading-tight">
            {heading}
          </h1>
          {description ? <p className="mt-2 max-w-2xl text-ink-soft">{description}</p> : null}
          <p className="mt-2 text-ink-soft">
            {list.length} produit{list.length > 1 ? "s" : ""} trouve{list.length > 1 ? "s" : ""}
          </p>
        </div>
      </Reveal>

      {collectionDef ? <CollectionBanner collection={collectionDef} /> : null}

      <div className="mt-10 grid gap-10 lg:grid-cols-[260px_1fr]">
        <Suspense fallback={<div className="text-ink-soft">Chargement...</div>}>
          <FilterSidebar collections={collections} />
        </Suspense>

        <Reveal variant="fadeIn">
          {list.length === 0 ? (
            <EmptyState />
          ) : (
            <ProductCollectionGrid products={list} />
          )}
        </Reveal>
      </div>
    </div>
  );
}

function CollectionBanner({ collection }: { collection: AdminCollection }) {
  if (!collection.image) return null;

  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-cream-300 bg-white shadow-soft">
      <div className="grid gap-0 md:grid-cols-[minmax(0,0.72fr)_minmax(280px,0.28fr)]">
        <div className="p-5 sm:p-7">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-coral-deep">
            {collection.ageLabel}
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
            {collection.name}
          </h2>
          <p className="mt-2 max-w-2xl text-ink-soft">{collection.description}</p>
        </div>
        <div className="relative min-h-56 bg-cream-200 md:min-h-full">
          <Image
            src={collection.image}
            alt={collection.name}
            fill
            sizes="(max-width: 768px) 100vw, 360px"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-cream-300 bg-white p-10 text-center shadow-soft">
      <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-cream-200 text-ink-soft">
        <PackageX size={22} />
      </span>
      <h3 className="mt-4 font-display text-xl font-semibold">Aucun produit ne correspond</h3>
      <p className="mt-1.5 text-ink-soft">
        Essayez d'elargir vos filtres ou parcourez toute la collection.
      </p>
      <Link href="/collection" className="btn-coral mt-5">
        Voir toute la collection
      </Link>
    </div>
  );
}
