import React from "react";
import { Link } from "react-router-dom";
import { RotateCcw, ShieldCheck, CheckCircle2, AlertTriangle, MessageCircle, HelpCircle, ArrowRight } from "lucide-react";

export const RefundPolicy: React.FC = () => {
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
            <span className="text-[#1C1917]">Kebijakan Retur & Refund</span>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A3412]">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Garansi & Perlindungan Konsumen</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] tracking-tight">
            Kebijakan Pengembalian dan Refund
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Terakhir diperbarui: 27 Oktober 2026. Kami berkomitmen menjamin kepuasan Anda dalam mengenakan setiap busana Asri Collection dengan garansi penukaran ukuran dan jaminan ganti rugi 100% untuk produk cacat.
          </p>
        </div>

        {/* Highlight Banner: Ditangani Langsung oleh Asri Collection */}
        <div className="bg-[#FAF8F5] border-2 border-[#9A3412] p-6 sm:p-8 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-[#9A3412] font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-5 h-5" />
            <span>Penanganan Resmi & Langsung oleh Asri Collection</span>
          </div>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1C1917]">
            Seluruh Permintaan Refund & Retur Ditangani Secara Internal oleh Asri Collection
          </h2>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            Perlu diketahui bahwa <strong>seluruh proses penukaran barang maupun permintaan pengembalian dana (refund) ditangani secara langsung oleh tim operasional Asri Collection</strong> dan tidak didelegasikan kepada pihak perantara otomatis pihak ketiga. Proses pengembalian dana mengikuti status verifikasi transaksi, kesesuaian fisik produk yang diretur, serta ketentuan yang berlaku di bawah ini demi menjamin keadilan, keaslian produk, dan keamanan finansial pelanggan.
          </p>
        </div>

        {/* 3 Steps Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#E7DFD5] p-6 space-y-2">
            <span className="text-xs font-bold text-[#9A3412] uppercase tracking-wider">
              Langkah 1
            </span>
            <h3 className="font-serif text-sm font-bold text-[#1C1917]">
              Lapor dalam 7 Hari Kalender
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Hubungi WhatsApp CS (+62 821-5676-4434) maksimal 7 hari sejak tanggal paket diterima berdasarkan resi ekspedisi resmi.
            </p>
          </div>

          <div className="bg-white border border-[#E7DFD5] p-6 space-y-2">
            <span className="text-xs font-bold text-[#9A3412] uppercase tracking-wider">
              Langkah 2
            </span>
            <h3 className="font-serif text-sm font-bold text-[#1C1917]">
              Verifikasi & Kirim Balik
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Kirimkan video unboxing utuh dan foto kondisi pakaian. Setelah disetujui, kirimkan produk ke alamat workshop atelier kami di Jakarta.
            </p>
          </div>

          <div className="bg-white border border-[#E7DFD5] p-6 space-y-2">
            <span className="text-xs font-bold text-[#9A3412] uppercase tracking-wider">
              Langkah 3
            </span>
            <h3 className="font-serif text-sm font-bold text-[#1C1917]">
              Inspeksi & Refund / Tukar
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Dalam 1–3 hari kerja setelah barang tiba dan lolos inspeksi QC, barang pengganti dikirimkan atau dana ditransfer penuh ke rekening Anda.
            </p>
          </div>
        </div>

        {/* Content Details */}
        <div className="bg-white border border-[#E7DFD5] p-6 sm:p-8 space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed divide-y divide-[#E7DFD5]">
          {/* Section 1: Alasan yang Diterima */}
          <section className="space-y-3">
            <h3 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-2">
              <span className="w-5 h-5 bg-[#FAF8F5] border border-[#E7DFD5] text-[#9A3412] text-xs font-bold flex items-center justify-center">
                1
              </span>
              <span>Kondisi & Alasan Pengembalian yang Diterima</span>
            </h3>
            <p>
              Asri Collection menerima klaim penukaran atau pengembalian dana untuk kondisi berikut:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-stone-600">
              <li>
                <strong>Cacat Produksi / Jahitan Rusak:</strong> Busana mengalami cacat sobek serat kain, jahitan obras terlepas, ritsleting/kancing rusak sebelum pemakaian, atau noda permanen dari proses penjahitan.
              </li>
              <li>
                <strong>Salah Kirim Barang:</strong> Produk yang tiba tidak sesuai dengan pesanan Anda (berbeda model, ukuran, atau varian warna dari invoice).
              </li>
              <li>
                <strong>Tukar Ukuran (Size Exchange):</strong> Busana terlalu sempit atau terlalu longgar saat dicoba, dan pembeli menghendaki penukaran ke ukuran lain yang tersedia pada model yang sama.
              </li>
            </ul>
          </section>

          {/* Section 2: Syarat Kondisi Barang */}
          <section className="pt-6 space-y-3">
            <h3 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-2">
              <span className="w-5 h-5 bg-[#FAF8F5] border border-[#E7DFD5] text-[#9A3412] text-xs font-bold flex items-center justify-center">
                2
              </span>
              <span>Syarat Kelayakan Fisik Barang yang Diretur</span>
            </h3>
            <p>
              Demi menjaga standar kebersihan dan higienitas busana butik muslimah:
            </p>
            <div className="bg-[#FAF8F5] border border-[#E7DFD5] p-4 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span><strong>Tag label & segel merek Asri Collection</strong> masih menempel dan tidak digunting/dirusak.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span><strong>Kondisi Baru (Unworn):</strong> Busana hanya dicoba untuk menguji fitting ukuran, tidak pernah dipakai bepergian.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span><strong>Belum Dicuci:</strong> Busana tidak boleh dicuci, direndam deterjen, disemprot parfum pribadi, atau terkena noda kosmetik.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span><strong>Video Unboxing:</strong> Menyertakan video pembukaan paket asli dari kurir tanpa potongan gambar (cut).</span>
              </div>
            </div>
          </section>

          {/* Section 3: Ongkos Kirim Retur */}
          <section className="pt-6 space-y-3">
            <h3 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-2">
              <span className="w-5 h-5 bg-[#FAF8F5] border border-[#E7DFD5] text-[#9A3412] text-xs font-bold flex items-center justify-center">
                3
              </span>
              <span>Ketentuan Biaya Ongkos Kirim Retur</span>
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-stone-600">
              <li>
                <strong>Kesalahan dari Asri Collection (Cacat atau Salah Kirim):</strong> 100% seluruh ongkos kirim pengembalian paket ke butik dan pengiriman produk pengganti yang baru ditanggung sepenuhnya oleh Asri Collection.
              </li>
              <li>
                <strong>Penukaran Ukuran atas Keinginan Pembeli:</strong> Ongkos kirim pengembalian dari alamat pembeli menuju atelier kami ditanggung oleh pembeli, sedangkan pengiriman ukuran baru ke pembeli disubsidi oleh program butik.
              </li>
            </ul>
          </section>

          {/* Section 4: Prosedur Pengembalian Dana (Refund) */}
          <section className="pt-6 space-y-3">
            <h3 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-2">
              <span className="w-5 h-5 bg-[#FAF8F5] border border-[#E7DFD5] text-[#9A3412] text-xs font-bold flex items-center justify-center">
                4
              </span>
              <span>Prosedur Pengembalian Dana (Refund)</span>
            </h3>
            <p>
              Apabila produk pengganti habis atau pembeli berhak menerima pengembalian dana:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li>
                Dana akan dikembalikan melalui <strong>Transfer Bank langsung</strong> ke nomor rekening bank atas nama pembeli yang terdaftar pada transaksi.
              </li>
              <li>
                Proses pengembalian dana dilakukan dalam waktu <strong>1 hingga 3 hari kerja</strong> terhitung sejak paket retur tiba di workshop Asri Collection dan selesai diverifikasi oleh tim Quality Control kami.
              </li>
              <li>
                Bukti transfer refund resmi dari bank akan dikirimkan langsung ke nomor WhatsApp Anda sebagai tanda bukti transaksi tuntas.
              </li>
            </ul>
          </section>

          {/* Section 5: Saluran Pengajuan Retur */}
          <section className="pt-6 space-y-3">
            <h3 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-2">
              <span className="w-5 h-5 bg-[#FAF8F5] border border-[#E7DFD5] text-[#9A3412] text-xs font-bold flex items-center justify-center">
                5
              </span>
              <span>Cara Mengajukan Retur atau Refund</span>
            </h3>
            <p>
              Hubungi saluran layanan pelanggan resmi Asri Collection:
            </p>
            <div className="p-4 bg-white border border-[#E7DFD5] space-y-2 text-xs">
              <p>
                <strong>WhatsApp CS Retur:</strong>{" "}
                <a
                  href="https://wa.me/6282156764434?text=Halo%20Asri%20Collection%2C%20saya%20ingin%20mengajukan%20retur%20pesanan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9A3412] font-semibold hover:underline"
                >
                  +62 821-5676-4434
                </a>
              </p>
              <p>
                <strong>Format Pesan:</strong> ID Pesanan / Nama Pemesan / Foto & Video Unboxing / Alasan Penukaran atau Refund.
              </p>
              <p>
                <strong>Alamat Retur Fisik:</strong> Atelier Asri Collection (Divisi QC & Retur), Jl. Kemang Raya No. 42, Jakarta Selatan, DKI Jakarta 12730.
              </p>
            </div>
          </section>
        </div>

        {/* Bottom Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E7DFD5]">
          <Link
            to="/payment-policy"
            className="text-xs font-semibold text-[#9A3412] hover:underline flex items-center gap-1"
          >
            <span>Lihat Informasi & Kebijakan Pembayaran</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href="https://wa.me/6282156764434?text=Halo%20Asri%20Collection%2C%20saya%20ingin%20konsultasi%20retur"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 py-2.5 px-5 text-xs font-bold uppercase tracking-wider text-white bg-emerald-700 hover:bg-emerald-800 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat CS Retur via WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
