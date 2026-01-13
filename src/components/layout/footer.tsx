import { TrendingUp } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500/80 to-emerald-500/80">
              <TrendingUp className="h-3 w-3 text-white" />
            </div>
            <span className="font-mono-numbers text-sm font-semibold">
              Market<span className="text-cyan-500">Color</span>
            </span>
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground text-center sm:text-right">
            &copy; {new Date().getFullYear()} MarketColor. Market data for informational purposes only.
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> · </span>
            Not financial advice.
          </p>
        </div>

        {/* Data Attribution */}
        <div className="mt-6 pt-6 border-t border-border/30">
          <p className="text-[10px] text-muted-foreground/60 text-center leading-relaxed">
            Market data provided by Yahoo Finance. AI analysis powered by OpenAI.
            Real-time quotes may be delayed. Past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </footer>
  );
}
