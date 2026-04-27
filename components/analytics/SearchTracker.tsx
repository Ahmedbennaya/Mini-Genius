"use client";

import { useEffect, useRef } from "react";
import { createMetaEventId, trackMetaEvent } from "@/lib/meta-pixel";

export default function SearchTracker({
  query,
  resultCount,
}: {
  query: string;
  resultCount: number;
}) {
  const lastTrackedRef = useRef("");
  const normalizedQuery = query.trim();

  useEffect(() => {
    if (!normalizedQuery || lastTrackedRef.current === normalizedQuery) return;
    lastTrackedRef.current = normalizedQuery;

    trackMetaEvent(
      "Search",
      {
        search_string: normalizedQuery,
        content_type: "product",
        num_items: resultCount,
      },
      {
        eventId: createMetaEventId("Search", normalizedQuery),
        sendToServer: true,
      }
    );
  }, [normalizedQuery, resultCount]);

  return null;
}
