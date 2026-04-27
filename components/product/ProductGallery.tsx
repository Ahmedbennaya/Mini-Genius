"use client";

import ProductImageGallery from "@/components/product/ProductImageGallery";
import type { Palette, Product, ToyShape } from "@/data/products";

type Props = {
  shape: ToyShape;
  palette: Palette;
  image?: string;
  images?: string[];
  productName?: string;
  product?: Product;
};

export default function ProductGallery({
  shape,
  palette,
  image,
  images,
  productName,
  product,
}: Props) {
  const galleryProduct =
    product ||
    ({
      id: "preview",
      slug: "preview",
      name: productName || "Produit",
      shape,
      palette,
      image,
      images,
      age: "",
      ageMin: 0,
      ageMax: 0,
      price: 0,
      rating: 0,
      reviews: 0,
      benefit: "",
      description: "",
      develops: [],
      material: "",
      safety: [],
      category: "montessori",
      inStock: true,
    } satisfies Product);

  return <ProductImageGallery product={galleryProduct} />;
}
