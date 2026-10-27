import React from "react";
import { Link } from "react-router-dom";
import { FileCheck, Scale, AlertCircle, ShoppingCart, ArrowRight } from "lucide-react";

export const Terms: React.FC = () => {
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
            <span className="text-[#1C1917]">Syarat & Ketentuan</span>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A3412]">
            <Scale className="w-3.5 h-3.5" />
            <span>Ketentuan Transaksi Resmi</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] tracking-tight">
            Syarat dan Ketentuan Transaksi
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Terakhir diperbarui: 27 Oktober 2026. Syarat dan ketentuan ini mengatur penggunaan situs resmi Asri Collection serta prosedur pembelian busana muslimah dan fashion wanita kontemporer kami.
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white border border-[#E7DFD5] p-6 sm:p-8 space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed divide-y divide-[#E7DFD5]">
          {/* Pasal 1: Ketentuan Umum */}
          <section className="space-y-3">
            <h3 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-2">
              <span className="w-5 h-5 bg-[#FAF8F5] border border-[#E7DFD5] text-[#9A3412] text-xs font-bold flex items-center justify-center">
                1
              </span>
              <span>Ketentuan Umum & Akurasi Pemesanan</span>
            </h3>
            <p>
              Dengan mengakses website ini dan/atau melakukan checkout pemesanan, Anda menyatakan bahwa:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li>Anda telah berusia minimal 18 tahun atau bertransaksi di bawah pengawasan orang tua/wali yang sah.</li>
              <li>Seluruh informasi yang Anda masukkan pada formulir (nama, nomor kontak WhatsApp, alamat pengiriman) adalah akurat, terkini, dan lengkap.</li>
              <li>Asri Collection berhak membatalkan pesanan apabila terdapat indikasi manipulasi data atau informasi kontak yang tidak dapat dihubungi.</li>
            </ul>
          </section>

          {/* Pasal 2: Deskripsi & Akurasi Warna Produk */}
          <section className="pt-6 space-y-3">
            <h3 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-2">
              <span className="w-5 h-5 bg-[#FAF8F5] border border-[#E7DFD5] text-[#9A3412] text-xs font-bold flex items-center justify-center">
                2
              </span>
              <span>Informasi Produk & Akurasi Visual</span>
            </h3>
            <p>
              Kami berupaya semaksimal mungkin menampilkan warna, tekstur material serat Mulberry Silk, katun poplin, dan ukuran busana seakurat mungkin:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li>
                <strong>Akurasi Warna:</strong> Terdapat toleransi kemiripan warna foto katalog dengan produk fisik sekitar 90–95% akibat variasi kalibrasi layar gawai dan pencahayaan studio foto.
              </li>
              <li>
                <strong>Toleransi Ukuran Jahitan:</strong> Karena dikerjakan melalui proses penjahitan butik halus secara artisanal, terdapat batas toleransi ukuran sebesar 1–2 cm pada lingkar dada dan panjang baju.
              </li>
              <li>
                <strong>Ketersediaan Stok:</strong> Stok produk diperbarui secara real-time. Jika produk yang Anda bayar ternyata habis di atelier kami karena pemesanan bersamaan, CS kami akan segera menawarkan penggantian varian atau pengembalian dana 100%.
              </li>
            </ul>
          </section>

          {/* Pasal 3: Penetapan Harga & Pembayaran */}
          <section className="pt-6 space-y-3">
            <h3 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-2">
              <span className="w-5 h-5 bg-[#FAF8F5] border border-[#E7DFD5] text-[#9A3412] text-xs font-bold flex items-center justify-center">
                3
              </span>
              <span>Penetapan Harga & Ketentuan Pembayaran</span>
            </h3>
            <p>
              Semua harga produk tertera dalam mata uang Rupiah (IDR).
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li>Harga belum termasuk ongkos kirim ke alamat tujuan Anda, kecuali pesanan memenuhi batas minimal promo Gratis Ongkir (minimal Rp 350.000).</li>
              <li>
                Metode pembayaran aktif yang dilayani secara operasional adalah <strong>Transfer Rekening Resmi Bank Butik dan verifikasi WhatsApp CS (+62 821-5676-4434)</strong>. Integrasi gateway Duitku POP saat ini disediakan dalam tahap uji coba (sandbox).
              </li>
              <li>Pesanan akan diproses ke tahap penyiapan dan Quality Control (QC) setelah dana terverifikasi masuk ke rekening resmi kami.</li>
            </ul>
          </section>

          {/* Pasal 4: Pengiriman & Penerimaan */}
          <section className="pt-6 space-y-3">
            <h3 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-2">
              <span className="w-5 h-5 bg-[#FAF8F5] border border-[#E7DFD5] text-[#9A3412] text-xs font-bold flex items-center justify-center">
                4
              </span>
              <span>Pengiriman & Tanggung Jawab Ekspedisi</span>
            </h3>
            <p>
              Asri Collection bekerjasama dengan mitra ekspedisi terpercaya (JNE, SiCepat, J&T).
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li>Estimasi waktu pengiriman adalah estimasi operasional kurir dan dapat dipengaruhi oleh cuaca atau kondisi libur nasional.</li>
              <li>Risiko kerusakan paket saat perjalanan dilindungi dengan kemasan polymailer/box butik berlapis segel. Pembeli <strong>diwajibkan membuat video unboxing tanpa jeda</strong> saat menerima paket sebagai bukti sah klaim retur atau asuransi.</li>
            </ul>
          </section>

          {/* Pasal 5: Hak Kekayaan Intelektual */}
          <section className="pt-6 space-y-3">
            <h3 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-2">
              <span className="w-5 h-5 bg-[#FAF8F5] border border-[#E7DFD5] text-[#9A3412] text-xs font-bold flex items-center justify-center">
                5
              </span>
              <span>Hak Cipta & Kekayaan Intelektual</span>
            </h3>
            <p>
              Seluruh materi pada situs web ini, mencakup namun tidak terbatas pada nama merek &quot;Asri Collection&quot;, logo, foto katalog, desain pola bordir tunik, teks deskripsi, dan tata letak grafis adalah hak milik intelektual sah dari Asri Collection. Dilarang keras menggandakan, menyalin, atau mendistribusikan materi ini untuk kepentingan komersial tanpa izin tertulis dari manajemen kami.
            </p>
          </section>

          {/* Pasal 6: Hukum yang Berlaku */}
          <section className="pt-6 space-y-3">
            <h3 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-2">
              <span className="w-5 h-5 bg-[#FAF8F5] border border-[#E7DFD5] text-[#9A3412] text-xs font-bold flex items-center justify-center">
                6
              </span>
              <span>Penyelesaian Perselisihan & Hukum</span>
            </h3>
            <p>
              Syarat dan Ketentuan ini tunduk dan ditafsirkan berdasarkan hukum Negara Kesatuan Republik Indonesia. Setiap perselisihan yang timbul dari pelaksanaan transaksi diutamakan diselesaikan secara musyawarah untuk mufakat melalui saluran Customer Support kami.
            </p>
          </section>
        </div>

        {/* Quick Links Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E7DFD5]">
          <Link
            to="/refund-policy"
            className="text-xs font-semibold text-[#9A3412] hover:underline flex items-center gap-1"
          >
            <span>Pelajari Kebijakan Retur & Refund</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/products"
            className="py-2.5 px-5 text-xs font-bold uppercase tracking-wider text-white bg-[#1C1917] hover:bg-[#9A3412] transition-colors"
          >
            Jelajahi Koleksi
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Terms;
