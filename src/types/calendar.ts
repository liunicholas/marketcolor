// Calendar event types for earnings data

export interface EarningsEvent {
  id: string;
  symbol: string;
  date: string; // ISO date: "2026-01-15"
  hour: 'bmo' | 'amc' | 'dmh'; // before market open, after market close, during market hours
  quarter: number;
  year: number;
  epsEstimate?: number;
  epsActual?: number;
  revenueEstimate?: number;
  revenueActual?: number;
}

export interface CalendarDay {
  date: string; // ISO date
  isToday: boolean;
  isCurrentMonth: boolean;
  events: EarningsEvent[];
}

export type CalendarView = 'month' | 'agenda';

// Finnhub API response types
export interface FinnhubEarningsEvent {
  date: string;
  epsActual?: number;
  epsEstimate?: number;
  hour: string;
  quarter: number;
  revenueActual?: number;
  revenueEstimate?: number;
  symbol: string;
  year: number;
}

export interface FinnhubEarningsResponse {
  earningsCalendar: FinnhubEarningsEvent[];
}
