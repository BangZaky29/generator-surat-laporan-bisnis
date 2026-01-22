import React, { useRef, useState, useEffect } from 'react';
import { Card, Input, Button } from '../ui/Input';
import { ReportData } from '../../types';
import { ArrowRight, Eraser, PenTool, Image as ImageIcon, Upload, X, Maximize } from 'lucide-react';

interface Props {
  data: ReportData;
  onUpdate: (data: Partial<ReportData>) => void;
  onNext: () => void;
  onReset: () => void;
}

// Helper Slider Component
const SizeSlider = ({ value, onChange, label }: { value: number, onChange: (val: number) => void, label: string }) => (
  <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
    <div className="flex justify-between items-center mb-1">
      <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
        <Maximize size={12} /> {label}
      </span>
      <span className="text-xs text-slate-500">{value}%</span>
    </div>
    <input 
      type="range" 
      min="50" 
      max="200" 
      step="10" 
      value={value || 100} 
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-indigo-600"
    />
  </div>
);

export const CompanyInfo: React.FC<Props> = ({ data, onUpdate, onNext }) => {
  const isValid = data.companyName && data.period;
  
  // Signature Canvas Logic
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    // Load existing signature if available
    if (data.signatureImage && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      const img = new Image();
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
      };
      img.src = data.signatureImage;
    }
  }, [data.signatureImage]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      offsetX: (clientX - rect.left) * scaleX,
      offsetY: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000';

    const { offsetX, offsetY } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { offsetX, offsetY } = getCoordinates(e, canvas);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveSignature();
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onUpdate({ signatureImage: null });
    }
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      onUpdate({ signatureImage: canvas.toDataURL() });
    }
  };

  // Image Upload Helper
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'companyLogo' | 'stampImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Identitas Laporan</h2>
          <p className="text-slate-500">Lengkapi data kop surat, logo, dan tanda tangan.</p>
        </div>
      </div>

      <div className="space-y-6">
        <Card title="Informasi Dasar & Logo">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Logo Upload Section */}
            <div className="md:col-span-2 mb-2">
              <label className="text-sm font-medium text-slate-600 block mb-2">Logo Perusahaan (Opsional)</label>
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center bg-slate-50 overflow-hidden relative group shrink-0">
                  {data.companyLogo ? (
                    <>
                      <img src={data.companyLogo} alt="Logo" className="w-full h-full object-contain p-1" />
                      <button 
                        onClick={() => onUpdate({ companyLogo: null })}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                      >
                        <X size={20} />
                      </button>
                    </>
                  ) : (
                    <ImageIcon className="text-slate-300" size={32} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="file"
                      id="logo-upload"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'companyLogo')}
                      className="hidden"
                    />
                    <label 
                      htmlFor="logo-upload"
                      className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 cursor-pointer shadow-sm"
                    >
                      <Upload size={16} className="mr-2" /> Upload Logo
                    </label>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Format: PNG, JPG. Disarankan background transparan.
                  </p>
                  
                  {/* Logo Scale Slider */}
                  {data.companyLogo && (
                    <SizeSlider 
                      label="Ukuran Logo" 
                      value={data.logoScale || 100} 
                      onChange={(v) => onUpdate({ logoScale: v })} 
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <Input
                label="Nama Perusahaan / Bisnis"
                placeholder="Contoh: PT. Maju Jaya"
                value={data.companyName}
                onChange={(e) => onUpdate({ companyName: e.target.value })}
                autoFocus
              />
            </div>
            
            <Input
              label="Periode Laporan"
              placeholder="Contoh: Oktober 2023"
              value={data.period}
              onChange={(e) => onUpdate({ period: e.target.value })}
            />

             <Input
                label="Tanggal Pembuatan Laporan"
                type="date"
                value={data.reportDate}
                onChange={(e) => onUpdate({ reportDate: e.target.value })}
                className="w-full"
              />
          </div>
        </Card>

        <Card title="Penanggung Jawab, Tanda Tangan & Stempel">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
             <Input
              label="Kota (Tempat TTD)"
              placeholder="Contoh: Jakarta"
              value={data.city}
              onChange={(e) => onUpdate({ city: e.target.value })}
            />

            <Input
              label="Nama Penanggung Jawab"
              placeholder="Contoh: Budi Santoso"
              value={data.ownerName}
              onChange={(e) => onUpdate({ ownerName: e.target.value })}
            />

            <div className="md:col-span-2">
               <Input
                label="Jabatan (Opsional)"
                placeholder="Contoh: Direktur / Pemilik"
                value={data.signerPosition}
                onChange={(e) => onUpdate({ signerPosition: e.target.value })}
              />
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
             <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <PenTool size={16} /> Tanda Tangan Digital
                </label>
                <div className="flex items-center gap-2">
                  {data.signatureImage && (
                    <span className="text-xs text-slate-500 font-normal">Sudah ada TTD</span>
                  )}
                  <button 
                    onClick={clearSignature}
                    className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 px-2 py-1 hover:bg-red-50 rounded"
                  >
                    <Eraser size={12} /> Hapus / Ulang
                  </button>
                </div>
             </div>
             <div className="bg-white rounded-lg border border-dashed border-slate-300 overflow-hidden cursor-crosshair touch-none select-none">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={200}
                  className="w-full h-40 bg-white touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
             </div>
             
             {/* Signature Scale Slider */}
             {data.signatureImage && (
                <SizeSlider 
                  label="Ukuran Tanda Tangan" 
                  value={data.signatureScale || 100} 
                  onChange={(v) => onUpdate({ signatureScale: v })} 
                />
              )}

             <p className="text-xs text-slate-400 mt-2 text-center mb-6">
               Gunakan mouse atau jari Anda untuk membuat tanda tangan.
             </p>

             {/* Stempel Upload Section */}
             <div className="border-t border-slate-200 pt-4 mt-4">
                <label className="text-sm font-medium text-slate-700 block mb-3">Stempel / Cap (Opsional)</label>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 border border-slate-300 rounded-full flex items-center justify-center bg-white overflow-hidden relative group shadow-sm shrink-0">
                    {data.stampImage ? (
                      <>
                        <img src={data.stampImage} alt="Stempel" className="w-full h-full object-cover opacity-80" />
                        <button 
                          onClick={() => onUpdate({ stampImage: null })}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <span className="text-[10px] text-slate-400">Preview</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      id="stamp-upload"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'stampImage')}
                      className="hidden"
                    />
                    <label 
                      htmlFor="stamp-upload"
                      className="inline-flex items-center px-3 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 cursor-pointer"
                    >
                      <Upload size={14} className="mr-1.5" /> Upload Gambar Stempel
                    </label>
                    <p className="text-[10px] text-slate-500 mt-1">Gunakan gambar transparan (.png) agar terlihat asli.</p>

                    {/* Stamp Scale Slider */}
                    {data.stampImage && (
                      <SizeSlider 
                        label="Ukuran Stempel" 
                        value={data.stampScale || 100} 
                        onChange={(v) => onUpdate({ stampScale: v })} 
                      />
                    )}
                  </div>
                </div>
             </div>
          </div>
        </Card>
      </div>
        
      <div className="mt-8 flex justify-end">
        <Button 
          onClick={onNext} 
          disabled={!isValid}
          className="w-full sm:w-auto"
        >
          Lanjut ke Data Keuangan <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};