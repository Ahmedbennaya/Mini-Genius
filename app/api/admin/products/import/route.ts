import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "@/lib/admin/auth";
import { replaceProducts } from "@/lib/admin/storage";
import type { ProductInput } from "@/lib/admin/types";

function unauthorized() {
  return NextResponse.json({ ok: false, message: "Non autorise" }, { status: 401 });
}

function isAuthed() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function POST(req: Request) {
  if (!isAuthed()) return unauthorized();

  try {
    const payload = (await req.json()) as { products?: ProductInput[] } | ProductInput[];
    const products = Array.isArray(payload) ? payload : payload.products;
    if (!products || products.length === 0) throw new Error("No products found in import");
    const saved = await replaceProducts(products);
    return NextResponse.json({ ok: true, data: saved });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Import impossible" },
      { status: 400 }
    );
  }
}
