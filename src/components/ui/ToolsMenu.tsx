import React from 'react';
import { Save, Download, RotateCcw, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToolsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onLoad: () => void;
  onReset: () => void;
  onSeeder: () => void;
  isMobile?: boolean;
}

export const ToolsMenu: React.FC<ToolsMenuProps> = ({ 
  isOpen, onClose, onSave, onLoad, onReset, onSeeder, isMobile 
}) => {
  
  const menuItems = [
    { 
      label: 'Simpan Data', 
      icon: Save, 
      action: onSave, 
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      desc: 'Simpan pekerjaan di browser' 
    },
    { 
      label: 'Muat Data', 
      icon: Download, 
      action: onLoad, 
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      desc: 'Ambil data yang tersimpan' 
    },
    { 
      label: 'Isi Dummy', 
      icon: Sparkles, 
      action: onSeeder, 
      color: 'text-purple-600 bg-purple-50 border-purple-100',
      desc: 'Isi otomatis untuk demo' 
    },
    { 
      label: 'Reset Total', 
      icon: RotateCcw, 
      action: onReset, 
      color: 'text-red-600 bg-red-50 border-red-100',
      desc: 'Hapus data & mulai ulang' 
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-[60]"
          />
          
          {/* Menu Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed ${isMobile ? 'bottom-0 left-0 right-0 rounded-t-2xl' : 'bottom-20 left-64 w-80 rounded-xl'} bg-white shadow-2xl z-[70] overflow-hidden border border-slate-100`}
          >
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Menu & Alat</h3>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            
            <div className="p-4 grid gap-3">
              {menuItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  className={`flex items-center gap-4 p-3 rounded-xl border transition-all active:scale-95 ${item.color} hover:shadow-md text-left`}
                >
                  <div className={`p-2 rounded-full bg-white bg-opacity-60`}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-sm">{item.label}</div>
                    <div className="text-xs opacity-80">{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};