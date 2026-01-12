// C:\codingVibes\nuansasolution\.subpath\generator-surat-laporan-bisnis\src\components\previews\PreviewDaily.jsx

import { formatDate, formatCurrency } from '../../utils/format'

export default function PreviewDaily({ formData }) {
  const totalRevenue = formData.dailySales.reduce((sum, item) => sum + item.revenue, 0)
  const totalTransactions = formData.dailySales.reduce((sum, item) => sum + item.transactions, 0)

  return (
    <div className="preview-document" style={{ height: 'auto' }}>
      {/* Company Header */}
      <div className="preview-company-name">{formData.companyName}</div>
      <div className="preview-company-desc">Laporan Harian Bisnis & Administrasi</div>
      <div className="preview-header-line"></div>

      {/* Report Title */}
      <h1>LAPORAN PENJUALAN HARIAN</h1>

      {/* Report Info */}
      <div className="preview-info-row" style={{ marginTop: '8mm' }}>
        <div>
          <span>Periode:</span>
          <br />
          <span>-</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span>Tanggal Cetak:</span>
          <br />
          <span>{formatDate(formData.reportDate)}</span>
        </div>
      </div>

      {/* Table */}
      <table className="preview-table">
        <thead>
          <tr>
            <th>Hari</th>
            <th style={{ textAlign: 'right' }}>Omzet</th>
            <th style={{ textAlign: 'right' }}>Transaksi</th>
          </tr>
        </thead>
        <tbody>
          {formData.dailySales.map((item, idx) => (
            <tr key={idx}>
              <td>{item.day}</td>
              <td style={{ textAlign: 'right' }}>{formatCurrency(item.revenue)}</td>
              <td style={{ textAlign: 'right' }}>{item.transactions}</td>
            </tr>
          ))}
          <tr className="preview-total-row">
            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>TOTAL</td>
            <td style={{ textAlign: 'right' }}>{formatCurrency(totalRevenue)}</td>
            <td style={{ textAlign: 'right' }}>{totalTransactions}</td>
          </tr>
        </tbody>
      </table>

      {/* Signature Area */}
      <div className="preview-signature-area">
        <div className="preview-signature-block">
          <p style={{ marginBottom: '2mm', fontSize: '11pt' }}>{formatDate(formData.reportDate)}</p>
          <p style={{ marginBottom: '8mm', fontSize: '11pt' }}>({formData.personResponsible})</p>
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