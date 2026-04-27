import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "@/lib/admin/auth";
import { listCoupons, upsertCoupon } from "@/lib/admin/storage";
import type { Coupon } from "@/lib/admin/types";

function unauthorized() {
  return NextResponse.json({ ok: false, message: "Non autorise" }, { status: 401 });
}

function isAuthed() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function GET() {
  if (!isAuthed()) return unauthorized();
  const coupons = await listCoupons();
  return NextResponse.json({ ok: true, data: coupons });
}

export async function POST(req: Request) {
  if (!isAuthed()) return unauthorized();

  try {
    const payload = (await req.json()) as Coupon;
    const code = payload.code?.trim().toUpperCase();
    if (!code) {
      return NextResponse.json({ ok: false, message: "Code manquant" }, { status: 400 });
    }

    const saved = await upsertCoupon(code, payload);
    return NextResponse.json({ ok: true, data: saved });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Impossible de sauvegarder" },
      { status: 400 }
    );
  }
}
