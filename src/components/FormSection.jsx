import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function FormSection({
  activeTab,
  formData,
  onFormChange,
  onDailySalesChange,
  onMonthlySalesChange,
  onMaterialChange,
  onAddMaterialRow,
  onRemoveMaterialRow,
  isMobile,
}) {
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    detail: true,
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value)
  }

  const padding = isMobile ? 'p-4' : 'p-6'
  const labelSize = isMobile ? 'text-xs' : 'text-sm'
  const inputSize = isMobile ? 'text-sm py-2 px-3' : 'text-sm py-2 px-3'

  return (
    <div className={`w-full ${padding}`}>
      {/* General Information Section */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection('general')}
          className="flex items-center gap-2 w-full mb-3"
        >
          <div className="w-1 h-5 bg-soft-blue rounded"></div>
          <h2 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-900`}>
            Informasi Umum
          </h2>
          <ChevronDown
            className={`w-4 h-4 ml-auto text-gray-500 transition-transform ${
              expandedSections.general ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSections.general && (
          <div className={`space-y-3 ${isMobile ? 'ml-0' : 'ml-0'}`}>
            {/* Company Name */}
            <div>
              <label className={`block ${labelSize} font-medium text-gray-700 mb-1`}>
                Nama Perusahaan
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => onFormChange('companyName', e.target.value)}
                placeholder="Contoh: PT. Maju Jaya Abadi"
                className={`w-full border border-border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-blue ${inputSize}`}
              />
            </div>

            {/* Report Period */}
            <div>
              <label className={`block ${labelSize} font-medium text-gray-700 mb-1`}>
                Periode Laporan
              </label>
              <input
                type="text"
                value={formData.reportPeriod}
                onChange={(e) => onFormChange('reportPeriod', e.target.value)}
                placeholder="Contoh: Januari 2024"
                className={`w-full border border-border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-blue ${inputSize}`}
              />
            </div>

            {/* Person Responsible */}
            <div>
              <label className={`block ${labelSize} font-medium text-gray-700 mb-1`}>
                Penanggung Jawab
              </label>
              <input
                type="text"
                value={formData.personResponsible}
                onChange={(e) => onFormChange('personResponsible', e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className={`w-full border border-border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-blue ${inputSize}`}
              />
            </div>
            {/* Daerah */}
            <div>
              <label className={`block ${labelSize} font-medium text-gray-700 mb-1`}>
                Daerah
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => onFormChange('city', e.target.value)}
                placeholder="Contoh: Bogor"
                className={`w-full border border-border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-blue ${inputSize}`}
              />
            </div>
            {/* Tanggal */}
            <div>
              <label className={`block ${labelSize} font-medium text-gray-700 mb-1`}>
                Tanggal dibuat
              </label>
              <input
                type="date"
                value={formData.reportDate}
                onChange={(e) => onFormChange('reportDate', e.target.value)}
                className={`w-full border border-border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-blue ${inputSize}`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Detail Report Section */}
      <div>
        <button
          onClick={() => toggleSection('detail')}
          className="flex items-center gap-2 w-full mb-3"
        >
          <div className="w-1 h-5 bg-soft-blue rounded"></div>
          <h2 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-900`}>
            Detail Laporan
          </h2>
          <ChevronDown
            className={`w-4 h-4 ml-auto text-gray-500 transition-transform ${
              expandedSections.detail ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSections.detail && (
          <>
            {activeTab === 'daily' && (
              <div>
                <p className={`${labelSize} text-gray-500 mb-3`}>Input angka saja</p>
                <div className="space-y-2">
                  {formData.dailySales.map((item, idx) => (
                    <div key={idx} className={`grid grid-cols-3 gap-2 p-2 bg-light-gray rounded`}>
                      <div className={`${labelSize} font-medium text-gray-700 py-2`}>
                        {item.day.substring(0, 3)}
                      </div>
                      <div>
                        <input
                          type="number"
                          value={item.revenue === 0 ? '' : item.revenue}
                          onChange={(e) => onDailySalesChange(idx, 'revenue', e.target.value)}
                          placeholder="0"
                          className={`w-full border border-border-gray rounded text-xs py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-soft-blue`}
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={item.transactions === 0 ? '' : item.transactions}
                          onChange={(e) => onDailySalesChange(idx, 'transactions', e.target.value)}
                          placeholder="0"
                          className={`w-full border border-border-gray rounded text-xs py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-soft-blue`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'monthly' && (
              <div>
                <p className={`${labelSize} text-gray-500 mb-3`}>Input angka saja</p>
                <div className="space-y-2">
                  {formData.monthlySales.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-2 gap-2 items-center">
                      <label className={`${labelSize} font-medium text-gray-700 truncate`}>
                        {item.month.substring(0, 3)}
                      </label>
                      <input
                        type="number"
                        value={item.total === 0 ? '' : item.total}
                        onChange={(e) => onMonthlySalesChange(idx, 'total', e.target.value)}
                        placeholder="0"
                        className={`w-full border border-border-gray rounded-lg text-xs py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-soft-blue`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'material' && (
              <div>
                <div className="mb-3">
                  <div className={`${labelSize} font-medium text-gray-700 mb-2 flex items-center justify-between`}>
                    <span>Daftar Bahan</span>
                    <button
                      onClick={onAddMaterialRow}
                      className="text-soft-blue hover:bg-soft-blue-50 p-0.5 rounded text-lg font-bold"
                      title="Tambah baris"
                    >
                      +
                    </button>
                  </div>

                  <div className="space-y-2">
                    {formData.materialPurchases.map((item, idx) => (
                      <div key={idx} className="flex gap-1.5">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={item.name === 0 ? '' : item.name}
                            onChange={(e) => onMaterialChange(idx, 'name', e.target.value)}
                            placeholder="Bahan"
                            className={`w-full border border-border-gray rounded text-xs py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-soft-blue`}
                          />
                        </div>
                        <div className="w-16">
                          <input
                            type="number"
                            value={item.quantity === 0 ? '' : item.quantity}
                            onChange={(e) => onMaterialChange(idx, 'quantity', e.target.value)}
                            placeholder="Qty"
                            className={`w-full border border-border-gray rounded text-xs py-1.5 px-1 focus:outline-none focus:ring-2 focus:ring-soft-blue`}
                          />
                        </div>
                        <div className="w-20">
                          <input
                            type="number"
                            value={item.unitPrice === 0 ? '' : item.unitPrice}
                            onChange={(e) => onMaterialChange(idx, 'unitPrice', e.target.value)}
                            placeholder="Harga"
                            className={`w-full border border-border-gray rounded text-xs py-1.5 px-1 focus:outline-none focus:ring-2 focus:ring-soft-blue`}
                          />
                        </div>
                        {formData.materialPurchases.length > 1 && (
                          <button
                            onClick={() => onRemoveMaterialRow(idx)}
                            className="text-red-500 hover:bg-red-50 px-1.5 py-1 rounded text-base font-bold"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subtotal */}
                <div className="bg-light-gray rounded-lg p-2 text-xs">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Subtotal:</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(
                        formData.materialPurchases.reduce(
                          (sum, item) => sum + (item.quantity * item.unitPrice),
                          0
                        )
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}