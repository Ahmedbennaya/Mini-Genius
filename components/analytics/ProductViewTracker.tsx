"use client";

import { useEffect, useRef } from "react";
import type { Product } from "@/data/products";
import {
  buildMetaCatalogData,
  createMetaEventId,
  trackMetaEvent,
} from "@/lib/meta-pixel";

type ProductView = Pick<Product, "id" | "name" | "category" | "price">;

export default function ProductViewTracker({ product }: { product: ProductView }) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) return;
    trackedRef.current = true;

    trackMetaEvent(
      "ViewContent",
      buildMetaCatalogData(
        [
          {
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            qty: 1,
          },
        ],
        product.price,
        { contentName: product.name, contentCategory: product.category }
      ),
      {
        eventId: createMetaEventId("ViewContent", product.id),
        sendToServer: true,
      }
    );
  }, [product]);

  return null;
}
