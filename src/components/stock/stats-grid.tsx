'use client';

import type { StockQuote } from '@/types/stock';

interface StatsGridProps {
  quote: StockQuote | null;
  profile?: {
    industry?: string;
    sector?: string;
    profitMargin?: number;
    operatingMargin?: number;
    returnOnEquity?: number;
    returnOnAssets?: number;
    revenue?: number;
    revenueGrowth?: number;
    targetMeanPrice?: number;
    recommendationKey?: string;
    numberOfAnalysts?: number;
  } | null;
  isLoading?: boolean;
}

function formatLargeNumber(num: number | undefined): string {
  if (num === undefined || num === null) return '-';
  if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
  return `$${num.toLocaleString()}`;
}

function formatPercent(num: number | undefined): string {
  if (num === undefined || num === null) return '-';
  return `${(num * 100).toFixed(1)}%`;
}

function formatNumber(num: number | undefined, decimals = 2): string {
  if (num === undefined || num === null) return '-';
  return num.toFixed(decimals);
}

function formatVolume(num: number | undefined): string {
  if (num === undefined || num === null) return '-';
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(0)}K`;
  return num.toLocaleString();
}

export function StatsGrid({ quote, profile, isLoading }: StatsGridProps) {
  if (isLoading) {
    return (
      <div className="border border-border p-3">
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="h-3 w-12 bg-secondary animate-pulse mb-1" />
              <div className="h-4 w-16 bg-secondary animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Key Stats - Compact Grid */}
      <div className="border border-border">
        <div className="px-3 py-1.5 border-b border-border bg-secondary/30">
          <span className="font-mono text-xs text-muted-foreground">STATS</span>
        </div>
        <div className="grid grid-cols-4 gap-x-4 gap-y-2 p-3 font-mono text-xs">
          <div>
            <span className="text-muted-foreground block">Mkt Cap</span>
            <span>{formatLargeNumber(quote?.marketCap)}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">P/E</span>
            <span>{formatNumber(quote?.peRatio)}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Fwd P/E</span>
            <span>{formatNumber(quote?.forwardPE)}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Div Yield</span>
            <span>{quote?.dividendYield ? formatPercent(quote.dividendYield / 100) : '-'}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Volume</span>
            <span>{formatVolume(quote?.volume)}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Avg Vol</span>
            <span>{formatVolume(quote?.avgVolume)}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">52W High</span>
            <span className="text-gain">{quote?.fiftyTwoWeekHigh ? `$${quote.fiftyTwoWeekHigh.toFixed(2)}` : '-'}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">52W Low</span>
            <span className="text-loss">{quote?.fiftyTwoWeekLow ? `$${quote.fiftyTwoWeekLow.toFixed(2)}` : '-'}</span>
          </div>
        </div>
      </div>

      {/* Fundamentals - Compact Grid */}
      {profile && (
        <div className="border border-border">
          <div className="px-3 py-1.5 border-b border-border bg-secondary/30">
            <span className="font-mono text-xs text-muted-foreground">FUNDAMENTALS</span>
          </div>
          <div className="grid grid-cols-4 gap-x-4 gap-y-2 p-3 font-mono text-xs">
            {profile.sector && (
              <div className="col-span-2">
                <span className="text-muted-foreground block">Sector</span>
                <span className="truncate block">{profile.sector}</span>
              </div>
            )}
            {profile.industry && (
              <div className="col-span-2">
                <span className="text-muted-foreground block">Industry</span>
                <span className="truncate block">{profile.industry}</span>
              </div>
            )}
            <div>
              <span className="text-muted-foreground block">Revenue</span>
              <span>{formatLargeNumber(profile.revenue)}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Rev Grth</span>
              <span>{formatPercent(profile.revenueGrowth)}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Profit Mgn</span>
              <span>{formatPercent(profile.profitMargin)}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Op Mgn</span>
              <span>{formatPercent(profile.operatingMargin)}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">ROE</span>
              <span>{formatPercent(profile.returnOnEquity)}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">ROA</span>
              <span>{formatPercent(profile.returnOnAssets)}</span>
            </div>
            {profile.recommendationKey && (
              <>
                <div>
                  <span className="text-muted-foreground block">Rating</span>
                  <span className="uppercase">{profile.recommendationKey.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Target</span>
                  <span>{profile.targetMeanPrice ? `$${profile.targetMeanPrice.toFixed(2)}` : '-'}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
