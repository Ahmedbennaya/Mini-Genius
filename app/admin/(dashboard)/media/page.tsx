"use client";

import { useMemo, useState } from "react";
import { ImagePlus, Images, Save, Trash2, TriangleAlert } from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import EmptyState from "@/components/admin/EmptyState";
import ImageUploaderFields from "@/components/admin/ImageUploaderFields";
import SearchInput from "@/components/admin/SearchInput";
import StatusBadge from "@/components/admin/StatusBadge";
import Toast from "@/components/admin/Toast";
import mediaData from "@/data/admin/media.json";
import catalog from "@/data/catalog.json";
import { getProductImageFrame, getProductImages, normalizeProducts, type Product } from "@/data/products";
import type { MediaAsset } from "@/lib/admin/types";

export default function MediaPage() {
  const [media, setMedia] = useState<MediaAsset[]>(mediaData as MediaAsset[]);
  const [products, setProducts] = useState<Product[]>(normalizeProducts(catalog as Product[]));
  const [query, setQuery] = useState("");
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", url: "", kind: "image" as "image" | "video" });
  const [toast, setToast] = useState<string | null>(null);
  const [toastTone, setToastTone] = useState<"success" | "error">("success");

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(q) ||
        product.slug.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q)
    );
  }, [products, query]);

  const missingImages = products.filter((product) => getProductImages(product).length === 0).length;

  function showToast(message: string, tone: "success" | "error" = "success") {
    setToast(message);
    setToastTone(tone);
    setTimeout(() => setToast(null), 2200);
  }

  async function add() {
    if (!form.name || !form.url) return;
    const response = await fetch("/api/admin/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, sizeKb: 300 }),
    });
    if (!response.ok) {
      showToast("Ajout impossible.", "error");
      return;
    }
    const result = (await response.json()) as { ok: boolean; data: MediaAsset };
    if (result.ok) {
      setMedia((prev) => [result.data, ...prev]);
      setForm({ name: "", url: "", kind: "image" });
      showToast("Media ajoute.");
    }
  }

  async function removeAsset(id: string) {
    await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    setMedia((prev) => prev.filter((item) => item.id !== id));
    setRemoveId(null);
    showToast("Media supprime.");
  }

  async function saveProductImages(product: Product) {
    const response = await fetch(`/api/admin/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      showToast("Sauvegarde produit impossible.", "error");
      return;
    }
    const result = (await response.json()) as { ok: boolean; data?: Product; message?: string };
    if (!result.ok || !result.data) {
      showToast(result.message || "Sauvegarde produit impossible.", "error");
      return;
    }
    setProducts((prev) => prev.map((item) => (item.id === result.data!.id ? result.data! : item)));
    showToast("Images produit sauvegardees.");
  }

  function updateProduct(id: string, patch: Partial<Product>) {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id !== id) return product;
        const images = patch.images ?? product.images ?? [];
        const primary = images[0];
        return {
          ...product,
          ...patch,
          images,
          image: primary || undefined,
          image_url: primary || undefined,
        };
      })
    );
  }

  return (
    <div>
      <AdminPageHeader title="Medias" subtitle="Bibliotheque et gestion des 5 images par produit." />

      <section className="mb-5 grid gap-4 md:grid-cols-3">
        <AdminCard title="Produits" icon={<Images size={18} />}>
          <p className="text-3xl font-semibold text-slate-950">{products.length}</p>
        </AdminCard>
        <AdminCard title="Images manquantes" icon={<TriangleAlert size={18} />}>
          <p className="text-3xl font-semibold text-slate-950">{missingImages}</p>
        </AdminCard>
        <AdminCard title="Bibliotheque" icon={<ImagePlus size={18} />}>
          <p className="text-3xl font-semibold text-slate-950">{media.length}</p>
        </AdminCard>
      </section>

      <AdminCard title="Ajouter un media" description="Conservez aussi les assets de campagnes ou inspirations.">
        <div className="grid gap-3 sm:grid-cols-3">
          <Input label="Nom" value={form.name} onChange={(value) => setForm((s) => ({ ...s, name: value }))} />
          <Input label="URL" value={form.url} onChange={(value) => setForm((s) => ({ ...s, url: value }))} />
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.04em] text-slate-500">Type</span>
            <select
              value={form.kind}
              onChange={(e) => setForm((s) => ({ ...s, kind: e.target.value as "image" | "video" }))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </label>
        </div>
        <button
          type="button"
          onClick={add}
          className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
        >
          <ImagePlus size={16} />
          Ajouter
        </button>
      </AdminCard>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {media.map((asset) => (
          <article key={asset.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
            <div className="aspect-[16/10] bg-slate-100">
              {asset.kind === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={asset.url} alt={asset.name} className="h-full w-full object-cover" />
              ) : (
                <video src={asset.url} className="h-full w-full object-cover" controls />
              )}
            </div>
            <div className="p-4">
              <p className="font-semibold text-slate-900">{asset.name}</p>
              <p className="mt-1 text-xs text-slate-500">{asset.sizeKb} KB</p>
              <button
                type="button"
                onClick={() => setRemoveId(asset.id)}
                className="mt-3 inline-flex items-center gap-1 rounded-xl border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50"
              >
                <Trash2 size={13} />
                Supprimer
              </button>
            </div>
          </article>
        ))}
      </section>

      <AdminCard
        className="mt-6"
        title="Images produits"
        description="Controlez les galeries produit, prompts et requetes image depuis un seul endroit."
      >
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Rechercher produit, slug, categorie..."
          className="mb-5"
        />

        <div className="grid gap-5">
          {filteredProducts.map((product) => (
            <ProductMediaEditor
              key={product.id}
              product={product}
              onChange={(patch) => updateProduct(product.id, patch)}
              onSave={() => saveProductImages(product)}
            />
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <EmptyState title="Aucun produit" description="Aucun produit ne correspond a votre recherche." />
        ) : null}
      </AdminCard>

      <ConfirmDialog
        open={Boolean(removeId)}
        title="Supprimer media"
        message="Cette action supprimera le media de la bibliotheque."
        danger
        onCancel={() => setRemoveId(null)}
        onConfirm={() => removeId && removeAsset(removeId)}
      />

      <Toast message={toast} tone={toastTone} />
    </div>
  );
}

function ProductMediaEditor({
  product,
  onChange,
  onSave,
}: {
  product: Product;
  onChange: (patch: Partial<Product>) => void;
  onSave: () => void;
}) {
  const images = getProductImages(product);
  const imageFrame = getProductImageFrame(product);
  const missing = images.length === 0;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-slate-950">{product.name}</h3>
            <StatusBadge tone={missing ? "danger" : "success"}>
              {missing ? "Image manquante" : `${images.length}/5 images`}
            </StatusBadge>
          </div>
          <p className="mt-1 text-xs text-slate-500">/{product.slug}</p>
        </div>
        <button
          type="button"
          onClick={onSave}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          <Save size={16} />
          Sauvegarder
        </button>
      </div>

      <ImageUploaderFields
        images={images}
        onImagesChange={(next) => onChange({ images: next })}
        imagePrompt={product.imagePrompt || ""}
        onImagePromptChange={(imagePrompt) => onChange({ imagePrompt })}
        imageSearchQuery={product.imageSearchQuery || ""}
        onImageSearchQueryChange={(imageSearchQuery) => onChange({ imageSearchQuery })}
        imageFrameWidth={imageFrame.width}
        onImageFrameWidthChange={(imageFrameWidth) => onChange({ imageFrameWidth })}
        imageFrameHeight={imageFrame.height}
        onImageFrameHeightChange={(imageFrameHeight) => onChange({ imageFrameHeight })}
        imageFit={imageFrame.fit}
        onImageFitChange={(imageFit) => onChange({ imageFit })}
      />
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.04em] text-slate-500">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none ring-coral-deep/15 transition focus:border-coral-deep/60 focus:ring-4"
      />
    </label>
  );
}
