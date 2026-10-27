import React from "react";
import { Link } from "react-router-dom";
import { Tag, Copy, Check } from "lucide-react";
import { useCart } from "../../hooks/useCart.ts";

export const PromoBannerSection: React.FC = () => {
  const { applyCoupon } = useCart();
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopy = (code: string) => {
    applyCoupon(code);
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <section className="bg-[#F4EFEA] border-b border-[#E7DFD5] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF8F5] border border-[#E7DFD5] p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-[#9A3412]">
              <Tag className="w-3.5 h-3.5" />
              <span>Penawaran Eksklusif Pelanggan Baru</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
              Nikmati Potongan Langsung Hingga 20%
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl">
              Gunakan kode voucher saat checkout atau klik tombol klaim di bawah untuk otomatis mengaktifkan diskon pada tas belanja Anda.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Voucher 1 */}
            <div className="bg-white border border-dashed border-[#9A3412] p-3 flex items-center gap-3">
              <div>
                <span className="block text-[10px] uppercase text-stone-500 font-semibold">
                  Diskon 10% Semua Item
                </span>
                <span className="font-mono text-sm font-bold text-[#9A3412] tracking-wider">
                  ASRI10
                </span>
              </div>
              <button
                onClick={() => handleCopy("ASRI10")}
                className="py-1 px-3 text-[11px] font-semibold text-white bg-[#1C1917] hover:bg-[#9A3412] transition-colors flex items-center gap-1"
              >
                {copiedCode === "ASRI10" ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Aktif</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Klaim</span>
                  </>
                )}
              </button>
            </div>

            {/* Voucher 2 */}
            <div className="bg-white border border-dashed border-stone-400 p-3 flex items-center gap-3">
              <div>
                <span className="block text-[10px] uppercase text-stone-500 font-semibold">
                  Diskon VIP 20%
                </span>
                <span className="font-mono text-sm font-bold text-[#1C1917] tracking-wider">
                  ASRI20
                </span>
              </div>
              <button
                onClick={() => handleCopy("ASRI20")}
                className="py-1 px-3 text-[11px] font-semibold text-white bg-stone-800 hover:bg-[#9A3412] transition-colors flex items-center gap-1"
              >
                {copiedCode === "ASRI20" ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Aktif</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Klaim</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBannerSection;
