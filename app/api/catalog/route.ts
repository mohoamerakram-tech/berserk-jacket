import { getPublicCollections, getPublicLogos, getPublicProducts } from '@/lib/catalog/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const [collections, products, logos] = await Promise.all([getPublicCollections(), getPublicProducts(), getPublicLogos()]);
  return Response.json({ collections, products, logos }, {
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
  });
}
