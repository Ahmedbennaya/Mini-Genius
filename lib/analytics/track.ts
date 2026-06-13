"use client";

import { GA4_ID, TIKTOK_PIXEL_ID, USE_GTM } from "./config";
import { attributionParams } from "./attribution";

type Params = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    ttq?: {
      track: (event: string, params?: Params) => void;
      page: () => void;
      instance?: (id: string) => unknown;
      load?: (id: string) => void;
    };
    clarity?: (...args: unknown[]) => void;
  }
}

/** TikTok uses its own standard-event vocabulary; map GA4 names across. */
const TIKTOK_EVENT_MAP: Record<string, string> = {
  view_item: "ViewContent",
  add_to_cart: "AddToCart",
  remove_from_cart: "RemoveFromCart",
  begin_checkout: "InitiateCheckout",
  add_payment_info: "AddPaymentInfo",
  purchase: "CompletePayment",
  search: "Search",
  generate_lead: "Contact",
  contact: "Contact",
  add_to_wishlist: "AddToWishlist",
  sign_up: "CompleteRegistration",
};

/**
 * Single dispatch point for a custom/GA4-style event.
 *
 * Routing rules (avoids any double counting):
 *  - Always pushes to window.dataLayer so Google Tag Manager can pick it up.
 *  - When GTM is NOT configured, also calls gtag() directly for GA4 and ttq()
 *    directly for TikTok. When GTM IS configured, GTM owns tag routing and we
 *    do not fire gtag/ttq here (you wire GA4/TikTok tags inside GTM instead).
 *
 * Attribution (traffic_source / medium / campaign…) is merged into every event.
 */
export function track(eventName: string, params: Params = {}) {
  if (typeof window === "undefined") return;

  const payload = { ...attributionParams(), ...params };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...payload });

  if (!USE_GTM) {
    if (GA4_ID && typeof window.gtag === "function") {
      window.gtag("event", eventName, payload);
    }
    if (TIKTOK_PIXEL_ID && window.ttq) {
      const tiktokName = TIKTOK_EVENT_MAP[eventName];
      if (tiktokName) window.ttq.track(tiktokName, params as Params);
    }
  }
}

/* ----------------------------- Consent Mode ----------------------------- */

export type ConsentState = "granted" | "denied";

/**
 * Update Google Consent Mode v2 + Meta + TikTok consent in one place.
 * Called by the consent banner. Safe to call before any tag loads.
 */
export function applyConsent(state: ConsentState) {
  if (typeof window === "undefined") return;

  // Google Consent Mode v2
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      ad_storage: state,
      analytics_storage: state,
      ad_user_data: state,
      ad_personalization: state,
    });
  }

  // Meta Pixel consent
  if (typeof window.fbq === "function") {
    window.fbq("consent", state === "granted" ? "grant" : "revoke");
  }

  // TikTok does not expose a granular consent API; gate by (un)loading instead.
  // When denied we simply stop sending events (handled by the banner unmount).
}
