'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkline } from '@/components/charts/sparkline';
import { useExtendedSectorETFs } from '@/hooks/use-market-data';

export default function SectorsPage() {
  const { sectors, isLoading, error } = useExtendedSectorETFs();

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="border border-border p-8 text-center">
          <p className="font-mono text-sm mb-4">ERROR: FAILED TO LOAD SECTOR DATA</p>
          <Link href="/">
            <Button variant="outline" className="font-mono text-xs">
              BACK TO HOME
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Button */}
      <div className="mb-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="font-mono text-xs h-7 px-2">
            ← BACK
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-4">
        <h1 className="font-mono text-xs text-muted-foreground mb-1">SECTOR ETFs</h1>
        <p className="font-mono text-xs text-muted-foreground">
          All 11 S&P 500 sector performance via SPDR Select Sector ETFs
        </p>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} className="border border-border p-4">
              <div className="h-3 w-24 bg-secondary animate-pulse mb-3" />
              <div className="h-6 w-20 bg-secondary animate-pulse mb-2" />
              <div className="h-3 w-16 bg-secondary animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sectors.map((sector) => {
            const isPositive = sector.change >= 0;
            return (
              <Link
                key={sector.symbol}
                href={`/stock/${encodeURIComponent(sector.symbol)}`}
                className="border border-border p-4 hover:bg-secondary/30 transition-colors block"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="block text-xs text-muted-foreground mb-1">
                      {sector.name}
                    </span>
                    <span className="block font-mono text-[10px] text-muted-foreground">
                      {sector.symbol}
                    </span>
                  </div>
                  {sector.sparkline && sector.sparkline.length > 1 && (
                    <Sparkline
                      data={sector.sparkline}
                      positive={isPositive}
                      width={60}
                      height={24}
                    />
                  )}
                </div>
                <div className="flex items-end justify-between">
                  <span className="font-mono text-lg text-foreground">
                    ${sector.price.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <div className="text-right">
                    <span className={`block font-mono text-sm ${isPositive ? 'text-gain' : 'text-loss'}`}>
                      {isPositive ? '+' : ''}{sector.change.toFixed(2)}
                    </span>
                    <span className={`block font-mono text-xs ${isPositive ? 'text-gain' : 'text-loss'}`}>
                      {isPositive ? '+' : ''}{sector.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Summary Table */}
      {!isLoading && sectors.length > 0 && (
        <div className="mt-6 border border-border">
          <div className="px-4 py-2 border-b border-border bg-secondary/30">
            <span className="font-mono text-xs text-muted-foreground">SUMMARY</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-2 text-left font-mono text-xs text-muted-foreground">SECTOR</th>
                  <th className="px-4 py-2 text-right font-mono text-xs text-muted-foreground">SYMBOL</th>
                  <th className="px-4 py-2 text-right font-mono text-xs text-muted-foreground">PRICE</th>
                  <th className="px-4 py-2 text-right font-mono text-xs text-muted-foreground">CHANGE</th>
                  <th className="px-4 py-2 text-right font-mono text-xs text-muted-foreground">%</th>
                </tr>
              </thead>
              <tbody>
                {[...sectors]
                  .sort((a, b) => b.changePercent - a.changePercent)
                  .map((sector) => {
                    const isPositive = sector.change >= 0;
                    return (
                      <tr key={sector.symbol} className="border-b border-border last:border-b-0 hover:bg-secondary/20">
                        <td className="px-4 py-2 font-mono text-xs">{sector.name}</td>
                        <td className="px-4 py-2 text-right font-mono text-xs text-muted-foreground">{sector.symbol}</td>
                        <td className="px-4 py-2 text-right font-mono text-xs">${sector.price.toFixed(2)}</td>
                        <td className={`px-4 py-2 text-right font-mono text-xs ${isPositive ? 'text-gain' : 'text-loss'}`}>
                          {isPositive ? '+' : ''}{sector.change.toFixed(2)}
                        </td>
                        <td className={`px-4 py-2 text-right font-mono text-xs ${isPositive ? 'text-gain' : 'text-loss'}`}>
                          {isPositive ? '+' : ''}{sector.changePercent.toFixed(2)}%
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
