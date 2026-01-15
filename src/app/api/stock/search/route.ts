import { NextRequest, NextResponse } from 'next/server';
import { searchStocks } from '@/lib/market-api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 1) {
    return NextResponse.json([]);
  }

  // Cache headers for faster subsequent requests
  const cacheHeaders = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  };

  try {
    const results = await searchStocks(query);
    return NextResponse.json(results, { headers: cacheHeaders });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search stocks' },
      { status: 500 }
    );
  }
}
