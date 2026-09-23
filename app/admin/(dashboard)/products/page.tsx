/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { getCatalogState } from '@/lib/catalog/server';
import { getProductStock } from '@/lib/types';
import DeleteButton from '../../components/DeleteButton';

export const metadata = { title: 'Products | Future Stitch Admin' };

interface PageProps { searchParams: Promise<{ collection?: string }> }

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const { products, collections } = await getCatalogState();
  const selectedCollection = (await searchParams).collection;
  const visibleProducts = selectedCollection ? products.filter((product) => (product.collectionId || 'berserk') === selectedCollection) : products;
  return <main>
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b-[3px] border-black pb-5"><div><p className="font-mono text-[10px] font-black uppercase tracking-widest text-[#dc2626]">Catalogue // 商品管理</p><h1 className="mt-2 text-4xl font-black uppercase leading-none">Constructed products.</h1></div><Link href="/admin/products/new" className="border-2 border-black bg-black px-5 py-3 font-mono text-xs font-black uppercase text-white shadow-[4px_4px_0_#dc2626]">+ Add product</Link></div>
    <nav className="mb-6 flex gap-2 overflow-x-auto pb-2" aria-label="Filter products by collection"><Link href="/admin/products" className={`shrink-0 border-2 border-black px-3 py-2 font-mono text-[10px] font-black uppercase ${!selectedCollection ? 'bg-black text-white' : 'bg-white'}`}>All collections</Link>{collections.map((collection) => <Link key={collection.id} href={`/admin/products?collection=${encodeURIComponent(collection.id)}`} className={`shrink-0 border-2 border-black px-3 py-2 font-mono text-[10px] font-black uppercase ${selectedCollection === collection.id ? 'bg-black text-white shadow-[3px_3px_0_#dc2626]' : 'bg-white'}`}>{collection.name}</Link>)}</nav>
    <div className="space-y-4">{visibleProducts.map((product) => {
      const stock = getProductStock(product);
      const collection = collections.find((item) => item.id === (product.collectionId || 'berserk'));
      return <article key={product.id} className="grid gap-4 border-[3px] border-black bg-white p-4 shadow-[4px_4px_0_#111] sm:grid-cols-[90px_1fr_auto] sm:items-center">
        <div className="h-24 w-20 overflow-hidden border-2 border-black bg-stone-100"><img src={product.image} alt="" className="h-full w-full object-cover" /></div>
        <div><div className="flex flex-wrap gap-2"><span className="bg-[#dc2626] px-2 py-1 font-mono text-[9px] font-black uppercase text-white">{collection?.name || 'Unsorted'}</span><span className="bg-black px-2 py-1 font-mono text-[9px] font-black uppercase text-white">{product.category}</span><span className={`px-2 py-1 font-mono text-[9px] font-black uppercase ${product.status === 'draft' ? 'bg-amber-200 text-amber-900' : 'bg-green-200 text-green-900'}`}>{product.status || 'active'}</span>{stock <= 0 && <span className="bg-[#dc2626] px-2 py-1 font-mono text-[9px] font-black uppercase text-white">Sold out</span>}</div><h2 className="mt-2 text-xl font-black uppercase leading-tight">{product.name}</h2><p className="mt-1 font-mono text-[10px] text-stone-500">{product.sku || 'NO SKU'} · {product.price} DH · {stock === Number.MAX_SAFE_INTEGER ? 'legacy stock' : `${stock} units`} · {product.salesCount || 0} sold</p></div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end"><Link href={`/shop/${product.slug}`} target="_blank" className="border-2 border-black px-3 py-2 font-mono text-[10px] font-black uppercase">View ↗</Link><Link href={`/admin/products/${encodeURIComponent(product.id)}/edit`} className="border-2 border-black bg-black px-3 py-2 font-mono text-[10px] font-black uppercase text-white">Edit</Link><DeleteButton endpoint={`/api/admin/products/${encodeURIComponent(product.id)}`} label={product.name} /></div>
      </article>;
    })}{visibleProducts.length === 0 && <p className="border-[3px] border-dashed border-black p-10 text-center font-mono text-xs uppercase">No products in this collection.</p>}</div>
  </main>;
}
