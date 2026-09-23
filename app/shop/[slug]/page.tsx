/**
 * ============================================================================
 * WHAT THIS FILE DOES:
 * Server Component rendering the product detail stub for `/shop/[slug]`.
 *
 * WHY IT EXISTS:
 * Gives every product card on the shop page a dedicated, pre-rendered destination
 * to display full photography, Japanese embroidery specs, and sizing options.
 *
 * HOW IT CONNECTS:
 * - Pre-rendered via `generateStaticParams()` reading from `lib/products.ts`.
 * - Links back to `/shop` via manga breadcrumbs.
 * - Houses the visual "ADD TO CART" action (ready for cart state integration).
 * ============================================================================
 */

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlugFromCatalog, getPublicCollections } from '@/lib/catalog/server';
import ProductGallery from '@/app/components/shop/ProductGallery';
import ProductPurchasePanel from '@/app/components/shop/ProductPurchasePanel';

interface ProductDetailPageProps {
  /**
   * IMPORTANT FOR NEXT.JS 15:
   * Route params is a Promise that must be awaited before accessing `slug`.
   */
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';

/**
 * Dynamic metadata for SEO indexing per product.
 */
export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugFromCatalog(slug);

  if (!product) {
    return { title: 'Product Not Found — Future Stitch' };
  }

  return {
    title: product.seoTitle || `${product.name} — Future Stitch`,
    description: product.seoDescription || product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  // Await the route params Promise per Next.js 15 App Router conventions
  const { slug } = await params;
  const product = await getProductBySlugFromCatalog(slug);

  // Return 404 page if an invalid slug is requested
  if (!product) {
    notFound();
  }
  const collection = (await getPublicCollections()).find((item) => item.id === (product.collectionId || 'berserk'));

  return (
    <main className="min-h-[calc(100vh-4rem)] w-full bg-white text-black font-sans py-8 sm:py-12 px-4 sm:px-6 flex justify-center">
      <div className="w-full max-w-4xl mx-auto flex flex-col space-y-6">
        
        {/* Manga Breadcrumb Header */}
        <header className="flex items-center justify-between pb-2 border-b-2 border-black text-[11px] font-mono tracking-wider text-stone-700 select-none">
          <div className="flex items-center gap-2">
            <Link href={collection ? `/shop?collection=${encodeURIComponent(collection.slug)}` : '/shop'} className="font-bold text-black hover:underline">
              ◄ {collection ? `${collection.name.toUpperCase()} COLLECTION` : 'SHOP ALL ARTIFACTS'}
            </Link>
            <span>/</span>
            <span className="text-stone-500 uppercase">{product.category}</span>
          </div>
          <span className="font-bold text-black border border-black px-1.5 py-0.2">
            PANEL {product.panelNumber}
          </span>
        </header>

        {/* Main Product Spread: Two-Panel Manga Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-[3px] border-black bg-stone-950 text-white p-6 sm:p-8 shadow-sm">
          
          {/* Left Panel: Multi-Image Manga Gallery (Client Component) */}
          <div className="relative">
            <ProductGallery images={product.images} alt={product.name} />
            {/* Optional Marketing Badge Overlay */}
            {product.badge && (
              <div className="absolute top-2 right-2 z-20 pointer-events-none">
                <span className="bg-[#dc2626] text-white text-[9px] font-mono font-bold px-2 py-0.5 uppercase tracking-widest border border-white/60">
                  {product.badge}
                </span>
              </div>
            )}
          </div>

          {/* Right Panel: Specifications, Sizing, and Interactive Actions (Client Component) */}
          <ProductPurchasePanel product={product} />

        </div>

      </div>
    </main>
  );
}
