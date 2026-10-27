import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Category } from "../../data/defaultCatalog.ts";

export const CategorySection: React.FC<{ categories: Category[] }> = ({ categories }) => {
  return (
    <section className="py-16 md:py-20 bg-[#FAF8F5] border-b border-[#E7DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#9A3412]">
              Eksplorasi Kurasi
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917] mt-1">
              Kategori Busana Muslimah
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold uppercase tracking-wider text-[#1C1917] hover:text-[#9A3412] flex items-center gap-1.5 transition-colors group"
          >
            <span>Lihat Semua Katalog</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group block bg-white border border-[#E7DFD5] hover:border-[#1C1917] p-3 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-sm"
            >
              <div className="aspect-square bg-[#FAF8F5] overflow-hidden mb-3">
                {cat.imageUrl ? (
                  <img src={cat.imageUrl} alt={cat.name} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">Gambar belum tersedia</div>
                )}
              </div>
              <h3 className="text-xs font-bold text-[#1C1917] group-hover:text-[#9A3412] transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 tabular-nums">
                {cat.itemCount} Koleksi
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
