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
