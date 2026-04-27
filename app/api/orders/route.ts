import { NextResponse } from "next/server";
import { createOrder } from "@/lib/orders-store";
import {
  isDeliveryMethod,
  isPaymentMethod,
  type CreateOrderInput,
  type OrderItem,
} from "@/lib/orders";

export const dynamic = "force-dynamic";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanItems(value: unknown): OrderItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      const candidate = item as Partial<OrderItem>;
      return {
        id: clean(candidate.id),
        slug: clean(candidate.slug),
        name: clean(candidate.name),
        price: Number(candidate.price) || 0,
        qty: Math.max(1, Number(candidate.qty) || 1),
      };
    })
    .filter((item) => item.id && item.slug && item.name && item.price >= 0);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<CreateOrderInput> & {
      fullName?: string;
    };

    const customerName = clean(body.customerName || body.fullName);
    const phone = clean(body.phone);
    const city = clean(body.city);
    const address = clean(body.address);
    const delivery = isDeliveryMethod(body.delivery) ? body.delivery : "standard";
    const paymentMethod = isPaymentMethod(body.paymentMethod) ? body.paymentMethod : "cod";
    const items = cleanItems(body.items);
    const subtotal =
      Number(body.subtotal) || items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const deliveryFee = Number(body.deliveryFee) || 0;
    const discount = Number(body.discount) || 0;
    const total = Number(body.total) || subtotal + deliveryFee - discount;

    if (!customerName || !phone || !city || !address || !paymentMethod) {
      return NextResponse.json(
        { ok: false, message: "Nom, telephone, ville, adresse et paiement sont requis." },
        { status: 400 }
      );
    }

    if (items.length === 0) {
      return NextResponse.json(
        { ok: false, message: "La commande doit contenir au moins un produit." },
        { status: 400 }
      );
    }

    const order = await createOrder({
      customerName,
      phone,
      email: clean(body.email) || undefined,
      city,
      address,
      notes: clean(body.notes) || undefined,
      delivery,
      items,
      subtotal,
      deliveryFee,
      discount,
      total,
      paymentMethod,
      status: "new",
    });

    return NextResponse.json({ ok: true, data: order }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Commande impossible" },
      { status: 500 }
    );
  }
}
