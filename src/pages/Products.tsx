import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts, ProductFilters } from "../services/productApi.ts";
import { Product } from "../data/defaultCatalog.ts";
import { ProductCard } from "../components/product/ProductCard.tsx";
import { ProductFilter } from "../components/product/ProductFilter.tsx";
import { ProductCardSkeleton } from "../components/ui/Loader.tsx";
import { Sparkles, SearchX } from "lucide-react";

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Sync state from URL parameters
  const currentCategory = searchParams.get("category") || "all";
  const currentSearch = searchParams.get("search") || "";
  const currentSort = (searchParams.get("sort") as ProductFilters["sortBy"]) || "featured";
  const minPriceParam = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
  const maxPriceParam = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;

  const filters: ProductFilters = useMemo(() => ({
    categorySlug: currentCategory,
    search: currentSearch,
    sortBy: currentSort,
    minPrice: minPriceParam,
    maxPrice: maxPriceParam,
  }), [currentCategory, currentSearch, currentSort, minPriceParam, maxPriceParam]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setLoadError(false);

    fetchProducts(filters)
      .then((res) => {
        if (isMounted) {
          setProducts(res);
        }
      })
      .catch((err) => {
        console.warn("Failed to load products:", err);
        if (isMounted) {
          setProducts([]);
          setLoadError(true);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const handleFilterChange = (updated: ProductFilters) => {
    const params: Record<string, string> = {};
    if (updated.categorySlug && updated.categorySlug !== "all") {
      params.category = updated.categorySlug;
    }
    if (updated.search && updated.search.trim()) {
      params.search = updated.search.trim();
    }
    if (updated.sortBy && updated.sortBy !== "featured") {
      params.sort = updated.sortBy;
    }
    if (updated.minPrice !== undefined) {
      params.minPrice = updated.minPrice.toString();
    }
    if (updated.maxPrice !== undefined) {
      params.maxPrice = updated.maxPrice.toString();
    }
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9A3412] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Katalog Butik Resmi</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
            Koleksi Busana Kontemporer
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            Pilihan gamis sutra mulberry, tunik katun bordir, pashmina shimmer, tas kulit vegan, dan parfum eksklusif.
          </p>
        </div>

        {/* Filter Bar */}
        <ProductFilter
          filters={filters}
          onChange={handleFilterChange}
          totalResults={products.length}
        />

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : loadError ? (
          <div role="alert" className="bg-white border border-[#E7DFD5] p-12 text-center">
            <h3 className="font-serif text-lg font-bold text-[#1C1917]">Produk gagal dimuat</h3>
            <p className="text-xs text-stone-500 mt-1">Periksa koneksi Anda, lalu muat ulang halaman.</p>
            <button onClick={() => window.location.reload()} className="mt-5 px-5 py-2 text-xs font-semibold text-white bg-[#1C1917]">
              Coba Lagi
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white border border-[#E7DFD5] p-12 text-center flex flex-col items-center justify-center">
            <SearchX className="w-10 h-10 text-stone-400 mb-3" />
            <h3 className="font-serif text-lg font-bold text-[#1C1917]">
              Tidak Ada Produk yang Sesuai
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm">
              Coba kurangi filter atau cari dengan kata kunci lain untuk melihat koleksi Asri Collection.
            </p>
            <button
              onClick={() => handleFilterChange({ categorySlug: "all", search: "" })}
              className="mt-5 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#1C1917] hover:bg-[#9A3412] transition-colors"
            >
              Tampilkan Semua Produk
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
