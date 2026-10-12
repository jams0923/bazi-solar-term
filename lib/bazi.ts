import { resolveBirth, solarAt } from '@/lib/birthTime';
import { getSolarTermsForYear } from '@/lib/solarTerm';
import { climateIndex } from '@/lib/exploration';
import type { BaziResult, ChartFormInput, FiveElements, Pillar } from '@/types/bazi';
import { buildSolarTermDisplay } from '@/lib/solarTerm';
import { getHiddenStemsByBranch } from '@/lib/hiddenStems';
import { buildPillarTenGods } from '@/lib/tenGods';

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

  return `此命盤目前已採用第二版邏輯：年柱以交立春瞬間切年，月柱以十二節切換，日柱採明示的換日約定（無人工校正）。日主為 ${dayMaster}，四柱為 ${pillars.year.heavenlyStem}${pillars.year.earthlyBranch}、${pillars.month.heavenlyStem}${pillars.month.earthlyBranch}、${pillars.day.heavenlyStem}${pillars.day.earthlyBranch}、${pillars.hour.heavenlyStem}${pillars.hour.earthlyBranch}。五行中以 ${ELEMENT_LABELS[strongest]} 相對較強（約 ${strongestValue}%），${ELEMENT_LABELS[weakest]} 相對較弱（約 ${weakestValue}%）。`;
}

export function calculateBazi(input: ChartFormInput): BaziResult {
  const birth = resolveBirth(input);
  const localLunar = solarAt(birth.chartDate, birth.chartTime).getLunar();
  // Year/month use the absolute birth instant, never a fabricated local-noon boundary.
  const chineseTime = birth.instant.toZonedDateTimeISO('+08:00');
  const termLunar = solarAt(
    chineseTime.toPlainDate().toString(),
    chineseTime.toPlainTime().toString().slice(0, 8)
  ).getLunar();
  const eight = localLunar.getEightChar();
  eight.setSect(birth.dayRollover === '23:00' ? 1 : 2);
  const makePillar = (text: string, label: string): Pillar => ({
    heavenlyStem: text[0],
    earthlyBranch: text[1],
    label,
    hiddenStems: getHiddenStemsByBranch(text[1]),
  });
  const yearPillar = makePillar(termLunar.getYearInGanZhiExact(), '年柱');
  const monthPillar = makePillar(termLunar.getMonthInGanZhiExact(), '月柱');
  const dayPillar = makePillar(eight.getDay(), '日柱');
  // Derive hour stem from the selected day's stem, so 00:00 and 23:00 conventions remain coherent.
  const branchIndex = Math.floor((Number(birth.chartTime.slice(0, 2)) + 1) / 2) % 12;
  const stems = '甲乙丙丁戊己庚辛壬癸';
  const hourPillar = makePillar(
    stems[((stems.indexOf(dayPillar.heavenlyStem) % 5) * 2 + branchIndex) % 10] +
      '子丑寅卯辰巳午未申酉戌亥'[branchIndex],
    '時柱'
  );
  const year = Number(birth.localDate.slice(0, 4));
  const nearest = [year - 1, year, year + 1]
    .flatMap(getSolarTermsForYear)
    .reduce(
      (n, t) => Math.min(n, Math.abs(t.timestamp - birth.instant.epochMilliseconds)),
      Infinity
    );
  if (nearest <= 3600000)
    birth.warnings.push('距交節估算不超過一小時；年／月柱請另核官方曆表與出生時間精度。');
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
  const solarTerm = buildSolarTermDisplay(birth.localDate, input.birthTime, birth.offset);
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
    calendar: {
      solar: birth.localDate,
      lunar: solarAt(birth.localDate, input.birthTime).getLunar().toString(),
    },
    timing: { ...birth, instant: birth.instant.toString() },
    climate: climateIndex(pillars),
  };
}
