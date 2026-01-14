import { NextRequest, NextResponse } from 'next/server';
import { getOptionsChain } from '@/lib/market-api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const { searchParams } = new URL(request.url);
  const expiration = searchParams.get('expiration') || undefined;

  try {
    const data = await getOptionsChain(symbol.toUpperCase(), expiration);

    if (!data) {
      return NextResponse.json(
        { error: 'No options data available' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Options API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch options data' },
      { status: 500 }
    );
  }
}
