import { getSurroundingSolarTerms } from '@/lib/solarTerm';
import type { BaziResult } from '@/types/bazi';
export default function ChartContext({ result }: { result: BaziResult }) {
  const terms = getSurroundingSolarTerms(
    result.calendar.solar,
    result.birthTime,
    result.timing.offset
  );
  return (
    <div className="card birth-panel">
      <h2>曆法、時間與寒熱燥濕</h2>
      <p>
        國曆 {result.calendar.solar} ／農曆 {result.calendar.lunar}
      </p>
      <p>
        歷史時區 {result.timing.timeZone}；UTC 時差 {result.timing.offset} 分鐘；出生瞬間{' '}
        {result.timing.instant}
      </p>
      <p>
        排盤時鐘 {result.timing.chartDate} {result.timing.chartTime}；真太陽時修正{' '}
        {result.timing.correctionMinutes.toFixed(2)} 分鐘；{result.timing.dayRollover} 換日。
      </p>
      <p>
        寒熱 {result.climate.heat}（負寒／正熱）；乾濕 {result.climate.moisture}（負燥／正濕）
      </p>
      <ul>
        {result.climate.reasons.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
      <p>
        目前交節：{terms.current.name} {new Date(terms.current.timestamp).toISOString()}
        （UTC，公式估算）；下一交節：{terms.next.name}{' '}
        {new Date(terms.next.timestamp).toISOString()}（UTC，公式估算）。
      </p>
      <p className="text-muted">
        農曆依出生地民用日期對照中國曆法，不改用出生瞬間的 UTC+8 日期。節氣與農曆採 lunar-typescript
        公式曆法，未標為官方曆表；寒熱燥濕為探索指標，不是實測體感或健康評估。
      </p>
      {result.timing.warnings.length > 0 && (
        <ul className="timing-note">
          {result.timing.warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
