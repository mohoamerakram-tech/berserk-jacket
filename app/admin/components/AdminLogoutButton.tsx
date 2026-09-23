'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminLogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  return (
    <button type="button" disabled={pending} onClick={async () => {
      setPending(true);
      await fetch('/api/admin/login', { method: 'DELETE' });
      router.replace('/admin/login');
      router.refresh();
    }} className="border-2 border-white px-3 py-2 font-mono text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black disabled:opacity-50">
      {pending ? 'Leaving…' : 'Sign out'}
    </button>
  );
}
