import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, Eye, FileText, ArrowRight, UserCheck, PhoneCall } from "lucide-react";

export const PrivacyPolicy: React.FC = () => {
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
            <span className="text-[#1C1917]">Kebijakan Privasi</span>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A3412]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Perlindungan Data & Privasi</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] tracking-tight">
            Kebijakan Privasi Asri Collection
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Terakhir diperbarui: 27 Oktober 2026. Dokumen ini menjelaskan komitmen kami dalam mengumpulkan, mengelola, menyimpan, dan melindungi data pribadi setiap pelanggan yang bertransaksi di website Asri Collection.
          </p>
        </div>

        {/* Ringkasan Komitmen */}
        <div className="bg-white border border-[#E7DFD5] p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <h2 className="font-serif text-lg font-bold text-[#1C1917]">
              Prinsip Perlindungan Privasi Kami
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Asri Collection menjunjung tinggi hak privasi Anda. Kami <strong>tidak pernah menjual, menyewakan, atau memperdagangkan data pribadi pelanggan</strong> kepada pihak ketiga mana pun untuk tujuan periklanan atau komersial di luar ekosistem layanan butik kami.
          </p>
        </div>

        {/* Isi Kebijakan Privasi */}
        <div className="bg-white border border-[#E7DFD5] p-6 sm:p-8 space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed divide-y divide-[#E7DFD5]">
          {/* Bagian 1: Data yang Dikumpulkan */}
          <section className="space-y-3">
            <h3 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-2">
              <span className="w-5 h-5 bg-[#FAF8F5] border border-[#E7DFD5] text-[#9A3412] text-xs font-bold flex items-center justify-center">
                1
              </span>
              <span>Data Pribadi yang Kami Kumpulkan</span>
            </h3>
            <p>
              Saat Anda berbelanja melalui formulir checkout atau berkonsultasi melalui layanan pelanggan kami, data yang kami minta mencakup:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li>
                <strong>Identitas Diri:</strong> Nama lengkap penerima pesanan.
              </li>
              <li>
                <strong>Informasi Kontak:</strong> Nomor WhatsApp / handphone aktif dan alamat email untuk notifikasi pesanan dan konfirmasi pengiriman.
              </li>
              <li>
                <strong>Alamat Pengiriman Lengkap:</strong> Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota/kabupaten, provinsi, dan kode pos.
              </li>
              <li>
                <strong>Data Transaksi:</strong> Rincian item busana yang dipesan, varian ukuran, varian warna, nilai transaksi, catatan khusus, dan bukti transfer pembayaran jika menggunakan konfirmasi manual.
              </li>
            </ul>
          </section>

          {/* Bagian 2: Tujuan Penggunaan Data */}
          <section className="pt-6 space-y-3">
            <h3 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-2">
              <span className="w-5 h-5 bg-[#FAF8F5] border border-[#E7DFD5] text-[#9A3412] text-xs font-bold flex items-center justify-center">
                2
              </span>
              <span>Tujuan Penggunaan Data Pelanggan</span>
            </h3>
            <p>
              Data pribadi yang Anda berikan semata-mata digunakan untuk kepentingan:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li>Memproses pesanan busana dan memverifikasi ketersediaan stok fisik atelier.</li>
              <li>Mencetak label pengiriman resmi untuk kurir ekspedisi (JNE, SiCepat, J&T).</li>
              <li>Mengirimkan informasi nomor resi dan pelacakan status pesanan secara berkala.</li>
              <li>
                Memfasilitasi layanan pelanggan, konsultasi ukuran, serta pengajuan retur barang atau proses refund sesuai ketentuan.
              </li>
              <li>Mencegah aktivitas kecurangan atau transaksi tidak sah pada platform kami.</li>
            </ul>
          </section>

          {/* Bagian 3: Penyimpanan dan Keamanan */}
          <section className="pt-6 space-y-3">
            <h3 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-2">
              <span className="w-5 h-5 bg-[#FAF8F5] border border-[#E7DFD5] text-[#9A3412] text-xs font-bold flex items-center justify-center">
                3
              </span>
              <span>Penyimpanan & Keamanan Informasi</span>
            </h3>
            <p>
              Kami menerapkan standar pengamanan teknis dan organisasi yang ketat:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li>
                Seluruh komunikasi data di website dilindungi dengan sertifikat enkripsi SSL/TLS (HTTPS) standar industri.
              </li>
              <li>
                Asri Collection tidak menyimpan nomor kartu kredit atau kredensial perbankan pelanggan di server kami.
              </li>
              <li>
                Akses ke data alamat dan nomor telepon dibatasi hanya untuk staf logistik dan Customer Support resmi kami yang berkepentingan langsung dengan penyiapan pesanan.
              </li>
            </ul>
          </section>

          {/* Bagian 4: Pengungkapan kepada Pihak Ketiga */}
          <section className="pt-6 space-y-3">
            <h3 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-2">
              <span className="w-5 h-5 bg-[#FAF8F5] border border-[#E7DFD5] text-[#9A3412] text-xs font-bold flex items-center justify-center">
                4
              </span>
              <span>Pengungkapan Data kepada Pihak Ketiga Terbatas</span>
            </h3>
            <p>
              Kami hanya membagikan data pribadi Anda kepada pihak ketiga resmi yang secara esensial terlibat dalam rantai pasok pemenuhan pesanan:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li>
                <strong>Mitra Ekspedisi Logistik (JNE / SiCepat / J&T):</strong> Menerima nama, nomor telepon, dan alamat tujuan fisik semata-mata guna mengantarkan paket ke tangan Anda.
              </li>
              <li>
                <strong>Otoritas Hukum Berwenang:</strong> Hanya jika diwajibkan oleh peraturan perundang-undangan Republik Indonesia yang berlaku secara sah.
              </li>
            </ul>
          </section>

          {/* Bagian 5: Hak Pelanggan atas Data */}
          <section className="pt-6 space-y-3">
            <h3 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-2">
              <span className="w-5 h-5 bg-[#FAF8F5] border border-[#E7DFD5] text-[#9A3412] text-xs font-bold flex items-center justify-center">
                5
              </span>
              <span>Hak Pelanggan atas Data Pribadi</span>
            </h3>
            <p>
              Setiap pelanggan berhak untuk:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li>Mengetahui data apa saja yang tercatat dalam riwayat pesanan Anda.</li>
              <li>Meminta koreksi atau pembaruan alamat pengiriman sebelum barang diserahkan ke kurir.</li>
              <li>Meminta penghapusan kontak Anda dari daftar siaran informasi butik kapan pun.</li>
            </ul>
            <p className="pt-1">
              Untuk mengajukan permohonan terkait data pribadi, silakan hubungi tim kami melalui email <strong>care@asricollection.id</strong> atau WhatsApp Official CS di <strong>+62 821-5676-4434</strong>.
            </p>
          </section>
        </div>

        {/* Footer Navigation Back to Shopping */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E7DFD5]">
          <Link
            to="/terms"
            className="text-xs font-semibold text-[#9A3412] hover:underline flex items-center gap-1"
          >
            <span>Baca Syarat & Ketentuan Transaksi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/products"
            className="py-2.5 px-5 text-xs font-bold uppercase tracking-wider text-white bg-[#1C1917] hover:bg-[#9A3412] transition-colors"
          >
            Lanjut Berbelanja
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
