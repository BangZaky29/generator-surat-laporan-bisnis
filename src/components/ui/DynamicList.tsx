import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input, Button } from './Input';
import { TransactionItem } from '../../types';

interface DynamicListProps {
  title: string;
  items: TransactionItem[];
  onUpdate: (items: TransactionItem[]) => void;
  emptyLabel?: string;
}

export const DynamicList: React.FC<DynamicListProps> = ({ title, items, onUpdate, emptyLabel = "Belum ada data" }) => {
  
  const addItem = () => {
    const newItem: TransactionItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      amount: 0
    };
    onUpdate([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof TransactionItem, value: any) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    onUpdate(newItems);
  };

  const removeItem = (id: string) => {
    onUpdate(items.filter(item => item.id !== id));
  };

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-end mb-3">
        <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{title}</h4>
        <div className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">
          Total Item: {items.length}
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-3 items-start"
            >
              <div className="flex-grow grid grid-cols-12 gap-3">
                <div className="col-span-7">
                  <Input 
                    label="" 
                    placeholder="Nama Transaksi (mis: Penjualan Tunai)" 
                    value={item.name}
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    className="!mb-0"
                  />
                </div>
                <div className="col-span-5">
                  <Input 
                    label="" 
                    isCurrency 
                    placeholder="0" 
                    value={item.amount}
                    onChange={(e) => updateItem(item.id, 'amount', Number(e.target.value))}
                    className="!mb-0"
                  />
                </div>
              </div>
              <button 
                onClick={() => removeItem(item.id)}
                className="mt-1 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Hapus"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {items.length === 0 && (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-sm">
          {emptyLabel}
        </div>
      )}

      <div className="mt-3">
        <Button onClick={addItem} variant="outline" className="w-full border-dashed border-2">
          <Plus size={16} className="mr-2" /> Tambah Baris
        </Button>
      </div>
    </div>
  );
};