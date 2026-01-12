// C:\codingVibes\nuansasolution\.subpath\generator-surat-laporan-bisnis\src\components\PreviewSection.jsx

import PreviewDaily from './previews/PreviewDaily'
import PreviewMonthly from './previews/PreviewMonthly'
import PreviewMaterial from './previews/PreviewMaterial'

export default function PreviewSection({ activeTab, formData, isMobile }) {
  return (
    <div
      className={`w-full flex justify-center ${
        isMobile ? 'items-center h-full' : 'items-start'
      }`}
      style={{
        padding: isMobile ? '12px' : '24px',
      }}
    >
      <div
        className="preview-document"
        style={{
          width: isMobile ? '90mm' : '210mm',
          minHeight: isMobile ? 'auto' : '297mm',

          /* ✅ MOBILE TETAP */
          zoom: isMobile ? 0.76 : 1,

          /* ❌ WEB: jangan vertical center */
          transformOrigin: 'top center',
        }}
      >
        <div className="w-full">
          {activeTab === 'daily' && <PreviewDaily formData={formData} />}
          {activeTab === 'monthly' && <PreviewMonthly formData={formData} />}
          {activeTab === 'material' && <PreviewMaterial formData={formData} />}
        </div>
      </div>
    </div>
  )
}
