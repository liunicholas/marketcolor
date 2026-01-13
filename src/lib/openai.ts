import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  console.warn('Warning: OPENAI_API_KEY is not set. AI features will not work.');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Streaming version for AI Analysis (Q&A)
export function generateStockAnalysisStream(symbol: string, question?: string) {
  return openai.responses.create({
    model: 'gpt-5',
    tools: [{ type: 'web_search' as const }],
    stream: true,
    input: `
You are an expert financial analyst. Analyze the stock ${symbol.toUpperCase()}.
${question ? `User question: ${question}` : 'Provide a general analysis.'}

Provide a focused analysis addressing the question. Include:
- Current price context and recent performance
- Relevant fundamentals and metrics
- Key factors affecting the stock
- Your assessment

Use current web data to ensure accuracy. Be specific with numbers.
Format your response in clear markdown.
    `.trim(),
  });
}

// Streaming version for Investment Thesis (comprehensive report)
export function generateInvestmentThesisStream(symbol: string, stockData: {
  quote: Record<string, unknown>;
  profile?: Record<string, unknown>;
}) {
  return openai.responses.create({
    model: 'gpt-5',
    tools: [{ type: 'web_search' as const }],
    stream: true,
    input: `
You are an expert financial analyst. Create a comprehensive investment thesis for ${symbol.toUpperCase()}.

Company data: ${JSON.stringify(stockData.quote)}
Profile: ${JSON.stringify(stockData.profile || {})}

Provide a complete investment thesis covering:

## Executive Summary
Brief 2-3 sentence overview of the investment case.

## Industry & Competitive Position
- Industry structure and growth trends
- Competitive landscape and market share
- Barriers to entry and economic moats
- Key competitors and differentiation

## Financial Analysis
- Revenue growth trajectory
- Profitability metrics (margins, ROE, ROA)
- Balance sheet strength and cash flow generation
- Valuation relative to peers and historical averages

## News & Sentiment
- Recent significant announcements
- Analyst ratings and price targets
- Upcoming catalysts or events

## Key Strengths
Top 3 bullish points with specific evidence.

## Key Risks
Top 3 concerns with specific evidence.

## Recommendation
Buy/Hold/Sell recommendation with clear rationale and price target if applicable.

Use current web data. Be specific with numbers and cite sources.
Format in clear markdown with headers.
    `.trim(),
  });
}
