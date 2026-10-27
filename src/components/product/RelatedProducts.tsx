import React from "react";
import { Product } from "../../data/defaultCatalog.ts";
import { ProductCard } from "./ProductCard.tsx";

interface RelatedProductsProps {
  currentProductId: string;
  categorySlug: string;
  allProducts: Product[];
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProductId,
  categorySlug,
  allProducts,
}) => {
  const related = allProducts
    .filter((p) => p.id !== currentProductId && (p.categorySlug === categorySlug || p.isFeatured))
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-[#E7DFD5]">
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#9A3412]">
            Rekomendasi Butik
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#1C1917] mt-1">
            Koleksi Terkait yang Serasi
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
