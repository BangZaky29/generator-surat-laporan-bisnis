import { ReportData, CompanyType } from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const generateDummyData = (type: CompanyType): ReportData => {
  const baseData = {
    companyName: 'PT. Sukses Makmur Sejahtera',
    companyLogo: null,
    logoScale: 100,
    ownerName: 'Budi Santoso',
    signerPosition: 'Direktur Utama',
    city: 'Jakarta',
    reportDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    signatureImage: null,
    signatureScale: 100,
    stampImage: null,
    stampScale: 100,
    period: 'Oktober 2023',
    type: type,
    expenses: [
      { id: generateId(), name: 'Gaji Karyawan Admin', amount: 15000000 },
      { id: generateId(), name: 'Listrik & Air Kantor', amount: 2500000 },
      { id: generateId(), name: 'Sewa Kantor', amount: 5000000 },
      { id: generateId(), name: 'Biaya Pemasaran', amount: 3000000 },
      { id: generateId(), name: 'Internet & Telepon', amount: 1000000 },
    ],
    incomes: [],
    beginningInventory: 0,
    purchases: [],
    endingInventory: 0,
    rawMaterialsBeginning: 0,
    rawMaterialPurchases: [],
    rawMaterialsEnding: 0,
    directLabor: [],
    factoryOverhead: [],
    wipBeginning: 0,
    wipEnding: 0,
    finishedGoodsBeginning: 0,
    finishedGoodsEnding: 0,
  };

  if (type === 'jasa') {
    return {
      ...baseData,
      incomes: [
        { id: generateId(), name: 'Jasa Konsultasi IT', amount: 45000000 },
        { id: generateId(), name: 'Jasa Maintenance', amount: 15000000 },
      ],
    };
  } else if (type === 'dagang') {
    return {
      ...baseData,
      incomes: [
        { id: generateId(), name: 'Penjualan Retail', amount: 150000000 },
      ],
      beginningInventory: 25000000,
      purchases: [
        { id: generateId(), name: 'Pembelian Stok Barang A', amount: 60000000 },
        { id: generateId(), name: 'Pembelian Stok Barang B', amount: 20000000 },
      ],
      endingInventory: 35000000,
    };
  } else if (type === 'manufaktur') {
    return {
      ...baseData,
      incomes: [
        { id: generateId(), name: 'Penjualan Produk Jadi', amount: 250000000 },
      ],
      rawMaterialsBeginning: 15000000,
      rawMaterialPurchases: [
        { id: generateId(), name: 'Beli Bahan Baku Tepung', amount: 40000000 },
        { id: generateId(), name: 'Beli Bahan Baku Telur', amount: 20000000 },
      ],
      rawMaterialsEnding: 10000000,
      directLabor: [
        { id: generateId(), name: 'Upah Buruh Pabrik', amount: 30000000 },
      ],
      factoryOverhead: [
        { id: generateId(), name: 'Listrik Pabrik', amount: 8000000 },
        { id: generateId(), name: 'Penyusutan Mesin', amount: 2000000 },
      ],
      wipBeginning: 5000000,
      wipEnding: 2000000,
      finishedGoodsBeginning: 10000000,
      finishedGoodsEnding: 15000000,
    };
  }

  return baseData;
};