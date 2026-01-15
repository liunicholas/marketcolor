'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkline } from '@/components/charts/sparkline';
import { useExtendedCurrencies } from '@/hooks/use-market-data';

const categories = [
  { value: 'all', label: 'ALL' },
  { value: 'majors', label: 'MAJORS' },
  { value: 'crosses', label: 'CROSSES' },
  { value: 'emerging', label: 'EMERGING' },
];

export default function CurrenciesPage() {
  const { currencies, isLoading, error } = useExtendedCurrencies();
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredCurrencies = activeCategory === 'all'
    ? currencies
    : currencies.filter(c => c.category === activeCategory);

  // Format forex price with appropriate decimals
  const formatForexPrice = (price: number, symbol: string) => {
    // JPY pairs typically have 2-3 decimals, others have 4-5
    const isJPYPair = symbol.includes('JPY');
    const decimals = isJPYPair ? 3 : 5;
    return price.toFixed(decimals);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="border border-border p-8 text-center">
          <p className="font-mono text-sm mb-4">ERROR: FAILED TO LOAD CURRENCIES DATA</p>
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
        <h1 className="font-mono text-xs text-muted-foreground mb-1">CURRENCIES</h1>
        <p className="font-mono text-xs text-muted-foreground">
          Major forex pairs and exchange rates
        </p>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-4">
        <TabsList className="w-full max-w-md grid grid-cols-4 h-8 p-0 bg-transparent border border-border">
          {categories.map((cat, index) => (
            <TabsTrigger
              key={cat.value}
              value={cat.value}
              className={`font-mono text-xs h-full rounded-none data-[state=active]:bg-secondary ${
                index < categories.length - 1 ? 'border-r border-border' : ''
              }`}
            >
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border border-border p-4">
              <div className="h-3 w-24 bg-secondary animate-pulse mb-3" />
              <div className="h-6 w-20 bg-secondary animate-pulse mb-2" />
              <div className="h-3 w-16 bg-secondary animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCurrencies.map((currency) => {
            const isPositive = currency.change >= 0;
            return (
              <Link
                key={currency.symbol}
                href={`/stock/${encodeURIComponent(currency.symbol)}`}
                className="border border-border p-4 hover:bg-secondary/30 transition-colors block"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="block text-xs text-muted-foreground mb-1">
                      {currency.name}
                    </span>
                    <span className="block font-mono text-[10px] text-muted-foreground uppercase">
                      {currency.category}
                    </span>
                  </div>
                  {currency.sparkline && currency.sparkline.length > 1 && (
                    <Sparkline
                      data={currency.sparkline}
                      positive={isPositive}
                      width={60}
                      height={24}
                    />
                  )}
                </div>
                <div className="flex items-end justify-between">
                  <span className="font-mono text-lg text-foreground">
                    {formatForexPrice(currency.price, currency.symbol)}
                  </span>
                  <div className="text-right">
                    <span className={`block font-mono text-sm ${isPositive ? 'text-gain' : 'text-loss'}`}>
                      {isPositive ? '+' : ''}{currency.change.toFixed(4)}
                    </span>
                    <span className={`block font-mono text-xs ${isPositive ? 'text-gain' : 'text-loss'}`}>
                      {isPositive ? '+' : ''}{currency.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Summary Table */}
      {!isLoading && currencies.length > 0 && (
        <div className="mt-6 border border-border">
          <div className="px-4 py-2 border-b border-border bg-secondary/30">
            <span className="font-mono text-xs text-muted-foreground">SUMMARY</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-2 text-left font-mono text-xs text-muted-foreground">PAIR</th>
                  <th className="px-4 py-2 text-left font-mono text-xs text-muted-foreground">CATEGORY</th>
                  <th className="px-4 py-2 text-right font-mono text-xs text-muted-foreground">RATE</th>
                  <th className="px-4 py-2 text-right font-mono text-xs text-muted-foreground">CHANGE</th>
                  <th className="px-4 py-2 text-right font-mono text-xs text-muted-foreground">%</th>
                </tr>
              </thead>
              <tbody>
                {[...currencies]
                  .sort((a, b) => {
                    // Sort by category first, then by change percent within category
                    if (a.category !== b.category) {
                      return (a.category || '').localeCompare(b.category || '');
                    }
                    return b.changePercent - a.changePercent;
                  })
                  .map((currency) => {
                    const isPositive = currency.change >= 0;
                    return (
                      <tr key={currency.symbol} className="border-b border-border last:border-b-0 hover:bg-secondary/20">
                        <td className="px-4 py-2 font-mono text-xs">{currency.name}</td>
                        <td className="px-4 py-2 font-mono text-xs text-muted-foreground uppercase">{currency.category}</td>
                        <td className="px-4 py-2 text-right font-mono text-xs">{formatForexPrice(currency.price, currency.symbol)}</td>
                        <td className={`px-4 py-2 text-right font-mono text-xs ${isPositive ? 'text-gain' : 'text-loss'}`}>
                          {isPositive ? '+' : ''}{currency.change.toFixed(4)}
                        </td>
                        <td className={`px-4 py-2 text-right font-mono text-xs ${isPositive ? 'text-gain' : 'text-loss'}`}>
                          {isPositive ? '+' : ''}{currency.changePercent.toFixed(2)}%
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
