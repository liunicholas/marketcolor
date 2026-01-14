'use client';

import useSWR from 'swr';
import type {
  StockQuote, StockHistory, NewsItem, TimeRange,
  AnalystData, OwnershipData, FinancialStatements, OptionsChain
} from '@/types/stock';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface StockData {
  quote: StockQuote;
  history: StockHistory[];
  profile?: {
    industry?: string;
    sector?: string;
    website?: string;
    description?: string;
    profitMargin?: number;
    operatingMargin?: number;
    returnOnEquity?: number;
    returnOnAssets?: number;
    revenue?: number;
    revenueGrowth?: number;
    targetMeanPrice?: number;
    recommendationKey?: string;
    numberOfAnalysts?: number;
  };
  news?: NewsItem[];
}

export function useStockData(
  symbol: string | null,
  range: TimeRange = '1M',
  options?: { includeProfile?: boolean; includeNews?: boolean }
) {
  const params = new URLSearchParams({ range });
  if (options?.includeProfile) params.set('profile', 'true');
  if (options?.includeNews) params.set('news', 'true');

  const { data, error, isLoading, isValidating, mutate } = useSWR<StockData>(
    symbol ? `/api/stock/${symbol}?${params}` : null,
    fetcher,
    {
      refreshInterval: 60000, // Refresh every minute
      revalidateOnFocus: true,
      keepPreviousData: true, // Keep showing previous data while fetching new data
    }
  );

  return {
    data,
    error,
    isLoading: isLoading && !data, // Only show loading on initial load, not on revalidation
    isValidating, // True when fetching in background
    refresh: mutate,
  };
}

export function useStockSearch(query: string) {
  const { data, error, isLoading } = useSWR<{ symbol: string; name: string }[]>(
    query.length >= 1 ? `/api/stock/search?q=${encodeURIComponent(query)}` : null,
    fetcher,
    {
      dedupingInterval: 300,
    }
  );

  return {
    results: data || [],
    error,
    isLoading,
  };
}

export function useAnalystData(symbol: string | null) {
  const { data, error, isLoading } = useSWR<AnalystData>(
    symbol ? `/api/stock/${symbol}/analysts` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    data,
    error,
    isLoading,
  };
}

export function useOwnershipData(symbol: string | null) {
  const { data, error, isLoading } = useSWR<OwnershipData>(
    symbol ? `/api/stock/${symbol}/ownership` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    data,
    error,
    isLoading,
  };
}

export function useFinancialStatements(symbol: string | null) {
  const { data, error, isLoading } = useSWR<FinancialStatements>(
    symbol ? `/api/stock/${symbol}/financials` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    data,
    error,
    isLoading,
  };
}

export function useOptionsChain(symbol: string | null, expiration?: string) {
  const params = expiration ? `?expiration=${expiration}` : '';
  const { data, error, isLoading } = useSWR<OptionsChain>(
    symbol ? `/api/stock/${symbol}/options${params}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  return {
    data,
    error,
    isLoading,
  };
}
