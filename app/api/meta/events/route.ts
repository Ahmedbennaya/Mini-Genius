import { NextResponse } from "next/server";
import { sendMetaConversionsEvent } from "@/lib/meta-conversions";

export const dynamic = "force-dynamic";

const ALLOWED_EVENTS = new Set([
  "PageView",
  "ViewContent",
  "Search",
  "AddToWishlist",
  "AddToCart",
  "InitiateCheckout",
  "Contact",
]);

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function finiteNumber(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function cleanStringArray(value: unknown) {
  if (!Array.isArray(value)) return undefined;

  const items = value
    .map((item) => clean(item))
    .filter(Boolean)
    .slice(0, 50);

  return items.length > 0 ? items : undefined;
}

function cleanContents(value: unknown) {
  if (!Array.isArray(value)) return undefined;

  const items = value
    .map((item) => {
      const candidate = item as Record<string, unknown>;
      const id = clean(candidate.id);
      const quantity = Math.max(1, finiteNumber(candidate.quantity) || 1);
      const itemPrice = finiteNumber(candidate.item_price);

      if (!id) return null;

      return {
        id,
        quantity,
        item_price: itemPrice && itemPrice > 0 ? itemPrice : 0,
      };
    })
    .filter(Boolean)
    .slice(0, 50);

  return items.length > 0 ? items : undefined;
}

function sanitizeCustomData(value: unknown) {
  const data = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const result: Record<string, unknown> = {};
  const currency = clean(data.currency).toUpperCase();
  const contentName = clean(data.content_name);
  const contentCategory = clean(data.content_category);
  const contentType = clean(data.content_type);
  const orderId = clean(data.order_id);
  const searchString = clean(data.search_string);
  const valueNumber = finiteNumber(data.value);
  const numItems = finiteNumber(data.num_items);
  const contentIds = cleanStringArray(data.content_ids);
  const contents = cleanContents(data.contents);

  if (currency) result.currency = currency.slice(0, 3);
  if (typeof valueNumber === "number") result.value = Math.max(0, valueNumber);
  if (contentName) result.content_name = contentName.slice(0, 200);
  if (contentCategory) result.content_category = contentCategory.slice(0, 100);
  if (contentType) result.content_type = contentType.slice(0, 50);
  if (orderId) result.order_id = orderId.slice(0, 100);
  if (searchString) result.search_string = searchString.slice(0, 100);
  if (typeof numItems === "number") result.num_items = Math.max(0, Math.round(numItems));
  if (contentIds) result.content_ids = contentIds;
  if (contents) result.contents = contents;

  return result;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const eventName = clean(body.eventName);
    const eventId = clean(body.eventId);
    const meta =
      body.meta && typeof body.meta === "object"
        ? (body.meta as Record<string, unknown>)
        : {};

    if (!ALLOWED_EVENTS.has(eventName)) {
      return NextResponse.json(
        { ok: false, message: "Evenement Meta non autorise." },
        { status: 400 }
      );
    }

    if (!eventId) {
      return NextResponse.json({ ok: false, message: "eventId est requis." }, { status: 400 });
    }

    const result = await sendMetaConversionsEvent({
      eventName,
      eventId,
      request: req,
      eventSourceUrl: clean(meta.eventSourceUrl),
      fbp: clean(meta.fbp),
      fbc: clean(meta.fbc),
      customData: sanitizeCustomData(body.customData),
    });

    return NextResponse.json({ ok: true, skipped: result.skipped === true });
  } catch (error) {
    console.error("Meta Conversions event failed", error);
    return NextResponse.json(
      { ok: false, message: "Evenement Meta non envoye." },
      { status: 502 }
    );
  }
}
