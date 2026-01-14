import { NextRequest, NextResponse } from 'next/server';
import { getOwnershipData } from '@/lib/market-api';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;

  try {
    const data = await getOwnershipData(symbol.toUpperCase());

    if (!data) {
      return NextResponse.json(
        { error: 'No ownership data available' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Ownership API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ownership data' },
      { status: 500 }
    );
  }
}
