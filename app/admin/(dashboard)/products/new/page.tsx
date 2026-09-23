import ProductForm from '../../../components/ProductForm';
import { getCatalogState } from '@/lib/catalog/server';

export const metadata = { title: 'Add Product | Future Stitch Admin' };

export default async function NewProductPage() {
  const { collections } = await getCatalogState();
  return <main><div className="mb-7 border-b-[3px] border-black pb-5"><p className="font-mono text-[10px] font-black uppercase tracking-widest text-[#dc2626]">New catalogue entry // 新商品</p><h1 className="mt-2 text-4xl font-black uppercase leading-none">Add constructed product.</h1></div><ProductForm collections={collections} /></main>;
}
