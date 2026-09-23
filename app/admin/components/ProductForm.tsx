'use client';

/* eslint-disable @next/next/no-img-element */

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Collection, Product } from '@/lib/types';

const input = 'w-full border-2 border-black bg-white px-3 py-2.5 font-mono text-sm outline-none focus:shadow-[3px_3px_0_#dc2626]';
const label = 'mb-1.5 block font-mono text-[10px] font-black uppercase tracking-widest text-stone-700';

function Field({ name, title, defaultValue, type = 'text', required = false, placeholder }: { name: string; title: string; defaultValue?: string | number; type?: string; required?: boolean; placeholder?: string }) {
  return <div><label htmlFor={name} className={label}>{title}{required ? ' *' : ''}</label><input id={name} name={name} type={type} defaultValue={defaultValue} required={required} placeholder={placeholder} className={input} /></div>;
}

function TextArea({ name, title, defaultValue, required = false, rows = 4, placeholder }: { name: string; title: string; defaultValue?: string; required?: boolean; rows?: number; placeholder?: string }) {
  return <div><label htmlFor={name} className={label}>{title}{required ? ' *' : ''}</label><textarea id={name} name={name} defaultValue={defaultValue} required={required} rows={rows} placeholder={placeholder} className={`${input} resize-y`} /></div>;
}

export default function ProductForm({ product, collections }: { product?: Product; collections: Collection[] }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const inventory = useMemo(() => product?.inventoryBySize
    ? Object.entries(product.inventoryBySize).map(([size, quantity]) => `${size}:${quantity}`).join(', ')
    : product?.sizes.map((size) => `${size}:${product.inStock ? 1 : 0}`).join(', ') || 'S:0, M:0, L:0, XL:0, XXL:0', [product]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    const response = await fetch(product ? `/api/admin/products/${encodeURIComponent(product.id)}` : '/api/admin/products', {
      method: product ? 'PUT' : 'POST',
      body: new FormData(event.currentTarget),
    });
    const result = await response.json().catch(() => ({})) as { error?: string; id?: string };
    if (!response.ok) {
      setError(result.error || 'The product could not be saved.');
      setPending(false);
      return;
    }
    router.push('/admin/products');
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-8" encType="multipart/form-data">
      <input type="hidden" name="existingImages" value={JSON.stringify(product?.images || [])} />
      <section className="border-[3px] border-black bg-white p-5 shadow-[5px_5px_0_#111] sm:p-7">
        <h2 className="mb-5 border-b-2 border-black pb-2 text-xl font-black uppercase">Identity &amp; publishing</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <Field name="name" title="Product name" defaultValue={product?.name} required />
          <Field name="japaneseName" title="Japanese name" defaultValue={product?.japaneseName} required />
          <Field name="slug" title="URL slug" defaultValue={product?.slug} placeholder="generated-from-name" />
          <Field name="sku" title="SKU" defaultValue={product?.sku} placeholder="FS-BSK-001" />
          <div><label htmlFor="collectionId" className={label}>Collection *</label><select id="collectionId" name="collectionId" defaultValue={product?.collectionId || 'berserk'} required className={input}>{collections.map((collection) => <option key={collection.id} value={collection.id}>{collection.name.toUpperCase()}{' // '}{collection.japaneseName}</option>)}</select></div>
          <div><label htmlFor="category" className={label}>Category *</label><select id="category" name="category" defaultValue={product?.category || 'jacket'} className={input}>{['jacket', 'hoodie', 'tee', 'accessory'].map((value) => <option key={value} value={value}>{value.toUpperCase()}</option>)}</select></div>
          <div><label htmlFor="status" className={label}>Visibility *</label><select id="status" name="status" defaultValue={product?.status || 'active'} className={input}><option value="active">ACTIVE — visible to customers</option><option value="draft">DRAFT — admin only</option></select></div>
          <Field name="panelNumber" title="Manga panel number" defaultValue={product?.panelNumber || '01'} />
          <Field name="badge" title="Badge" defaultValue={product?.badge} placeholder="NEW DROP" />
        </div>
        <label className="mt-5 flex items-center gap-3 border-2 border-black p-3 font-mono text-xs font-bold uppercase"><input type="checkbox" name="featured" defaultChecked={product?.featured} className="h-4 w-4 accent-[#dc2626]" /> Feature this product</label>
      </section>

      <section className="border-[3px] border-black bg-white p-5 shadow-[5px_5px_0_#111] sm:p-7">
        <h2 className="mb-5 border-b-2 border-black pb-2 text-xl font-black uppercase">Pricing &amp; inventory</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <Field name="price" title="Selling price (DH)" type="number" defaultValue={product?.price} required />
          <Field name="compareAtPrice" title="Original price (DH)" type="number" defaultValue={product?.compareAtPrice} />
          <Field name="costPrice" title="Internal cost (DH)" type="number" defaultValue={product?.costPrice} />
          <Field name="weightGrams" title="Weight (grams)" type="number" defaultValue={product?.weightGrams} />
          <Field name="salesCount" title="Units sold / popularity" type="number" defaultValue={product?.salesCount || 0} />
        </div>
        <div className="mt-5">
          <TextArea name="inventory" title="Size inventory" defaultValue={inventory} required rows={3} placeholder="S:3, M:5, L:4, XL:2, XXL:0" />
          <p className="mt-2 font-mono text-[10px] text-stone-500">Use SIZE:QUANTITY. A size with 0 units appears sold out; when every size is 0, the whole product displays OUT OF STOCK.</p>
        </div>
      </section>

      <section className="border-[3px] border-black bg-white p-5 shadow-[5px_5px_0_#111] sm:p-7">
        <h2 className="mb-5 border-b-2 border-black pb-2 text-xl font-black uppercase">Customer details</h2>
        <div className="space-y-5">
          <TextArea name="shortDescription" title="Short description" defaultValue={product?.shortDescription} rows={2} />
          <TextArea name="description" title="Full description" defaultValue={product?.description} required />
          <div className="grid gap-5 md:grid-cols-2">
            <TextArea name="materials" title="Materials" defaultValue={product?.materials} rows={3} />
            <TextArea name="embroideryDetails" title="Embroidery details" defaultValue={product?.embroideryDetails} rows={3} />
            <TextArea name="fit" title="Fit & sizing notes" defaultValue={product?.fit} rows={3} />
            <TextArea name="careInstructions" title="Care instructions" defaultValue={product?.careInstructions} rows={3} />
            <TextArea name="shippingNote" title="Shipping note" defaultValue={product?.shippingNote} rows={3} />
            <div className="space-y-5"><Field name="color" title="Primary color" defaultValue={product?.color} /><Field name="tags" title="Tags (comma separated)" defaultValue={product?.tags?.join(', ')} /></div>
          </div>
        </div>
      </section>

      <section className="border-[3px] border-black bg-white p-5 shadow-[5px_5px_0_#111] sm:p-7">
        <h2 className="mb-5 border-b-2 border-black pb-2 text-xl font-black uppercase">Photography</h2>
        {product?.images?.length ? <div className="mb-5 grid grid-cols-3 gap-3 sm:grid-cols-6">{product.images.map((image, index) => <div key={image} className="relative aspect-square overflow-hidden border-2 border-black bg-stone-100"><img src={image} alt={`${product.name} image ${index + 1}`} className="h-full w-full object-cover" /></div>)}</div> : null}
        <label htmlFor="images" className={label}>{product ? 'Add more product images' : 'Product images *'}</label>
        <input id="images" name="images" type="file" accept="image/png,image/jpeg,image/webp" multiple required={!product?.images?.length} className={`${input} file:mr-3 file:border-0 file:bg-black file:px-3 file:py-2 file:font-mono file:text-xs file:font-bold file:text-white`} />
        <p className="mt-2 font-mono text-[10px] text-stone-500">PNG, JPG or WebP. Maximum 10 MB each. The first image is the shop cover.</p>
      </section>

      <section className="border-[3px] border-black bg-white p-5 shadow-[5px_5px_0_#111] sm:p-7">
        <h2 className="mb-5 border-b-2 border-black pb-2 text-xl font-black uppercase">Search appearance</h2>
        <div className="grid gap-5 md:grid-cols-2"><Field name="seoTitle" title="SEO title" defaultValue={product?.seoTitle} /><TextArea name="seoDescription" title="SEO description" defaultValue={product?.seoDescription} rows={3} /></div>
      </section>

      {error && <p role="alert" className="border-[3px] border-[#dc2626] bg-red-50 p-4 font-mono text-xs font-bold text-red-800">{error}</p>}
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className="border-2 border-black bg-black px-7 py-3 font-mono text-xs font-black uppercase tracking-widest text-white shadow-[4px_4px_0_#dc2626] hover:bg-stone-800 disabled:cursor-wait disabled:opacity-50">{pending ? 'SAVING…' : product ? 'SAVE PRODUCT →' : 'ADD PRODUCT →'}</button>
        <button type="button" onClick={() => router.push('/admin/products')} className="border-2 border-black px-5 py-3 font-mono text-xs font-black uppercase">Cancel</button>
      </div>
    </form>
  );
}
