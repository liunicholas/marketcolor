import { NextResponse } from 'next/server';
import { getCommodities } from '@/lib/market-api';

export async function GET() {
  try {
    const commodities = await getCommodities();
    return NextResponse.json(commodities);
  } catch (error) {
    console.error('Error fetching commodities:', error);
    return NextResponse.json({ error: 'Failed to fetch commodities' }, { status: 500 });
  }
}
