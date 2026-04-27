import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "@/lib/admin/auth";
import { createCollection, listCollections } from "@/lib/admin/storage";

function unauthorized() {
  return NextResponse.json({ ok: false, message: "Non autorise" }, { status: 401 });
}

function isAuthed() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function GET() {
  if (!isAuthed()) return unauthorized();
  const collections = await listCollections();
  return NextResponse.json({ ok: true, data: collections });
}

export async function POST(req: Request) {
  if (!isAuthed()) return unauthorized();

  try {
    const payload = await req.json();
    const collection = await createCollection(payload);
    return NextResponse.json({ ok: true, data: collection });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Creation impossible" },
      { status: 400 }
    );
  }
}
