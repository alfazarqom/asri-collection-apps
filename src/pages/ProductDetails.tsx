import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Star,
  ShoppingBag,
  CreditCard,
  Ruler,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronRight,
  Share2,
} from "lucide-react";
import { fetchProducts } from "../services/productApi.ts";
import { Product } from "../data/defaultCatalog.ts";
import { formatRupiah } from "../utils/formatters.ts";
import { useCart } from "../hooks/useCart.ts";
import { SizeGuideModal } from "../components/ui/SizeGuideModal.tsx";
import { RelatedProducts } from "../components/product/RelatedProducts.tsx";
import { Spinner } from "../components/ui/Loader.tsx";

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, showToast } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected purchase state
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"desc" | "care" | "shipping">("desc");

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      setLoading(true);
      try {
        const products = await fetchProducts();
        const foundProduct = products.find((item) => item.slug === id || item.id === id) || null;

        if (!isMounted) return;
        setProduct(foundProduct);
        setAllProducts(products);
        if (foundProduct) {
          setSelectedImage(foundProduct.thumbnail);
          setSelectedSize(foundProduct.sizes[0] || "All Size");
          setSelectedColor(foundProduct.colors[0] || "Default");
          setQuantity(1);
        }
      } catch (err) {
        console.warn("Failed to load product details:", err);
        if (isMounted) {
          setProduct(null);
          setAllProducts([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    void loadProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#1C1917] mb-2">
          Produk Tidak Ditemukan
        </h2>
        <p className="text-xs text-stone-500 mb-6">
          Koleksi busana yang Anda cari mungkin telah habis atau tautan tidak sesuai.
        </p>
        <Link
          to="/products"
          className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#1C1917]"
        >
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    navigate("/cart");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Lihat busana ${product.title} di Asri Collection`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast("Tautan produk berhasil disalin!");
    }
  };

  const colorHexMap: Record<string, string> = {
    Mocca: "#A68A78",
    "Broken White": "#F4F1EA",
    Sage: "#9CAF88",
    Hitam: "#1C1917",
    Taupe: "#8B8579",
    Ivory: "#FFFFF0",
    "Rose Champagne": "#DDB8A6",
    "Deep Navy": "#1B2A4A",
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-[#9A3412]">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link to="/products" className="hover:text-[#9A3412]">
            Katalog
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link
            to={`/products?category=${product.categorySlug}`}
            className="hover:text-[#9A3412] capitalize"
          >
            {product.categorySlug}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[#1C1917] font-semibold truncate max-w-xs">
            {product.title}
          </span>
        </nav>

        {/* Contiguous Purchase Module: Grid Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Gallery Sticky Left */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-[4/3] bg-white border border-[#E7DFD5] overflow-hidden relative shadow-sm">
              <img
                src={selectedImage || product.thumbnail}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {product.discountPercentage && product.discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-[#9A3412] text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 tabular-nums">
                  Diskon {product.discountPercentage}%
                </div>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 border shrink-0 bg-white transition-all overflow-hidden ${
                      selectedImage === img
                        ? "border-[#1C1917] ring-1 ring-[#1C1917]"
                        : "border-[#E7DFD5] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} view ${i + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sticky Purchase Module Right */}
          <div className="lg:col-span-5 bg-white border border-[#E7DFD5] p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                <span className="uppercase tracking-wider font-semibold text-[#9A3412]">
                  {product.categorySlug}
                </span>
                <span className="font-mono text-[11px]">SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917] leading-snug">
                {product.title}
              </h1>

              <div className="flex items-center gap-3 mt-2.5 text-xs text-stone-600">
                {product.rating > 0 && (
                  <>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-[#1C1917] tabular-nums">{product.rating}</span>
                    </div>
                    {product.reviewCount > 0 && <span>{product.reviewCount} Ulasan Pembeli</span>}
                    <span>·</span>
                  </>
                )}
                <span className={product.stock > 0 ? "text-emerald-700 font-medium" : "text-rose-700 font-medium"}>
                  {product.stock > 0 ? `Stok Tersedia: ${product.stock} pcs` : "Stok habis"}
                </span>
              </div>

              {/* Price */}
              <div className="mt-4 pt-4 border-t border-[#E7DFD5] flex items-baseline gap-3">
                <span className="font-serif text-2xl font-bold text-[#1C1917] tabular-nums">
                  {formatRupiah(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-stone-400 line-through tabular-nums">
                    {formatRupiah(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Color Swatch */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Pilihan Warna: <strong className="text-[#1C1917]">{selectedColor}</strong>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => {
                    const isSelected = selectedColor === c;
                    const hex = colorHexMap[c] || "#E7DFD5";
                    return (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs border transition-all ${
                          isSelected
                            ? "border-[#1C1917] bg-[#FAF8F5] font-semibold text-[#1C1917]"
                            : "border-[#E7DFD5] hover:border-stone-400 text-stone-700"
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-stone-300"
                          style={{ backgroundColor: hex }}
                        />
                        <span>{c}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector with Modal Link */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Pilih Ukuran: <strong className="text-[#1C1917]">{selectedSize}</strong>
                  </label>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="flex items-center gap-1 text-xs text-[#9A3412] hover:underline font-medium"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Panduan Ukuran (cm)</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => {
                    const isSelected = selectedSize === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-[42px] px-3 py-2 text-xs text-center border font-semibold transition-all ${
                          isSelected
                            ? "border-[#1C1917] bg-[#1C1917] text-white"
                            : "border-[#E7DFD5] bg-white text-stone-700 hover:border-stone-400"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Jumlah Pesanan
              </label>
              <div className="flex items-center border border-[#E7DFD5] w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-[#F4EFEA] text-stone-700 transition-colors"
                  aria-label="Kurangi jumlah"
                >
                  -
                </button>
                <span className="w-12 text-center text-xs font-bold tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 hover:bg-[#F4EFEA] text-stone-700 transition-colors"
                  aria-label="Tambah jumlah"
                >
                  +
                </button>
              </div>
            </div>

            {/* Dual Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-[#1C1917] bg-white border border-[#1C1917] hover:bg-[#FAF8F5] flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Tambah ke Tas Belanja</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-white bg-[#1C1917] hover:bg-[#9A3412] flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <CreditCard className="w-4 h-4" />
                <span>Beli Sekarang (Guest Checkout)</span>
              </button>
            </div>

            {/* Trust highlights */}
            <div className="pt-4 border-t border-[#E7DFD5] space-y-2 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#9A3412]" />
                <span>Bebas ongkir min. Rp 350.000 ke seluruh Nusantara</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Pembayaran resmi QRIS & Virtual Account Duitku POP</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-stone-500" />
                <span>Garansi tukar ukuran & cacat jahitan 7 hari</span>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#9A3412]"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Bagikan Produk</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabbed Details */}
        <div className="mt-16 bg-white border border-[#E7DFD5]">
          <div className="grid grid-cols-3 border-b border-[#E7DFD5]">
            <button
              onClick={() => setActiveTab("desc")}
              className={`py-3.5 px-2 sm:px-6 text-xs font-bold uppercase tracking-wider text-center transition-colors ${
                activeTab === "desc"
                  ? "border-b-2 border-[#9A3412] text-[#9A3412] bg-[#FAF8F5]"
                  : "text-stone-600 hover:text-[#1C1917]"
              }`}
            >
              Deskripsi
            </button>
            <button
              onClick={() => setActiveTab("care")}
              className={`py-3.5 px-2 sm:px-6 text-xs font-bold uppercase tracking-wider text-center transition-colors ${
                activeTab === "care"
                  ? "border-b-2 border-[#9A3412] text-[#9A3412] bg-[#FAF8F5]"
                  : "text-stone-600 hover:text-[#1C1917]"
              }`}
            >
              Perawatan
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`py-3.5 px-2 sm:px-6 text-xs font-bold uppercase tracking-wider text-center transition-colors ${
                activeTab === "shipping"
                  ? "border-b-2 border-[#9A3412] text-[#9A3412] bg-[#FAF8F5]"
                  : "text-stone-600 hover:text-[#1C1917]"
              }`}
            >
              Pengiriman
            </button>
          </div>

          <div className="p-6 sm:p-8 text-xs sm:text-sm text-stone-600 leading-relaxed">
            {activeTab === "desc" && (
              <div className="space-y-4">
                <p>{product.description}</p>
                {(product.material || product.weightGrams > 0) && (
                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#E7DFD5]">
                    {product.material && (
                      <div>
                        <span className="block font-bold text-[#1C1917]">Komposisi Material:</span>
                        <span className="text-stone-600">{product.material}</span>
                      </div>
                    )}
                    {product.weightGrams > 0 && (
                      <div>
                        <span className="block font-bold text-[#1C1917]">Berat Bersih:</span>
                        <span className="text-stone-600 tabular-nums">{product.weightGrams} gram</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "care" && (
              <div className="space-y-4">
                <h4 className="font-bold text-[#1C1917]">Panduan Merawat Serat Sutra & Katun Poplin:</h4>
                {product.careInstructions ? <p>{product.careInstructions}</p> : <p className="text-stone-500">Petunjuk perawatan belum tersedia.</p>}
                <ul className="list-disc list-inside space-y-1.5 text-stone-600 pt-2">
                  <li>Gunakan detergen cair konsentrat netral tanpa pemutih (bleach).</li>
                  <li>Keringkan di tempat sejuk berangin dan hindari sinar matahari terik langsung.</li>
                  <li>Setrika dari bagian dalam pakaian dengan suhu katun/sutra sedang.</li>
                </ul>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-4">
                <h4 className="font-bold text-[#1C1917]">Layanan Pengiriman Resmi:</h4>
                <p>
                  Pesanan diproses dalam 1x24 jam kerja dari Atelier Butik Asri Collection Jakarta. Pengiriman menggunakan mitra ekspedisi berasuransi (JNE, SiCepat, J&T). Gratis ongkir otomatis untuk pemesanan minimal Rp 350.000.
                </p>
                <h4 className="font-bold text-[#1C1917] pt-2">Metode Pembayaran Resmi:</h4>
                <p>
                  Transaksi resmi aktif dilayani melalui Transfer Bank Resmi (BCA, Mandiri, BRI) dan verifikasi WhatsApp Official CS (+62 821-5676-4434). Modul payment gateway Duitku POP saat ini berada dalam tahap Sandbox (Uji Coba Teknis).
                </p>
                <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-[#9A3412]">
                  <Link to="/shipping-policy" className="hover:underline">
                    Kebijakan Pengiriman &rarr;
                  </Link>
                  <Link to="/refund-policy" className="hover:underline">
                    Garansi Retur 7 Hari & Refund &rarr;
                  </Link>
                  <Link to="/payment-policy" className="hover:underline">
                    Informasi Pembayaran Lengkap &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts
          currentProductId={product.id}
          categorySlug={product.categorySlug}
          allProducts={allProducts}
        />
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        categorySlug={product.categorySlug}
      />
    </div>
  );
};

export default ProductDetails;
