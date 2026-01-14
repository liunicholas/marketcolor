import YahooFinance from 'yahoo-finance2';
import type { StockQuote, StockHistory, MarketIndex, MarketMover, NewsItem, TimeRange, HeatmapStock, HeatmapSector, ExtendedMarketIndex } from '@/types/stock';
import { getSP500Constituents, SP500_CONSTITUENTS } from '@/lib/sp500-scraper';

/* eslint-disable @typescript-eslint/no-explicit-any */

const yahooFinance = new YahooFinance();

export async function getStockQuote(symbol: string): Promise<StockQuote> {
  const quote = await yahooFinance.quote(symbol) as any;

  return {
    symbol: quote.symbol || symbol,
    name: quote.shortName || quote.longName || symbol,
    price: quote.regularMarketPrice || 0,
    change: quote.regularMarketChange || 0,
    changePercent: quote.regularMarketChangePercent || 0,
    high: quote.regularMarketDayHigh || 0,
    low: quote.regularMarketDayLow || 0,
    open: quote.regularMarketOpen || 0,
    previousClose: quote.regularMarketPreviousClose || 0,
    marketCap: quote.marketCap,
    volume: quote.regularMarketVolume,
    avgVolume: quote.averageDailyVolume3Month,
    peRatio: quote.trailingPE,
    forwardPE: quote.forwardPE,
    dividendYield: quote.dividendYield,
    fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
    fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
    exchange: quote.exchange,
    regularMarketTime: quote.regularMarketTime
      ? new Date(quote.regularMarketTime).toISOString()
      : undefined,
  };
}

export async function getStockProfile(symbol: string) {
  try {
    const result = await yahooFinance.quoteSummary(symbol, {
      modules: ['assetProfile', 'summaryDetail', 'financialData'],
    }) as any;

    return {
      industry: result.assetProfile?.industry,
      sector: result.assetProfile?.sector,
      website: result.assetProfile?.website,
      description: result.assetProfile?.longBusinessSummary,
      profitMargin: result.financialData?.profitMargins,
      operatingMargin: result.financialData?.operatingMargins,
      returnOnEquity: result.financialData?.returnOnEquity,
      returnOnAssets: result.financialData?.returnOnAssets,
      revenue: result.financialData?.totalRevenue,
      revenueGrowth: result.financialData?.revenueGrowth,
      targetMeanPrice: result.financialData?.targetMeanPrice,
      recommendationKey: result.financialData?.recommendationKey,
      numberOfAnalysts: result.financialData?.numberOfAnalystOpinions,
    };
  } catch {
    return null;
  }
}

function getDateRange(range: TimeRange): { period1: Date; interval: '1m' | '5m' | '15m' | '1d' | '1wk' } {
  const now = new Date();
  let period1: Date;
  let interval: '1m' | '5m' | '15m' | '1d' | '1wk';

  switch (range) {
    case '1D':
      period1 = new Date(now);
      period1.setDate(period1.getDate() - 1);
      interval = '5m';
      break;
    case '5D':
      period1 = new Date(now);
      period1.setDate(period1.getDate() - 5);
      interval = '15m';
      break;
    case '1M':
      period1 = new Date(now);
      period1.setMonth(period1.getMonth() - 1);
      interval = '1d';
      break;
    case '3M':
      period1 = new Date(now);
      period1.setMonth(period1.getMonth() - 3);
      interval = '1d';
      break;
    case '6M':
      period1 = new Date(now);
      period1.setMonth(period1.getMonth() - 6);
      interval = '1d';
      break;
    case '1Y':
      period1 = new Date(now);
      period1.setFullYear(period1.getFullYear() - 1);
      interval = '1d';
      break;
    case '5Y':
      period1 = new Date(now);
      period1.setFullYear(period1.getFullYear() - 5);
      interval = '1wk';
      break;
    default:
      period1 = new Date(now);
      period1.setMonth(period1.getMonth() - 1);
      interval = '1d';
  }

  return { period1, interval };
}

export async function getStockHistory(symbol: string, range: TimeRange): Promise<StockHistory[]> {
  const { period1, interval } = getDateRange(range);

  const result = await yahooFinance.chart(symbol, {
    period1,
    interval,
  }) as any;

  if (!result.quotes || result.quotes.length === 0) {
    return [];
  }

  return result.quotes
    .filter((q: any) => q.close !== null && q.close !== undefined)
    .map((q: any) => ({
      date: q.date.toISOString(),
      open: q.open || 0,
      high: q.high || 0,
      low: q.low || 0,
      close: q.close || 0,
      volume: q.volume || 0,
    }));
}

export async function getMarketIndices(): Promise<MarketIndex[]> {
  const symbols = [
    { symbol: '^GSPC', name: 'S&P 500' },
    { symbol: '^DJI', name: 'Dow Jones' },
    { symbol: '^IXIC', name: 'NASDAQ' },
    { symbol: '^RUT', name: 'Russell 2000' },
  ];

  const quotes = await yahooFinance.quote(symbols.map(s => s.symbol)) as any[];

  return quotes.map((quote: any, index: number) => ({
    symbol: symbols[index].symbol,
    name: symbols[index].name,
    price: quote.regularMarketPrice || 0,
    change: quote.regularMarketChange || 0,
    changePercent: quote.regularMarketChangePercent || 0,
  }));
}

export async function getMarketMovers(type: 'gainers' | 'losers' | 'active', offset = 0, limit = 20): Promise<MarketMover[]> {
  const screenerId = type === 'gainers'
    ? 'day_gainers'
    : type === 'losers'
      ? 'day_losers'
      : 'most_actives';

  try {
    // Fetch enough items to cover offset + limit
    const result = await yahooFinance.screener({
      scrIds: screenerId,
      count: offset + limit + 10, // Fetch extra to ensure we have enough
    }) as any;

    if (!result.quotes) return [];

    return result.quotes
      .slice(offset, offset + limit)
      .map((quote: any) => ({
        symbol: quote.symbol || '',
        name: quote.shortName || quote.longName || quote.symbol || '',
        price: quote.regularMarketPrice || 0,
        change: quote.regularMarketChange || 0,
        changePercent: quote.regularMarketChangePercent || 0,
        volume: quote.regularMarketVolume,
      }));
  } catch {
    return [];
  }
}

export async function getCompanyNews(symbol: string): Promise<NewsItem[]> {
  try {
    const result = await yahooFinance.search(symbol, { newsCount: 10 }) as any;

    if (!result.news) return [];

    return result.news.map((item: any) => ({
      title: item.title,
      link: item.link,
      publisher: item.publisher || 'Unknown',
      // providerPublishTime is already an ISO date string from yahoo-finance2
      publishedAt: item.providerPublishTime || new Date().toISOString(),
      thumbnail: item.thumbnail?.resolutions?.[0]?.url,
    }));
  } catch {
    return [];
  }
}

export async function searchStocks(query: string): Promise<{ symbol: string; name: string }[]> {
  try {
    const result = await yahooFinance.search(query, { quotesCount: 10 }) as any;

    if (!result.quotes) return [];

    return result.quotes
      .filter((q: any) => q.isYahooFinance && (q.quoteType === 'EQUITY' || q.quoteType === 'ETF'))
      .slice(0, 8)
      .map((q: any) => ({
        symbol: q.symbol,
        name: q.shortname || q.longname || q.symbol,
      }));
  } catch {
    return [];
  }
}

export async function getFutures(): Promise<MarketIndex[]> {
  const symbols = [
    { symbol: 'ES=F', name: 'S&P 500 Futures' },
    { symbol: 'NQ=F', name: 'NASDAQ Futures' },
    { symbol: 'YM=F', name: 'Dow Futures' },
    { symbol: 'RTY=F', name: 'Russell Futures' },
  ];

  try {
    const quotes = await yahooFinance.quote(symbols.map(s => s.symbol)) as any[];

    return quotes.map((quote: any, index: number) => ({
      symbol: symbols[index].symbol,
      name: symbols[index].name,
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
    }));
  } catch {
    return [];
  }
}

export async function getSectorETFs(): Promise<MarketIndex[]> {
  const symbols = [
    { symbol: 'XLK', name: 'Technology (XLK)' },
    { symbol: 'XLF', name: 'Financials (XLF)' },
    { symbol: 'XLE', name: 'Energy (XLE)' },
    { symbol: 'XLV', name: 'Healthcare (XLV)' },
    { symbol: 'XLY', name: 'Consumer Disc. (XLY)' },
    { symbol: 'XLP', name: 'Consumer Staples (XLP)' },
    { symbol: 'XLI', name: 'Industrials (XLI)' },
    { symbol: 'XLU', name: 'Utilities (XLU)' },
  ];

  try {
    const quotes = await yahooFinance.quote(symbols.map(s => s.symbol)) as any[];

    return quotes.map((quote: any, index: number) => ({
      symbol: symbols[index].symbol,
      name: symbols[index].name,
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
    }));
  } catch {
    return [];
  }
}

export async function getCommodities(): Promise<MarketIndex[]> {
  const symbols = [
    { symbol: 'GC=F', name: 'Gold (GC=F)' },
    { symbol: 'CL=F', name: 'Crude Oil (CL=F)' },
    { symbol: 'NG=F', name: 'Natural Gas (NG=F)' },
    { symbol: 'SI=F', name: 'Silver (SI=F)' },
  ];

  try {
    const quotes = await yahooFinance.quote(symbols.map(s => s.symbol)) as any[];

    return quotes.map((quote: any, index: number) => ({
      symbol: symbols[index].symbol,
      name: symbols[index].name,
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
    }));
  } catch {
    return [];
  }
}

export async function getCurrencies(): Promise<MarketIndex[]> {
  const symbols = [
    { symbol: 'EURUSD=X', name: 'EUR/USD' },
    { symbol: 'GBPUSD=X', name: 'GBP/USD' },
    { symbol: 'USDJPY=X', name: 'USD/JPY' },
    { symbol: 'AUDUSD=X', name: 'AUD/USD' },
  ];

  try {
    const quotes = await yahooFinance.quote(symbols.map(s => s.symbol)) as any[];

    return quotes.map((quote: any, index: number) => ({
      symbol: symbols[index].symbol,
      name: symbols[index].name,
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
    }));
  } catch {
    return [];
  }
}

export async function getHeatmapData(): Promise<HeatmapSector[]> {
  // Try dynamic fetch from Wikipedia, fall back to static list
  let constituents;
  try {
    constituents = await getSP500Constituents();
  } catch (error) {
    console.warn('[Heatmap] Wikipedia fetch failed, using static list:', error);
    constituents = SP500_CONSTITUENTS;
  }

  const symbols = constituents.map(s => s.symbol);
  const stockMap = new Map(constituents.map(s => [s.symbol, s]));

  // Batch requests (100 symbols per batch)
  const BATCH_SIZE = 100;
  const batches: string[][] = [];
  for (let i = 0; i < symbols.length; i += BATCH_SIZE) {
    batches.push(symbols.slice(i, i + BATCH_SIZE));
  }

  try {
    // Fetch all batches in parallel, handling partial failures
    const results = await Promise.allSettled(
      batches.map(batch => yahooFinance.quote(batch, { return: 'array' }))
    );

    // Flatten successful results, skip failed batches
    const quotes: any[] = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const data = result.value;
        if (Array.isArray(data)) {
          quotes.push(...data);
        } else if (data) {
          quotes.push(data);
        }
      } else {
        console.warn(`Batch ${index} failed:`, result.reason?.message || result.reason);
      }
    });

    // Initialize sector map from the constituents (handles dynamic Wikipedia data)
    const sectorMap = new Map<string, HeatmapStock[]>();
    const uniqueSectors = [...new Set(constituents.map(s => s.sector))];
    uniqueSectors.forEach(sector => sectorMap.set(sector, []));

    // Group stocks by sector
    quotes.forEach((quote: any) => {
      if (!quote?.symbol) return;
      const stockInfo = stockMap.get(quote.symbol);
      if (!stockInfo) return;

      // Skip stocks without market cap
      const marketCap = quote.marketCap;
      if (!marketCap || marketCap <= 0) return;

      const stock: HeatmapStock = {
        symbol: quote.symbol,
        name: stockInfo.name,
        sector: stockInfo.sector,
        price: quote.regularMarketPrice || 0,
        change: quote.regularMarketChange || 0,
        changePercent: quote.regularMarketChangePercent || 0,
        marketCap,
      };

      sectorMap.get(stockInfo.sector)?.push(stock);
    });

    // Sort stocks within each sector by market cap (largest first)
    sectorMap.forEach(stocks => {
      stocks.sort((a, b) => b.marketCap - a.marketCap);
    });

    // Convert to array format for treemap, sorted by total sector market cap
    const sectors = uniqueSectors.map(sector => ({
      name: sector,
      children: sectorMap.get(sector) || [],
    }));

    // Sort sectors by total market cap
    sectors.sort((a, b) => {
      const aTotal = a.children.reduce((sum, s) => sum + s.marketCap, 0);
      const bTotal = b.children.reduce((sum, s) => sum + s.marketCap, 0);
      return bTotal - aTotal;
    });

    return sectors;
  } catch (error) {
    console.error('Error fetching heatmap data:', error);
    return [];
  }
}

// Helper to get 5-day sparkline data for multiple symbols
async function getSparklineData(symbols: string[]): Promise<Map<string, number[]>> {
  const sparklineMap = new Map<string, number[]>();

  const period1 = new Date();
  period1.setDate(period1.getDate() - 7); // 7 days to ensure 5 trading days

  try {
    const results = await Promise.allSettled(
      symbols.map(symbol =>
        yahooFinance.chart(symbol, {
          period1,
          interval: '1d',
        })
      )
    );

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const data = result.value as any;
        if (data?.quotes?.length > 0) {
          const closes = data.quotes
            .filter((q: any) => q.close !== null && q.close !== undefined)
            .slice(-5) // Last 5 data points
            .map((q: any) => q.close);
          if (closes.length > 1) {
            sparklineMap.set(symbols[index], closes);
          }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching sparkline data:', error);
  }

  return sparklineMap;
}

export async function getExtendedSectorETFs(): Promise<ExtendedMarketIndex[]> {
  const symbols = [
    { symbol: 'XLK', name: 'Technology', category: 'sector' },
    { symbol: 'XLF', name: 'Financials', category: 'sector' },
    { symbol: 'XLE', name: 'Energy', category: 'sector' },
    { symbol: 'XLV', name: 'Healthcare', category: 'sector' },
    { symbol: 'XLY', name: 'Consumer Discretionary', category: 'sector' },
    { symbol: 'XLP', name: 'Consumer Staples', category: 'sector' },
    { symbol: 'XLI', name: 'Industrials', category: 'sector' },
    { symbol: 'XLU', name: 'Utilities', category: 'sector' },
    { symbol: 'XLB', name: 'Materials', category: 'sector' },
    { symbol: 'XLRE', name: 'Real Estate', category: 'sector' },
    { symbol: 'XLC', name: 'Communication Services', category: 'sector' },
  ];

  try {
    const [quotes, sparklines] = await Promise.all([
      yahooFinance.quote(symbols.map(s => s.symbol)) as Promise<any[]>,
      getSparklineData(symbols.map(s => s.symbol)),
    ]);

    return quotes.map((quote: any, index: number) => ({
      symbol: symbols[index].symbol,
      name: symbols[index].name,
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      category: symbols[index].category,
      sparkline: sparklines.get(symbols[index].symbol),
    }));
  } catch {
    return [];
  }
}

export async function getExtendedCommodities(): Promise<ExtendedMarketIndex[]> {
  const symbols = [
    // Metals
    { symbol: 'GC=F', name: 'Gold', category: 'metals' },
    { symbol: 'SI=F', name: 'Silver', category: 'metals' },
    { symbol: 'HG=F', name: 'Copper', category: 'metals' },
    { symbol: 'PL=F', name: 'Platinum', category: 'metals' },
    // Energy
    { symbol: 'CL=F', name: 'Crude Oil', category: 'energy' },
    { symbol: 'NG=F', name: 'Natural Gas', category: 'energy' },
    { symbol: 'RB=F', name: 'Gasoline', category: 'energy' },
    { symbol: 'HO=F', name: 'Heating Oil', category: 'energy' },
    // Agriculture
    { symbol: 'ZC=F', name: 'Corn', category: 'agriculture' },
    { symbol: 'ZS=F', name: 'Soybeans', category: 'agriculture' },
    { symbol: 'ZW=F', name: 'Wheat', category: 'agriculture' },
    { symbol: 'KC=F', name: 'Coffee', category: 'agriculture' },
    { symbol: 'CT=F', name: 'Cotton', category: 'agriculture' },
  ];

  try {
    const [quotes, sparklines] = await Promise.all([
      yahooFinance.quote(symbols.map(s => s.symbol)) as Promise<any[]>,
      getSparklineData(symbols.map(s => s.symbol)),
    ]);

    return quotes.map((quote: any, index: number) => ({
      symbol: symbols[index].symbol,
      name: symbols[index].name,
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      category: symbols[index].category,
      sparkline: sparklines.get(symbols[index].symbol),
    }));
  } catch {
    return [];
  }
}

export async function getExtendedCurrencies(): Promise<ExtendedMarketIndex[]> {
  const symbols = [
    // Majors
    { symbol: 'EURUSD=X', name: 'EUR/USD', category: 'majors' },
    { symbol: 'GBPUSD=X', name: 'GBP/USD', category: 'majors' },
    { symbol: 'USDJPY=X', name: 'USD/JPY', category: 'majors' },
    { symbol: 'USDCHF=X', name: 'USD/CHF', category: 'majors' },
    { symbol: 'AUDUSD=X', name: 'AUD/USD', category: 'majors' },
    { symbol: 'USDCAD=X', name: 'USD/CAD', category: 'majors' },
    { symbol: 'NZDUSD=X', name: 'NZD/USD', category: 'majors' },
    // Crosses
    { symbol: 'EURGBP=X', name: 'EUR/GBP', category: 'crosses' },
    { symbol: 'EURJPY=X', name: 'EUR/JPY', category: 'crosses' },
    { symbol: 'GBPJPY=X', name: 'GBP/JPY', category: 'crosses' },
    // Emerging
    { symbol: 'USDCNH=X', name: 'USD/CNH', category: 'emerging' },
    { symbol: 'USDINR=X', name: 'USD/INR', category: 'emerging' },
  ];

  try {
    const [quotes, sparklines] = await Promise.all([
      yahooFinance.quote(symbols.map(s => s.symbol)) as Promise<any[]>,
      getSparklineData(symbols.map(s => s.symbol)),
    ]);

    return quotes.map((quote: any, index: number) => ({
      symbol: symbols[index].symbol,
      name: symbols[index].name,
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      category: symbols[index].category,
      sparkline: sparklines.get(symbols[index].symbol),
    }));
  } catch {
    return [];
  }
}
