
import React, { useState } from 'react';
import { Briefcase, Building2, FileBarChart, PieChart, Menu, Settings, Hexagon } from 'lucide-react';
import { Step } from '../../types';
import clsx from 'clsx';
import { ToolsMenu } from '../ui/ToolsMenu';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentStep: Step;
  onStepChange: (step: Step) => void;
  canNavigate: (targetStep: Step) => boolean;
  // Tools Props
  onSave: () => void;
  onLoad: () => void;
  onReset: () => void;
  onSeeder: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  currentStep, 
  onStepChange,
  canNavigate,
  onSave, onLoad, onReset, onSeeder
}) => {
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  // NOTE: Changed 'md' to 'lg' breakpoints to handle Tablet Portrait (Vertical) as Mobile view
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 print:bg-white">
      
      {/* Desktop/Landscape Tablet Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-full z-30 print:hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg font-bold text-lg">FM</div>
          <h1 className="font-bold text-xl tracking-tight text-slate-800">FinMaster</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'type-selection', label: 'Jenis Bisnis', icon: Briefcase },
            { id: 'company-info', label: 'Identitas', icon: Building2 },
            { id: 'data-entry', label: 'Input Data', icon: PieChart },
            { id: 'preview', label: 'Laporan', icon: FileBarChart },
          ].map((item) => {
            const isActive = item.id === currentStep;
            const isAccessible = canNavigate(item.id as Step);

            return (
              <button
                key={item.id}
                onClick={() => isAccessible && onStepChange(item.id as Step)}
                disabled={!isAccessible}
                className={clsx(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-indigo-50 text-indigo-700 shadow-sm" 
                    : isAccessible 
                      ? "text-slate-600 hover:bg-slate-50 hover:text-slate-900" 
                      : "text-slate-300 cursor-not-allowed"
                )}
              >
                <item.icon size={20} className={isActive ? "text-indigo-600" : "text-slate-400"} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
           <button 
             onClick={() => setIsToolsOpen(true)}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-colors shadow-lg shadow-slate-200"
           >
              <Settings size={20} />
              <div className="text-left">
                <p className="text-xs opacity-80 font-medium">Pengaturan</p>
                <p className="font-bold text-sm">Alat & Data</p>
              </div>
           </button>
        </div>
      </aside>

      {/* Mobile/Portrait Tablet Topbar */}
      <div className="lg:hidden bg-white border-b border-slate-200 p-4 sticky top-0 z-40 flex items-center justify-between shadow-sm print:hidden">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 text-white p-1 rounded font-bold">FM</div>
          <h1 className="font-bold text-lg text-slate-800">FinMaster</h1>
        </div>
        <div className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded capitalize">
          {currentStep.replace('-', ' ')}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pb-32 lg:pb-8 overflow-y-auto min-h-screen print:ml-0 print:p-0 print:pb-0 print:h-auto">
        <div className="max-w-5xl mx-auto h-full print:max-w-none print:h-auto">
          {children}
        </div>
      </main>

      {/* Mobile/Portrait Tablet Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 grid grid-cols-5 p-2 z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] print:hidden">
         
         {/* Left Side */}
         <NavButton step="type-selection" current={currentStep} icon={Briefcase} label="Bisnis" onChange={onStepChange} canNav={canNavigate} />
         <NavButton step="company-info" current={currentStep} icon={Building2} label="Identitas" onChange={onStepChange} canNav={canNavigate} />
         
         {/* Center Action Button */}
         <div className="flex justify-center -mt-8 pointer-events-none">
            <button 
              onClick={() => setIsToolsOpen(true)}
              className="pointer-events-auto bg-slate-800 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg shadow-slate-400 border-4 border-slate-50 active:scale-95 transition-transform"
            >
              <Settings size={28} />
            </button>
         </div>

         {/* Right Side */}
         <NavButton step="data-entry" current={currentStep} icon={PieChart} label="Input" onChange={onStepChange} canNav={canNavigate} />
         <NavButton step="preview" current={currentStep} icon={FileBarChart} label="Laporan" onChange={onStepChange} canNav={canNavigate} />
      </nav>

      {/* Global Tools Menu Overlay */}
      <ToolsMenu 
        isOpen={isToolsOpen}
        onClose={() => setIsToolsOpen(false)}
        onSave={onSave}
        onLoad={onLoad}
        onReset={onReset}
        onSeeder={onSeeder}
        isMobile={true} 
      />
    </div>
  );
};

const NavButton = ({ step, current, icon: Icon, label, onChange, canNav }: any) => {
  const isActive = step === current;
  const isAccessible = canNav(step);
  return (
    <button
      onClick={() => isAccessible && onChange(step)}
      disabled={!isAccessible}
      className={clsx(
        "flex flex-col items-center justify-center gap-1 rounded-lg py-1",
        isActive ? "text-indigo-600" : isAccessible ? "text-slate-500" : "text-slate-300"
      )}
    >
      <Icon size={20} className={isActive ? "fill-current/20" : ""} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
};
