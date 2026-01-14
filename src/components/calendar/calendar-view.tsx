'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useMonthEvents } from '@/hooks/use-calendar-data';
import { MonthGrid } from './month-grid';
import { EventList } from './event-list';
import type { CalendarView } from '@/types/calendar';
import { cn } from '@/lib/utils';

const MONTH_NAMES = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
];

export function CalendarViewComponent() {
  const today = new Date();
  const [view, setView] = useState<CalendarView>('month');
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { events, eventsByDate, isLoading, error } = useMonthEvents(
    currentYear,
    currentMonth
  );

  // Get events for selected date or all events for agenda view
  const displayEvents = useMemo(() => {
    if (view === 'agenda') {
      return events;
    }
    if (selectedDate && eventsByDate[selectedDate]) {
      return eventsByDate[selectedDate];
    }
    return [];
  }, [view, selectedDate, events, eventsByDate]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
  };

  const handleToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDate(today.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Month/Year Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevMonth}
            className="font-mono text-xs h-7 px-2"
          >
            PREV
          </Button>

          <span className="font-mono text-sm min-w-[160px] text-center">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextMonth}
            className="font-mono text-xs h-7 px-2"
          >
            NEXT
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleToday}
            className="font-mono text-xs h-7 px-2 ml-2"
          >
            TODAY
          </Button>
        </div>

        {/* View Switcher */}
        <div className="flex border border-border">
          <button
            onClick={() => setView('month')}
            className={cn(
              'px-3 py-1.5 font-mono text-xs transition-colors border-r border-border',
              view === 'month'
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            MONTH
          </button>
          <button
            onClick={() => setView('agenda')}
            className={cn(
              'px-3 py-1.5 font-mono text-xs transition-colors',
              view === 'agenda'
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            AGENDA
          </button>
        </div>
      </div>

      {/* Calendar Content */}
      {view === 'month' ? (
        <div className="grid lg:grid-cols-[1fr_350px] gap-4">
          {/* Month Grid */}
          <MonthGrid
            year={currentYear}
            month={currentMonth}
            events={events}
            eventsByDate={eventsByDate}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            isLoading={isLoading}
          />

          {/* Selected Day Events */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            {selectedDate ? (
              <EventList
                events={displayEvents}
                title={`EVENTS - ${formatSelectedDate(selectedDate)}`}
                emptyMessage="No events on this day"
              />
            ) : (
              <div className="border border-border">
                <div className="px-4 py-2 border-b border-border bg-secondary/30">
                  <span className="font-mono text-xs text-muted-foreground">
                    EVENTS
                  </span>
                </div>
                <div className="px-4 py-6 text-center font-mono text-xs text-muted-foreground">
                  Select a day to view events
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Agenda View */
        <EventList
          events={events}
          isLoading={isLoading}
          error={error}
          title="UPCOMING EVENTS"
          emptyMessage="No events this month"
        />
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border">
        <span className="font-mono text-xs text-muted-foreground">
          PRE = Before Market Open | MKT = During Market | POST = After Market Close
        </span>
      </div>
    </div>
  );
}

function formatSelectedDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return date
    .toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
    .toUpperCase();
}
