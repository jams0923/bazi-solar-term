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

        <nav aria-label="主要入口" style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          <Link href="/">首頁</Link>
          <Link href="/paipan">八字排盤</Link>
          <Link href="/ziwei">紫微斗數</Link>
          <Link href="/explore">城市探索</Link>
        </nav>
      </div>
    </header>
  );
}