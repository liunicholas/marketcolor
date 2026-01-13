import { NextRequest } from 'next/server';
import { generateInvestmentThesisStream } from '@/lib/openai';
import { getStockQuote, getStockProfile, getCompanyNews } from '@/lib/market-api';

export async function POST(request: NextRequest) {
  try {
    const { symbol } = await request.json();

    if (!symbol) {
      return new Response(JSON.stringify({ error: 'Symbol is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'OpenAI API key is not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch stock data for context
    const [quote, profile, news] = await Promise.all([
      getStockQuote(symbol.toUpperCase()),
      getStockProfile(symbol.toUpperCase()),
      getCompanyNews(symbol.toUpperCase()),
    ]);

    const stream = await generateInvestmentThesisStream(symbol.toUpperCase(), {
      quote: quote as unknown as Record<string, unknown>,
      profile: profile as unknown as Record<string, unknown>,
      news,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            // Handle text delta events
            if (event.type === 'response.output_text.delta') {
              const delta = (event as { delta?: string }).delta;
              if (delta) {
                controller.enqueue(encoder.encode(delta));
              }
            }
          }
        } catch (error) {
          console.error('Stream error:', error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Thesis API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate investment thesis' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
