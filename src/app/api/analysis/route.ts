import { NextRequest, NextResponse } from 'next/server';
import { generateStockAnalysis } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { symbol, question } = await request.json();

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

    const analysis = await generateStockAnalysis(symbol.toUpperCase(), question);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Analysis API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate analysis' },
      { status: 500 }
    );
  }
}
