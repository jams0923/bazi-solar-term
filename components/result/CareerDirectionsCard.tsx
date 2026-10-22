import type { CareerOverview } from '@/lib/careerDirections';

export default function CareerDirectionsCard({ overview }: { overview: CareerOverview }) {
  return (
    <section className="career-card" aria-labelledby="career-title">
      <div className="career-intro">
        <span className="badge">依本次命盤生成</span>
        <h2 id="career-title">可以先探索的職業方向</h2>
        <p>從四柱的明干十神與地支藏干，整理三種工作主題。每張卡片都列出實際讀到的依據；順序只是本站規則的探索次序，並非能力排名或錄取機率。</p>
      </div>
      <div className="career-basis">
        <strong>這張盤如何連到職業方向</strong>
        <p>{overview.chartBasis}</p>
        <p>{overview.combination}</p>
      </div>
      <div className="career-grid">
        {overview.directions.map((direction, index) => (
          <article className="career-direction" key={direction.title}>
            <span className="career-order">探索方向 {index + 1}</span>
            <h3>{direction.title}</h3>
            <p><strong>可以了解的職務：</strong>{direction.roles.join('、')}</p>
            <p>{direction.reason}</p>
            <div className="career-evidence">
              <strong>這張命盤的依據</strong>
              <ul>
                {direction.evidence.length ? direction.evidence.map((source) => <li key={source}>{source}</li>) : <li>本項沒有直接十神訊號，僅供拓展探索。</li>}
              </ul>
            </div>
            <p className="career-check"><strong>自己檢核：</strong>{direction.check}</p>
          </article>
        ))}
      </div>
      <p className="career-note">十神是傳統命理的描述語言，不能證明天分或決定職涯。選擇職業仍需比較興趣、技能、作品、工作條件與當地機會；城市氣候配對不參與此處排序。</p>
    </section>
  );
}
