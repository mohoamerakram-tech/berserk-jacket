/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { getCatalogState } from '@/lib/catalog/server';
import DeleteButton from '../../components/DeleteButton';

export const metadata = { title: 'Collections | Future Stitch Admin' };

export default async function AdminCollectionsPage() {
  const catalog = await getCatalogState();
  return <main><div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b-[3px] border-black pb-5"><div><p className="font-mono text-[10px] font-black uppercase tracking-widest text-[#dc2626]">Collection routing // 作品群</p><h1 className="mt-2 text-4xl font-black uppercase leading-none">Anime collections.</h1></div><Link href="/admin/collections/new" className="border-2 border-black bg-black px-5 py-3 font-mono text-xs font-black uppercase text-white shadow-[4px_4px_0_#dc2626]">+ Add collection</Link></div>
    <div className="space-y-4">{[...catalog.collections].sort((a,b) => a.sortOrder-b.sortOrder).map((collection) => {
      const products = catalog.products.filter((product) => (product.collectionId || 'berserk') === collection.id).length;
      const logos = catalog.logos.filter((logo) => (logo.collectionId || 'berserk') === collection.id).length;
      return <article key={collection.id} className="grid gap-4 border-[3px] border-black bg-white p-4 shadow-[4px_4px_0_#111] sm:grid-cols-[140px_1fr_auto] sm:items-center"><img src={collection.heroImage} alt="" className="h-28 w-full border-2 border-black object-cover" /><div><div className="flex gap-2"><span className="bg-black px-2 py-1 font-mono text-[9px] font-black uppercase text-white">{collection.status}</span><span className="bg-stone-200 px-2 py-1 font-mono text-[9px] font-black uppercase">{collection.animeId}</span></div><h2 className="mt-2 text-2xl font-black uppercase">{collection.name}</h2><p className="font-mono text-[10px] text-stone-500">/collection/{collection.slug} · {products} products · {logos} logos</p></div><div className="flex flex-wrap gap-2"><Link href={`/collection/${collection.slug}`} target="_blank" className="border-2 border-black px-3 py-2 font-mono text-[10px] font-black uppercase">View ↗</Link><Link href={`/admin/collections/${encodeURIComponent(collection.id)}/edit`} className="border-2 border-black bg-black px-3 py-2 font-mono text-[10px] font-black uppercase text-white">Edit</Link><DeleteButton endpoint={`/api/admin/collections/${encodeURIComponent(collection.id)}`} label={collection.name} /></div></article>;
    })}</div></main>;
}

