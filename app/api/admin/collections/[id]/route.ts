import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "@/lib/admin/auth";
import { deleteCollection, updateCollection } from "@/lib/admin/storage";

function unauthorized() {
  return NextResponse.json({ ok: false, message: "Non autorise" }, { status: 401 });
}

function isAuthed() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!isAuthed()) return unauthorized();

  try {
    const payload = await req.json();
    const collection = await updateCollection(params.id, payload);
    return NextResponse.json({ ok: true, data: collection });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Mise a jour impossible" },
      { status: 400 }
    );
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!isAuthed()) return unauthorized();

  try {
    await deleteCollection(params.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Suppression impossible" },
      { status: 400 }
    );
  }
}
