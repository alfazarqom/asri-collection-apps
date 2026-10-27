import React from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  Building2,
  QrCode,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export const PaymentPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Breadcrumb & Title */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
            <Link to="/" className="hover:text-[#9A3412]">
              Beranda
            </Link>
            <span>/</span>
            <span className="text-[#1C1917]">Informasi Pembayaran</span>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A3412]">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Transparansi Transaksi Keuangan</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] tracking-tight">
            Kebijakan & Informasi Pembayaran
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Terakhir diperbarui: 27 Oktober 2026. Halaman ini menjelaskan seluruh metode pembayaran yang benar-benar tersedia dan aktif secara operasional di Asri Collection, alur verifikasi transaksi, serta status keterbukaan integrasi sistem teknologi pembayaran kami.
          </p>
        </div>

        {/* Status Keterbukaan & Metode Tersedia */}
        <div className="bg-[#FAF8F5] border-2 border-stone-800 p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-5 h-5 text-[#9A3412]" />
            <span>Pemberitahuan Resmi Operasional Pembayaran</span>
          </div>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1C1917]">
            Metode Pembayaran yang Benar-Benar Tersedia & Aktif
          </h2>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            Demi menjaga keamanan transaksi finansial dan transparansi kepada setiap pembeli, <strong>seluruh pembayaran pesanan yang sah saat ini diproses secara langsung melalui Transfer Bank Resmi Butik dan verifikasi Customer Support resmi WhatsApp (+62 821-5676-4434)</strong>. Setiap transaksi akan mendapatkan konfirmasi tanda terima resmi dari butik kami sebelum pesanan diproses ke divisi penyiapan barang.
          </p>
        </div>

        {/* 2 Metode Pembayaran Aktif */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Metode 1: Transfer Bank Manual */}
          <div className="bg-white border border-[#E7DFD5] p-6 space-y-4">
            <div className="w-10 h-10 bg-amber-50 border border-amber-200 text-[#9A3412] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 inline-block mb-1">
                Aktif & Beroperasi
              </span>
              <h3 className="font-serif text-base font-bold text-[#1C1917]">
                1. Transfer Bank Resmi Butik
              </h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Dapat dilakukan melalui m-Banking, Internet Banking, atau ATM ke rekening bank resmi atas nama butik Asri Collection:
            </p>
            <ul className="text-xs space-y-1.5 text-stone-700 font-medium">
              <li className="flex items-center justify-between border-b border-stone-100 pb-1">
                <span>Bank Central Asia (BCA)</span>
                <span className="text-stone-500 font-normal">Tersedia</span>
              </li>
              <li className="flex items-center justify-between border-b border-stone-100 pb-1">
                <span>Bank Mandiri</span>
                <span className="text-stone-500 font-normal">Tersedia</span>
              </li>
              <li className="flex items-center justify-between border-b border-stone-100 pb-1">
                <span>Bank Rakyat Indonesia (BRI)</span>
                <span className="text-stone-500 font-normal">Tersedia</span>
              </li>
            </ul>
            <p className="text-[11px] text-stone-500 italic">
              * Rincian nomor rekening resmi akan diberikan secara langsung oleh sistem dan dikonfirmasi oleh tim CS WhatsApp resmi butik.
            </p>
          </div>

          {/* Metode 2: WhatsApp CS Order & QRIS */}
          <div className="bg-white border border-[#E7DFD5] p-6 space-y-4">
            <div className="w-10 h-10 bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 inline-block mb-1">
                Aktif & Rekomendasi
              </span>
              <h3 className="font-serif text-base font-bold text-[#1C1917]">
                2. Pemesanan via WhatsApp Official
              </h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Pilihan paling praktis bagi pelanggan yang menginginkan bantuan pemesanan personal, konfirmasi instan, atau pembayaran via QRIS resmi butik:
            </p>
            <ul className="text-xs space-y-1.5 text-stone-700">
              <li>• Konsultasi fitting lingkar dada & panjang busana.</li>
              <li>• Pengiriman kode QRIS resmi atau invoice instan.</li>
              <li>• Verifikasi pembayaran manual dalam hitungan menit pada jam operasional.</li>
            </ul>
            <div className="pt-2">
              <a
                href="https://wa.me/6282156764434?text=Halo%20Asri%20Collection%2C%20saya%20ingin%20konfirmasi%20pembayaran"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Hubungi CS WhatsApp (+62 821-5676-4434) &rarr;</span>
              </a>
            </div>
          </div>
        </div>

        {/* Penjelasan Status Payment Gateway Duitku POP */}
        <div className="bg-amber-50 border border-amber-300 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-[#9A3412] font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Keterbukaan Status Teknis: Integrasi Payment Gateway Duitku POP</span>
          </div>
          <h3 className="font-serif text-base sm:text-lg font-bold text-[#1C1917]">
            Status Integrasi Duitku POP Saat Ini Berada di Tahap Uji Coba (Sandbox)
          </h3>
          <div className="space-y-2 text-xs sm:text-sm text-stone-700 leading-relaxed">
            <p>
              Kami mengutamakan kejujuran dan perlindungan terhadap setiap rupiah dana pelanggan. <strong>Modul integrasi otomatis Payment Gateway Duitku POP saat ini masih beroperasi dalam lingkungan Sandbox (Mode Uji Coba Teknis / Simulasi Pengembang)</strong> guna memastikan kehandalan sistem webhook dan integrasi serverless sebelum diluncurkan secara produksi penuh.
            </p>
            <p>
              Oleh karena itu:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-stone-600 text-xs">
              <li>
                Opsi Duitku yang muncul di halaman checkout saat ini adalah modul simulasi uji alur pembayaran.
              </li>
              <li>
                <strong>Jangan menganggap Duitku sebagai pembayaran aktif produksi</strong> sampai kami mengumumkan rilis resmi fase live.
              </li>
              <li>
                Untuk transaksi belanja riil, gunakan selalu opsi <strong>WhatsApp Official CS / Transfer Bank Terverifikasi</strong> agar pesanan Anda segera diproses tanpa kendala.
              </li>
            </ul>
          </div>
        </div>

        {/* Detailed Sections: Alur & Penanganan Gagal */}
        <div className="bg-white border border-[#E7DFD5] p-6 sm:p-8 space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed divide-y divide-[#E7DFD5]">
          {/* Section 1: Alur Pembayaran */}
          <section className="space-y-3">
            <h3 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-2">
              <span className="w-5 h-5 bg-[#FAF8F5] border border-[#E7DFD5] text-[#9A3412] text-xs font-bold flex items-center justify-center">
                1
              </span>
              <span>Alur Pembayaran Pesanan</span>
            </h3>
            <ol className="list-decimal pl-5 space-y-2 text-stone-600">
              <li>Pilih busana yang Anda minati di katalog, tentukan ukuran dan warna, lalu masukkan ke Tas Belanja.</li>
              <li>Buka halaman Keranjang / Checkout dan lengkapi data penerima serta alamat pengiriman dengan benar.</li>
              <li>Pilih metode pemesanan WhatsApp atau Transfer Bank Resmi.</li>
              <li>Lakukan transfer sesuai nominal total (termasuk kode unik jika ada) ke nomor rekening yang diinstruksikan.</li>
              <li>Kirimkan bukti struk/screenshot transfer ke WhatsApp Official CS (+62 821-5676-4434).</li>
              <li>Tim keuangan Asri Collection memvalidasi mutasi dan status pesanan berubah menjadi &quot;Dibayar / Sedang Diproses&quot;.</li>
            </ol>
          </section>

          {/* Section 2: Penanganan Transaksi Gagal atau Double Payment */}
          <section className="pt-6 space-y-3">
            <h3 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-2">
              <span className="w-5 h-5 bg-[#FAF8F5] border border-[#E7DFD5] text-[#9A3412] text-xs font-bold flex items-center justify-center">
                2
              </span>
              <span>Penanganan Transaksi Gagal & Pembayaran Ganda (Double Transfer)</span>
            </h3>
            <p>
              Jika Anda mengalami salah satu kendala berikut:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li>
                <strong>Transaksi Gagal namun Saldo Rekening Terpotong:</strong> Biasanya terjadi kendala jaringan antarbank. Hubungi CS WhatsApp kami dengan melampirkan mutasi rekening dan ID pesanan. Kami akan melakukan rekonsiliasi ke pihak perbankan.
              </li>
              <li>
                <strong>Terlanjur Melakukan Transfer Ganda (Kelebihan Bayar):</strong> Dana lebih akan kami kembalikan (refund) 100% ke nomor rekening pengirim dalam 1x24 jam kerja setelah mutasi bank diverifikasi.
              </li>
              <li>
                <strong>Salah Nominal Transfer:</strong> Jika kurang bayar, Anda cukup mentransfer kekurangannya. Jika lebih bayar, selisihnya akan kami transfer kembali atau dialokasikan sebagai kredit belanja sesuai persetujuan Anda.
              </li>
            </ul>
          </section>

          {/* Section 3: Peringatan Keamanan */}
          <section className="pt-6 space-y-3">
            <h3 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-2">
              <span className="w-5 h-5 bg-[#FAF8F5] border border-[#E7DFD5] text-[#9A3412] text-xs font-bold flex items-center justify-center">
                3
              </span>
              <span>Peringatan Keamanan & Larangan Rekening Pribadi</span>
            </h3>
            <div className="p-4 bg-[#FAF8F5] border border-rose-200 text-stone-700 space-y-2">
              <div className="flex items-center gap-2 text-rose-800 font-bold">
                <ShieldAlert className="w-4 h-4" />
                <span>Waspada Penipuan Mengatasnamakan Asri Collection</span>
              </div>
              <p className="text-xs text-stone-600">
                Asri Collection <strong>tidak pernah</strong> menghubungi pelanggan melalui nomor pribadi di luar <strong>+62 821-5676-4434</strong> dan tidak pernah meminta transfer ke rekening atas nama orang per orangan yang mencurigakan. Pastikan Anda hanya bertransaksi melalui rekening resmi butik kami.
              </p>
            </div>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E7DFD5]">
          <Link
            to="/refund-policy"
            className="text-xs font-semibold text-[#9A3412] hover:underline flex items-center gap-1"
          >
            <span>Ketentuan Pengembalian Dana (Refund)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/cart"
            className="py-2.5 px-5 text-xs font-bold uppercase tracking-wider text-white bg-[#1C1917] hover:bg-[#9A3412] transition-colors"
          >
            Buka Halaman Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentPolicy;
