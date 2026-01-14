'use client';

import useSWR from 'swr';
import type { EarningsEvent } from '@/types/calendar';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getToday(): string {
  return formatDate(new Date());
}

// Sort events by hour: PRE (bmo) -> MKT (dmh) -> POST (amc)
function sortEvents(events: EarningsEvent[]): EarningsEvent[] {
  const hourOrder = { bmo: 0, dmh: 1, amc: 2 };
  return [...events].sort((a, b) => hourOrder[a.hour] - hourOrder[b.hour]);
}

export function useEarningsCalendar(from: string, to: string) {
  const { data, error, isLoading, mutate } = useSWR<EarningsEvent[]>(
    `/api/calendar/earnings?from=${from}&to=${to}`,
    fetcher,
    {
      refreshInterval: 900000, // 15 minutes
      revalidateOnFocus: true,
    }
  );

  return {
    events: data || [],
    error,
    isLoading,
    refresh: mutate,
  };
}

export function useTodayEvents() {
  const today = getToday();

  const { events, isLoading, error } = useEarningsCalendar(today, today);

  // Filter to today's events and sort
  const todayEvents = sortEvents(events.filter((e) => e.date === today));

  return {
    events: todayEvents,
    isLoading,
    error,
  };
}

export function useCalendarEvents(from: string, to: string) {
  const { events, isLoading, error } = useEarningsCalendar(from, to);

  // Group events by date and sort within each date
  const eventsByDate = events.reduce(
    (acc, event) => {
      const date = event.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    },
    {} as Record<string, EarningsEvent[]>
  );

  // Sort events within each date group
  for (const date of Object.keys(eventsByDate)) {
    eventsByDate[date] = sortEvents(eventsByDate[date]);
  }

  return {
    events: sortEvents(events),
    eventsByDate,
    isLoading,
    error,
  };
}

export function useMonthEvents(year: number, month: number) {
  // month is 0-indexed (0 = January)
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const from = formatDate(firstDay);
  const to = formatDate(lastDay);

  return useCalendarEvents(from, to);
}
