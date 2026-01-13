'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/', label: 'HOME' },
  { href: '/#markets', label: 'MARKETS' },
  { href: '/#movers', label: 'MOVERS' },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Dispatch custom event to focus inline search
        window.dispatchEvent(new CustomEvent('focus-search'));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    // Handle hash navigation with smooth scroll
    if (href.startsWith('/#')) {
      const hash = href.slice(1);
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const focusSearch = () => {
    window.dispatchEvent(new CustomEvent('focus-search'));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container mx-auto flex h-12 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="font-mono text-sm font-bold tracking-tight">
          MARKETCOLOR
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => handleNavClick(item.href)}
              className="font-mono text-xs tracking-wide text-muted-foreground hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Search Button */}
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground font-mono text-xs h-7 px-2"
            onClick={focusSearch}
          >
            SEARCH
            <kbd className="hidden lg:inline font-mono text-[10px] text-muted-foreground">
              [K]
            </kbd>
          </Button>

          {/* Mobile Search */}
          <Button
            variant="ghost"
            size="sm"
            className="sm:hidden font-mono text-xs h-7 px-2"
            onClick={focusSearch}
          >
            [S]
          </Button>

          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-muted-foreground hover:text-foreground font-mono text-xs h-7 px-2"
            >
              {theme === 'dark' ? 'LIGHT' : 'DARK'}
            </Button>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden font-mono text-xs h-7 px-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '[X]' : '[=]'}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container mx-auto px-4 py-2 flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleNavClick(item.href)}
                className="py-2 font-mono text-xs tracking-wide text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
