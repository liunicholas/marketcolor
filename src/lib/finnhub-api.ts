// Finnhub API client for earnings calendar data

import type { EarningsEvent, FinnhubEarningsResponse } from '@/types/calendar';

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

function getFinnhubApiKey(): string {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    throw new Error('FINNHUB_API_KEY environment variable is not set');
  }
  return apiKey;
}

export async function getEarningsCalendar(
  from: string,
  to: string
): Promise<EarningsEvent[]> {
  const apiKey = getFinnhubApiKey();
  const url = `${FINNHUB_BASE_URL}/calendar/earnings?from=${from}&to=${to}&token=${apiKey}`;

  const response = await fetch(url, {
    next: { revalidate: 900 }, // Cache for 15 minutes
  });

  if (!response.ok) {
    throw new Error(`Finnhub API error: ${response.status}`);
  }

  const data: FinnhubEarningsResponse = await response.json();

  // Transform to our format
  return (data.earningsCalendar || []).map((event, index) => ({
    id: `earnings-${event.symbol}-${event.date}-${index}`,
    symbol: event.symbol,
    date: event.date,
    hour: normalizeHour(event.hour),
    quarter: event.quarter,
    year: event.year,
    epsEstimate: event.epsEstimate,
    epsActual: event.epsActual,
    revenueEstimate: event.revenueEstimate,
    revenueActual: event.revenueActual,
  }));
}

function normalizeHour(hour: string): 'bmo' | 'amc' | 'dmh' {
  const normalized = hour?.toLowerCase();
  if (normalized === 'bmo') return 'bmo';
  if (normalized === 'amc') return 'amc';
  return 'dmh';
}
