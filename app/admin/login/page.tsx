import { redirect } from 'next/navigation';
import { getAdminSession, getConfiguredAdminEmail } from '@/lib/admin/auth';
import AdminLoginForm from './AdminLoginForm';

export const metadata = { title: 'Admin Login | Future Stitch' };
export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect('/admin');
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#f5f3ee] px-4 py-16 text-black">
      <section className="mx-auto max-w-md border-[3px] border-black bg-white p-6 shadow-[7px_7px_0_#111] sm:p-9">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#dc2626]">Restricted manuscript // 管理者</p>
        <h1 className="mt-3 text-4xl font-black uppercase leading-none">Admin entry.</h1>
        <p className="mb-7 mt-4 text-sm leading-relaxed text-stone-600">Only the configured store administrator can enter. Customer accounts are not enabled.</p>
        <AdminLoginForm email={getConfiguredAdminEmail()} />
      </section>
    </main>
  );
}
