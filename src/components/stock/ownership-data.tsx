'use client';

import { useOwnershipData } from '@/hooks/use-stock-data';

interface OwnershipDataProps {
  symbol: string;
}

function formatLargeNumber(num: number | undefined): string {
  if (num === undefined || num === null) return '-';
  if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
  return `$${num.toLocaleString()}`;
}

function formatShares(num: number | undefined): string {
  if (num === undefined || num === null) return '-';
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(0)}K`;
  return num.toLocaleString();
}

function formatPercent(num: number | undefined): string {
  if (num === undefined || num === null) return '-';
  return `${(num * 100).toFixed(2)}%`;
}

export function OwnershipData({ symbol }: OwnershipDataProps) {
  const { data, isLoading, error } = useOwnershipData(symbol);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="border border-border p-3">
          <div className="h-4 w-32 bg-secondary animate-pulse mb-3" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-secondary animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="border border-border p-3">
        <span className="font-mono text-xs text-muted-foreground">
          No ownership data available
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Institutional Holders */}
      {data.institutionalHolders.length > 0 && (
        <div className="border border-border">
          <div className="px-3 py-1.5 border-b border-border bg-secondary/30">
            <span className="font-mono text-xs text-muted-foreground">
              TOP INSTITUTIONAL HOLDERS
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="border-b border-border bg-secondary/20">
                  <th className="text-left px-3 py-2 text-muted-foreground font-normal">Institution</th>
                  <th className="text-right px-3 py-2 text-muted-foreground font-normal">Shares</th>
                  <th className="text-right px-3 py-2 text-muted-foreground font-normal">% Held</th>
                  <th className="text-right px-3 py-2 text-muted-foreground font-normal">Value</th>
                  <th className="text-right px-3 py-2 text-muted-foreground font-normal">Report Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.institutionalHolders.map((holder, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2 truncate max-w-[200px]">{holder.organization}</td>
                    <td className="text-right px-3 py-2">{formatShares(holder.position)}</td>
                    <td className="text-right px-3 py-2">{formatPercent(holder.pctHeld)}</td>
                    <td className="text-right px-3 py-2">{formatLargeNumber(holder.value)}</td>
                    <td className="text-right px-3 py-2 text-muted-foreground">{holder.reportDate || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Insider Holders */}
      {data.insiderHolders.length > 0 && (
        <div className="border border-border">
          <div className="px-3 py-1.5 border-b border-border bg-secondary/30">
            <span className="font-mono text-xs text-muted-foreground">
              KEY INSIDERS
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="border-b border-border bg-secondary/20">
                  <th className="text-left px-3 py-2 text-muted-foreground font-normal">Name</th>
                  <th className="text-left px-3 py-2 text-muted-foreground font-normal">Relation</th>
                  <th className="text-right px-3 py-2 text-muted-foreground font-normal">Shares Held</th>
                  <th className="text-left px-3 py-2 text-muted-foreground font-normal">Latest Transaction</th>
                  <th className="text-right px-3 py-2 text-muted-foreground font-normal">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.insiderHolders.map((holder, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2 truncate max-w-[150px]">{holder.name}</td>
                    <td className="px-3 py-2 truncate max-w-[150px] text-muted-foreground">{holder.relation}</td>
                    <td className="text-right px-3 py-2">{formatShares(holder.positionDirect)}</td>
                    <td className="px-3 py-2 truncate max-w-[150px]">{holder.transactionDescription || '-'}</td>
                    <td className="text-right px-3 py-2 text-muted-foreground">{holder.latestTransDate || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
