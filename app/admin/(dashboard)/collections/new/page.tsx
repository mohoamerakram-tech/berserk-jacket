import CollectionForm from '../../../components/CollectionForm';

export const metadata = { title: 'Add Collection | Future Stitch Admin' };

export default function NewCollectionPage() {
  return <main><div className="mb-7 border-b-[3px] border-black pb-5"><p className="font-mono text-[10px] font-black uppercase tracking-widest text-[#dc2626]">New collection // 新作品群</p><h1 className="mt-2 text-4xl font-black uppercase leading-none">Add anime collection.</h1></div><CollectionForm /></main>;
}
