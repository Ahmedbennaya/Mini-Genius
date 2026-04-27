import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ProductForm from "@/components/admin/ProductForm";
import { getProductById } from "@/lib/admin/storage";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  return (
    <div>
      <AdminPageHeader title={`Modifier: ${product.name}`} subtitle="Mettre a jour les informations produit" />
      <ProductForm mode="edit" initial={product} />
    </div>
  );
}
