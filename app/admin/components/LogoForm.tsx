'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Collection } from '@/lib/types';
import type { Logo } from '@/lib/studio/types';

const input = 'w-full border-2 border-black bg-white px-3 py-2.5 font-mono text-sm outline-none focus:shadow-[3px_3px_0_#dc2626]';
const label = 'mb-1.5 block font-mono text-[10px] font-black uppercase tracking-widest text-stone-700';

export default function LogoForm({ collections, logo }: { collections: Collection[]; logo?: Logo }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    const response = await fetch(logo ? `/api/admin/logos/${encodeURIComponent(logo.id)}` : '/api/admin/logos', { method: logo ? 'PUT' : 'POST', body: new FormData(event.currentTarget) });
    const result = await response.json().catch(() => ({})) as { error?: string };
    if (!response.ok) { setError(result.error || 'The logo could not be saved.'); setPending(false); return; }
    router.push('/admin/logos');
    router.refresh();
  }
  return <form onSubmit={submit} encType="multipart/form-data" className="space-y-6 border-[3px] border-black bg-white p-6 shadow-[6px_6px_0_#111] sm:p-8">
    <div className="grid gap-5 md:grid-cols-2">
      <div><label htmlFor="label" className={label}>English label *</label><input id="label" name="label" required defaultValue={logo?.label} placeholder="Brand of Sacrifice" className={input} /></div>
      <div><label htmlFor="japaneseLabel" className={label}>Japanese label *</label><input id="japaneseLabel" name="japaneseLabel" required defaultValue={logo?.japaneseLabel} placeholder="生贄の烙印" className={input} /></div>
      <div><label htmlFor="id" className={label}>Logo ID</label><input id="id" name="id" defaultValue={logo?.id} readOnly={Boolean(logo)} placeholder="generated-from-label" className={input} /></div>
      <div><label htmlFor="collectionId" className={label}>Collection *</label><select id="collectionId" name="collectionId" defaultValue={logo?.collectionId || 'berserk'} required className={input}>{collections.map((collection) => <option key={collection.id} value={collection.id}>{collection.name.toUpperCase()}{' // '}{collection.japaneseName}</option>)}</select></div>
      <div><label htmlFor="sortOrder" className={label}>Picker order</label><input id="sortOrder" name="sortOrder" type="number" min="0" defaultValue={logo?.sortOrder || 0} className={input} /></div>
      <div><label htmlFor="image" className={label}>{logo ? 'Replace logo image' : 'Logo image *'}</label><input id="image" name="image" type="file" accept="image/png,image/jpeg,image/webp" required={!logo} className={`${input} file:mr-3 file:border-0 file:bg-black file:px-2 file:py-1 file:text-white`} /></div>
    </div>
    <label className="flex items-start gap-3 border-2 border-black p-4 font-mono text-xs"><input type="checkbox" name="canRecolor" defaultChecked={logo?.canRecolor} className="mt-0.5 h-4 w-4 accent-[#dc2626]" /><span><strong className="block uppercase">Single-color logo — allow thread recoloring</strong><span className="mt-1 block text-stone-500">Leave this unchecked for artwork with two or more colors. Its original colors will be protected in the studio.</span></span></label>
    <input type="hidden" name="active" value="on" />
    {error && <p role="alert" className="border-2 border-[#dc2626] bg-red-50 p-3 font-mono text-xs font-bold text-red-800">{error}</p>}
    <div className="flex gap-4"><button type="submit" disabled={pending} className="border-2 border-black bg-black px-6 py-3 font-mono text-xs font-black uppercase tracking-widest text-white shadow-[4px_4px_0_#dc2626] disabled:opacity-50">{pending ? 'UPLOADING…' : logo ? 'SAVE LOGO →' : 'ADD LOGO →'}</button><button type="button" onClick={() => router.push('/admin/logos')} className="border-2 border-black px-5 py-3 font-mono text-xs font-black uppercase">Cancel</button></div>
  </form>;
}
