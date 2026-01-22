import React from 'react';
import { Briefcase, ShoppingBag, Factory } from 'lucide-react';
import { motion } from 'framer-motion';
import { CompanyType } from '../../types';

interface OptionProps {
  type: CompanyType;
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: (type: CompanyType) => void;
}

const TypeCard: React.FC<OptionProps> = ({ type, icon, title, desc, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02, y: -5 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onClick(type)}
    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all text-left flex flex-col gap-4 group h-full"
  >
    <div className="p-4 bg-slate-50 rounded-xl text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors w-fit">
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  </motion.button>
);

export const CompanyTypeSelection: React.FC<{ onSelect: (type: CompanyType) => void }> = ({ onSelect }) => {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-3">Pilih Jenis Bisnis Anda</h2>
        <p className="text-slate-500">Kami akan menyesuaikan format laporan keuangan sesuai model bisnis Anda.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TypeCard
          type="jasa"
          icon={<Briefcase size={32} />}
          title="Perusahaan Jasa"
          desc="Untuk bisnis layanan seperti Konsultan, Bengkel, Salon, Laundry, atau Freelancer."
          onClick={onSelect}
        />
        <TypeCard
          type="dagang"
          icon={<ShoppingBag size={32} />}
          title="Perusahaan Dagang"
          desc="Untuk bisnis jual-beli barang jadi seperti Toko Retail, Distributor, atau Reseller."
          onClick={onSelect}
        />
        <TypeCard
          type="manufaktur"
          icon={<Factory size={32} />}
          title="Perusahaan Manufaktur"
          desc="Untuk bisnis yang memproduksi barang dari bahan mentah seperti Pabrik, Restoran, atau Katering."
          onClick={onSelect}
        />
      </div>
    </div>
  );
};