import type { BaziResult } from '@/types/bazi';
import { FIVE_ELEMENT_META } from '@/lib/fiveElementColors';

export default function FiveElementsCard({ result }: { result: BaziResult }) {
  const rows = [
    { key: 'wood', label: '木', value: result.fiveElements.wood },
    { key: 'fire', label: '火', value: result.fiveElements.fire },
    { key: 'earth', label: '土', value: result.fiveElements.earth },
    { key: 'metal', label: '金', value: result.fiveElements.metal },
    { key: 'water', label: '水', value: result.fiveElements.water },
  ] as const;

  return (
    <div className="card right-panel-card five-elements-card">
      <div className="right-card-head">
        <h2 className="title-lg" style={{ marginBottom: 0 }}>
          五行分布
        </h2>
      </div>

      <div className="five-elements-list">
        {rows.map((row) => {
          const meta = FIVE_ELEMENT_META[row.key];

          return (
            <div key={row.key} className="five-element-row">
              <div className="five-element-row-head">
                <span
                  className="five-element-name"
                  style={{ color: meta.color }}
                >
                  {row.label}
                </span>
                <span className="five-element-value">{row.value}%</span>
              </div>

              <div className="five-element-bar-track">
                <div
                  className="five-element-bar-fill"
                  style={{
                    width: `${row.value}%`,
                    background: `linear-gradient(90deg, ${meta.color}, ${meta.color})`,
                    boxShadow: `0 0 12px ${meta.color}22`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}