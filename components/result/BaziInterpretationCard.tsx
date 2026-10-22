import type { BaziNarrative } from '@/lib/baziNarrative';

export default function BaziInterpretationCard({ result }: { result: BaziNarrative }) {
  return (
    <section className="bazi-interpretation-card" aria-labelledby="bazi-interpretation-title">
      <div className="bazi-interpretation-header">
        <div className="bazi-interpretation-header-main">
          <span className="badge">本次四柱 × 十神來源</span>
          <h2 className="bazi-interpretation-title" id="bazi-interpretation-title">進階命理解讀</h2>
          <p className="bazi-interpretation-intro">{result.introduction}</p>
        </div>
      </div>
      <div className="bazi-interpretation-hero">
        <span className="bazi-interpretation-hero-label">這張盤的閱讀主軸</span>
        <h3 className="bazi-interpretation-hero-title">{result.headline}</h3>
      </div>
      <div className="bazi-interpretation-grid bazi-interpretation-grid-2">
        {result.sections.map((section) => (
          <article className="bazi-interpretation-subcard" key={section.title}>
            <h3 className="bazi-interpretation-section-title">{section.title}</h3>
            <p className="bazi-interpretation-reading">{section.reading}</p>
            <div className="bazi-interpretation-evidence">
              <strong>本次盤面依據</strong>
              <ul>{section.evidence.map((source) => <li key={source}>{source}</li>)}</ul>
            </div>
            <p className="bazi-interpretation-question"><strong>對照自己的經驗：</strong>{section.question}</p>
          </article>
        ))}
      </div>
      <p className="bazi-interpretation-method">{result.method}</p>
    </section>
  );
}
