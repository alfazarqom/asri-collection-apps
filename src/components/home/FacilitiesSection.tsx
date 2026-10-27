import React from "react";
import { ShieldCheck, Truck, CreditCard, RefreshCw } from "lucide-react";

export const FacilitiesSection: React.FC = () => {
  const facilities = [
    {
      icon: ShieldCheck,
      title: "Garansi Keaslian 100%",
      desc: "Serat sutra Mulberry dan katun poplin alami bersertifikasi mutu butik.",
    },
    {
      icon: Truck,
      title: "Pengiriman Nusantara",
      desc: "Bebas ongkos kirim min. belanja Rp 350rb dengan packing eksklusif.",
    },
    {
      icon: CreditCard,
      title: "Duitku POP Payment",
      desc: "Konfirmasi instan otomatis via QRIS (BCA, GoPay, ShopeePay) & Virtual Account.",
    },
    {
      icon: RefreshCw,
      title: "Garansi Retur 7 Hari",
      desc: "Jaminan tukar ukuran atau pengembalian jika ditemukan cacat jahitan.",
    },
  ];

  return (
    <section className="bg-white border-b border-[#E7DFD5] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#E7DFD5]">
          {facilities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 pt-4 sm:pt-0 sm:px-4 first:pl-0 last:pr-0"
              >
                <div className="p-2.5 bg-[#FAF8F5] border border-[#E7DFD5] text-[#9A3412] shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1917]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection;
