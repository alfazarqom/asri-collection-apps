import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

export const HeroSlider: React.FC = () => {
  return (
    <section className="relative bg-[#FAF8F5] border-b border-[#E7DFD5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Kolom Kiri: Headline & Call To Action */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#9A3412]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Koleksi Eksklusif Autumn / Raya Edition</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1917] tracking-tight leading-[1.15] text-balance">
              Kemewahan Sutra Mulberry & Kesantunan Siluet Kontemporer
            </h1>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl">
              Asri Collection menghadirkan busana muslimah dan fashion wanita premium dengan perpaduan serat alami Mulberry Silk Grade-A, bordir artisanal rapi, dan kenyamanan sepanjang hari.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/products"
                className="py-3.5 px-8 text-xs font-bold uppercase tracking-wider text-white bg-[#1C1917] hover:bg-[#9A3412] transition-colors flex items-center gap-2 shadow-sm"
              >
                <span>Jelajahi Koleksi</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/products?category=dresses"
                className="py-3.5 px-6 text-xs font-semibold uppercase tracking-wider text-[#1C1917] bg-white border border-[#E7DFD5] hover:bg-[#F4EFEA] transition-colors"
              >
                Gamis & Abaya
              </Link>
            </div>

            {/* Proof marker strip */}
            <div className="pt-6 border-t border-[#E7DFD5] grid grid-cols-3 gap-4 text-xs text-stone-600">
              <div>
                <span className="block font-serif text-xl font-bold text-[#1C1917] tabular-nums">
                  100%
                </span>
                <span className="text-[11px] text-stone-500">Pure Mulberry Silk</span>
              </div>
              <div>
                <span className="block font-serif text-xl font-bold text-[#1C1917] tabular-nums">
                  4.95 / 5
                </span>
                <span className="text-[11px] text-stone-500">Kepuasan Pelanggan</span>
              </div>
              <div>
                <span className="block font-serif text-xl font-bold text-[#1C1917] tabular-nums">
                  Duitku POP
                </span>
                <span className="text-[11px] text-stone-500">QRIS & VA Terintegrasi</span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Visual Hero Image */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[16/10] lg:aspect-[4/3] bg-stone-200 border border-[#E7DFD5] shadow-lg overflow-hidden group">
              <img
                src="/src/assets/images/hero_modest_fashion_banner_1793090597385.jpg"
                alt="Koleksi busana muslimah kontemporer Asri Collection"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <span className="text-[10px] uppercase tracking-widest text-amber-200 block mb-1">
                    Signature Piece
                  </span>
                  <p className="font-serif text-lg font-bold">
                    Gamis Silk Mulberry Champagne
                  </p>
                  <p className="text-xs text-stone-200 mt-0.5">
                    Potongan empire waist anggun dengan drape alami yang mewah
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
