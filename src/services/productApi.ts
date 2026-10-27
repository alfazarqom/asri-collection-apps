import { supabase, isSupabaseConfigured } from "../lib/supabase.ts";
import {
  Category,
  Product,
  OFFICIAL_CATEGORIES,
  OFFICIAL_PRODUCTS,
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

export function getCustomProducts(): Product[] {
  try {
    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(OFFICIAL_PRODUCTS));
    return OFFICIAL_PRODUCTS;
  } catch {
    return OFFICIAL_PRODUCTS;
  }
}

export function saveCustomProduct(prod: Product): Product[] {
  const all = getCustomProducts();
  const exists = all.findIndex((p) => p.id === prod.id);
  let updated: Product[];
  if (exists >= 0) {
    updated = [...all];
    updated[exists] = prod;
  } else {
    updated = [prod, ...all];
  }
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteCustomProduct(id: string): Product[] {
  const all = getCustomProducts();
  const updated = all.filter((p) => p.id !== id);
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));
  return updated;
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

const PRODUCTS_ENDPOINT = `${(import.meta.env.VITE_SUPABASE_URL || "https://mvwflakurihhakdrlteg.supabase.co").replace(/\\/+$/, "")}/functions/v1/get-bonsoir-products`;

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean)
    : [];
}

function asPrice(value: unknown): number | null {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\\u0300-\\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function mapProductRow(row: Record<string, unknown>): Product {
  const id = asString(row.id);
  const title = asString(row.title) || "Produk tanpa judul";
  const basePrice = asPrice(row.price) ?? 0;
  const salePrice = asPrice(row.sale_price);
  const hasValidSale = salePrice !== null && salePrice > 0 && basePrice > 0 && salePrice < basePrice;
  const labels = asStringArray(row.labels);
  const categorySlug = slugify(asString(row.category)) || "uncategorized";
  const primaryImage = asString(row.image_url);
  const images = [...new Set([primaryImage, ...asStringArray(row.additional_image_urls)].filter(Boolean))];
  const availability = asString(row.availability).toLowerCase();
  const soldOutLabel = labels.some((label) => ["sold out", "out of stock"].includes(label.toLowerCase()));
  const rawStock = typeof row.stock_quantity === "number" ? row.stock_quantity : Number(row.stock_quantity);
  const stock = availability === "out of stock" || soldOutLabel
    ? 0
    : Number.isFinite(rawStock) && rawStock >= 0 ? rawStock : 0;

  return {
    id,
    slug: `${slugify(title) || "product"}-${id.slice(0, 8)}`,
    title,
    description: asString(row.description),
    price: hasValidSale ? salePrice! : basePrice,
    originalPrice: hasValidSale ? basePrice : undefined,
    discountPercentage: hasValidSale ? Math.round(((basePrice - salePrice!) / basePrice) * 100) : 0,
    rating: 0,
    reviewCount: 0,
    categorySlug,
    thumbnail: primaryImage || images[0] || "",
    images,
    sizes: asStringArray(row.sizes),
    colors: asStringArray(row.colors),
    stock,
    sku: asString(row.sku),
    isFeatured: labels.some((label) => ["featured", "best seller", "bestseller"].includes(label.toLowerCase())),
    isNew: labels.some((label) => ["new in", "new arrival", "new"].includes(label.toLowerCase())),
    weightGrams: 0,
    material: "",
    careInstructions: "",
  };
}

export async function fetchProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const response = await fetch(PRODUCTS_ENDPOINT, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Gagal mengambil produk (HTTP ${response.status}).`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error("Kontrak get-bonsoir-products tidak valid: respons harus berupa array produk.");
  }

  let filtered = (payload as Record<string, unknown>[])
    .filter((row) => row && typeof row === "object" && typeof row.id === "string")
    .map(mapProductRow);

  if (filters.categorySlug && filters.categorySlug !== "all") {
    filtered = filtered.filter((product) => product.categorySlug === filters.categorySlug);
  }

  if (filters.search?.trim()) {
    const query = filters.search.toLowerCase().trim();
    filtered = filtered.filter((product) =>
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.material.toLowerCase().includes(query) ||
      product.categorySlug.toLowerCase().includes(query)
    );
  }

  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    filtered = filtered.filter((product) => product.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
    filtered = filtered.filter((product) => product.price <= filters.maxPrice!);
  }
  if (filters.inStockOnly) {
    filtered = filtered.filter((product) => product.stock > 0);
  }

  switch (filters.sortBy) {
    case "price-asc":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
    case "rating":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case "featured":
    default:
      filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
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
