export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatTND(value: number) {
  return `${value.toFixed(0)} TND`;
}

export const WHATSAPP_NUMBER = "21600000000";

export function whatsappOrderLink(productName?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!productName) return `${base}?text=${encodeURIComponent("Bonjour Mini Genius, je souhaite passer commande.")}`;
  return `${base}?text=${encodeURIComponent(`Bonjour Mini Genius, je souhaite commander : ${productName}`)}`;
}

export function getProductImageUrl(product: {
  name: string;
  image?: string;
  image_url?: string;
  images?: string[];
}) {
  const gallery = Array.isArray(product.images)
    ? product.images.map((image) => image.trim()).filter(Boolean)
    : [];
  const primary = gallery[0] || product.image_url?.trim() || product.image?.trim();
  if (primary) return primary;

  const label = encodeURIComponent(product.name || "Mini Genius");
  return `https://placehold.co/960x960/f8fafc/334155?text=${label}`;
}
