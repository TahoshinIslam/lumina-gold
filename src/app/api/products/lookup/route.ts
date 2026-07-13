import { NextRequest, NextResponse } from 'next/server';
import { getProductsBySkus } from '@/server/dal/catalog';

/**
 * GET /api/products/lookup?skus=a,b,c
 * Resolves arbitrary SKUs against the live database — used by client
 * components (e.g. "Recently Viewed") that track a SKU list in
 * localStorage and need current product data for it at render time.
 */
export async function GET(req: NextRequest) {
  const skus = (req.nextUrl.searchParams.get('skus') || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .slice(0, 20);
  if (skus.length === 0) return NextResponse.json({ products: [] });
  const products = await getProductsBySkus(skus);
  return NextResponse.json({ products });
}
