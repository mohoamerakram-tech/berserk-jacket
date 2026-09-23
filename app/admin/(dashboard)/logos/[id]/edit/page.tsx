import { notFound } from 'next/navigation';
import { getCatalogState } from '@/lib/catalog/server';
import LogoForm from '../../../../components/LogoForm';

interface PageProps { params: Promise<{ id: string }> }

export default async function EditLogoPage({ params }: PageProps) {
  const { id } = await params;
  const catalog = await getCatalogState();
  const logo = catalog.logos.find((item) => item.id === id);
  if (!logo) notFound();
  return <main><div className="mb-7 border-b-[3px] border-black pb-5"><p className="font-mono text-[10px] font-black uppercase tracking-widest text-[#dc2626]">Edit motif // 刺繍編集</p><h1 className="mt-2 text-4xl font-black uppercase leading-none">{logo.label}</h1></div><LogoForm logo={logo} collections={catalog.collections} /></main>;
}
