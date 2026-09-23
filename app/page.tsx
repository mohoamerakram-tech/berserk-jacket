import Image from 'next/image';
import Link from 'next/link';
import { getPublicCollections, getPublicProducts } from '@/lib/catalog/server';

const panel = 'relative overflow-hidden border-[3px] border-black shadow-[5px_5px_0_0_#111]';
const eyebrow = 'font-mono text-[10px] font-black uppercase tracking-[0.2em]';
const action = 'inline-flex min-h-11 items-center justify-between gap-5 border-2 border-black bg-black px-4 py-2 font-mono text-xs font-black uppercase tracking-wide text-white transition-colors hover:bg-[#c91920] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c91920]';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [collections, products] = await Promise.all([getPublicCollections(), getPublicProducts()]);
  const leadCollection = collections[0];
  const collectionBestSellers = collections.flatMap((collection) => {
    const product = products
      .filter((entry) => (entry.collectionId || 'berserk') === collection.id)
      .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))[0];
    return product ? [{ collection, product }] : [];
  });
  return (
    <main className="min-h-screen bg-[#f5f3ee] px-4 py-8 text-black sm:px-6 sm:py-12">
      <div className="mx-auto flex max-w-[1240px] items-stretch gap-3 lg:gap-5">
        <aside aria-hidden="true" className="hidden w-5 shrink-0 select-none flex-col items-center justify-between py-7 lg:flex">
          <span className="font-mono text-[9px] tracking-widest text-stone-400 [writing-mode:vertical-rl]">┼ FUTURE STITCH ┼</span>
          <span lang="ja" className="my-auto font-serif text-sm font-bold tracking-[0.3em] text-stone-800 [writing-mode:vertical-rl]">物語はここから始まる</span>
          <span className="font-mono text-[9px] tracking-widest text-[#c91920] [writing-mode:vertical-rl]">【 第一章 】</span>
        </aside>

        <div className="min-w-0 flex-1">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b-[3px] border-black pb-5">
          <div>
            <p className={`${eyebrow} mb-2 text-[#c91920]`}>Future Stitch // Home</p>
            <h1 className="text-4xl font-black uppercase leading-[0.9] tracking-tight sm:text-6xl">
              Find your next<br />stitch<span className="text-[#c91920]">.</span>
            </h1>
          </div>
          <p className="max-w-xs font-mono text-xs leading-relaxed text-stone-600">
            Explore what is new, pick a finished piece, or make a jacket your own.
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-3 md:items-stretch" aria-label="News and offers">
          <section aria-labelledby="home-news-title" className={`${panel} min-h-[320px] bg-white md:col-span-2`}>
            <div className="grid h-full sm:grid-cols-[1.1fr_0.9fr]">
              <div className="relative z-10 flex flex-col items-start justify-between gap-8 p-6 sm:p-8">
                <div>
                  <p className={`${eyebrow} mb-5 text-[#c91920]`}>01 / News // Now live</p>
                  <h2 id="home-news-title" className="max-w-md text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl">
                    {collections.length <= 1 ? `The story starts with ${leadCollection?.name || 'you'}.` : `${collections.length} story worlds are now live.`}
                  </h2>
                  <p className="mt-5 max-w-sm text-sm leading-relaxed text-stone-700">
                    {collections.length <= 1 ? `${leadCollection?.name || 'Our first collection'} is the first collection available right now. Go straight to the full experience and see every piece.` : 'Choose an anime collection to keep its finished products and exclusive custom motifs together.'}
                  </p>
                </div>
                <Link href={leadCollection ? `/collection/${leadCollection.slug}` : '/collection'} className={action}>
                  {collections.length <= 1 && leadCollection ? `Explore ${leadCollection.name}` : 'Browse collections'} <span aria-hidden="true">↗</span>
                </Link>
              </div>
              <div className="relative min-h-[230px] border-t-[3px] border-black bg-black sm:min-h-full sm:border-l-[3px] sm:border-t-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={leadCollection?.heroImage || '/images/back-des1.jpg'} alt={leadCollection ? `${leadCollection.name} collection` : 'Future Stitch collection'} className="absolute inset-0 h-full w-full object-cover" />
                <span className="absolute bottom-3 left-3 bg-black px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-white">
                  Chapter 01{' // '}{leadCollection?.name || 'Future Stitch'}
                </span>
              </div>
            </div>
          </section>

          <section aria-labelledby="home-offer-title" className={`${panel} flex min-h-[320px] flex-col justify-between bg-[#c91920] p-6 text-white sm:p-8`}>
            <div>
              <p className={`${eyebrow} mb-6 text-white/80`}>02 / Offers &amp; promotions</p>
              <span aria-hidden="true" className="text-6xl leading-none">✳</span>
              <h2 id="home-offer-title" className="mt-4 text-4xl font-black uppercase leading-[0.95] tracking-tight">
                Shipping<br />is on us.
              </h2>
              <p className="mt-4 max-w-xs font-mono text-xs leading-relaxed text-white/90">
                Free express shipping is available across active collections. Find your piece and make it yours.
              </p>
            </div>
            <Link href="/shop" className="mt-8 inline-flex min-h-11 items-center justify-between gap-4 border-2 border-white bg-white px-4 py-2 font-mono text-xs font-black uppercase text-black transition-colors hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              Shop current pieces <span aria-hidden="true">↗</span>
            </Link>
          </section>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]" aria-label="Ways to shop and create">
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-1">
            <section aria-labelledby="home-shop-title" className={`${panel} flex min-h-[250px] flex-col justify-between bg-white p-6`}>
              <div className="absolute -right-10 -top-10 h-44 w-44 rotate-12 border-[18px] border-stone-100" aria-hidden="true" />
              <div className="relative">
                <p className={`${eyebrow} mb-4 text-[#c91920]`}>03 / Ready to wear</p>
                <h2 id="home-shop-title" className="max-w-[12rem] text-3xl font-black uppercase leading-none tracking-tight sm:text-4xl">Pick your piece.</h2>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone-600">The most-bought finished piece from every active collection.</p>
                <div className="mt-5 space-y-2">{collectionBestSellers.map(({ collection, product }) => <Link key={collection.id} href={`/shop/${product.slug}`} className="flex items-center justify-between gap-3 border-2 border-black bg-[#f5f3ee] p-2 transition hover:bg-black hover:text-white"><span><strong className="block font-mono text-[9px] uppercase text-[#c91920]">{collection.name} bestseller</strong><span className="block text-xs font-black uppercase leading-tight">{product.name}</span></span><span className="shrink-0 font-mono text-xs font-black">{product.price} DH</span></Link>)}</div>
              </div>
              <Link href="/shop" className={`${action} relative mt-5 self-start`}>
                View all products <span aria-hidden="true">↗</span>
              </Link>
            </section>

            <section aria-labelledby="home-custom-title" className={`${panel} flex min-h-[250px] flex-col justify-between bg-[#171717] p-6 text-white`}>
              <div>
                <p className={`${eyebrow} mb-4 text-[#f0494d]`}>04 / Custom studio</p>
                <h2 id="home-custom-title" className="max-w-[14rem] text-3xl font-black uppercase leading-none tracking-tight sm:text-4xl">Make it yours.</h2>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone-300">Place a motif, choose a jacket, and preview your design.</p>
              </div>
              <Link href="/custom-studio" className="mt-5 inline-flex min-h-11 items-center justify-between gap-5 self-start border-2 border-white bg-white px-4 py-2 font-mono text-xs font-black uppercase text-black transition-colors hover:bg-[#c91920] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                Open custom studio <span aria-hidden="true">↗</span>
              </Link>
            </section>
          </div>

          <section aria-labelledby="home-import-title" className={`${panel} flex min-h-[520px] flex-col bg-black text-white`}>
            <div className="relative min-h-[310px] flex-1 overflow-hidden bg-[#1b1b1b]">
              <Image
                src="/images/import-custom.jpg"
                alt="Custom embroidered jacket inspiration"
                fill
                sizes="(min-width: 768px) 720px, 100vw"
                className="object-cover"
              />
              <span className="absolute left-4 top-4 border border-white bg-black px-2 py-1 font-mono text-[10px] font-black uppercase tracking-widest">
                Your artwork / Your jacket
              </span>
            </div>
            <div className="flex flex-col gap-5 border-t-[3px] border-white p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
              <div>
                <p className={`${eyebrow} mb-3 text-[#f0494d]`}>05 / Import bespoke</p>
                <h2 id="home-import-title" className="text-3xl font-black uppercase leading-none tracking-tight sm:text-4xl">Bring your own art.</h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-stone-300">
                  Upload artwork for the front or back, position it on the jacket, and preview your idea.
                </p>
              </div>
              <Link href="/custom-studio?tab=import" className="inline-flex min-h-11 shrink-0 items-center justify-between gap-5 border-2 border-white bg-white px-4 py-2 font-mono text-xs font-black uppercase text-black transition-colors hover:bg-[#c91920] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                Import artwork <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </section>
        </div>

        <footer className="mt-8 flex items-center justify-between border-t-2 border-black pt-3 font-mono text-[10px] font-bold uppercase tracking-widest text-stone-500">
          <span>Future Stitch // Create your story</span>
          <span>01 — 05</span>
        </footer>
        </div>

        <aside aria-hidden="true" className="hidden w-5 shrink-0 select-none flex-col items-center justify-between py-7 lg:flex">
          <span className="font-mono text-[9px] tracking-widest text-stone-400 [writing-mode:vertical-rl]">┼ ORIGINAL ┼</span>
          <span lang="ja" className="my-auto font-serif text-sm font-bold tracking-[0.3em] text-stone-800 [writing-mode:vertical-rl]">一針ずつ、未来を縫う</span>
          <span className="font-mono text-[9px] tracking-widest text-[#c91920] [writing-mode:vertical-rl]">【 特別仕立て 】</span>
        </aside>
      </div>
    </main>
  );
}
