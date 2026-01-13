'use client';

import Link from 'next/link';
import { useMarketMovers } from '@/hooks/use-market-data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { PriceBadge } from '@/components/stock/price-badge';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface MoversTableProps {
  type: 'gainers' | 'losers' | 'active';
  limit?: number;
}

export function MoversTable({ type, limit = 10 }: MoversTableProps) {
  const { movers, isLoading, error } = useMarketMovers(type);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p className="text-sm">Failed to load market movers</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-card/50">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-md" />
              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    );
  }

  const displayMovers = movers.slice(0, limit);

  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-card/50 hover:bg-card/50">
            <TableHead className="font-semibold">Symbol</TableHead>
            <TableHead className="font-semibold hidden sm:table-cell">Company</TableHead>
            <TableHead className="text-right font-semibold">Price</TableHead>
            <TableHead className="text-right font-semibold">Change</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayMovers.map((stock, index) => {
            const isPositive = stock.change >= 0;
            return (
              <TableRow
                key={stock.symbol}
                className={`
                  group cursor-pointer transition-colors
                  hover:bg-secondary/50 animate-fade-up
                `}
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <TableCell>
                  <Link
                    href={`/stock/${stock.symbol}`}
                    className="flex items-center gap-3"
                  >
                    <div
                      className={`
                        flex h-8 w-8 items-center justify-center rounded-md
                        transition-colors
                        ${isPositive
                          ? 'bg-gain/10 text-gain'
                          : 'bg-loss/10 text-loss'
                        }
                      `}
                    >
                      {isPositive ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                    </div>
                    <span className="font-mono-numbers font-semibold">
                      {stock.symbol}
                    </span>
                  </Link>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Link
                    href={`/stock/${stock.symbol}`}
                    className="text-sm text-muted-foreground line-clamp-1 hover:text-foreground transition-colors"
                  >
                    {stock.name}
                  </Link>
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/stock/${stock.symbol}`}
                    className="font-mono-numbers font-medium"
                  >
                    ${stock.price.toFixed(2)}
                  </Link>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/stock/${stock.symbol}`}>
                    <PriceBadge
                      change={stock.change}
                      changePercent={stock.changePercent}
                      size="sm"
                    />
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/stock/${stock.symbol}`}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
