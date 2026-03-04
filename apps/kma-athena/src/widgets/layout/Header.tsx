'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header
      style={{
        borderBottom: '1px solid #dce4ef',
        background: '#fff',
      }}
    >
      <div
        style={{
          width: 'min(1120px, 92%)',
          margin: '0 auto',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <strong style={{ color: '#0b3c5d' }}>KMA Athena</strong>
        <nav style={{ display: 'flex', gap: 16, fontSize: 14 }}>
          <Link href="/">메인</Link>
          <Link href="/sub">서브</Link>
        </nav>
      </div>
    </header>
  );
}
