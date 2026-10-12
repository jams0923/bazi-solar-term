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
            以城市歷史時差換算出生瞬間，提供八字、紫微兩個獨立入口。排盤約定、公式估算與探索標籤皆明確列出，方便核對与持續觀察。
          </p>

          <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
            <Link href="/paipan" className="btn">
              開始排盤
            </Link>
            <Link href="/ziwei" className="btn btn-secondary">
              紫微斗數
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}