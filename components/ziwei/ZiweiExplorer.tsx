'use client';
import { useRef, useState } from 'react';
import BirthForm from '@/components/paipan/BirthForm';
import { calculateZiwei, type ZiweiResult } from '@/lib/ziwei';
import {
  combinationMeaning,
  palaceMeanings,
  starMeanings,
  mutagenMeanings,
} from '@/data/ziweiMeanings';
export default function ZiweiExplorer() {
  const [result, setResult] = useState<ZiweiResult>();
  const [explanation, setExplanation] = useState({ title: '', lines: [] as string[] });
  const dialog = useRef<HTMLDialogElement>(null);
  function explain(title: string, lines: string[]) {
    setExplanation({ title, lines });
    dialog.current?.showModal();
  }
  const positions = [
    [1, 4],
    [1, 3],
    [1, 2],
    [1, 1],
    [2, 1],
    [3, 1],
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4],
    [3, 4],
    [2, 4],
  ];
  return (
    <>
      <BirthForm mode="ziwei" onCalculate={(input) => setResult(calculateZiwei(input))} />
      {result && (
        <div className="chart-output">
          <h1>紫微十二宮命盤</h1>
          <div className="card birth-panel">
            <p>
              國曆 {result.solar} ／農曆 {result.lunar}
            </p>
            <p>{result.convention}</p>
            <p>
              出生瞬間 {result.timing.instant}；UTC 時差 {result.timing.offset} 分鐘；排盤時鐘{' '}
              {result.timing.chartDate} {result.timing.chartTime}
            </p>
            {result.timing.warnings.map((w) => (
              <p key={w} className="timing-note">
                {w}
              </p>
            ))}
            <p>
              國農曆按排盤時鐘的民用日期查中國曆法；換日約定與真太陽時可能改變排盤农曆日。公式計算未匯入官方曆表。宮位與星曜可點選查看；大限為虛歲十年區間，不是事件保證。
            </p>
          </div>
          <div className="ziwei-grid">
            <div className="ziwei-center">
              <h2>{result.chart.fiveElementsClass}</h2>
              <p>
                命宮 {result.chart.earthlyBranchOfSoulPalace}
                <br />
                身宮 {result.chart.earthlyBranchOfBodyPalace}
              </p>
              <p>
                點宮位、星曜與四化
                <br />
                查看個別與組合解讀
              </p>
            </div>
            {result.chart.palaces.map((p) => {
              const branch = '子丑寅卯辰巳午未申酉戌亥'.indexOf(p.earthlyBranch);
              const [row, col] = positions[branch];
              const lines = combinationMeaning(
                p.name,
                p.majorStars.map((s) => s.name),
                p.minorStars.map((s) => s.name)
              );
              return (
                <article
                  key={p.index}
                  className="card ziwei-palace"
                  style={{ gridRow: row, gridColumn: col }}
                >
                  <button
                    className="palace-title"
                    onClick={() =>
                      explain(p.name, [palaceMeanings[p.name] || '此宮的生活議題', ...lines])
                    }
                  >
                    {p.name} {p.isBodyPalace ? '· 身宮' : ''} · {p.heavenlyStem}
                    {p.earthlyBranch}
                  </button>
                  <div>
                    {[...p.majorStars, ...p.minorStars].map((star) => (
                      <span className="star-group" key={star.name}>
                        <button
                          className="star-button"
                          onClick={() => {
                            const meaning = starMeanings[star.name];
                            explain(
                              `${star.name} · ${p.name}`,
                              meaning
                                ? [
                                    `象徵：${meaning.theme}`,
                                    `可能限制：${meaning.limit}`,
                                    `觀察：${meaning.observe}`,
                                    ...lines,
                                  ]
                                : ['此星暫無逐星解讀，不作未核實的推斷。', ...lines]
                            );
                          }}
                        >
                          {star.name}
                          {star.brightness ? `（${star.brightness}）` : ''}
                        </button>
                        {star.mutagen && (
                          <button
                            className="mutation-button"
                            onClick={() =>
                              explain(`${star.name}化${star.mutagen} · ${p.name}`, [
                                mutagenMeanings[star.mutagen || ''] || '四化象徵',
                                `本命生年四化，落在${p.name}；${palaceMeanings[p.name] || '觀察此宮議題'}。`,
                                ...lines,
                              ])
                            }
                          >
                            {star.mutagen}
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  {!p.majorStars.length && <p className="text-muted">無主星 · 需參看對宮</p>}
                  <p className="palace-age">大限 {p.decadal.range.join('–')} 虛歲</p>
                </article>
              );
            })}
          </div>
        </div>
      )}
      <dialog ref={dialog} className="explanation-dialog" aria-labelledby="explanation-title">
        <div className="dialog-head">
          <h2 id="explanation-title">{explanation.title}</h2>
          <button autoFocus className="btn" onClick={() => dialog.current?.close()}>
            關閉
          </button>
        </div>
        {explanation.lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </dialog>
    </>
  );
}
