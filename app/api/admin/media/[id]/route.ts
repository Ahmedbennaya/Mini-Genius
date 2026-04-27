import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "@/lib/admin/auth";
import { removeMedia } from "@/lib/admin/storage";

function unauthorized() {
  return NextResponse.json({ ok: false, message: "Non autorise" }, { status: 401 });
}

function isAuthed() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!isAuthed()) return unauthorized();
  await removeMedia(params.id);
  return NextResponse.json({ ok: true });
}
