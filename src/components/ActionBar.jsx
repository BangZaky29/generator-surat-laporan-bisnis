import { Download, Printer, RotateCcw, Save } from 'lucide-react'
import { generatePDF } from '../utils/pdfGenerator'

export default function ActionBar({ formData, activeTab, onReset, isMobile }) {
  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = async () => {
    try {
      await generatePDF(formData, activeTab)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  const handleSaveDraft = () => {
    const draft = {
      timestamp: new Date().toISOString(),
      activeTab,
      formData,
    }
    localStorage.setItem('laporan_draft', JSON.stringify(draft))
    alert('Draft saved successfully!')
  }

  return (
    <div className="sticky bottom-0 bg-white border-t border-border-gray shadow-lg">
      <div className={`${
        isMobile 
          ? 'px-3 py-3 flex gap-2 justify-between items-center flex-wrap'
          : 'px-6 py-4 flex gap-3 justify-between items-center'
      }`}>
        <button
          onClick={onReset}
          className={`flex items-center gap-1 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors ${
            isMobile
              ? 'px-2 py-1.5 text-xs'
              : 'px-4 py-2 text-sm'
          }`}
          title="Reset"
        >
          <RotateCcw className={`w-${isMobile ? '3' : '4'} h-${isMobile ? '3' : '4'}`} />
          {!isMobile && 'Reset Form'}
        </button>

        <div className={`flex gap-2 ${isMobile ? 'flex-1 justify-end' : ''}`}>
          {!isMobile && (
            <button
              onClick={handleSaveDraft}
              className={`flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-colors`}
            >
              <Save className="w-4 h-4" />
              Simpan Draft
            </button>
          )}

          {!isMobile && (
            <button
              onClick={handlePrint}
              className={`flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-colors`}
            >
              <Printer className="w-4 h-4" />
              Cetak
            </button>
          )}

          {isMobile ? (
            <>
              <button
                onClick={handleSaveDraft}
                className="flex items-center gap-1 px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium transition-colors"
                title="Simpan Draft"
              >
                <Save className="w-3 h-3" />
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1 px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium transition-colors"
                title="Cetak"
              >
                <Printer className="w-3 h-3" />
              </button>
            </>
          ) : null}

          <button
            onClick={handleDownloadPDF}
            className={`flex items-center gap-${isMobile ? '1' : '2'} px-${isMobile ? '2' : '6'} py-${isMobile ? '1.5' : '2'} bg-soft-blue hover:bg-soft-blue/90 text-white rounded-lg font-medium transition-colors text-${isMobile ? 'xs' : 'sm'}`}
          >
            <Download className={`w-${isMobile ? '3' : '4'} h-${isMobile ? '3' : '4'}`} />
            {!isMobile && 'Download PDF'}
            {isMobile && <span className="hidden sm:inline">PDF</span>}
          </button>
        </div>
      </div>
    </div>
  )
}