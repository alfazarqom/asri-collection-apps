import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "../../hooks/useCart.ts";

export const Header: React.FC = () => {
  const { totalItems, openCart } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path || (path !== "/" && location.pathname.startsWith(path));
  };

  return (
    <>

      {/* Main Header adhering to Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E7DFD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <Link
            to="/"
            className="font-serif text-2xl font-bold tracking-tight text-[#1C1917] hover:text-[#9A3412] transition-colors whitespace-nowrap shrink-0"
          >
            Asri Collection
          </Link>

          {/* Zone 2: 4-5 single-line clean nav links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-stone-700">
            <Link
              to="/"
              className={`hover:text-[#9A3412] transition-colors whitespace-nowrap shrink-0 py-1 ${
                location.pathname === "/" ? "text-[#9A3412] border-b-2 border-[#9A3412]" : ""
              }`}
            >
              Beranda
            </Link>
            <Link
              to="/products?category=dresses"
              className={`hover:text-[#9A3412] transition-colors whitespace-nowrap shrink-0 py-1 ${
                location.search.includes("dresses") ? "text-[#9A3412] border-b-2 border-[#9A3412]" : ""
              }`}
            >
              Gamis & Dress
            </Link>
            <Link
              to="/products?category=tops"
              className={`hover:text-[#9A3412] transition-colors whitespace-nowrap shrink-0 py-1 ${
                location.search.includes("tops") ? "text-[#9A3412] border-b-2 border-[#9A3412]" : ""
              }`}
            >
              Tunik & Atasan
            </Link>
            <Link
              to="/products"
              className={`hover:text-[#9A3412] transition-colors whitespace-nowrap shrink-0 py-1 ${
                location.pathname === "/products" && !location.search ? "text-[#9A3412] border-b-2 border-[#9A3412]" : ""
              }`}
            >
              Semua Koleksi
            </Link>
            <Link
              to="/orders"
              className={`hover:text-[#9A3412] transition-colors whitespace-nowrap shrink-0 py-1 ${
                isActive("/orders") || isActive("/pesanan") ? "text-[#9A3412] border-b-2 border-[#9A3412]" : ""
              }`}
            >
              Lacak Pesanan
            </Link>
            <Link
              to="/about"
              className={`hover:text-[#9A3412] transition-colors whitespace-nowrap shrink-0 py-1 ${
                isActive("/about") || isActive("/tentang-kami") ? "text-[#9A3412] border-b-2 border-[#9A3412]" : ""
              }`}
            >
              Tentang Kami
            </Link>
            <Link
              to="/contact"
              className={`hover:text-[#9A3412] transition-colors whitespace-nowrap shrink-0 py-1 ${
                isActive("/contact") || isActive("/kontak") ? "text-[#9A3412] border-b-2 border-[#9A3412]" : ""
              }`}
            >
              Kontak
            </Link>
          </nav>

          {/* Zone 3: 1 primary action group (Search & Cart trigger) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-stone-700 hover:text-[#9A3412] transition-colors"
              aria-label="Cari produk"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={openCart}
              className="flex items-center gap-2 py-2 px-3 text-xs font-semibold text-white bg-[#1C1917] hover:bg-[#9A3412] transition-colors whitespace-nowrap shrink-0"
              aria-label={`Buka tas belanja (${totalItems})`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Tas Belanja</span>
              <span className="bg-[#9A3412] text-white px-1.5 py-0.5 text-[10px] font-bold tabular-nums">
                {totalItems}
              </span>
            </button>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div className="border-t border-[#E7DFD5] bg-[#FAF8F5] p-4">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <input
                  type="text"
                  autoFocus
                  placeholder="Cari gamis silk mulberry, tunik bordir, handbag, pashmina..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 px-4 py-2 text-xs border border-[#E7DFD5] bg-white focus:outline-none focus:border-[#9A3412]"
                />
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#9A3412] hover:bg-[#7C2D12] transition-colors"
                >
                  Cari
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-2 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
