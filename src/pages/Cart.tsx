import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  ShieldCheck,
  CreditCard,
  MessageCircle,
  Truck,
  CheckCircle2,
  Lock,
  ExternalLink,
  Settings,
  X,
  AlertCircle,
} from "lucide-react";
import { useCart } from "../hooks/useCart.ts";
import { CartItem } from "../context/CartContext.tsx";
import {
  formatRupiah,
  generateMerchantOrderId,
  buildWhatsAppOrderMessage,
} from "../utils/formatters.ts";
import { createCheckoutInvoice } from "../services/productApi.ts";
import { Spinner } from "../components/ui/Loader.tsx";

declare global {
  interface Window {
    checkout?: {
      run?: (
        reference: string,
        options?: {
          defaultLanguage?: string;
          currency?: string;
          successEvent?: (result: any) => void;
          pendingEvent?: (result: any) => void;
          errorEvent?: (result: any) => void;
          closeEvent?: (result?: any) => void;
        }
      ) => void;
      process?: (
        reference: string,
        options?: {
          defaultLanguage?: string;
          currency?: string;
          successEvent?: (result: any) => void;
          pendingEvent?: (result: any) => void;
          errorEvent?: (result: any) => void;
          closeEvent?: (result?: any) => void;
        }
      ) => void;
    };
  }
}

export const Cart: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    shippingFee,
    totalAmount,
    totalItems,
    showToast,
  } = useCart();

  const navigate = useNavigate();

  // Guest checkout form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    notes: "",
  });

  const [paymentChoice, setPaymentChoice] = useState<"duitku" | "whatsapp">("whatsapp");
  const [duitkuDisplayMode, setDuitkuDisplayMode] = useState<"redirect" | "popup">("redirect");
  const [couponInput, setCouponInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Duitku credentials modal & inputs
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [merchantCodeInput, setMerchantCodeInput] = useState("");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [serverConfigured, setServerConfigured] = useState<boolean | null>(null);

  // Ready payment link modal (in case browser blocks automatic popup/redirect)
  const [activePaymentUrl, setActivePaymentUrl] = useState<string | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string>("");

  useEffect(() => {
    // Check saved local credentials
    const savedCode = localStorage.getItem("asri_duitku_merchant_code") || "";
    const savedKey = localStorage.getItem("asri_duitku_api_key") || "";
    if (savedCode) setMerchantCodeInput(savedCode);
    if (savedKey) setApiKeyInput(savedKey);

    // Check server status
    fetch("/api/duitku/config-status")
      .then((res) => res.json())
      .then((data) => setServerConfigured(data.configured))
      .catch(() => setServerConfigured(false));
  }, []);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Nama lengkap wajib diisi";
    if (!formData.phone.trim()) {
      errors.phone = "Nomor WhatsApp aktif wajib diisi";
    } else if (formData.phone.replace(/\D/g, "").length < 9) {
      errors.phone = "Nomor WhatsApp minimal 9 digit";
    }
    if (!formData.address.trim()) errors.address = "Alamat jalan wajib diisi";
    if (!formData.city.trim()) errors.city = "Kota / Kabupaten wajib diisi";
    if (!formData.province.trim()) errors.province = "Provinsi wajib diisi";
    if (!formData.postalCode.trim()) errors.postalCode = "Kode pos wajib diisi";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponInput("");
    }
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (merchantCodeInput.trim()) {
      localStorage.setItem("asri_duitku_merchant_code", merchantCodeInput.trim());
    }
    if (apiKeyInput.trim()) {
      localStorage.setItem("asri_duitku_api_key", apiKeyInput.trim());
    }
    setShowConfigModal(false);
    showToast("Kredensial Duitku berhasil disimpan.");
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast("Tas belanja Anda masih kosong.", "error");
      return;
    }

    if (!validateForm()) {
      showToast("Mohon lengkapi formulir pengiriman dengan benar.", "error");
      return;
    }

    setIsSubmitting(true);
    const merchantOrderId = generateMerchantOrderId();

    const orderPayload = {
      merchantOrderId,
      amount: totalAmount,
      shippingFee,
      discountAmount,
      productDetails: `Asri Collection: ${cart.map((i: CartItem) => i.product.title).join(", ")}`,
      customerName: formData.name.trim(),
      customerEmail: formData.email.trim() || `${formData.phone.replace(/\D/g, "")}@asricollection.id`,
      customerPhone: formData.phone.trim(),
      merchantCode: merchantCodeInput.trim() || undefined,
      apiKey: apiKeyInput.trim() || undefined,
      shippingAddress: {
        address: formData.address.trim(),
        city: formData.city.trim(),
        province: formData.province.trim(),
        postalCode: formData.postalCode.trim(),
      },
      notes: formData.notes.trim(),
      items: cart.map((item: CartItem) => ({
        productId: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        variant: `${item.selectedSize} / ${item.selectedColor}`,
        thumbnail: item.product.thumbnail,
      })),
    };

    if (paymentChoice === "whatsapp") {
      // Direct WhatsApp Order
      await createCheckoutInvoice(orderPayload);
      clearCart();
      setIsSubmitting(false);

      const waMsg = buildWhatsAppOrderMessage({
        orderId: merchantOrderId,
        customerName: formData.name.trim(),
        customerPhone: formData.phone.trim(),
        customerAddress: `${formData.address}, ${formData.city}, ${formData.province} ${formData.postalCode}`,
        notes: formData.notes.trim(),
        items: cart.map((i: CartItem) => ({
          title: i.product.title,
          quantity: i.quantity,
          price: i.product.price,
          variant: `${i.selectedSize} - ${i.selectedColor}`,
        })),
        subtotal,
        discount: discountAmount,
        shippingFee,
        total: totalAmount,
        couponCode: appliedCoupon || undefined,
      });

      const waUrl = `https://wa.me/6282156764434?text=${waMsg}`;
      window.open(waUrl, "_blank");
      navigate(`/orders?orderId=${merchantOrderId}`);
      return;
    }

    // Duitku POP Payment Flow
    try {
      showToast("Menghubungi Edge Function Duitku...", "info");
      const result = await createCheckoutInvoice(orderPayload);

      if (result.success && result.reference) {
        clearCart();
        setActiveOrderId(merchantOrderId);
        const paymentToken = result.reference;

        const officialPaymentUrl =
          result.paymentUrl ||
          `https://app-sandbox.duitku.com/redirect_checkout?reference=${paymentToken}&lang=id`;
        setActivePaymentUrl(officialPaymentUrl);

        // Eksekusi Duitku POP JS library via window.checkout.run(reference)
        if (window.checkout) {
          const runCheckout = typeof window.checkout.run === "function"
            ? window.checkout.run
            : window.checkout.process;

          if (typeof runCheckout === "function") {
            showToast("Membuka pop-up resmi Duitku POP...", "info");
            runCheckout(paymentToken, {
              defaultLanguage: "id",
              currency: "IDR",
              successEvent: function (res: any) {
                console.log("[Duitku POP] Payment Success:", res);
                showToast("Pembayaran berhasil diverifikasi!", "success");
                navigate(`/orders?orderId=${merchantOrderId}`);
              },
              pendingEvent: function (res: any) {
                console.log("[Duitku POP] Payment Pending:", res);
                showToast("Menunggu penyelesaian pembayaran.", "info");
                navigate(`/orders?orderId=${merchantOrderId}`);
              },
              errorEvent: function (res: any) {
                console.log("[Duitku POP] Payment Error:", res);
                showToast("Pembayaran gagal atau dibatalkan.", "error");
                navigate(`/orders?orderId=${merchantOrderId}`);
              },
              closeEvent: function (res?: any) {
                console.log("[Duitku POP] Popup Closed by user:", res);
                navigate(`/orders?orderId=${merchantOrderId}`);
              },
            });
            return;
          }
        }

        // Fallback jika pustaka popup JS belum terpasang di window
        if (officialPaymentUrl) {
          showToast("Membuka halaman pembayaran Duitku...", "success");
          const opened = window.open(officialPaymentUrl, "_blank");
          if (!opened) {
            window.location.href = officialPaymentUrl;
          }
        }
      } else {
        showToast(
          result.message ||
            "Gagal mendapatkan payment token Duitku. Pastikan DUITKU_MERCHANT_CODE dan DUITKU_API_KEY terdaftar.",
          "error"
        );
        setShowConfigModal(true);
      }
    } catch (err: any) {
      showToast(err.message || "Gagal memproses pembayaran Duitku.", "error");
      setShowConfigModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && !activePaymentUrl) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-16 px-4">
        <div className="max-w-2xl mx-auto bg-white border border-[#E7DFD5] p-10 text-center shadow-xs">
          <h1 className="font-serif text-2xl font-bold text-[#1C1917] mb-2">
            Tas Belanja Anda Kosong
          </h1>
          <p className="text-xs text-stone-500 max-w-md mx-auto mb-6">
            Jelajahi koleksi busana muslimah kontemporer kami dan temukan busana yang tepat untuk Anda.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 py-3 px-8 text-xs font-bold uppercase tracking-wider text-white bg-[#1C1917] hover:bg-[#9A3412] transition-colors"
          >
            <span>Mulai Belanja</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#9A3412]">
              Langkah Cepat (Guest Checkout)
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#1C1917] mt-1">
              Konfirmasi Pesanan & Pembayaran
            </h1>
          </div>

          <button
            onClick={() => setShowConfigModal(true)}
            className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-[#9A3412] bg-white border border-[#E7DFD5] px-3 py-1.5"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Kredensial Duitku {serverConfigured ? "✓" : ""}</span>
          </button>
        </div>

        {/* Modal Buka Halaman Duitku jika sudah terbentuk */}
        {activePaymentUrl && (
          <div className="mb-8 p-6 bg-emerald-50 border border-emerald-300 shadow-sm animate-in fade-in">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <span>Invoice Duitku POP Berhasil Diterbitkan!</span>
                </div>
                <p className="text-xs text-emerald-800 mt-1 max-w-xl">
                  Nomor Pesanan: <strong>{activeOrderId}</strong>. Halaman pembayaran Duitku telah disiapkan. Klik tombol di bawah jika tab pembayaran tidak terbuka otomatis:
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <a
                    href={activePaymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-5 text-xs font-bold uppercase tracking-wider text-white bg-[#9A3412] hover:bg-[#7C2D12] inline-flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <span>Buka Halaman Pembayaran Duitku</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => navigate(`/orders?orderId=${activeOrderId}`)}
                    className="py-2.5 px-4 text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:bg-stone-50"
                  >
                    Lihat Status di Lacak Pesanan
                  </button>
                </div>
              </div>
              <button
                onClick={() => setActivePaymentUrl(null)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Kolom Kiri: Formulir Guest Checkout Mandiri */}
          <div className="lg:col-span-7 bg-white border border-[#E7DFD5] p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#1C1917] pb-2 border-b border-[#E7DFD5]">
                1. Data Pengiriman Pesanan
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Tanpa perlu registrasi akun, isi rincian kontak & alamat pengiriman Anda:
              </p>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nama Lengkap Pembeli *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Siti Aisyah"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3 py-2 text-xs border ${
                      formErrors.name ? "border-rose-500" : "border-[#E7DFD5]"
                    } focus:outline-none focus:border-[#9A3412]`}
                  />
                  {formErrors.name && (
                    <p className="text-[11px] text-rose-600 mt-0.5">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    No. WhatsApp Aktif *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="081234567890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-3 py-2 text-xs border ${
                      formErrors.phone ? "border-rose-500" : "border-[#E7DFD5]"
                    } focus:outline-none focus:border-[#9A3412]`}
                  />
                  {formErrors.phone && (
                    <p className="text-[11px] text-rose-600 mt-0.5">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email (Opsional untuk tanda terima)
                </label>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E7DFD5] focus:outline-none focus:border-[#9A3412]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Alamat Lengkap Pengiriman *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`w-full px-3 py-2 text-xs border ${
                    formErrors.address ? "border-rose-500" : "border-[#E7DFD5]"
                  } focus:outline-none focus:border-[#9A3412]`}
                />
                {formErrors.address && (
                  <p className="text-[11px] text-rose-600 mt-0.5">{formErrors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Kota / Kabupaten *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jakarta Selatan"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={`w-full px-3 py-2 text-xs border ${
                      formErrors.city ? "border-rose-500" : "border-[#E7DFD5]"
                    } focus:outline-none focus:border-[#9A3412]`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Provinsi *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="DKI Jakarta"
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className={`w-full px-3 py-2 text-xs border ${
                      formErrors.province ? "border-rose-500" : "border-[#E7DFD5]"
                    } focus:outline-none focus:border-[#9A3412]`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Kode Pos *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="12430"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className={`w-full px-3 py-2 text-xs border ${
                      formErrors.postalCode ? "border-rose-500" : "border-[#E7DFD5]"
                    } focus:outline-none focus:border-[#9A3412]`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Catatan Khusus Pesanan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Misal: Mohon kirimkan sebelum akhir pekan"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E7DFD5] focus:outline-none focus:border-[#9A3412]"
                />
              </div>

              {/* Payment Method Selector */}
              <div className="pt-4 border-t border-[#E7DFD5]">
                <h3 className="font-serif text-base font-bold text-[#1C1917] mb-3">
                  2. Pilih Metode Pembayaran
                </h3>

                <div className="space-y-3">
                  {/* Option 1: WhatsApp Official CS & Transfer Bank Resmi (Aktif & Rekomendasi) */}
                  <div
                    onClick={() => setPaymentChoice("whatsapp")}
                    className={`p-4 border cursor-pointer transition-all ${
                      paymentChoice === "whatsapp"
                        ? "border-[#9A3412] bg-[#FAF8F5] ring-1 ring-[#9A3412]"
                        : "border-[#E7DFD5] bg-white hover:border-stone-400"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentChoice"
                        checked={paymentChoice === "whatsapp"}
                        onChange={() => setPaymentChoice("whatsapp")}
                        className="mt-1 text-[#9A3412]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1C1917]">
                            WhatsApp Official CS & Transfer Bank Resmi
                          </span>
                          <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-300">
                            Metode Aktif & Resmi
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600 mt-1">
                          Pesanan langsung terkonfirmasi dengan tim CS butik (+62 821-5676-4434). Pembayaran ditransfer ke rekening resmi butik (BCA, Mandiri, BRI) atau QRIS resmi.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Option 2: Duitku POP (Sandbox / Mode Uji Coba) */}
                  <div
                    onClick={() => setPaymentChoice("duitku")}
                    className={`p-4 border cursor-pointer transition-all ${
                      paymentChoice === "duitku"
                        ? "border-[#9A3412] bg-[#FAF8F5] ring-1 ring-[#9A3412]"
                        : "border-[#E7DFD5] bg-white hover:border-stone-400"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentChoice"
                        checked={paymentChoice === "duitku"}
                        onChange={() => setPaymentChoice("duitku")}
                        className="mt-1 text-[#9A3412]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1C1917]">
                            Simulasi Duitku POP Gateway (Mode Sandbox)
                          </span>
                          <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-50 px-2 py-0.5 border border-amber-300">
                            Tahap Sandbox / Uji Coba
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-1">
                          Integrasi payment gateway Duitku POP saat ini berada dalam tahap Sandbox (Uji Coba Teknis / Simulasi Pengembang). Bukan metode pembayaran riil aktif.
                        </p>

                        {/* Pilihan Mode Tampilan Duitku */}
                        {paymentChoice === "duitku" && (
                          <div className="mt-3 pt-3 border-t border-[#E7DFD5] flex flex-wrap items-center gap-3">
                            <span className="text-[11px] font-semibold text-stone-600">
                              Mode Tampilan:
                            </span>
                            <label className="flex items-center gap-1.5 text-xs text-stone-700 cursor-pointer">
                              <input
                                type="radio"
                                name="duitkuMode"
                                checked={duitkuDisplayMode === "redirect"}
                                onChange={() => setDuitkuDisplayMode("redirect")}
                              />
                              <span>Halaman Duitku (Redirect Sandbox)</span>
                            </label>
                            <label className="flex items-center gap-1.5 text-xs text-stone-700 cursor-pointer">
                              <input
                                type="radio"
                                name="duitkuMode"
                                checked={duitkuDisplayMode === "popup"}
                                onChange={() => setDuitkuDisplayMode("popup")}
                              />
                              <span>Pop-up Duitku (Modal Sandbox)</span>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button & Legal Policy Links */}
              <div className="pt-4 space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 text-xs font-bold uppercase tracking-wider text-white bg-[#1C1917] hover:bg-[#9A3412] transition-colors flex items-center justify-center gap-2 disabled:opacity-75 shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" className="border-white" />
                      <span>Memproses Pesanan...</span>
                    </>
                  ) : paymentChoice === "whatsapp" ? (
                    <>
                      <MessageCircle className="w-4 h-4" />
                      <span>Kirim Pesanan ke WhatsApp Official ({formatRupiah(totalAmount)})</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        Simulasi Bayar via Duitku Sandbox ({formatRupiah(totalAmount)})
                      </span>
                    </>
                  )}
                </button>

                {/* Consent & Policy Links */}
                <p className="text-[11px] text-stone-500 text-center leading-relaxed">
                  Dengan mengonfirmasi pesanan, Anda menyetujui{" "}
                  <Link to="/terms" className="underline text-stone-700 hover:text-[#9A3412]">
                    Syarat & Ketentuan
                  </Link>
                  ,{" "}
                  <Link to="/privacy-policy" className="underline text-stone-700 hover:text-[#9A3412]">
                    Kebijakan Privasi
                  </Link>
                  ,{" "}
                  <Link to="/shipping-policy" className="underline text-stone-700 hover:text-[#9A3412]">
                    Kebijakan Pengiriman
                  </Link>
                  ,{" "}
                  <Link to="/refund-policy" className="underline text-stone-700 hover:text-[#9A3412]">
                    Kebijakan Retur & Refund
                  </Link>
                  , dan{" "}
                  <Link to="/payment-policy" className="underline text-stone-700 hover:text-[#9A3412]">
                    Informasi Pembayaran
                  </Link>{" "}
                  Asri Collection.
                </p>
              </div>
            </form>
          </div>

          {/* Kolom Kanan: Ringkasan Item & Kupon */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E7DFD5] p-6 space-y-4">
              <h2 className="font-serif text-lg font-bold text-[#1C1917] pb-2 border-b border-[#E7DFD5]">
                Ringkasan Belanja ({totalItems} item)
              </h2>

              {/* Itemized List */}
              <div className="divide-y divide-[#E7DFD5] max-h-72 overflow-y-auto pr-1">
                {cart.map((item: CartItem) => (
                  <div key={item.id} className="py-3 flex gap-3">
                    <img
                      src={item.product.thumbnail ?? ""}
                      alt={item.product.title}
                      referrerPolicy="no-referrer"
                      className="w-14 h-16 object-cover border border-[#E7DFD5] bg-[#FAF8F5] shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-semibold text-[#1C1917] line-clamp-1">
                            {item.product.title}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-stone-400 hover:text-rose-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-stone-500">
                          {item.selectedSize} · {item.selectedColor}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="text-stone-500 tabular-nums">
                          {item.quantity} x {formatRupiah(item.product.price)}
                        </span>
                        <span className="font-bold text-[#1C1917] tabular-nums">
                          {formatRupiah(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Kupon Voucher Input */}
              <div className="pt-3 border-t border-[#E7DFD5]">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Kupon: {appliedCoupon}</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-rose-700 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Kode kupon (ASRI10 / ASRI20)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs border border-[#E7DFD5] bg-white focus:outline-none focus:border-[#9A3412]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold text-white bg-stone-800 hover:bg-[#9A3412] transition-colors"
                    >
                      Klaim
                    </button>
                  </form>
                )}
              </div>

              {/* Rincian Finansial */}
              <div className="pt-3 border-t border-[#E7DFD5] space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal Pesanan</span>
                  <span className="font-semibold text-[#1C1917] tabular-nums">
                    {formatRupiah(subtotal)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Diskon Voucher ({appliedCoupon})</span>
                    <span className="tabular-nums">-{formatRupiah(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Biaya Pengiriman</span>
                  <span className="font-semibold text-[#1C1917] tabular-nums">
                    {shippingFee === 0 ? "GRATIS" : formatRupiah(shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-[#1C1917] border-t border-[#E7DFD5] pt-3">
                  <span>Total yang Harus Dibayar</span>
                  <span className="text-base text-[#9A3412] tabular-nums">
                    {formatRupiah(totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Jaminan Transaksi Butik & Kebijakan */}
            <div className="bg-[#FAF8F5] border border-[#E7DFD5] p-4 space-y-2.5 text-xs text-stone-600">
              <div className="flex items-center gap-2 text-[#9A3412] font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Jaminan Transaksi Asri Collection</span>
              </div>
              <ul className="space-y-1 text-[11px] text-stone-600">
                <li>• <strong>Garansi 7 Hari:</strong> Pengembalian & tukar ukuran ditangani langsung oleh Asri Collection.</li>
                <li>• <strong>Gratis Ongkir:</strong> Berlaku otomatis untuk pemesanan minimal Rp 350.000.</li>
                <li>• <strong>Metode Aktif:</strong> Transfer Bank Resmi & verifikasi WhatsApp CS (+62 821-5676-4434).</li>
              </ul>
              <div className="pt-2 border-t border-[#E7DFD5] flex flex-wrap items-center gap-2 text-[11px]">
                <Link to="/shipping-policy" className="text-[#9A3412] hover:underline">
                  Pengiriman
                </Link>
                <span className="text-stone-300">·</span>
                <Link to="/refund-policy" className="text-[#9A3412] hover:underline">
                  Retur & Refund
                </Link>
                <span className="text-stone-300">·</span>
                <Link to="/payment-policy" className="text-[#9A3412] hover:underline">
                  Pembayaran
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Konfigurasi Kredensial Duitku */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#E7DFD5] max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7DFD5]">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#9A3412]" />
                <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                  Konfigurasi Kredensial Duitku POP
                </h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-stone-600 space-y-2 leading-relaxed">
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  Berdasarkan dokumentasi resmi Duitku POP (<code className="font-mono">docs.duitku.com/pop/id</code>), pembuatan invoice riil dan pembukaan halaman pembayaran memerlukan <strong>Merchant Code</strong> dan <strong>API Key</strong> dari dashboard akun Sandbox Duitku Anda.
                </span>
              </div>
              <p>
                Jika Anda memiliki akun Sandbox Duitku, masukkan di bawah ini untuk langsung membuat transaksi live Sandbox:
              </p>
            </div>

            <form onSubmit={handleSaveCredentials} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  DUITKU_MERCHANT_CODE (contoh: DS12345)
                </label>
                <input
                  type="text"
                  placeholder="DSXXXX"
                  value={merchantCodeInput}
                  onChange={(e) => setMerchantCodeInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E7DFD5] font-mono focus:outline-none focus:border-[#9A3412]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  DUITKU_API_KEY (32 karakter hex)
                </label>
                <input
                  type="password"
                  placeholder="e959ecbf0e7e1f57da8fc635b719463c"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E7DFD5] font-mono focus:outline-none focus:border-[#9A3412]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:bg-stone-100"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#1C1917] hover:bg-[#9A3412] transition-colors"
                >
                  Simpan Kredensial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
