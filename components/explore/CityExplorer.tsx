'use client';
import { useState } from 'react';
import { cities } from '@/data/cities';
import { scoreCity, countrySummaries } from '@/lib/exploration';
export default function CityExplorer({ chart }: { chart?: { heat: number; moisture: number } }) {
  const [heat, setHeat] = useState(0);
  const [moisture, setMoisture] = useState(0);
  const input = chart || { heat, moisture };
  return (
    <section className="explore-section">
      <h2>城市與國家探索</h2>
      <p className="text-muted">
        以下全部為人工探索標籤，尚無共同觀測期間的逐城氣候常值；正式氣候計分暫未啟用。8
        分制只是規則試算，不是適居機率。命盤互補也未經科學驗證，移居仍需考量簽證、語言、費用與實際生活。
      </p>
      {!chart && (
        <div className="birth-grid">
          <label>
            探索命盤寒熱（−3..3）
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
            探索命盤乾濕（−3..3）
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
        {cities.map((city) => {
          const score = scoreCity(city, input);
          return (
            <article key={city.id} className="card birth-panel">
              <h3>
                {city.country} · {city.name}
              </h3>
              <span className="badge">探索狀態／人工標籤</span>
              <p>
                寒熱 {city.heat}（負寒／正熱），乾濕 {city.moisture}（負乾／正濕）
              </p>
              <p>來源：{city.tagSource}</p>
              <ol>
                {score.reasons.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ol>
              <p>正式分數：{score.formalScore ?? '尚未核驗，不計入正式分數'}</p>
            </article>
          );
        })}
      </div>
      <h3>只彙整已收錄城市</h3>
      <div className="explore-grid">
        {countrySummaries(input).map((c) => (
          <article key={c.country} className="card birth-panel">
            <h4>{c.country}</h4>
            <p>
              樣本：{c.included.join('、')}（{c.included.length} 城）
            </p>
            <p>探索均分 {c.mean.toFixed(2)} / 8；僅代表這些城市，不能代表整個國家。</p>
          </article>
        ))}
      </div>
      <div className="card birth-panel">
        <h3>職業探索（獨立於城市分數）</h3>
        <p>
          請以技能、興趣、工作條件與可取得機會比較職業，不從命盤判定適職，也不使用城市氣候分數排序職業。
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
