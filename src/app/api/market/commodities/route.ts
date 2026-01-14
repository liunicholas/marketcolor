import { NextResponse } from 'next/server';
import { getCommodities, getExtendedCommodities } from '@/lib/market-api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const extended = searchParams.get('extended') === 'true';

    const commodities = extended
      ? await getExtendedCommodities()
      : await getCommodities();
    return NextResponse.json(commodities);
  } catch (error) {
    console.error('Error fetching commodities:', error);
    return NextResponse.json({ error: 'Failed to fetch commodities' }, { status: 500 });
  }
}
