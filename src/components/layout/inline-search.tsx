'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';
import { useStockSearch } from '@/hooks/use-stock-data';

const popularStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
];

export function InlineSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 150);
  const { results, isLoading } = useStockSearch(debouncedQuery);

  const displayResults = query.length > 0 ? results : popularStocks;
  const showDropdown = isFocused && displayResults.length > 0;

  const handleSelect = useCallback((symbol: string) => {
    router.push(`/stock/${symbol}`);
    setQuery('');
    setIsFocused(false);
    inputRef.current?.blur();
  }, [router]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, displayResults.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (displayResults[selectedIndex]) {
          handleSelect(displayResults[selectedIndex].symbol);
        }
        break;
      case 'Escape':
        setIsFocused(false);
        inputRef.current?.blur();
        break;
    }
  }, [showDropdown, displayResults, selectedIndex, handleSelect]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Listen for focus-search custom event
  useEffect(() => {
    const handleFocusSearch = () => {
      inputRef.current?.focus();
      // Scroll to top to make search visible
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('focus-search', handleFocusSearch);
    return () => window.removeEventListener('focus-search', handleFocusSearch);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search symbol or company..."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="w-full h-10 px-4 font-mono text-sm bg-background border border-border focus:border-muted-foreground outline-none placeholder:text-muted-foreground"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isLoading && (
            <span className="font-mono text-xs text-muted-foreground">...</span>
          )}
          <kbd className="hidden sm:inline-flex font-mono text-xs text-muted-foreground border border-border px-1.5 py-0.5">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Results Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 border border-border bg-background z-50 max-h-[300px] overflow-y-auto">
          {!query && (
            <div className="px-3 py-2 border-b border-border">
              <span className="font-mono text-xs text-muted-foreground">POPULAR</span>
            </div>
          )}
          {query && results.length > 0 && (
            <div className="px-3 py-2 border-b border-border">
              <span className="font-mono text-xs text-muted-foreground">RESULTS</span>
            </div>
          )}
          {displayResults.map((stock, index) => (
            <button
              key={stock.symbol}
              onClick={() => handleSelect(stock.symbol)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`w-full flex items-center gap-4 px-4 py-2 font-mono text-sm text-left hover:bg-secondary/50 ${
                index === selectedIndex ? 'bg-secondary' : ''
              }`}
            >
              <span className="font-bold">{stock.symbol}</span>
              <span className="text-xs text-muted-foreground truncate">{stock.name}</span>
            </button>
          ))}
          {query && results.length === 0 && !isLoading && (
            <div className="px-4 py-8 text-center">
              <span className="font-mono text-sm text-muted-foreground">NO RESULTS</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
