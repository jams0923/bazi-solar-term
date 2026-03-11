import Link from 'next/link';

export default function SiteHeader() {
  return (
    <header style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div
        className="container"
        style={{
          minHeight: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <Link href="/" style={{ fontWeight: 800, letterSpacing: '0.04em' }}>
          四柱八字 × 節氣分析
        </Link>

        <nav style={{ display: 'flex', gap: 18 }}>
          <Link href="/">首頁</Link>
          <Link href="/paipan">開始排盤</Link>
          <Link href="/result">結果示意</Link>
        </nav>
      </div>
    </header>
  );
}