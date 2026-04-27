import "server-only";

import { createHash } from "node:crypto";
import type { Order } from "@/lib/orders";
import { getSiteUrl } from "@/lib/site-url";

const DEFAULT_META_PIXEL_ID = "2015145739108049";
const DEFAULT_API_VERSION = "v25.0";
const DEFAULT_COUNTRY = "tn";
const DEFAULT_CURRENCY = "TND";

type MetaEventInput = {
  eventName: string;
  eventId?: string;
  request: Request;
  eventSourceUrl?: string;
  customData?: Record<string, unknown>;
  user?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    country?: string;
    externalId?: string;
  };
  fbp?: string;
  fbc?: string;
};

type MetaConfig = {
  pixelId: string;
  accessToken: string;
  apiVersion: string;
  testEventCode?: string;
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getMetaConfig(): MetaConfig | null {
  const pixelId =
    clean(process.env.META_PIXEL_ID) ||
    clean(process.env.NEXT_PUBLIC_META_PIXEL_ID) ||
    DEFAULT_META_PIXEL_ID;
  const accessToken =
    clean(process.env.META_CONVERSIONS_ACCESS_TOKEN) ||
    clean(process.env.META_CONVERSIONS_API_ACCESS_TOKEN);

  if (!pixelId || !accessToken) return null;

  const configuredVersion = clean(process.env.META_CONVERSIONS_API_VERSION) || DEFAULT_API_VERSION;
  const apiVersion = configuredVersion.startsWith("v")
    ? configuredVersion
    : `v${configuredVersion}`;

  return {
    pixelId,
    accessToken,
    apiVersion,
    testEventCode: clean(process.env.META_CONVERSIONS_TEST_EVENT_CODE) || undefined,
  };
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function normalizedHash(value: string | undefined) {
  const normalized = value?.trim().toLowerCase().replace(/\s+/g, " ");
  return normalized ? sha256(normalized) : undefined;
}

function normalizePhone(phone: string | undefined) {
  const digits = phone?.replace(/\D/g, "") || "";
  if (!digits) return undefined;
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.length === 8) return `216${digits}`;
  return digits;
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) {
    return { firstName: parts[0], lastName: undefined };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

function parseCookies(header: string | null) {
  const cookies = new Map<string, string>();
  if (!header) return cookies;

  for (const part of header.split(";")) {
    const index = part.indexOf("=");
    if (index < 0) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (!key) continue;
    try {
      cookies.set(key, decodeURIComponent(value));
    } catch {
      cookies.set(key, value);
    }
  }

  return cookies;
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim();

  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    undefined
  );
}

function getEventSourceUrl(request: Request, configured?: string) {
  const candidates = [
    configured,
    request.headers.get("referer") || undefined,
    request.headers.get("origin")
      ? `${request.headers.get("origin")}${new URL(request.url).pathname}`
      : undefined,
    getSiteUrl(),
  ];

  for (const candidate of candidates) {
    try {
      const url = new URL(candidate || "");
      if (url.protocol === "http:" || url.protocol === "https:") {
        return url.toString();
      }
    } catch {
      // Continue to the next candidate.
    }
  }

  return getSiteUrl();
}

function buildUserData(input: MetaEventInput) {
  const cookies = parseCookies(input.request.headers.get("cookie"));
  const userData: Record<string, string> = {};
  const ip = getClientIp(input.request);
  const userAgent = input.request.headers.get("user-agent") || undefined;
  const fbp = clean(input.fbp) || cookies.get("_fbp");
  const fbc = clean(input.fbc) || cookies.get("_fbc");
  const country =
    clean(input.user?.country) || clean(process.env.META_CUSTOMER_COUNTRY) || DEFAULT_COUNTRY;

  if (ip) userData.client_ip_address = ip;
  if (userAgent) userData.client_user_agent = userAgent;
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;

  const email = normalizedHash(input.user?.email);
  const phone = normalizedHash(normalizePhone(input.user?.phone));
  const firstName = normalizedHash(input.user?.firstName);
  const lastName = normalizedHash(input.user?.lastName);
  const city = normalizedHash(input.user?.city);
  const hashedCountry = normalizedHash(country);
  const externalId = normalizedHash(input.user?.externalId);

  if (email) userData.em = email;
  if (phone) userData.ph = phone;
  if (firstName) userData.fn = firstName;
  if (lastName) userData.ln = lastName;
  if (city) userData.ct = city;
  if (hashedCountry) userData.country = hashedCountry;
  if (externalId) userData.external_id = externalId;

  return userData;
}

function getCurrency() {
  return (
    clean(process.env.META_CURRENCY) ||
    clean(process.env.NEXT_PUBLIC_META_CURRENCY) ||
    DEFAULT_CURRENCY
  );
}

function getOrderCustomData(order: Order) {
  const items = order.items.map((item) => ({
    id: item.id,
    quantity: item.qty,
    item_price: Number(item.price.toFixed(2)),
  }));

  return {
    currency: getCurrency(),
    value: Number(order.total.toFixed(2)),
    order_id: order.reference,
    content_type: "product",
    content_ids: order.items.map((item) => item.id),
    contents: items,
    num_items: order.items.reduce((sum, item) => sum + item.qty, 0),
  };
}

export async function sendMetaConversionsEvent(input: MetaEventInput) {
  const config = getMetaConfig();
  if (!config) return { skipped: true };

  const event: Record<string, unknown> = {
    event_name: input.eventName,
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    event_source_url: getEventSourceUrl(input.request, input.eventSourceUrl),
    user_data: buildUserData(input),
    custom_data: input.customData || {},
  };

  if (input.eventId) event.event_id = input.eventId;

  const body: Record<string, unknown> = { data: [event] };
  if (config.testEventCode) body.test_event_code = config.testEventCode;

  const endpoint = new URL(
    `https://graph.facebook.com/${config.apiVersion}/${config.pixelId}/events`
  );
  endpoint.searchParams.set("access_token", config.accessToken);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(endpoint.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: controller.signal,
    });
    const text = await response.text();
    const payload = text ? JSON.parse(text) : null;

    if (!response.ok) {
      const message =
        payload?.error?.message || payload?.message || "Meta Conversions API request failed";
      throw new Error(message);
    }

    return { skipped: false, payload };
  } finally {
    clearTimeout(timeout);
  }
}

export async function sendMetaPurchaseEvent(
  request: Request,
  order: Order,
  meta: { fbp?: string; fbc?: string; eventSourceUrl?: string } = {}
) {
  const name = splitName(order.customerName);

  return sendMetaConversionsEvent({
    eventName: "Purchase",
    eventId: order.reference,
    request,
    eventSourceUrl: meta.eventSourceUrl,
    fbp: meta.fbp,
    fbc: meta.fbc,
    user: {
      email: order.email,
      phone: order.phone,
      firstName: name.firstName,
      lastName: name.lastName,
      city: order.city,
      country: clean(process.env.META_CUSTOMER_COUNTRY) || DEFAULT_COUNTRY,
    },
    customData: getOrderCustomData(order),
  });
}
