"use client";

import Script from "next/script";
import { CLARITY_ID } from "@/lib/analytics/config";

/**
 * Microsoft Clarity (heatmaps + session recordings).
 * Renders nothing unless NEXT_PUBLIC_CLARITY_ID is set.
 *
 * Clarity automatically masks input field text by default, so no sensitive
 * form values (passwords, payment, personal fields) are recorded.
 */
export default function ClarityAnalytics() {
  if (!CLARITY_ID) return null;

  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`
(function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${CLARITY_ID}");
`}
    </Script>
  );
}
