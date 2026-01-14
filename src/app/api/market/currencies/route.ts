import { NextResponse } from 'next/server';
import { getCurrencies, getExtendedCurrencies } from '@/lib/market-api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const extended = searchParams.get('extended') === 'true';

    const currencies = extended
      ? await getExtendedCurrencies()
      : await getCurrencies();
    return NextResponse.json(currencies);
  } catch (error) {
    console.error('Error fetching currencies:', error);
    return NextResponse.json({ error: 'Failed to fetch currencies' }, { status: 500 });
  }
}
