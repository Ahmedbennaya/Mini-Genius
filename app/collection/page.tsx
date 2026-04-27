import { Suspense } from "react";
import type { Metadata } from "next";
import { PRODUCTS } from "@/data/products";
import { AGES, CATEGORIES } from "@/data/site";
import ProductCard from "@/components/product/ProductCard";
import FilterSidebar from "@/components/product/FilterSidebar";
import { PackageX } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Collection — Jouets éducatifs",
  description:
    "Parcourez toute la collection Mini Genius : jouets Montessori, STEM, sensoriels, puzzles, construction et coffrets cadeaux. Filtrez par âge et catégorie.",
};

type SP = {
  cat?: string;
  age?: string;
  sort?: string;
  q?: string;
  max?: string;
};

export default function CollectionPage({ searchParams }: { searchParams: SP }) {
  const cat = searchParams.cat ?? "all";
  const age = searchParams.age ?? "all";
  const sort = searchParams.sort ?? "popular";
  const q = (searchParams.q ?? "").toLowerCase().trim();
  const max = Number(searchParams.max ?? 250);

  const ageDef = AGES.find((a) => a.id === age);

  let list = PRODUCTS.slice();

  if (cat !== "all") list = list.filter((p) => p.category === cat);
  if (ageDef) list = list.filter((p) => p.ageMax >= ageDef.min && p.ageMin <= ageDef.max);
  if (q) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.benefit.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }
  list = list.filter((p) => p.price <= max);

  if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
  else if (sort === "new") list.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
  else list.sort((a, b) => b.rating * b.reviews - a.rating * a.reviews);

  const catDef = CATEGORIES.find((c) => c.id === cat);
  const heading = catDef ? catDef.name : ageDef ? `Jouets ${ageDef.label}` : "Toute la collection";

  return (
    <div className="container-mg py-12 sm:py-16">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow">Collection</span>
          <h1 className="mt-3 font-display text-[clamp(28px,4vw,46px)] leading-tight">
            {heading}
          </h1>
          <p className="mt-2 text-ink-soft">
            {list.length} produit{list.length > 1 ? "s" : ""} trouvé{list.length > 1 ? "s" : ""}
          </p>
        </div>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[260px_1fr]">
        {/* The FilterSidebar component renders a mobile trigger button + drawer
            on small screens, and a sticky sidebar on lg+. */}
        <Suspense fallback={<div className="text-ink-soft">Chargement…</div>}>
          <FilterSidebar />
        </Suspense>

        <div>
          {list.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-7 sm:grid-cols-2">
              {list.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
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
        Essayez d&apos;élargir vos filtres ou parcourez toute la collection.
      </p>
      <Link href="/collection" className="btn-coral mt-5">
        Voir toute la collection
      </Link>
    </div>
  );
}
