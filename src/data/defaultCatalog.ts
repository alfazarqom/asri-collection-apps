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

export const OFFICIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    slug: "gamis-silk-mulberry-mocca",
    title: "Gamis Silk Mulberry Champagne Mocca",
    description:
      "Gamis eksklusif berpotongan empire waist yang dibuat dari 100% serat Mulberry Silk alami. Menghadirkan siluet drape yang menjuntai anggun, bertekstur sejuk di kulit, dan tidak menerawang. Dilengkapi bukaan resleting depan (busui friendly) dan manset wudhu-friendly berkancing mutiara.",
    price: 685000,
    originalPrice: 850000,
    discountPercentage: 19,
    rating: 4.95,
    reviewCount: 128,
    categorySlug: "dresses",
    thumbnail: "/src/assets/images/product_gamis_mulberry_1793090598263.jpg",
    images: [
      "/src/assets/images/product_gamis_mulberry_1793090598263.jpg",
      "/src/assets/images/hero_modest_fashion_banner_1793090597385.jpg",
    ],
    sizes: ["S", "M", "L", "XL", "All Size"],
    colors: ["Mocca", "Broken White", "Sage", "Hitam"],
    stock: 24,
    sku: "ASR-DRS-001",
    isFeatured: true,
    isNew: true,
    weightGrams: 420,
    material: "100% Grade-A Mulberry Silk with Soft Voile Lining",
    careInstructions: "Cuci dengan tangan air dingin, gunakan detergen cair khusus sutra, jangan peras terlalu kuat, setrika suhu rendah.",
  },
  {
    id: "prod-2",
    slug: "tunik-bordir-katun-poplin-sage",
    title: "Tunik Bordir Katun Poplin Sage Flora",
    description:
      "Tunik modern bernuansa sage lembut dengan sulaman bordir flora khas artisanal di bagian kerah dan ujung lengan. Dibuat dari bahan katun poplin 100% breathable yang menyerap keringat dengan sempurna, cocok untuk silaturahmi formal maupun santai.",
    price: 395000,
    originalPrice: 475000,
    discountPercentage: 17,
    rating: 4.88,
    reviewCount: 94,
    categorySlug: "tops",
    thumbnail: "/src/assets/images/product_tunik_bordir_1793090658906.jpg",
    images: [
      "/src/assets/images/product_tunik_bordir_1793090658906.jpg",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Sage", "Broken White", "Mocca"],
    stock: 35,
    sku: "ASR-TNK-002",
    isFeatured: true,
    isNew: false,
    weightGrams: 310,
    material: "Premium Compact Cotton Poplin 50s",
    careInstructions: "Dapat dicuci mesin siklus lembut, jemur di tempat teduh, setrika dengan uap sedang.",
  },
  {
    id: "prod-3",
    slug: "tas-handbag-kulit-vegan-taupe",
    title: "The Allure Vegan Leather Structured Tote",
    description:
      "Handbag terstruktur berbahan kulit vegan ramah lingkungan dengan tekstur grain halus. Dilengkapi tali bahu fleksibel yang dapat dilepas pasang, kompartemen berresleting untuk tablet/ponsel, serta aksen gembok hiasan berlapis emas 18K.",
    price: 520000,
    originalPrice: 650000,
    discountPercentage: 20,
    rating: 4.92,
    reviewCount: 76,
    categorySlug: "bags",
    thumbnail: "/src/assets/images/product_vegan_leather_bag_1793090659374.jpg",
    images: [
      "/src/assets/images/product_vegan_leather_bag_1793090659374.jpg",
    ],
    sizes: ["One Size (28x20x11 cm)"],
    colors: ["Taupe", "Hitam", "Ivory"],
    stock: 18,
    sku: "ASR-BAG-003",
    isFeatured: true,
    isNew: true,
    weightGrams: 580,
    material: "Ultra-Durable Vegan PU Leather with Microfiber Suede Lining",
    careInstructions: "Bersihkan noda dengan kain mikrofiber lembap, simpan di dalam dustbag saat tidak digunakan.",
  },
  {
    id: "prod-4",
    slug: "pashmina-silk-shimmer-champagne",
    title: "Pashmina Silk Shimmer Luminous Rose",
    description:
      "Pashmina mewah dengan efek shimmer kilau mutiara yang subtle dan tidak berlebihan. Mudah dibentuk, tegak di dahi, serta tidak licin saat dikenakan seharian berkat tekstur rajut dobel silang eksklusif Asri Collection.",
    price: 185000,
    originalPrice: 225000,
    discountPercentage: 18,
    rating: 4.98,
    reviewCount: 210,
    categorySlug: "hijab",
    thumbnail: "/src/assets/images/product_pashmina_silk_1793090600850.jpg",
    images: [
      "/src/assets/images/product_pashmina_silk_1793090600850.jpg",
    ],
    sizes: ["185 x 75 cm"],
    colors: ["Rose Champagne", "Mocca", "Broken White", "Sage"],
    stock: 60,
    sku: "ASR-PSH-004",
    isFeatured: true,
    isNew: false,
    weightGrams: 160,
    material: "High-Twist Silk Shimmer Chiffon",
    careInstructions: "Cuci dengan tangan, hindari pemutih pakaian, gunakan peniti berujung tumpul untuk menjaga serat benang.",
  },
  {
    id: "prod-5",
    slug: "abaya-crinkle-linen-noir",
    title: "Abaya Minimalist Crinkle Noir Jet Black",
    description:
      "Abaya bergaya potongan Timur Tengah modern dengan detail lipit rapi di bagian punggung. Memiliki efek jatuh yang sangat anggun dan bahan berpori yang nyaman di segala iklim.",
    price: 495000,
    originalPrice: 590000,
    discountPercentage: 16,
    rating: 4.9,
    reviewCount: 48,
    categorySlug: "dresses",
    thumbnail: "/src/assets/images/product_gamis_mulberry_1793090598263.jpg",
    images: [
      "/src/assets/images/product_gamis_mulberry_1793090598263.jpg",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Hitam", "Mocca", "Deep Navy"],
    stock: 20,
    sku: "ASR-DRS-005",
    isFeatured: false,
    isNew: true,
    weightGrams: 450,
    material: "Airflow Crinkle Linen Premium",
    careInstructions: "Cuci dengan air dingin, tidak perlu disetrika (ironless).",
  },
  {
    id: "prod-6",
    slug: "kitten-heels-slingback-mocca",
    title: "Soleil Pointed Kitten Heels 4cm Mocca",
    description:
      "Sepatu heels berdesain pointed-toe dengan hak santun setinggi 4 cm. Dilengkapi double-cushioning ortholite yang menjaga kenyamanan kaki saat berdiri lama atau beraktivitas penuh.",
    price: 450000,
    originalPrice: 520000,
    discountPercentage: 13,
    rating: 4.87,
    reviewCount: 62,
    categorySlug: "heels",
    thumbnail: "/src/assets/images/hero_modest_fashion_banner_1793090597385.jpg",
    images: [
      "/src/assets/images/hero_modest_fashion_banner_1793090597385.jpg",
    ],
    sizes: ["36", "37", "38", "39", "40", "41"],
    colors: ["Mocca", "Broken White", "Hitam"],
    stock: 22,
    sku: "ASR-HLS-006",
    isFeatured: false,
    isNew: false,
    weightGrams: 510,
    material: "Lambskin Touch Microfiber Leather & Non-Slip Rubber Sole",
    careInstructions: "Lap dengan spons pembersih lembut, hindari terkena genangan air berlebih.",
  },
  {
    id: "prod-7",
    slug: "parfum-damask-rose-oud-50ml",
    title: "Asri Heritage Eau de Parfum 50ml — Damask & Oud",
    description:
      "Kreasi wewangian butik eksklusif dengan formula extrait de parfum tahan hingga 12 jam. Top notes kesegaran Damask Rose dan Bergamot, berpadu dengan kehangatan Amberwood dan sentuhan lembut White Oud.",
    price: 375000,
    originalPrice: 450000,
    discountPercentage: 17,
    rating: 4.96,
    reviewCount: 89,
    categorySlug: "fragrance",
    thumbnail: "/src/assets/images/product_pashmina_silk_1793090600850.jpg",
    images: [
      "/src/assets/images/product_pashmina_silk_1793090600850.jpg",
    ],
    sizes: ["50 ml (Full Size)"],
    colors: ["Glass Amber Bottle"],
    stock: 40,
    sku: "ASR-PRF-007",
    isFeatured: true,
    isNew: true,
    weightGrams: 280,
    material: "Pure French Fragrance Oils & Cosmetic Grade Solvent",
    careInstructions: "Semprotkan pada titik nadi pergelangan dan leher. Simpan terhindar dari sinar matahari langsung.",
  },
  {
    id: "prod-8",
    slug: "blouse-linen-lace-broken-white",
    title: "Aura French Lace Blouse Broken White",
    description:
      "Blouse feminin dengan aplikasi renda katun Prancis di bagian kerah shanghai dan pergelangan tangan. Berpotongan loose fit yang anggun dan santun untuk busana kantor maupun acara resmi.",
    price: 360000,
    originalPrice: 420000,
    discountPercentage: 14,
    rating: 4.84,
    reviewCount: 51,
    categorySlug: "tops",
    thumbnail: "/src/assets/images/product_tunik_bordir_1793090658906.jpg",
    images: [
      "/src/assets/images/product_tunik_bordir_1793090658906.jpg",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Broken White", "Mocca", "Sage"],
    stock: 25,
    sku: "ASR-TOP-008",
    isFeatured: false,
    isNew: true,
    weightGrams: 290,
    material: "Pure Crinkle Linen with French Cotton Lace",
    careInstructions: "Cuci dengan tangan, jemur mendatar, setrika dengan temperatur sedang.",
  },
];
