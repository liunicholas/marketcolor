import { NextResponse } from 'next/server';
import { getSectorETFs } from '@/lib/market-api';

export async function GET() {
  try {
    const sectors = await getSectorETFs();
    return NextResponse.json(sectors);
  } catch (error) {
    console.error('Error fetching sector ETFs:', error);
    return NextResponse.json({ error: 'Failed to fetch sector ETFs' }, { status: 500 });
  }
}
