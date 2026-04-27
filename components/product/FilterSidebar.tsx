"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Filter, X, Search } from "lucide-react";
import { CATEGORIES, AGES } from "@/data/site";

const SORTS = [
  { value: "popular", label: "Popularité" },
  { value: "new", label: "Nouveautés" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
];

export default function FilterSidebar() {
  const router = useRouter();
  const sp = useSearchParams();
  const searchParams = sp ?? new URLSearchParams();

  const [open, setOpen] = useState(false);

  const cat = searchParams.get("cat") ?? "all";
  const age = searchParams.get("age") ?? "all";
  const sort = searchParams.get("sort") ?? "popular";
  const q = searchParams.get("q") ?? "";
  const max = Number(searchParams.get("max") ?? 250);

  const update = (patch: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (v === undefined || v === "" || v === "all") params.delete(k);
      else params.set(k, String(v));
    });
    router.push(`/collection?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      {/* Mobile trigger */}
      <button
        className="btn-ghost lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir les filtres"
      >
        <Filter size={16} />
        Filtres
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <FilterContent
          cat={cat}
          age={age}
          sort={sort}
          q={q}
          max={max}
          onChange={update}
        />
      </aside>

      {/* Mobile drawer */}
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
                cat={cat}
                age={age}
                sort={sort}
                q={q}
                max={max}
                onChange={update}
              />
              <div className="sticky bottom-0 -mx-5 mt-5 border-t border-cream-300 bg-cream p-5">
                <button onClick={() => setOpen(false)} className="btn-coral w-full">
                  Voir les résultats
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
  cat,
  age,
  sort,
  q,
  max,
  onChange,
}: {
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
          onSubmit={(e) => {
            e.preventDefault();
            onChange({ q: search });
          }}
          className="relative"
        >
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="input pl-11"
          />
        </form>
      </Section>

      <Section title="Trier par">
        <ul className="space-y-1.5">
          {SORTS.map((s) => (
            <li key={s.value}>
              <RadioRow
                checked={sort === s.value}
                onClick={() => onChange({ sort: s.value })}
                label={s.label}
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Âge">
        <ul className="space-y-1.5">
          <li>
            <RadioRow
              checked={age === "all"}
              onClick={() => onChange({ age: "all" })}
              label="Tous les âges"
            />
          </li>
          {AGES.map((a) => (
            <li key={a.id}>
              <RadioRow
                checked={age === a.id}
                onClick={() => onChange({ age: a.id })}
                label={a.label}
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Catégorie">
        <ul className="space-y-1.5">
          <li>
            <RadioRow
              checked={cat === "all"}
              onClick={() => onChange({ cat: "all" })}
              label="Toutes les catégories"
            />
          </li>
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <RadioRow
                checked={cat === c.id}
                onClick={() => onChange({ cat: c.id })}
                label={c.name}
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
          onChange={(e) => onChange({ max: Number(e.target.value) })}
          className="w-full accent-coral-deep"
        />
      </Section>

      <button
        onClick={() => onChange({ cat: "all", age: "all", sort: "popular", q: "", max: 250 })}
        className="text-sm font-semibold text-coral-deep hover:underline"
      >
        Réinitialiser les filtres
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
        checked ? "bg-white shadow-soft text-ink font-semibold" : "text-ink-soft hover:bg-cream-200"
      }`}
    >
      <span>{label}</span>
      <span
        className={`inline-block h-4 w-4 rounded-full border ${
          checked ? "border-coral-deep bg-coral-deep" : "border-cream-300"
        }`}
      />
    </button>
  );
}
