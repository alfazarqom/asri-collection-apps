import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export const BrandStorySection: React.FC = () => {
  return (
    <section className="py-20 bg-white border-b border-[#E7DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Kolom Visual Editorial */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] bg-stone-100 border border-[#E7DFD5] overflow-hidden">
              <img
                src="/src/assets/images/product_pashmina_silk_1793090600850.jpg"
                alt="Tekstur serat sutra mulberry dan rajutan pashmina Asri Collection"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden sm:block bg-[#FAF8F5] border border-[#E7DFD5] p-5 shadow-lg max-w-xs">
              <span className="font-serif text-2xl font-bold text-[#9A3412] block">
                100%
              </span>
              <p className="text-xs font-semibold text-[#1C1917] mt-1">
                Jaminan Mutu Jahitan Butik
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Setiap helai busana melewati 3 tahap kendali mutu sebelum dikemas.
              </p>
            </div>
          </div>

          {/* Kolom Narasi Brand */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#9A3412]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Warisan Butik Asri Collection</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] leading-tight text-balance">
              Merawat Kesantunan Muslimah Lewat Sentuhan Kelembutan Sutra Sejati
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
              <p>
                Didirikan dengan komitmen menghadirkan busana muslimah kontemporer yang tidak sekadar anggun di pandangan, tetapi juga sejuk dan memeluk kulit dengan penuh kelembutan.
              </p>
              <p>
                Asri Collection memilih serat sutra Mulberry Grade-A dan katun poplin alami yang ditenun rapat agar tidak menerawang, tidak mudah kusut, dan memiliki daya serap optimal untuk iklim tropis Indonesia.
              </p>
              <p>
                Setiap detail — dari sulaman bordir flora manual, kancing mutiara wudhu-friendly, hingga potongan loose-fit yang santun — dirancang khusus untuk menemani setiap langkah percaya diri wanita muslimah modern.
              </p>
            </div>

            <div className="pt-4 flex items-center gap-6">
              <Link
                to="/about"
                className="py-3 px-6 text-xs font-bold uppercase tracking-wider text-white bg-[#1C1917] hover:bg-[#9A3412] transition-colors flex items-center gap-2"
              >
                <span>Baca Kisah Lengkap Butik</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/6282156764434"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-stone-700 hover:text-[#9A3412] transition-colors"
              >
                Hubungi Pengrajin via WhatsApp &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStorySection;
