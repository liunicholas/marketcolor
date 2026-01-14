import { NextResponse } from 'next/server';
import { getHeatmapData } from '@/lib/market-api';

export async function GET() {
  try {
    const data = await getHeatmapData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Heatmap API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch heatmap data' },
      { status: 500 }
    );
  }
}
