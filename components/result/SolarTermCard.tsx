import type { BaziResult } from '@/types/bazi';

export default function SolarTermCard({ result }: { result: BaziResult }) {
  if (!result.solarTerm) return null;

  return (
    <div className="card right-panel-card solar-term-card">
      <div className="right-card-head">
        <h2 className="title-lg" style={{ marginBottom: 0 }}>
          節氣分析
        </h2>
      </div>

      <div className="solar-term-list">
        <div className="solar-term-item">
          <span className="solar-term-label">當前節氣</span>
          <span className="solar-term-value">{result.solarTerm.current}</span>
        </div>

        <div className="solar-term-item">
          <span className="solar-term-label">前一節氣</span>
          <span className="solar-term-value">{result.solarTerm.previous}</span>
        </div>

        <div className="solar-term-item">
          <span className="solar-term-label">下一節氣</span>
          <span className="solar-term-value">{result.solarTerm.next}</span>
        </div>
      </div>

      <p className="solar-term-note">{result.solarTerm.note}</p>
    </div>
  );
}