import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "@/lib/admin/auth";
import { createProduct, listProducts } from "@/lib/admin/storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function unauthorized() {
  return NextResponse.json(
    { ok: false, message: "Non autorise" },
    { status: 401, headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}

function isAuthed() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function GET() {
  if (!isAuthed()) return unauthorized();
  const products = await listProducts();
  return NextResponse.json(
    { ok: true, data: products },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}

export async function POST(req: Request) {
  if (!isAuthed()) return unauthorized();

  try {
    const payload = await req.json();
    const product = await createProduct(payload);
    return NextResponse.json({ ok: true, data: product });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Creation impossible" },
      { status: 400 }
    );
  }
}
