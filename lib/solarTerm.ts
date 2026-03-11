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

export interface SolarTermPoint {
  name: SolarTermName;
  month: number;
  day: number;
  timestamp: number;
}

type SolarTermRule = {
  name: SolarTermName;
  month: number;
  c20: number;
  c21: number;
};

const D = 0.2422;

/**
 * 24 節氣近似公式版
 * - 20 世紀 / 21 世紀使用不同常數
 * - 可作為八字網站第二版邏輯
 * - 已比固定日期法更合理
 * - 仍非天文級精確交節時刻
 */
const SOLAR_TERM_RULES: SolarTermRule[] = [
  { name: '小寒', month: 1, c20: 6.11, c21: 5.4055 },
  { name: '大寒', month: 1, c20: 20.84, c21: 20.12 },
  { name: '立春', month: 2, c20: 4.6295, c21: 3.87 },
  { name: '雨水', month: 2, c20: 19.4599, c21: 18.73 },
  { name: '驚蟄', month: 3, c20: 6.3826, c21: 5.63 },
  { name: '春分', month: 3, c20: 21.4155, c21: 20.646 },
  { name: '清明', month: 4, c20: 5.59, c21: 4.81 },
  { name: '穀雨', month: 4, c20: 20.888, c21: 20.1 },
  { name: '立夏', month: 5, c20: 6.318, c21: 5.52 },
  { name: '小滿', month: 5, c20: 21.86, c21: 21.04 },
  { name: '芒種', month: 6, c20: 6.5, c21: 5.678 },
  { name: '夏至', month: 6, c20: 22.2, c21: 21.37 },
  { name: '小暑', month: 7, c20: 7.928, c21: 7.108 },
  { name: '大暑', month: 7, c20: 23.65, c21: 22.83 },
  { name: '立秋', month: 8, c20: 8.35, c21: 7.5 },
  { name: '處暑', month: 8, c20: 23.95, c21: 23.13 },
  { name: '白露', month: 9, c20: 8.44, c21: 7.646 },
  { name: '秋分', month: 9, c20: 23.822, c21: 23.042 },
  { name: '寒露', month: 10, c20: 9.098, c21: 8.318 },
  { name: '霜降', month: 10, c20: 24.218, c21: 23.438 },
  { name: '立冬', month: 11, c20: 8.218, c21: 7.438 },
  { name: '小雪', month: 11, c20: 23.08, c21: 22.36 },
  { name: '大雪', month: 12, c20: 7.9, c21: 7.18 },
  { name: '冬至', month: 12, c20: 22.6, c21: 21.94 },
];

/**
 * 特定年份修正表
 * 若之後你測到某幾年某節氣有 ±1 天偏差，
 * 可直接在這裡補修正值。
 *
 * key 格式：`${year}-${termName}`
 * value：加減的天數
 */
const TERM_DAY_CORRECTIONS: Record<string, number> = {
  // 範例：
  // '2026-立春': 1,
};

function getCenturyConstant(year: number, rule: SolarTermRule) {
  return year >= 2001 ? rule.c21 : rule.c20;
}

function getLeapAdjust(year: number, month: number) {
  const y = year % 100;

  // 小寒、大寒、立春、雨水在 3/1 前，修正採 (Y - 1) / 4
  if (month === 1 || month === 2) {
    return Math.floor((y - 1) / 4);
  }

  return Math.floor(y / 4);
}

function getSolarTermDay(year: number, rule: SolarTermRule) {
  const y = year % 100;
  const c = getCenturyConstant(year, rule);
  const baseDay = Math.floor(y * D + c) - getLeapAdjust(year, rule.month);
  const correction = TERM_DAY_CORRECTIONS[`${year}-${rule.name}`] ?? 0;

  return baseDay + correction;
}

function toTimestamp(year: number, month: number, day: number) {
  // 用 UTC 避免部署環境時區干擾
  return Date.UTC(year, month - 1, day, 12, 0, 0);
}

export function getSolarTermsForYear(year: number): SolarTermPoint[] {
  return SOLAR_TERM_RULES.map((rule) => {
    const day = getSolarTermDay(year, rule);

    return {
      name: rule.name,
      month: rule.month,
      day,
      timestamp: toTimestamp(year, rule.month, day),
    };
  }).sort((a, b) => a.timestamp - b.timestamp);
}

export function getMomentTimestamp(dateStr: string, timeStr = '12:00') {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);

  return Date.UTC(
    year,
    month - 1,
    day,
    Number.isFinite(hour) ? hour : 12,
    Number.isFinite(minute) ? minute : 0,
    0
  );
}

export function getSurroundingSolarTerms(dateStr: string, timeStr = '12:00') {
  const [year] = dateStr.split('-').map(Number);
  const moment = getMomentTimestamp(dateStr, timeStr);

  const terms = [
    ...getSolarTermsForYear(year - 1),
    ...getSolarTermsForYear(year),
    ...getSolarTermsForYear(year + 1),
  ].sort((a, b) => a.timestamp - b.timestamp);

  let currentIndex = 0;

  for (let i = 0; i < terms.length; i += 1) {
    if (terms[i].timestamp <= moment) {
      currentIndex = i;
    } else {
      break;
    }
  }

  const current = terms[currentIndex];
  const previous = terms[currentIndex - 1] ?? current;
  const next = terms[currentIndex + 1] ?? current;

  return {
    previous,
    current,
    next,
  };
}

/**
 * 八字月柱切換是看 12 個「節」：
 * 立春、驚蟄、清明、立夏、芒種、小暑、
 * 立秋、白露、寒露、立冬、大雪、小寒
 */
export function getJieTermsForRange(year: number) {
  const all = [
    ...getSolarTermsForYear(year - 1),
    ...getSolarTermsForYear(year),
    ...getSolarTermsForYear(year + 1),
  ];

  const jieNames: SolarTermName[] = [
    '立春',
    '驚蟄',
    '清明',
    '立夏',
    '芒種',
    '小暑',
    '立秋',
    '白露',
    '寒露',
    '立冬',
    '大雪',
    '小寒',
  ];

  return all
    .filter((item) => jieNames.includes(item.name))
    .sort((a, b) => a.timestamp - b.timestamp);
}

export function getCurrentJieForMonthPillar(
  dateStr: string,
  timeStr = '12:00'
) {
  const [year] = dateStr.split('-').map(Number);
  const moment = getMomentTimestamp(dateStr, timeStr);
  const jieTerms = getJieTermsForRange(year);

  let current = jieTerms[0];

  for (const item of jieTerms) {
    if (item.timestamp <= moment) {
      current = item;
    } else {
      break;
    }
  }

  return current;
}

export function buildSolarTermDisplay(dateStr: string, timeStr = '12:00') {
  const { previous, current, next } = getSurroundingSolarTerms(dateStr, timeStr);

  return {
    current: current.name,
    previous: previous.name,
    next: next.name,
    note: '目前採年份動態節氣推算，已比固定日期法更接近正式八字網站；若要再提升，下一步可改成精確交節時刻演算法。',
  };
}

export function getSolarTermByName(year: number, name: SolarTermName) {
  return getSolarTermsForYear(year).find((item) => item.name === name);
}