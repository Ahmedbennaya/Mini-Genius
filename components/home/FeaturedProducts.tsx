import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/product/ProductCard";
import { listProducts } from "@/lib/admin/storage";

export default async function FeaturedProducts() {
  const list = (await listProducts()).slice(0, 8);
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

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {list.map((p, index) => (
          <ProductCard key={p.id} product={p} index={index} compact />
        ))}
      </div>
    </section>
  );
}
