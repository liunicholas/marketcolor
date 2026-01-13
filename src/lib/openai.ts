import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  console.warn('Warning: OPENAI_API_KEY is not set. AI features will not work.');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function generateStockAnalysis(symbol: string, question?: string) {
  const response = await openai.responses.create({
    model: 'gpt-4o', // Using gpt-4o as fallback, will use gpt-5 when available
    tools: [{ type: 'web_search' as const }],
    input: `
You are an expert financial analyst. Analyze the stock ${symbol.toUpperCase()}.
${question ? `User question: ${question}` : ''}

Provide a comprehensive analysis including:

1. **Current Market Sentiment**: Recent price action and market perception
2. **Recent News & Developments**: Key events from the past week affecting the stock
3. **Fundamental Analysis**: Key metrics (P/E, revenue growth, margins, market position)
4. **Risks & Headwinds**: Potential challenges and downside risks
5. **Growth Opportunities**: Catalysts and upside potential
6. **Summary Recommendation**: Brief investment thesis

Use current web data to ensure accuracy. Be specific with numbers and cite sources.
Format your response in clear markdown with headers.
    `.trim(),
  });

  // Extract text content from response
  const textOutput = response.output.find(
    (item): item is OpenAI.Responses.ResponseOutputMessage => item.type === 'message'
  );

  // Extract citations from web search results
  const webSearchCalls = response.output.filter(
    (item): item is OpenAI.Responses.ResponseFunctionWebSearch => item.type === 'web_search_call'
  );

  const citations = webSearchCalls.flatMap(call =>
    ('results' in call && Array.isArray(call.results))
      ? call.results.map((r: { url?: string; title?: string }) => ({ url: r.url || '', title: r.title || '' }))
      : []
  );

  const content = textOutput?.content?.[0];
  const analysisText = content && 'text' in content ? content.text : '';

  return {
    analysis: analysisText,
    citations,
    generatedAt: new Date().toISOString(),
  };
}

export async function generateInvestmentThesis(symbol: string, stockData: {
  quote: Record<string, unknown>;
  profile?: Record<string, unknown>;
  news?: Array<{ title: string }>;
}) {
  // Industry Analysis
  const industryResponse = await openai.responses.create({
    model: 'gpt-4o',
    tools: [{ type: 'web_search' as const }],
    input: `
Analyze the industry and competitive position of ${symbol.toUpperCase()}.

Consider:
- Industry structure and growth trends
- Competitive landscape and market share
- Barriers to entry and moats
- Key competitors and differentiation

Company context: ${JSON.stringify(stockData.profile || {})}

Provide a concise analysis in 2-3 paragraphs with specific data points.
    `.trim(),
  });

  // Financial Analysis
  const financialResponse = await openai.responses.create({
    model: 'gpt-4o',
    tools: [{ type: 'web_search' as const }],
    input: `
Analyze the financial health and performance of ${symbol.toUpperCase()}.

Consider:
- Revenue growth trajectory
- Profitability metrics (margins, ROE, ROA)
- Balance sheet strength
- Cash flow generation
- Valuation relative to peers

Financial data: ${JSON.stringify(stockData.quote)}

Provide a concise analysis in 2-3 paragraphs with specific numbers.
    `.trim(),
  });

  // News & Sentiment Analysis
  const newsResponse = await openai.responses.create({
    model: 'gpt-4o',
    tools: [{ type: 'web_search' as const }],
    input: `
Analyze recent news and market sentiment for ${symbol.toUpperCase()}.

Recent headlines: ${stockData.news?.map(n => n.title).join('; ') || 'Search for recent news'}

Consider:
- Recent significant announcements
- Analyst sentiment and ratings
- Social/media sentiment
- Upcoming catalysts or events

Provide a concise analysis in 2-3 paragraphs.
    `.trim(),
  });

  // Final Thesis
  const getTextFromResponse = (response: OpenAI.Responses.Response) => {
    const textOutput = response.output.find(
      (item): item is OpenAI.Responses.ResponseOutputMessage => item.type === 'message'
    );
    const content = textOutput?.content?.[0];
    return content && 'text' in content ? content.text : '';
  };

  const industryAnalysis = getTextFromResponse(industryResponse);
  const financialAnalysis = getTextFromResponse(financialResponse);
  const newsAnalysis = getTextFromResponse(newsResponse);

  const thesisResponse = await openai.responses.create({
    model: 'gpt-4o',
    input: `
Based on the following analyses, synthesize a comprehensive investment thesis for ${symbol.toUpperCase()}:

## Industry Analysis
${industryAnalysis}

## Financial Analysis
${financialAnalysis}

## News & Sentiment
${newsAnalysis}

Create a final investment thesis that includes:
1. **Executive Summary**: 2-3 sentence overview
2. **Key Strengths**: Top 3 bullish points
3. **Key Risks**: Top 3 concerns
4. **Catalysts**: Near-term events that could move the stock
5. **Valuation View**: Is it attractive at current levels?
6. **Recommendation**: Buy/Hold/Sell with brief rationale

Be specific and actionable. Format in clear markdown.
    `.trim(),
  });

  return {
    industryAnalysis,
    financialAnalysis,
    newsAnalysis,
    finalThesis: getTextFromResponse(thesisResponse),
    generatedAt: new Date().toISOString(),
  };
}
