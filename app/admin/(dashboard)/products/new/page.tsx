import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <AdminPageHeader
        title="Nouveau produit"
        subtitle="Ajouter un produit au catalogue"
      />
      <ProductForm mode="create" />
    </div>
  );
}
