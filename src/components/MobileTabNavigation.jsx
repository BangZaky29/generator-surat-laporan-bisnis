// C:\codingVibes\nuansasolution\.subpath\generator-surat-laporan-bisnis\src\components\MobileTabNavigation.jsx

import { Eye, Edit3 } from 'lucide-react'

export default function MobileTabNavigation({ currentView, onViewChange }) {
  return (
    <div className="border-b border-border-gray bg-white">
      <div className="flex gap-0">
        <button
          onClick={() => onViewChange('form')}
          className={`flex-1 py-3 px-3 flex items-center justify-center gap-2 font-medium text-sm transition-all ${
            currentView === 'form'
              ? 'border-b-2 border-soft-blue text-soft-blue bg-soft-blue-50'
              : 'border-b-2 border-transparent text-gray-600'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Input</span>
        </button>
        
        <button
          onClick={() => onViewChange('preview')}
          className={`flex-1 py-3 px-3 flex items-center justify-center gap-2 font-medium text-sm transition-all ${
            currentView === 'preview'
              ? 'border-b-2 border-soft-blue text-soft-blue bg-soft-blue-50'
              : 'border-b-2 border-transparent text-gray-600'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Preview</span>
        </button>
      </div>
    </div>
  )
}