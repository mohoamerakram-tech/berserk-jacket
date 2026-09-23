import Link from 'next/link';
import { requireAdmin } from '@/lib/admin/auth';
import AdminLogoutButton from '../components/AdminLogoutButton';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f1efe9] text-black">
      <header className="border-b-[3px] border-black bg-black px-4 py-4 text-white sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div><p className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-red-500">Restricted atelier // 管理画面</p><Link href="/admin" className="text-2xl font-black uppercase leading-none">Future Stitch Admin</Link></div>
          <nav aria-label="Admin navigation" className="flex flex-wrap items-center gap-2 font-mono text-[10px] font-black uppercase tracking-wider">
            <Link href="/admin" className="border-2 border-white px-3 py-2 hover:bg-white hover:text-black">Overview</Link>
            <Link href="/admin/collections" className="border-2 border-white px-3 py-2 hover:bg-white hover:text-black">Collections</Link>
            <Link href="/admin/products" className="border-2 border-white px-3 py-2 hover:bg-white hover:text-black">Products</Link>
            <Link href="/admin/logos" className="border-2 border-white px-3 py-2 hover:bg-white hover:text-black">Studio logos</Link>
            <Link href="/" target="_blank" className="border-2 border-stone-500 px-3 py-2 text-stone-300 hover:border-white hover:text-white">View store ↗</Link>
            <AdminLogoutButton />
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="mb-6 font-mono text-[10px] text-stone-500">SIGNED IN AS {admin.email}</p>
        {children}
      </div>
    </div>
  );
}
