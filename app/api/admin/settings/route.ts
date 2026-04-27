import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "@/lib/admin/auth";
import { getSettings, updateSettings } from "@/lib/admin/storage";
import type { AdminSettings } from "@/lib/admin/types";

function unauthorized() {
  return NextResponse.json({ ok: false, message: "Non autorise" }, { status: 401 });
}

function isAuthed() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function GET() {
  if (!isAuthed()) return unauthorized();
  const settings = await getSettings();
  return NextResponse.json({ ok: true, data: settings });
}

export async function PUT(req: Request) {
  if (!isAuthed()) return unauthorized();

  try {
    const payload = (await req.json()) as AdminSettings;
    const settings = await updateSettings(payload);
    return NextResponse.json({ ok: true, data: settings });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Mise a jour impossible" },
      { status: 400 }
    );
  }
}
