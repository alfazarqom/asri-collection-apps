import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Product } from "../../data/defaultCatalog.ts";
import { ProductCard } from "../product/ProductCard.tsx";

export const NewArrivals: React.FC<{ products: Product[] }> = ({ products }) => {
  const newItems = products.filter((p) => p.isNew).slice(0, 4);

  return (
    <section className="py-16 md:py-20 bg-[#FAF8F5] border-b border-[#E7DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#9A3412]">
              Koleksi Terbaru
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917] mt-1">
              Rilisan Anyar Pekan Ini
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold uppercase tracking-wider text-[#1C1917] hover:text-[#9A3412] flex items-center gap-1.5 transition-colors group"
          >
            <span>Semua Rilisan Baru</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
