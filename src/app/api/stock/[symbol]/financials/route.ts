import { NextRequest, NextResponse } from 'next/server';
import { getFinancialStatements } from '@/lib/market-api';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;

  try {
    const data = await getFinancialStatements(symbol.toUpperCase());

    if (!data) {
      return NextResponse.json(
        { error: 'No financial data available' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Financials API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch financial data' },
      { status: 500 }
    );
  }
}
