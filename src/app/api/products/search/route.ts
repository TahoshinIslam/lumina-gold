import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/server/dal/catalog';

/**
 * GET /api/products/search?q=…
 *
 * Type-ahead for the header search box. It is a route and not a server action
 * because the box lives in the header on every page, including static ones, and
 * fires on each keystroke — a plain cached GET is the right shape for that.
 */
export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get('q') || '').slice(0, 80);
  try {
    const products = await searchProducts(q);
    return NextResponse.json({ products });
  } catch (error) {
    // A search that throws must not take the header down with it — the shopper
    // gets no suggestions and can still press Enter for the full listing.
    console.error('[api/products/search]', error);
    return NextResponse.json({ products: [] }, { status: 200 });
  }
}
