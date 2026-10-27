import React, { useEffect, useState } from "react";
import { HeroSlider } from "../components/home/HeroSlider.tsx";
import { FacilitiesSection } from "../components/home/FacilitiesSection.tsx";
import { CategorySection } from "../components/home/CategorySection.tsx";
import { FeaturedProducts } from "../components/home/FeaturedProducts.tsx";
import { PromoBannerSection } from "../components/home/PromoBannerSection.tsx";
import { NewArrivals } from "../components/home/NewArrivals.tsx";
import { BrandStorySection } from "../components/home/BrandStorySection.tsx";
import { fetchCategories, fetchProducts } from "../services/productApi.ts";
import { Category, Product, OFFICIAL_CATEGORIES, OFFICIAL_PRODUCTS } from "../data/defaultCatalog.ts";
import { Spinner } from "../components/ui/Loader.tsx";

export const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(OFFICIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(OFFICIAL_PRODUCTS);
  const [loading, setLoading] = useState(false);

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
        }
      } catch (err) {
        console.warn("Home initial load error:", err);
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
