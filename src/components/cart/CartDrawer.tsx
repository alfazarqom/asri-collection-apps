import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Trash2, Plus, Minus, ArrowRight, Tag, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "../../hooks/useCart.ts";
import { formatRupiah } from "../../utils/formatters.ts";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    shippingFee,
    totalAmount,
    totalItems,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError("");
      setCouponInput("");
    }
  };

  const handleGoToCheckout = () => {
    closeCart();
    navigate("/cart");
  };

  const freeShippingThreshold = 350000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#E7DFD5] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#E7DFD5] bg-[#FAF8F5]">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg font-bold text-[#1C1917]">
                Tas Belanja
              </h2>
              <span className="text-xs text-stone-500 tabular-nums">
                ({totalItems} item)
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-stone-400 hover:text-[#1C1917] transition-colors"
              aria-label="Tutup keranjang"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="p-4 bg-[#F4EFEA] border-b border-[#E7DFD5]">
            <div className="flex items-center gap-2 text-xs text-[#1C1917] mb-1.5">
              <Truck className="w-4 h-4 text-[#9A3412]" />
              {remainingForFreeShipping > 0 ? (
                <span>
                  Tambah <strong className="tabular-nums">{formatRupiah(remainingForFreeShipping)}</strong> lagi untuk <strong>Gratis Ongkir</strong>
                </span>
              ) : (
                <span className="font-semibold text-emerald-800">
                  Selamat! Anda mendapatkan Gratis Ongkir seluruh Indonesia.
                </span>
              )}
            </div>
            <div className="w-full bg-[#E7DFD5] h-1.5 overflow-hidden">
              <div
                className="bg-[#9A3412] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#E7DFD5]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <p className="font-serif text-base text-stone-500 mb-2">
                  Tas belanja Anda masih kosong
                </p>
                <p className="text-xs text-stone-400 max-w-xs mb-6">
                  Temukan koleksi busana modest modern dengan material sutra mulberry terbaik.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    navigate("/products");
                  }}
                  className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#1C1917] hover:bg-[#9A3412] transition-colors"
                >
                  Jelajahi Koleksi
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  <img
                    src={item.product.thumbnail ?? ""}
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    className="w-20 h-24 object-cover border border-[#E7DFD5] bg-[#FAF8F5] shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-xs font-semibold text-[#1C1917] line-clamp-1">
                          {item.product.title}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-rose-700 transition-colors p-0.5"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5 flex gap-2">
                        <span>Ukuran: {item.selectedSize}</span>
                        <span>·</span>
                        <span>Warna: {item.selectedColor}</span>
                      </div>
                      <div className="text-xs font-bold text-[#1C1917] mt-1 tabular-nums">
                        {formatRupiah(item.product.price)}
                      </div>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-[#E7DFD5]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-[#F4EFEA] text-stone-600 transition-colors"
                          aria-label="Kurangi kuantitas"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-[#F4EFEA] text-stone-600 transition-colors"
                          aria-label="Tambah kuantitas"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-xs font-bold text-[#9A3412] tabular-nums">
                        {formatRupiah(item.product.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#E7DFD5] bg-[#FAF8F5] space-y-4">
              {/* Kupon Promo */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Kupon Aktif: <strong>{appliedCoupon}</strong></span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-rose-700 hover:underline font-medium"
                    >
                      Hapus
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Kode kupon (contoh: ASRI10)"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponError("");
                      }}
                      className="flex-1 px-3 py-2 text-xs border border-[#E7DFD5] bg-white focus:outline-none focus:border-[#9A3412]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold text-white bg-stone-800 hover:bg-[#9A3412] transition-colors"
                    >
                      Terapkan
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>
                )}
              </div>

              {/* Rincian Harga */}
              <div className="space-y-1.5 text-xs text-stone-600 border-t border-[#E7DFD5] pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1C1917] tabular-nums">
                    {formatRupiah(subtotal)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Diskon Kupon</span>
                    <span className="font-semibold tabular-nums">
                      -{formatRupiah(discountAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Perkiraan Ongkos Kirim</span>
                  <span className="font-semibold text-[#1C1917] tabular-nums">
                    {shippingFee === 0 ? "GRATIS" : formatRupiah(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#1C1917] border-t border-[#E7DFD5] pt-2">
                  <span>Total Tagihan</span>
                  <span className="text-[#9A3412] tabular-nums">
                    {formatRupiah(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleGoToCheckout}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-white bg-[#1C1917] hover:bg-[#9A3412] transition-colors shadow-sm"
              >
                <span>Lanjut ke Pembayaran</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Pembayaran Resmi Terenkripsi Duitku POP & QRIS</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
