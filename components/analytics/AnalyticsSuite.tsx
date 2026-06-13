"use client";

import { Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";
import GoogleAnalytics from "./GoogleAnalytics";
import TikTokPixel from "./TikTokPixel";
import ClarityAnalytics from "./ClarityAnalytics";
import AutoEvents from "./AutoEvents";
import ConsentBanner from "./ConsentBanner";
import { captureAttribution } from "@/lib/analytics/attribution";

/**
 * Single mount point for all non-Meta analytics. Meta Pixel stays in its own
 * <MetaPixel/> component so its Conversions-API deduplication is untouched.
 * Nothing loads on /admin. Each platform self-gates on its env-var ID, so with
 * no IDs configured this renders only the (harmless) attribution capture.
 */
export default function AnalyticsSuite() {
  const pathname = usePathname();

  useEffect(() => {
    captureAttribution();
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <Suspense fallback={null}>
        <GoogleAnalytics />
      </Suspense>
      <TikTokPixel />
      <ClarityAnalytics />
      <AutoEvents />
      <ConsentBanner />
    </>
  );
}
