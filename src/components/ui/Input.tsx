import React from 'react';
import { formatRupiah, parseRupiah } from '../../utils/formatters';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  isCurrency?: boolean;
}

export const Input: React.FC<InputProps> = ({ label, isCurrency, value, onChange, className, ...props }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCurrency && onChange) {
      // Create a synthetic event with the raw number
      const rawVal = parseRupiah(e.target.value);
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: rawVal.toString() }
      };
      onChange(syntheticEvent as any);
    } else if (onChange) {
      onChange(e);
    }
  };

  const displayValue = isCurrency ? formatRupiah(Number(value || 0)).replace("Rp", "").trim() : value;

  return (
    <div className="flex flex-col gap-1 mb-4">
      <label className="text-sm font-medium text-slate-600">{label}</label>
      <div className="relative">
        {isCurrency && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
            Rp
          </span>
        )}
        <input
          {...props}
          value={displayValue}
          onChange={handleChange}
          className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-800 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100 ${isCurrency ? 'pl-10' : ''} ${className}`}
        />
      </div>
    </div>
  );
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' }> = ({ children, variant = 'primary', className, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md",
    secondary: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string, title?: string }> = ({ children, className, title }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden ${className}`}>
    {title && (
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
    )}
    <div className="p-6">
      {children}
    </div>
  </div>
);