import { NextRequest, NextResponse } from 'next/server';
import { getMarketMovers } from '@/lib/market-api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') as 'gainers' | 'losers' | 'active' | null;
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  try {
    const movers = await getMarketMovers(type || 'gainers', offset, limit);
    return NextResponse.json(movers);
  } catch (error) {
    console.error('Market movers API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market movers' },
      { status: 500 }
    );
  }
}
