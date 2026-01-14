import { NextResponse } from 'next/server';
import { getSectorETFs, getExtendedSectorETFs } from '@/lib/market-api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const extended = searchParams.get('extended') === 'true';

    const sectors = extended
      ? await getExtendedSectorETFs()
      : await getSectorETFs();
    return NextResponse.json(sectors);
  } catch (error) {
    console.error('Error fetching sector ETFs:', error);
    return NextResponse.json({ error: 'Failed to fetch sector ETFs' }, { status: 500 });
  }
}
