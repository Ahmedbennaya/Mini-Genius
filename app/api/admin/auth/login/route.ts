import { NextResponse } from "next/server";
import {
  COOKIE_NAME,
  adminCookieOptions,
  createSessionToken,
  validateAdminCredentials,
} from "@/lib/admin/auth";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; password?: string };
    const email = body.email || "";
    const password = body.password || "";

    if (!validateAdminCredentials(email, password)) {
      return NextResponse.json(
        { ok: false, message: "Identifiants invalides" },
        { status: 401 }
      );
    }

    const token = createSessionToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(COOKIE_NAME, token, adminCookieOptions());
    return response;
  } catch {
    return NextResponse.json({ ok: false, message: "Requete invalide" }, { status: 400 });
  }
}
