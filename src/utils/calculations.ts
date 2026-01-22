import { ReportData, CalculationResult } from '../types';

export const calculateFinance = (data: ReportData): CalculationResult => {
  // 1. Total Revenue
  const totalRevenue = data.incomes.reduce((acc, curr) => acc + curr.amount, 0);
  
  // 2. Total Operating Expenses
  const totalOpex = data.expenses.reduce((acc, curr) => acc + curr.amount, 0);

  let netPurchases = 0;
  let cogs = 0;
  let rawMaterialsUsed = 0;
  let totalManufacturingCost = 0;
  let cogm = 0;

  // Logic based on Type
  if (data.type === 'dagang') {
    // HPP = Awal + Pembelian - Akhir
    const totalPurchases = data.purchases.reduce((acc, curr) => acc + curr.amount, 0);
    netPurchases = totalPurchases; // Simplified for this MVP
    const goodsAvailableForSale = data.beginningInventory + netPurchases;
    cogs = goodsAvailableForSale - data.endingInventory;
  } 
  else if (data.type === 'manufaktur') {
    // a. Raw Materials Used
    const totalRMPurchases = data.rawMaterialPurchases.reduce((acc, curr) => acc + curr.amount, 0);
    rawMaterialsUsed = data.rawMaterialsBeginning + totalRMPurchases - data.rawMaterialsEnding;

    // b. Total Manufacturing Cost (Biaya Produksi)
    const totalLabor = data.directLabor.reduce((acc, curr) => acc + curr.amount, 0);
    const totalOverhead = data.factoryOverhead.reduce((acc, curr) => acc + curr.amount, 0);
    totalManufacturingCost = rawMaterialsUsed + totalLabor + totalOverhead;

    // c. COGM (HPP Produksi)
    cogm = data.wipBeginning + totalManufacturingCost - data.wipEnding;

    // d. COGS (HPP Penjualan)
    const goodsAvailable = data.finishedGoodsBeginning + cogm;
    cogs = goodsAvailable - data.finishedGoodsEnding;
  }

  // Gross Profit
  const grossProfit = totalRevenue - cogs;

  // Net Income
  const netIncome = grossProfit - totalOpex;

  return {
    totalRevenue,
    totalOpex,
    netPurchases,
    cogs,
    grossProfit,
    rawMaterialsUsed,
    totalManufacturingCost,
    cogm,
    netIncome
  };
};