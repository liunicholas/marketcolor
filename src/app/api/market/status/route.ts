import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

export async function GET() {
  try {
    const quote = await yahooFinance.quote('^GSPC') as { marketState?: string };

    return Response.json({
      state: quote.marketState || 'CLOSED',
    });
  } catch {
    return Response.json({
      state: 'CLOSED',
    });
  }
}
