import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBazi } from '@/lib/bazi';
import { buildNormalizedChartData } from '@/lib/buildNormalizedChartData';
import { getCareerOverview } from '@/lib/careerDirections';

const base = buildNormalizedChartData(calculateBazi({
  birthDate: '2000-01-01', birthTime: '12:00', birthPlace: '臺北',
  gender: 'other', calendarType: 'solar', includeSolarTerm: false,
}));

test('career exploration uses actual chart positions and offers concrete roles', () => {
  const overview = getCareerOverview(base);
  assert.equal(overview.directions.length, 3);
  assert.ok(overview.chartBasis.includes(`日主${base.chart.day_master}`));
  assert.ok(overview.directions.every((item) => item.roles.length > 0 && item.check && item.reason));
  for (const direction of overview.directions) {
    for (const source of direction.evidence) {
      assert.match(source, /[年月日時](干|支)/);
    }
  }
});

test('different visible combinations change the top career direction and narrative', () => {
  const output = structuredClone(base);
  const rules = structuredClone(base);
  for (const chart of [output, rules]) {
    chart.ten_gods.hidden = { year_branch: [], month_branch: [], day_branch: [], hour_branch: [] };
  }
  output.ten_gods.visible = { year_stem: '食神', month_stem: '傷官', day_stem: '日主', hour_stem: '食神' };
  rules.ten_gods.visible = { year_stem: '正官', month_stem: '正財', day_stem: '日主', hour_stem: '正官' };
  const a = getCareerOverview(output);
  const b = getCareerOverview(rules);
  assert.notEqual(a.directions[0].title, b.directions[0].title);
  assert.match(a.combination, /食神/);
  assert.match(b.combination, /正官/);
  assert.ok(a.directions[0].evidence.some((item) => item.includes('食神')));
  assert.ok(b.directions[0].evidence.some((item) => item.includes('正官')));
});
