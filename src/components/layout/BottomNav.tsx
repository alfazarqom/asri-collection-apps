import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Grid, ShoppingBag, PackageCheck, MessageCircle } from "lucide-react";
import { useCart } from "../../hooks/useCart.ts";

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { totalItems, openCart } = useCart();

  const isCurrent = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && (location.pathname.startsWith(path) || (path === "/orders" && location.pathname.startsWith("/pesanan")))) return true;
    return false;
  };

  const whatsappUrl = `https://wa.me/6282156764434?text=${encodeURIComponent(
    "Halo Asri Collection, saya ingin berkonsultasi mengenai koleksi busana muslimah dan pemesanan."
  )}`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E7DFD5] h-14 px-3 flex items-center justify-around">
      <Link
        to="/"
        className={`flex flex-col items-center justify-center py-1 px-2 text-[10px] font-medium transition-colors ${
          isCurrent("/") ? "text-[#9A3412]" : "text-stone-500 hover:text-stone-900"
        }`}
      >
        <Home className="w-4 h-4 mb-0.5" />
        <span>Beranda</span>
      </Link>

      <Link
        to="/products"
        className={`flex flex-col items-center justify-center py-1 px-2 text-[10px] font-medium transition-colors ${
          isCurrent("/products") ? "text-[#9A3412]" : "text-stone-500 hover:text-stone-900"
        }`}
      >
        <Grid className="w-4 h-4 mb-0.5" />
        <span>Katalog</span>
      </Link>

      <button
        onClick={openCart}
        className="relative flex flex-col items-center justify-center py-1 px-2 text-[10px] font-medium text-stone-500 hover:text-stone-900 transition-colors"
      >
        <div className="relative">
          <ShoppingBag className="w-4 h-4 mb-0.5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-[#9A3412] text-white text-[9px] font-bold flex items-center justify-center tabular-nums">
              {totalItems}
            </span>
          )}
        </div>
        <span>Keranjang</span>
      </button>

      <Link
        to="/orders"
        className={`flex flex-col items-center justify-center py-1 px-2 text-[10px] font-medium transition-colors ${
          isCurrent("/orders") ? "text-[#9A3412]" : "text-stone-500 hover:text-stone-900"
        }`}
      >
        <PackageCheck className="w-4 h-4 mb-0.5" />
        <span>Pesanan</span>
      </Link>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center py-1 px-2 text-[10px] font-medium text-emerald-700 hover:text-emerald-800 transition-colors"
      >
        <MessageCircle className="w-4 h-4 mb-0.5" />
        <span>WhatsApp</span>
      </a>
    </div>
  );
};

export default BottomNav;
