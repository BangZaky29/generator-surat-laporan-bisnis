import React from 'react';
import { Card, Input, Button } from '../ui/Input';
import { DynamicList } from '../ui/DynamicList';
import { ReportData } from '../../types';
import { ArrowLeft, FileBarChart, Briefcase, ShoppingBag, Factory } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  data: ReportData;
  onUpdate: (data: Partial<ReportData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const DataEntry: React.FC<Props> = ({ data, onUpdate, onNext, onBack }) => {

  const getHeaderInfo = () => {
    switch (data.type) {
      case 'dagang':
        return {
          title: 'Input Data Perusahaan Dagang',
          desc: 'Fokus pada stok awal, pembelian barang, dan stok akhir.',
          icon: ShoppingBag,
          color: 'bg-emerald-50 text-emerald-700 border-emerald-100'
        };
      case 'manufaktur':
        return {
          title: 'Input Data Perusahaan Manufaktur',
          desc: 'Lengkapi biaya bahan baku, tenaga kerja, dan overhead.',
          icon: Factory,
          color: 'bg-orange-50 text-orange-700 border-orange-100'
        };
      default:
        return {
          title: 'Input Data Perusahaan Jasa',
          desc: 'Masukkan pendapatan jasa dan biaya operasional.',
          icon: Briefcase,
          color: 'bg-indigo-50 text-indigo-700 border-indigo-100'
        };
    }
  };

  const header = getHeaderInfo();
  const HeaderIcon = header.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner - Shows Business Model Title */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-xl border flex items-center gap-5 shadow-sm ${header.color}`}
      >
        <div className="p-3 bg-white rounded-lg shadow-sm bg-opacity-60 hidden sm:block">
          <HeaderIcon size={32} />
        </div>
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="sm:hidden"><HeaderIcon size={20}/></span>
            {header.title}
          </h2>
          <p className="text-sm opacity-90 mt-1">{header.desc}</p>
        </div>
      </motion.div>

      {/* 1. INCOME SECTION (All Types) */}
      <Card title="1. Pendapatan / Penjualan">
        <p className="text-sm text-slate-500 mb-4">
          Masukkan semua sumber pendapatan bisnis Anda selama periode ini.
        </p>
        <DynamicList 
          title="Rincian Pendapatan"
          items={data.incomes}
          onUpdate={(items) => onUpdate({ incomes: items })}
          emptyLabel="Belum ada data pendapatan"
        />
      </Card>

      {/* 2. COST OF GOODS SOLD SECTION (Specific) */}
      
      {/* 2a. DAGANG: Inventory & Purchases */}
      {data.type === 'dagang' && (
        <Card title="2. Harga Pokok Penjualan (HPP)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
            <Input 
              label="Nilai Persediaan Awal" 
              isCurrency 
              value={data.beginningInventory} 
              onChange={(e) => onUpdate({ beginningInventory: Number(e.target.value) })}
            />
            <Input 
              label="Nilai Persediaan Akhir" 
              isCurrency 
              value={data.endingInventory} 
              onChange={(e) => onUpdate({ endingInventory: Number(e.target.value) })}
            />
          </div>
          <DynamicList 
            title="Pembelian Barang Dagang"
            items={data.purchases}
            onUpdate={(items) => onUpdate({ purchases: items })}
            emptyLabel="Belum ada data pembelian"
          />
        </Card>
      )}

      {/* 2b. MANUFAKTUR: Manufacturing Costs */}
      {data.type === 'manufaktur' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <Card title="2. Biaya Produksi - Bahan Baku">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-orange-50 p-4 rounded-lg">
              <Input label="Persediaan Bahan Baku Awal" isCurrency value={data.rawMaterialsBeginning} onChange={(e) => onUpdate({ rawMaterialsBeginning: Number(e.target.value) })} />
              <Input label="Persediaan Bahan Baku Akhir" isCurrency value={data.rawMaterialsEnding} onChange={(e) => onUpdate({ rawMaterialsEnding: Number(e.target.value) })} />
            </div>
            <DynamicList title="Pembelian Bahan Baku" items={data.rawMaterialPurchases} onUpdate={(items) => onUpdate({ rawMaterialPurchases: items })} />
          </Card>

          <Card title="3. Biaya Produksi - Tenaga Kerja & Overhead">
            <DynamicList title="Tenaga Kerja Langsung (Buruh/Tukang)" items={data.directLabor} onUpdate={(items) => onUpdate({ directLabor: items })} />
            <div className="border-t border-slate-100 my-4 pt-4">
              <DynamicList title="Overhead Pabrik (Listrik Pabrik, Penyusutan Mesin, dll)" items={data.factoryOverhead} onUpdate={(items) => onUpdate({ factoryOverhead: items })} />
            </div>
          </Card>

          <Card title="4. Inventori Barang Dalam Proses & Jadi">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3 text-sm">Barang Dalam Proses (WIP)</h4>
                <Input label="Nilai Awal WIP" isCurrency value={data.wipBeginning} onChange={(e) => onUpdate({ wipBeginning: Number(e.target.value) })} className="bg-white" />
                <Input label="Nilai Akhir WIP" isCurrency value={data.wipEnding} onChange={(e) => onUpdate({ wipEnding: Number(e.target.value) })} className="bg-white" />
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-3 text-sm">Barang Jadi (Finished Goods)</h4>
                <Input label="Nilai Awal Barang Jadi" isCurrency value={data.finishedGoodsBeginning} onChange={(e) => onUpdate({ finishedGoodsBeginning: Number(e.target.value) })} className="bg-white" />
                <Input label="Nilai Akhir Barang Jadi" isCurrency value={data.finishedGoodsEnding} onChange={(e) => onUpdate({ finishedGoodsEnding: Number(e.target.value) })} className="bg-white" />
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* 3. EXPENSES (All Types) */}
      <Card title={data.type === 'jasa' ? "2. Biaya Operasional" : "Biaya Operasional (Non-Produksi)"}>
        <p className="text-sm text-slate-500 mb-4">
          Biaya umum seperti Gaji Admin, Listrik Kantor, Sewa Ruko, Pemasaran, dll.
        </p>
        <DynamicList 
          title="Daftar Beban / Biaya"
          items={data.expenses}
          onUpdate={(items) => onUpdate({ expenses: items })}
          emptyLabel="Belum ada data biaya"
        />
      </Card>

      {/* NAVIGATION */}
      <div className="mt-8 pt-4 border-t border-slate-200">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft size={16} className="mr-2" /> Kembali
          </Button>
          <Button onClick={onNext} variant="secondary" className="px-6">
            Lanjut ke Laporan <FileBarChart size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};