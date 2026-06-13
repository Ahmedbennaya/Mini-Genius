"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownAZ,
  Copy,
  Download,
  Eye,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable, { AdminTableHead, AdminTd, AdminTh } from "@/components/admin/AdminTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import EmptyState from "@/components/admin/EmptyState";
import FilterSelect from "@/components/admin/FilterSelect";
import SearchInput from "@/components/admin/SearchInput";
import StatusBadge from "@/components/admin/StatusBadge";
import Toast from "@/components/admin/Toast";
import { CATEGORIES, PALETTE_HEX } from "@/data/site";
import {
  getPrimaryProductImage,
  normalizeProducts,
  type Product,
} from "@/data/products";
import ToyVisual from "@/components/ui/ToyVisual";
import catalog from "@/data/catalog.json";
import { formatTND } from "@/lib/utils";

const PAGE_SIZE = 8;
const INITIAL_PRODUCTS = normalizeProducts(catalog as Product[]);

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [stock, setStock] = useState("all");
  const [sort, setSort] = useState("updated");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [toastTone, setToastTone] = useState<"success" | "error">("success");
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let ignore = false;

    fetch("/api/admin/products", { cache: "no-store" })
      .then((response) => response.json())
      .then((result: { ok?: boolean; data?: Product[] }) => {
        if (!ignore && result.ok && result.data) setProducts(result.data);
      })
      .catch(() => undefined);

    return () => {
      ignore = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((product) => {
      const matchesQuery =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.slug.toLowerCase().includes(q) ||
        product.benefit.toLowerCase().includes(q);
      const matchesCategory = category === "all" || product.category === category;
      const matchesStock =
        stock === "all" || (stock === "in" ? product.inStock : !product.inStock);
      return matchesQuery && matchesCategory && matchesStock;
    });

    list = [...list].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "stock") return Number(b.inStock) - Number(a.inStock);
      if (sort === "name") return a.name.localeCompare(b.name);
      return Number(Boolean(b.bestseller || b.isNew)) - Number(Boolean(a.bestseller || a.isNew));
    });

    return list;
  }, [products, query, category, stock, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selectedProducts = products.filter((product) => selected.has(product.id));

  function showToast(message: string, tone: "success" | "error" = "success") {
    setToast(message);
    setToastTone(tone);
    setTimeout(() => setToast(null), 2200);
  }

  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllVisible() {
    setSelected((current) => {
      const next = new Set(current);
      const allVisibleSelected = visible.every((product) => next.has(product.id));
      visible.forEach((product) => {
        if (allVisibleSelected) next.delete(product.id);
        else next.add(product.id);
      });
      return next;
    });
  }

  async function removeProduct(id: string) {
    setBusy(true);
    const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (response.ok) {
      setProducts((prev) => prev.filter((product) => product.id !== id));
      setSelected((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
      setDeleting(null);
      showToast("Produit supprime.");
    } else {
      showToast("Suppression impossible.", "error");
    }
    setBusy(false);
  }

  async function removeSelected() {
    setBusy(true);
    for (const product of selectedProducts) {
      await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    }
    setProducts((prev) => prev.filter((product) => !selected.has(product.id)));
    setSelected(new Set());
    setBulkDeleteOpen(false);
    setBusy(false);
    showToast("Produits supprimes.");
  }

  async function duplicateProduct(product: Product) {
    const suffix = Date.now().toString().slice(-5);
    const copyPayload = {
      ...product,
      id: `${product.id}-copy-${suffix}`,
      slug: `${product.slug}-copy-${suffix}`,
      name: `${product.name} copie`,
      isNew: true,
    };

    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(copyPayload),
    });
    const result = (await response.json()) as { ok: boolean; data?: Product; message?: string };
    if (response.ok && result.ok && result.data) {
      setProducts((prev) => [result.data!, ...prev]);
      showToast("Produit duplique.");
    } else {
      showToast(result.message || "Duplication impossible.", "error");
    }
  }

  function exportProducts() {
    const blob = new Blob([JSON.stringify(products, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mini-genius-catalog-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function importProducts(file: File) {
    try {
      const raw = await file.text();
      const payload = JSON.parse(raw) as Product[] | { products: Product[] };
      const response = await fetch("/api/admin/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { ok: boolean; data?: Product[]; message?: string };
      if (!response.ok || !result.ok || !result.data) {
        showToast(result.message || "Import impossible.", "error");
        return;
      }
      setProducts(result.data);
      setSelected(new Set());
      showToast("Catalogue importe avec backup cree.");
    } catch {
      showToast("Fichier JSON invalide.", "error");
    } finally {
      if (importRef.current) importRef.current.value = "";
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Produits"
        subtitle="Catalogue, visuels, stock et actions commerciales."
        actions={
          <>
            <input
              ref={importRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void importProducts(file);
              }}
            />
            <button
              type="button"
              onClick={() => importRef.current?.click()}
              className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-soft transition hover:bg-slate-50 sm:inline-flex"
            >
              <Upload size={16} />
              Import
            </button>
            <button
              type="button"
              onClick={exportProducts}
              className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-soft transition hover:bg-slate-50 sm:inline-flex"
            >
              <Download size={16} />
              Export
            </button>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-slate-800"
            >
              <Plus size={16} />
              Ajouter produit
            </Link>
          </>
        }
      />

      <AdminCard className="mb-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(260px,1fr)_190px_170px_190px]">
          <SearchInput
            value={query}
            onChange={(value) => {
              setQuery(value);
              setPage(1);
            }}
            placeholder="Rechercher nom, categorie, slug, benefice..."
          />
          <FilterSelect
            label="Categorie"
            value={category}
            onChange={(value) => {
              setCategory(value);
              setPage(1);
            }}
            options={[
              { label: "Toutes", value: "all" },
              ...CATEGORIES.map((item) => ({ label: item.name, value: item.id })),
            ]}
          />
          <FilterSelect
            label="Stock"
            value={stock}
            onChange={(value) => {
              setStock(value);
              setPage(1);
            }}
            options={[
              { label: "Tous", value: "all" },
              { label: "En stock", value: "in" },
              { label: "Rupture", value: "out" },
            ]}
          />
          <FilterSelect
            label="Tri"
            value={sort}
            onChange={setSort}
            options={[
              { label: "Mise en avant", value: "updated" },
              { label: "Nom", value: "name" },
              { label: "Prix croissant", value: "price-asc" },
              { label: "Prix decroissant", value: "price-desc" },
              { label: "Stock", value: "stock" },
            ]}
          />
        </div>

        {selected.size > 0 ? (
          <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-coral-deep/20 bg-coral/10 p-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-slate-800">{selected.size} produit(s) selectionne(s)</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={exportProducts}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700"
              >
                Exporter tout
              </button>
              <button
                type="button"
                onClick={() => setBulkDeleteOpen(true)}
                className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white"
              >
                Supprimer selection
              </button>
            </div>
          </div>
        ) : null}
      </AdminCard>

      {filtered.length === 0 ? (
        <EmptyState
          title="Aucun produit trouve"
          description="Essayez un autre filtre ou ajoutez un nouveau produit au catalogue."
          action={
            <Link href="/admin/products/new" className="rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white">
              Ajouter un produit
            </Link>
          }
        />
      ) : (
        <AdminTable>
          <AdminTableHead>
            <AdminTh className="w-10">
              <input
                type="checkbox"
                checked={visible.length > 0 && visible.every((product) => selected.has(product.id))}
                onChange={toggleAllVisible}
                className="h-4 w-4 rounded border-slate-300"
                aria-label="Selectionner les produits visibles"
              />
            </AdminTh>
            <AdminTh>Produit</AdminTh>
            <AdminTh>Categorie</AdminTh>
            <AdminTh>Prix</AdminTh>
            <AdminTh>Stock</AdminTh>
            <AdminTh>Images</AdminTh>
            <AdminTh className="text-right">Actions</AdminTh>
          </AdminTableHead>
          <tbody>
            {visible.map((product) => (
              <tr key={product.id} className="border-b border-slate-100 last:border-none hover:bg-slate-50/60">
                <AdminTd>
                  <input
                    type="checkbox"
                    checked={selected.has(product.id)}
                    onChange={() => toggle(product.id)}
                    className="h-4 w-4 rounded border-slate-300"
                    aria-label={`Selectionner ${product.name}`}
                  />
                </AdminTd>
                <AdminTd>
                  <div className="flex min-w-[260px] items-center gap-3">
                    <ProductThumb product={product} />
                    <div className="min-w-0">
                      <p className="truncate font-bold text-slate-950">{product.name}</p>
                      <p className="truncate text-xs text-slate-500">/{product.slug}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {product.bestseller ? <StatusBadge tone="info">Bestseller</StatusBadge> : null}
                        {product.isNew ? <StatusBadge tone="warning">Nouveau</StatusBadge> : null}
                      </div>
                    </div>
                  </div>
                </AdminTd>
                <AdminTd>
                  <span className="rounded-full bg-cream-200 px-3 py-1 text-xs font-bold capitalize text-slate-700">
                    {CATEGORIES.find((item) => item.id === product.category)?.name || product.category}
                  </span>
                </AdminTd>
                <AdminTd>
                  <div className="font-bold text-slate-900">{formatTND(product.price)}</div>
                  {product.oldPrice ? (
                    <div className="text-xs text-slate-400 line-through">{formatTND(product.oldPrice)}</div>
                  ) : null}
                </AdminTd>
                <AdminTd>
                  <StatusBadge tone={product.inStock ? "success" : "danger"}>
                    {product.inStock ? "En stock" : "Rupture"}
                  </StatusBadge>
                </AdminTd>
                <AdminTd>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    <ArrowDownAZ size={13} />
                    {product.images?.length || (getPrimaryProductImage(product) ? 1 : 0)}/5
                  </span>
                </AdminTd>
                <AdminTd className="text-right">
                  <details className="relative inline-block text-left">
                    <summary className="inline-flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50">
                      <MoreHorizontal size={17} />
                    </summary>
                    <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 text-left shadow-lift">
                      <ActionLink href={`/produit/${product.slug}`} label="Voir" icon={<Eye size={14} />} />
                      <ActionLink href={`/admin/products/${product.id}`} label="Modifier" icon={<Pencil size={14} />} />
                      <ActionButton onClick={() => void duplicateProduct(product)} label="Dupliquer" icon={<Copy size={14} />} />
                      <ActionButton onClick={() => setDeleting(product)} label="Supprimer" icon={<Trash2 size={14} />} danger />
                    </div>
                  </details>
                </AdminTd>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-slate-500">
          {filtered.length} produit(s) - page {page} / {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={page === 1}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-45"
          >
            Precedent
          </button>
          <button
            type="button"
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            disabled={page === totalPages}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-45"
          >
            Suivant
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Supprimer le produit"
        message={`Voulez-vous vraiment supprimer ${deleting?.name || "ce produit"} ?`}
        confirmLabel={busy ? "Suppression..." : "Supprimer"}
        danger
        onCancel={() => !busy && setDeleting(null)}
        onConfirm={() => deleting && !busy && removeProduct(deleting.id)}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        title="Supprimer la selection"
        message={`Supprimer ${selected.size} produit(s) selectionne(s) ?`}
        confirmLabel={busy ? "Suppression..." : "Supprimer"}
        danger
        onCancel={() => !busy && setBulkDeleteOpen(false)}
        onConfirm={() => !busy && removeSelected()}
      />

      <Toast message={toast} tone={toastTone} />
    </div>
  );
}

function ProductThumb({ product }: { product: Product }) {
  const image = getPrimaryProductImage(product);
  const tint = PALETTE_HEX[product.palette];

  return (
    <div
      className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-slate-200"
      style={{ background: `linear-gradient(160deg, ${tint.bg}55, ${tint.bg}aa)` }}
    >
      {image ? (
        <Image src={image} alt={product.name} fill unoptimized sizes="56px" className="object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <ToyVisual shape={product.shape} palette={product.palette} size={48} />
        </div>
      )}
    </div>
  );
}

function ActionLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
      {icon}
      {label}
    </Link>
  );
}

function ActionButton({
  onClick,
  label,
  icon,
  danger,
}: {
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold hover:bg-slate-50 ${
        danger ? "text-rose-700" : "text-slate-700"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
