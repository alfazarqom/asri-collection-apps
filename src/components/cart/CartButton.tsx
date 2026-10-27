import React from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../../hooks/useCart.ts";

export const CartButton: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { totalItems, openCart } = useCart();

  return (
    <button
      onClick={openCart}
      className={`relative flex items-center justify-center p-2 text-[#1C1917] hover:text-[#9A3412] transition-colors ${className}`}
      aria-label={`Keranjang belanja (${totalItems} barang)`}
    >
      <ShoppingBag className="w-5 h-5" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-[#9A3412] tabular-nums">
          {totalItems}
        </span>
      )}
    </button>
  );
};

export default CartButton;
