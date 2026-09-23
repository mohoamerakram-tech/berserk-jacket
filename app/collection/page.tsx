/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { getPublicLogos, getPublicProducts, getVisibleCollections } from '@/lib/catalog/server';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Anime Collections | Future Stitch',
  description: 'Explore live Future Stitch collections and preview the anime worlds joining the archive next.',
};

export default async function CollectionPage() {
  const [collections, products, logos] = await Promise.all([
    getVisibleCollections(),
    getPublicProducts(),
    getPublicLogos(),
  ]);
  const activeCount = collections.filter((collection) => collection.status === 'active').length;
  const upcomingCount = collections.filter((collection) => collection.status === 'upcoming').length;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#f5f3ee] px-4 py-10 text-black sm:px-6">
      <div className="mx-auto flex max-w-6xl items-stretch gap-3 sm:gap-5">
        <aside aria-hidden="true" className="hidden w-5 shrink-0 flex-col items-center justify-between py-6 lg:flex">
          <span className="font-mono text-[9px] text-stone-400 [writing-mode:vertical-rl]">┼ COLLECTION ┼</span>
          <span className="font-serif text-sm font-bold tracking-[0.3em] [writing-mode:vertical-rl]">物語を選び、印を纏う</span>
          <span className="font-mono text-[9px] text-[#dc2626] [writing-mode:vertical-rl]">【 作品群 】</span>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="mb-8 border-b-[3px] border-black pb-5">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#dc2626]">World index // 作品目録</p>
                <h1 className="mt-2 text-5xl font-black uppercase leading-none sm:text-6xl">Choose your story.</h1>
              </div>
              <p className="max-w-sm font-mono text-xs leading-relaxed text-stone-600">
                Enter the Berserk collection now, or inspect the anime worlds being prepared for future drops.
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 font-mono text-[10px] font-black uppercase">
              <span className="border-2 border-black bg-black px-3 py-2 text-white">{activeCount} live now</span>
              <span className="border-2 border-black bg-white px-3 py-2">{upcomingCount} upcoming</span>
            </div>
          </header>

          <div className="grid gap-6 lg:grid-cols-2">
            {collections.map((collection, index) => {
              const isUpcoming = collection.status === 'upcoming';
              const productCount = products.filter((product) => (product.collectionId || 'berserk') === collection.id).length;
              const logoCount = logos.filter((logo) => (logo.collectionId || 'berserk') === collection.id).length;
              const destination = isUpcoming ? `/anime/${collection.animeId}` : `/collection/${collection.slug}`;

              return (
                <article key={collection.id} className="group flex min-h-[520px] flex-col overflow-hidden border-[3px] border-black bg-black text-white shadow-[6px_6px_0_#111]">
                  <Link href={destination} className={`relative block min-h-64 overflow-hidden ${isUpcoming ? 'bg-[#0a0a0a]' : ''}`}>
                    <img
                      src={collection.heroImage}
                      alt={`${collection.name} collection`}
                      className={`absolute inset-0 h-full w-full transition duration-500 group-hover:scale-105 ${isUpcoming ? 'object-contain p-10 sm:p-12' : 'object-cover'}`}
                    />
                    <div className={`absolute inset-0 ${isUpcoming ? 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.58)_100%)]' : 'bg-gradient-to-t from-black via-black/15 to-transparent'}`} />
                    <span className="absolute left-4 top-4 border border-white bg-black px-2 py-1 font-mono text-[10px] font-black">
                      COLLECTION {String(index + 1).padStart(2, '0')}{' // '}{collection.japaneseName}
                    </span>
                    {isUpcoming && (
                      <span className="absolute bottom-4 right-4 border-2 border-[#dc2626] bg-[#dc2626] px-3 py-2 font-mono text-[10px] font-black tracking-widest">
                        UPCOMING // 制作中
                      </span>
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col justify-between gap-7 p-6 sm:p-8">
                    <div>
                      <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-red-400">{collection.tagline || 'Future Stitch archive'}</p>
                      <h2 className="mt-3 text-3xl font-black uppercase leading-none sm:text-4xl">{collection.name}</h2>
                      <p className="mt-4 text-sm leading-relaxed text-stone-300">{collection.description}</p>
                      <p className="mt-5 border-t border-stone-700 pt-3 font-mono text-[10px] uppercase text-stone-400">
                        {isUpcoming ? 'Collection under development · release date to be announced' : `${productCount} finished pieces · ${logoCount} studio motifs`}
                      </p>
                    </div>

                    {isUpcoming ? (
                      <Link href={destination} className="w-fit border-2 border-white px-4 py-3 font-mono text-xs font-black uppercase hover:bg-white hover:text-black">
                        Preview this world →
                      </Link>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        <Link href={`/collection/${collection.slug}`} className="border-2 border-white bg-white px-4 py-3 font-mono text-xs font-black uppercase text-black hover:bg-[#dc2626] hover:text-white">
                          Enter collection →
                        </Link>
                        <Link href={`/custom-studio?collection=${encodeURIComponent(collection.slug)}`} className="border-2 border-white px-4 py-3 font-mono text-xs font-black uppercase hover:bg-white hover:text-black">
                          Custom studio
                        </Link>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {collections.length === 0 && (
            <div className="border-[3px] border-dashed border-black p-12 text-center">
              <h2 className="text-3xl font-black uppercase">The archive is being prepared.</h2>
              <p className="mt-3 font-mono text-xs text-stone-500">Active and upcoming collections will appear here.</p>
            </div>
          )}
        </div>

        <aside aria-hidden="true" className="hidden w-5 shrink-0 flex-col items-center justify-between py-6 lg:flex">
          <span className="font-mono text-[9px] text-stone-400 [writing-mode:vertical-rl]">┼ STORY WORLDS ┼</span>
          <span className="font-serif text-sm font-bold tracking-[0.3em] [writing-mode:vertical-rl]">好きな物語から始めよう</span>
          <span className="font-mono text-[9px] text-[#dc2626] [writing-mode:vertical-rl]">【 選択 】</span>
        </aside>
      </div>
    </main>
  );
}
