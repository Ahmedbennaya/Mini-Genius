import { NextResponse } from "next/server";
import { listProducts } from "@/lib/admin/storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const products = await listProducts();
  return NextResponse.json(
    { ok: true, data: products },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
