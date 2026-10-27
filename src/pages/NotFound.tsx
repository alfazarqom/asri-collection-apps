import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
      <span className="font-serif text-6xl sm:text-7xl font-bold text-[#9A3412] tracking-tighter">
        404
      </span>
      <h1 className="font-serif text-2xl font-bold text-[#1C1917] mt-3">
        Halaman Tidak Ditemukan
      </h1>
      <p className="text-xs text-stone-500 max-w-sm mt-2 mb-8">
        Halaman yang Anda tuju mungkin telah dipindahkan atau tidak tersedia. Mari kembali menikmati koleksi busana Asri Collection.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 py-3 px-6 text-xs font-bold uppercase tracking-wider text-white bg-[#1C1917] hover:bg-[#9A3412] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Beranda</span>
      </Link>
    </div>
  );
};

export default NotFound;
