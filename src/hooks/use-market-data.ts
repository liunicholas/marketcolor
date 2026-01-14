'use client';

import useSWR from 'swr';
import type { MarketIndex, MarketMover, HeatmapSector } from '@/types/stock';

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

export function useMarketMovers(type: 'gainers' | 'losers' | 'active' = 'gainers', offset = 0, limit = 20) {
  const { data, error, isLoading, mutate } = useSWR<MarketMover[]>(
    `/api/market/movers?type=${type}&offset=${offset}&limit=${limit}`,
    fetcher,
    {
      refreshInterval: 300000, // Refresh every 5 minutes
      revalidateOnFocus: true,
      keepPreviousData: true,
    }
  );

  return {
    movers: data || [],
    error,
    isLoading: isLoading && !data,
    refresh: mutate,
  };
}

export function useFutures() {
  const { data, error, isLoading, mutate } = useSWR<MarketIndex[]>(
    '/api/market/futures',
    fetcher,
    {
      refreshInterval: 60000,
      revalidateOnFocus: true,
    }
  );

  return {
    futures: data || [],
    error,
    isLoading,
    refresh: mutate,
  };
}

export function useSectorETFs() {
  const { data, error, isLoading, mutate } = useSWR<MarketIndex[]>(
    '/api/market/sectors',
    fetcher,
    {
      refreshInterval: 60000,
      revalidateOnFocus: true,
    }
  );

  return {
    sectors: data || [],
    error,
    isLoading,
    refresh: mutate,
  };
}

export function useCommodities() {
  const { data, error, isLoading, mutate } = useSWR<MarketIndex[]>(
    '/api/market/commodities',
    fetcher,
    {
      refreshInterval: 60000,
      revalidateOnFocus: true,
    }
  );

  return {
    commodities: data || [],
    error,
    isLoading,
    refresh: mutate,
  };
}

export function useCurrencies() {
  const { data, error, isLoading, mutate } = useSWR<MarketIndex[]>(
    '/api/market/currencies',
    fetcher,
    {
      refreshInterval: 60000,
      revalidateOnFocus: true,
    }
  );

  return {
    currencies: data || [],
    error,
    isLoading,
    refresh: mutate,
  };
}

export function useHeatmapData() {
  const { data, error, isLoading, mutate } = useSWR<HeatmapSector[]>(
    '/api/market/heatmap',
    fetcher,
    {
      refreshInterval: 300000, // Refresh every 5 minutes
      revalidateOnFocus: true,
    }
  );

  return {
    sectors: data || [],
    error,
    isLoading,
    refresh: mutate,
  };
}
