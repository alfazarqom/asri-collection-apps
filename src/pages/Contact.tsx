import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  CheckCircle2,
  Send,
  HelpCircle,
  Truck,
  RotateCcw,
  CreditCard,
  Sparkles,
} from "lucide-react";

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    subject: "Ukuran & Bahan",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) return;

    setSubmitted(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Halo Asri Collection, nama saya ${formData.name || "[Nama]"}.\nTopik: ${formData.subject}\nPesan: ${formData.message || "Saya ingin konsultasi busana."}`
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A3412]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Saluran Resmi Layanan Pelanggan</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1917] tracking-tight">
            Hubungi Asri Collection
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Tim konsultan butik dan customer care kami siap membantu konsultasi ukuran, verifikasi pembayaran, informasi pengiriman, serta layanan purna jual.
          </p>
        </div>

        {/* 3 Main Direct Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: WhatsApp CS */}
          <div className="bg-white border border-[#E7DFD5] p-6 flex flex-col justify-between hover:border-[#9A3412] transition-colors shadow-xs">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                WhatsApp Customer Support
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Saluran tercepat untuk respon langsung seputar panduan ukuran, ketersediaan stok, dan konfirmasi transfer bank.
              </p>
              <div className="text-xs font-semibold text-stone-800">
                +62 821-5676-4434
              </div>
            </div>
            <div className="pt-6">
              <a
                href="https://wa.me/6282156764434?text=Halo%20Asri%20Collection%2C%20saya%20ingin%20berkonsultasi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-white bg-emerald-700 hover:bg-emerald-800 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat WhatsApp Sekarang</span>
              </a>
            </div>
          </div>

          {/* Card 2: Email Resmi */}
          <div className="bg-white border border-[#E7DFD5] p-6 flex flex-col justify-between hover:border-[#9A3412] transition-colors shadow-xs">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-stone-100 border border-stone-300 text-stone-800 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                Email Korespondensi Resmi
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Untuk pertanyaan formal, kendala transaksi perbankan, penawaran kerjasama butik, atau keperluan administrasi.
              </p>
              <div className="text-xs font-semibold text-stone-800">
                care@asricollection.id
              </div>
            </div>
            <div className="pt-6">
              <a
                href="mailto:care@asricollection.id?subject=Pertanyaan%20Pelanggan%20Asri%20Collection"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-[#1C1917] bg-[#FAF8F5] hover:bg-[#F4EFEA] border border-[#E7DFD5] transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Kirim Email Resmi</span>
              </a>
            </div>
          </div>

          {/* Card 3: Atelier & Jam Buka */}
          <div className="bg-white border border-[#E7DFD5] p-6 flex flex-col justify-between hover:border-[#9A3412] transition-colors shadow-xs">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-amber-50 border border-amber-200 text-[#9A3412] flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                Jam Layanan & Workshop
              </h3>
              <div className="space-y-1 text-xs text-stone-600">
                <p>
                  <strong className="text-stone-800">Senin – Sabtu:</strong> 08.30 – 21.00 WIB
                </p>
                <p>
                  <strong className="text-stone-800">Minggu & Libur Nasional:</strong> 10.00 – 17.00 WIB
                </p>
              </div>
              <div className="pt-1 flex items-start gap-2 text-xs text-stone-600">
                <MapPin className="w-4 h-4 text-[#9A3412] shrink-0 mt-0.5" />
                <span>Jl. Kemang Raya No. 42, Jakarta Selatan 12730</span>
              </div>
            </div>
            <div className="pt-6">
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-[#1C1917] bg-[#FAF8F5] hover:bg-[#F4EFEA] border border-[#E7DFD5] transition-colors"
              >
                <span>Profil & Lokasi Butik</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Form & Quick FAQ Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Form */}
          <div className="lg:col-span-7 bg-white border border-[#E7DFD5] p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#9A3412]">
                Formulir Bantuan
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1C1917] mt-1">
                Kirim Pesan ke Tim Customer Care
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Tuliskan pertanyaan atau kebutuhan Anda, kami akan segera merespons.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 text-stone-800 space-y-4">
                <div className="flex items-center gap-3 text-emerald-800">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <h3 className="font-serif text-base font-bold">
                    Pesan Anda Telah Diterima
                  </h3>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Terima kasih, <strong>{formData.name}</strong>. Tim Asri Collection telah mencatat permohonan Anda dengan subjek <em>{formData.subject}</em>. Untuk respon instan tanpa menunggu email, Anda dapat langsung meneruskan pesan ini ke WhatsApp resmi butik kami.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <a
                    href={`https://wa.me/6282156764434?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-2.5 px-5 text-xs font-bold uppercase tracking-wider text-white bg-emerald-700 hover:bg-emerald-800 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Lanjutkan via WhatsApp CS</span>
                  </a>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", contact: "", subject: "Ukuran & Bahan", message: "" });
                    }}
                    className="py-2.5 px-4 text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 transition-colors"
                  >
                    Kirim Pesan Lain
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Siti Fatimah"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2.5 border border-[#E7DFD5] bg-white text-stone-800 focus:outline-none focus:border-[#9A3412]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Nomor WhatsApp atau Email *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="0812xxxx atau email@domain.com"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="w-full px-3 py-2.5 border border-[#E7DFD5] bg-white text-stone-800 focus:outline-none focus:border-[#9A3412]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Kategori Pertanyaan
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2.5 border border-[#E7DFD5] bg-white text-stone-800 focus:outline-none focus:border-[#9A3412]"
                    >
                      <option value="Ukuran & Bahan">Konsultasi Ukuran & Material Serat</option>
                      <option value="Konfirmasi Transfer Pembayaran">Konfirmasi Pembayaran & Transfer Bank</option>
                      <option value="Status Pengiriman & Resi">Status Pengiriman & Nomor Resi</option>
                      <option value="Pengajuan Retur / Refund">Pengajuan Retur Ukuran / Refund</option>
                      <option value="Kemitraan & Pesanan Khusus">Pesanan Khusus / Kerjasama Butik</option>
                      <option value="Lainnya">Pertanyaan Lainnya</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Detail Pesan atau Pertanyaan *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tuliskan nomor pesanan jika ada, atau ukuran lingkar dada/tinggi badan Anda untuk rekomendasi busana..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2.5 border border-[#E7DFD5] bg-white text-stone-800 focus:outline-none focus:border-[#9A3412]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto py-3 px-8 text-xs font-bold uppercase tracking-wider text-white bg-[#1C1917] hover:bg-[#9A3412] transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Pertanyaan</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right: Quick Links to Policies & FAQ */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-[#E7DFD5] p-6 space-y-4">
              <h3 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#9A3412]" />
                <span>Pusat Bantuan Cepat</span>
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Temukan panduan lengkap dan ketentuan resmi butik Asri Collection melalui tautan berikut:
              </p>
              <div className="divide-y divide-[#E7DFD5] text-xs">
                <Link
                  to="/shipping-policy"
                  className="py-3 flex items-center justify-between text-stone-700 hover:text-[#9A3412] transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-stone-400 group-hover:text-[#9A3412]" />
                    <span>Kebijakan Pengiriman & Ekspedisi</span>
                  </span>
                  <span className="text-stone-400">&rarr;</span>
                </Link>

                <Link
                  to="/refund-policy"
                  className="py-3 flex items-center justify-between text-stone-700 hover:text-[#9A3412] transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-stone-400 group-hover:text-[#9A3412]" />
                    <span>Kebijakan Retur & Refund (Garansi 7 Hari)</span>
                  </span>
                  <span className="text-stone-400">&rarr;</span>
                </Link>

                <Link
                  to="/payment-policy"
                  className="py-3 flex items-center justify-between text-stone-700 hover:text-[#9A3412] transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-stone-400 group-hover:text-[#9A3412]" />
                    <span>Informasi Metode Pembayaran Toko</span>
                  </span>
                  <span className="text-stone-400">&rarr;</span>
                </Link>

                <Link
                  to="/privacy-policy"
                  className="py-3 flex items-center justify-between text-stone-700 hover:text-[#9A3412] transition-colors group"
                >
                  <span>Kebijakan Privasi Data Pelanggan</span>
                  <span className="text-stone-400">&rarr;</span>
                </Link>

                <Link
                  to="/terms"
                  className="py-3 flex items-center justify-between text-stone-700 hover:text-[#9A3412] transition-colors group"
                >
                  <span>Syarat & Ketentuan Transaksi</span>
                  <span className="text-stone-400">&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Rekening Verifikasi Callout */}
            <div className="bg-[#F4EFEA] border border-[#E7DFD5] p-5 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A3412]">
                Peringatan Keamanan Transaksi
              </span>
              <p className="text-xs text-stone-700 leading-relaxed">
                Asri Collection hanya melayani transaksi pembayaran melalui rekening resmi dan verifikasi WhatsApp resmi <strong>+62 821-5676-4434</strong>. Kami tidak pernah meminta transfer ke nomor rekening atas nama perseorangan acak.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
