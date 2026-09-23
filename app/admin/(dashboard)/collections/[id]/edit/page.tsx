import { notFound } from 'next/navigation';
import { getCatalogState } from '@/lib/catalog/server';
import CollectionForm from '../../../../components/CollectionForm';

interface PageProps { params: Promise<{ id: string }> }

export default async function EditCollectionPage({ params }: PageProps) {
  const { id } = await params;
  const collection = (await getCatalogState()).collections.find((item) => item.id === id);
  if (!collection) notFound();
  return <main><div className="mb-7 border-b-[3px] border-black pb-5"><p className="font-mono text-[10px] font-black uppercase tracking-widest text-[#dc2626]">Edit collection // 作品群編集</p><h1 className="mt-2 text-4xl font-black uppercase leading-none">{collection.name}</h1></div><CollectionForm collection={collection} /></main>;
}
