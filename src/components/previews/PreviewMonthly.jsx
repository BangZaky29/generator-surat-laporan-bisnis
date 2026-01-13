// C:\codingVibes\nuansasolution\.subpath\generator-surat-laporan-bisnis\src\components\previews\PreviewMonthly.jsx

import { formatDate, formatCurrency } from '../../utils/format'

export default function PreviewMonthly({ formData }) {
  const totalSales = formData.monthlySales.reduce((sum, item) => sum + item.total, 0)

  return (
    <div className="preview-document">
      {/* Company Header */}
      <div className="preview-company-name">{formData.companyName}</div>
      <div className="preview-company-desc">Laporan Harian Bisnis & Administrasi</div>
      <div className="preview-header-line"></div>

      {/* Report Title */}
      <h1>LAPORAN PENJUALAN BULANAN</h1>

      {/* Report Info */}
      <div className="preview-info-row" style={{ marginTop: '8mm' }}>
        <div>
          <span>Periode:</span>
          <br />
          <span>{formData.reportPeriod?.trim() || '-'}</span>
        </div>
      </div>

      {/* Table */}
      <table className="preview-table">
        <thead>
          <tr>
            <th>Bulan</th>
            <th style={{ textAlign: 'right' }}>Total Penjualan</th>
          </tr>
        </thead>
        <tbody>
          {formData.monthlySales.map((item, idx) => (
            <tr key={idx}>
              <td>{item.month}</td>
              <td style={{ textAlign: 'right' }}>{formatCurrency(item.total)}</td>
            </tr>
          ))}
          <tr className="preview-total-row">
            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>TOTAL KESELURUHAN</td>
            <td style={{ textAlign: 'right' }}>{formatCurrency(totalSales)}</td>
          </tr>
        </tbody>
      </table>

      {/* Signature Area */}
      <div className="preview-signature-area">
        <div className="preview-signature-block">
          <div className="preview-signature-line">{`${formData.city}, ${formatDate(formData.reportDate)}`}</div>  
          <div className="preview-signature-name">{formData.personResponsible}</div>
          <div className="preview-signature-title">Penanggung Jawab</div>
        </div>
      </div>

      {/* Footer */}
      <div className="preview-footer">
        Generator Laporan Bisnis - Generator Surat Laporan Bisnis
      </div>
    </div>
  )
}