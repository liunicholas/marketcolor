export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  marketCap?: number;
  volume?: number;
  avgVolume?: number;
  peRatio?: number;
  forwardPE?: number;
  dividendYield?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  exchange?: string;
  industry?: string;
  sector?: string;
  website?: string;
  description?: string;
  regularMarketTime?: string;
}

export interface StockHistory {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface ExtendedMarketIndex extends MarketIndex {
  category?: string;
  sparkline?: number[];
}

export interface MarketMover {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
}

export interface NewsItem {
  title: string;
  link: string;
  publisher: string;
  publishedAt: string;
  thumbnail?: string;
}

export interface AIAnalysis {
  analysis: string;
  citations: Citation[];
  generatedAt: string;
}

export interface Citation {
  url: string;
  title: string;
}

export interface InvestmentThesis {
  industryAnalysis: string;
  financialAnalysis: string;
  newsAnalysis: string;
  finalThesis: string;
  generatedAt: string;
}

export type TimeRange = '1D' | '5D' | '1M' | '3M' | '6M' | '1Y' | '5Y';

export interface HeatmapStock {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
}

export interface HeatmapSector {
  name: string;
  children: HeatmapStock[];
}

// Analyst Ratings
export interface RecommendationTrend {
  period: string;
  strongBuy: number;
  buy: number;
  hold: number;
  sell: number;
  strongSell: number;
}

export interface UpgradeDowngrade {
  date: string;
  firm: string;
  toGrade: string;
  fromGrade?: string;
  action: string;
}

export interface AnalystData {
  recommendations: RecommendationTrend[];
  upgradeDowngradeHistory: UpgradeDowngrade[];
}

// Ownership Data
export interface InstitutionalHolder {
  organization: string;
  pctHeld: number;
  position: number;
  value: number;
  reportDate?: string;
}

export interface InsiderHolder {
  name: string;
  relation: string;
  transactionDescription?: string;
  latestTransDate?: string;
  positionDirect?: number;
}

export interface OwnershipData {
  institutionalHolders: InstitutionalHolder[];
  insiderHolders: InsiderHolder[];
}

// Financial Statements
export interface IncomeStatement {
  endDate: string;
  totalRevenue?: number;
  grossProfit?: number;
  operatingIncome?: number;
  netIncome?: number;
  ebit?: number;
  costOfRevenue?: number;
  researchDevelopment?: number;
  sellingGeneralAdministrative?: number;
}

export interface BalanceSheet {
  endDate: string;
  totalAssets?: number;
  totalLiab?: number;
  totalStockholderEquity?: number;
  cash?: number;
  shortTermInvestments?: number;
  totalCurrentAssets?: number;
  totalCurrentLiabilities?: number;
  longTermDebt?: number;
  retainedEarnings?: number;
}

export interface CashFlowStatement {
  endDate: string;
  totalCashFromOperatingActivities?: number;
  totalCashflowsFromInvestingActivities?: number;
  totalCashFromFinancingActivities?: number;
  capitalExpenditures?: number;
  dividendsPaid?: number;
  netIncome?: number;
  depreciation?: number;
  changeInCash?: number;
}

export interface FinancialStatements {
  incomeStatementHistory: IncomeStatement[];
  balanceSheetHistory: BalanceSheet[];
  cashFlowHistory: CashFlowStatement[];
}

// Options Chain
export interface OptionContract {
  strike: number;
  lastPrice?: number;
  bid?: number;
  ask?: number;
  change?: number;
  percentChange?: number;
  volume?: number;
  openInterest?: number;
  impliedVolatility?: number;
  inTheMoney: boolean;
  expiration: string;
  contractSymbol: string;
}

export interface OptionsChain {
  expirationDates: string[];
  calls: OptionContract[];
  puts: OptionContract[];
  underlyingPrice: number;
}
