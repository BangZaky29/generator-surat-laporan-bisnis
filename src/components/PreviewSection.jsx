// C:\codingVibes\nuansasolution\.subpath\generator-surat-laporan-bisnis\src\components\PreviewSection.jsx

import PreviewDaily from './previews/PreviewDaily'
import PreviewMonthly from './previews/PreviewMonthly'
import PreviewMaterial from './previews/PreviewMaterial'

export default function PreviewSection({ activeTab, formData, isMobile }) {
  return (
    <div
      className={`w-full flex justify-center ${
        isMobile ? 'items-start' : 'items-start'
      }`}
      style={{
        padding: isMobile ? '8px' : '24px',
      }}
    >
      <div
        className="preview-document"
        style={{
          width: isMobile ? '135mm' : '210mm',
          height: isMobile ? 'auto' : 'auto',
          maxWidth: isMobile ? '100rem ' : '210mm',
          // minHeight: isMobile ? '63rem' : '297mm',
          zoom: isMobile ? '0.5' : '1',
          transformOrigin: 'top center',
        }}
      >
        {activeTab === 'daily' && <PreviewDaily formData={formData} />}
        {activeTab === 'monthly' && <PreviewMonthly formData={formData} />}
        {activeTab === 'material' && <PreviewMaterial formData={formData} />}
      </div>
    </div>
  )
}

