import CollectionsManager from "@/components/admin/CollectionsManager";
import { listCollections, listProducts } from "@/lib/admin/storage";

export default async function CollectionsPage() {
  const [collections, products] = await Promise.all([listCollections(), listProducts()]);

  return <CollectionsManager initialCollections={collections} products={products} />;
}
