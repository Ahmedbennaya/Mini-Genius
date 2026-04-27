import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "@/lib/admin/auth";
import { deleteCoupon } from "@/lib/admin/storage";

function unauthorized() {
  return NextResponse.json({ ok: false, message: "Non autorise" }, { status: 401 });
}

function isAuthed() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function DELETE(_: Request, { params }: { params: { code: string } }) {
  if (!isAuthed()) return unauthorized();
  await deleteCoupon(params.code);
  return NextResponse.json({ ok: true });
}
