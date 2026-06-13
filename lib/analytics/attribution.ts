"use client";

/**
 * Traffic-source attribution.
 *
 * Captures UTM parameters and the referrer on landing, then derives a
 * normalized source / medium / campaign. Stores:
 *   - first-touch  (localStorage, never overwritten) → where the visitor
 *     originally came from.
 *   - last-touch   (localStorage, overwritten each new campaign session) → the
 *     source of the current visit.
 *
 * These are attached to every analytics event so GA4 / GTM / Meta / TikTok and
 * any dashboard can break traffic down by Facebook / Instagram / TikTok /
 * Google / WhatsApp / Direct / referral. No personal data is stored.
 */

const FIRST_TOUCH_KEY = "mg_first_touch";
const LAST_TOUCH_KEY = "mg_last_touch";

export type Attribution = {
  source: string;
  medium: string;
  campaign?: string;
  content?: string;
  term?: string;
  landing_page?: string;
  referrer?: string;
  timestamp: number;
};

function safeGet(key: string): Attribution | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}

function safeSet(key: string, value: Attribution) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage blocked — ignore */
  }
}

/** Map a referrer hostname to a normalized source when there is no UTM. */
function sourceFromReferrer(referrer: string): { source: string; medium: string } | null {
  if (!referrer) return null;
  let host = "";
  try {
    host = new URL(referrer).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
  if (!host || host === window.location.hostname.replace(/^www\./, "")) return null;

  const map: Array<[RegExp, { source: string; medium: string }]> = [
    [/(^|\.)google\./, { source: "google", medium: "organic" }],
    [/(^|\.)bing\./, { source: "bing", medium: "organic" }],
    [/(^|\.)(facebook|fb)\./, { source: "facebook", medium: "social" }],
    [/(^|\.)instagram\./, { source: "instagram", medium: "social" }],
    [/(^|\.)tiktok\./, { source: "tiktok", medium: "social" }],
    [/(^|\.)(youtube|youtu)\./, { source: "youtube", medium: "social" }],
    [/(^|\.)(whatsapp|wa\.me|l\.wl\.co)/, { source: "whatsapp", medium: "referral" }],
    [/(^|\.)(t\.co|twitter|x)\./, { source: "twitter", medium: "social" }],
    [/(^|\.)(linkedin|lnkd)\./, { source: "linkedin", medium: "social" }],
  ];
  for (const [re, value] of map) {
    if (re.test(host)) return value;
  }
  return { source: host, medium: "referral" };
}

function readCurrentTouch(): Attribution {
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source")?.trim();
  const utmMedium = params.get("utm_medium")?.trim();
  const referrer = document.referrer || "";

  let source = utmSource || "";
  let medium = utmMedium || "";

  if (!source) {
    const fromRef = sourceFromReferrer(referrer);
    if (fromRef) {
      source = fromRef.source;
      medium = medium || fromRef.medium;
    } else {
      source = "(direct)";
      medium = medium || "(none)";
    }
  }

  // Treat common ad click ids as paid even without utm_medium.
  if (!medium || medium === "(none)") {
    if (params.get("gclid") || params.get("wbraid") || params.get("gbraid")) medium = "cpc";
    else if (params.get("fbclid")) medium = "paid_social";
    else if (params.get("ttclid")) medium = "paid_social";
  }

  return {
    source,
    medium: medium || "(none)",
    campaign: params.get("utm_campaign")?.trim() || undefined,
    content: params.get("utm_content")?.trim() || undefined,
    term: params.get("utm_term")?.trim() || undefined,
    landing_page: window.location.pathname,
    referrer: referrer || undefined,
    timestamp: Date.now(),
  };
}

/**
 * Call once on first client render. Persists first/last touch and returns the
 * current attribution for immediate use.
 */
export function captureAttribution(): Attribution {
  const current = readCurrentTouch();

  if (!safeGet(FIRST_TOUCH_KEY)) {
    safeSet(FIRST_TOUCH_KEY, current);
  }

  // Update last-touch only on a genuinely new campaign/source visit (i.e. when
  // there is a UTM or an external referrer), so internal navigation doesn't
  // wipe the originating source.
  const hasNewSource = current.source !== "(direct)";
  if (hasNewSource || !safeGet(LAST_TOUCH_KEY)) {
    safeSet(LAST_TOUCH_KEY, current);
  }

  return current;
}

export function getFirstTouch(): Attribution | null {
  if (typeof window === "undefined") return null;
  return safeGet(FIRST_TOUCH_KEY);
}

export function getLastTouch(): Attribution | null {
  if (typeof window === "undefined") return null;
  return safeGet(LAST_TOUCH_KEY);
}

/** Flat, event-friendly attribution params for analytics payloads. */
export function attributionParams(): Record<string, string> {
  const last = getLastTouch();
  const first = getFirstTouch();
  const out: Record<string, string> = {};
  if (last) {
    out.traffic_source = last.source;
    out.traffic_medium = last.medium;
    if (last.campaign) out.traffic_campaign = last.campaign;
    if (last.content) out.traffic_content = last.content;
    if (last.term) out.traffic_term = last.term;
  }
  if (first) {
    out.first_touch_source = first.source;
    out.first_touch_medium = first.medium;
  }
  return out;
}
