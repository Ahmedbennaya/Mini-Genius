"use client";

import Link from "next/link";
import { ShoppingBag, MessageCircle, Truck, ArrowRight, Tag, CreditCard } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { allProducts, type Product } from "@/data/products";
import CartItem from "@/components/cart/CartItem";
import ProductCard from "@/components/product/ProductCard";
import { formatTND, whatsappOrderLink } from "@/lib/utils";

export default function CartPage() {
  const { lines, count, clear } = useCart();

  const items = lines
    .map((l) => {
      const product = allProducts.find((p) => p.id === l.id);
      return product ? { product, qty: l.qty } : null;
    })
    .filter(Boolean) as { product: Product; qty: number }[];

  const subtotal = items.reduce((s, l) => s + l.product.price * l.qty, 0);
  const recommended = allProducts.filter((p) => !lines.find((l) => l.id === p.id)).slice(0, 4);

  if (items.length === 0) {
    return (
      <div className="container-mg py-16">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-cream-300 bg-white p-10 text-center shadow-card">
          <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-cream-200 text-ink-soft">
            <ShoppingBag size={26} />
          </span>
          <h1 className="mt-5 font-display text-3xl font-semibold">Votre panier est vide</h1>
          <p className="mt-2 text-ink-soft">
            Découvrez notre collection de jouets éducatifs choisis avec soin.
          </p>
          <Link href="/collection" className="btn-coral btn-lg mt-7">
            Découvrir la collection
            <ArrowRight size={18} />
          </Link>
        </div>

        <Recommendations products={recommended} />
      </div>
    );
  }

  return (
    <div className="container-mg py-12 sm:py-16">
      <header>
        <span className="eyebrow">Panier</span>
        <h1 className="mt-3 font-display text-[clamp(28px,4vw,46px)] leading-tight">
          Votre panier
        </h1>
        <p className="mt-1 text-ink-soft">
          {count} article{count > 1 ? "s" : ""} dans votre panier
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        <ul className="space-y-4">
          {items.map(({ product, qty }) => (
            <li key={product.id}>
              <CartItem product={product} qty={qty} />
            </li>
          ))}
          <li className="flex justify-between gap-3 pt-2">
            <button
              onClick={clear}
              className="text-sm font-semibold text-ink-soft hover:text-coral-deep"
            >
              Vider le panier
            </button>
            <Link href="/collection" className="text-sm font-semibold text-coral-deep hover:underline">
              Continuer mes achats
            </Link>
          </li>
        </ul>

        <aside className="lg:sticky lg:top-24 self-start">
          <div className="rounded-3xl border border-cream-300 bg-white p-6 shadow-card sm:p-7">
            <h2 className="font-display text-xl font-semibold">Récapitulatif</h2>

            <div className="mt-5 space-y-2.5 text-[15px]">
              <div className="flex justify-between">
                <span className="text-ink-soft">Sous-total</span>
                <span className="font-semibold">{formatTND(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Livraison</span>
                <span className="font-semibold">Calculée à la commande</span>
              </div>
            </div>

            <div className="mt-5 flex items-baseline justify-between border-t border-cream-300 pt-5">
              <span className="font-semibold">Total</span>
              <span className="font-display text-2xl font-semibold">{formatTND(subtotal)}</span>
            </div>

            <Link href="/commande" className="btn-primary btn-lg mt-6 w-full">
              <CreditCard size={18} />
              Passer commande
            </Link>

            <div className="mt-3 rounded-2xl border border-cream-300 bg-cream-100 px-4 py-3 text-sm text-ink-soft">
              <p className="flex items-center gap-2">
                <MessageCircle size={14} className="text-[#25D366]" />
                Besoin d&apos;aide&nbsp;?{" "}
                <a
                  href={whatsappOrderLink()}
                  target="_blank"
                  rel="noopener"
                  className="font-semibold text-ink hover:text-coral-deep"
                >
                  Contactez-nous sur WhatsApp
                </a>
              </p>
            </div>

            <div className="mt-6 space-y-2 text-sm text-ink-soft">
              <p className="flex items-center gap-2">
                <Truck size={14} className="text-coral-deep" />
                Livraison 24–72h partout en Tunisie
              </p>
              <p className="flex items-center gap-2">
                <Tag size={14} className="text-coral-deep" />
                Paiement à la livraison disponible
              </p>
            </div>
          </div>
        </aside>
      </div>

      <Recommendations products={recommended} />
    </div>
  );
}

function Recommendations({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section className="mt-20">
      <h2 className="font-display text-2xl font-semibold sm:text-3xl">Recommandé pour vous</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
