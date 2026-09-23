'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteButton({ endpoint, label, redirectTo }: { endpoint: string; label: string; redirectTo?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  return (
    <div>
      <button type="button" disabled={pending} onClick={async () => {
        if (!window.confirm(`Remove ${label}? This removes it from the customer-facing store.`)) return;
        setPending(true);
        setError('');
        const response = await fetch(endpoint, { method: 'DELETE' });
        const result = await response.json().catch(() => ({})) as { error?: string };
        if (!response.ok) {
          setError(result.error || 'Could not remove this item.');
          setPending(false);
          return;
        }
        if (redirectTo) router.push(redirectTo);
        router.refresh();
      }} className="border-2 border-[#dc2626] px-3 py-2 font-mono text-[10px] font-black uppercase tracking-widest text-[#dc2626] hover:bg-[#dc2626] hover:text-white disabled:opacity-50">
        {pending ? 'Removing…' : 'Remove'}
      </button>
      {error && <p role="alert" className="mt-2 max-w-xs font-mono text-[10px] text-red-700">{error}</p>}
    </div>
  );
}
