"use client";

import { ArrowDown, ArrowUp, Copy, ImageIcon, Search, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ImageUploaderFieldsProps = {
  images: string[];
  onImagesChange: (images: string[]) => void;
  imagePrompt: string;
  onImagePromptChange: (value: string) => void;
  imageSearchQuery: string;
  onImageSearchQueryChange: (value: string) => void;
  imageFrameWidth: number;
  onImageFrameWidthChange: (value: number) => void;
  imageFrameHeight: number;
  onImageFrameHeightChange: (value: number) => void;
  imageFit: "cover" | "contain";
  onImageFitChange: (value: "cover" | "contain") => void;
};

const MAX_IMAGES = 5;

export default function ImageUploaderFields({
  images,
  onImagesChange,
  imagePrompt,
  onImagePromptChange,
  imageSearchQuery,
  onImageSearchQueryChange,
  imageFrameWidth,
  onImageFrameWidthChange,
  imageFrameHeight,
  onImageFrameHeightChange,
  imageFit,
  onImageFitChange,
}: ImageUploaderFieldsProps) {
  const [copied, setCopied] = useState(false);
  const slots = Array.from({ length: MAX_IMAGES }, (_, index) => images[index] || "");

  function updateImage(index: number, value: string) {
    const next = [...slots];
    next[index] = value;
    onImagesChange(next.map((image) => image.trim()).filter(Boolean).slice(0, MAX_IMAGES));
  }

  function removeImage(index: number) {
    onImagesChange(slots.filter((_, slotIndex) => slotIndex !== index).filter(Boolean));
  }

  function moveImage(index: number, direction: -1 | 1) {
    const current = slots.filter(Boolean);
    const nextIndex = index + direction;
    if (!current[index] || nextIndex < 0 || nextIndex >= current.length) return;
    const next = [...current];
    const [item] = next.splice(index, 1);
    next.splice(nextIndex, 0, item);
    onImagesChange(next.slice(0, MAX_IMAGES));
  }

  async function copyPrompt() {
    if (!imagePrompt.trim() || typeof navigator === "undefined") return;
    await navigator.clipboard?.writeText(imagePrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-base font-semibold text-slate-950">
            <ImageIcon size={18} className="text-coral-deep" />
            Images produit
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Ajoutez 1 a 5 images. La premiere image devient le visuel principal.
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500 shadow-soft">
          {images.length}/{MAX_IMAGES}
        </span>
      </div>

      <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-950">Taille du cadre image</h4>
            <p className="mt-1 text-xs text-slate-500">
              Controle le format d'affichage sur les cartes produit et les apercus. Exemple: 1080 x 1080.
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            {imageFrameWidth} x {imageFrameHeight}
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.04em] text-slate-500">
              Largeur px
            </span>
            <input
              type="number"
              min={240}
              max={4000}
              step={10}
              value={imageFrameWidth}
              onChange={(event) => onImageFrameWidthChange(Number(event.target.value))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-coral-deep/15 transition focus:border-coral-deep/60 focus:ring-4"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.04em] text-slate-500">
              Hauteur px
            </span>
            <input
              type="number"
              min={240}
              max={4000}
              step={10}
              value={imageFrameHeight}
              onChange={(event) => onImageFrameHeightChange(Number(event.target.value))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-coral-deep/15 transition focus:border-coral-deep/60 focus:ring-4"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.04em] text-slate-500">
              Ajustement
            </span>
            <select
              value={imageFit}
              onChange={(event) => onImageFitChange(event.target.value as "cover" | "contain")}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-coral-deep/15 transition focus:border-coral-deep/60 focus:ring-4"
            >
              <option value="cover">Remplir / crop premium</option>
              <option value="contain">Afficher entier</option>
            </select>
          </label>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {[
            [1080, 1080],
            [1200, 1200],
            [1600, 1200],
            [1200, 1600],
          ].map(([width, height]) => (
            <button
              key={`${width}-${height}`}
              type="button"
              onClick={() => {
                onImageFrameWidthChange(width);
                onImageFrameHeightChange(height);
              }}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-white"
            >
              {width} x {height}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="space-y-3">
          {slots.map((value, index) => (
            <label key={index} className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.04em] text-slate-500">
                Image {index + 1} URL
              </span>
              <div className="flex gap-2">
                <input
                  value={value}
                  onChange={(event) => updateImage(index, event.target.value)}
                  placeholder="https://..."
                  className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-coral-deep/15 transition focus:border-coral-deep/60 focus:ring-4"
                />
                <button
                  type="button"
                  onClick={() => moveImage(index, -1)}
                  disabled={index === 0 || !value}
                  className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:text-slate-900 disabled:opacity-35 sm:inline-flex"
                  aria-label="Monter image"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(index, 1)}
                  disabled={index >= images.length - 1 || !value}
                  className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:text-slate-900 disabled:opacity-35 sm:inline-flex"
                  aria-label="Descendre image"
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  disabled={!value}
                  className="h-11 w-11 shrink-0 rounded-2xl border border-rose-200 bg-white text-rose-600 transition hover:bg-rose-50 disabled:opacity-35"
                  aria-label="Retirer image"
                >
                  <Trash2 className="mx-auto" size={16} />
                </button>
              </div>
            </label>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-2">
          {slots.map((value, index) => (
            <div
              key={index}
              className={cn(
                "relative aspect-square overflow-hidden rounded-2xl border bg-white",
                value ? "border-slate-200" : "border-dashed border-slate-300"
              )}
            >
              {value ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={value} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-300">
                  <ImageIcon size={22} />
                </div>
              )}
              <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-bold text-slate-600 shadow-soft">
                {index + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.04em] text-slate-500">
            <Sparkles size={14} />
            Image prompt
          </span>
          <textarea
            value={imagePrompt}
            onChange={(event) => onImagePromptChange(event.target.value)}
            rows={4}
            placeholder="Prompt image pour generer un visuel produit coherent..."
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-coral-deep/15 transition focus:border-coral-deep/60 focus:ring-4"
          />
          <button
            type="button"
            onClick={copyPrompt}
            disabled={!imagePrompt.trim()}
            className="mt-2 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
          >
            <Copy size={14} />
            {copied ? "Copie" : "Copier le prompt"}
          </button>
        </label>

        <label className="block">
          <span className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.04em] text-slate-500">
            <Search size={14} />
            Image search query
          </span>
          <textarea
            value={imageSearchQuery}
            onChange={(event) => onImageSearchQueryChange(event.target.value)}
            rows={4}
            placeholder="Requete de recherche image, ex: jouet montessori bois pastel..."
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-coral-deep/15 transition focus:border-coral-deep/60 focus:ring-4"
          />
        </label>
      </div>
    </section>
  );
}
