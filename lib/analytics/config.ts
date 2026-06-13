/**
 * Central analytics configuration. Every ID is read from a public env var and
 * is OPTIONAL — a platform only loads when its ID is present. With no IDs set
 * (the default), nothing extra loads, so this is safe to ship before you have
 * accounts. Add the IDs in Vercel → Settings → Environment Variables later.
 */

export const GTM_ID = (process.env.NEXT_PUBLIC_GTM_ID || "").trim();
export const GA4_ID = (process.env.NEXT_PUBLIC_GA4_ID || "").trim();
export const TIKTOK_PIXEL_ID = (process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || "").trim();
export const CLARITY_ID = (process.env.NEXT_PUBLIC_CLARITY_ID || "").trim();

export const CURRENCY = (process.env.NEXT_PUBLIC_META_CURRENCY || "TND").trim();

/**
 * Consent model.
 *  - "granted" (default): opt-out banner. Tracking is active immediately and a
 *    banner lets visitors decline. Keeps current Meta behaviour and ad
 *    performance. Recommended for a Tunisia-focused store.
 *  - "denied": opt-in banner (EU/GDPR style). Nothing tracks until the visitor
 *    accepts. Switch to this by setting NEXT_PUBLIC_CONSENT_DEFAULT=denied.
 */
export const CONSENT_DEFAULT: "granted" | "denied" =
  (process.env.NEXT_PUBLIC_CONSENT_DEFAULT || "granted").trim() === "denied"
    ? "denied"
    : "granted";

export const CONSENT_COOKIE = "mg_consent";

/** True when any Google tag (GTM or GA4) should load. */
export const HAS_GOOGLE = Boolean(GTM_ID || GA4_ID);

/** When GTM is present it owns tag routing; we only push to the dataLayer. */
export const USE_GTM = Boolean(GTM_ID);
