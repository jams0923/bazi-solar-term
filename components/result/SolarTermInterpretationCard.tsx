import type { BirthSolarTermContext } from '@/lib/birthSolarTermContext';
import type { SolarTermMeta } from '@/types/solarTerm';

const LABELS = [
  { key: 'previous', label: '出生前相鄰節氣', note: '供對照季節轉換；不是出生前的人生經歷。' },
  { key: 'current', label: '出生當時節氣', note: '依輸入的出生時間所落入的節氣。' },
  { key: 'next', label: '出生後相鄰節氣', note: '供對照下一個節氣；不是未來事件預測。' },
] as const;

function TermCard({ term, label, note }: { term: SolarTermMeta; label: string; note: string }) {
  return (
    <article className="solar-interpretation-subcard">
      <span className="solar-interpretation-subcard-eyebrow">{label}</span>
      <h3 className="solar-interpretation-subcard-title">{term.name}</h3>
      <p className="solar-interpretation-subcard-subtitle">{note}</p>
      <div className="solar-interpretation-panel">
        <strong>資料標籤</strong>
        <p>{term.season}季 · {term.phase} · 文化象徵五行「{term.element}」{term.subElement ? `／${term.subElement}` : ''}</p>
        <p>節奏關鍵字：{term.energyPattern.join('、')}</p>
      </div>
    </article>
  );
}

export default function SolarTermInterpretationCard({ context }: { context: BirthSolarTermContext }) {
  return (
    <section className="solar-interpretation-card" aria-labelledby="birth-terms-title">
      <div className="solar-interpretation-header">
        <div className="solar-interpretation-header-main">
          <span className="badge">出生節氣對照</span>
          <h2 className="solar-interpretation-title" id="birth-terms-title">出生時的節氣位置</h2>
          <p className="solar-interpretation-intro">這裡顯示出生時間前後相鄰的節氣，方便核對排盤所用的時節。關鍵字是文化象徵，不是所在地實際氣候，也不表示現在正在經歷這些節氣。</p>
        </div>
      </div>
      <div className="solar-interpretation-grid">
        {LABELS.map(({ key, label, note }) => <TermCard key={key} term={context[key]} label={label} note={note} />)}
      </div>
      <div className="bazi-interpretation-evidence">
        <strong>這張盤如何對照</strong>
        <p>出生節氣：{context.current.name}（象徵五行{context.current.element}）；月支：{context.monthBranch}；日干：{context.dayMaster}（{context.dayElement}）。{context.relation}此為元素間的傳統象徵關係，沒有據此推斷個性、運勢或健康。</p>
      </div>
    </section>
  );
}
