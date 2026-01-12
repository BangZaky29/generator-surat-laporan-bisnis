import { FileText } from 'lucide-react'
import logo from '../assets/NS_white_01.png';

export default function Header() {
  return (
    <div className="bg-white border-b border-border-gray shadow-sm">
      <div className="max-w-full px-4 md:px-1 py-3 md:py-5">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-32 h-32 border-gray-300 rounded-xl shadow-[5px_5px_12px_rgba(0,0,0,0.11)]">
            <img src={logo} alt="Logo"/>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-base md:text-xl font-bold text-gray-900 truncate">
              Generator Laporan Bisnis
            </h1>
            <p className="text-xs md:text-sm text-gray-600 truncate">
              Buat laporan cepat, rapi, dan siap cetak
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}