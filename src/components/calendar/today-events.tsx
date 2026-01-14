'use client';

import Link from 'next/link';
import { useTodayEvents } from '@/hooks/use-calendar-data';
import { cn } from '@/lib/utils';

interface TodayEventsWidgetProps {
  className?: string;
}

function formatHour(hour: 'bmo' | 'amc' | 'dmh'): string {
  switch (hour) {
    case 'bmo':
      return 'PRE';
    case 'amc':
      return 'POST';
    case 'dmh':
      return 'MKT';
  }
}

export function TodayEventsWidget({ className }: TodayEventsWidgetProps) {
  const { events, isLoading, error } = useTodayEvents();

  if (isLoading) {
    return (
      <div className={cn('border border-border overflow-hidden', className)}>
        <div className="flex items-center h-8 px-4">
          <span className="font-mono text-xs text-muted-foreground">
            Loading earnings...
          </span>
        </div>
      </div>
    );
  }

  if (error || events.length === 0) {
    return null; // Don't show widget if no earnings today
  }

  return (
    <div className={cn('border border-border overflow-hidden', className)}>
      <div className="flex items-center h-8">
        {/* Label */}
        <Link
          href="/calendar"
          className="flex-shrink-0 px-3 h-full flex items-center bg-secondary/30 border-r border-border font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          EARNINGS
        </Link>

        {/* Scrolling ticker */}
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee flex items-center gap-6 whitespace-nowrap">
            {/* Duplicate content for seamless loop */}
            {[...events, ...events].map((event, i) => (
              <Link
                key={`${event.id}-${i}`}
                href={`/stock/${event.symbol}`}
                className="inline-flex items-center gap-2 font-mono text-xs hover:text-foreground transition-colors"
              >
                <span className="text-muted-foreground">{formatHour(event.hour)}</span>
                <span className="text-foreground">{event.symbol}</span>
                {event.epsEstimate != null && (
                  <span className="text-muted-foreground">
                    Est: ${event.epsEstimate.toFixed(2)}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* View all link */}
        <Link
          href="/calendar"
          className="flex-shrink-0 px-3 h-full flex items-center border-l border-border font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {events.length} TODAY
        </Link>
      </div>
    </div>
  );
}
