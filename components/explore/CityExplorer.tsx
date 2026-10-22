'use client';
import { useState } from 'react';
import { cities } from '@/data/cities';
import { scoreCity, countrySummaries } from '@/lib/exploration';
export default function CityExplorer({ chart }: { chart?: { heat: number; moisture: number } }) {
  const [heat, setHeat] = useState(0);
  const [moisture, setMoisture] = useState(0);
  const input = chart || { heat, moisture };
  const rankedCities = cities.map((city) => scoreCity(city, input)).sort((a, b) => b.total - a.total);
  const rankedCountries = countrySummaries(input).sort((a, b) => b.mean - a.mean);
  return (
    <section className="explore-section">
      <h2>城市符合度</h2>
      <p className="text-muted">{chart ? '依本次命盤' : '目前以中性示範值計算，可在下方調整'}排序。百分比是本站寒熱與乾濕規則的探索配對分數，並非適居機率。</p>
      {!chart && (
        <div className="birth-grid">
          <label>
            命盤寒熱傾向（−3 寒～+3 熱）
            <input
              type="number"
              min="-3"
              max="3"
              step="0.5"
              value={heat}
              onChange={(e) => setHeat(Math.max(-3, Math.min(3, Number(e.target.value))))}
            />
          </label>
          <label>
            命盤乾濕傾向（−3 燥～+3 濕）
            <input
              type="number"
              min="-3"
              max="3"
              step="0.5"
              value={moisture}
              onChange={(e) => setMoisture(Math.max(-3, Math.min(3, Number(e.target.value))))}
            />
          </label>
        </div>
      )}
      <div className="explore-grid">
        {rankedCities.map((score) => (
          <article key={score.city.id} className="card birth-panel city-match-card">
            <div className="city-match-heading">
              <h3>{score.city.country} · {score.city.name}</h3>
              <div className="city-match-score"><strong>{score.percent}%</strong><span>符合度</span></div>
            </div>
            <div className="city-match-track" role="meter" aria-label={`${score.city.name}探索符合度`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={score.percent}>
              <span style={{ width: `${score.percent}%` }} />
            </div>
            <p className="city-match-breakdown">寒熱 {Math.round(score.heat / 4 * 100)}% · 乾濕 {Math.round(score.moisture / 4 * 100)}%</p>
          </article>
        ))}
      </div>
      <h3>國家探索</h3>
      <p className="text-muted">以本站收錄城市的平均符合度排列，不代表整個國家的氣候。</p>
      <div className="explore-grid">
        {rankedCountries.map((c) => (
          <article key={c.country} className="card birth-panel country-match-card">
            <div className="city-match-heading"><h4>{c.country}</h4><strong>{c.percent}%</strong></div>
            <p className="text-muted">收錄 {c.included.length} 城：{c.included.join('、')}</p>
          </article>
        ))}
      </div>
      <details className="city-match-method">
        <summary>符合度怎麼算？查看資料說明</summary>
        <p>命盤的寒熱、乾濕兩軸各取相反值，與城市標籤比較；每軸最多 4 分，合計 8 分換算為 0–100%。國家數字是已收錄城市分數的平均。相同標籤的城市會得到相同分數。</p>
        <p>目前城市使用人工探索標籤，尚未用相同期間的逐城氣候觀測常值核驗。這是文化性的配對試算，不能當作科學上的適居機率；遷居也需考慮簽證、工作與生活條件。</p>
      </details>
      <div className="card birth-panel">
        <h3>職業探索（獨立於城市分數）</h3>
        <p>
          八字結果頁會根據十神列出可探索的職業方向與命盤依據。請再以技能、興趣、工作條件與可取得機會比較職業；城市氣候分數不參與職業排序。
        </p>
        <label>
          我想探索的工作條件
          <textarea placeholder="例如：協作方式、工作節奏、薪資需求、需要補足的技能" />
        </label>
        <p className="text-muted">此欄只供本頁整理，不儲存、不上傳，也不影響城市試算。</p>
      </div>
    </section>
  );
}
