import { supabase, isSupabaseConfigured } from "../lib/supabase.ts";
import {
  Category,
  Product,
  OFFICIAL_CATEGORIES,
} from "../data/defaultCatalog.ts";

export interface ProductFilters {
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "featured" | "newest" | "price-asc" | "price-desc" | "rating";
  inStockOnly?: boolean;
}

export const LOCAL_PRODUCTS_KEY = "asri_custom_products";
export const LOCAL_CATEGORIES_KEY = "asri_custom_categories";

export function getCustomCategories(): Category[] {
  try {
    const raw = localStorage.getItem(LOCAL_CATEGORIES_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(OFFICIAL_CATEGORIES));
    return OFFICIAL_CATEGORIES;
  } catch {
    return OFFICIAL_CATEGORIES;
  }
}

export function saveCustomCategory(cat: Category): Category[] {
  const all = getCustomCategories();
  const exists = all.findIndex((c) => c.id === cat.id || c.slug === cat.slug);
  let updated: Category[];
  if (exists >= 0) {
    updated = [...all];
    updated[exists] = cat;
  } else {
    updated = [cat, ...all];
  }
  localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteCustomCategory(idOrSlug: string): Category[] {
  const all = getCustomCategories();
  const updated = all.filter((c) => c.id !== idOrSlug && c.slug !== idOrSlug);
  localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(updated));
  return updated;
}

/** Product records are read only from the Bonsoir Edge Function. */
export function getCustomProducts(): Product[] {
  return [];
}

/** Product writes are not supported by the read-only get-bonsoir-products endpoint. */
export function saveCustomProduct(_prod: Product): Product[] {
  throw new Error("Produk dikelola melalui sumber Bonsoir; penyimpanan produk lokal dinonaktifkan.");
}

/** Product writes are not supported by the read-only get-bonsoir-products endpoint. */
export function deleteCustomProduct(_id: string): Product[] {
  throw new Error("Penghapusan produk lokal dinonaktifkan karena sumber produk tunggal adalah Bonsoir.");
}

export async function fetchCategories(): Promise<Category[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          id: item.id,
          slug: item.slug,
          name: item.name,
          description: item.description || "",
          imageUrl: item.image_url || "/src/assets/images/hero_modest_fashion_banner_1793090597385.jpg",
          itemCount: 10,
        }));
      }
    } catch (err) {
      console.warn("Supabase category fetch error, falling back to local catalog:", err);
    }
  }
  return getCustomCategories();
}

const BONSOIR_PRODUCTS_ENDPOINT =
  "https://mvwflakurihhakdrlteg.supabase.co/functions/v1/get-bonsoir-products";

type BonsoirProduct = {
  id: string;
  source_product_id: string | null;
  title: string;
  brand: string | null;
  price: number | string | null;
  sale_price: number | string | null;
  currency: string | null;
  description: string | null;
  sku: string | null;
  category: string | null;
  availability: string | null;
  stock_quantity: number | null;
  colors: string[] | null;
  sizes: string[] | null;
  image_url: string | null;
  additional_image_urls: string[] | null;
  labels: string[] | null;
  created_at: string;
  updated_at: string;
};

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapBonsoirProduct(p: BonsoirProduct): Product {
  const basePrice = Number(p.price ?? 0);
  const salePrice = p.sale_price == null ? null : Number(p.sale_price);
  const hasDiscount = salePrice !== null && salePrice > 0 && basePrice > salePrice;
  const imageList = [...new Set(
    [p.image_url, ...(Array.isArray(p.additional_image_urls) ? p.additional_image_urls : [])]
      .filter((url): url is string => typeof url === "string" && url.trim().length > 0)
  )];
  const labels = Array.isArray(p.labels) ? p.labels : [];
  const categorySlug = p.category?.trim() || "";
  const titleSlug = slugify(p.title || "");
  const stableSlug = titleSlug ? `${titleSlug}-${p.id.slice(0, 8)}` : p.id;

  return {
    id: p.id,
    slug: stableSlug,
    title: p.title,
    description: p.description ?? "",
    price: hasDiscount ? salePrice! : basePrice,
    originalPrice: hasDiscount ? basePrice : undefined,
    discountPercentage: hasDiscount ? Math.round(((basePrice - salePrice!) / basePrice) * 100) : undefined,
    rating: 0,
    reviewCount: 0,
    categorySlug,
    thumbnail: p.image_url ?? "",
    images: imageList,
    sizes: Array.isArray(p.sizes) ? p.sizes : [],
    colors: Array.isArray(p.colors) ? p.colors : [],
    stock: p.stock_quantity ?? 0,
    sku: p.sku ?? "",
    isFeatured: labels.some((label) => /^(featured|unggulan)$/i.test(label)),
    isNew: labels.some((label) => /^(new|baru)$/i.test(label)),
    weightGrams: 0,
    material: "",
    careInstructions: "",
    brand: p.brand ?? "",
    currency: p.currency ?? "",
    availability: p.availability ?? "",
    labels,
    sourceProductId: p.source_product_id ?? undefined,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

export async function fetchProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const pageSize = 100;
  const rows: BonsoirProduct[] = [];

  for (let offset = 0; ; offset += pageSize) {
    const response = await fetch(`${BONSOIR_PRODUCTS_ENDPOINT}?limit=${pageSize}&offset=${offset}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error(`Gagal mengambil produk Bonsoir (HTTP ${response.status}).`);
    }

    const page: unknown = await response.json();
    if (!Array.isArray(page)) {
      throw new Error("Respons get-bonsoir-products tidak valid: format harus berupa JSON array.");
    }

    rows.push(...(page as BonsoirProduct[]));
    if (page.length < pageSize) break;
  }

  let filtered = rows.map(mapBonsoirProduct);

  if (filters.categorySlug && filters.categorySlug !== "all") {
    filtered = filtered.filter((p) => p.categorySlug === filters.categorySlug);
  }

  if (filters.search?.trim()) {
    const q = filters.search.toLowerCase().trim();
    filtered = filtered.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.categorySlug.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    );
  }

  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    filtered = filtered.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
    filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.inStockOnly) {
    filtered = filtered.filter((p) => p.stock > 0);
  }

  switch (filters.sortBy) {
    case "price-asc":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      filtered.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
      break;
    case "rating":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case "featured":
    default:
      filtered.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
      break;
  }

  return filtered;
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const all = await fetchProducts();
  const found = all.find((p) => p.slug === slug || p.id === slug);
  return found || null;
}

export interface CheckoutPayload {
  merchantOrderId: string;
  amount: number;
  shippingFee: number;
  discountAmount: number;
  productDetails: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  merchantCode?: string;
  apiKey?: string;
  shippingAddress: {
    address: string;
    city: string;
    province: string;
    postalCode: string;
  };
  notes?: string;
  items: Array<{
    productId: string;
    title: string;
    price: number;
    quantity: number;
    variant?: string;
    thumbnail?: string;
  }>;
}

export interface CheckoutResponse {
  success: boolean;
  merchantOrderId: string;
  reference?: string;
  paymentUrl?: string;
  vaNumber?: string;
  qrString?: string;
  message?: string;
}

export async function createCheckoutInvoice(payload: CheckoutPayload): Promise<CheckoutResponse> {
  // Simpan ke local history peramban
  saveOrderToLocalHistory({
    merchantOrderId: payload.merchantOrderId,
    amount: payload.amount,
    customerName: payload.customerName,
    customerPhone: payload.customerPhone,
    status: "PENDING",
    createdAt: new Date().toISOString(),
    items: payload.items,
    shippingAddress: payload.shippingAddress,
  });

  // 1. Coba panggil server endpoint /api/duitku/create-invoice
  try {
    const apiRes = await fetch("/api/duitku/create-invoice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await apiRes.json();

    if (apiRes.ok && data.success && data.reference) {
      updateOrderInLocalHistory(payload.merchantOrderId, {
        reference: data.reference,
        paymentUrl: data.paymentUrl,
        vaNumber: data.vaNumber,
      });

      return {
        success: true,
        merchantOrderId: payload.merchantOrderId,
        reference: data.reference,
        paymentUrl: data.paymentUrl,
        vaNumber: data.vaNumber,
        qrString: data.qrString,
        message: data.statusMessage || "Invoice Duitku POP berhasil dibuat.",
      };
    }

    if (data.needsCredentials) {
      return {
        success: false,
        merchantOrderId: payload.merchantOrderId,
        message: data.statusMessage,
      };
    }
  } catch (err) {
    console.warn("Backend /api/duitku/create-invoice fetch error:", err);
  }

  // 2. Fallback ke Supabase Edge Function jika backend lokal tidak aktif
  if (isSupabaseConfigured && supabase) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/duitku-create-invoice`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const resData = await response.json();
        updateOrderInLocalHistory(payload.merchantOrderId, {
          reference: resData.reference,
          paymentUrl: resData.paymentUrl,
          vaNumber: resData.vaNumber,
        });

        return {
          success: true,
          merchantOrderId: payload.merchantOrderId,
          reference: resData.reference,
          paymentUrl: resData.paymentUrl,
          vaNumber: resData.vaNumber,
          qrString: resData.qrString,
        };
      }
    } catch (err) {
      console.warn("Supabase edge function error:", err);
    }
  }

  // 3. Jika belum ada kredensial Duitku dari user
  return {
    success: false,
    merchantOrderId: payload.merchantOrderId,
    message:
      "Kredensial Duitku POP (Merchant Code & API Key) belum dikonfigurasi. Mohon berikan DUITKU_MERCHANT_CODE dan DUITKU_API_KEY dari dashboard Duitku Sandbox Anda.",
  };
}

export async function fetchOrderDetails(merchantOrderId: string): Promise<any | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .or(`merchant_order_id.eq.${merchantOrderId},reference.eq.${merchantOrderId}`)
        .maybeSingle();

      if (!error && data) {
        return {
          merchantOrderId: data.merchant_order_id,
          reference: data.reference,
          amount: Number(data.total_amount),
          customerName: data.customer_name,
          customerPhone: data.customer_phone,
          customerEmail: data.customer_email,
          status: data.status,
          shippingAddress: data.shipping_address,
          notes: data.notes,
          paymentUrl: data.payment_url,
          vaNumber: data.va_number,
          qrString: data.qr_string,
          createdAt: data.created_at,
          paidAt: data.paid_at,
          items: data.order_items || [],
        };
      }
    } catch (err) {
      console.warn("Supabase fetch order error:", err);
    }
  }

  // Cek local history
  const history = getLocalOrdersHistory();
  const localOrder = history.find(
    (o) => o.merchantOrderId === merchantOrderId || o.reference === merchantOrderId
  );
  return localOrder || null;
}

// Local Storage Order History helpers
const LOCAL_ORDERS_KEY = "asri_collection_order_history";

export function getLocalOrdersHistory(): any[] {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveOrderToLocalHistory(order: any) {
  try {
    const history = getLocalOrdersHistory();
    const updated = [order, ...history.filter((o) => o.merchantOrderId !== order.merchantOrderId)].slice(0, 20);
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save order to local history:", err);
  }
}

export function updateOrderInLocalHistory(merchantOrderId: string, partial: any) {
  try {
    const history = getLocalOrdersHistory();
    const updated = history.map((o) => {
      if (o.merchantOrderId === merchantOrderId) {
        return { ...o, ...partial };
      }
      return o;
    });
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to update local order:", err);
  }
}

export function deleteOrderFromLocalHistory(merchantOrderId: string): any[] {
  try {
    const history = getLocalOrdersHistory();
    const updated = history.filter((o) => o.merchantOrderId !== merchantOrderId);
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Failed to delete local order:", err);
    return [];
  }
}

export function seedInitialOrdersIfEmpty(): any[] {
  const current = getLocalOrdersHistory();
  if (current.length > 0) return current;

  const samples = [
    {
      merchantOrderId: "ASR-ORD-20261027-1011",
      amount: 685000,
      shippingFee: 0,
      discountAmount: 0,
      customerName: "Zaskia Nurul",
      customerPhone: "081299887766",
      customerEmail: "zaskia@gmail.com",
      status: "SHIPPED",
      paymentMethod: "Transfer Bank BCA",
      trackingNumber: "JNE-018293810",
      courier: "JNE Reguler",
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      shippingAddress: {
        address: "Jl. Senopati Raya No. 18, Kebayoran Baru",
        city: "Jakarta Selatan",
        province: "DKI Jakarta",
        postalCode: "12190",
      },
      notes: "Mohon dicek kerapatan jahitan sebelum dikemas",
      items: [
        {
          productId: "prod-1",
          title: "Gamis Silk Mulberry Champagne Mocca",
          price: 685000,
          quantity: 1,
          variant: "M / Mocca",
          thumbnail: "/src/assets/images/product_gamis_mulberry_1793090598263.jpg",
        },
      ],
    },
    {
      merchantOrderId: "ASR-ORD-20261026-9812",
      amount: 580000,
      shippingFee: 0,
      discountAmount: 0,
      customerName: "Annisa Rahmawati",
      customerPhone: "085712345678",
      customerEmail: "annisa.rahma@yahoo.com",
      status: "PROCESSED",
      paymentMethod: "QRIS Butik",
      trackingNumber: "SICEPAT-0081293",
      courier: "SiCepat Ekspres",
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      shippingAddress: {
        address: "Kompleks Dago Asri Blok B No. 12",
        city: "Bandung",
        province: "Jawa Barat",
        postalCode: "40135",
      },
      notes: "Tolong bungkus rapi dengan zipper bag butik",
      items: [
        {
          productId: "prod-2",
          title: "Tunik Bordir Katun Poplin Sage Flora",
          price: 395000,
          quantity: 1,
          variant: "S / Sage",
          thumbnail: "/src/assets/images/product_tunik_bordir_1793090658906.jpg",
        },
        {
          productId: "prod-4",
          title: "Pashmina Silk Shimmer Luminous Rose",
          price: 185000,
          quantity: 1,
          variant: "185 x 75 cm / Rose Champagne",
          thumbnail: "/src/assets/images/product_pashmina_silk_1793090600850.jpg",
        },
      ],
    },
    {
      merchantOrderId: "ASR-ORD-20261026-4402",
      amount: 520000,
      shippingFee: 0,
      discountAmount: 0,
      customerName: "Dewi Lestari",
      customerPhone: "081388772211",
      customerEmail: "dewi.lestari@gmail.com",
      status: "PAID",
      paymentMethod: "Transfer Bank Mandiri",
      trackingNumber: "",
      courier: "J&T Express",
      createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
      shippingAddress: {
        address: "Jl. Darmo Permai Selatan No. 45",
        city: "Surabaya",
        province: "Jawa Timur",
        postalCode: "60226",
      },
      notes: "Sudah transfer lunas via m-banking Mandiri",
      items: [
        {
          productId: "prod-3",
          title: "The Allure Vegan Leather Structured Tote",
          price: 520000,
          quantity: 1,
          variant: "One Size / Taupe",
          thumbnail: "/src/assets/images/product_vegan_leather_bag_1793090659374.jpg",
        },
      ],
    },
    {
      merchantOrderId: "ASR-ORD-20261025-3319",
      amount: 513000,
      shippingFee: 18000,
      discountAmount: 0,
      customerName: "Fatimah Az-Zahra",
      customerPhone: "081977665544",
      customerEmail: "fatimah.zahra@outlook.com",
      status: "PENDING",
      paymentMethod: "Transfer Bank BCA",
      trackingNumber: "",
      courier: "JNE Reguler",
      createdAt: new Date(Date.now() - 3600000 * 50).toISOString(),
      shippingAddress: {
        address: "Jl. Margonda Raya No. 120, Beji",
        city: "Depok",
        province: "Jawa Barat",
        postalCode: "16424",
      },
      notes: "Mohon konfirmasi rekening transfer BCA",
      items: [
        {
          productId: "prod-5",
          title: "Abaya Minimalist Crinkle Noir Jet Black",
          price: 495000,
          quantity: 1,
          variant: "L / Hitam",
          thumbnail: "/src/assets/images/product_gamis_mulberry_1793090598263.jpg",
        },
      ],
    },
  ];

  try {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(samples));
  } catch (err) {
    console.error("Failed to seed initial orders:", err);
  }
  return samples;
}
