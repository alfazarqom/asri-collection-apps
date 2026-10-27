import React from "react";
import { Link } from "react-router-dom";
import { Truck, MapPin, Clock, ShieldCheck, PackageCheck, AlertCircle, ArrowRight } from "lucide-react";

export const ShippingPolicy: React.FC = () => {
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
            <span className="text-[#1C1917]">Kebijakan Pengiriman</span>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A3412]">
            <Truck className="w-3.5 h-3.5" />
            <span>Informasi Logistik & Pengantaran</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] tracking-tight">
            Kebijakan Pengiriman Asri Collection
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Terakhir diperbarui: 27 Oktober 2026. Kami berkomitmen memastikan setiap busana muslimah dan koleksi butik Anda dikemas secara eksklusif dan tiba tepat waktu dengan aman ke seluruh penjuru Nusantara.
          </p>
        </div>

        {/* Highlight Grid: Biaya & Promo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#E7DFD5] p-6 space-y-2">
            <div className="w-8 h-8 bg-amber-50 border border-amber-200 text-[#9A3412] flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-sm font-bold text-[#1C1917]">
              Gratis Ongkir min. Rp 350.000
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Dapatkan subsidi ongkos kirim otomatis untuk setiap pemesanan dengan total keranjang belanja minimal Rp 350.000.
            </p>
          </div>

          <div className="bg-white border border-[#E7DFD5] p-6 space-y-2">
            <div className="w-8 h-8 bg-stone-100 border border-stone-200 text-stone-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-sm font-bold text-[#1C1917]">
              Proses Cepat 1x24 Jam
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Pesanan lolos Quality Control (QC) dan diserahkan ke mitra ekspedisi dalam waktu 1x24 jam kerja setelah pembayaran terkonfirmasi.
            </p>
          </div>

          <div className="bg-white border border-[#E7DFD5] p-6 space-y-2">
            <div className="w-8 h-8 bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-sm font-bold text-[#1C1917]">
              Lacak Resi Real-Time
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Nomor resi resmi otomatis diinfokan melalui WhatsApp dan dapat dilacak langsung melalui menu Lacak Pesanan kami.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="bg-white border border-[#E7DFD5] p-6 sm:p-8 space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed divide-y divide-[#E7DFD5]">
          {/* Section 1: Cakupan Wilayah */}
          <section className="space-y-3">
            <h3 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-2">
              <span className="w-5 h-5 bg-[#FAF8F5] border border-[#E7DFD5] text-[#9A3412] text-xs font-bold flex items-center justify-center">
                1
              </span>
              <span>Cakupan Wilayah Pengiriman</span>
            </h3>
            <p>
              Asri Collection melayani pengiriman ke seluruh wilayah Republik Indonesia:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li><strong>Jabodetabek:</strong> Jakarta, Bogor, Depok, Tangerang, dan Bekasi.</li>
              <li><strong>Pulau Jawa & Madura:</strong> Seluruh kota dan kabupaten di Jawa Barat, Jawa Tengah, DI Yogyakarta, dan Jawa Timur.</li>
              <li><strong>Luar Pulau Jawa:</strong> Sumatera, Kalimantan, Sulawesi, Bali, Nusa Tenggara Barat, Nusa Tenggara Timur, Maluku, dan Papua hingga ke tingkat kecamatan yang terjangkau jaringan ekspedisi reguler.</li>
            </ul>
          </section>

          {/* Section 2: Tarif & Ekspedisi */}
          <section className="pt-6 space-y-4">
            <h3 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-2">
              <span className="w-5 h-5 bg-[#FAF8F5] border border-[#E7DFD5] text-[#9A3412] text-xs font-bold flex items-center justify-center">
                2
              </span>
              <span>Tarif Biaya Pengiriman & Mitra Ekspedisi</span>
            </h3>
            <p>
              Biaya pengiriman dihitung secara transparan berdasarkan zona wilayah tujuan:
            </p>

            <div className="overflow-x-auto border border-[#E7DFD5]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] border-b border-[#E7DFD5] text-stone-800 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-4">Zona Wilayah</th>
                    <th className="py-2.5 px-4">Tarif Standar</th>
                    <th className="py-2.5 px-4">Estimasi Sampai</th>
                    <th className="py-2.5 px-4">Promo Bebas Ongkir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7DFD5] text-stone-600">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-stone-800">Jabodetabek</td>
                    <td className="py-3 px-4">Rp 18.000</td>
                    <td className="py-3 px-4">1 – 2 Hari Kerja</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">Belanja min. Rp 350.000</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-stone-800">Pulau Jawa (Luar Jabodetabek)</td>
                    <td className="py-3 px-4">Rp 28.000</td>
                    <td className="py-3 px-4">2 – 4 Hari Kerja</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">Belanja min. Rp 350.000</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-stone-800">Luar Pulau Jawa (Kota/Kabupaten)</td>
                    <td className="py-3 px-4">Mulai Rp 45.000</td>
                    <td className="py-3 px-4">3 – 6 Hari Kerja</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">Subsidi potongan ongkir</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-stone-500 text-xs">
              * Mitra kurir yang kami gunakan meliputi <strong>JNE Regular / YES, SiCepat Ekspres, dan J&T Express</strong>. Pemilihan kurir disesuaikan dengan rute tercepat menuju lokasi Anda.
            </p>
          </section>

          {/* Section 3: Waktu Operasional Pengiriman */}
          <section className="pt-6 space-y-3">
            <h3 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-2">
              <span className="w-5 h-5 bg-[#FAF8F5] border border-[#E7DFD5] text-[#9A3412] text-xs font-bold flex items-center justify-center">
                3
              </span>
              <span>Jadwal Penjemputan Paket (Pick-up)</span>
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li>
                <strong>Senin – Jumat:</strong> Pembayaran yang terkonfirmasi sebelum pukul 15.00 WIB dikirimkan pada hari yang sama. Pembayaran setelah pukul 15.00 WIB dikirim pada hari kerja berikutnya.
              </li>
              <li>
                <strong>Sabtu:</strong> Pembayaran yang terkonfirmasi sebelum pukul 13.00 WIB dikirim pada hari yang sama.
              </li>
              <li>
                <strong>Minggu & Hari Libur Nasional:</strong> Tidak ada jadwal pengiriman kurir. Seluruh pesanan yang masuk dipersiapkan dan dikirim pada hari kerja terdekat.
              </li>
            </ul>
          </section>

          {/* Section 4: Standar Pengemasan Aman Butik */}
          <section className="pt-6 space-y-3">
            <h3 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-2">
              <span className="w-5 h-5 bg-[#FAF8F5] border border-[#E7DFD5] text-[#9A3412] text-xs font-bold flex items-center justify-center">
                4
              </span>
              <span>Standar Pengemasan (Packaging) Butik</span>
            </h3>
            <p>
              Untuk menjaga serat Mulberry Silk dan katun alami tetap bersih dan tidak kusut selama perjalanan:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li>Setiap busana dibungkus zipper bag plastik butik kedap debu dan air.</li>
              <li>Dilengkapi dengan kartu terima kasih (thank you card) dan instruksi perawatan busana resmi.</li>
              <li>Bagian luar dilapisi polymailer tebal berperekat permanen anti-robek dan anti-air dengan stiker segel resmi Asri Collection.</li>
            </ul>
          </section>

          {/* Section 5: Pelacakan & Kendala */}
          <section className="pt-6 space-y-3">
            <h3 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-2">
              <span className="w-5 h-5 bg-[#FAF8F5] border border-[#E7DFD5] text-[#9A3412] text-xs font-bold flex items-center justify-center">
                5
              </span>
              <span>Pelacakan Resi & Penanganan Keterlambatan</span>
            </h3>
            <p>
              Setelah paket diserahkan ke kurir, Anda dapat melacak posisi pengiriman langsung di menu <Link to="/orders" className="text-[#9A3412] font-semibold hover:underline">Lacak Pesanan</Link> dengan memasukkan Order ID Anda.
            </p>
            <p>
              Jika dalam waktu 7 hari kerja paket belum tiba atau tracking kurir tidak bergerak (stuck), segera hubungi WhatsApp Customer Care kami di <strong>+62 821-5676-4434</strong> agar kami bantu eskalasi ke perwakilan pusat ekspedisi.
            </p>
          </section>
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E7DFD5]">
          <Link
            to="/orders"
            className="text-xs font-semibold text-[#9A3412] hover:underline flex items-center gap-1"
          >
            <span>Sudah Punya Pesanan? Lacak Status Pengiriman Di Sini</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/refund-policy"
            className="text-xs font-semibold text-stone-600 hover:text-[#9A3412]"
          >
            Pelajari Kebijakan Pengembalian & Refund
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
