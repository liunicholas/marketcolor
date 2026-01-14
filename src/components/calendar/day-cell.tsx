'use client';

import type { EarningsEvent } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface DayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: EarningsEvent[];
  isSelected: boolean;
  onClick: () => void;
}

export function DayCell({
  date,
  isCurrentMonth,
  isToday,
  events,
  isSelected,
  onClick,
}: DayCellProps) {
  const dayNumber = date.getDate();
  const hasEvents = events.length > 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative p-2 min-h-[60px] md:min-h-[80px] text-left transition-colors border-r border-b border-border',
        'hover:bg-secondary/30',
        !isCurrentMonth && 'bg-secondary/10 text-muted-foreground',
        isSelected && 'bg-secondary/50',
        isToday && 'ring-1 ring-inset ring-foreground'
      )}
    >
      {/* Day number */}
      <span
        className={cn(
          'font-mono text-xs block mb-1',
          isToday && 'font-bold',
          !isCurrentMonth && 'text-muted-foreground/50'
        )}
      >
        {dayNumber}
      </span>

      {/* Event indicators */}
      {hasEvents && (
        <div className="flex flex-wrap gap-0.5">
          {Array.from({ length: Math.min(events.length, 4) }).map((_, i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
            />
          ))}
          {events.length > 4 && (
            <span className="font-mono text-[8px] text-muted-foreground">
              +{events.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Event count on larger screens */}
      {hasEvents && (
        <span className="hidden md:block font-mono text-[10px] text-muted-foreground mt-1">
          {events.length} earning{events.length !== 1 ? 's' : ''}
        </span>
      )}
    </button>
  );
}
