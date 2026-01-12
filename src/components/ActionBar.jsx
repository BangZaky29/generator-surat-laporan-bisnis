import { Download, RotateCcw } from 'lucide-react'
import { generatePDF } from '../utils/pdfGenerator'

export default function ActionBar({ formData, activeTab, onReset, isMobile }) {

  const handleDownloadPDF = async () => {
    try {
      await generatePDF(formData, activeTab)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  return (
    <div className="sticky bottom-0 bg-white border-t border-border-gray shadow-lg">
      <div
        className={
          isMobile
            ? 'px-3 py-3 flex justify-between items-center'
            : 'px-6 py-4 flex justify-between items-center'
        }
      >
        {/* RESET */}
        <button
          onClick={onReset}
          className={
            isMobile
              ? 'flex items-center gap-1 px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors'
              : 'flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors'
          }
          title="Reset"
        >
          <RotateCcw className={isMobile ? 'w-8 h-9' : 'w-8 h-9'} />
          {!isMobile && 'Reset Form'}
        </button>

        {/* DOWNLOAD PDF */}
        <button
          onClick={handleDownloadPDF}
          className={
            isMobile
              ? 'flex items-center gap-1 px-2 py-1.5 bg-soft-blue hover:bg-soft-blue/90 text-white rounded-lg text-xs font-medium transition-colors'
              : 'flex items-center gap-2 px-6 py-2 bg-soft-blue hover:bg-soft-blue/90 text-white rounded-lg text-sm font-medium transition-colors'
          }
        >
          <Download className={isMobile ? 'w-8 h-9' : 'w-8 h-9'} />
          {!isMobile && 'Download PDF'}
          {isMobile && <span className="hidden sm:inline">PDF</span>}
        </button>
      </div>
    </div>
  )
}
