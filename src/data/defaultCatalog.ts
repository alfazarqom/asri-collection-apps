// Kurasi Resmi Katalog Asri Collection — Contemporary Modest & Modern Fashion

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  itemCount: number;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  categorySlug: string;
  thumbnail: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  sku: string;
  isFeatured: boolean;
  isNew: boolean;
  weightGrams: number;
  material: string;
  careInstructions: string;
  brand?: string;
  currency?: string;
  availability?: string;
  labels?: string[];
  sourceProductId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const OFFICIAL_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    slug: "dresses",
    name: "Gamis & Dresses",
    description: "Koleksi gamis dan dress muslimah kontemporer berbahan silk mulberry dan crinkle premium.",
    imageUrl: "/src/assets/images/product_gamis_mulberry_1793090598263.jpg",
    itemCount: 12,
  },
  {
    id: "cat-2",
    slug: "tops",
    name: "Tunik & Blouse",
    description: "Tunik bordir eksklusif berbahan katun poplin halus dengan siluet anggun.",
    imageUrl: "/src/assets/images/product_tunik_bordir_1793090658906.jpg",
    itemCount: 16,
  },
  {
    id: "cat-3",
    slug: "bags",
    name: "Tas & Handbag",
    description: "Tas kulit vegan premium berdesain minimalis dengan aksen gold hardware mewah.",
    imageUrl: "/src/assets/images/product_vegan_leather_bag_1793090659374.jpg",
    itemCount: 8,
  },
  {
    id: "cat-4",
    slug: "hijab",
    name: "Hijab & Pashmina",
    description: "Pashmina silk shimmer lembut dan breathable dengan kilau mewah alami.",
    imageUrl: "/src/assets/images/product_pashmina_silk_1793090600850.jpg",
    itemCount: 14,
  },
  {
    id: "cat-5",
    slug: "heels",
    name: "Kitten Heels & Mules",
    description: "Sepatu hak santun 3-5 cm berbahan kulit sintetis empuk dengan bantalan ergonomis.",
    imageUrl: "/src/assets/images/hero_modest_fashion_banner_1793090597385.jpg",
    itemCount: 6,
  },
  {
    id: "cat-6",
    slug: "fragrance",
    name: "Eau de Parfum",
    description: "Aroma eksklusif perpaduan Damask Rose, Vanilla Cream, dan Warm White Oud.",
    imageUrl: "/src/assets/images/product_gamis_mulberry_1793090598263.jpg",
    itemCount: 4,
  },
];

export const OFFICIAL_PRODUCTS: Product[] = [];;
