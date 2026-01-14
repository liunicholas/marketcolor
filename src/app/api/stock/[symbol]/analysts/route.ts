import { NextRequest, NextResponse } from 'next/server';
import { getAnalystData } from '@/lib/market-api';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;

  try {
    const data = await getAnalystData(symbol.toUpperCase());

    if (!data) {
      return NextResponse.json(
        { error: 'No analyst data available' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Analyst API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analyst data' },
      { status: 500 }
    );
  }
}
