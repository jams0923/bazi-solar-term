import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="card" style={{ padding: 32 }}>
          <span className="badge">MVP / Next.js / 無資料庫</span>
          <h1 className="title-xl" style={{ marginTop: 18 }}>
            以四柱八字結合節氣資訊，
            <br />
            呈現更完整的命盤分析入口
          </h1>
          <p
            className="text-muted"
            style={{ maxWidth: 760, fontSize: 17, lineHeight: 1.8 }}
          >
            第一版先聚焦於網站流程、排盤表單、結果頁呈現與節氣分析區塊。先建立可部署、可展示、可持續擴充的專案骨架，之後再逐步加入真正的四柱排盤與節氣演算法。
          </p>

          <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
            <Link href="/paipan" className="btn">
              開始排盤
            </Link>
            <Link href="/result" className="btn btn-secondary">
              查看結果示意
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}