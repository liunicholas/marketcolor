'use client';

import { useMemo } from 'react';
import type { EarningsEvent } from '@/types/calendar';
import { DayCell } from './day-cell';
import { Skeleton } from '@/components/ui/skeleton';

interface MonthGridProps {
  year: number;
  month: number; // 0-indexed (0 = January)
  events: EarningsEvent[];
  eventsByDate: Record<string, EarningsEvent[]>;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  isLoading?: boolean;
}

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function MonthGrid({
  year,
  month,
  eventsByDate,
  selectedDate,
  onSelectDate,
  isLoading,
}: MonthGridProps) {
  // Calculate days to display in the grid
  const days = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startDay = firstDayOfMonth.getDay(); // 0-6 (Sun-Sat)
    const daysInMonth = lastDayOfMonth.getDate();

    const today = new Date();
    const todayKey = formatDateKey(today);

    const gridDays: Array<{
      date: Date;
      dateKey: string;
      isCurrentMonth: boolean;
      isToday: boolean;
    }> = [];

    // Days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      const dateKey = formatDateKey(date);
      gridDays.push({
        date,
        dateKey,
        isCurrentMonth: false,
        isToday: dateKey === todayKey,
      });
    }

    // Days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = formatDateKey(date);
      gridDays.push({
        date,
        dateKey,
        isCurrentMonth: true,
        isToday: dateKey === todayKey,
      });
    }

    // Days from next month to fill the grid (6 rows max)
    const remainingDays = 42 - gridDays.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      const dateKey = formatDateKey(date);
      gridDays.push({
        date,
        dateKey,
        isCurrentMonth: false,
        isToday: dateKey === todayKey,
      });
    }

    return gridDays;
  }, [year, month]);

  if (isLoading) {
    return (
      <div className="border border-border">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="p-2 text-center font-mono text-xs text-muted-foreground bg-secondary/30 border-r border-border last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Loading grid */}
        <div className="grid grid-cols-7">
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="p-2 min-h-[60px] md:min-h-[80px] border-r border-b border-border last:border-r-0"
            >
              <Skeleton className="h-3 w-4 mb-2" />
              <Skeleton className="h-2 w-8" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="p-2 text-center font-mono text-xs text-muted-foreground bg-secondary/30 border-r border-border last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {days.map(({ date, dateKey, isCurrentMonth, isToday }) => (
          <DayCell
            key={dateKey}
            date={date}
            isCurrentMonth={isCurrentMonth}
            isToday={isToday}
            events={eventsByDate[dateKey] || []}
            isSelected={selectedDate === dateKey}
            onClick={() => onSelectDate(dateKey)}
          />
        ))}
      </div>
    </div>
  );
}
