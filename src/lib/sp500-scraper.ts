import * as cheerio from 'cheerio';
import { SP500_CONSTITUENTS as STATIC_CONSTITUENTS } from '@/data/sp500';

export interface SP500Stock {
  symbol: string;
  name: string;
  sector: string;
}

// Wikipedia GICS sector names
export const SP500_SECTORS = [
  'Information Technology',
  'Health Care',
  'Financials',
  'Consumer Discretionary',
  'Communication Services',
  'Industrials',
  'Consumer Staples',
  'Energy',
  'Utilities',
  'Real Estate',
  'Materials',
] as const;

export type SP500Sector = (typeof SP500_SECTORS)[number];

// In-memory cache
let cachedStocks: SP500Stock[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function getSP500Constituents(): Promise<SP500Stock[]> {
  // Return cache if valid
  if (cachedStocks && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedStocks;
  }

  // Fetch Wikipedia page with proper headers
  const response = await fetch(
    'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies',
    {
      headers: {
        'User-Agent': 'MarketColor/1.0 (Financial Data App)',
        'Accept': 'text/html',
      },
      next: { revalidate: 86400 }, // Next.js cache for 24 hours
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Wikipedia: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Parse first wikitable (constituents table)
  const stocks: SP500Stock[] = [];
  $('table.wikitable').first().find('tbody tr').each((_, row) => {
    const cells = $(row).find('td');
    if (cells.length >= 4) {
      // Symbol is in first cell, may have link
      let symbol = $(cells[0]).text().trim();
      const name = $(cells[1]).text().trim();
      const sector = $(cells[2]).text().trim();

      // Handle special symbols (e.g., BRK.B -> BRK-B for Yahoo Finance)
      symbol = symbol.replace('.', '-');

      if (symbol && name && sector) {
        stocks.push({ symbol, name, sector });
      }
    }
  });

  // Validate we got a reasonable number of stocks
  if (stocks.length < 400) {
    throw new Error(`Only parsed ${stocks.length} stocks, expected ~500`);
  }

  // Update cache
  cachedStocks = stocks;
  cacheTimestamp = Date.now();

  console.log(`[SP500 Scraper] Loaded ${stocks.length} stocks from Wikipedia`);
  return stocks;
}

// Export static list as fallback
export const SP500_CONSTITUENTS = STATIC_CONSTITUENTS;
