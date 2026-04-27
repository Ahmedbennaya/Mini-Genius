import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "mini_genius_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 10;

function envEmail() {
  return process.env.ADMIN_EMAIL || "admin@minigenius.tn";
}

function envPassword() {
  return process.env.ADMIN_PASSWORD || "change-this-password";
}

function signingSecret() {
  return crypto
    .createHash("sha256")
    .update(`${envEmail()}|${envPassword()}`)
    .digest("hex");
}

function signPayload(payload: string) {
  return crypto.createHmac("sha256", signingSecret()).update(payload).digest("hex");
}

export function validateAdminCredentials(email: string, password: string): boolean {
  const expectedEmail = envEmail().trim().toLowerCase();
  const expectedPassword = envPassword();
  const incomingEmail = email.trim().toLowerCase();

  const hash = (value: string) => crypto.createHash("sha256").update(value).digest();

  const validEmail = crypto.timingSafeEqual(
    hash(incomingEmail),
    hash(expectedEmail)
  );

  const validPassword = crypto.timingSafeEqual(
    hash(password),
    hash(expectedPassword)
  );

  return validEmail && validPassword;
}

export function createSessionToken() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `${envEmail()}|${expiresAt}`;
  const signature = signPayload(payload);
  return Buffer.from(`${payload}|${signature}`).toString("base64url");
}

export function verifySessionToken(token?: string | null): boolean {
  if (!token) return false;

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [email, expRaw, signature] = decoded.split("|");
    if (!email || !expRaw || !signature) return false;

    const payload = `${email}|${expRaw}`;
    const expected = signPayload(payload);

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return false;
    }

    if (email.toLowerCase() !== envEmail().toLowerCase()) return false;

    const exp = Number(expRaw);
    if (!Number.isFinite(exp) || exp <= Math.floor(Date.now() / 1000)) return false;

    return true;
  } catch {
    return false;
  }
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export function getAdminEmail() {
  return envEmail();
}

export { COOKIE_NAME };
