import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateZiwei } from '@/lib/ziwei';
import { astro } from 'iztro';
import { solarAt } from '@/lib/birthTime';
import type { ChartFormInput } from '@/types/bazi';
const input: ChartFormInput = {
  birthDate: '1987-09-23',
  birthTime: '01:05',
  birthPlace: '臺北',
  gender: 'male',
  calendarType: 'solar',
  includeSolarTerm: true,
  offsetMinutes: 480,
};
test('comparison chart matches Sites independently implemented palace/bureau/star/decadal formulas', () => {
  const { chart, lunar } = calculateZiwei(input);
  assert.equal(lunar, '一九八七年八月初一');
  assert.equal(chart.earthlyBranchOfSoulPalace, '申');
  assert.equal(chart.earthlyBranchOfBodyPalace, '戌');
  assert.equal(chart.fiveElementsClass, '土五局');
  const expected: Record<string, [string[], string[], number]> = {
    子: [['貪狼'], ['地劫'], 85],
    丑: [['天同', '巨門'], [], 75],
    寅: [['武曲', '天相'], [], 65],
    卯: [['太陽', '天梁'], ['右弼'], 55],
    辰: [['七殺'], [], 45],
    巳: [['天機'], ['文曲', '陀羅', '天馬'], 35],
    午: [['紫微'], ['祿存'], 25],
    未: [[], ['擎羊'], 15],
    申: [['破軍'], [], 5],
    酉: [[], ['文昌', '天鉞'], 115],
    戌: [['廉貞', '天府'], ['地空', '火星'], 105],
    亥: [['太陰'], ['左輔', '天魁', '鈴星'], 95],
  };
  assert.equal(chart.palaces.length, 12);
  for (const p of chart.palaces) {
    const [major, minor, start] = expected[p.earthlyBranch];
    assert.deepEqual(p.majorStars.map((s) => s.name).sort(), major.sort());
    assert.deepEqual(p.minorStars.map((s) => s.name).sort(), minor.sort());
    assert.deepEqual(p.decadal.range, [start, start + 9]);
  }
  const transforms = chart.palaces.flatMap((p) =>
    [...p.majorStars, ...p.minorStars].filter((s) => s.mutagen).map((s) => `${s.name}${s.mutagen}`)
  );
  assert.deepEqual(transforms.sort(), ['太陰祿', '天同權', '天機科', '巨門忌'].sort());
});
test('traditional gender convention changes decadal direction, not natal star placement', () => {
  const a = calculateZiwei(input).chart;
  const b = calculateZiwei({ ...input, gender: 'female' }).chart;
  for (const p of a.palaces)
    assert.deepEqual(
      p.majorStars.map((s) => s.name),
      b.palaces.find((q) => q.earthlyBranch === p.earthlyBranch)!.majorStars.map((s) => s.name)
    );
  assert.equal(b.palaces.find((p) => p.earthlyBranch === '酉')!.decadal.range[0], 15);
  assert.throws(() => calculateZiwei({ ...input, gender: 'other' }), /順逆/);
});
test('lunar conversion agrees independently with ICU for new year, leap dates and requested case', () => {
  for (const date of ['1987-09-23', '2023-03-22', '2023-04-06', '2024-02-10', '2000-01-01']) {
    const lunar = solarAt(date, '12:00').getLunar();
    const parts = new Intl.DateTimeFormat('en-u-ca-chinese', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }).formatToParts(new Date(date + 'T12:00:00Z'));
    assert.equal(Number(parts.find((p) => p.type === 'day')!.value), lunar.getDay());
    assert.equal(
      Number(parts.find((p) => String(p.type) === 'relatedYear')!.value),
      lunar.getYear()
    );
    const month = parts.find((p) => p.type === 'month')!.value;
    assert.equal(Number(month.replace('bis', '')), Math.abs(lunar.getMonth()));
    assert.equal(month.endsWith('bis'), lunar.getMonth() < 0);
  }
});
test('leap-month split and same-month conventions produce distinct palace placement', () => {
  const leap = {
    ...input,
    birthDate: '2023-02-16',
    calendarType: 'lunar' as const,
    leapMonth: true,
  };
  const same = calculateZiwei({ ...leap, leapRule: 'same' }).chart;
  const split = calculateZiwei({ ...leap, leapRule: 'split' }).chart;
  assert.notEqual(same.earthlyBranchOfSoulPalace, split.earthlyBranchOfSoulPalace);
  const first = { ...leap, birthDate: '2023-02-15' };
  assert.equal(
    calculateZiwei({ ...first, leapRule: 'same' }).chart.earthlyBranchOfSoulPalace,
    calculateZiwei({ ...first, leapRule: 'split' }).chart.earthlyBranchOfSoulPalace
  );
});
test('late Zi rule matches next day early Zi; midnight rule keeps current day', () => {
  const late = calculateZiwei({ ...input, birthTime: '23:30', dayRollover: '23:00' });
  const next = calculateZiwei({
    ...input,
    birthDate: '1987-09-24',
    birthTime: '00:30',
    dayRollover: '00:00',
  });
  const current = calculateZiwei({ ...input, birthTime: '23:30', dayRollover: '00:00' });
  assert.deepEqual(
    late.chart.palaces.map((p) => p.majorStars.map((s) => s.name)),
    next.chart.palaces.map((p) => p.majorStars.map((s) => s.name))
  );
  assert.notEqual(current.lunar, late.lunar);
});
test('configuration does not leak between calculations', () => {
  astro.config({ yearDivide: 'exact', dayDivide: 'forward', algorithm: 'zhongzhou' });
  calculateZiwei(input);
  assert.equal(astro.getConfig().yearDivide, 'exact');
  assert.equal(astro.getConfig().dayDivide, 'forward');
  assert.equal(astro.getConfig().algorithm, 'zhongzhou');
  astro.config({ yearDivide: 'normal', dayDivide: 'forward', algorithm: 'default' });
});

test('Ziwei year changes at lunar new year, independently of Bazi Lichun', () => {
  const mutagens = (date: string) =>
    calculateZiwei({ ...input, birthDate: date })
      .chart.palaces.flatMap((p) =>
        [...p.majorStars, ...p.minorStars]
          .filter((s) => s.mutagen)
          .map((s) => `${s.name}${s.mutagen}`)
      )
      .sort();
  assert.deepEqual(mutagens('2024-02-09'), ['破軍祿', '巨門權', '太陰科', '貪狼忌'].sort());
  assert.deepEqual(mutagens('2024-02-10'), ['廉貞祿', '破軍權', '武曲科', '太陽忌'].sort());
});
