import React, { useEffect, useState } from "react";
import { HeroSlider } from "../components/home/HeroSlider.tsx";
import { FacilitiesSection } from "../components/home/FacilitiesSection.tsx";
import { CategorySection } from "../components/home/CategorySection.tsx";
import { FeaturedProducts } from "../components/home/FeaturedProducts.tsx";
import { PromoBannerSection } from "../components/home/PromoBannerSection.tsx";
import { NewArrivals } from "../components/home/NewArrivals.tsx";
import { BrandStorySection } from "../components/home/BrandStorySection.tsx";
import { fetchCategories, fetchProducts } from "../services/productApi.ts";
import { Category, Product } from "../data/defaultCatalog.ts";
import { Spinner } from "../components/ui/Loader.tsx";

export const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [cats, prods] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
        ]);
        if (isMounted) {
          setCategories(cats);
          setProducts(prods);
          setLoadError(null);
        }
      } catch (err) {
        console.error("Home initial load error:", err);
        if (isMounted) setLoadError(err instanceof Error ? err.message : "Katalog gagal dimuat.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {loadError && <div role="alert" className="mx-auto max-w-7xl px-4 py-4 text-sm text-red-700">{loadError}</div>}
      {loading && <div className="px-4 py-6 text-center text-sm text-stone-500">Memuat katalog dari Supabase…</div>}
      <HeroSlider />
      <FacilitiesSection />
      <CategorySection categories={categories} />
      <FeaturedProducts products={products} />
      <PromoBannerSection />
      <NewArrivals products={products} />
      <BrandStorySection />
    </div>
  );
};

export default Home;
