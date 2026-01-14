'use client';

import Link from 'next/link';
import type { EarningsEvent } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface EventItemProps {
  event: EarningsEvent;
  compact?: boolean;
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

export function EventItem({ event, compact = false }: EventItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-2',
        compact ? 'py-2' : 'py-3'
      )}
    >
      {/* Hour indicator */}
      <span className="font-mono text-xs text-muted-foreground w-12 flex-shrink-0">
        {formatHour(event.hour)}
      </span>

      {/* Symbol (linked) */}
      <Link
        href={`/stock/${event.symbol}`}
        className="font-mono text-xs text-foreground hover:underline flex-shrink-0"
      >
        {event.symbol}
      </Link>

      {/* Spacer */}
      <span className="flex-1" />

      {/* EPS estimate/actual */}
      {(event.epsActual != null || event.epsEstimate != null) && (
        <span className="font-mono text-xs text-muted-foreground flex-shrink-0">
          {event.epsActual != null ? (
            <>
              EPS: <span className="text-foreground">${event.epsActual.toFixed(2)}</span>
            </>
          ) : event.epsEstimate != null ? (
            <>Est: ${event.epsEstimate.toFixed(2)}</>
          ) : null}
        </span>
      )}
    </div>
  );
}
