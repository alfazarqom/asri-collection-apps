import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Star, Eye } from "lucide-react";
import { Product } from "../../data/defaultCatalog.ts";
import { formatRupiah } from "../../utils/formatters.ts";
import { useCart } from "../../hooks/useCart.ts";

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, product.sizes[0], product.colors[0]);
  };

  return (
    <div className="group flex flex-col bg-white border border-[#E7DFD5] hover:border-[#1C1917] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md overflow-hidden">
      {/* Visual Slot */}
      <Link
        to={`/products/${product.slug}`}
        className="relative block aspect-[4/3] bg-[#FAF8F5] overflow-hidden"
      >
        {!imageError ? (
          <img
            src={product.thumbnail}
            alt={product.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#FAF8F5] to-[#F4EFEA] text-stone-400">
            <span className="font-serif text-xs uppercase tracking-widest text-stone-500 mb-1">
              Asri Collection
            </span>
            <span className="text-[11px] text-center font-medium line-clamp-2">
              {product.title}
            </span>
          </div>
        )}

        {/* Minimalist single tag if featured or new */}
        {product.isNew && (
          <div className="absolute top-3 left-3 bg-[#1C1917] text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5">
            New In
          </div>
        )}
        {!product.isNew && product.discountPercentage && product.discountPercentage > 0 ? (
          <div className="absolute top-3 left-3 bg-[#9A3412] text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 tabular-nums">
            -{product.discountPercentage}%
          </div>
        ) : null}

        {/* Quick Add Overlay on Desktop */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex gap-2">
          <button
            onClick={handleQuickAdd}
            className="flex-1 py-2 px-3 bg-white/95 backdrop-blur-xs text-[#1C1917] hover:bg-[#1C1917] hover:text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>+ Keranjang</span>
          </button>
        </div>
      </Link>

      {/* Content Container */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
            <div className="flex items-center gap-1 text-stone-700">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="tabular-nums font-semibold">{product.rating}</span>
              <span className="text-stone-400">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <Link
            to={`/products/${product.slug}`}
            className="block text-sm font-semibold text-[#1C1917] group-hover:text-[#9A3412] transition-colors line-clamp-2 leading-snug"
          >
            {product.title}
          </Link>
        </div>

        {/* Price Baseline */}
        <div className="mt-3 pt-2 border-t border-[#E7DFD5] flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-[#1C1917] tabular-nums">
              {formatRupiah(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through tabular-nums">
                {formatRupiah(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Mobile quick-add button */}
          <button
            onClick={handleQuickAdd}
            className="sm:hidden p-1.5 text-stone-700 hover:text-[#9A3412] hover:bg-[#F4EFEA] transition-colors"
            aria-label="Tambah ke tas belanja"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
