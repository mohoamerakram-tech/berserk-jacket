import { revalidatePath } from 'next/cache';
import { assertSameOrigin, requireAdminApi } from '@/lib/admin/auth';
import { productFromForm } from '@/lib/admin/catalog-input';
import { getCatalogState, saveCatalogState } from '@/lib/catalog/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!(await requireAdminApi())) return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  if (!(await assertSameOrigin())) return Response.json({ error: 'Invalid request origin.' }, { status: 403 });
  try {
    const form = await request.formData();
    const product = await productFromForm(form);
    const catalog = await getCatalogState();
    if (!catalog.collections.some((collection) => collection.id === product.collectionId)) {
      return Response.json({ error: 'Choose a valid collection.' }, { status: 400 });
    }
    if (catalog.products.some((item) => item.slug === product.slug)) {
      return Response.json({ error: 'A product already uses this slug.' }, { status: 409 });
    }
    if (product.sku && catalog.products.some((item) => item.sku?.toLowerCase() === product.sku?.toLowerCase())) {
      return Response.json({ error: 'A product already uses this SKU.' }, { status: 409 });
    }
    catalog.products.push(product);
    await saveCatalogState(catalog);
    revalidatePath('/shop');
    revalidatePath(`/shop/${product.slug}`);
    return Response.json({ ok: true, id: product.id, slug: product.slug }, { status: 201 });
  } catch (failure) {
    console.error('[admin/products]', failure);
    return Response.json({ error: failure instanceof Error ? failure.message : 'Product could not be saved.' }, { status: 400 });
  }
}
