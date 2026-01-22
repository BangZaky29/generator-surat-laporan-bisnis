
export type CompanyType = 'jasa' | 'dagang' | 'manufaktur';

export interface TransactionItem {
  id: string;
  name: string;
  amount: number;
}

export interface ReportData {
  companyName: string;
  companyLogo: string | null; // Base64 string for logo
  logoScale: number; // Percentage 50-200
  
  ownerName: string;
  signerPosition: string; // Jabatan (e.g. Direktur)
  city: string; // Kota untuk TTD
  reportDate: string; // Tanggal pembuatan laporan spesifik
  
  signatureImage: string | null; // Base64 image string for signature
  signatureScale: number; // Percentage 50-200
  
  stampImage: string | null; // Base64 string for stamp/stempel
  stampScale: number; // Percentage 50-200
  
  period: string; // e.g., "Oktober 2023"
  type: CompanyType;
  
  // Income
  incomes: TransactionItem[];
  
  // Expenses (Operating Expenses)
  expenses: TransactionItem[];

  // Dagang Specific
  beginningInventory: number;
  purchases: TransactionItem[];
  endingInventory: number;

  // Manufaktur Specific
  rawMaterialsBeginning: number;
  rawMaterialPurchases: TransactionItem[];
  rawMaterialsEnding: number;
  
  directLabor: TransactionItem[];
  factoryOverhead: TransactionItem[];
  
  wipBeginning: number;
  wipEnding: number;
  
  finishedGoodsBeginning: number;
  finishedGoodsEnding: number;
}

export interface SavedFile {
  id: string;
  name: string;
  timestamp: number;
  data: ReportData;
}

export type Step = 'type-selection' | 'company-info' | 'data-entry' | 'preview';

export interface CalculationResult {
  totalRevenue: number;
  totalOpex: number;
  
  // Dagang
  netPurchases: number;
  cogs: number; // HPP
  grossProfit: number;
  
  // Manufaktur
  rawMaterialsUsed: number;
  totalManufacturingCost: number;
  cogm: number; // Cost of Goods Manufactured (HPP Produksi)
  
  netIncome: number;
}
