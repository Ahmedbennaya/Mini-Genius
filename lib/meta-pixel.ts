"use client";

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "2015145739108049";
export const META_CURRENCY = process.env.NEXT_PUBLIC_META_CURRENCY || "TND";

export type MetaStandardEvent =
  | "PageView"
  | "ViewContent"
  | "Search"
  | "AddToWishlist"
  | "AddToCart"
  | "InitiateCheckout"
  | "Contact"
  | "Purchase";

export type MetaEventContext = {
  eventSourceUrl?: string;
  fbp?: string;
  fbc?: string;
};

export type MetaCatalogItem = {
  id: string;
  slug?: string;
  name?: string;
  category?: string;
  price: number;
  qty?: number;
};

export type MetaCustomData = {
  currency?: string;
  value?: number;
  content_name?: string;
  content_category?: string;
  content_type?: string;
  content_ids?: string[];
  contents?: Array<{
    id: string;
    quantity: number;
    item_price: number;
  }>;
  num_items?: number;
  order_id?: string;
  search_string?: string;
};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function cleanId(value: string | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

function readCookie(name: string) {
  if (typeof document === "undefined") return undefined;
  const prefix = `${name}=`;
  const cookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : undefined;
}

function getFallbackFbc() {
  if (typeof window === "undefined") return undefined;
  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  if (!fbclid) return undefined;
  return `fb.1.${Date.now()}.${fbclid}`;
}

export function createMetaEventId(eventName: MetaStandardEvent, key?: string) {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return [eventName, key, suffix].filter(Boolean).join(":");
}

export function getMetaEventContext(): MetaEventContext {
  if (typeof window === "undefined") return {};

  return {
    eventSourceUrl: window.location.href,
    fbp: readCookie("_fbp"),
    fbc: readCookie("_fbc") || getFallbackFbc(),
  };
}

export function buildMetaCatalogData(
  items: MetaCatalogItem[],
  value: number,
  options: { contentName?: string; contentCategory?: string; orderId?: string } = {}
): MetaCustomData {
  const normalized = items
    .map((item) => ({
      id: cleanId(item.id || item.slug),
      name: item.name?.trim(),
      category: item.category?.trim(),
      price: Number(item.price) || 0,
      qty: Math.max(1, Number(item.qty) || 1),
    }))
    .filter((item) => item.id);

  const first = normalized[0];
  const totalItems = normalized.reduce((sum, item) => sum + item.qty, 0);
  const safeValue = Number.isFinite(value) ? Math.max(0, Number(value.toFixed(2))) : 0;

  return {
    currency: META_CURRENCY,
    value: safeValue,
    content_name: options.contentName || first?.name,
    content_category: options.contentCategory || first?.category,
    content_type: "product",
    content_ids: normalized.map((item) => item.id),
    contents: normalized.map((item) => ({
      id: item.id,
      quantity: item.qty,
      item_price: Number(item.price.toFixed(2)),
    })),
    num_items: totalItems || undefined,
    order_id: options.orderId,
  };
}

function postServerEvent(
  eventName: MetaStandardEvent,
  eventId: string,
  customData: MetaCustomData
) {
  if (typeof window === "undefined") return;

  void fetch("/api/meta/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    keepalive: true,
    body: JSON.stringify({
      eventName,
      eventId,
      customData,
      meta: getMetaEventContext(),
    }),
  }).catch(() => undefined);
}

export function trackMetaEvent(
  eventName: MetaStandardEvent,
  customData: MetaCustomData = {},
  options: { eventId?: string; sendToServer?: boolean } = {}
) {
  const eventId = options.eventId || createMetaEventId(eventName);

  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", eventName, customData, { eventID: eventId });
  }

  if (options.sendToServer) {
    postServerEvent(eventName, eventId, customData);
  }

  return eventId;
}
