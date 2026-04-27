import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "@/lib/admin/auth";
import { updateOrderStatus } from "@/lib/admin/storage";
import type { AdminOrderStatus } from "@/lib/admin/types";

function unauthorized() {
  return NextResponse.json({ ok: false, message: "Non autorise" }, { status: 401 });
}

function isAuthed() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function PATCH(req: Request, { params }: { params: { reference: string } }) {
  if (!isAuthed()) return unauthorized();
  try {
    const body = (await req.json()) as { status?: AdminOrderStatus };
    if (!body.status) {
      return NextResponse.json({ ok: false, message: "Statut manquant" }, { status: 400 });
    }
    const updated = await updateOrderStatus(params.reference, body.status);
    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Mise a jour impossible" },
      { status: 400 }
    );
  }
}
