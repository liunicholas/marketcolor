import { NextResponse } from 'next/server';
import { getMarketIndices } from '@/lib/market-api';

export async function GET() {
  try {
    const indices = await getMarketIndices();
    return NextResponse.json(indices);
  } catch (error) {
    console.error('Market indices API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market indices' },
      { status: 500 }
    );
  }
}
