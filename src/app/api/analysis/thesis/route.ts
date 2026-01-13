import { NextRequest, NextResponse } from 'next/server';
import { generateInvestmentThesis } from '@/lib/openai';
import { getStockQuote, getStockProfile, getCompanyNews } from '@/lib/market-api';

export async function POST(request: NextRequest) {
  try {
    const { symbol } = await request.json();

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Fetch stock data for context
    const [quote, profile, news] = await Promise.all([
      getStockQuote(symbol.toUpperCase()),
      getStockProfile(symbol.toUpperCase()),
      getCompanyNews(symbol.toUpperCase()),
    ]);

    const thesis = await generateInvestmentThesis(symbol.toUpperCase(), {
      quote: quote as unknown as Record<string, unknown>,
      profile: profile as unknown as Record<string, unknown>,
      news,
    });

    return NextResponse.json(thesis);
  } catch (error) {
    console.error('Thesis API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate investment thesis' },
      { status: 500 }
    );
  }
}
