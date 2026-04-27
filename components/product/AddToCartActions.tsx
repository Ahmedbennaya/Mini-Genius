"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, CreditCard, Check } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { buildMetaCatalogData, createMetaEventId, trackMetaEvent } from "@/lib/meta-pixel";
import QuantitySelector from "./QuantitySelector";

export default function AddToCartActions({ product }: { product: Product }) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const trackAddToCart = () => {
    trackMetaEvent(
      "AddToCart",
      buildMetaCatalogData(
        [
          {
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            qty,
          },
        ],
        product.price * qty,
        { contentName: product.name, contentCategory: product.category }
      ),
      {
        eventId: createMetaEventId("AddToCart", product.id),
        sendToServer: true,
      }
    );
  };

  const handleAdd = () => {
    add(product, qty);
    trackAddToCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleBuyNow = () => {
    add(product, qty);
    trackAddToCart();
    router.push("/commande");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <QuantitySelector value={qty} onChange={setQty} />
        <button onClick={handleAdd} className="btn-ghost btn-lg flex-1">
          {added ? <Check size={18} /> : <ShoppingBag size={18} />}
          {added ? "Ajouté !" : "Ajouter au panier"}
        </button>
      </div>
      <button onClick={handleBuyNow} className="btn-coral btn-lg w-full">
        <CreditCard size={18} />
        Commander maintenant
      </button>
    </div>
  );
}
