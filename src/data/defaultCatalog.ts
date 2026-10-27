// Types shared by catalog UI and admin tools.
// Product and category records are loaded from Supabase; this file intentionally
// contains no hardcoded/sample catalog data.

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url?: string | null;
  display_order?: number | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  imageUrl: string;
  itemCount: number;
}

export interface Product {
  // All 24 columns from public.products, preserved as returned by Supabase.
  id: string;
  slug: string;
  title: string;
  description: string | null;
  price: number;
  original_price: number | null;
  discount_percentage: number | null;
  rating: number | null;
  review_count: number | null;
  category_slug: string | null;
  thumbnail: string | null;
  images: string[] | null;
  sizes: string[] | null;
  colors: string[] | null;
  stock: number | null;
  sku: string | null;
  is_featured: boolean;
  is_new: boolean;
  is_active: boolean;
  weight_grams: number | null;
  material: string | null;
  care_instructions: string | null;
  created_at: string;
  updated_at: string;

  // Presentation aliases used by existing UI/cart code.
  originalPrice: number | null;
  discountPercentage: number | null;
  reviewCount: number | null;
  categorySlug: string | null;
  imageUrl?: string;
  itemCount?: number;
  isFeatured: boolean;
  isNew: boolean;
  weightGrams: number | null;
  careInstructions: string | null;
}
