import LogoForm from '../../../components/LogoForm';
import { getCatalogState } from '@/lib/catalog/server';

export const metadata = { title: 'Add Studio Logo | Future Stitch Admin' };

export default async function NewLogoPage() {
  const { collections } = await getCatalogState();
  return <main><div className="mb-7 border-b-[3px] border-black pb-5"><p className="font-mono text-[10px] font-black uppercase tracking-widest text-[#dc2626]">New motif // 新しい刺繍</p><h1 className="mt-2 text-4xl font-black uppercase leading-none">Add custom-studio logo.</h1><p className="mt-3 max-w-xl text-sm text-stone-600">Mark only true single-color silhouettes as recolorable. Multi-color artwork keeps its original colors automatically.</p></div><LogoForm collections={collections} /></main>;
}
