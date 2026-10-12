import { Solar } from 'lunar-typescript';
import { solarAt } from '@/lib/birthTime';
export type SolarTermName =
  | '小寒'
  | '大寒'
  | '立春'
  | '雨水'
  | '驚蟄'
  | '春分'
  | '清明'
  | '穀雨'
  | '立夏'
  | '小滿'
  | '芒種'
  | '夏至'
  | '小暑'
  | '大暑'
  | '立秋'
  | '處暑'
  | '白露'
  | '秋分'
  | '寒露'
  | '霜降'
  | '立冬'
  | '小雪'
  | '大雪'
  | '冬至';
export const termNames: SolarTermName[] = [
  '小寒',
  '大寒',
  '立春',
  '雨水',
  '驚蟄',
  '春分',
  '清明',
  '穀雨',
  '立夏',
  '小滿',
  '芒種',
  '夏至',
  '小暑',
  '大暑',
  '立秋',
  '處暑',
  '白露',
  '秋分',
  '寒露',
  '霜降',
  '立冬',
  '小雪',
  '大雪',
  '冬至',
];
export interface SolarTermPoint {
  name: SolarTermName;
  month: number;
  day: number;
  timestamp: number;
  source: { kind: 'estimate'; library: string; url: string };
}
// lunar-typescript astronomical formulas produce Chinese-calendar UTC+8 civil times.
// These are algorithm estimates, not an imported official almanac.
export function getSolarTermsForYear(year: number): SolarTermPoint[] {
  const table = Solar.fromYmd(year, 7, 1).getLunar().getJieQiTable();
  return termNames
    .map((name) => {
      const key =
        (
          { 驚蟄: '惊蛰', 穀雨: '谷雨', 小滿: '小满', 芒種: '芒种', 處暑: '处暑' } as Record<
            string,
            string
          >
        )[name] || name;
      const solar = name === '冬至' ? table.DONG_ZHI : table[key];
      return {
        name,
        month: solar.getMonth(),
        day: solar.getDay(),
        timestamp: Date.parse(solar.toYmdHms().replace(' ', 'T') + '+08:00'),
        source: {
          kind: 'estimate' as const,
          library: 'lunar-typescript 1.8.6',
          url: 'https://github.com/6tail/lunar-typescript',
        },
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp);
}
export function getMomentTimestamp(date: string, time = '12:00', offsetMinutes = 480) {
  return Date.parse(`${date}T${time.length === 5 ? time + ':00' : time}Z`) - offsetMinutes * 60000;
}
export function getSurroundingSolarTerms(date: string, time = '12:00', offsetMinutes = 480) {
  const year = Number(date.slice(0, 4));
  const moment = getMomentTimestamp(date, time, offsetMinutes);
  const terms = [year - 1, year, year + 1]
    .flatMap(getSolarTermsForYear)
    .sort((a, b) => a.timestamp - b.timestamp);
  let index = 0;
  for (let i = 0; i < terms.length; i++) if (terms[i].timestamp <= moment) index = i;
  return {
    previous: terms[index - 1] || terms[index],
    current: terms[index],
    next: terms[index + 1] || terms[index],
  };
}
export function getJieTermsForRange(year: number) {
  return [year - 1, year, year + 1]
    .flatMap(getSolarTermsForYear)
    .filter((t) => termNames.indexOf(t.name) % 2 === 0)
    .sort((a, b) => a.timestamp - b.timestamp);
}
export function getCurrentJieForMonthPillar(date: string, time = '12:00', offsetMinutes = 480) {
  return getJieTermsForRange(Number(date.slice(0, 4)))
    .filter((t) => t.timestamp <= getMomentTimestamp(date, time, offsetMinutes))
    .at(-1)!;
}
export function getSolarTermByName(year: number, name: SolarTermName) {
  return getSolarTermsForYear(year).find((t) => t.name === name);
}
export function buildSolarTermDisplay(date: string, time = '12:00', offsetMinutes = 480) {
  const { previous, current, next } = getSurroundingSolarTerms(date, time, offsetMinutes);
  return {
    previous: previous.name,
    current: current.name,
    next: next.name,
    note: 'lunar-typescript 天文公式估算交節瞬間（以 UTC+8 曆表時刻轉 UTC）；未匯入官方曆表，邊界請再核對。',
  };
}
export { solarAt };
