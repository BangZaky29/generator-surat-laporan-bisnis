// C:\codingVibes\nuansasolution\.subpath\generator-surat-laporan-bisnis\src\components\previews\PreviewMaterial.jsx

import { formatDate, formatCurrency } from '../../utils/format'

export default function PreviewMaterial({ formData }) {
  const totalCost = formData.materialPurchases.reduce(
    (sum, item) => sum + (item.quantity * item.unitPrice),
    0
  )

  return (
    <div className="preview-document">
      {/* Company Header */}
      <div className="preview-company-name">{formData.companyName}</div>
      <div className="preview-company-desc">Laporan Harian Bisnis & Administrasi</div>
      <div className="preview-header-line"></div>

      {/* Report Title */}
      <h1>LAPORAN PEMBELIAN BAHAN BAKU</h1>

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
            <th>Nama Bahan</th>
            <th style={{ textAlign: 'right' }}>Qty</th>
            <th style={{ textAlign: 'right' }}>Harga Satuan</th>
            <th style={{ textAlign: 'right' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {formData.materialPurchases.map((item, idx) => (
            item.name && (
              <tr key={idx}>
                <td>{item.name}</td>
                <td style={{ textAlign: 'right' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</td>
                <td style={{ textAlign: 'right' }}>
                  {formatCurrency(item.quantity * item.unitPrice)}
                </td>
              </tr>
            )
          ))}
          <tr className="preview-total-row">
            <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>
              TOTAL KESELURUHAN
            </td>
            <td style={{ textAlign: 'right' }}>{formatCurrency(totalCost)}</td>
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