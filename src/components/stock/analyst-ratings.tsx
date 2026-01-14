'use client';

import { useAnalystData } from '@/hooks/use-stock-data';
import { cn } from '@/lib/utils';

interface AnalystRatingsProps {
  symbol: string;
}

export function AnalystRatings({ symbol }: AnalystRatingsProps) {
  const { data, isLoading, error } = useAnalystData(symbol);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="border border-border p-3">
          <div className="h-4 w-32 bg-secondary animate-pulse mb-3" />
          <div className="h-6 bg-secondary animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="border border-border p-3">
        <span className="font-mono text-xs text-muted-foreground">
          No analyst data available
        </span>
      </div>
    );
  }

  // Get current period recommendations (usually "0m" for current month)
  const recommendations = data.recommendations || [];
  const upgradeHistory = data.upgradeDowngradeHistory || [];
  const current = recommendations.find(r => r.period === '0m') || recommendations[0];
  const total = current
    ? current.strongBuy + current.buy + current.hold + current.sell + current.strongSell
    : 0;

  if (!current && upgradeHistory.length === 0) {
    return (
      <div className="border border-border p-3">
        <span className="font-mono text-xs text-muted-foreground">
          No analyst data available for this security
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Recommendation Distribution */}
      {current && total > 0 && (
        <div className="border border-border">
          <div className="px-3 py-1.5 border-b border-border bg-secondary/30">
            <span className="font-mono text-xs text-muted-foreground">
              ANALYST RECOMMENDATIONS ({total} analysts)
            </span>
          </div>
          <div className="p-3 space-y-3">
            {/* Distribution Bar */}
            <div className="flex h-4 overflow-hidden rounded-sm">
              {current.strongBuy > 0 && (
                <div
                  className="bg-gain"
                  style={{ width: `${(current.strongBuy / total) * 100}%` }}
                  title={`Strong Buy: ${current.strongBuy}`}
                />
              )}
              {current.buy > 0 && (
                <div
                  className="bg-gain/60"
                  style={{ width: `${(current.buy / total) * 100}%` }}
                  title={`Buy: ${current.buy}`}
                />
              )}
              {current.hold > 0 && (
                <div
                  className="bg-muted-foreground/40"
                  style={{ width: `${(current.hold / total) * 100}%` }}
                  title={`Hold: ${current.hold}`}
                />
              )}
              {current.sell > 0 && (
                <div
                  className="bg-loss/60"
                  style={{ width: `${(current.sell / total) * 100}%` }}
                  title={`Sell: ${current.sell}`}
                />
              )}
              {current.strongSell > 0 && (
                <div
                  className="bg-loss"
                  style={{ width: `${(current.strongSell / total) * 100}%` }}
                  title={`Strong Sell: ${current.strongSell}`}
                />
              )}
            </div>

            {/* Legend */}
            <div className="flex justify-between font-mono text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gain rounded-sm" />
                <span>Strong Buy ({current.strongBuy})</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gain/60 rounded-sm" />
                <span>Buy ({current.buy})</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-muted-foreground/40 rounded-sm" />
                <span>Hold ({current.hold})</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-loss/60 rounded-sm" />
                <span>Sell ({current.sell})</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-loss rounded-sm" />
                <span>Strong Sell ({current.strongSell})</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upgrades/Downgrades History */}
      {upgradeHistory.length > 0 && (
        <div className="border border-border">
          <div className="px-3 py-1.5 border-b border-border bg-secondary/30">
            <span className="font-mono text-xs text-muted-foreground">
              RECENT UPGRADES / DOWNGRADES
            </span>
          </div>
          <div className="divide-y divide-border">
            {upgradeHistory.slice(0, 10).map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-3 py-2 font-mono text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground w-20">{item.date}</span>
                  <span className="w-32 truncate">{item.firm}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.fromGrade && (
                    <>
                      <span className="text-muted-foreground">{item.fromGrade}</span>
                      <span className="text-muted-foreground">→</span>
                    </>
                  )}
                  <span
                    className={cn(
                      item.action === 'up' && 'text-gain',
                      item.action === 'down' && 'text-loss',
                      item.action === 'init' && 'text-foreground',
                      item.action === 'main' && 'text-muted-foreground'
                    )}
                  >
                    {item.toGrade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
