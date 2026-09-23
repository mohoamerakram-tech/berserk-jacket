'use client';

/* eslint-disable @next/next/no-img-element */

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Collection } from '@/lib/types';
import { ANIME_LOGOS } from '@/app/components/navigation/constants';

const input = 'w-full border-2 border-black bg-white px-3 py-2.5 font-mono text-sm outline-none focus:shadow-[3px_3px_0_#dc2626]';
const label = 'mb-1.5 block font-mono text-[10px] font-black uppercase tracking-widest text-stone-700';

export default function CollectionForm({ collection }: { collection?: Collection }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    const response = await fetch(collection ? `/api/admin/collections/${encodeURIComponent(collection.id)}` : '/api/admin/collections', {
      method: collection ? 'PUT' : 'POST',
      body: new FormData(event.currentTarget),
    });
    const result = await response.json().catch(() => ({})) as { error?: string };
    if (!response.ok) {
      setError(result.error || 'The collection could not be saved.');
      setPending(false);
      return;
    }
    router.push('/admin/collections');
    router.refresh();
  }

  return (
    <form onSubmit={submit} encType="multipart/form-data" className="space-y-7">
      <input type="hidden" name="existingHeroImage" value={collection?.heroImage || ''} />
      <input type="hidden" name="existingLogoImage" value={collection?.logoImage || ''} />
      <section className="border-[3px] border-black bg-white p-6 shadow-[6px_6px_0_#111] sm:p-8">
        <h2 className="mb-5 border-b-2 border-black pb-2 text-xl font-black uppercase">Collection identity</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <div><label htmlFor="name" className={label}>English name *</label><input id="name" name="name" required defaultValue={collection?.name} placeholder="One Piece" className={input} /></div>
          <div><label htmlFor="japaneseName" className={label}>Japanese name *</label><input id="japaneseName" name="japaneseName" required defaultValue={collection?.japaneseName} placeholder="ワンピース" className={input} /></div>
          <div><label htmlFor="slug" className={label}>URL slug</label><input id="slug" name="slug" defaultValue={collection?.slug} placeholder="one-piece" className={input} /></div>
          <div><label htmlFor="animeId" className={label}>Anime bar identity *</label><select id="animeId" name="animeId" defaultValue={collection?.animeId || 'berserk'} className={input}>{ANIME_LOGOS.map((anime) => <option key={anime.id} value={anime.id}>{anime.name}</option>)}</select></div>
          <div><label htmlFor="status" className={label}>Visibility *</label><select id="status" name="status" defaultValue={collection?.status || 'active'} className={input}><option value="active">ACTIVE — customer pages enabled</option><option value="upcoming">UPCOMING — anime teaser only</option><option value="draft">DRAFT — admin only</option></select></div>
          <div><label htmlFor="sortOrder" className={label}>Display order</label><input id="sortOrder" name="sortOrder" type="number" min="0" defaultValue={collection?.sortOrder || 0} className={input} /></div>
        </div>
        <div className="mt-5 grid gap-5">
          <div><label htmlFor="tagline" className={label}>Short tagline</label><input id="tagline" name="tagline" defaultValue={collection?.tagline} placeholder="Set sail wearing your story." className={input} /></div>
          <div><label htmlFor="description" className={label}>Collection description *</label><textarea id="description" name="description" required rows={5} defaultValue={collection?.description} className={`${input} resize-y`} /></div>
        </div>
      </section>

      <section className="border-[3px] border-black bg-white p-6 shadow-[6px_6px_0_#111] sm:p-8">
        <h2 className="mb-5 border-b-2 border-black pb-2 text-xl font-black uppercase">Collection artwork</h2>
        {collection && <div className="mb-5 grid gap-4 sm:grid-cols-2"><div><span className={label}>Current cover</span><img src={collection.heroImage} alt="" className="h-40 w-full border-2 border-black object-cover" /></div>{collection.logoImage && <div><span className={label}>Current anime logo</span><img src={collection.logoImage} alt="" className="h-40 w-full border-2 border-black object-contain p-4" /></div>}</div>}
        <div className="grid gap-5 md:grid-cols-2">
          <div><label htmlFor="heroImage" className={label}>{collection ? 'Replace cover image' : 'Cover image *'}</label><input id="heroImage" name="heroImage" type="file" accept="image/png,image/jpeg,image/webp" required={!collection} className={input} /></div>
          <div><label htmlFor="logoImage" className={label}>Anime bar logo override</label><input id="logoImage" name="logoImage" type="file" accept="image/png,image/jpeg,image/webp" className={input} /><p className="mt-2 font-mono text-[10px] text-stone-500">Optional. The planned anime-bar logo is used when this is empty.</p></div>
        </div>
      </section>

      {error && <p role="alert" className="border-[3px] border-[#dc2626] bg-red-50 p-4 font-mono text-xs font-bold text-red-800">{error}</p>}
      <div className="flex flex-wrap gap-4"><button type="submit" disabled={pending} className="border-2 border-black bg-black px-7 py-3 font-mono text-xs font-black uppercase tracking-widest text-white shadow-[4px_4px_0_#dc2626] disabled:opacity-50">{pending ? 'SAVING…' : collection ? 'SAVE COLLECTION →' : 'ADD COLLECTION →'}</button><button type="button" onClick={() => router.push('/admin/collections')} className="border-2 border-black px-5 py-3 font-mono text-xs font-black uppercase">Cancel</button></div>
    </form>
  );
}
