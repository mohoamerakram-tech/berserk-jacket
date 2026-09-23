/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductGrid from '@/app/components/shop/ProductGrid';
import { getCatalogState } from '@/lib/catalog/server';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
interface PageProps { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = (await getCatalogState()).collections.find((item) => item.slug === slug && item.status === 'active');
  return collection ? { title: `${collection.name} Collection | Future Stitch`, description: collection.description } : { title: 'Collection Not Found | Future Stitch' };
}

export default async function CollectionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const catalog = await getCatalogState();
  const collection = catalog.collections.find((item) => item.slug === slug && item.status === 'active');
  if (!collection) notFound();
  const products = catalog.products.filter((product) => product.status !== 'draft' && (product.collectionId || 'berserk') === collection.id);
  const logos = catalog.logos.filter((logo) => logo.active !== false && (logo.collectionId || 'berserk') === collection.id);
  return <main className="min-h-[calc(100vh-4rem)] bg-white px-4 py-8 text-black sm:px-6 sm:py-12"><div className="mx-auto max-w-6xl">
    <div className="mb-5 flex items-center justify-between border-b-2 border-black pb-2 font-mono text-[10px] font-black uppercase"><Link href="/collection">◄ All collections</Link><span>{collection.japaneseName}{' // '}{collection.name}</span></div>
    <section className="grid overflow-hidden border-[3px] border-black bg-black text-white shadow-[7px_7px_0_#dc2626] lg:grid-cols-[1.15fr_0.85fr]"><div className="relative min-h-[360px]"><img src={collection.heroImage} alt={`${collection.name} collection`} className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" /></div><div className="flex flex-col justify-between gap-8 p-7 sm:p-10"><div><p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-red-400">Active collection // 現在公開中</p><h1 className="mt-4 text-5xl font-black uppercase leading-[0.88] sm:text-6xl">{collection.name}</h1><p className="mt-2 font-serif text-xl text-stone-400">{collection.japaneseName}</p><p className="mt-6 text-sm leading-relaxed text-stone-300">{collection.description}</p></div><div className="flex flex-wrap gap-3"><Link href={`/shop?collection=${encodeURIComponent(collection.slug)}`} className="border-2 border-white bg-white px-5 py-3 font-mono text-xs font-black uppercase text-black hover:bg-[#dc2626] hover:text-white">Shop {collection.name} →</Link><Link href={`/custom-studio?collection=${encodeURIComponent(collection.slug)}`} className="border-2 border-white px-5 py-3 font-mono text-xs font-black uppercase hover:bg-white hover:text-black">Customize with {collection.name}</Link></div></div></section>
    <section className="mt-12"><div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b-[3px] border-black pb-3"><div><p className="font-mono text-[10px] font-black uppercase tracking-widest text-[#dc2626]">Ready-made artifacts // 完成品</p><h2 className="mt-1 text-3xl font-black uppercase">From this collection.</h2></div><span className="font-mono text-[10px] font-bold">{products.length} PRODUCTS</span></div><ProductGrid products={products} /></section>
    <section className="mt-12 grid gap-6 border-[3px] border-black bg-[#f5f3ee] p-6 shadow-[5px_5px_0_#111] md:grid-cols-[1fr_auto] md:items-center"><div><p className="font-mono text-[10px] font-black uppercase tracking-widest text-[#dc2626]">Exclusive motif library // 刺繍図案</p><h2 className="mt-2 text-3xl font-black uppercase">Build your own {collection.name} jacket.</h2><p className="mt-3 text-sm text-stone-600">The studio opens with only this collection’s {logos.length} available motifs. Your front and back designs stay independent.</p></div><Link href={`/custom-studio?collection=${encodeURIComponent(collection.slug)}`} className="border-2 border-black bg-black px-5 py-4 font-mono text-xs font-black uppercase text-white shadow-[4px_4px_0_#dc2626]">Open filtered studio →</Link></section>
  </div></main>;
}
