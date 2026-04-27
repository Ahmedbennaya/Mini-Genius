import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { PRODUCTS } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";

export default function FeaturedProducts() {
  const list = PRODUCTS.slice(0, 8);
  return (
    <section className="container-mg py-14 sm:py-20 lg:py-24">
      <SectionHeading
        eyebrow="Nos coups de cœur"
        title="Produits populaires"
        description="Une sélection des jouets préférés des familles tunisiennes — qualité testée, livraison rapide."
        action={
          <Link href="/collection" className="btn-ghost">
            Toute la collection
            <ArrowUpRight size={16} />
          </Link>
        }
      />

      <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p, index) => (
          <ProductCard key={p.id} product={p} index={index} />
        ))}
      </div>
    </section>
  );
}
