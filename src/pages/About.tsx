import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ShieldCheck, Heart, Award, MapPin, Phone, Mail, ArrowRight } from "lucide-react";

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#9A3412]">
            Filosofi & Warisan Butik
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1917] tracking-tight">
            Menghidupkan Keanggunan Muslimah Melalui Kualitas Tanpa Kompromi
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Asri Collection lahir dari kerinduan mendalam akan busana muslimah kontemporer yang memadukan kaidah kesantunan syar&apos;i dengan elegansi modern dan material serat alami terbaik.
          </p>
        </div>

        {/* Hero Visual Card */}
        <div className="bg-white border border-[#E7DFD5] p-3 shadow-xs overflow-hidden">
          <div className="aspect-[16/9] overflow-hidden bg-stone-100">
            <img
              src="/src/assets/images/hero_modest_fashion_banner_1793090597385.jpg"
              alt="Atelier Asri Collection"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#E7DFD5] p-6 space-y-2">
            <Award className="w-5 h-5 text-[#9A3412]" />
            <h3 className="font-serif text-base font-bold text-[#1C1917]">
              100% Grade-A Mulberry Silk
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Kami secara ketat menolak serat sintetis panas. Pilihan kami terpusat pada sutra Mulberry alami yang bersirkulasi udara optimal dan memiliki jatuhan siluet yang lembut menenangkan.
            </p>
          </div>

          <div className="bg-white border border-[#E7DFD5] p-6 space-y-2">
            <Heart className="w-5 h-5 text-[#9A3412]" />
            <h3 className="font-serif text-base font-bold text-[#1C1917]">
              Jahitan Halus Butik
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Dikerjakan oleh penjahit lokal berpengalaman dengan kerapatan tusuk jarum presisi, finishing obras tertutup (stik balik), dan detail fungsional wudhu serta busui-friendly.
            </p>
          </div>

          <div className="bg-white border border-[#E7DFD5] p-6 space-y-2">
            <ShieldCheck className="w-5 h-5 text-[#9A3412]" />
            <h3 className="font-serif text-base font-bold text-[#1C1917]">
              Transaksi Aman & Terverifikasi
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Setiap transaksi dikonfirmasi langsung oleh tim Customer Support resmi melalui rekening bank resmi butik dengan jaminan garansi retur & refund 7 hari kalender.
            </p>
          </div>
        </div>

        {/* Workshop & Contact */}
        <div className="bg-white border border-[#E7DFD5] p-8 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#9A3412]">
              Kunjungi Butik & Workshop
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#1C1917] mt-1">
              Atelier & Layanan Pelanggan Asri Collection
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-stone-600">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#9A3412] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#1C1917] block">Lokasi Workshop Butik:</strong>
                  <span>Kawasan Butik Modest Fashion, Jl. Kemang Raya No. 42, Jakarta Selatan, DKI Jakarta 12730</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#9A3412] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#1C1917] block">WhatsApp Customer Care:</strong>
                  <a
                    href="https://wa.me/6282156764434"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9A3412] font-semibold hover:underline"
                  >
                    +62 821-5676-4434
                  </a>
                  <span className="block text-stone-500">Senin – Sabtu: 08.30 – 21.00 WIB</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#9A3412] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#1C1917] block">Email Resmi:</strong>
                  <span>care@asricollection.id</span>
                </div>
              </div>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 py-3 px-6 text-xs font-bold uppercase tracking-wider text-white bg-[#1C1917] hover:bg-[#9A3412] transition-colors"
                >
                  <span>Katalog Koleksi</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 py-3 px-5 text-xs font-bold uppercase tracking-wider text-stone-800 bg-[#FAF8F5] hover:bg-[#F4EFEA] border border-[#E7DFD5] transition-colors"
                >
                  <span>Hubungi Kontak</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links to Policies */}
        <div className="p-6 bg-white border border-[#E7DFD5] flex flex-wrap items-center justify-between gap-4 text-xs">
          <span className="font-semibold text-stone-700">Kebijakan Resmi Butik:</span>
          <div className="flex flex-wrap items-center gap-4 text-stone-600">
            <Link to="/shipping-policy" className="hover:text-[#9A3412] underline">
              Kebijakan Pengiriman
            </Link>
            <span>•</span>
            <Link to="/refund-policy" className="hover:text-[#9A3412] underline">
              Retur & Refund
            </Link>
            <span>•</span>
            <Link to="/payment-policy" className="hover:text-[#9A3412] underline">
              Informasi Pembayaran
            </Link>
            <span>•</span>
            <Link to="/privacy-policy" className="hover:text-[#9A3412] underline">
              Kebijakan Privasi
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-[#9A3412] underline">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
