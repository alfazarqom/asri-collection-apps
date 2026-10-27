import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  LogOut,
  Package,
  TrendingUp,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  MessageCircle,
  Eye,
  X,
  Save,
  Check,
  AlertCircle,
  ExternalLink,
  Tag,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Delete,
  Hash,
  UploadCloud,
  Image as ImageIcon,
  Minus,
  Loader2,
} from "lucide-react";
import {
  Product,
  OFFICIAL_PRODUCTS,
} from "../data/defaultCatalog.ts";
import {
  getCustomProducts,
  saveCustomProduct,
  deleteCustomProduct,
  getLocalOrdersHistory,
  updateOrderInLocalHistory,
  deleteOrderFromLocalHistory,
  seedInitialOrdersIfEmpty,
} from "../services/productApi.ts";
import { formatRupiah, formatDate } from "../utils/formatters.ts";

const DEFAULT_PIN = "677677";
const PIN_STORAGE_KEY = "asri_admin_pin";
const AUTH_STORAGE_KEY = "asri_admin_authenticated";

// Cloudinary Unsigned Upload Configuration
const CLOUDINARY_CLOUD_NAME = "jpyctmos";
const CLOUDINARY_UPLOAD_PRESET = "preset";

async function uploadImageToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `Gagal mengunggah gambar ke Cloudinary (HTTP ${res.status})`
    );
  }

  const data = await res.json();
  return data.secure_url || data.url;
}

export const Admin: React.FC = () => {
  // Authentication & PIN State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === "true";
  });
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinChangeMsg, setPinChangeMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Active Admin View Tab
  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders");

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [editingTracking, setEditingTracking] = useState<{ orderId: string; trackingNumber: string; courier: string } | null>(null);

  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showAdminToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cloudinary Upload & Multi-Image State
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState<string | null>(null);

  // Handlers for product images (+) (-) and Cloudinary
  const handleAddImageUrlSlot = () => {
    if (!editingProduct) return;
    const current = Array.isArray(editingProduct.images) ? [...editingProduct.images] : [];
    const updated = [...current, ""];
    setEditingProduct({
      ...editingProduct,
      images: updated,
      thumbnail: editingProduct.thumbnail || updated[0] || "",
    });
  };

  const handleRemoveImageSlot = (idx: number) => {
    if (!editingProduct) return;
    const current = Array.isArray(editingProduct.images) ? [...editingProduct.images] : [];
    const removedUrl = current[idx];
    const updated = current.filter((_, i) => i !== idx);
    let newThumbnail = editingProduct.thumbnail;
    if (editingProduct.thumbnail === removedUrl) {
      newThumbnail = updated[0] || "";
    }
    setEditingProduct({
      ...editingProduct,
      images: updated,
      thumbnail: newThumbnail,
    });
  };

  const handleUpdateImageUrl = (idx: number, url: string) => {
    if (!editingProduct) return;
    const current = Array.isArray(editingProduct.images) ? [...editingProduct.images] : [];
    const isOldThumb = current[idx] === editingProduct.thumbnail;
    current[idx] = url;
    setEditingProduct({
      ...editingProduct,
      images: current,
      thumbnail: isOldThumb || !editingProduct.thumbnail ? url : editingProduct.thumbnail,
    });
  };

  const handleSetAsThumbnail = (url: string) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      thumbnail: url,
    });
    showAdminToast("Foto sampul utama (thumbnail) berhasil diatur.");
  };

  const handleUseExampleUnsplash = () => {
    if (!editingProduct) return;
    const sampleImages = [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
    ];
    setEditingProduct({
      ...editingProduct,
      images: sampleImages,
      thumbnail: sampleImages[0],
    });
    showAdminToast("2 Contoh gambar Unsplash berhasil dimuat!");
  };

  const handleProductImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    replaceIndex?: number
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingProduct) return;

    setIsUploadingImage(true);
    setUploadProgressText("Mengunggah foto ke Cloudinary (jpyctmos)...");

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgressText(
          `Mengunggah gambar ${i + 1} dari ${files.length} ke Cloudinary...`
        );
        const url = await uploadImageToCloudinary(file);
        uploadedUrls.push(url);
      }

      const current = Array.isArray(editingProduct.images) ? [...editingProduct.images] : [];

      if (replaceIndex !== undefined && replaceIndex >= 0 && uploadedUrls.length === 1) {
        current[replaceIndex] = uploadedUrls[0];
        const newThumbnail =
          editingProduct.thumbnail === editingProduct.images?.[replaceIndex] ||
          !editingProduct.thumbnail
            ? uploadedUrls[0]
            : editingProduct.thumbnail;
        setEditingProduct({
          ...editingProduct,
          images: current,
          thumbnail: newThumbnail,
        });
        showAdminToast("Foto berhasil diganti via Cloudinary!");
      } else {
        const merged = [...current, ...uploadedUrls];
        const newThumbnail = editingProduct.thumbnail || uploadedUrls[0] || "";
        setEditingProduct({
          ...editingProduct,
          images: merged,
          thumbnail: newThumbnail,
        });
        showAdminToast(`${uploadedUrls.length} foto berhasil diunggah ke Cloudinary!`);
      }
    } catch (err: any) {
      console.error("Cloudinary upload failed:", err);
      alert(`Gagal upload ke Cloudinary: ${err.message}`);
    } finally {
      setIsUploadingImage(false);
      setUploadProgressText(null);
      e.target.value = "";
    }
  };

  // Load initial data
  const loadData = useCallback(() => {
    const loadedOrders = seedInitialOrdersIfEmpty();
    setOrders(loadedOrders);
    setProducts(getCustomProducts());
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  // Handle PIN Keypad Click
  const handleKeypadPress = (digit: string) => {
    if (pinInput.length < 6) {
      const nextPin = pinInput + digit;
      setPinInput(nextPin);
      setPinError(null);

      if (nextPin.length === 6) {
        verifyPin(nextPin);
      }
    }
  };

  const handleKeypadBackspace = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setPinError(null);
  };

  const handleKeypadClear = () => {
    setPinInput("");
    setPinError(null);
  };

  const verifyPin = (enteredPin: string) => {
    const currentStoredPin = localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_PIN;
    if (enteredPin === currentStoredPin) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
      setIsAuthenticated(true);
      setPinInput("");
      setPinError(null);
    } else {
      setIsShaking(true);
      setPinError("Kode PIN tidak valid. Silakan coba kembali.");
      setTimeout(() => {
        setIsShaking(false);
        setPinInput("");
      }, 600);
    }
  };

  // Keyboard support for NumberPad
  useEffect(() => {
    if (isAuthenticated) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleKeypadPress(e.key);
      } else if (e.key === "Backspace") {
        handleKeypadBackspace();
      } else if (e.key === "Escape") {
        handleKeypadClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthenticated, pinInput]);

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    setPinInput("");
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(newPin)) {
      setPinChangeMsg({ type: "error", text: "PIN baru harus terdiri dari tepat 6 digit angka." });
      return;
    }
    if (newPin !== confirmPin) {
      setPinChangeMsg({ type: "error", text: "Konfirmasi PIN tidak cocok." });
      return;
    }

    localStorage.setItem(PIN_STORAGE_KEY, newPin);
    setPinChangeMsg({ type: "success", text: "Kode PIN 6-digit berhasil diperbarui!" });
    setTimeout(() => {
      setShowChangePinModal(false);
      setNewPin("");
      setConfirmPin("");
      setPinChangeMsg(null);
      showAdminToast("PIN Keamanan baru disimpan.");
    }, 1200);
  };

  // Order Actions
  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    updateOrderInLocalHistory(orderId, { status: newStatus });
    setOrders((prev) =>
      prev.map((o) => (o.merchantOrderId === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder?.merchantOrderId === orderId) {
      setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }));
    }
    showAdminToast(`Status pesanan ${orderId} diubah menjadi ${newStatus}`);
  };

  const handleSaveTrackingNumber = (orderId: string, trackingNumber: string, courier: string) => {
    updateOrderInLocalHistory(orderId, { trackingNumber: trackingNumber.trim(), courier });
    setOrders((prev) =>
      prev.map((o) =>
        o.merchantOrderId === orderId
          ? { ...o, trackingNumber: trackingNumber.trim(), courier }
          : o
      )
    );
    setEditingTracking(null);
    showAdminToast(`Nomor resi ${trackingNumber} berhasil disimpan.`);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm(`Yakin ingin menghapus pesanan ${orderId}?`)) {
      const updated = deleteOrderFromLocalHistory(orderId);
      setOrders(updated);
      if (selectedOrder?.merchantOrderId === orderId) {
        setSelectedOrder(null);
      }
      showAdminToast(`Pesanan ${orderId} berhasil dihapus.`);
    }
  };

  // WhatsApp template dispatch
  const handleSendWhatsAppUpdate = (order: any) => {
    const phone = order.customerPhone.replace(/\D/g, "");
    const formattedPhone = phone.startsWith("0") ? "62" + phone.slice(1) : phone;

    let statusText = "sedang dipersiapkan oleh tim atelier kami";
    if (order.status === "PAID") statusText = "telah kami terima pembayarannya dan masuk tahap antrian QC";
    if (order.status === "PROCESSED") statusText = "sedang dikemas secara aman dengan zipper bag butik";
    if (order.status === "SHIPPED") statusText = `telah dikirim via ${order.courier || "ekspedisi resmi"} dengan nomor resi: *${order.trackingNumber || "segera diupdate"}*`;
    if (order.status === "COMPLETED") statusText = "telah selesai dan tiba di alamat tujuan Anda";

    const msg = encodeURIComponent(
      `Halo Kak ${order.customerName},\n\nTerima kasih telah berbelanja di *Asri Collection*. Kami menginfokan bahwa pesanan dengan ID *${order.merchantOrderId}* ${statusText}.\n\nTotal: ${formatRupiah(order.amount)}\nItem: ${order.items?.map((i: any) => `${i.title} (${i.variant || "Standar"}) x${i.quantity}`).join(", ")}\n\nJika ada pertanyaan mengenai pesanan Anda, silakan balas pesan ini. Terima kasih! 🌸`
    );

    window.open(`https://wa.me/${formattedPhone}?text=${msg}`, "_blank");
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSearch =
        order.merchantOrderId?.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.customerPhone?.includes(orderSearch);

      const matchStatus =
        orderStatusFilter === "ALL" || order.status?.toUpperCase() === orderStatusFilter;

      return matchSearch && matchStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // Product Actions
  const handleSaveProductSubmit = (productData: Product) => {
    const updated = saveCustomProduct(productData);
    setProducts(updated);
    setEditingProduct(null);
    setIsAddingProduct(false);
    showAdminToast(`Produk "${productData.title}" berhasil disimpan.`);
  };

  const handleDeleteProduct = (productId: string, title: string) => {
    if (window.confirm(`Yakin ingin menghapus produk "${title}"?`)) {
      const updated = deleteCustomProduct(productId);
      setProducts(updated);
      showAdminToast(`Produk "${title}" telah dihapus.`);
    }
  };

  const handleToggleProductFeatured = (prod: Product) => {
    const updated = saveCustomProduct({ ...prod, isFeatured: !prod.isFeatured });
    setProducts(updated);
    showAdminToast(
      `Status Unggulan "${prod.title}" diubah ke ${!prod.isFeatured ? "Aktif" : "Nonaktif"}`
    );
  };

  const handleToggleProductStock = (prod: Product) => {
    const newStock = prod.stock > 0 ? 0 : 25;
    const updated = saveCustomProduct({ ...prod, stock: newStock });
    setProducts(updated);
    showAdminToast(
      `Stok "${prod.title}" diubah menjadi ${newStock > 0 ? "Tersedia (25)" : "Habis (0)"}`
    );
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku?.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.material.toLowerCase().includes(productSearch.toLowerCase());
      return matchSearch;
    });
  }, [products, productSearch]);

  // ==========================================
  // VIEW: 6-Digit NumberPad Authentication
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4 selection:bg-[#9A3412] selection:text-white">
        <div className="max-w-md w-full bg-white border border-[#E7DFD5] shadow-lg p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#FAF8F5] border border-[#E7DFD5] text-[#9A3412] flex items-center justify-center mx-auto rounded-full">
              <Lock className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#9A3412] block">
              Area Terproteksi
            </span>
            <h1 className="font-serif text-2xl font-bold text-[#1C1917]">
              Asri Collection Admin
            </h1>
            <p className="text-xs text-stone-500">
              Masukkan 6 digit kode PIN keamanan untuk mengakses panel manajemen butik.
            </p>
          </div>

          {/* 6 Digit PIN Display */}
          <div className={`space-y-3 ${isShaking ? "animate-bounce" : ""}`}>
            <div className="flex justify-center items-center gap-3">
              {[0, 1, 2, 3, 4, 5].map((index) => {
                const filled = index < pinInput.length;
                return (
                  <div
                    key={index}
                    className={`w-9 h-11 border-2 flex items-center justify-center text-lg font-bold transition-all ${
                      filled
                        ? "border-[#9A3412] bg-[#FAF8F5] text-[#9A3412]"
                        : "border-[#E7DFD5] bg-white text-stone-300"
                    }`}
                  >
                    {filled ? "•" : ""}
                  </div>
                );
              })}
            </div>

            {pinError ? (
              <p className="text-xs text-rose-600 text-center font-medium animate-pulse">
                {pinError}
              </p>
            ) : (
              <p className="text-[11px] text-stone-400 text-center">
                PIN Default: <code className="font-mono font-bold text-stone-700">677677</code>
              </p>
            )}
          </div>

          {/* Interactive NumberPad */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeypadPress(num.toString())}
                className="py-3 text-lg font-bold text-[#1C1917] bg-[#FAF8F5] hover:bg-[#F4EFEA] active:bg-[#E7DFD5] border border-[#E7DFD5] transition-colors flex items-center justify-center select-none"
              >
                {num}
              </button>
            ))}

            <button
              type="button"
              onClick={handleKeypadClear}
              className="py-3 text-xs font-bold uppercase tracking-wider text-stone-500 bg-white hover:bg-stone-50 border border-[#E7DFD5] transition-colors flex items-center justify-center select-none"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={() => handleKeypadPress("0")}
              className="py-3 text-lg font-bold text-[#1C1917] bg-[#FAF8F5] hover:bg-[#F4EFEA] active:bg-[#E7DFD5] border border-[#E7DFD5] transition-colors flex items-center justify-center select-none"
            >
              0
            </button>

            <button
              type="button"
              onClick={handleKeypadBackspace}
              className="py-3 text-xs font-bold uppercase tracking-wider text-[#9A3412] bg-white hover:bg-rose-50 border border-[#E7DFD5] transition-colors flex items-center justify-center select-none"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>

          <div className="pt-2 text-center">
            <span className="text-[10px] text-stone-400">
              Dapat diketik langsung melalui keyboard atau tombol nomor di atas
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: Admin Control Panel Dashboard
  // ==========================================
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] pb-16 selection:bg-[#9A3412] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1C1917] text-white py-2.5 px-4 text-xs font-medium border-l-4 border-[#9A3412] shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Bar */}
      <header className="bg-white border-b border-[#E7DFD5] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#FAF8F5] border border-[#E7DFD5] text-[#9A3412] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-base sm:text-lg font-bold text-[#1C1917]">
                  Asri Collection
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-300">
                  Panel Pengelola
                </span>
              </div>
              <span className="text-[11px] text-stone-500 block">
                Manajemen Pesanan & Produk Butik
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowChangePinModal(true)}
              className="py-1.5 px-3 text-xs font-semibold text-stone-700 bg-[#FAF8F5] hover:bg-[#F4EFEA] border border-[#E7DFD5] transition-colors flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#9A3412]" />
              <span className="hidden sm:inline">Ubah PIN</span>
            </button>

            <button
              onClick={handleLogout}
              className="py-1.5 px-3 text-xs font-bold text-white bg-[#1C1917] hover:bg-[#9A3412] transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Kunci / Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-24 md:pb-12 space-y-6">
        {/* Quick Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E7DFD5] p-4 space-y-1">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Total Pesanan Masuk
            </span>
            <div className="text-xl sm:text-2xl font-serif font-bold text-[#1C1917]">
              {orders.length}
            </div>
            <span className="text-[10px] text-stone-400">
              {orders.filter((o) => o.status === "PAID" || o.status === "PROCESSED").length} perlu diproses
            </span>
          </div>

          <div className="bg-white border border-[#E7DFD5] p-4 space-y-1">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Total Omzet Transaksi
            </span>
            <div className="text-lg sm:text-xl font-bold text-[#9A3412] tabular-nums">
              {formatRupiah(orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0))}
            </div>
            <span className="text-[10px] text-emerald-700">Akumulasi seluruh status</span>
          </div>

          <div className="bg-white border border-[#E7DFD5] p-4 space-y-1">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Katalog Produk Aktif
            </span>
            <div className="text-xl sm:text-2xl font-serif font-bold text-[#1C1917]">
              {products.length} Busana
            </div>
            <span className="text-[10px] text-stone-400">
              {products.filter((p) => p.stock === 0).length} produk stok kosong
            </span>
          </div>

        </div>

        {/* Tab Switcher */}
        <div className="hidden md:flex border-b border-[#E7DFD5] bg-white">
          <button
            onClick={() => setActiveTab("orders")}
            className={`py-3.5 px-6 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === "orders"
                ? "border-[#9A3412] text-[#9A3412] bg-[#FAF8F5]"
                : "border-transparent text-stone-600 hover:text-[#1C1917]"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Kelola Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`py-3.5 px-6 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === "products"
                ? "border-[#9A3412] text-[#9A3412] bg-[#FAF8F5]"
                : "border-transparent text-stone-600 hover:text-[#1C1917]"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Katalog Products ({products.length})</span>
          </button>

        </div>

        {/* ==================================================== */}
        {/* TAB 1: KELOLA ORDERS                                 */}
        {/* ==================================================== */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="bg-white border border-[#E7DFD5] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="text"
                  placeholder="Cari ID Pesanan, Nama Pembeli, No WhatsApp..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[#E7DFD5] bg-[#FAF8F5] focus:outline-none focus:border-[#9A3412]"
                />
              </div>

              {/* Status Chips */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {["ALL", "PENDING", "PAID", "PROCESSED", "SHIPPED", "COMPLETED", "CANCELLED"].map(
                  (st) => {
                    const count =
                      st === "ALL"
                        ? orders.length
                        : orders.filter((o) => o.status === st).length;
                    const active = orderStatusFilter === st;
                    return (
                      <button
                        key={st}
                        onClick={() => setOrderStatusFilter(st)}
                        className={`px-2.5 py-1 text-xs font-semibold transition-colors ${
                          active
                            ? "bg-[#1C1917] text-white"
                            : "bg-[#FAF8F5] text-stone-600 hover:bg-[#F4EFEA] border border-[#E7DFD5]"
                        }`}
                      >
                        {st} ({count})
                      </button>
                    );
                  }
                )}
              </div>
            </div>

                        {/* Orders Mobile Card View (sm:hidden) */}
            <div className="sm:hidden space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="bg-white border border-[#E7DFD5] p-8 text-center text-xs text-stone-500">
                  Tidak ada pesanan yang sesuai dengan filter.
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const isPending = order.status === "PENDING";
                  const isPaid = order.status === "PAID";
                  const isProcessed = order.status === "PROCESSED";
                  const isShipped = order.status === "SHIPPED";
                  const isCompleted = order.status === "COMPLETED";

                  return (
                    <div
                      key={order.merchantOrderId}
                      className="bg-white border border-[#E7DFD5] p-4 space-y-3 shadow-xs"
                    >
                      {/* Card Header: Order ID, Date, & Status Dropdown */}
                      <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[#E7DFD5]">
                        <div>
                          <span className="font-mono font-bold text-xs text-[#1C1917] block">
                            {order.merchantOrderId}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>

                        {/* Quick Status Dropdown */}
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleUpdateOrderStatus(order.merchantOrderId, e.target.value)
                          }
                          className={`text-[10px] font-bold py-1 px-2 border focus:outline-none uppercase ${
                            isPending
                              ? "bg-amber-50 text-amber-800 border-amber-300"
                              : isPaid
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : isProcessed
                              ? "bg-blue-50 text-blue-800 border-blue-300"
                              : isShipped
                              ? "bg-purple-50 text-purple-800 border-purple-300"
                              : isCompleted
                              ? "bg-stone-100 text-stone-800 border-stone-300"
                              : "bg-rose-50 text-rose-800 border-rose-300"
                          }`}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PAID">PAID</option>
                          <option value="PROCESSED">PROCESSED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </div>

                      {/* Customer & Destination */}
                      <div className="flex items-center justify-between text-xs gap-2">
                        <div>
                          <span className="font-bold text-[#1C1917] block text-xs">
                            {order.customerName}
                          </span>
                          <span className="text-[11px] text-stone-500 block">
                            {order.shippingAddress?.city || "Kota tujuan"}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSendWhatsAppUpdate(order)}
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 border border-emerald-200 transition-colors shrink-0"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WA Pembeli</span>
                        </button>
                      </div>

                      {/* Items List */}
                      <div className="bg-[#FAF8F5] p-2.5 border border-[#E7DFD5] space-y-1.5 text-xs">
                        <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
                          Item Dipesan:
                        </span>
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-[11px]">
                            <span className="font-medium text-[#1C1917] truncate max-w-[200px]">
                              {item.title} <span className="text-stone-400">({item.variant || "Standar"})</span>
                            </span>
                            <span className="text-stone-600 font-semibold shrink-0">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Total & Payment */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <div>
                          <span className="text-[10px] text-stone-400 block uppercase">Total Transaksi</span>
                          <span className="font-bold text-[#9A3412] text-sm tabular-nums">
                            {formatRupiah(order.amount)}
                          </span>
                        </div>
                        <span className="text-[10px] font-medium bg-stone-100 text-stone-700 px-2 py-1 border border-stone-200">
                          {order.paymentMethod || "Transfer Rekening"}
                        </span>
                      </div>

                      {/* Resi Pengiriman Editor */}
                      <div className="pt-2 border-t border-[#E7DFD5] text-xs">
                        {editingTracking?.orderId === order.merchantOrderId ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              placeholder="No. Resi JNE / SiCepat..."
                              value={editingTracking?.trackingNumber || ""}
                              onChange={(e) =>
                                setEditingTracking({
                                  orderId: order.merchantOrderId,
                                  courier: editingTracking?.courier || "JNE Reguler",
                                  trackingNumber: e.target.value,
                                })
                              }
                              className="flex-1 px-2 py-1 text-xs border border-[#9A3412] bg-white font-mono"
                            />
                            <button
                              onClick={() =>
                                handleSaveTrackingNumber(
                                  order.merchantOrderId,
                                  editingTracking?.trackingNumber || "",
                                  editingTracking?.courier || "JNE Reguler"
                                )
                              }
                              className="px-2.5 py-1 bg-[#9A3412] text-white hover:bg-[#7C2D12] text-xs font-semibold flex items-center gap-1"
                            >
                              <Save className="w-3 h-3" />
                              <span>Simpan</span>
                            </button>
                            <button
                              onClick={() => setEditingTracking(null)}
                              className="p-1 text-stone-400 hover:text-stone-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Truck className="w-3.5 h-3.5 text-stone-400" />
                              {order.trackingNumber ? (
                                <span className="font-mono text-xs font-semibold text-stone-800 bg-stone-100 px-2 py-0.5 border border-stone-200">
                                  {order.trackingNumber}
                                </span>
                              ) : (
                                <span className="text-[11px] text-stone-400 italic">Belum ada nomor resi</span>
                              )}
                            </div>
                            <button
                              onClick={() =>
                                setEditingTracking({
                                  orderId: order.merchantOrderId,
                                  trackingNumber: order.trackingNumber || "",
                                  courier: order.courier || "JNE Reguler",
                                })
                              }
                              className="text-[11px] text-[#9A3412] font-semibold hover:underline inline-flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>{order.trackingNumber ? "Ubah Resi" : "Input Resi"}</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#E7DFD5]">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="py-1.5 px-3 text-xs font-semibold text-stone-700 bg-[#FAF8F5] hover:bg-[#F4EFEA] border border-[#E7DFD5] flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Rincian Lengkap</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteOrder(order.merchantOrderId)}
                          className="py-1.5 px-3 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Orders Desktop Table (hidden sm:block) */}
            <div className="hidden sm:block bg-white border border-[#E7DFD5] overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] border-b border-[#E7DFD5] text-stone-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Order ID & Waktu</th>
                    <th className="py-3 px-4">Pelanggan</th>
                    <th className="py-3 px-4">Item & Varian</th>
                    <th className="py-3 px-4">Total & Metode</th>
                    <th className="py-3 px-4">Status Pesanan</th>
                    <th className="py-3 px-4">Nomor Resi Ekspedisi</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7DFD5] text-stone-700">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-stone-500">
                        Tidak ada pesanan yang sesuai dengan filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const isPending = order.status === "PENDING";
                      const isPaid = order.status === "PAID";
                      const isProcessed = order.status === "PROCESSED";
                      const isShipped = order.status === "SHIPPED";
                      const isCompleted = order.status === "COMPLETED";

                      return (
                        <tr key={order.merchantOrderId} className="hover:bg-stone-50/70 transition-colors">
                          {/* Order ID & Time */}
                          <td className="py-3 px-4 font-mono font-bold text-[#1C1917] whitespace-nowrap">
                            <div>{order.merchantOrderId}</div>
                            <span className="text-[10px] text-stone-400 font-sans font-normal block">
                              {formatDate(order.createdAt)}
                            </span>
                          </td>

                          {/* Customer info */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <strong className="block text-[#1C1917]">{order.customerName}</strong>
                            <span className="text-stone-500 font-mono text-[11px] block">
                              {order.customerPhone}
                            </span>
                            <span className="text-[10px] text-stone-400">
                              {order.shippingAddress?.city || "Kota"}
                            </span>
                          </td>

                          {/* Items summary */}
                          <td className="py-3 px-4 max-w-xs">
                            <div className="space-y-1">
                              {order.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                                  <span className="font-semibold text-[#1C1917] truncate max-w-[150px]">
                                    {item.title}
                                  </span>
                                  <span className="text-stone-400 shrink-0">x{item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </td>

                          {/* Total amount & Payment */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="font-bold text-[#9A3412] tabular-nums block">
                              {formatRupiah(order.amount)}
                            </span>
                            <span className="text-[10px] text-stone-500">
                              {order.paymentMethod || "Transfer Rekening"}
                            </span>
                          </td>

                          {/* Status Dropdown */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleUpdateOrderStatus(order.merchantOrderId, e.target.value)
                              }
                              className={`text-[11px] font-bold py-1 px-2 border focus:outline-none uppercase ${
                                isPending
                                  ? "bg-amber-50 text-amber-800 border-amber-300"
                                  : isPaid
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                  : isProcessed
                                  ? "bg-blue-50 text-blue-800 border-blue-300"
                                  : isShipped
                                  ? "bg-purple-50 text-purple-800 border-purple-300"
                                  : isCompleted
                                  ? "bg-stone-100 text-stone-800 border-stone-300"
                                  : "bg-rose-50 text-rose-800 border-rose-300"
                              }`}
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="PAID">PAID</option>
                              <option value="PROCESSED">PROCESSED</option>
                              <option value="SHIPPED">SHIPPED</option>
                              <option value="COMPLETED">COMPLETED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </td>

                          {/* Tracking number & Courier */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            {editingTracking?.orderId === order.merchantOrderId ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  placeholder="No. Resi JNE/SiCepat..."
                                  value={editingTracking?.trackingNumber || ""}
                                  onChange={(e) =>
                                    setEditingTracking({
                                      orderId: order.merchantOrderId,
                                      courier: editingTracking?.courier || "JNE Reguler",
                                      trackingNumber: e.target.value,
                                    })
                                  }
                                  className="w-32 px-2 py-1 text-xs border border-[#9A3412] bg-white font-mono"
                                />
                                <button
                                  onClick={() =>
                                    handleSaveTrackingNumber(
                                      order.merchantOrderId,
                                      editingTracking?.trackingNumber || "",
                                      editingTracking?.courier || "JNE Reguler"
                                    )
                                  }
                                  className="p-1 bg-[#9A3412] text-white hover:bg-[#7C2D12]"
                                  title="Simpan Resi"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingTracking(null)}
                                  className="p-1 text-stone-400 hover:text-stone-700"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                {order.trackingNumber ? (
                                  <span className="font-mono text-xs font-semibold text-stone-800 bg-stone-100 px-2 py-0.5 border border-stone-200">
                                    {order.trackingNumber}
                                  </span>
                                ) : (
                                  <span className="text-[11px] text-stone-400 italic">
                                    Belum ada resi
                                  </span>
                                )}
                                <button
                                  onClick={() =>
                                    setEditingTracking({
                                      orderId: order.merchantOrderId,
                                      trackingNumber: order.trackingNumber || "",
                                      courier: order.courier || "JNE Reguler",
                                    })
                                  }
                                  className="text-stone-400 hover:text-[#9A3412]"
                                  title="Input / Edit Resi"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                            <button
                              onClick={() => handleSendWhatsAppUpdate(order)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 border border-emerald-200"
                              title="Kirim pesan status otomatis ke WhatsApp pelanggan"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </button>

                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-1 text-stone-500 hover:text-[#1C1917]"
                              title="Lihat Detail Pesanan"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteOrder(order.merchantOrderId)}
                              className="p-1 text-stone-400 hover:text-rose-700"
                              title="Hapus Pesanan"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: KELOLA PRODUCTS                               */}
        {/* ==================================================== */}
        {activeTab === "products" && (
          <div className="space-y-4">
            {/* Header Action Bar */}
            <div className="bg-white border border-[#E7DFD5] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Cari judul busana, SKU, bahan..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-[#E7DFD5] bg-[#FAF8F5] focus:outline-none focus:border-[#9A3412]"
                  />
                </div>

</div>

              <button
                onClick={() => {
                  setEditingProduct({
                    id: `prod-${Date.now()}`,
                    slug: `busana-${Date.now().toString().slice(-4)}`,
                    title: "",
                    description: "",
                    price: 350000,
                    originalPrice: 420000,
                    discountPercentage: 15,
                    rating: 4.9,
                    reviewCount: 10,
                    thumbnail: "/src/assets/images/product_gamis_mulberry_1793090598263.jpg",
                    images: ["/src/assets/images/product_gamis_mulberry_1793090598263.jpg"],
                    sizes: ["S", "M", "L", "XL"],
                    colors: ["Mocca", "Broken White", "Sage"],
                    stock: 25,
                    sku: `ASR-BUS-${Math.floor(100 + Math.random() * 900)}`,
                    isFeatured: false,
                    isNew: true,
                    weightGrams: 350,
                    material: "100% Grade-A Mulberry Silk",
                    careInstructions: "Cuci dengan tangan, gunakan detergen cair lembut.",
                  });
                  setIsAddingProduct(true);
                }}
                className="py-2 px-4 text-xs font-bold uppercase tracking-wider text-white bg-[#9A3412] hover:bg-[#7C2D12] transition-colors flex items-center justify-center gap-2 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Busana Baru</span>
              </button>
            </div>

                        {/* Products Mobile Card View (sm:hidden) */}
            <div className="sm:hidden space-y-3">
              {filteredProducts.length === 0 ? (
                <div className="bg-white border border-[#E7DFD5] p-8 text-center text-xs text-stone-500">
                  Tidak ada produk yang sesuai dengan filter pencarian.
                </div>
              ) : (
                filteredProducts.map((p) => {
                  return (
                    <div
                      key={p.id}
                      className="bg-white border border-[#E7DFD5] p-3.5 space-y-3 shadow-xs"
                    >
                      <div className="flex gap-3">
                        <img
                          src={p.thumbnail}
                          alt={p.title}
                          referrerPolicy="no-referrer"
                          className="w-16 h-20 object-cover border border-[#E7DFD5] bg-[#FAF8F5] shrink-0"
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
<span className="font-mono text-[10px] text-stone-400">
                              {p.sku}
                            </span>
                          </div>
                          <h4 className="font-serif font-bold text-xs text-[#1C1917] line-clamp-1">
                            {p.title}
                          </h4>
                          <div className="flex items-baseline gap-2">
                            <span className="font-bold text-[#9A3412] text-xs tabular-nums">
                              {formatRupiah(p.price)}
                            </span>
                            {p.originalPrice && (
                              <span className="text-[10px] text-stone-400 line-through tabular-nums">
                                {formatRupiah(p.originalPrice)}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-500 truncate">
                            {p.material}
                          </p>
                        </div>
                      </div>

                      {/* Quick Status Toggles on Mobile Card */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#E7DFD5] text-xs">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggleProductStock(p)}
                            className={`px-2 py-1 text-[10px] font-bold border transition-colors ${
                              p.stock > 0
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                : "bg-rose-50 text-rose-800 border-rose-300"
                            }`}
                          >
                            {p.stock > 0 ? `Stok: ${p.stock}` : "Stok: Habis"}
                          </button>

                          <button
                            onClick={() => handleToggleProductFeatured(p)}
                            className={`px-2 py-1 text-[10px] font-semibold border transition-colors ${
                              p.isFeatured
                                ? "bg-amber-100 text-amber-900 border-amber-300 font-bold"
                                : "bg-stone-100 text-stone-500 border-stone-200"
                            }`}
                          >
                            {p.isFeatured ? "★ Unggulan" : "Biasa"}
                          </button>

                          {p.isNew && (
                            <span className="px-1.5 py-1 text-[9px] font-bold bg-[#1C1917] text-white">
                              BARU
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsAddingProduct(false);
                            }}
                            className="py-1 px-2.5 text-[11px] font-semibold text-stone-700 bg-[#FAF8F5] hover:bg-[#F4EFEA] border border-[#E7DFD5] flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(p.id, p.title)}
                            className="p-1 text-rose-600 hover:text-rose-800 bg-rose-50 border border-rose-200"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Products Desktop Table (hidden sm:block) */}
            <div className="hidden sm:block bg-white border border-[#E7DFD5] overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] border-b border-[#E7DFD5] text-stone-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Busana</th>
<th className="py-3 px-4">Harga & Diskon</th>
                    <th className="py-3 px-4">Stok</th>
                    <th className="py-3 px-4">Label & Unggulan</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7DFD5]">
                  {filteredProducts.map((p) => {
                    return (
                      <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.thumbnail}
                              alt={p.title}
                              referrerPolicy="no-referrer"
                              className="w-12 h-14 object-cover border border-[#E7DFD5] bg-[#FAF8F5] shrink-0"
                            />
                            <div>
                              <strong className="block text-[#1C1917] line-clamp-1">{p.title}</strong>
                              <span className="font-mono text-[10px] text-stone-400">{p.sku}</span>
                              <span className="text-[11px] text-stone-500 block truncate max-w-xs">
                                {p.material}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-bold text-[#9A3412] tabular-nums block">
                            {formatRupiah(p.price)}
                          </span>
                          {p.originalPrice && (
                            <span className="text-[10px] text-stone-400 line-through tabular-nums">
                              {formatRupiah(p.originalPrice)}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleProductStock(p)}
                            className={`px-2 py-0.5 text-[10px] font-bold border ${
                              p.stock > 0
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                : "bg-rose-50 text-rose-800 border-rose-300"
                            }`}
                            title="Klik untuk ubah stok (Tersedia / Habis)"
                          >
                            {p.stock > 0 ? `Tersedia (${p.stock})` : "Habis (0)"}
                          </button>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap space-x-1.5">
                          <button
                            onClick={() => handleToggleProductFeatured(p)}
                            className={`px-2 py-0.5 text-[10px] font-semibold border ${
                              p.isFeatured
                                ? "bg-amber-100 text-amber-900 border-amber-300 font-bold"
                                : "bg-stone-100 text-stone-500 border-stone-200"
                            }`}
                            title="Toggle Koleksi Unggulan"
                          >
                            {p.isFeatured ? "★ Unggulan" : "Biasa"}
                          </button>

                          {p.isNew && (
                            <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#1C1917] text-white">
                              Baru
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsAddingProduct(false);
                            }}
                            className="p-1.5 text-stone-600 hover:text-[#9A3412] bg-[#FAF8F5] border border-[#E7DFD5]"
                            title="Edit Produk"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(p.id, p.title)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 bg-rose-50 border border-rose-200"
                            title="Hapus Produk"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* ==================================================== */}
      {/* BOTTOMNAV MOBILE (orders, products)                    */}
      {/* ==================================================== */}
      <nav
        aria-label="Navigasi Pengelola Butik"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E7DFD5] shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      >
        <div className="grid grid-cols-2 h-16 max-w-md mx-auto">
          {/* 1. Orders */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("orders");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`flex flex-col items-center justify-center gap-1 transition-all relative select-none ${
              activeTab === "orders"
                ? "text-[#9A3412] font-bold"
                : "text-stone-500 hover:text-stone-800 font-medium"
            }`}
          >
            <div className="relative">
              <Package className="w-5 h-5" />
              {orders.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#9A3412] text-white text-[9px] font-bold px-1 rounded-full min-w-4 text-center leading-3.5">
                  {orders.length}
                </span>
              )}
            </div>
            <span className="text-[11px] tracking-tight">Orders</span>
            {activeTab === "orders" && (
              <span className="absolute bottom-0 w-10 h-0.5 bg-[#9A3412] rounded-full" />
            )}
          </button>

          {/* 3. Products */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("products");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`flex flex-col items-center justify-center gap-1 transition-all relative select-none ${
              activeTab === "products"
                ? "text-[#9A3412] font-bold"
                : "text-stone-500 hover:text-stone-800 font-medium"
            }`}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {products.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-stone-700 text-white text-[9px] font-bold px-1 rounded-full min-w-4 text-center leading-3.5">
                  {products.length}
                </span>
              )}
            </div>
            <span className="text-[11px] tracking-tight">Products</span>
            {activeTab === "products" && (
              <span className="absolute bottom-0 w-10 h-0.5 bg-[#9A3412] rounded-full" />
            )}
          </button>
        </div>
      </nav>

      {/* ==================================================== */}
      {/* MODAL: DETAIL PESANAN LENGKAP                        */}
      {/* ==================================================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#E7DFD5] max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7DFD5]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A3412]">
                  Rincian Transaksi
                </span>
                <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                  {selectedOrder.merchantOrderId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#FAF8F5] p-4 border border-[#E7DFD5]">
              <div>
                <strong className="text-stone-700 block mb-1">Informasi Penerima:</strong>
                <p className="font-bold text-[#1C1917]">{selectedOrder.customerName}</p>
                <p className="font-mono text-stone-600">{selectedOrder.customerPhone}</p>
                <p className="text-stone-500">{selectedOrder.customerEmail}</p>
              </div>

              <div>
                <strong className="text-stone-700 block mb-1">Alamat Tujuan Pengiriman:</strong>
                <p className="text-stone-600">
                  {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city},{" "}
                  {selectedOrder.shippingAddress?.province} {selectedOrder.shippingAddress?.postalCode}
                </p>
                {selectedOrder.notes && (
                  <p className="mt-1 text-amber-800 italic">
                    Catatan: &quot;{selectedOrder.notes}&quot;
                  </p>
                )}
              </div>
            </div>

            {/* Itemized List */}
            <div>
              <h4 className="text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-2">
                Daftar Busana Dipesan:
              </h4>
              <div className="border border-[#E7DFD5] divide-y divide-[#E7DFD5]">
                {selectedOrder.items?.map((item: any, i: number) => (
                  <div key={i} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-10 h-12 object-cover border border-[#E7DFD5] bg-[#FAF8F5]"
                      />
                      <div>
                        <strong className="block text-[#1C1917]">{item.title}</strong>
                        <span className="text-[11px] text-stone-500">
                          {item.variant || "Standar"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-stone-500">
                        {item.quantity} x {formatRupiah(item.price)}
                      </span>
                      <strong className="block text-[#1C1917] tabular-nums">
                        {formatRupiah(item.price * item.quantity)}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total breakdown */}
            <div className="pt-2 border-t border-[#E7DFD5] flex justify-between items-center text-xs">
              <span className="font-semibold text-stone-600">Total Pembayaran:</span>
              <span className="font-bold text-base text-[#9A3412] tabular-nums">
                {formatRupiah(selectedOrder.amount)}
              </span>
            </div>

            <div className="pt-4 flex flex-wrap justify-end gap-3">
              <button
                onClick={() => handleSendWhatsAppUpdate(selectedOrder)}
                className="py-2 px-4 text-xs font-bold uppercase tracking-wider text-white bg-emerald-700 hover:bg-emerald-800 transition-colors flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Kirim Notifikasi WhatsApp</span>
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="py-2 px-4 text-xs font-semibold text-stone-700 bg-[#FAF8F5] hover:bg-[#F4EFEA] border border-[#E7DFD5]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: TAMBAH / EDIT PRODUK                          */}
      {/* ==================================================== */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#E7DFD5] max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7DFD5]">
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                {isAddingProduct ? "Tambah Busana Baru" : `Edit Busana: ${editingProduct.title}`}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProductSubmit(editingProduct);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Judul Busana *
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.title}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      title: e.target.value,
                      slug: isAddingProduct
                        ? e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-|-$/g, "")
                        : editingProduct.slug,
                    })
                  }
                  className="w-full px-3 py-2 border border-[#E7DFD5] bg-white focus:outline-none focus:border-[#9A3412]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Slug URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.slug}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, slug: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-[#E7DFD5] bg-white font-mono"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Harga Jual (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-[#E7DFD5] bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Harga Coret / Asli (Rp)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        originalPrice: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-3 py-2 border border-[#E7DFD5] bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Stok Fisik (Unit) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-[#E7DFD5] bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Komposisi Bahan / Serat *
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.material}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, material: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-[#E7DFD5] bg-white"
                />
              </div>

              {/* Cloudinary Multi-Image Upload & (+) (-) Manager */}
              <div className="p-4 bg-[#FAF8F5] border border-[#E7DFD5] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7DFD5] pb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#9A3412]" />
                      <strong className="text-xs font-bold text-[#1C1917] uppercase tracking-wider">
                        Foto Busana & Galeri ({editingProduct.images?.length || 0} Gambar)
                      </strong>
                    </div>
                    <span className="text-[10px] text-stone-500">
                      Cloudinary: <code className="font-mono text-stone-700">jpyctmos</code> · Preset: <code className="font-mono text-stone-700">preset</code>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Cloudinary Upload File Input */}
                    <label className={`py-1.5 px-3 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors flex items-center gap-1.5 cursor-pointer ${isUploadingImage ? "opacity-60 cursor-not-allowed" : ""}`}>
                      {isUploadingImage ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <UploadCloud className="w-3.5 h-3.5" />
                      )}
                      <span>{isUploadingImage ? "Mengunggah..." : "Upload Cloudinary"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={isUploadingImage}
                        onChange={(e) => handleProductImageUpload(e)}
                        className="hidden"
                      />
                    </label>

                    {/* (+) Add Empty Slot Button */}
                    <button
                      type="button"
                      onClick={handleAddImageUrlSlot}
                      className="py-1.5 px-2.5 text-xs font-bold text-[#1C1917] bg-white hover:bg-stone-50 border border-[#E7DFD5] flex items-center gap-1"
                      title="Tambah slot URL gambar baru (+)"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#9A3412]" />
                      <span>(+) URL</span>
                    </button>

                    {/* Unsplash Example Button */}
                    <button
                      type="button"
                      onClick={handleUseExampleUnsplash}
                      className="py-1.5 px-2 text-[11px] font-semibold text-stone-600 bg-white hover:bg-stone-50 border border-[#E7DFD5]"
                      title="Gunakan contoh 2 foto Unsplash"
                    >
                      Contoh Unsplash
                    </button>
                  </div>
                </div>

                {/* Progress Text */}
                {isUploadingImage && uploadProgressText && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#9A3412]" />
                    <span>{uploadProgressText}</span>
                  </div>
                )}

                {/* Image List Items */}
                {(!editingProduct.images || editingProduct.images.length === 0) ? (
                  <div className="py-6 text-center border border-dashed border-[#E7DFD5] bg-white p-4 space-y-2">
                    <ImageIcon className="w-8 h-8 text-stone-300 mx-auto" />
                    <p className="text-xs text-stone-500">
                      Belum ada foto busana. Klik tombol <strong>Upload Cloudinary</strong> atau <strong>(+) URL</strong> untuk menambahkan foto.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {editingProduct.images.map((imgUrl, idx) => {
                      const isThumbnail = editingProduct.thumbnail === imgUrl && Boolean(imgUrl);
                      return (
                        <div
                          key={idx}
                          className={`p-2.5 bg-white border flex flex-col sm:flex-row items-start sm:items-center gap-3 transition-colors ${
                            isThumbnail ? "border-[#9A3412] ring-1 ring-[#9A3412]/30" : "border-[#E7DFD5]"
                          }`}
                        >
                          {/* Image Thumbnail Preview */}
                          <div className="relative w-14 h-16 bg-stone-100 border border-[#E7DFD5] shrink-0 overflow-hidden flex items-center justify-center">
                            {imgUrl ? (
                              <img
                                src={imgUrl}
                                alt={`Foto ${idx + 1}`}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-stone-300" />
                            )}
                            <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] text-center font-mono">
                              #{idx + 1}
                            </span>
                          </div>

                          {/* URL Input & Controls */}
                          <div className="flex-1 w-full space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-stone-700">
                                Foto #{idx + 1} {isThumbnail && (
                                  <span className="text-[10px] font-bold uppercase text-white bg-[#9A3412] px-1.5 py-0.5 ml-1">
                                    ★ Sampul Utama
                                  </span>
                                )}
                              </span>
                              {!isThumbnail && imgUrl && (
                                <button
                                  type="button"
                                  onClick={() => handleSetAsThumbnail(imgUrl)}
                                  className="text-[10px] font-bold text-[#9A3412] hover:underline"
                                >
                                  Jadikan Sampul
                                </button>
                              )}
                            </div>
                            <input
                              type="text"
                              required
                              placeholder="https://images.unsplash.com/... atau URL Cloudinary"
                              value={imgUrl}
                              onChange={(e) => handleUpdateImageUrl(idx, e.target.value)}
                              className="w-full px-2.5 py-1 text-xs border border-[#E7DFD5] bg-[#FAF8F5] font-mono focus:outline-none focus:border-[#9A3412]"
                            />
                          </div>

                          {/* Action Buttons: Replace via Cloudinary & (-) Remove */}
                          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                            <label
                              className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 cursor-pointer"
                              title="Ganti foto ini dengan upload Cloudinary"
                            >
                              <UploadCloud className="w-3.5 h-3.5" />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleProductImageUpload(e, idx)}
                                className="hidden"
                              />
                            </label>

                            <button
                              type="button"
                              onClick={() => handleRemoveImageSlot(idx)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 transition-colors"
                              title="Hapus foto ini (-)"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Deskripsi Lengkap Busana *
                </label>
                <textarea
                  required
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-[#E7DFD5] bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Petunjuk Perawatan Busana
                </label>
                <input
                  type="text"
                  value={editingProduct.careInstructions}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, careInstructions: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-[#E7DFD5] bg-white"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isFeatured}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })
                    }
                    className="text-[#9A3412]"
                  />
                  <span className="font-semibold text-stone-700">Koleksi Unggulan (Featured)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isNew}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, isNew: e.target.checked })
                    }
                    className="text-[#9A3412]"
                  />
                  <span className="font-semibold text-stone-700">Koleksi Baru (New Arrival)</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#E7DFD5]">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="py-2.5 px-4 text-xs font-semibold text-stone-700 bg-[#FAF8F5] hover:bg-[#F4EFEA] border border-[#E7DFD5]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 text-xs font-bold uppercase tracking-wider text-white bg-[#1C1917] hover:bg-[#9A3412] transition-colors"
                >
                  Simpan Busana
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: UBAH PIN 6-DIGIT                              */}
      {/* ==================================================== */}
      {showChangePinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#E7DFD5] max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7DFD5]">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#9A3412]" />
                <h3 className="font-serif text-base font-bold text-[#1C1917]">
                  Ubah Kode PIN Admin
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowChangePinModal(false);
                  setPinChangeMsg(null);
                }}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePinSubmit} className="space-y-3 text-xs">
              <p className="text-stone-500 text-[11px]">
                Masukkan 6 digit angka baru untuk menggantikan PIN default (677677).
              </p>

              {pinChangeMsg && (
                <div
                  className={`p-2.5 text-xs font-medium border ${
                    pinChangeMsg.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                      : "bg-rose-50 text-rose-800 border-rose-300"
                  }`}
                >
                  {pinChangeMsg.text}
                </div>
              )}

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  PIN Baru (6 Digit) *
                </label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  placeholder="******"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-3 py-2 border border-[#E7DFD5] bg-white font-mono text-center tracking-widest text-base"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Konfirmasi PIN Baru *
                </label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  placeholder="******"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-3 py-2 border border-[#E7DFD5] bg-white font-mono text-center tracking-widest text-base"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePinModal(false);
                    setPinChangeMsg(null);
                  }}
                  className="py-2 px-3 text-xs text-stone-600 bg-stone-100 hover:bg-stone-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 text-xs font-bold text-white bg-[#9A3412] hover:bg-[#7C2D12]"
                >
                  Simpan PIN Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
