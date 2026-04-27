"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Filter, Search, X } from "lucide-react";
import { AGES, CATEGORIES } from "@/data/site";
import type { AdminCollection } from "@/lib/admin/types";

const SORTS = [
  { value: "popular", label: "Popularite" },
  { value: "new", label: "Nouveautes" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix decroissant" },
];

type FilterSidebarProps = {
  collections?: AdminCollection[];
};

export default function FilterSidebar({ collections = [] }: FilterSidebarProps) {
  const router = useRouter();
  const sp = useSearchParams();
  const searchParams = sp ?? new URLSearchParams();

  const [open, setOpen] = useState(false);

  const cat = searchParams.get("cat") ?? "all";
  const age = searchParams.get("age") ?? "all";
  const collection = searchParams.get("collection") ?? "all";
  const sort = searchParams.get("sort") ?? "popular";
  const q = searchParams.get("q") ?? "";
  const max = Number(searchParams.get("max") ?? 250);

  const update = (patch: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, value]) => {
      if (value === undefined || value === "" || value === "all") params.delete(key);
      else params.set(key, String(value));
    });

    if ("collection" in patch && patch.collection && patch.collection !== "all") {
      params.delete("cat");
      params.delete("age");
    }
    if ("cat" in patch || "age" in patch) {
      params.delete("collection");
    }

    const query = params.toString();
    router.push(query ? `/collection?${query}` : "/collection", { scroll: false });
  };

  return (
    <>
      <button
        className="btn-ghost lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir les filtres"
      >
        <Filter size={16} />
        Filtres
      </button>

      <aside className="hidden lg:block">
        <FilterContent
          collections={collections}
          collection={collection}
          cat={cat}
          age={age}
          sort={sort}
          q={q}
          max={max}
          onChange={update}
        />
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-ink/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-cream p-5 lg:hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold">Filtres</h3>
                <button
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-cream-200"
                  aria-label="Fermer"
                >
                  <X size={20} />
                </button>
              </div>
              <FilterContent
                collections={collections}
                collection={collection}
                cat={cat}
                age={age}
                sort={sort}
                q={q}
                max={max}
                onChange={update}
              />
              <div className="sticky bottom-0 -mx-5 mt-5 border-t border-cream-300 bg-cream p-5">
                <button onClick={() => setOpen(false)} className="btn-coral w-full">
                  Voir les resultats
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function FilterContent({
  collections,
  collection,
  cat,
  age,
  sort,
  q,
  max,
  onChange,
}: {
  collections: AdminCollection[];
  collection: string;
  cat: string;
  age: string;
  sort: string;
  q: string;
  max: number;
  onChange: (patch: Record<string, string | number | undefined>) => void;
}) {
  const [search, setSearch] = useState(q);

  useEffect(() => setSearch(q), [q]);

  return (
    <div className="space-y-7">
      <Section title="Recherche">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onChange({ q: search });
          }}
          className="relative"
        >
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher..."
            className="input pl-11"
          />
        </form>
      </Section>

      {collections.length > 0 ? (
        <Section title="Collections">
          <ul className="space-y-1.5">
            <li>
              <RadioRow
                checked={collection === "all"}
                onClick={() => onChange({ collection: "all" })}
                label="Toutes les collections"
              />
            </li>
            {collections.map((item) => (
              <li key={item.id}>
                <RadioRow
                  checked={collection === item.slug}
                  onClick={() => onChange({ collection: item.slug })}
                  label={`${item.name} (${item.ageLabel})`}
                />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section title="Trier par">
        <ul className="space-y-1.5">
          {SORTS.map((item) => (
            <li key={item.value}>
              <RadioRow
                checked={sort === item.value}
                onClick={() => onChange({ sort: item.value })}
                label={item.label}
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Age">
        <ul className="space-y-1.5">
          <li>
            <RadioRow
              checked={age === "all" && collection === "all"}
              onClick={() => onChange({ age: "all" })}
              label="Tous les ages"
            />
          </li>
          {AGES.map((item) => (
            <li key={item.id}>
              <RadioRow
                checked={age === item.id && collection === "all"}
                onClick={() => onChange({ age: item.id })}
                label={item.label}
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Categorie">
        <ul className="space-y-1.5">
          <li>
            <RadioRow
              checked={cat === "all" && collection === "all"}
              onClick={() => onChange({ cat: "all" })}
              label="Toutes les categories"
            />
          </li>
          {CATEGORIES.map((item) => (
            <li key={item.id}>
              <RadioRow
                checked={cat === item.id && collection === "all"}
                onClick={() => onChange({ cat: item.id })}
                label={item.name}
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section title={`Prix max : ${max} TND`}>
        <input
          type="range"
          min={20}
          max={250}
          step={10}
          value={max}
          onChange={(event) => onChange({ max: Number(event.target.value) })}
          className="w-full accent-coral-deep"
        />
      </Section>

      <button
        onClick={() =>
          onChange({ collection: "all", cat: "all", age: "all", sort: "popular", q: "", max: 250 })
        }
        className="text-sm font-semibold text-coral-deep hover:underline"
      >
        Reinitialiser les filtres
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-soft">
        {title}
      </h4>
      {children}
    </div>
  );
}

function RadioRow({
  checked,
  onClick,
  label,
}: {
  checked: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-[15px] transition ${
        checked ? "bg-white font-semibold text-ink shadow-soft" : "text-ink-soft hover:bg-cream-200"
      }`}
    >
      <span>{label}</span>
      <span
        className={`inline-block h-4 w-4 shrink-0 rounded-full border ${
          checked ? "border-coral-deep bg-coral-deep" : "border-cream-300"
        }`}
      />
    </button>
  );
}
