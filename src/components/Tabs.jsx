// C:\codingVibes\nuansasolution\.subpath\generator-surat-laporan-bisnis\src\components\Tabs.jsx

import { Calendar, BarChart3, Package } from 'lucide-react'

export default function Tabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'daily', label: 'Penjualan Harian', shortLabel: 'Harian', icon: Calendar },
    { id: 'monthly', label: 'Penjualan Bulanan', shortLabel: 'Bulanan', icon: BarChart3 },
    { id: 'material', label: 'Pembelian Bahan Baku', shortLabel: 'Bahan', icon: Package },
  ]

  return (
    <div className="bg-white border-b border-border-gray overflow-x-auto">
      <div className="px-3 md:px-6 flex gap-2 md:gap-8 min-w-min md:min-w-full">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-3 md:py-4 px-2 md:px-0 flex items-center gap-1.5 md:gap-2 font-medium text-xs md:text-sm border-b-2 transition-all whitespace-nowrap md:whitespace-normal ${
                isActive
                  ? 'border-soft-blue text-soft-blue'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
              <span className="hidden sm:inline md:hidden">
                {tab.shortLabel}
              </span>
              <span className="hidden md:inline">
                {tab.label}
              </span>
              <span className="inline sm:hidden md:hidden">
                {tab.shortLabel}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}