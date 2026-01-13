import { NextRequest } from 'next/server';
import { generateStockAnalysisStream } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { symbol, question } = await request.json();

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

    const stream = await generateStockAnalysisStream(symbol.toUpperCase(), question);

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
    console.error('Analysis API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate analysis' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
