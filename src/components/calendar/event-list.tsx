'use client';

import type { EarningsEvent } from '@/types/calendar';
import { EventItem } from './event-item';
import { Skeleton } from '@/components/ui/skeleton';

interface EventListProps {
  events: EarningsEvent[];
  isLoading?: boolean;
  error?: Error | null;
  title?: string;
  emptyMessage?: string;
}

function formatDateHeader(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00'); // Noon to avoid timezone issues
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = date.toDateString() === today.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();

  if (isToday) return `TODAY - ${monthDay}`;
  if (isTomorrow) return `TOMORROW - ${monthDay}`;
  return `${dayName} - ${monthDay}`;
}

export function EventList({
  events,
  isLoading,
  error,
  title,
  emptyMessage = 'No events scheduled',
}: EventListProps) {
  // Group events by date
  const eventsByDate = events.reduce(
    (acc, event) => {
      const date = event.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    },
    {} as Record<string, EarningsEvent[]>
  );

  // Sort dates
  const sortedDates = Object.keys(eventsByDate).sort();

  if (isLoading) {
    return (
      <div className="border border-border">
        {title && (
          <div className="px-4 py-2 border-b border-border bg-secondary/30">
            <span className="font-mono text-xs text-muted-foreground">{title}</span>
          </div>
        )}
        <div className="divide-y divide-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-4 py-3 flex items-center gap-3">
              <Skeleton className="w-1.5 h-1.5 rounded-full" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 flex-1 max-w-48" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-border">
        {title && (
          <div className="px-4 py-2 border-b border-border bg-secondary/30">
            <span className="font-mono text-xs text-muted-foreground">{title}</span>
          </div>
        )}
        <div className="px-4 py-6 text-center font-mono text-xs text-muted-foreground">
          Unable to load events
        </div>
      </div>
    );
  }

  if (sortedDates.length === 0) {
    return (
      <div className="border border-border">
        {title && (
          <div className="px-4 py-2 border-b border-border bg-secondary/30">
            <span className="font-mono text-xs text-muted-foreground">{title}</span>
          </div>
        )}
        <div className="px-4 py-6 text-center font-mono text-xs text-muted-foreground">
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border">
      {title && (
        <div className="px-4 py-2 border-b border-border bg-secondary/30">
          <span className="font-mono text-xs text-muted-foreground">{title}</span>
        </div>
      )}

      {sortedDates.map((date) => (
        <div key={date}>
          {/* Date header */}
          <div className="px-4 py-2 bg-secondary/20 border-b border-border">
            <span className="font-mono text-xs text-muted-foreground">
              {formatDateHeader(date)}
            </span>
          </div>

          {/* Events for this date */}
          <div className="divide-y divide-border">
            {eventsByDate[date].map((event) => (
              <EventItem key={event.id} event={event} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
