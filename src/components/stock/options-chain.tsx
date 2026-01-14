'use client';

import { useState } from 'react';
import { useOptionsChain } from '@/hooks/use-stock-data';
import { cn } from '@/lib/utils';

interface OptionsChainProps {
  symbol: string;
}

function formatNumber(num: number | undefined, decimals = 2): string {
  if (num === undefined || num === null) return '-';
  return num.toFixed(decimals);
}

function formatVolume(num: number | undefined): string {
  if (num === undefined || num === null) return '-';
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(0)}K`;
  return num.toLocaleString();
}

function formatPercent(num: number | undefined): string {
  if (num === undefined || num === null) return '-';
  return `${(num * 100).toFixed(0)}%`;
}

export function OptionsChain({ symbol }: OptionsChainProps) {
  const [selectedExpiration, setSelectedExpiration] = useState<string | undefined>();
  const { data, isLoading, error } = useOptionsChain(symbol, selectedExpiration);

  if (isLoading) {
    return (
      <div className="border border-border p-3">
        <div className="h-4 w-32 bg-secondary animate-pulse mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-4 bg-secondary animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="border border-border p-3">
        <span className="font-mono text-xs text-muted-foreground">
          No options data available
        </span>
      </div>
    );
  }

  const underlyingPrice = data.underlyingPrice;

  return (
    <div className="space-y-3">
      {/* Expiration Selector */}
      <div className="border border-border">
        <div className="px-3 py-1.5 border-b border-border bg-secondary/30 flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground">OPTIONS CHAIN</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">Expiration:</span>
            <select
              value={selectedExpiration || data.expirationDates[0] || ''}
              onChange={(e) => setSelectedExpiration(e.target.value)}
              className="font-mono text-xs bg-secondary/50 border border-border px-2 py-1 rounded-sm"
            >
              {data.expirationDates.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Underlying Price */}
        <div className="px-3 py-2 border-b border-border bg-secondary/10 flex items-center justify-between font-mono text-xs">
          <span className="text-muted-foreground">Underlying Price</span>
          <span className="font-medium">${underlyingPrice.toFixed(2)}</span>
        </div>

        {/* Options Table */}
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/20">
                <th colSpan={6} className="text-center px-3 py-2 text-gain font-normal border-r border-border">CALLS</th>
                <th className="px-3 py-2 text-muted-foreground font-normal bg-secondary/30">Strike</th>
                <th colSpan={6} className="text-center px-3 py-2 text-loss font-normal border-l border-border">PUTS</th>
              </tr>
              <tr className="border-b border-border text-muted-foreground text-[10px]">
                <th className="text-right px-2 py-1 font-normal">Last</th>
                <th className="text-right px-2 py-1 font-normal">Chg</th>
                <th className="text-right px-2 py-1 font-normal">Bid</th>
                <th className="text-right px-2 py-1 font-normal">Ask</th>
                <th className="text-right px-2 py-1 font-normal">Vol</th>
                <th className="text-right px-2 py-1 font-normal border-r border-border">OI</th>
                <th className="text-center px-2 py-1 font-normal bg-secondary/30">Strike</th>
                <th className="text-right px-2 py-1 font-normal border-l border-border">Last</th>
                <th className="text-right px-2 py-1 font-normal">Chg</th>
                <th className="text-right px-2 py-1 font-normal">Bid</th>
                <th className="text-right px-2 py-1 font-normal">Ask</th>
                <th className="text-right px-2 py-1 font-normal">Vol</th>
                <th className="text-right px-2 py-1 font-normal">OI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {/* Get unique strikes and merge calls/puts */}
              {(() => {
                const strikes = [...new Set([
                  ...data.calls.map(c => c.strike),
                  ...data.puts.map(p => p.strike)
                ])].sort((a, b) => a - b);

                // Filter to show strikes around the current price
                const nearStrikes = strikes.filter(
                  s => s >= underlyingPrice * 0.85 && s <= underlyingPrice * 1.15
                );

                const strikesToShow = nearStrikes.length > 0 ? nearStrikes : strikes.slice(0, 20);

                return strikesToShow.map((strike) => {
                  const call = data.calls.find(c => c.strike === strike);
                  const put = data.puts.find(p => p.strike === strike);
                  const isITMCall = strike < underlyingPrice;
                  const isITMPut = strike > underlyingPrice;
                  const isATM = Math.abs(strike - underlyingPrice) / underlyingPrice < 0.01;

                  return (
                    <tr
                      key={strike}
                      className={cn(
                        isATM && 'bg-secondary/20'
                      )}
                    >
                      {/* Calls */}
                      <td className={cn("text-right px-2 py-1.5", isITMCall && "bg-gain/5")}>
                        {formatNumber(call?.lastPrice)}
                      </td>
                      <td className={cn(
                        "text-right px-2 py-1.5",
                        isITMCall && "bg-gain/5",
                        call?.change && call.change > 0 && "text-gain",
                        call?.change && call.change < 0 && "text-loss"
                      )}>
                        {call?.change ? (call.change > 0 ? '+' : '') + formatNumber(call.change) : '-'}
                      </td>
                      <td className={cn("text-right px-2 py-1.5", isITMCall && "bg-gain/5")}>
                        {formatNumber(call?.bid)}
                      </td>
                      <td className={cn("text-right px-2 py-1.5", isITMCall && "bg-gain/5")}>
                        {formatNumber(call?.ask)}
                      </td>
                      <td className={cn("text-right px-2 py-1.5", isITMCall && "bg-gain/5")}>
                        {formatVolume(call?.volume)}
                      </td>
                      <td className={cn("text-right px-2 py-1.5 border-r border-border", isITMCall && "bg-gain/5")}>
                        {formatVolume(call?.openInterest)}
                      </td>

                      {/* Strike */}
                      <td className={cn(
                        "text-center px-2 py-1.5 font-medium bg-secondary/30",
                        isATM && "bg-secondary/50"
                      )}>
                        ${strike.toFixed(2)}
                      </td>

                      {/* Puts */}
                      <td className={cn("text-right px-2 py-1.5 border-l border-border", isITMPut && "bg-loss/5")}>
                        {formatNumber(put?.lastPrice)}
                      </td>
                      <td className={cn(
                        "text-right px-2 py-1.5",
                        isITMPut && "bg-loss/5",
                        put?.change && put.change > 0 && "text-gain",
                        put?.change && put.change < 0 && "text-loss"
                      )}>
                        {put?.change ? (put.change > 0 ? '+' : '') + formatNumber(put.change) : '-'}
                      </td>
                      <td className={cn("text-right px-2 py-1.5", isITMPut && "bg-loss/5")}>
                        {formatNumber(put?.bid)}
                      </td>
                      <td className={cn("text-right px-2 py-1.5", isITMPut && "bg-loss/5")}>
                        {formatNumber(put?.ask)}
                      </td>
                      <td className={cn("text-right px-2 py-1.5", isITMPut && "bg-loss/5")}>
                        {formatVolume(put?.volume)}
                      </td>
                      <td className={cn("text-right px-2 py-1.5", isITMPut && "bg-loss/5")}>
                        {formatVolume(put?.openInterest)}
                      </td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="px-3 py-2 border-t border-border bg-secondary/10 flex items-center gap-4 font-mono text-[10px] text-muted-foreground">
          <span>ITM = In The Money (highlighted)</span>
          <span>Vol = Volume</span>
          <span>OI = Open Interest</span>
        </div>
      </div>
    </div>
  );
}
