import { NextResponse } from 'next/server';
import { getFutures } from '@/lib/market-api';

export async function GET() {
  try {
    const futures = await getFutures();
    return NextResponse.json(futures);
  } catch (error) {
    console.error('Error fetching futures:', error);
    return NextResponse.json({ error: 'Failed to fetch futures' }, { status: 500 });
  }
}
