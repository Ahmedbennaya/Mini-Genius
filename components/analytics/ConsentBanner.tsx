"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CONSENT_COOKIE, CONSENT_DEFAULT } from "@/lib/analytics/config";
import { applyConsent, type ConsentState } from "@/lib/analytics/track";

/**
 * Lightweight cookie-consent banner wired to Google Consent Mode v2 + Meta +
 * TikTok consent. Default model is configured via NEXT_PUBLIC_CONSENT_DEFAULT
 * (granted = opt-out, denied = opt-in). The choice is stored for 12 months.
 */

function readCookie(name: string) {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : "";
}

function writeCookie(name: string, value: string) {
  const maxAge = 60 * 60 * 24 * 365; // 1 year
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = readCookie(CONSENT_COOKIE) as ConsentState | "";
    if (saved === "granted" || saved === "denied") {
      applyConsent(saved);
      return;
    }
    // No stored choice: reflect the configured default and show the banner.
    applyConsent(CONSENT_DEFAULT);
    setVisible(true);
  }, []);

  const choose = (state: ConsentState) => {
    writeCookie(CONSENT_COOKIE, state);
    applyConsent(state);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Préférences de confidentialité"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-2xl border border-cream-300 bg-white/95 p-4 shadow-card backdrop-blur sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <p className="text-sm leading-relaxed text-ink-soft">
          Nous utilisons des cookies pour mesurer l&apos;audience et améliorer votre
          expérience. Aucune donnée sensible (paiement, mot de passe) n&apos;est collectée.{" "}
          <Link href="/a-propos#privacy" className="font-semibold text-coral-deep underline">
            En savoir plus
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="btn-ghost btn-sm whitespace-nowrap"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="btn-coral btn-sm whitespace-nowrap"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
