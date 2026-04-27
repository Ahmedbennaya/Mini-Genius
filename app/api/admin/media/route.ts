import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "@/lib/admin/auth";
import { addMedia, listMedia } from "@/lib/admin/storage";
import type { MediaAsset } from "@/lib/admin/types";

function unauthorized() {
  return NextResponse.json({ ok: false, message: "Non autorise" }, { status: 401 });
}

function isAuthed() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function GET() {
  if (!isAuthed()) return unauthorized();
  const media = await listMedia();
  return NextResponse.json({ ok: true, data: media });
}

export async function POST(req: Request) {
  if (!isAuthed()) return unauthorized();

  try {
    const payload = (await req.json()) as Omit<MediaAsset, "id" | "createdAt">;
    const id = `media-${Date.now()}`;
    const asset: MediaAsset = {
      ...payload,
      id,
      createdAt: new Date().toISOString(),
      sizeKb: Number(payload.sizeKb) || 250,
      kind: payload.kind === "video" ? "video" : "image",
    };

    const saved = await addMedia(asset);
    return NextResponse.json({ ok: true, data: saved });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Ajout impossible" },
      { status: 400 }
    );
  }
}
