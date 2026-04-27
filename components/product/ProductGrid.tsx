import type { Product } from "@/data/products";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <li key={p.id} className="contents">
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  );
}
