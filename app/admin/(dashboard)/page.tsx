import Link from 'next/link';
import { getCatalogState } from '@/lib/catalog/server';
import { getProductStock } from '@/lib/types';

export const metadata = { title: 'Admin Dashboard | Future Stitch' };

export default async function AdminDashboard() {
  const catalog = await getCatalogState();
  const activeProducts = catalog.products.filter((product) => product.status !== 'draft');
  const soldOut = activeProducts.filter((product) => getProductStock(product) <= 0);
  const availableLogos = catalog.logos.filter((logo) => logo.active !== false);
  const cards = [
    { label: 'Collections', value: catalog.collections.length, href: '/admin/collections', action: 'Manage story worlds' },
    { label: 'Active products', value: activeProducts.length, href: '/admin/products', action: 'Manage catalogue' },
    { label: 'Sold out', value: soldOut.length, href: '/admin/products', action: 'Review inventory' },
    { label: 'Studio logos', value: availableLogos.length, href: '/admin/logos', action: 'Manage motifs' },
  ];
  return (
    <main>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b-[3px] border-black pb-5"><div><p className="font-mono text-[10px] font-black uppercase tracking-widest text-[#dc2626]">Control panel // 司令室</p><h1 className="mt-2 text-4xl font-black uppercase leading-none sm:text-5xl">Store overview.</h1></div><p className="max-w-sm font-mono text-xs text-stone-600">Products and motifs saved here feed the customer shop, product pages, checkout, and custom studio.</p></div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{cards.map((card, index) => <Link key={card.label} href={card.href} className="border-[3px] border-black bg-white p-6 shadow-[5px_5px_0_#111] transition hover:-translate-y-1 hover:shadow-[5px_7px_0_#dc2626]"><span className="font-mono text-[10px] font-black text-[#dc2626]">{`0${index + 1} //`}</span><strong className="mt-6 block text-5xl font-black">{card.value}</strong><span className="mt-1 block text-lg font-black uppercase">{card.label}</span><span className="mt-6 block border-t-2 border-black pt-3 font-mono text-[10px] font-black uppercase">{card.action} →</span></Link>)}</div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3"><Link href="/admin/collections/new" className="border-[3px] border-black bg-white p-5 font-mono text-sm font-black uppercase shadow-[5px_5px_0_#111] hover:bg-stone-100">+ Add collection</Link><Link href="/admin/products/new" className="border-[3px] border-black bg-black p-5 font-mono text-sm font-black uppercase text-white shadow-[5px_5px_0_#dc2626] hover:bg-stone-800">+ Add constructed product</Link><Link href="/admin/logos/new" className="border-[3px] border-black bg-white p-5 font-mono text-sm font-black uppercase shadow-[5px_5px_0_#111] hover:bg-stone-100">+ Add custom-studio logo</Link></div>
    </main>
  );
}
