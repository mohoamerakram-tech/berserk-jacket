import { notFound } from 'next/navigation';
import { getCatalogState } from '@/lib/catalog/server';
import ProductForm from '../../../../components/ProductForm';

interface PageProps { params: Promise<{ id: string }> }

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const catalog = await getCatalogState();
  const product = catalog.products.find((item) => item.id === id);
  if (!product) notFound();
  return <main><div className="mb-7 border-b-[3px] border-black pb-5"><p className="font-mono text-[10px] font-black uppercase tracking-widest text-[#dc2626]">Edit catalogue entry // 商品編集</p><h1 className="mt-2 text-4xl font-black uppercase leading-none">{product.name}</h1></div><ProductForm product={product} collections={catalog.collections} /></main>;
}
