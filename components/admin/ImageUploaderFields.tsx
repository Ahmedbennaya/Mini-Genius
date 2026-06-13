"use client";

import {
  ArrowDown,
  ArrowUp,
  Copy,
  ImageIcon,
  Loader2,
  Move,
  RotateCcw,
  Search,
  Sparkles,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useRef, useState } from "react";
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
  imagePositionX: number;
  onImagePositionXChange: (value: number) => void;
  imagePositionY: number;
  onImagePositionYChange: (value: number) => void;
};

const MAX_IMAGES = 5;
const MAX_IMAGE_SIDE = 1600;

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
  imagePositionX,
  onImagePositionXChange,
  imagePositionY,
  onImagePositionYChange,
}: ImageUploaderFieldsProps) {
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const slots = Array.from({ length: MAX_IMAGES }, (_, index) => images[index] || "");
  const primaryImage = images[0] || "";
  const canAddImages = images.length < MAX_IMAGES;

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

  function clampPercent(value: number) {
    return Math.min(100, Math.max(0, Math.round(value)));
  }

  function readFileAsDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(reader.error || new Error("Lecture image impossible"));
      reader.readAsDataURL(file);
    });
  }

  async function optimizeImageFile(file: File) {
    const source = await readFileAsDataUrl(file);
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Image invalide"));
      img.src = source;
    });

    const width = image.naturalWidth || image.width;
    const height = image.naturalHeight || image.height;
    const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(width, height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));

    const context = canvas.getContext("2d");
    if (!context) return source;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/webp", 0.86);
  }

  async function addFiles(fileList: FileList | File[]) {
    const room = MAX_IMAGES - images.length;
    if (room <= 0) return;

    const files = Array.from(fileList)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, room);

    if (files.length === 0) return;

    setUploading(true);
    try {
      const nextImages = [];
      for (const file of files) {
        nextImages.push(await optimizeImageFile(file));
      }
      onImagesChange([...images, ...nextImages].slice(0, MAX_IMAGES));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function updatePositionFromPointer(event: React.PointerEvent<HTMLDivElement>) {
    if (!primaryImage) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    onImagePositionXChange(clampPercent(x));
    onImagePositionYChange(clampPercent(y));
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

        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_250px]">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.04em] text-slate-500">
              <Move size={14} />
              Position image
            </div>
            <div
              className={cn(
                "relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-2xl border bg-slate-100",
                primaryImage ? "cursor-move border-slate-200" : "border-dashed border-slate-300"
              )}
              style={{
                aspectRatio: `${imageFrameWidth} / ${imageFrameHeight}`,
                maxHeight: 360,
              }}
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                updatePositionFromPointer(event);
              }}
              onPointerMove={(event) => {
                if (event.buttons === 1) updatePositionFromPointer(event);
              }}
            >
              {primaryImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={primaryImage}
                  alt=""
                  draggable={false}
                  className={cn(
                    "h-full w-full select-none",
                    imageFit === "contain" ? "object-contain p-4" : "object-cover"
                  )}
                  style={{ objectPosition: `${imagePositionX}% ${imagePositionY}%` }}
                />
              ) : (
                <ImageIcon size={34} className="text-slate-300" />
              )}
              {primaryImage ? (
                <span
                  className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-coral-deep shadow-soft"
                  style={{ left: `${imagePositionX}%`, top: `${imagePositionY}%` }}
                />
              ) : null}
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.04em] text-slate-500">
                X {imagePositionX}%
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={imagePositionX}
                onChange={(event) => onImagePositionXChange(Number(event.target.value))}
                className="w-full accent-coral-deep"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.04em] text-slate-500">
                Y {imagePositionY}%
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={imagePositionY}
                onChange={(event) => onImagePositionYChange(Number(event.target.value))}
                className="w-full accent-coral-deep"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                onImagePositionXChange(50);
                onImagePositionYChange(50);
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <RotateCcw size={14} />
              Centrer
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "mt-4 rounded-3xl border border-dashed bg-white p-5 text-center transition",
          dragActive ? "border-coral-deep bg-coral/10" : "border-slate-300",
          !canAddImages && "opacity-55"
        )}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          void addFiles(event.dataTransfer.files);
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            if (event.target.files) void addFiles(event.target.files);
          }}
        />
        <button
          type="button"
          disabled={!canAddImages || uploading}
          onClick={() => fileInputRef.current?.click()}
          className="mx-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-55"
        >
          {uploading ? <Loader2 size={17} className="animate-spin" /> : <UploadCloud size={17} />}
          {uploading ? "Import..." : "Glisser ou choisir images"}
        </button>
        <p className="mt-2 text-xs font-semibold text-slate-500">
          JPG, PNG ou WebP. Compression auto avant sauvegarde.
        </p>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="space-y-3">
          {slots.map((value, index) => (
            <label key={index} className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.04em] text-slate-500">
                Image {index + 1}
              </span>
              <div className="flex gap-2">
                <input
                  value={value}
                  onChange={(event) => updateImage(index, event.target.value)}
                  placeholder="https://... ou image importee"
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
                <img
                  src={value}
                  alt=""
                  className="h-full w-full object-cover"
                  style={{ objectPosition: `${imagePositionX}% ${imagePositionY}%` }}
                />
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
