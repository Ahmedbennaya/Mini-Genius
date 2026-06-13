"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  ChevronRight,
  CreditCard,
  Truck,
  ShieldCheck,
  Package,
  Phone,
  MapPin,
  Mail,
  ArrowRight,
  Home,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { allProducts, type Product } from "@/data/products";
import { PALETTE_HEX } from "@/data/site";
import ToyVisual from "@/components/ui/ToyVisual";
import { formatTND } from "@/lib/utils";
import {
  DELIVERY_OPTIONS,
  PAYMENT_METHODS,
  type PaymentMethod,
  type Order,
} from "@/lib/orders";
import {
  buildMetaCatalogData,
  createMetaEventId,
  getMetaEventContext,
  trackMetaEvent,
} from "@/lib/meta-pixel";

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes: string;
  delivery: "standard" | "express";
  paymentMethod: PaymentMethod;
};

const INITIAL: FormState = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  address: "",
  notes: "",
  delivery: "standard",
  paymentMethod: "cod",
};

export default function CheckoutPage() {
  const { lines, clear } = useCart();
  const checkoutTrackedRef = useRef(false);
  const [products, setProducts] = useState<Product[]>(allProducts);

  const items = useMemo(
    () =>
      lines
        .map((l) => {
          const product = products.find((p) => p.id === l.id);
          return product ? { product, qty: l.qty } : null;
        })
        .filter(Boolean) as { product: Product; qty: number }[],
    [lines, products]
  );

  const subtotal = items.reduce((s, it) => s + it.product.price * it.qty, 0);

  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  useEffect(() => {
    let ignore = false;

    fetch("/api/products", { cache: "no-store" })
      .then((response) => response.json())
      .then((result: { ok?: boolean; data?: Product[] }) => {
        if (!ignore && result.ok && result.data) setProducts(result.data);
      })
      .catch(() => undefined);

    return () => {
      ignore = true;
    };
  }, []);

  const deliveryDef =
    DELIVERY_OPTIONS.find((d) => d.id === form.delivery) ?? DELIVERY_OPTIONS[0];
  const total = subtotal + deliveryDef.fee;
  const metaItems = useMemo(
    () =>
      items.map((it) => ({
        id: it.product.id,
        name: it.product.name,
        category: it.product.category,
        price: it.product.price,
        qty: it.qty,
      })),
    [items]
  );

  useEffect(() => {
    if (checkoutTrackedRef.current || metaItems.length === 0) return;
    checkoutTrackedRef.current = true;

    trackMetaEvent(
      "InitiateCheckout",
      buildMetaCatalogData(metaItems, total),
      {
        eventId: createMetaEventId("InitiateCheckout", "cart"),
        sendToServer: true,
      }
    );
  }, [metaItems, total]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setSubmitError(null);
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) next.fullName = "Le nom complet est requis.";
    if (!form.phone.trim()) next.phone = "Le numéro de téléphone est requis.";
    else if (!/^[\d\s+()-]{6,}$/.test(form.phone))
      next.phone = "Numéro de téléphone invalide.";
    if (!form.city.trim()) next.city = "La ville est requise.";
    if (!form.address.trim()) next.address = "L'adresse complète est requise.";
    if (!form.paymentMethod) next.paymentMethod = "Le mode de paiement est requis.";
    // Email is OPTIONAL — only validate format if provided.
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Email invalide.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    if (!validate()) {
      // scroll to first error
      const firstKey = Object.keys(errors)[0];
      if (firstKey) {
        document.getElementById(`field-${firstKey}`)?.focus();
      }
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const payload = {
      customerName: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      city: form.city.trim(),
      address: form.address.trim(),
      notes: form.notes.trim() || undefined,
      delivery: form.delivery,
      items: items.map((it) => ({
        id: it.product.id,
        slug: it.product.slug,
        name: it.product.name,
        price: it.product.price,
        qty: it.qty,
      })),
      subtotal,
      deliveryFee: deliveryDef.fee,
      total,
      paymentMethod: form.paymentMethod,
      meta: getMetaEventContext(),
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { ok?: boolean; data?: Order; message?: string };

      if (!response.ok || !result.ok || !result.data) {
        throw new Error(result.message || "Commande impossible pour le moment.");
      }

      const order = result.data;
      trackMetaEvent(
        "Purchase",
        buildMetaCatalogData(
          order.items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            qty: item.qty,
          })),
          order.total,
          { orderId: order.reference }
        ),
        { eventId: order.reference, sendToServer: false }
      );
      clear();
      setConfirmedOrder(order);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Commande impossible pour le moment.");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmedOrder) {
    return <OrderConfirmation order={confirmedOrder} />;
  }

  if (items.length === 0) {
    return (
      <div className="container-mg py-16">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-cream-300 bg-white p-10 text-center shadow-card">
          <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-cream-200 text-ink-soft">
            <ShoppingBag size={26} />
          </span>
          <h1 className="mt-5 font-display text-3xl font-semibold">Aucun article à commander</h1>
          <p className="mt-2 text-ink-soft">
            Votre panier est vide. Ajoutez des produits avant de passer à la commande.
          </p>
          <Link href="/collection" className="btn-coral btn-lg mt-7">
            Découvrir la collection
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-mg py-12 sm:py-16">
      <nav className="flex items-center gap-1.5 text-sm text-ink-soft" aria-label="Fil d'ariane">
        <Link href="/" className="hover:text-ink">Accueil</Link>
        <ChevronRight size={14} />
        <Link href="/panier" className="hover:text-ink">Panier</Link>
        <ChevronRight size={14} />
        <span className="text-ink">Commande</span>
      </nav>

      <header className="mt-6">
        <span className="eyebrow">Finaliser la commande</span>
        <h1 className="mt-3 font-display text-[clamp(28px,4vw,46px)] leading-tight">
          Vos informations de livraison
        </h1>
        <p className="mt-2 text-ink-soft">
          Remplissez le formulaire ci-dessous. Notre équipe vous contactera pour confirmer la commande.
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          noValidate
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-3xl border border-cream-300 bg-white p-6 shadow-card sm:p-8"
        >
          <h2 className="font-display text-xl font-semibold">Coordonnées du client</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Les champs marqués <span className="text-coral-deep">*</span> sont obligatoires. L&apos;email est optionnel.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field
              id="field-fullName"
              label="Nom complet"
              required
              value={form.fullName}
              onChange={(v) => setField("fullName", v)}
              error={errors.fullName}
              placeholder="Ahmed Ben Ali"
              autoComplete="name"
            />
            <Field
              id="field-phone"
              label="Téléphone"
              required
              type="tel"
              value={form.phone}
              onChange={(v) => setField("phone", v)}
              error={errors.phone}
              placeholder="+216 52 338 194"
              autoComplete="tel"
              icon={<Phone size={16} />}
            />
            <Field
              id="field-email"
              label="Email (optionnel)"
              type="email"
              value={form.email}
              onChange={(v) => setField("email", v)}
              error={errors.email}
              placeholder="exemple@email.com"
              autoComplete="email"
              icon={<Mail size={16} />}
            />
            <Field
              id="field-city"
              label="Ville"
              required
              value={form.city}
              onChange={(v) => setField("city", v)}
              error={errors.city}
              placeholder="Tunis, Sfax, Sousse..."
              autoComplete="address-level2"
            />
            <div className="sm:col-span-2">
              <Field
                id="field-address"
                label="Adresse complète"
                required
                value={form.address}
                onChange={(v) => setField("address", v)}
                error={errors.address}
                placeholder="Rue, immeuble, code postal..."
                autoComplete="street-address"
                icon={<MapPin size={16} />}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="field-notes" className="mb-1.5 block text-sm font-semibold text-ink-soft">
                Notes de commande (optionnel)
              </label>
              <textarea
                id="field-notes"
                value={form.notes}
                onChange={(e) => setField("notes", e.target.value)}
                placeholder="Précisions sur la livraison, créneau préféré..."
                className="input min-h-[110px] resize-y"
              />
            </div>
          </div>

          {/* Delivery options */}
          <h3 className="mt-9 font-display text-lg font-semibold">Mode de livraison</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {DELIVERY_OPTIONS.map((d) => {
              const active = form.delivery === d.id;
              return (
                <label
                  key={d.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                    active
                      ? "border-coral-deep bg-coral/10 shadow-soft"
                      : "border-cream-300 bg-white hover:border-ink/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={d.id}
                    checked={active}
                    onChange={() => setField("delivery", d.id)}
                    className="sr-only"
                  />
                  <span
                    className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      active ? "border-coral-deep bg-coral-deep" : "border-cream-300"
                    }`}
                  >
                    {active && <Check size={12} className="text-white" />}
                  </span>
                  <span className="flex-1">
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-ink">{d.label}</span>
                      <span className="font-semibold text-ink">{formatTND(d.fee)}</span>
                    </span>
                    <span className="block text-sm text-ink-soft">{d.desc}</span>
                  </span>
                </label>
              );
            })}
          </div>

          <h3 className="mt-9 font-display text-lg font-semibold">Mode de paiement</h3>
          <div className="mt-3 grid gap-3">
            {PAYMENT_METHODS.slice(0, 1).map((method) => {
              const active = form.paymentMethod === method.id;
              return (
                <label
                  key={method.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                    active
                      ? "border-coral-deep bg-coral/10 shadow-soft"
                      : "border-cream-300 bg-white hover:border-ink/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={active}
                    onChange={() => setField("paymentMethod", method.id)}
                    className="sr-only"
                    required
                  />
                  <span
                    className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      active ? "border-coral-deep bg-coral-deep" : "border-cream-300"
                    }`}
                  >
                    {active && <Check size={12} className="text-white" />}
                  </span>
                  <span>
                    <span className="font-semibold text-ink">{method.label}</span>
                    <span className="block text-sm text-ink-soft">{method.desc}</span>
                  </span>
                </label>
              );
            })}
            {errors.paymentMethod ? (
              <p className="text-sm text-coral-deep">{errors.paymentMethod}</p>
            ) : null}
          </div>

          <div className="mt-9 flex flex-col gap-3">
            {submitError ? (
              <p className="rounded-2xl border border-coral-deep/20 bg-coral/10 px-4 py-3 text-sm font-semibold text-coral-deep">
                {submitError}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary btn-lg w-full disabled:opacity-60"
            >
              <CreditCard size={18} />
              {submitting ? "Confirmation en cours…" : "Confirmer la commande"}
            </button>
            <p className="flex items-center justify-center gap-2 text-sm text-ink-soft">
              <ShieldCheck size={14} className="text-coral-deep" />
              Paiement à la livraison · Aucun paiement en ligne requis
            </p>
          </div>
        </motion.form>

        {/* Order summary */}
        <aside className="lg:sticky lg:top-24 self-start">
          <div className="rounded-3xl border border-cream-300 bg-white p-6 shadow-card sm:p-7">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
              <Package size={18} className="text-coral-deep" />
              Récapitulatif de commande
            </h2>

            <ul className="mt-5 space-y-3">
              {items.map(({ product, qty }) => {
                const tint = PALETTE_HEX[product.palette];
                return (
                  <li key={product.id} className="flex items-center gap-3">
                    <span
                      className="relative inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: `linear-gradient(160deg, ${tint.bg}55, ${tint.bg}aa)` }}
                    >
                      <ToyVisual shape={product.shape} palette={product.palette} size={48} />
                      <span className="absolute -top-1.5 -right-1.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-ink px-1 text-[11px] font-semibold text-white">
                        {qty}
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink">
                        {product.name}
                      </span>
                      <span className="block text-xs text-ink-soft">{product.age}</span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold">
                      {formatTND(product.price * qty)}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-5 space-y-2.5 border-t border-cream-300 pt-5 text-[15px]">
              <div className="flex justify-between">
                <span className="text-ink-soft">Sous-total</span>
                <span className="font-semibold">{formatTND(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Livraison</span>
                <span className="font-semibold">{formatTND(deliveryDef.fee)}</span>
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between border-t border-cream-300 pt-4">
              <span className="font-semibold">Total</span>
              <span className="font-display text-2xl font-semibold">{formatTND(total)}</span>
            </div>

            <div className="mt-6 space-y-2 text-sm text-ink-soft">
              <p className="flex items-center gap-2">
                <Truck size={14} className="text-coral-deep" />
                Livraison partout en Tunisie
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-coral-deep" />
                Paiement à la livraison disponible
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  required = false,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
  icon,
}: {
  id: string;
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink-soft">
        {label}
        {required && <span className="text-coral-deep"> *</span>}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute">
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className={`input ${icon ? "pl-11" : ""} ${
            error ? "border-coral-deep focus:ring-coral-deep/20" : ""
          }`}
        />
      </div>
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-sm text-coral-deep">
          {error}
        </p>
      )}
    </div>
  );
}

function OrderConfirmation({ order }: { order: Order }) {
  return (
    <div className="container-mg py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl"
      >
        <div className="rounded-[2rem] border border-cream-300 bg-white p-8 text-center shadow-card sm:p-12">
          <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-mint text-ink shadow-soft">
            <Check size={28} strokeWidth={2.5} />
          </span>
          <h1 className="mt-5 font-display text-[clamp(26px,3.6vw,40px)] leading-tight">
            Commande confirmée
          </h1>
          <p className="mt-3 text-ink-soft">
            Votre commande a été confirmée avec succès. Notre équipe vous contactera bientôt.
          </p>

          <div className="mt-7 inline-flex flex-col items-center gap-1 rounded-2xl border border-cream-300 bg-cream-100 px-6 py-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Référence de commande
            </span>
            <span className="font-display text-2xl font-semibold tracking-wide">
              {order.reference}
            </span>
          </div>

          <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
            <SummaryBlock title="Livraison">
              <p className="font-semibold">{order.customerName}</p>
              <p>{order.phone}</p>
              <p>{order.address}</p>
              <p>{order.city}</p>
            </SummaryBlock>
            <SummaryBlock title="Total">
              <p className="font-display text-2xl font-semibold">{formatTND(order.total)}</p>
              <p className="text-sm text-ink-soft">
                {order.items.reduce((s, i) => s + i.qty, 0)} article(s) · Paiement à la livraison
              </p>
            </SummaryBlock>
          </div>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/" className="btn-ghost btn-lg sm:flex-1">
              <Home size={18} />
              Retour à l&apos;accueil
            </Link>
            <Link href="/collection" className="btn-coral btn-lg sm:flex-1">
              Continuer mes achats
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function SummaryBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-cream-300 bg-cream-100 p-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-ink-soft">{title}</div>
      <div className="mt-2 space-y-0.5 text-sm text-ink">{children}</div>
    </div>
  );
}
