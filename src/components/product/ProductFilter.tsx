import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { ProductFilters } from "../../services/productApi.ts";

interface ProductFilterProps {
  filters: ProductFilters;
  onChange: (updated: ProductFilters) => void;
  totalResults: number;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  filters,
  onChange,
  totalResults,
}) => {
  const priceRanges = [
    { label: "Semua Harga", min: undefined, max: undefined },
    { label: "< Rp 250rb", min: 0, max: 250000 },
    { label: "Rp 250rb – 500rb", min: 250000, max: 500000 },
    { label: "Rp 500rb – 1jt", min: 500000, max: 1000000 },
    { label: "> Rp 1jt", min: 1000000, max: undefined },
  ];

  const isPriceActive = (min?: number, max?: number) => {
    return filters.minPrice === min && filters.maxPrice === max;
  };

  return (
    <div className="bg-white border border-[#E7DFD5] p-5 mb-8 space-y-5">
      {/* Price range and Sort selector */}
      <div className="pt-4 border-t border-[#E7DFD5] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Price filter buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-stone-600 mr-1">
            Rentang Harga:
          </span>
          {priceRanges.map((range, idx) => {
            const active = isPriceActive(range.min, range.max);
            return (
              <button
                key={idx}
                onClick={() =>
                  onChange({
                    ...filters,
                    minPrice: range.min,
                    maxPrice: range.max,
                  })
                }
                className={`px-2.5 py-1 text-xs transition-colors whitespace-nowrap ${
                  active
                    ? "bg-[#9A3412] text-white font-medium"
                    : "bg-white text-stone-600 hover:bg-[#FAF8F5] border border-[#E7DFD5]"
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>

        {/* Sort & Result count */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-500 whitespace-nowrap tabular-nums">
            Menampilkan <strong>{totalResults}</strong> busana
          </span>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-stone-500 hidden sm:inline" />
            <select
              value={filters.sortBy || "featured"}
              onChange={(e) =>
                onChange({
                  ...filters,
                  sortBy: e.target.value as ProductFilters["sortBy"],
                })
              }
              className="text-xs py-1.5 px-3 border border-[#E7DFD5] bg-white text-stone-800 focus:outline-none focus:border-[#9A3412]"
            >
              <option value="featured">Paling Sesuai</option>
              <option value="newest">Koleksi Terbaru</option>
              <option value="price-asc">Harga Terendah</option>
              <option value="price-desc">Harga Tertinggi</option>
              <option value="rating">Rating Tertinggi</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
