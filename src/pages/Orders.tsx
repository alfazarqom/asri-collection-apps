import React, { useEffect, useState } from "react";
import { useSearchParams, useParams, Link } from "react-router-dom";
import {
  Search,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Package,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import {
  fetchOrderDetails,
  getLocalOrdersHistory,
  updateOrderInLocalHistory,
} from "../services/productApi.ts";
import { formatRupiah, formatDate } from "../utils/formatters.ts";
import { Spinner } from "../components/ui/Loader.tsx";
import { useCart } from "../hooks/useCart.ts";

export const Orders: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id: paramId } = useParams<{ id: string }>();
  const { showToast } = useCart();

  const queryOrderId = searchParams.get("orderId") || paramId || "";

  const [searchInput, setSearchInput] = useState(queryOrderId);
  const [currentOrder, setCurrentOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [localHistory, setLocalHistory] = useState<any[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    setLocalHistory(getLocalOrdersHistory());
  }, []);

  const loadOrder = async (orderId: string, isRefresh = false) => {
    if (!orderId.trim()) return;
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await fetchOrderDetails(orderId.trim());
      setCurrentOrder(data);
      if (data) {
        setSearchParams({ orderId: data.merchantOrderId });
      }
    } catch (err) {
      console.warn("Failed to fetch order:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (queryOrderId) {
      setSearchInput(queryOrderId);
      loadOrder(queryOrderId);
    }
  }, [queryOrderId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      loadOrder(searchInput.trim());
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    showToast("Berhasil disalin ke papan klip!");
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handlePayWithDuitku = (reference?: string, fallbackUrl?: string) => {
    if (reference && typeof window !== "undefined" && window.checkout) {
      const runCheckout =
        typeof window.checkout.run === "function"
          ? window.checkout.run
          : window.checkout.process;
      if (typeof runCheckout === "function") {
        showToast("Membuka pop-up pembayaran Duitku POP...", "info");
        runCheckout(reference, {
          defaultLanguage: "id",
          currency: "IDR",
          successEvent: function () {
            showToast("Pembayaran berhasil diverifikasi!", "success");
            if (currentOrder) loadOrder(currentOrder.merchantOrderId, true);
          },
          pendingEvent: function () {
            showToast("Menunggu penyelesaian pembayaran.", "info");
            if (currentOrder) loadOrder(currentOrder.merchantOrderId, true);
          },
          errorEvent: function () {
            showToast("Pembayaran gagal atau dibatalkan.", "error");
            if (currentOrder) loadOrder(currentOrder.merchantOrderId, true);
          },
          closeEvent: function () {
            if (currentOrder) loadOrder(currentOrder.merchantOrderId, true);
          },
        });
        return;
      }
    }
    if (fallbackUrl) {
      window.open(fallbackUrl, "_blank");
    }
  };

  // Status badge config
  const getStatusBadge = (status: string) => {
    const s = (status || "PENDING").toUpperCase();
    if (s === "SUCCESS" || s === "PAID" || s === "DELIVERED") {
      return {
        label: "LUNAS / BERHASIL DIVERIFIKASI",
        icon: CheckCircle2,
        bg: "bg-emerald-50 text-emerald-800 border-emerald-300",
        desc: "Pembayaran Anda telah sukses diverifikasi oleh Duitku POP Payment Gateway. Pesanan sedang disiapkan di workshop kami.",
      };
    }
    if (s === "FAILED" || s === "EXPIRED" || s === "CANCELLED") {
      return {
        label: "KEDALUWARSA / GAGAL",
        icon: AlertTriangle,
        bg: "bg-rose-50 text-rose-800 border-rose-300",
        desc: "Batas waktu pembayaran telah berakhir atau transaksi dibatalkan. Silakan lakukan pemesanan ulang.",
      };
    }
    return {
      label: "MENUNGGU PEMBAYARAN (PENDING)",
      icon: Clock,
      bg: "bg-amber-50 text-amber-900 border-amber-300",
      desc: "Menunggu penyelesaian transfer atau pemindaian QRIS dari pelanggan.",
    };
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 md:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#9A3412]">
            Lacak Status Pembayaran & Pengiriman
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1C1917] mt-1">
            Status Pesanan Pelanggan
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Masukkan Nomor Pesanan Merchant (contoh: ASRI-...) atau Nomor Referensi Duitku untuk mengecek status terkini.
          </p>
        </div>

        {/* Form Pelacakan Cepat */}
        <div className="bg-white border border-[#E7DFD5] p-5 shadow-xs">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Masukkan Nomor Order (misal: ASRI-179...)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs border border-[#E7DFD5] bg-white focus:outline-none focus:border-[#9A3412]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="py-2.5 px-6 text-xs font-bold uppercase tracking-wider text-white bg-[#1C1917] hover:bg-[#9A3412] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {loading ? <Spinner size="sm" className="border-white" /> : <Search className="w-4 h-4" />}
              <span>Lacak Pesanan</span>
            </button>
          </form>
        </div>

        {/* Order Details Card */}
        {loading ? (
          <div className="bg-white border border-[#E7DFD5] p-12 text-center flex flex-col items-center justify-center">
            <Spinner size="lg" />
            <span className="text-xs text-stone-500 mt-3">Mengambil data transaksi Duitku...</span>
          </div>
        ) : currentOrder ? (
          <div className="bg-white border border-[#E7DFD5] shadow-xs divide-y divide-[#E7DFD5]">
            {/* Top Bar of Order */}
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF8F5]">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-stone-500 block">
                  Nomor Pesanan (Merchant Order ID)
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-sm sm:text-base font-bold text-[#1C1917]">
                    {currentOrder.merchantOrderId}
                  </span>
                  <button
                    onClick={() => handleCopy(currentOrder.merchantOrderId, "orderId")}
                    className="p-1 text-stone-400 hover:text-stone-700"
                    title="Salin nomor pesanan"
                  >
                    {copiedKey === "orderId" ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="text-xs text-stone-500 mt-1">
                  Waktu Pemesanan: {formatDate(currentOrder.createdAt)}
                </div>
              </div>

              {/* Refresh Realtime Button */}
              <button
                onClick={() => loadOrder(currentOrder.merchantOrderId, true)}
                disabled={refreshing}
                className="inline-flex items-center gap-1.5 py-2 px-3 text-xs font-semibold text-stone-700 bg-white border border-[#E7DFD5] hover:bg-[#F4EFEA] transition-colors whitespace-nowrap"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                <span>Cek Status Terbaru</span>
              </button>
            </div>

            {/* Status Notice Banner */}
            {(() => {
              const badge = getStatusBadge(currentOrder.status);
              const BadgeIcon = badge.icon;
              return (
                <div className={`p-6 border-l-4 ${badge.bg}`}>
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                    <BadgeIcon className="w-4 h-4 shrink-0" />
                    <span>{badge.label}</span>
                  </div>
                  <p className="text-xs mt-1 leading-relaxed opacity-90">{badge.desc}</p>

                  {/* Payment instruction if Pending */}
                  {currentOrder.status === "PENDING" && (
                    <div className="mt-4 pt-4 border-t border-amber-200/60 flex flex-wrap items-center gap-3">
                      {currentOrder.vaNumber && (
                        <div className="bg-white/80 border border-amber-300 p-2.5 text-xs">
                          <span className="block text-[10px] text-stone-500 uppercase">
                            Nomor Virtual Account:
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-sm font-bold text-[#1C1917]">
                              {currentOrder.vaNumber}
                            </span>
                            <button
                              onClick={() => handleCopy(currentOrder.vaNumber, "va")}
                              className="text-stone-500 hover:text-stone-900"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}

                      {(currentOrder.reference || currentOrder.paymentUrl) && (
                        <button
                          type="button"
                          onClick={() =>
                            handlePayWithDuitku(currentOrder.reference, currentOrder.paymentUrl)
                          }
                          className="py-2.5 px-5 text-xs font-bold uppercase tracking-wider text-white bg-[#9A3412] hover:bg-[#7C2D12] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
                        >
                          <span>Bayar Sekarang via Duitku POP</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Customer & Shipping Info */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-stone-600">
              <div>
                <h4 className="font-bold text-[#1C1917] uppercase tracking-wider text-[11px] mb-2">
                  Data Pelanggan
                </h4>
                <div className="space-y-1">
                  <div>
                    <strong className="text-[#1C1917]">{currentOrder.customerName}</strong>
                  </div>
                  <div>No. WhatsApp: {currentOrder.customerPhone}</div>
                  {currentOrder.customerEmail && <div>Email: {currentOrder.customerEmail}</div>}
                  {currentOrder.reference && (
                    <div className="font-mono text-[11px] text-stone-500">
                      Ref Duitku: {currentOrder.reference}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#1C1917] uppercase tracking-wider text-[11px] mb-2">
                  Alamat Pengiriman
                </h4>
                <div className="space-y-1">
                  {typeof currentOrder.shippingAddress === "object" && currentOrder.shippingAddress ? (
                    <>
                      <div>{currentOrder.shippingAddress.address}</div>
                      <div>
                        {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.province}{" "}
                        {currentOrder.shippingAddress.postalCode}
                      </div>
                    </>
                  ) : (
                    <div>{currentOrder.shippingAddress || "Alamat standar"}</div>
                  )}
                  {currentOrder.notes && (
                    <div className="text-stone-500 italic mt-1">
                      Catatan: &ldquo;{currentOrder.notes}&rdquo;
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items Table */}
            {currentOrder.items && currentOrder.items.length > 0 && (
              <div className="p-6">
                <h4 className="font-bold text-[#1C1917] uppercase tracking-wider text-[11px] mb-3">
                  Rincian Barang yang Dipesan
                </h4>
                <div className="divide-y divide-[#E7DFD5]">
                  {currentOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-[#1C1917]">{item.title}</div>
                        {item.variant && (
                          <div className="text-[11px] text-stone-500">{item.variant}</div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-stone-500 tabular-nums">
                          {item.quantity} x {formatRupiah(item.price)}
                        </div>
                        <div className="font-bold text-[#1C1917] tabular-nums">
                          {formatRupiah((item.quantity || 1) * item.price)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 mt-3 border-t border-[#E7DFD5] flex items-center justify-between text-sm font-bold text-[#1C1917]">
                  <span>Total Transaksi</span>
                  <span className="text-base text-[#9A3412] tabular-nums">
                    {formatRupiah(currentOrder.amount)}
                  </span>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="p-6 bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-4">
              <a
                href={`https://wa.me/6282156764434?text=${encodeURIComponent(
                  `Halo CS Asri Collection, mohon bantuan untuk pesanan saya dengan nomor order: ${currentOrder.merchantOrderId}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 hover:text-emerald-950"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Butuh Bantuan? Hubungi WhatsApp CS Official</span>
              </a>

              <Link
                to="/products"
                className="text-xs font-semibold uppercase tracking-wider text-[#1C1917] hover:text-[#9A3412] inline-flex items-center gap-1"
              >
                <span>Lanjut Belanja</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : queryOrderId ? (
          <div className="bg-white border border-[#E7DFD5] p-10 text-center">
            <Package className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-[#1C1917]">
              Pesanan Tidak Ditemukan
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Pastikan Anda memasukkan nomor pesanan dengan benar sesuai yang tertera pada bukti transfer atau konfirmasi.
            </p>
          </div>
        ) : null}

        {/* Local Device History */}
        {localHistory.length > 0 && (
          <div className="bg-white border border-[#E7DFD5] p-6 shadow-xs">
            <h3 className="font-serif text-base font-bold text-[#1C1917] pb-3 border-b border-[#E7DFD5]">
              Riwayat Transaksi di Perangkat Ini
            </h3>
            <div className="divide-y divide-[#E7DFD5] mt-2">
              {localHistory.map((hist) => (
                <div
                  key={hist.merchantOrderId}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:bg-[#FAF8F5] px-2 transition-colors cursor-pointer"
                  onClick={() => {
                    setSearchInput(hist.merchantOrderId);
                    loadOrder(hist.merchantOrderId);
                  }}
                >
                  <div>
                    <div className="font-mono font-bold text-[#1C1917]">
                      {hist.merchantOrderId}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {formatDate(hist.createdAt)} · {hist.customerName}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#9A3412] tabular-nums">
                      {formatRupiah(hist.amount)}
                    </span>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-stone-100 border border-stone-200 text-stone-700">
                      {hist.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
