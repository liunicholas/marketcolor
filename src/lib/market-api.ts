import yahooFinance from 'yahoo-finance2';
import type { StockQuote, StockHistory, MarketIndex, MarketMover, NewsItem, TimeRange } from '@/types/stock';

/* eslint-disable @typescript-eslint/no-explicit-any */

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

export async function getMarketMovers(type: 'gainers' | 'losers' | 'active'): Promise<MarketMover[]> {
  const screenerId = type === 'gainers'
    ? 'day_gainers'
    : type === 'losers'
      ? 'day_losers'
      : 'most_actives';

  try {
    const result = await yahooFinance.screener({
      scrIds: screenerId,
      count: 20,
    }) as any;

    if (!result.quotes) return [];

    return result.quotes.slice(0, 20).map((quote: any) => ({
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
      publishedAt: item.providerPublishTime
        ? new Date(item.providerPublishTime * 1000).toISOString()
        : new Date().toISOString(),
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
