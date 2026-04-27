"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Eye, ImageIcon, Layers3, Plus, Save, Trash2 } from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import EmptyState from "@/components/admin/EmptyState";
import Toast from "@/components/admin/Toast";
import { CATEGORIES } from "@/data/site";
import type { Product } from "@/data/products";
import type { AdminCollection } from "@/lib/admin/types";

type CollectionDraft = Omit<AdminCollection, "createdAt" | "updatedAt"> & {
  createdAt?: string;
  updatedAt?: string;
};

const QUICK_IMAGES = [
  "/images/age-1-2.jpg",
  "/images/age-3-5.jpg",
  "/images/age-6-8.jpg",
  "/images/age-9-plus.jpg",
  "/images/hero-poster.jpg",
];

function emptyDraft(sortOrder = 50): CollectionDraft {
  return {
    id: "",
    slug: "",
    name: "",
    description: "",
    image: "",
    ageLabel: "",
    ageMin: 1,
    ageMax: 5,
    category: "all",
    active: true,
    sortOrder,
  };
}

function toDraft(collection: AdminCollection): CollectionDraft {
  return { ...collection };
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function getAgeLabel(collection: Pick<AdminCollection, "ageLabel" | "ageMin" | "ageMax">) {
  if (collection.ageLabel.trim()) return collection.ageLabel.trim();
  if (collection.ageMax >= 99) return `${collection.ageMin}+ ans`;
  if (collection.ageMin === collection.ageMax) return `${collection.ageMin} ans`;
  return `${collection.ageMin}-${collection.ageMax} ans`;
}

function countProducts(products: Product[], collection: Pick<AdminCollection, "ageMin" | "ageMax" | "category">) {
  return products.filter((product) => {
    const matchesAge = product.ageMax >= collection.ageMin && product.ageMin <= collection.ageMax;
    const matchesCategory = collection.category === "all" || product.category === collection.category;
    return matchesAge && matchesCategory;
  }).length;
}

type CollectionsManagerProps = {
  initialCollections: AdminCollection[];
  products: Product[];
};

export default function CollectionsManager({
  initialCollections,
  products,
}: CollectionsManagerProps) {
  const [collections, setCollections] = useState<AdminCollection[]>(initialCollections);
  const [draft, setDraft] = useState<CollectionDraft>(() => emptyDraft());
  const [deleting, setDeleting] = useState<AdminCollection | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [toastTone, setToastTone] = useState<"success" | "error">("success");

  const sortedCollections = useMemo(
    () => [...collections].sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)),
    [collections]
  );
  const editing = draft.id ? collections.find((collection) => collection.id === draft.id) : undefined;
  const nextSortOrder = sortedCollections.length > 0
    ? Math.max(...sortedCollections.map((collection) => collection.sortOrder)) + 10
    : 10;

  function showToast(message: string, tone: "success" | "error" = "success") {
    setToast(message);
    setToastTone(tone);
    setTimeout(() => setToast(null), 2200);
  }

  function startNew() {
    setDraft(emptyDraft(nextSortOrder));
  }

  function patchDraft(patch: Partial<CollectionDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  async function save() {
    const name = draft.name.trim();
    if (!name) {
      showToast("Nom de collection obligatoire.", "error");
      return;
    }

    const payload = {
      ...draft,
      name,
      slug: draft.slug.trim() || slugify(name),
      ageLabel: draft.ageLabel.trim() || getAgeLabel(draft),
      ageMin: Number(draft.ageMin),
      ageMax: Number(draft.ageMax),
      sortOrder: Number(draft.sortOrder),
    };

    setSaving(true);
    const response = await fetch(
      editing ? `/api/admin/collections/${editing.id}` : "/api/admin/collections",
      {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const result = (await response.json()) as {
      ok: boolean;
      data?: AdminCollection;
      message?: string;
    };
    setSaving(false);

    if (!response.ok || !result.ok || !result.data) {
      showToast(result.message || "Sauvegarde impossible.", "error");
      return;
    }

    setCollections((current) => {
      const exists = current.some((collection) => collection.id === result.data!.id);
      if (exists) {
        return current.map((collection) =>
          collection.id === result.data!.id ? result.data! : collection
        );
      }
      return [result.data!, ...current];
    });
    setDraft(toDraft(result.data));
    showToast(editing ? "Collection mise a jour." : "Collection creee.");
  }

  async function removeCollection() {
    if (!deleting) return;
    const response = await fetch(`/api/admin/collections/${deleting.id}`, { method: "DELETE" });
    if (!response.ok) {
      showToast("Suppression impossible.", "error");
      setDeleting(null);
      return;
    }

    setCollections((current) => current.filter((collection) => collection.id !== deleting.id));
    if (draft.id === deleting.id) startNew();
    setDeleting(null);
    showToast("Collection supprimee.");
  }

  return (
    <div>
      <AdminPageHeader
        title="Collections"
        subtitle="Creez les blocs avec image et tranche d'age visibles sur la boutique."
        actions={
          <>
            <button
              type="button"
              onClick={startNew}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-soft transition hover:bg-slate-50"
            >
              <Plus size={16} />
              Nouvelle
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-slate-800 disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          </>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <AdminCard title="Collections boutique" icon={<Layers3 size={18} />}>
          {sortedCollections.length === 0 ? (
            <EmptyState title="Aucune collection" description="Ajoutez une collection pour l'afficher sur la page d'accueil." />
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">
              {sortedCollections.map((collection) => {
                const selected = draft.id === collection.id;
                const total = countProducts(products, collection);
                return (
                  <div
                    key={collection.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setDraft(toDraft(collection))}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") setDraft(toDraft(collection));
                    }}
                    className={`cursor-pointer overflow-hidden rounded-3xl border bg-white text-left transition hover:-translate-y-0.5 hover:shadow-soft ${
                      selected ? "border-coral-deep ring-4 ring-coral-deep/10" : "border-slate-200"
                    }`}
                  >
                    <div className="relative h-36 bg-slate-100">
                      {collection.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={collection.image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-300">
                          <ImageIcon size={28} />
                        </div>
                      )}
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-700 shadow-soft">
                        {getAgeLabel(collection)}
                      </span>
                      <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold shadow-soft ${
                        collection.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}>
                        {collection.active ? "Active" : "Masquee"}
                      </span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-slate-950">{collection.name}</h3>
                          <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                            {collection.description || "Sans description"}
                          </p>
                        </div>
                        <span className="rounded-full bg-cream-200 px-2.5 py-1 text-xs font-bold text-slate-700">
                          {total}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2 text-xs font-bold text-slate-500">
                        <span>/{collection.slug}</span>
                        <Link
                          href={`/collection?collection=${encodeURIComponent(collection.slug)}`}
                          onClick={(event) => event.stopPropagation()}
                          className="inline-flex items-center gap-1 text-coral-deep"
                        >
                          Voir
                          <Eye size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </AdminCard>

        <aside className="space-y-5">
          <AdminCard
            title={editing ? "Modifier collection" : "Nouvelle collection"}
            description="Nom, image, age et filtre produit."
            icon={<ImageIcon size={18} />}
            actions={
              editing ? (
                <button
                  type="button"
                  onClick={() => setDeleting(editing)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-rose-200 bg-white text-rose-600 transition hover:bg-rose-50"
                  aria-label="Supprimer collection"
                >
                  <Trash2 size={16} />
                </button>
              ) : null
            }
          >
            <div className="space-y-4">
              <Field
                label="Nom"
                value={draft.name}
                onChange={(value) => patchDraft({
                  name: value,
                  slug: draft.slug ? draft.slug : slugify(value),
                })}
                placeholder="Ex: Montessori 3-5 ans"
              />

              <Field
                label="Slug URL"
                value={draft.slug}
                onChange={(value) => patchDraft({ slug: slugify(value) })}
                placeholder="montessori-3-5-ans"
              />

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.04em] text-slate-500">
                  Description
                </span>
                <textarea
                  value={draft.description}
                  onChange={(event) => patchDraft({ description: event.target.value })}
                  rows={3}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none ring-coral-deep/15 transition focus:border-coral-deep/60 focus:ring-4"
                  placeholder="Texte court affiche sur la carte."
                />
              </label>

              <Field
                label="Image URL"
                value={draft.image}
                onChange={(value) => patchDraft({ image: value })}
                placeholder="/images/age-3-5.jpg"
              />

              <div className="flex flex-wrap gap-2">
                {QUICK_IMAGES.map((image) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => patchDraft({ image })}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-white"
                  >
                    {image.replace("/images/", "")}
                  </button>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <NumberField
                  label="Age min"
                  value={draft.ageMin}
                  onChange={(value) => patchDraft({ ageMin: value })}
                />
                <NumberField
                  label="Age max"
                  value={draft.ageMax}
                  onChange={(value) => patchDraft({ ageMax: value })}
                />
              </div>

              <Field
                label="Label age"
                value={draft.ageLabel}
                onChange={(value) => patchDraft({ ageLabel: value })}
                placeholder={getAgeLabel(draft)}
              />

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.04em] text-slate-500">
                  Categorie produit
                </span>
                <select
                  value={draft.category}
                  onChange={(event) =>
                    patchDraft({ category: event.target.value as AdminCollection["category"] })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none ring-coral-deep/15 transition focus:border-coral-deep/60 focus:ring-4"
                >
                  <option value="all">Toutes les categories</option>
                  {CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <NumberField
                  label="Ordre"
                  value={draft.sortOrder}
                  onChange={(value) => patchDraft({ sortOrder: value })}
                />
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={draft.active}
                    onChange={(event) => patchDraft({ active: event.target.checked })}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Active sur le site
                </label>
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Apercu">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
              <div className="relative h-44 bg-slate-100">
                {draft.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={draft.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-300">
                    <ImageIcon size={28} />
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-[0.04em] text-coral-deep">
                  {getAgeLabel(draft)}
                </p>
                <h3 className="mt-1 font-semibold text-slate-950">
                  {draft.name || "Nom de collection"}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {draft.description || "Description de la collection."}
                </p>
                <p className="mt-3 text-sm font-bold text-slate-700">
                  {countProducts(products, draft)} produit(s) dans cette collection
                </p>
              </div>
            </div>
          </AdminCard>
        </aside>
      </div>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Supprimer cette collection ?"
        message="La collection sera retiree de la page d'accueil et du filtre public."
        confirmLabel="Supprimer"
        danger
        onConfirm={() => void removeCollection()}
        onCancel={() => setDeleting(null)}
      />
      <Toast message={toast} tone={toastTone} />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.04em] text-slate-500">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none ring-coral-deep/15 transition focus:border-coral-deep/60 focus:ring-4"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.04em] text-slate-500">
        {label}
      </span>
      <input
        type="number"
        min={0}
        max={99}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none ring-coral-deep/15 transition focus:border-coral-deep/60 focus:ring-4"
      />
    </label>
  );
}
