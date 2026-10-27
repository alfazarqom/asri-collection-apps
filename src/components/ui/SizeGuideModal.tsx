import React from "react";
import { X, Ruler } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white border border-[#E7DFD5] p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#E7DFD5]">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-[#9A3412]" />
            <h3 className="font-serif text-lg font-bold text-[#1C1917]">
              Panduan Ukuran Standar (cm)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-[#1C1917] transition-colors"
            aria-label="Tutup panduan ukuran"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 text-xs text-stone-600 leading-relaxed">
          Semua ukuran diukur secara mendatar (flat measurement) dalam satuan sentimeter (cm). Toleransi jahitan ±1–2 cm.
        </div>

        {/* Tabel Gamis & Dresses */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#9A3412] mb-2">
            Gamis, Abaya & Dress
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E7DFD5] bg-[#F4EFEA] text-stone-700">
                  <th className="py-2 px-3 font-semibold">Ukuran</th>
                  <th className="py-2 px-3 font-semibold">Lingkar Dada (LD)</th>
                  <th className="py-2 px-3 font-semibold">Panjang Badan (PB)</th>
                  <th className="py-2 px-3 font-semibold">Panjang Lengan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7DFD5] tabular-nums">
                <tr>
                  <td className="py-2 px-3 font-medium">S</td>
                  <td className="py-2 px-3">94 cm</td>
                  <td className="py-2 px-3">136 cm</td>
                  <td className="py-2 px-3">56 cm</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">M</td>
                  <td className="py-2 px-3">100 cm</td>
                  <td className="py-2 px-3">138 cm</td>
                  <td className="py-2 px-3">57 cm</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">L</td>
                  <td className="py-2 px-3">106 cm</td>
                  <td className="py-2 px-3">140 cm</td>
                  <td className="py-2 px-3">58 cm</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">XL</td>
                  <td className="py-2 px-3">112 cm</td>
                  <td className="py-2 px-3">142 cm</td>
                  <td className="py-2 px-3">59 cm</td>
                </tr>
                <tr className="bg-[#FAF8F5]">
                  <td className="py-2 px-3 font-medium text-[#9A3412]">All Size</td>
                  <td className="py-2 px-3">104–108 cm</td>
                  <td className="py-2 px-3">140 cm</td>
                  <td className="py-2 px-3">58 cm</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabel Tunik & Atasan */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#9A3412] mb-2">
            Tunik & Blouse
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E7DFD5] bg-[#F4EFEA] text-stone-700">
                  <th className="py-2 px-3 font-semibold">Ukuran</th>
                  <th className="py-2 px-3 font-semibold">Lingkar Dada</th>
                  <th className="py-2 px-3 font-semibold">Panjang Baju</th>
                  <th className="py-2 px-3 font-semibold">Lingkar Ketiak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7DFD5] tabular-nums">
                <tr>
                  <td className="py-2 px-3 font-medium">S</td>
                  <td className="py-2 px-3">92 cm</td>
                  <td className="py-2 px-3">85 cm</td>
                  <td className="py-2 px-3">46 cm</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">M</td>
                  <td className="py-2 px-3">98 cm</td>
                  <td className="py-2 px-3">88 cm</td>
                  <td className="py-2 px-3">48 cm</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">L</td>
                  <td className="py-2 px-3">104 cm</td>
                  <td className="py-2 px-3">90 cm</td>
                  <td className="py-2 px-3">50 cm</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">XL</td>
                  <td className="py-2 px-3">110 cm</td>
                  <td className="py-2 px-3">92 cm</td>
                  <td className="py-2 px-3">52 cm</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-2 border-t border-[#E7DFD5] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-medium text-white bg-[#1C1917] hover:bg-stone-800 transition-colors"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;
