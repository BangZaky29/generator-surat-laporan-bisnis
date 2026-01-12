import html2pdf from 'html2pdf.js'
import { formatDate } from './format'

export const generatePDF = async (formData, activeTab) => {
  // Create a temporary container
  const element = document.createElement('div')
  element.style.padding = '25mm'
  element.style.fontFamily = 'Arial, sans-serif'
  element.style.fontSize = '11pt'
  element.style.lineHeight = '1.4'
  element.style.color = '#333'

  // Company header
  const header = document.createElement('div')
  header.style.textAlign = 'center'
  header.style.marginBottom = '20px'
  header.innerHTML = `
    <div style="font-size: 14pt; font-weight: bold; margin-bottom: 5px;">
      ${formData.companyName}
    </div>
    <div style="font-size: 10pt; color: #666; margin-bottom: 15px;">
      Laporan Harian Bisnis & Administrasi
    </div>
    <hr style="margin: 0; border: none; border-bottom: 2px solid #333;">
  `
  element.appendChild(header)

  // Title
  const title = document.createElement('h1')
  title.style.textAlign = 'center'
  title.style.fontSize = '16pt'
  title.style.fontWeight = 'bold'
  title.style.marginBottom = '15px'
  title.style.marginTop = '15px'
  title.innerText = getReportTitle(activeTab)
  element.appendChild(title)

  // Info section
  const infoDiv = document.createElement('div')
  infoDiv.style.display = 'flex'
  infoDiv.style.justifyContent = 'space-between'
  infoDiv.style.marginBottom = '20px'
  infoDiv.innerHTML = `
    <div>
      <div>Periode: -</div>
    </div>
    <div>
      <div style="text-align: right;">Tanggal Cetak: ${formatDate(formData.reportDate)}</div>
    </div>
  `
  element.appendChild(infoDiv)

  // Table
  const table = createTable(formData, activeTab)
  element.appendChild(table)

  // Signature
  const signature = document.createElement('div')
  signature.style.marginTop = '30px'
  signature.style.textAlign = 'right'
  signature.style.width = '150px'
  signature.style.marginLeft = 'auto'
  signature.innerHTML = `
    <div style="margin-bottom: 5px; font-size: 11pt;">${formatDate(formData.reportDate)}</div>
    <div style="margin-bottom: 30px; font-size: 11pt;">(${formData.personResponsible})</div>
    <div style="font-weight: bold; font-size: 11pt; margin-bottom: 5px;">
      ${formData.personResponsible}
    </div>
    <div style="font-size: 10pt; color: #666;">Penanggung Jawab</div>
  `
  element.appendChild(signature)

  // Footer
  const footer = document.createElement('div')
  footer.style.marginTop = '30px'
  footer.style.paddingTop = '10px'
  footer.style.borderTop = '1px solid #e0e0e0'
  footer.style.textAlign = 'center'
  footer.style.fontSize = '9pt'
  footer.style.color = '#999'
  footer.innerText = 'Generator Laporan Bisnis - Generator Surat Laporan Bisnis'
  element.appendChild(footer)

  // Generate PDF
  const opt = {
    margin: [0, 0, 0, 0],
    filename: `laporan-${getReportType(activeTab)}-${new Date().toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  }

  html2pdf().set(opt).from(element).save()
}

function getReportTitle(activeTab) {
  const titles = {
    daily: 'LAPORAN PENJUALAN HARIAN',
    monthly: 'LAPORAN PENJUALAN BULANAN',
    material: 'LAPORAN PEMBELIAN BAHAN BAKU',
  }
  return titles[activeTab] || 'LAPORAN'
}

function getReportType(activeTab) {
  const types = {
    daily: 'penjualan-harian',
    monthly: 'penjualan-bulanan',
    material: 'pembelian-bahan',
  }
  return types[activeTab] || 'laporan'
}

function createTable(formData, activeTab) {
  const table = document.createElement('table')
  table.style.width = '100%'
  table.style.borderCollapse = 'collapse'
  table.style.marginBottom = '20px'
  table.style.fontSize = '11pt'

  if (activeTab === 'daily') {
    createDailyTable(table, formData)
  } else if (activeTab === 'monthly') {
    createMonthlyTable(table, formData)
  } else if (activeTab === 'material') {
    createMaterialTable(table, formData)
  }

  return table
}

function createDailyTable(table, formData) {
  const thead = document.createElement('thead')
  const headerRow = document.createElement('tr')
  headerRow.style.backgroundColor = '#f5f5f5'

  const headers = ['Hari', 'Omzet', 'Transaksi']
  headers.forEach(h => {
    const th = document.createElement('th')
    th.style.padding = '10px'
    th.style.border = '1px solid #ccc'
    th.style.textAlign = h !== 'Hari' ? 'right' : 'left'
    th.style.fontWeight = '600'
    th.innerText = h
    headerRow.appendChild(th)
  })
  thead.appendChild(headerRow)
  table.appendChild(thead)

  const tbody = document.createElement('tbody')
  let totalRevenue = 0
  let totalTransactions = 0

  formData.dailySales.forEach(item => {
    const row = document.createElement('tr')
    const dayCell = document.createElement('td')
    dayCell.style.padding = '10px'
    dayCell.style.border = '1px solid #ccc'
    dayCell.innerText = item.day

    const revenueCell = document.createElement('td')
    revenueCell.style.padding = '10px'
    revenueCell.style.border = '1px solid #ccc'
    revenueCell.style.textAlign = 'right'
    revenueCell.innerText = `Rp ${item.revenue.toLocaleString('id-ID')}`

    const transactionCell = document.createElement('td')
    transactionCell.style.padding = '10px'
    transactionCell.style.border = '1px solid #ccc'
    transactionCell.style.textAlign = 'right'
    transactionCell.innerText = item.transactions

    row.appendChild(dayCell)
    row.appendChild(revenueCell)
    row.appendChild(transactionCell)
    tbody.appendChild(row)

    totalRevenue += item.revenue
    totalTransactions += item.transactions
  })

  // Total row
  const totalRow = document.createElement('tr')
  totalRow.style.backgroundColor = '#f0f0f0'
  totalRow.style.fontWeight = 'bold'

  const totalLabelCell = document.createElement('td')
  totalLabelCell.style.padding = '10px'
  totalLabelCell.style.border = '1px solid #ccc'
  totalLabelCell.style.textAlign = 'right'
  totalLabelCell.innerText = 'TOTAL'

  const totalRevenueCell = document.createElement('td')
  totalRevenueCell.style.padding = '10px'
  totalRevenueCell.style.border = '1px solid #ccc'
  totalRevenueCell.style.textAlign = 'right'
  totalRevenueCell.innerText = `Rp ${totalRevenue.toLocaleString('id-ID')}`

  const totalTransactionCell = document.createElement('td')
  totalTransactionCell.style.padding = '10px'
  totalTransactionCell.style.border = '1px solid #ccc'
  totalTransactionCell.style.textAlign = 'right'
  totalTransactionCell.innerText = totalTransactions

  totalRow.appendChild(totalLabelCell)
  totalRow.appendChild(totalRevenueCell)
  totalRow.appendChild(totalTransactionCell)
  tbody.appendChild(totalRow)

  table.appendChild(tbody)
}

function createMonthlyTable(table, formData) {
  const thead = document.createElement('thead')
  const headerRow = document.createElement('tr')
  headerRow.style.backgroundColor = '#f5f5f5'

  const headers = ['Bulan', 'Total Penjualan']
  headers.forEach(h => {
    const th = document.createElement('th')
    th.style.padding = '10px'
    th.style.border = '1px solid #ccc'
    th.style.textAlign = h === 'Bulan' ? 'left' : 'right'
    th.style.fontWeight = '600'
    th.innerText = h
    headerRow.appendChild(th)
  })
  thead.appendChild(headerRow)
  table.appendChild(thead)

  const tbody = document.createElement('tbody')
  let totalSales = 0

  formData.monthlySales.forEach(item => {
    const row = document.createElement('tr')
    const monthCell = document.createElement('td')
    monthCell.style.padding = '10px'
    monthCell.style.border = '1px solid #ccc'
    monthCell.innerText = item.month

    const totalCell = document.createElement('td')
    totalCell.style.padding = '10px'
    totalCell.style.border = '1px solid #ccc'
    totalCell.style.textAlign = 'right'
    totalCell.innerText = `Rp ${item.total.toLocaleString('id-ID')}`

    row.appendChild(monthCell)
    row.appendChild(totalCell)
    tbody.appendChild(row)

    totalSales += item.total
  })

  // Total row
  const totalRow = document.createElement('tr')
  totalRow.style.backgroundColor = '#f0f0f0'
  totalRow.style.fontWeight = 'bold'

  const totalLabelCell = document.createElement('td')
  totalLabelCell.style.padding = '10px'
  totalLabelCell.style.border = '1px solid #ccc'
  totalLabelCell.style.textAlign = 'right'
  totalLabelCell.innerText = 'TOTAL KESELURUHAN'

  const totalCell = document.createElement('td')
  totalCell.style.padding = '10px'
  totalCell.style.border = '1px solid #ccc'
  totalCell.style.textAlign = 'right'
  totalCell.innerText = `Rp ${totalSales.toLocaleString('id-ID')}`

  totalRow.appendChild(totalLabelCell)
  totalRow.appendChild(totalCell)
  tbody.appendChild(totalRow)

  table.appendChild(tbody)
}

function createMaterialTable(table, formData) {
  const thead = document.createElement('thead')
  const headerRow = document.createElement('tr')
  headerRow.style.backgroundColor = '#f5f5f5'

  const headers = ['Nama Bahan', 'Qty', 'Harga Satuan', 'Total']
  headers.forEach(h => {
    const th = document.createElement('th')
    th.style.padding = '10px'
    th.style.border = '1px solid #ccc'
    th.style.textAlign = h === 'Nama Bahan' ? 'left' : 'right'
    th.style.fontWeight = '600'
    th.innerText = h
    headerRow.appendChild(th)
  })
  thead.appendChild(headerRow)
  table.appendChild(thead)

  const tbody = document.createElement('tbody')
  let totalCost = 0

  formData.materialPurchases.forEach(item => {
    if (!item.name) return

    const row = document.createElement('tr')
    const nameCell = document.createElement('td')
    nameCell.style.padding = '10px'
    nameCell.style.border = '1px solid #ccc'
    nameCell.innerText = item.name

    const qtyCell = document.createElement('td')
    qtyCell.style.padding = '10px'
    qtyCell.style.border = '1px solid #ccc'
    qtyCell.style.textAlign = 'right'
    qtyCell.innerText = item.quantity

    const priceCell = document.createElement('td')
    priceCell.style.padding = '10px'
    priceCell.style.border = '1px solid #ccc'
    priceCell.style.textAlign = 'right'
    priceCell.innerText = `Rp ${item.unitPrice.toLocaleString('id-ID')}`

    const itemTotal = item.quantity * item.unitPrice
    const totalCell = document.createElement('td')
    totalCell.style.padding = '10px'
    totalCell.style.border = '1px solid #ccc'
    totalCell.style.textAlign = 'right'
    totalCell.innerText = `Rp ${itemTotal.toLocaleString('id-ID')}`

    row.appendChild(nameCell)
    row.appendChild(qtyCell)
    row.appendChild(priceCell)
    row.appendChild(totalCell)
    tbody.appendChild(row)

    totalCost += itemTotal
  })

  // Total row
  const totalRow = document.createElement('tr')
  totalRow.style.backgroundColor = '#f0f0f0'
  totalRow.style.fontWeight = 'bold'

  const emptyCell = document.createElement('td')
  emptyCell.style.padding = '10px'
  emptyCell.style.border = '1px solid #ccc'

  const emptyCell2 = document.createElement('td')
  emptyCell2.style.padding = '10px'
  emptyCell2.style.border = '1px solid #ccc'

  const totalLabelCell = document.createElement('td')
  totalLabelCell.style.padding = '10px'
  totalLabelCell.style.border = '1px solid #ccc'
  totalLabelCell.style.textAlign = 'right'
  totalLabelCell.innerText = 'TOTAL KESELURUHAN'

  const totalCell = document.createElement('td')
  totalCell.style.padding = '10px'
  totalCell.style.border = '1px solid #ccc'
  totalCell.style.textAlign = 'right'
  totalCell.innerText = `Rp ${totalCost.toLocaleString('id-ID')}`

  totalRow.appendChild(emptyCell)
  totalRow.appendChild(emptyCell2)
  totalRow.appendChild(totalLabelCell)
  totalRow.appendChild(totalCell)
  tbody.appendChild(totalRow)

  table.appendChild(tbody)
}