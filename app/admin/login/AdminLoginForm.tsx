'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginForm({ email }: { email: string }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setPending(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.get('email'), password: form.get('password') }),
    });
    const result = await response.json().catch(() => ({})) as { error?: string };
    if (!response.ok) {
      setError(result.error || 'Login failed.');
      setPending(false);
      return;
    }
    router.replace('/admin');
    router.refresh();
  }

  return (
    <form action="/api/admin/login" method="post" onSubmit={submit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="admin-email" className="mb-2 block font-mono text-[10px] font-black uppercase tracking-widest">Administrator email</label>
        <input id="admin-email" name="email" type="email" defaultValue={email} autoComplete="username" required className="w-full border-2 border-black bg-white px-4 py-3 font-mono text-sm outline-none focus:shadow-[3px_3px_0_#dc2626]" />
      </div>
      <div>
        <label htmlFor="admin-password" className="mb-2 block font-mono text-[10px] font-black uppercase tracking-widest">Password</label>
        <input id="admin-password" name="password" type="password" autoComplete="current-password" required className="w-full border-2 border-black bg-white px-4 py-3 font-mono text-sm outline-none focus:shadow-[3px_3px_0_#dc2626]" />
      </div>
      {error && <p role="alert" className="border-2 border-[#dc2626] bg-red-50 p-3 font-mono text-xs font-bold text-[#a00]">{error}</p>}
      <button type="submit" disabled={pending} className="w-full border-2 border-black bg-black px-5 py-3 font-mono text-xs font-black uppercase tracking-widest text-white shadow-[4px_4px_0_#dc2626] transition hover:bg-stone-800 disabled:cursor-wait disabled:opacity-60">
        {pending ? 'VERIFYING…' : 'ENTER ADMIN PANEL →'}
      </button>
    </form>
  );
}
