import type { ReactNode } from 'react';

export function Alert({
  children,
  tone = 'error',
}: {
  children: ReactNode;
  tone?: 'error' | 'success';
}) {
  const colors =
    tone === 'error'
      ? 'border-orvian-red/50 bg-orvian-red/15 text-red-200'
      : 'border-orvian-gold/50 bg-orvian-gold/15 text-orvian-gold';
  return (
    <div role="alert" className={`rounded-xl border px-4 py-3 ${colors}`}>
      {children}
    </div>
  );
}
