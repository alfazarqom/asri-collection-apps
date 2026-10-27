import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ShieldCheck, RefreshCw, Truck } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1C1917] text-[#FAF8F5] pt-16 pb-20 md:pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Kolom 1: Brand & Filosofi */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold tracking-tight text-white">
              Asri Collection
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Butik busana muslimah dan fashion wanita kontemporer yang memadukan keanggunan siluet santun dengan kemewahan material serat Mulberry Silk dan katun alami berkualitas tinggi.
            </p>
            <div className="pt-2 flex flex-col gap-2 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#9A3412] shrink-0" />
                <span>Jakarta Selatan, DKI Jakarta, Indonesia</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#9A3412] shrink-0" />
                <a
                  href="https://wa.me/6282156764434"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  +62 821-5676-4434 (Official CS)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#9A3412] shrink-0" />
                <span>care@asricollection.id</span>
              </div>
            </div>
          </div>

          {/* Kolom 2: Belanja & Kategori */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-200">
              Koleksi Pilihan
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link to="/products?category=dresses" className="hover:text-white transition-colors">
                  Gamis Silk Mulberry
                </Link>
              </li>
              <li>
                <Link to="/products?category=tops" className="hover:text-white transition-colors">
                  Tunik Bordir Katun Poplin
                </Link>
              </li>
              <li>
                <Link to="/products?category=bags" className="hover:text-white transition-colors">
                  Tas & Handbag Kulit Vegan
                </Link>
              </li>
              <li>
                <Link to="/products?category=hijab" className="hover:text-white transition-colors">
                  Pashmina Silk Shimmer
                </Link>
              </li>
              <li>
                <Link to="/products?category=heels" className="hover:text-white transition-colors">
                  Sepatu Kitten Heels Santun
                </Link>
              </li>
              <li>
                <Link to="/products?category=fragrance" className="hover:text-white transition-colors">
                  Eau de Parfum Oud & Rose
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Layanan Pelanggan & Kebijakan */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-200">
              Layanan & Kebijakan
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  Lacak Status Pesanan
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Kontak Layanan Pelanggan
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-white transition-colors">
                  Kebijakan Pengiriman
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-white transition-colors">
                  Kebijakan Retur & Refund (7 Hari)
                </Link>
              </li>
              <li>
                <Link to="/payment-policy" className="hover:text-white transition-colors">
                  Informasi Pembayaran Toko
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Tentang Kami & Atelier Butik
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Metode Pembayaran Tersedia */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-200">
              Metode Pembayaran Tersedia
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Transaksi resmi aktif dilayani via <strong>Transfer Bank Resmi (BCA, Mandiri, BRI)</strong> & verifikasi WhatsApp CS. Modul otomasi Duitku POP saat ini berada dalam tahap Sandbox (Uji Coba Teknis).
            </p>
            <div className="flex flex-wrap gap-1.5 text-[10px] text-stone-300">
              <span className="px-2 py-1 bg-stone-800 border border-stone-700">BCA Transfer</span>
              <span className="px-2 py-1 bg-stone-800 border border-stone-700">Mandiri</span>
              <span className="px-2 py-1 bg-stone-800 border border-stone-700">BRI</span>
              <span className="px-2 py-1 bg-stone-800 border border-stone-700">QRIS CS</span>
              <span className="px-2 py-1 bg-amber-950 text-amber-200 border border-amber-800">Duitku (Sandbox)</span>
            </div>
            <div className="pt-1">
              <Link
                to="/payment-policy"
                className="text-xs text-[#E7DFD5] hover:text-white underline inline-flex items-center gap-1"
              >
                <span>Pelajari Detail Kebijakan Pembayaran</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright line with accessible policy links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            &copy; {new Date().getFullYear()} Asri Collection. All rights reserved. Contemporary Modest & Modern Fashion.
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-stone-400">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Kebijakan Privasi
            </Link>
            <span>·</span>
            <Link to="/terms" className="hover:text-white transition-colors">
              Syarat & Ketentuan
            </Link>
            <span>·</span>
            <Link to="/shipping-policy" className="hover:text-white transition-colors">
              Pengiriman
            </Link>
            <span>·</span>
            <Link to="/refund-policy" className="hover:text-white transition-colors">
              Retur & Refund
            </Link>
            <span>·</span>
            <Link to="/payment-policy" className="hover:text-white transition-colors">
              Pembayaran
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
