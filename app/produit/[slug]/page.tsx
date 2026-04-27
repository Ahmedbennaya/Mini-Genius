import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Truck, ShieldCheck, Sparkles, Star, Check } from "lucide-react";
import { PRODUCTS, getPrimaryProductImage, getProduct, getRelated } from "@/data/products";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import AddToCartActions from "@/components/product/AddToCartActions";
import ProductCard from "@/components/product/ProductCard";
import ProductViewTracker from "@/components/analytics/ProductViewTracker";
import Stars from "@/components/ui/Stars";
import { formatTND } from "@/lib/utils";
import { CATEGORIES } from "@/data/site";
import Reveal from "@/components/motion/Reveal";

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = getProduct(params.slug);
  if (!product) return { title: "Produit introuvable" };
  return {
    title: product.name,
    description: `${product.benefit}. ${product.description.slice(0, 140)}`,
    openGraph: {
      title: product.name,
      description: product.benefit,
      images: getPrimaryProductImage(product) ? [getPrimaryProductImage(product)!] : undefined,
    },
  };
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const related = getRelated(product, 4);
  const catName = CATEGORIES.find((c) => c.id === product.category)?.name ?? "Collection";

  return (
    <div className="container-mg py-10 sm:py-14">
      <ProductViewTracker product={product} />

      {/* Breadcrumb */}
      <Reveal
        as="nav"
        variant="fadeIn"
        ariaLabel="Fil d'ariane"
        className="flex items-center gap-1.5 text-sm text-ink-soft"
      >
        <Link href="/" className="hover:text-ink">Accueil</Link>
        <ChevronRight size={14} />
        <Link href="/collection" className="hover:text-ink">Collection</Link>
        <ChevronRight size={14} />
        <Link href={`/collection?cat=${product.category}`} className="hover:text-ink">
          {catName}
        </Link>
        <ChevronRight size={14} />
        <span className="truncate text-ink">{product.name}</span>
      </Reveal>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <Reveal variant="scaleIn">
          <ProductImageGallery product={product} />
        </Reveal>

        <Reveal>
          <div className="flex flex-wrap items-center gap-2">
            {product.bestseller && (
              <span className="pill bg-ink/90 text-white border-transparent">Bestseller</span>
            )}
            {product.isNew && (
              <span className="pill bg-coral-deep text-white border-transparent">Nouveau</span>
            )}
            <span className="pill">{product.age}</span>
          </div>

          <h1 className="mt-3 font-display text-[clamp(28px,4vw,44px)] leading-tight">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-3 text-sm text-ink-soft">
            <Stars value={product.rating} />
            <span>{product.rating.toFixed(1)}</span>
            <span>·</span>
            <span>{product.reviews} avis</span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-4xl font-semibold">{formatTND(product.price)}</span>
            {product.oldPrice && (
              <span className="text-lg text-ink-mute line-through">{formatTND(product.oldPrice)}</span>
            )}
          </div>

          <p className="mt-5 text-[16.5px] leading-relaxed text-ink-soft">
            {product.description}
          </p>

          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {product.develops.map((d) => (
              <li key={d} className="flex items-center gap-2 text-sm">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-mint text-ink">
                  <Check size={13} />
                </span>
                {d}
              </li>
            ))}
          </ul>

          <div className="mt-7">
            <AddToCartActions product={product} />
          </div>

          {/* Trust row */}
          <div className="mt-7 grid gap-2 rounded-2xl border border-cream-300 bg-white p-4 text-sm sm:grid-cols-2">
            <span className="flex items-center gap-2">
              <Truck size={16} className="text-coral-deep" /> Livraison 24–72h en Tunisie
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-coral-deep" /> Paiement à la livraison
            </span>
          </div>
        </Reveal>
      </div>

      {/* Detail sections */}
      <div className="mt-16 grid gap-5 lg:grid-cols-2">
        <DetailCard
          eyebrow="Pourquoi l'enfant va l'adorer"
          title="Conçu pour captiver, naturellement"
          icon={<Sparkles size={18} />}
        >
          <p>
            Couleurs douces, matières agréables au toucher, gestes simples qui donnent envie de
            recommencer&nbsp;: chaque détail est pensé pour faire durer le jeu et entretenir
            la concentration de l&apos;enfant.
          </p>
        </DetailCard>

        <DetailCard
          eyebrow="Ce qu'il développe"
          title="Compétences clés"
          icon={<Star size={18} />}
        >
          <ul className="space-y-2">
            {product.develops.map((d) => (
              <li key={d} className="flex items-center gap-2 text-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-coral-deep" />
                {d}
              </li>
            ))}
          </ul>
        </DetailCard>

        <DetailCard
          eyebrow="Âge & matière"
          title="Caractéristiques"
          icon={<ShieldCheck size={18} />}
        >
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-ink-soft text-sm">Âge recommandé</dt>
              <dd className="font-semibold">{product.age}</dd>
            </div>
            <div>
              <dt className="text-ink-soft text-sm">Matière</dt>
              <dd className="font-semibold">{product.material}</dd>
            </div>
            <div>
              <dt className="text-ink-soft text-sm">Catégorie</dt>
              <dd className="font-semibold">{catName}</dd>
            </div>
            <div>
              <dt className="text-ink-soft text-sm">Disponibilité</dt>
              <dd className="font-semibold text-mint-deep">
                {product.inStock ? "En stock" : "Rupture"}
              </dd>
            </div>
          </dl>
        </DetailCard>

        <DetailCard
          eyebrow="Conseils de sécurité"
          title="Jouer en toute confiance"
          icon={<ShieldCheck size={18} />}
        >
          <ul className="space-y-2">
            {product.safety.map((s) => (
              <li key={s} className="flex items-start gap-2 text-ink">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-coral-deep" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </DetailCard>

        <DetailCard
          eyebrow="Livraison"
          title="Partout en Tunisie"
          icon={<Truck size={18} />}
        >
          <ul className="space-y-2">
            <li className="flex items-center gap-2"><Check size={14} className="text-mint-deep" /> Livraison 24–72h selon la région</li>
            <li className="flex items-center gap-2"><Check size={14} className="text-mint-deep" /> Paiement à la livraison disponible</li>
            <li className="flex items-center gap-2"><Check size={14} className="text-mint-deep" /> Suivi sur WhatsApp</li>
            <li className="flex items-center gap-2"><Check size={14} className="text-mint-deep" /> Emballage soigné, prêt à offrir</li>
          </ul>
        </DetailCard>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <Reveal as="section" className="mt-20">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Vous pourriez aussi aimer
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, index) => (
              <ProductCard key={p.id} product={p} index={index} />
            ))}
          </div>
        </Reveal>
      )}
    </div>
  );
}

function DetailCard({
  eyebrow,
  title,
  icon,
  children,
}: {
  eyebrow: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Reveal as="article" className="rounded-3xl border border-cream-300 bg-white p-6 shadow-soft sm:p-8">
      <div className="flex items-center gap-2 text-coral-deep">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cream-200">
          {icon}
        </span>
        <span className="text-sm font-semibold uppercase tracking-wider">{eyebrow}</span>
      </div>
      <h3 className="mt-3 font-display text-xl font-semibold">{title}</h3>
      <div className="mt-3 text-ink-soft leading-relaxed">{children}</div>
    </Reveal>
  );
}
