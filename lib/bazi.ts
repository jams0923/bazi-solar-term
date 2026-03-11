import type {
  BaziResult,
  ChartFormInput,
  FiveElements,
  Pillar,
} from '@/types/bazi';
import {
  buildSolarTermDisplay,
  getCurrentJieForMonthPillar,
  getSolarTermByName,
} from '@/lib/solarTerm';
import { getHiddenStemsByBranch } from '@/lib/hiddenStems';
import { buildPillarTenGods } from '@/lib/tenGods';

const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

const STEM_ELEMENTS: Record<string, keyof FiveElements> = {
  甲: 'wood',
  乙: 'wood',
  丙: 'fire',
  丁: 'fire',
  戊: 'earth',
  己: 'earth',
  庚: 'metal',
  辛: 'metal',
  壬: 'water',
  癸: 'water',
};

const BRANCH_ELEMENTS: Record<string, keyof FiveElements> = {
  子: 'water',
  丑: 'earth',
  寅: 'wood',
  卯: 'wood',
  辰: 'earth',
  巳: 'fire',
  午: 'fire',
  未: 'earth',
  申: 'metal',
  酉: 'metal',
  戌: 'earth',
  亥: 'water',
};

const ELEMENT_LABELS: Record<keyof FiveElements, string> = {
  wood: '木',
  fire: '火',
  earth: '土',
  metal: '金',
  water: '水',
};

/**
 * 路線 2 核心修正：
 * 1. 支援子時換日（23:00 後視為下一日）
 * 2. 加入日柱校正值，讓結果更接近常見八字網站
 *
 * 說明：
 * - 不同流派對子時換日有差異
 * - 這裡先採「晚子時換日」版本
 * - DAY_PILLAR_OFFSET 是目前這版的校正參數
 */
const USE_LATE_ZI_DAY_ROLLOVER = true;
const DAY_PILLAR_OFFSET = 2;

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function parseDateParts(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return { year: y, month: m, day: d };
}

function parseTimeParts(timeStr: string) {
  const [h, min] = timeStr.split(':').map(Number);
  return {
    hour: Number.isFinite(h) ? h : 0,
    minute: Number.isFinite(min) ? min : 0,
  };
}

function getUTCDateNumber(year: number, month: number, day: number) {
  return Date.UTC(year, month - 1, day);
}

function withHiddenStems(pillar: Pillar): Pillar {
  return {
    ...pillar,
    hiddenStems: getHiddenStemsByBranch(pillar.earthlyBranch),
  };
}

function getYearPillar(dateStr: string, timeStr: string): Pillar {
  const { year } = parseDateParts(dateStr);
  const lichun = getSolarTermByName(year, '立春');

  const birthMoment = Date.UTC(
    ...dateStr.split('-').map((n, i) => (i === 1 ? Number(n) - 1 : Number(n))),
    ...timeStr.split(':').map(Number)
  );

  const lichunMoment = lichun
    ? Date.UTC(year, lichun.month - 1, lichun.day, 12, 0, 0)
    : Date.UTC(year, 1, 4, 12, 0, 0);

  const adjustedYear = birthMoment < lichunMoment ? year - 1 : year;

  const stemIndex = mod(adjustedYear - 4, 10);
  const branchIndex = mod(adjustedYear - 4, 12);

  return withHiddenStems({
    heavenlyStem: HEAVENLY_STEMS[stemIndex],
    earthlyBranch: EARTHLY_BRANCHES[branchIndex],
    label: '年柱',
  });
}

function getMonthBranchByJie(dateStr: string, timeStr: string) {
  const currentJie = getCurrentJieForMonthPillar(dateStr, timeStr);

  const mapping: Record<string, string> = {
    立春: '寅',
    驚蟄: '卯',
    清明: '辰',
    立夏: '巳',
    芒種: '午',
    小暑: '未',
    立秋: '申',
    白露: '酉',
    寒露: '戌',
    立冬: '亥',
    大雪: '子',
    小寒: '丑',
  };

  return mapping[currentJie.name];
}

function getMonthPillar(dateStr: string, timeStr: string, yearStem: string): Pillar {
  const monthBranch = getMonthBranchByJie(dateStr, timeStr);

  const monthOrderMap: Record<string, number> = {
    寅: 0,
    卯: 1,
    辰: 2,
    巳: 3,
    午: 4,
    未: 5,
    申: 6,
    酉: 7,
    戌: 8,
    亥: 9,
    子: 10,
    丑: 11,
  };

  const startStemMap: Record<string, number> = {
    甲: 2,
    己: 2,
    乙: 4,
    庚: 4,
    丙: 6,
    辛: 6,
    丁: 8,
    壬: 8,
    戊: 0,
    癸: 0,
  };

  const offset = monthOrderMap[monthBranch];
  const startStemIndex = startStemMap[yearStem];
  const stemIndex = mod(startStemIndex + offset, 10);

  return withHiddenStems({
    heavenlyStem: HEAVENLY_STEMS[stemIndex],
    earthlyBranch: monthBranch,
    label: '月柱',
  });
}

function getAdjustedDayForPillar(dateStr: string, timeStr: string) {
  const { year, month, day } = parseDateParts(dateStr);
  const { hour } = parseTimeParts(timeStr);

  if (!USE_LATE_ZI_DAY_ROLLOVER || hour < 23) {
    return { year, month, day };
  }

  const nextDate = new Date(Date.UTC(year, month - 1, day));
  nextDate.setUTCDate(nextDate.getUTCDate() + 1);

  return {
    year: nextDate.getUTCFullYear(),
    month: nextDate.getUTCMonth() + 1,
    day: nextDate.getUTCDate(),
  };
}

function getDayPillar(dateStr: string, timeStr: string): Pillar {
  const adjusted = getAdjustedDayForPillar(dateStr, timeStr);

  /**
   * 基準日：
   * 1984-02-02 作為甲子日基礎參考
   * 並加入 DAY_PILLAR_OFFSET 校正，讓結果更接近常見八字網站
   */
  const base = getUTCDateNumber(1984, 2, 2);
  const current = getUTCDateNumber(adjusted.year, adjusted.month, adjusted.day);
  const diffDays = Math.floor((current - base) / 86400000) + DAY_PILLAR_OFFSET;

  const stemIndex = mod(diffDays, 10);
  const branchIndex = mod(diffDays, 12);

  return withHiddenStems({
    heavenlyStem: HEAVENLY_STEMS[stemIndex],
    earthlyBranch: EARTHLY_BRANCHES[branchIndex],
    label: '日柱',
  });
}

function getHourBranch(hour: number, minute: number) {
  const totalMinutes = hour * 60 + minute;

  if (totalMinutes >= 23 * 60 || totalMinutes < 1 * 60) return '子';
  if (totalMinutes < 3 * 60) return '丑';
  if (totalMinutes < 5 * 60) return '寅';
  if (totalMinutes < 7 * 60) return '卯';
  if (totalMinutes < 9 * 60) return '辰';
  if (totalMinutes < 11 * 60) return '巳';
  if (totalMinutes < 13 * 60) return '午';
  if (totalMinutes < 15 * 60) return '未';
  if (totalMinutes < 17 * 60) return '申';
  if (totalMinutes < 19 * 60) return '酉';
  if (totalMinutes < 21 * 60) return '戌';
  return '亥';
}

function getHourPillar(timeStr: string, dayStem: string): Pillar {
  const { hour, minute } = parseTimeParts(timeStr);
  const hourBranch = getHourBranch(hour, minute);

  const hourBranchIndex = EARTHLY_BRANCHES.indexOf(
    hourBranch as (typeof EARTHLY_BRANCHES)[number]
  );

  const startStemMap: Record<string, number> = {
    甲: 0,
    己: 0,
    乙: 2,
    庚: 2,
    丙: 4,
    辛: 4,
    丁: 6,
    壬: 6,
    戊: 8,
    癸: 8,
  };

  const startStemIndex = startStemMap[dayStem];
  const stemIndex = mod(startStemIndex + hourBranchIndex, 10);

  return withHiddenStems({
    heavenlyStem: HEAVENLY_STEMS[stemIndex],
    earthlyBranch: hourBranch,
    label: '時柱',
  });
}

function getElementCountsFromPillars(pillars: {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
}): FiveElements {
  const counts: FiveElements = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0,
  };

  const allSymbols = [
    pillars.year.heavenlyStem,
    pillars.year.earthlyBranch,
    pillars.month.heavenlyStem,
    pillars.month.earthlyBranch,
    pillars.day.heavenlyStem,
    pillars.day.earthlyBranch,
    pillars.hour.heavenlyStem,
    pillars.hour.earthlyBranch,
  ];

  for (const symbol of allSymbols) {
    if (symbol in STEM_ELEMENTS) {
      counts[STEM_ELEMENTS[symbol]] += 1;
    } else if (symbol in BRANCH_ELEMENTS) {
      counts[BRANCH_ELEMENTS[symbol]] += 1;
    }
  }

  const total = Object.values(counts).reduce((sum, n) => sum + n, 0) || 1;

  return {
    wood: Math.round((counts.wood / total) * 100),
    fire: Math.round((counts.fire / total) * 100),
    earth: Math.round((counts.earth / total) * 100),
    metal: Math.round((counts.metal / total) * 100),
    water: Math.round((counts.water / total) * 100),
  };
}

function getDayMasterLabel(dayStem: string) {
  const element = STEM_ELEMENTS[dayStem];
  return `${dayStem}${ELEMENT_LABELS[element]}`;
}

function getDominantAndWeakestElement(fiveElements: FiveElements) {
  const entries = Object.entries(fiveElements) as Array<[keyof FiveElements, number]>;
  entries.sort((a, b) => b[1] - a[1]);

  const strongest = entries[0];
  const weakest = entries[entries.length - 1];

  return {
    strongest: strongest[0],
    strongestValue: strongest[1],
    weakest: weakest[0],
    weakestValue: weakest[1],
  };
}

function buildSummary(
  dayMaster: string,
  fiveElements: FiveElements,
  pillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar;
  }
) {
  const { strongest, strongestValue, weakest, weakestValue } =
    getDominantAndWeakestElement(fiveElements);

  return `此命盤目前已採用第二版邏輯：年柱以立春切年，月柱以十二節切換，並加入子時換日與日柱校正。日主為 ${dayMaster}，四柱為 ${pillars.year.heavenlyStem}${pillars.year.earthlyBranch}、${pillars.month.heavenlyStem}${pillars.month.earthlyBranch}、${pillars.day.heavenlyStem}${pillars.day.earthlyBranch}、${pillars.hour.heavenlyStem}${pillars.hour.earthlyBranch}。五行中以 ${ELEMENT_LABELS[strongest]} 相對較強（約 ${strongestValue}%），${ELEMENT_LABELS[weakest]} 相對較弱（約 ${weakestValue}%）。`;
}

export function calculateBazi(input: ChartFormInput): BaziResult {
  const yearPillar = getYearPillar(input.birthDate, input.birthTime);
  const monthPillar = getMonthPillar(
    input.birthDate,
    input.birthTime,
    yearPillar.heavenlyStem
  );
  const dayPillar = getDayPillar(input.birthDate, input.birthTime);
  const hourPillar = getHourPillar(input.birthTime, dayPillar.heavenlyStem);

  const pillars = {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
  };

  const dayStem = dayPillar.heavenlyStem;

  const tenGods = {
    year: buildPillarTenGods(dayStem, yearPillar),
    month: buildPillarTenGods(dayStem, monthPillar),
    day: buildPillarTenGods(dayStem, dayPillar),
    hour: buildPillarTenGods(dayStem, hourPillar),
  };

  const fiveElements = getElementCountsFromPillars(pillars);
  const dayMaster = getDayMasterLabel(dayStem);
  const solarTerm = buildSolarTermDisplay(input.birthDate, input.birthTime);
  const summary = buildSummary(dayMaster, fiveElements, pillars);

  return {
    name: input.name || '命主',
    gender: input.gender,
    birthDate: input.birthDate,
    birthTime: input.birthTime,
    birthPlace: input.birthPlace,
    calendarType: input.calendarType,
    pillars,
    dayMaster,
    fiveElements,
    solarTerm,
    tenGods,
    summary,
  };
}