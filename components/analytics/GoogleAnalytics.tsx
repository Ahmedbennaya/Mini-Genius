"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { CONSENT_COOKIE, CONSENT_DEFAULT, GA4_ID, GTM_ID, USE_GTM } from "@/lib/analytics/config";

/**
 * Loads Google Tag Manager (preferred) or GA4 gtag.js directly, with Google
 * Consent Mode v2 initialised BEFORE any tag fires. Also sends a SPA page_view
 * on client-side route changes (Next App Router doesn't reload the page).
 *
 * Renders nothing unless an ID is configured.
 */

// Consent Mode v2 default + gtag stub. Reads a persisted choice from the
// consent cookie, otherwise uses the configured default. Emitted at the top of
// each loader so the default is always in the dataLayer before the tag library.
const consentBootstrap = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
(function(){
  var m = document.cookie.match(/(?:^|; )${CONSENT_COOKIE}=([^;]+)/);
  var c = m ? decodeURIComponent(m[1]) : '${CONSENT_DEFAULT}';
  var v = (c === 'granted') ? 'granted' : 'denied';
  gtag('consent', 'default', {
    ad_storage: v, analytics_storage: v,
    ad_user_data: v, ad_personalization: v,
    wait_for_update: 500
  });
  gtag('js', new Date());
})();
`;

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPath = useRef<string | null>(null);

  // SPA page_view on route change (the initial view fires from the snippet).
  useEffect(() => {
    if (!GTM_ID && !GA4_ID) return;
    const query = searchParams?.toString();
    const url = query ? `${pathname}?${query}` : pathname || "/";
    if (lastPath.current === url) return;
    if (lastPath.current !== null) {
      if (USE_GTM) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "page_view",
          page_path: url,
          page_location: window.location.href,
        });
      } else if (GA4_ID && typeof window.gtag === "function") {
        window.gtag("event", "page_view", {
          page_path: url,
          page_location: window.location.href,
          page_title: document.title,
        });
      }
    }
    lastPath.current = url;
  }, [pathname, searchParams]);

  if (!GTM_ID && !GA4_ID) return null;

  if (USE_GTM) {
    return (
      <>
        <Script id="gtm-loader" strategy="afterInteractive">
          {`${consentBootstrap}
(function(w,d,s,l,i){w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="gtm"
          />
        </noscript>
      </>
    );
  }

  return (
    <>
      <Script id="ga4-consent" strategy="afterInteractive">
        {consentBootstrap}
      </Script>
      <Script
        id="ga4-loader"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
      />
      <Script id="ga4-config" strategy="afterInteractive">
        {`gtag('config', '${GA4_ID}', { send_page_view: true });`}
      </Script>
    </>
  );
}
