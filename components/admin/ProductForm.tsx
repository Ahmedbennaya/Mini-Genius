"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Eye, Save } from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import ImageUploaderFields from "@/components/admin/ImageUploaderFields";
import {
  getPrimaryProductImage,
  getProductImageFrame,
  getProductImages,
  type Product,
} from "@/data/products";
import { CATEGORIES } from "@/data/site";
import { formatTND } from "@/lib/utils";

type ProductFormProps = {
  mode: "create" | "edit";
  initial?: Product;
};

const CATEGORY_OPTIONS: Product["category"][] = [
  "montessori",
  "stem",
  "sensoriel",
  "puzzles",
  "construction",
  "cadeaux",
];

const PALETTE_OPTIONS: Product["palette"][] = ["mint", "sky", "coral", "butter", "lavender"];
const SHAPE_OPTIONS: Product["shape"][] = [
  "puzzle",
  "cube",
  "blocks",
  "board",
  "balls",
  "rocket",
  "cards",
  "gift",
  "ring",
  "ball",
];

export default function ProductForm({ mode, initial }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState(() => ({
    id: initial?.id || "",
    slug: initial?.slug || "",
    name: initial?.name || "",
    images: getProductImages(initial || ({} as Product)),
    imagePrompt: initial?.imagePrompt || "",
    imageSearchQuery: initial?.imageSearchQuery || "",
    imageFrameWidth: getProductImageFrame(initial || ({} as Product)).width,
    imageFrameHeight: getProductImageFrame(initial || ({} as Product)).height,
    imageFit: getProductImageFrame(initial || ({} as Product)).fit,
    age: initial?.age || "",
    ageMin: initial?.ageMin ?? 2,
    ageMax: initial?.ageMax ?? 6,
    price: initial?.price ?? 0,
    oldPrice: initial?.oldPrice ?? 0,
    rating: initial?.rating ?? 4.8,
    reviews: initial?.reviews ?? 0,
    benefit: initial?.benefit || "",
    description: initial?.description || "",
    develops: (initial?.develops || []).join(", "),
    material: initial?.material || "",
    safety: (initial?.safety || []).join("\n"),
    category: initial?.category || "montessori",
    palette: initial?.palette || "mint",
    shape: initial?.shape || "puzzle",
    inStock: initial?.inStock ?? true,
    isNew: initial?.isNew ?? false,
    bestseller: initial?.bestseller ?? false,
  }));

  const payload = useMemo(() => {
    const images = form.images.map((image) => image.trim()).filter(Boolean).slice(0, 5);
    const primary = images[0];
    const develops = form.develops
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    const safety = form.safety
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

    return {
      id: form.id,
      slug: form.slug,
      name: form.name,
      image: primary || undefined,
      image_url: primary || undefined,
      images: images.length > 0 ? images : undefined,
      imagePrompt: form.imagePrompt || undefined,
      imageSearchQuery: form.imageSearchQuery || undefined,
      imageFrameWidth: Number(form.imageFrameWidth) || 1080,
      imageFrameHeight: Number(form.imageFrameHeight) || 1080,
      imageFit: form.imageFit,
      age: form.age,
      ageMin: Number(form.ageMin),
      ageMax: Number(form.ageMax),
      price: Number(form.price),
      oldPrice: Number(form.oldPrice) || undefined,
      rating: Number(form.rating),
      reviews: Number(form.reviews),
      benefit: form.benefit,
      description: form.description,
      develops,
      material: form.material,
      safety,
      category: form.category,
      palette: form.palette,
      shape: form.shape,
      inStock: form.inStock,
      isNew: form.isNew,
      bestseller: form.bestseller,
    };
  }, [form]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setLoading(true);

    const endpoint = mode === "create" ? "/api/admin/products" : `/api/admin/products/${initial?.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as { ok: boolean; message?: string };

    if (!response.ok || !result.ok) {
      setError(result.message || "Sauvegarde impossible");
      setLoading(false);
      return;
    }

    setLoading(false);
    setSaved(true);
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-5">
        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </div>
        ) : null}

        {saved ? (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            <CheckCircle2 size={17} />
            Produit sauvegarde.
          </div>
        ) : null}

        <AdminCard title="Informations produit" description="Base commerciale visible sur le site.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nom" value={form.name} onChange={(value) => setForm((s) => ({ ...s, name: value }))} required />
            <Field label="Slug" value={form.slug} onChange={(value) => setForm((s) => ({ ...s, slug: value }))} required />
            {mode === "create" ? (
              <Field label="ID" value={form.id} onChange={(value) => setForm((s) => ({ ...s, id: value }))} required />
            ) : null}
            <Field label="Age" value={form.age} onChange={(value) => setForm((s) => ({ ...s, age: value }))} required />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-4">
            <Field label="Age min" type="number" value={String(form.ageMin)} onChange={(value) => setForm((s) => ({ ...s, ageMin: Number(value) }))} />
            <Field label="Age max" type="number" value={String(form.ageMax)} onChange={(value) => setForm((s) => ({ ...s, ageMax: Number(value) }))} />
            <Field label="Prix" type="number" value={String(form.price)} onChange={(value) => setForm((s) => ({ ...s, price: Number(value) }))} />
            <Field label="Ancien prix" type="number" value={String(form.oldPrice)} onChange={(value) => setForm((s) => ({ ...s, oldPrice: Number(value) }))} />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Rating" type="number" step="0.1" value={String(form.rating)} onChange={(value) => setForm((s) => ({ ...s, rating: Number(value) }))} />
            <Field label="Avis" type="number" value={String(form.reviews)} onChange={(value) => setForm((s) => ({ ...s, reviews: Number(value) }))} />
          </div>
        </AdminCard>

        <AdminCard title="Storytelling" description="Promesse, description et details rassurants.">
          <Field
            label="Benefice court"
            value={form.benefit}
            onChange={(value) => setForm((s) => ({ ...s, benefit: value }))}
            required
          />

          <div className="mt-4">
            <TextArea
              label="Description"
              value={form.description}
              onChange={(value) => setForm((s) => ({ ...s, description: value }))}
            />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field
              label="Develops (separes par virgule)"
              value={form.develops}
              onChange={(value) => setForm((s) => ({ ...s, develops: value }))}
            />
            <Field
              label="Materiau"
              value={form.material}
              onChange={(value) => setForm((s) => ({ ...s, material: value }))}
            />
          </div>

          <div className="mt-4">
            <TextArea
              label="Securite (une ligne par item)"
              value={form.safety}
              onChange={(value) => setForm((s) => ({ ...s, safety: value }))}
            />
          </div>
        </AdminCard>

        <AdminCard title="Organisation" description="Classement catalogue et mise en avant.">
          <div className="grid gap-4 sm:grid-cols-3">
            <Select
              label="Categorie"
              value={form.category}
              onChange={(value) => setForm((s) => ({ ...s, category: value as Product["category"] }))}
              options={CATEGORY_OPTIONS}
            />
            <Select
              label="Palette"
              value={form.palette}
              onChange={(value) => setForm((s) => ({ ...s, palette: value as Product["palette"] }))}
              options={PALETTE_OPTIONS}
            />
            <Select
              label="Forme fallback"
              value={form.shape}
              onChange={(value) => setForm((s) => ({ ...s, shape: value as Product["shape"] }))}
              options={SHAPE_OPTIONS}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-4">
            <Checkbox label="En stock" checked={form.inStock} onChange={(checked) => setForm((s) => ({ ...s, inStock: checked }))} />
            <Checkbox label="Nouveau" checked={form.isNew} onChange={(checked) => setForm((s) => ({ ...s, isNew: checked }))} />
            <Checkbox label="Bestseller" checked={form.bestseller} onChange={(checked) => setForm((s) => ({ ...s, bestseller: checked }))} />
          </div>
        </AdminCard>

        <ImageUploaderFields
          images={form.images}
          onImagesChange={(images) => setForm((s) => ({ ...s, images }))}
          imagePrompt={form.imagePrompt}
          onImagePromptChange={(imagePrompt) => setForm((s) => ({ ...s, imagePrompt }))}
          imageSearchQuery={form.imageSearchQuery}
          onImageSearchQueryChange={(imageSearchQuery) => setForm((s) => ({ ...s, imageSearchQuery }))}
          imageFrameWidth={form.imageFrameWidth}
          onImageFrameWidthChange={(imageFrameWidth) => setForm((s) => ({ ...s, imageFrameWidth }))}
          imageFrameHeight={form.imageFrameHeight}
          onImageFrameHeightChange={(imageFrameHeight) => setForm((s) => ({ ...s, imageFrameHeight }))}
          imageFit={form.imageFit}
          onImageFitChange={(imageFit) => setForm((s) => ({ ...s, imageFit }))}
        />
      </div>

      <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
        <AdminCard title="Apercu carte" icon={<Eye size={18} />}>
          <PreviewCard product={payload as Product} />
        </AdminCard>

        <AdminCard>
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              <Save size={16} />
              {loading ? "Sauvegarde..." : mode === "create" ? "Creer produit" : "Mettre a jour"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Annuler
            </button>
          </div>
        </AdminCard>
      </aside>
    </form>
  );
}

function PreviewCard({ product }: { product: Product }) {
  const image = getPrimaryProductImage(product);
  const imageFrame = getProductImageFrame(product);
  const categoryName = CATEGORIES.find((category) => category.id === product.category)?.name || product.category;

  return (
    <article className="overflow-hidden rounded-3xl border border-cream-300 bg-white shadow-soft">
      <div className="relative bg-cream-200" style={{ aspectRatio: imageFrame.aspectRatio }}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            className={`h-full w-full ${imageFrame.fit === "contain" ? "object-contain p-3" : "object-cover"}`}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-400">
            ToyVisual fallback
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-slate-600 shadow-soft">
          {categoryName}
        </span>
      </div>
      <div className="p-4">
        <p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-500">{product.age || "Age"}</p>
        <h3 className="mt-1 text-base font-semibold text-slate-950">{product.name || "Nom du produit"}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
          {product.benefit || "Benefice court du produit."}
        </p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-semibold text-slate-950">{formatTND(Number(product.price) || 0)}</span>
          {product.oldPrice ? (
            <span className="text-sm text-slate-400 line-through">{formatTND(product.oldPrice)}</span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  step,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.04em] text-slate-500">{label}</span>
      <input
        type={type}
        step={step}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none ring-coral-deep/15 transition focus:border-coral-deep/60 focus:ring-4"
      />
    </label>
  );
}

function TextArea({
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
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none ring-coral-deep/15 transition focus:border-coral-deep/60 focus:ring-4"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.04em] text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none ring-coral-deep/15 transition focus:border-coral-deep/60 focus:ring-4"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-soft">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-coral-deep focus:ring-coral-deep/30"
      />
      {label}
    </label>
  );
}
