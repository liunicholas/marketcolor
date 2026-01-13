import { NextRequest, NextResponse } from 'next/server';
import { getStockQuote, getStockHistory, getStockProfile, getCompanyNews } from '@/lib/market-api';
import type { TimeRange } from '@/types/stock';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const { searchParams } = new URL(request.url);
  const range = (searchParams.get('range') || '1M') as TimeRange;
  const includeProfile = searchParams.get('profile') === 'true';
  const includeNews = searchParams.get('news') === 'true';

  try {
    const [quote, history] = await Promise.all([
      getStockQuote(symbol.toUpperCase()),
      getStockHistory(symbol.toUpperCase(), range),
    ]);

    const result: {
      quote: typeof quote;
      history: typeof history;
      profile?: Awaited<ReturnType<typeof getStockProfile>>;
      news?: Awaited<ReturnType<typeof getCompanyNews>>;
    } = { quote, history };

    if (includeProfile) {
      result.profile = await getStockProfile(symbol.toUpperCase());
    }

    if (includeNews) {
      result.news = await getCompanyNews(symbol.toUpperCase());
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Stock API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
}
