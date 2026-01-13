'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useDebounce } from '@/hooks/use-debounce';
import { useStockSearch } from '@/hooks/use-stock-data';
import { Search, TrendingUp, Building2, Loader2 } from 'lucide-react';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { results, isLoading } = useStockSearch(debouncedQuery);

  // Popular stocks for quick access
  const popularStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
  ];

  const handleSelect = useCallback((symbol: string) => {
    router.push(`/stock/${symbol}`);
    onOpenChange(false);
    setQuery('');
  }, [router, onOpenChange]);

  // Reset query when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery('');
    }
  }, [open]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div className="flex items-center border-b border-border px-3">
        <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
        <CommandInput
          placeholder="Search stocks by symbol or name..."
          value={query}
          onValueChange={setQuery}
          className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        />
        {isLoading && (
          <Loader2 className="ml-2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>
      <CommandList className="max-h-[400px]">
        <CommandEmpty className="py-12 text-center">
          <div className="flex flex-col items-center gap-2">
            <Building2 className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No stocks found.</p>
            <p className="text-xs text-muted-foreground/60">
              Try searching for a different symbol or company name.
            </p>
          </div>
        </CommandEmpty>

        {/* Search Results */}
        {results.length > 0 && (
          <CommandGroup heading="Search Results">
            {results.map((stock) => (
              <CommandItem
                key={stock.symbol}
                value={`${stock.symbol} ${stock.name}`}
                onSelect={() => handleSelect(stock.symbol)}
                className="flex items-center justify-between gap-2 px-4 py-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary">
                    <TrendingUp className="h-4 w-4 text-cyan-500" />
                  </div>
                  <div>
                    <p className="font-mono-numbers font-semibold text-sm">
                      {stock.symbol}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {stock.name}
                    </p>
                  </div>
                </div>
                <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
                  Enter
                </kbd>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Popular Stocks (when no search) */}
        {!query && (
          <CommandGroup heading="Popular Stocks">
            {popularStocks.map((stock) => (
              <CommandItem
                key={stock.symbol}
                value={`${stock.symbol} ${stock.name}`}
                onSelect={() => handleSelect(stock.symbol)}
                className="flex items-center justify-between gap-2 px-4 py-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary">
                    <TrendingUp className="h-4 w-4 text-cyan-500" />
                  </div>
                  <div>
                    <p className="font-mono-numbers font-semibold text-sm">
                      {stock.symbol}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stock.name}
                    </p>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border bg-muted px-1">↑↓</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border bg-muted px-1">↵</kbd>
            Select
          </span>
        </div>
        <span className="flex items-center gap-1">
          <kbd className="rounded border border-border bg-muted px-1">esc</kbd>
          Close
        </span>
      </div>
    </CommandDialog>
  );
}
