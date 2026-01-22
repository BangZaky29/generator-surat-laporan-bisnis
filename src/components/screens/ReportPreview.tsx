import React, { useState, useRef, useEffect } from 'react';
import { ReportData } from '../../types';
import { calculateFinance } from '../../utils/calculations';
import { formatRupiah } from '../../utils/formatters';
import { Button } from '../ui/Input';
import { Download, ArrowLeft, TrendingUp, TrendingDown, Wallet, Printer, Loader2, CheckCircle } from 'lucide-react';
import { exportToPDF } from '../../utils/pdfExporter';

interface Props {
  data: ReportData;
  onBack: () => void;
  onReset: () => void;
}

interface RowProps {
  label: string;
  value: number;
  isTotal?: boolean;
  isSub?: boolean;
  isBold?: boolean;
  colorClass?: string;
}

const Row: React.FC<RowProps> = ({ label, value, isTotal = false, isSub = false, isBold = false, colorClass = "" }) => (
  <div className={`flex justify-between py-1.5 break-inside-avoid ${isTotal ? 'border-t-2 border-slate-800 mt-2 pt-2 font-bold' : isSub ? 'border-t border-slate-300 mt-1 pt-1 font-semibold' : ''} ${colorClass}`}>
    <span className={`${isBold ? 'font-bold' : ''} ${isSub || isTotal ? '' : 'text-slate-700'}`}>{label}</span>
    <span>{formatRupiah(value)}</span>
  </div>
);

const SummaryCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between print:hidden">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{formatRupiah(value)}</p>
    </div>
    <div className={`p-3 rounded-lg ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : trend === 'down' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
      <Icon size={24} />
    </div>
  </div>
);

const formatDate = (dateString?: string) => {
  if (!dateString) return new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const ReportPreview: React.FC<Props> = ({ data, onBack, onReset }) => {
  const calc = calculateFinance(data);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  
  // Ref for Auto-Scaling
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Auto-Scale Logic: Fit A4 (210mm approx 794px) to screen width
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.offsetWidth;
        // 210mm in pixels at 96 DPI is approx 794px.
        // We add some padding buffer.
        const a4Width = 794; 
        
        // If screen is smaller than A4, scale down. If larger, cap at 1 (or 1.1 for slight zoom).
        const newScale = Math.min(1, (parentWidth - 32) / a4Width); 
        setScale(newScale);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial calc

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDownload = async () => {
    try {
      setDownloadStatus('loading');
      await exportToPDF('report-content', `Laporan_${data.type}_${data.companyName.replace(/\s+/g, '_')}_${data.period}`);
      setDownloadStatus('success');
      setTimeout(() => setDownloadStatus('idle'), 3000);
    } catch (error) {
      console.error(error);
      alert("Gagal mengunduh PDF. Silakan coba lagi.");
      setDownloadStatus('idle');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getReportTitle = () => {
    switch (data.type) {
      case 'dagang': return 'LAPORAN LABA RUGI PERUSAHAAN DAGANG';
      case 'manufaktur': return 'LAPORAN HARGA POKOK PRODUKSI & LABA RUGI';
      default: return 'LAPORAN LABA RUGI';
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0" ref={containerRef}>
      
      {/* Dashboard Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Preview Laporan</h2>
          <p className="text-slate-500">
            Model: <span className="font-semibold uppercase text-indigo-600">{data.type}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <Button onClick={onBack} variant="outline" className="flex-1 lg:flex-none">
            <ArrowLeft size={16} className="mr-2" /> Edit
          </Button>
          <Button onClick={handlePrint} variant="secondary" className="flex-1 lg:flex-none bg-emerald-600">
             <Printer size={16} className="mr-2" /> Cetak
          </Button>
          <Button 
            onClick={handleDownload} 
            disabled={downloadStatus === 'loading'}
            className={`flex-1 lg:flex-none shadow-lg transition-all ${
              downloadStatus === 'success' ? 'bg-green-600 shadow-green-200' : 'bg-indigo-600 shadow-indigo-200'
            }`}
          >
            {downloadStatus === 'loading' ? (
              <><Loader2 size={16} className="mr-2 animate-spin" /> Proses...</>
            ) : downloadStatus === 'success' ? (
              <><CheckCircle size={16} className="mr-2" /> Berhasil!</>
            ) : (
              <><Download size={16} className="mr-2" /> PDF</>
            )}
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
        <SummaryCard 
          title="Total Pendapatan" 
          value={calc.totalRevenue} 
          icon={TrendingUp} 
          color="text-slate-800" 
          trend="neutral"
        />
        <SummaryCard 
          title={data.type === 'jasa' ? "Total Beban" : "Total Beban & HPP"} 
          value={calc.totalOpex + calc.cogs} 
          icon={TrendingDown} 
          color="text-red-600" 
          trend="down"
        />
        <SummaryCard 
          title="Laba Bersih" 
          value={calc.netIncome} 
          icon={Wallet} 
          color="text-emerald-600" 
          trend="up"
        />
      </div>

      {/* A4 PREVIEW CONTAINER */}
      {/* Using dynamic transform: scale to perfectly fit mobile screens without clipping */}
      <div className="bg-slate-200/50 p-2 lg:p-8 rounded-xl overflow-hidden flex justify-center border border-slate-200 print:bg-white print:p-0 print:border-none print:block">
        
        <div 
          style={{ 
            transform: `scale(${scale})`, 
            transformOrigin: 'top center',
            marginBottom: `-${(1 - scale) * 100}%` // Fix layout gap caused by scaling
          }}
          className="transition-transform duration-200 ease-out print:transform-none"
        >
          {/* A4 PAPER */}
          {/* min-h-[297mm] allows infinite growth for pagination. No strict height. */}
          <div 
            id="report-content"
            className="w-[210mm] min-h-[297mm] bg-white shadow-xl p-[20mm] text-slate-900 relative flex flex-col print:shadow-none print:w-full print:p-0"
          >
            
            {/* CONTENT TOP */}
            <div className="mb-8">
              {/* Header */}
              <div className="flex items-center gap-6 border-b-4 border-slate-800 pb-6 mb-8 relative">
                {data.companyLogo && (
                  <div className="shrink-0">
                    <img 
                      src={data.companyLogo} 
                      alt="Logo" 
                      className="object-contain" 
                      style={{ width: `${(data.logoScale || 100)}px`, maxWidth: '200px' }}
                    />
                  </div>
                )}
                <div className="flex-grow text-center">
                  <h1 className="text-3xl font-bold uppercase tracking-wider text-slate-900 leading-tight mb-2">{data.companyName}</h1>
                  <h2 className="text-xl font-medium text-slate-700">{getReportTitle()}</h2>
                  <p className="text-slate-500 mt-1">Periode: {data.period}</p>
                </div>
              </div>

              <div className="space-y-6">
                
                {/* REVENUE */}
                <div className="break-inside-avoid">
                  <h3 className="font-bold uppercase text-sm text-slate-500 mb-2 border-b border-slate-200 pb-1">Pendapatan</h3>
                  <div className="pl-4 space-y-1">
                    {data.incomes.length === 0 && <p className="italic text-slate-400">Tidak ada data pendapatan</p>}
                    {data.incomes.map(item => (
                      <Row key={item.id} label={item.name} value={item.amount} />
                    ))}
                    <Row label="Total Pendapatan" value={calc.totalRevenue} isSub colorClass="text-indigo-700" />
                  </div>
                </div>

                {/* COGS (HPP) */}
                {data.type !== 'jasa' && (
                  <div className="break-inside-avoid">
                    <h3 className="font-bold uppercase text-sm text-slate-500 mb-2 border-b border-slate-200 pb-1">
                      {data.type === 'manufaktur' ? 'Harga Pokok Produksi & Penjualan' : 'Harga Pokok Penjualan'}
                    </h3>
                    <div className="pl-4 space-y-1 text-sm">
                      {data.type === 'dagang' ? (
                        <>
                          <Row label="Persediaan Awal Barang Dagang" value={data.beginningInventory} />
                          <Row label="Pembelian Bersih" value={calc.netPurchases} />
                          <div className="flex justify-between py-1 italic text-slate-500">
                            <span>Barang Tersedia Dijual</span>
                            <span>{formatRupiah(data.beginningInventory + calc.netPurchases)}</span>
                          </div>
                          <Row label="Persediaan Akhir Barang Dagang" value={data.endingInventory * -1} />
                        </>
                      ) : (
                        <>
                          <Row label="Persediaan Bahan Baku Awal" value={data.rawMaterialsBeginning} />
                          <Row label="Pembelian Bahan Baku" value={data.rawMaterialPurchases.reduce((a,b)=>a+b.amount,0)} />
                          <Row label="Persediaan Bahan Baku Akhir" value={data.rawMaterialsEnding * -1} />
                          <Row label="Pemakaian Bahan Baku Langsung" value={calc.rawMaterialsUsed} isSub />
                          
                          <div className="mt-2"></div>
                          <Row label="Biaya Tenaga Kerja Langsung" value={data.directLabor.reduce((a,b)=>a+b.amount,0)} />
                          <Row label="Biaya Overhead Pabrik" value={data.factoryOverhead.reduce((a,b)=>a+b.amount,0)} />
                          <Row label="Total Biaya Produksi" value={calc.totalManufacturingCost} isSub />
                          
                          <div className="mt-2"></div>
                          <Row label="Persediaan Barang Dalam Proses Awal" value={data.wipBeginning} />
                          <Row label="Persediaan Barang Dalam Proses Akhir" value={data.wipEnding * -1} />
                          <Row label="Harga Pokok Produksi (COGM)" value={calc.cogm} isSub colorClass="text-blue-700" />
                          
                          <div className="my-1 border-t border-dashed border-slate-200"></div>
                          <Row label="Persediaan Barang Jadi Awal" value={data.finishedGoodsBeginning} />
                          <Row label="Persediaan Barang Jadi Akhir" value={data.finishedGoodsEnding * -1} />
                        </>
                      )}
                      <Row label="Total Harga Pokok Penjualan (COGS)" value={calc.cogs} isSub colorClass="text-red-700" />
                    </div>
                  </div>
                )}

                {data.type !== 'jasa' && (
                   <Row label="LABA KOTOR (Gross Profit)" value={calc.grossProfit} isTotal />
                )}

                {/* OPEX */}
                <div className="break-inside-avoid">
                  <h3 className="font-bold uppercase text-sm text-slate-500 mb-2 border-b border-slate-200 pb-1 mt-6">Beban Operasional</h3>
                  <div className="pl-4 space-y-1">
                    {data.expenses.length === 0 && <p className="italic text-slate-400">Tidak ada data beban</p>}
                    {data.expenses.map(item => (
                      <Row key={item.id} label={item.name} value={item.amount} />
                    ))}
                    <Row label="Total Beban Operasional" value={calc.totalOpex} isSub colorClass="text-red-700" />
                  </div>
                </div>

                {/* NET INCOME */}
                <div className="mt-8 bg-slate-50 p-4 border border-slate-200 rounded print:bg-white print:border-slate-800 break-inside-avoid">
                  <Row label="LABA BERSIH (Net Income)" value={calc.netIncome} isTotal colorClass="text-2xl text-emerald-700 print:text-black" />
                </div>
              </div>
            </div>

            {/* SPACER FOR FOOTER PUSH */}
            <div className="flex-grow"></div>

            {/* TANDA TANGAN SECTION */}
            <div className="mt-16 flex justify-end break-inside-avoid page-break-inside-avoid">
              <div className="w-[300px] flex flex-col items-center text-center relative">
                <p className="text-slate-700 mb-2 font-medium">
                  {data.city ? data.city : 'Jakarta'}, {formatDate(data.reportDate)}
                </p>
                <p className="text-xs text-slate-500 mb-4 uppercase tracking-wider">Disetujui Oleh,</p>

                <div className="h-32 w-full flex items-center justify-center mb-2 relative">
                   {data.stampImage && (
                     <img 
                       src={data.stampImage} 
                       alt="Stempel"
                       className="absolute right-0 top-1/2 -translate-y-1/2 object-contain opacity-80 mix-blend-multiply rotate-[-12deg] z-0"
                       style={{ width: `${(data.stampScale || 100)}px` }} 
                     />
                   )}
                   {data.signatureImage ? (
                     <img 
                      src={data.signatureImage} 
                      alt="Tanda Tangan" 
                      className="object-contain relative z-10"
                      style={{ height: `${(data.signatureScale || 100)}%`, maxHeight: '100%' }}
                     />
                   ) : (
                     <div className="w-full h-full border border-dashed border-slate-200 rounded flex items-center justify-center">
                       <span className="text-xs text-slate-300 italic">( Tanda Tangan )</span>
                     </div>
                   )}
                </div>
                
                <div className="w-full border-b border-slate-800 pb-1 mb-1 relative z-20">
                  <p className="font-bold text-slate-800 uppercase text-lg leading-none">
                    {data.ownerName || 'Nama Pemilik'}
                  </p>
                </div>
                <p className="text-slate-600 text-sm font-medium">{data.signerPosition || 'Pemilik'}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};