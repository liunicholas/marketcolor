'use client';

import useSWR from 'swr';
import type { MarketIndex, MarketMover } from '@/types/stock';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useMarketIndices() {
  const { data, error, isLoading, mutate } = useSWR<MarketIndex[]>(
    '/api/market/indices',
    fetcher,
    {
      refreshInterval: 60000, // Refresh every minute
      revalidateOnFocus: true,
    }
  );

  return {
    indices: data || [],
    error,
    isLoading,
    refresh: mutate,
  };
}

export function useMarketMovers(type: 'gainers' | 'losers' | 'active' = 'gainers') {
  const { data, error, isLoading, mutate } = useSWR<MarketMover[]>(
    `/api/market/movers?type=${type}`,
    fetcher,
    {
      refreshInterval: 300000, // Refresh every 5 minutes
      revalidateOnFocus: true,
    }
  );

  return {
    movers: data || [],
    error,
    isLoading,
    refresh: mutate,
  };
}
