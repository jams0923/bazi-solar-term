import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBazi } from '@/lib/bazi';
import { getSolarTermByName, getSolarTermsForYear } from '@/lib/solarTerm';
import { buildNormalizedChartData } from '@/lib/buildNormalizedChartData';
import type { ChartFormInput } from '@/types/bazi';
const input: ChartFormInput = {
  birthDate: '2000-01-01',
  birthTime: '12:00',
  birthPlace: '臺北',
  gender: 'other',
  calendarType: 'solar',
  includeSolarTerm: true,
};
const pillars = (i: ChartFormInput) =>
  Object.values(calculateBazi(i).pillars).map((p) => p.heavenlyStem + p.earthlyBranch);
// Anonymous date explicitly requested by the user as a comparison fixture, not a default or saved profile.
test('requested UTC+8 comparison: Sites independent day arithmetic and lunar calendar agree', () => {
  const chart = calculateBazi({
    ...input,
    birthDate: '1987-09-23',
    birthTime: '01:05',
    offsetMinutes: 480,
  });
  assert.deepEqual(
    pillars({ ...input, birthDate: '1987-09-23', birthTime: '01:05', offsetMinutes: 480 }),
    ['丁卯', '己酉', '乙亥', '丁丑']
  );
  assert.equal(chart.calendar.lunar, '一九八七年八月初一');
  assert.ok(chart.timing.warnings.some((w) => w.includes('邊界')));
  assert.equal(chart.climate.heat, 0);
  assert.equal(chart.climate.moisture, 1);
});
test('day cycle is anchored to 2000-01-01 戊午, no screenshot correction', () => {
  assert.equal(pillars(input)[2], '戊午');
  assert.equal(pillars({ ...input, birthDate: '2000-01-02' })[2], '己未');
});
test('00:00 and 23:00 rollover are explicit and hour stem follows the chosen day', () => {
  const midnight = pillars({ ...input, birthTime: '23:30', dayRollover: '00:00' });
  const early = pillars({ ...input, birthTime: '23:30', dayRollover: '23:00' });
  assert.deepEqual(midnight.slice(2), ['戊午', '壬子']);
  assert.deepEqual(early.slice(2), ['己未', '甲子']);
  assert.deepEqual(pillars({ ...input, birthDate: '2000-01-02', birthTime: '00:00' }).slice(2), [
    '己未',
    '甲子',
  ]);
});
function nearTerm(name: Parameters<typeof getSolarTermByName>[1], minutes: number): ChartFormInput {
  const term = getSolarTermByName(2024, name)!;
  const clock = new Date(term.timestamp + 480 * 60000 + minutes * 60000).toISOString();
  return {
    ...input,
    birthDate: clock.slice(0, 10),
    birthTime: clock.slice(11, 16),
    offsetMinutes: 480,
  };
}
test('Lichun crosses year and month at a calculated instant, not fixed noon', () => {
  const before = calculateBazi(nearTerm('立春', -2));
  const after = calculateBazi(nearTerm('立春', 2));
  assert.equal(before.pillars.year.heavenlyStem + before.pillars.year.earthlyBranch, '癸卯');
  assert.equal(after.pillars.year.heavenlyStem + after.pillars.year.earthlyBranch, '甲辰');
  assert.equal(before.pillars.month.earthlyBranch, '丑');
  assert.equal(after.pillars.month.earthlyBranch, '寅');
  assert.ok(after.timing.warnings.some((w) => w.includes('交節')));
});
test('Jie switches month, Zhongqi never switches month', () => {
  assert.equal(calculateBazi(nearTerm('驚蟄', -2)).pillars.month.earthlyBranch, '寅');
  assert.equal(calculateBazi(nearTerm('驚蟄', 2)).pillars.month.earthlyBranch, '卯');
  assert.equal(calculateBazi(nearTerm('春分', -2)).pillars.month.earthlyBranch, '卯');
  assert.equal(calculateBazi(nearTerm('春分', 2)).pillars.month.earthlyBranch, '卯');
});
test('all 24 terms are ordered and belong to the requested year including winter solstice', () => {
  for (const year of [1900, 1987, 2000, 2024, 2100]) {
    const terms = getSolarTermsForYear(year);
    assert.equal(terms.length, 24);
    assert.ok(
      terms.every(
        (t, i) =>
          new Date(t.timestamp + 8 * 3600000).getUTCFullYear() === year &&
          (i === 0 || terms[i - 1].timestamp < t.timestamp)
      )
    );
  }
});
test('same instant in two zones has same year/month; local day/time may differ', () => {
  const taipei = calculateBazi({ ...input, birthDate: '2024-02-04', birthTime: '17:00' });
  const ny = calculateBazi({
    ...input,
    cityId: 'new-york',
    birthDate: '2024-02-04',
    birthTime: '04:00',
  });
  assert.equal(taipei.timing.instant, ny.timing.instant);
  assert.deepEqual(taipei.pillars.year, ny.pillars.year);
  assert.deepEqual(taipei.pillars.month, ny.pillars.month);
  assert.notEqual(taipei.pillars.hour.earthlyBranch, ny.pillars.hour.earthlyBranch);
});
test('hour boundary and true solar correction affect hour, not the birth instant', () => {
  assert.equal(calculateBazi({ ...input, birthTime: '00:59' }).pillars.hour.earthlyBranch, '子');
  assert.equal(calculateBazi({ ...input, birthTime: '01:00' }).pillars.hour.earthlyBranch, '丑');
  const a = calculateBazi({
    ...input,
    cityId: 'sydney',
    birthDate: '2024-01-01',
    birthTime: '01:05',
  });
  const b = calculateBazi({
    ...input,
    cityId: 'sydney',
    birthDate: '2024-01-01',
    birthTime: '01:05',
    trueSolarTime: true,
  });
  assert.equal(a.timing.instant, b.timing.instant);
  assert.notEqual(a.pillars.hour.earthlyBranch, b.pillars.hour.earthlyBranch);
  assert.deepEqual(a.pillars.month, b.pillars.month);
});
test('metadata records actual zone, instant, rollover and hidden-stem ten gods', () => {
  const chart = calculateBazi({ ...input, cityId: 'new-york', dayRollover: '23:00' });
  const normalized = buildNormalizedChartData(chart);
  assert.equal(normalized.meta.timezone, 'America/New_York');
  assert.equal(normalized.meta.birth_datetime, chart.timing.instant);
  assert.equal(normalized.meta.day_rollover_rule, '23:00');
  for (const key of ['year', 'month', 'day', 'hour'] as const)
    assert.equal(
      chart.tenGods[key].hiddenStemTenGods.length,
      chart.pillars[key].hiddenStems!.length
    );
});

test('ten gods account for both element relationship and yin/yang polarity', async () => {
  const { getTenGod } = await import('@/lib/tenGods');
  assert.deepEqual(
    [...'甲乙丙丁戊己庚辛壬癸'].map((stem) => getTenGod('甲', stem)),
    ['比肩', '劫財', '食神', '傷官', '偏財', '正財', '七殺', '正官', '偏印', '正印']
  );
  assert.equal(getTenGod('乙', '壬'), '正印');
  assert.equal(getTenGod('乙', '癸'), '偏印');
});
