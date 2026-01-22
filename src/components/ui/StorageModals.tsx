import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, FileText, Trash2, Clock, Upload, AlertTriangle, CheckCircle, Info, Sparkles, Briefcase, ShoppingBag, Factory } from 'lucide-react';
import { SavedFile, CompanyType } from '../../types';
import { Button, Input } from './Input';
import { getSavedFiles, deleteFile } from '../../utils/storage';

// --- GENERIC ALERT / CONFIRM MODAL ---
interface AlertModalProps {
  isOpen: boolean;
  type: 'danger' | 'warning' | 'info';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onClose: () => void;
  singleButton?: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({ 
  isOpen, type, title, message, confirmText = "Ya, Lanjutkan", cancelText = "Batal", onConfirm, onClose, singleButton = false 
}) => {
  if (!isOpen) return null;

  const colors = {
    danger: { bg: 'bg-red-50', text: 'text-red-800', icon: 'text-red-600', border: 'border-red-100', btn: 'bg-red-600 hover:bg-red-700 text-white' },
    warning: { bg: 'bg-amber-50', text: 'text-amber-800', icon: 'text-amber-600', border: 'border-amber-100', btn: 'bg-amber-500 hover:bg-amber-600 text-white' },
    info: { bg: 'bg-blue-50', text: 'text-blue-800', icon: 'text-blue-600', border: 'border-blue-100', btn: 'bg-blue-600 hover:bg-blue-700 text-white' }
  };

  const style = colors[type];
  const Icon = type === 'danger' ? Trash2 : type === 'warning' ? AlertTriangle : Info;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative z-10"
      >
        <div className={`p-6 text-center`}>
          <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${style.bg} ${style.icon}`}>
            <Icon size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">{message}</p>
          
          <div className="flex gap-3 justify-center">
            {!singleButton && (
              <button 
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                {cancelText}
              </button>
            )}
            <button 
              onClick={() => {
                if(onConfirm) onConfirm();
                onClose();
              }}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium shadow-md transition-colors ${style.btn}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- SEEDER MODAL ---
interface SeederModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: CompanyType) => void;
}

export const SeederModal: React.FC<SeederModalProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  const options = [
    { type: 'jasa', label: 'Perusahaan Jasa', icon: Briefcase, color: 'text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100' },
    { type: 'dagang', label: 'Perusahaan Dagang', icon: ShoppingBag, color: 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100' },
    { type: 'manufaktur', label: 'Perusahaan Manufaktur', icon: Factory, color: 'text-orange-600 bg-orange-50 border-orange-200 hover:bg-orange-100' },
  ];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative z-10"
      >
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-purple-50">
          <h3 className="font-bold text-purple-900 flex items-center gap-2">
            <Sparkles size={18} /> Pilih Data Dummy
          </h3>
          <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-slate-600" /></button>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-500 mb-4">Pilih jenis bisnis untuk mengisi formulir dengan data contoh secara otomatis.</p>
          <div className="space-y-3">
            {options.map((opt) => (
              <button
                key={opt.type}
                onClick={() => onSelect(opt.type as CompanyType)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${opt.color} hover:shadow-md text-left bg-white`}
              >
                <div className="bg-white/80 p-2 rounded-lg shadow-sm">
                   <opt.icon size={24} />
                </div>
                <span className="font-bold text-slate-800">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- SAVE MODAL ---
interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
}

export const SaveModal: React.FC<SaveModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [fileName, setFileName] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative z-10"
      >
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-indigo-50">
          <h3 className="font-bold text-indigo-900 flex items-center gap-2">
            <Save size={18} /> Simpan Data
          </h3>
          <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-slate-600" /></button>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-500 mb-4">Berikan nama untuk file laporan ini agar mudah ditemukan nanti.</p>
          <Input 
            label="Nama Laporan" 
            placeholder="Contoh: Laporan Oktober Toko Budi" 
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>Batal</Button>
            <Button 
              onClick={() => {
                if (fileName.trim()) {
                  onConfirm(fileName);
                  setFileName('');
                }
              }}
              disabled={!fileName.trim()}
            >
              Simpan Sekarang
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- LOAD MODAL ---
interface LoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (file: SavedFile) => void;
}

export const LoadModal: React.FC<LoadModalProps> = ({ isOpen, onClose, onLoad }) => {
  const [files, setFiles] = useState<SavedFile[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFiles(getSavedFiles());
      setDeletingId(null);
    }
  }, [isOpen]);

  const requestDelete = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = () => {
    if (deletingId) {
      const updated = deleteFile(deletingId);
      setFiles(updated);
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10 flex flex-col max-h-[80vh]"
      >
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-indigo-50">
          <h3 className="font-bold text-indigo-900 flex items-center gap-2">
            <Clock size={18} /> Riwayat Tersimpan
          </h3>
          <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-slate-600" /></button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1 bg-slate-50 relative">
          {files.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <FileText size={48} className="mx-auto mb-2 opacity-20" />
              <p>Belum ada data yang disimpan.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex justify-between items-center hover:border-indigo-300 transition-colors group">
                  <div>
                    <h4 className="font-bold text-slate-800">{file.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      {new Date(file.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      <span className="bg-slate-100 px-1.5 rounded uppercase text-[10px] tracking-wider font-bold">
                        {file.data.type}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onLoad(file)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg flex flex-col items-center"
                      title="Load Data"
                    >
                      <Upload size={18} />
                    </button>
                    <button 
                      onClick={() => requestDelete(file.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Hapus"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* INTERNAL DELETE CONFIRMATION OVERLAY */}
          <AnimatePresence>
            {deletingId && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 bg-white/95 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center"
              >
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <Trash2 size={24} />
                </div>
                <h4 className="font-bold text-slate-800 text-lg mb-2">Hapus File Ini?</h4>
                <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto">
                  Data yang dihapus tidak dapat dikembalikan lagi. Anda yakin?
                </p>
                <div className="flex gap-3 w-full max-w-xs mx-auto">
                  <Button variant="outline" className="flex-1 border-slate-300" onClick={() => setDeletingId(null)}>
                    Batal
                  </Button>
                  <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-red-200" onClick={confirmDelete}>
                    Ya, Hapus
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
