/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { getCatalogState } from '@/lib/catalog/server';
import DeleteButton from '../../components/DeleteButton';

export const metadata = { title: 'Studio Logos | Future Stitch Admin' };

interface PageProps { searchParams: Promise<{ collection?: string }> }

export default async function AdminLogosPage({ searchParams }: PageProps) {
  const { logos, collections } = await getCatalogState();
  const selectedCollection = (await searchParams).collection;
  const visibleLogos = selectedCollection ? logos.filter((logo) => (logo.collectionId || 'berserk') === selectedCollection) : logos;
  return <main><div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b-[3px] border-black pb-5"><div><p className="font-mono text-[10px] font-black uppercase tracking-widest text-[#dc2626]">Motif catalogue // 刺繍図案</p><h1 className="mt-2 text-4xl font-black uppercase leading-none">Custom-studio logos.</h1></div><Link href="/admin/logos/new" className="border-2 border-black bg-black px-5 py-3 font-mono text-xs font-black uppercase text-white shadow-[4px_4px_0_#dc2626]">+ Add logo</Link></div><nav className="mb-6 flex gap-2 overflow-x-auto pb-2" aria-label="Filter logos by collection"><Link href="/admin/logos" className={`shrink-0 border-2 border-black px-3 py-2 font-mono text-[10px] font-black uppercase ${!selectedCollection ? 'bg-black text-white' : 'bg-white'}`}>All collections</Link>{collections.map((collection) => <Link key={collection.id} href={`/admin/logos?collection=${encodeURIComponent(collection.id)}`} className={`shrink-0 border-2 border-black px-3 py-2 font-mono text-[10px] font-black uppercase ${selectedCollection === collection.id ? 'bg-black text-white shadow-[3px_3px_0_#dc2626]' : 'bg-white'}`}>{collection.name}</Link>)}</nav><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{visibleLogos.map((logo) => {
    const collection = collections.find((item) => item.id === (logo.collectionId || 'berserk'));
    return <article key={logo.id} className="border-[3px] border-black bg-white p-4 shadow-[4px_4px_0_#111]"><div className="flex aspect-square items-center justify-center overflow-hidden border-2 border-black bg-stone-100 p-3"><img src={logo.path} alt={logo.label} className="h-full w-full object-contain" /></div><div className="mt-4"><h2 className="font-black uppercase">{logo.label}</h2><p className="font-mono text-[10px] text-stone-500">{logo.japaneseLabel} · {collection?.name || 'Unsorted'}</p><span className={`mt-2 inline-block px-2 py-1 font-mono text-[9px] font-bold uppercase ${logo.canRecolor ? 'bg-green-200 text-green-900' : 'bg-stone-200'}`}>{logo.canRecolor ? 'Single color / recolorable' : 'Original colors locked'}</span><div className="mt-4 flex gap-2 border-t-2 border-black pt-3"><Link href={`/admin/logos/${encodeURIComponent(logo.id)}/edit`} className="border-2 border-black bg-black px-3 py-2 font-mono text-[10px] font-black uppercase text-white">Edit</Link><DeleteButton endpoint={`/api/admin/logos/${encodeURIComponent(logo.id)}`} label={logo.label} /></div></div></article>;
  })}{visibleLogos.length === 0 && <p className="border-[3px] border-dashed border-black p-10 text-center font-mono text-xs uppercase sm:col-span-2 lg:col-span-3">No logos in this collection.</p>}</div></main>;
}
