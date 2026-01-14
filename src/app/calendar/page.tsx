'use client';

import Link from 'next/link';
import { CalendarViewComponent } from '@/components/calendar/calendar-view';

export default function CalendarPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back link */}
      <Link
        href="/"
        className="inline-block mb-6 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        &larr; BACK TO HOME
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-mono text-lg font-bold mb-1">MARKET CALENDAR</h1>
        <p className="font-mono text-xs text-muted-foreground">
          Upcoming earnings reports and announcements
        </p>
      </div>

      {/* Calendar */}
      <CalendarViewComponent />
    </div>
  );
}
