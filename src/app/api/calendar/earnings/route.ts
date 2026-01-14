import { NextRequest, NextResponse } from 'next/server';
import { getEarningsCalendar } from '@/lib/finnhub-api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!from || !to) {
      return NextResponse.json(
        { error: 'Missing required parameters: from, to' },
        { status: 400 }
      );
    }

    const events = await getEarningsCalendar(from, to);
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching earnings calendar:', error);
    return NextResponse.json(
      { error: 'Failed to fetch earnings calendar' },
      { status: 500 }
    );
  }
}
