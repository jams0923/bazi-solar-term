import test from 'node:test';
import assert from 'node:assert/strict';
import { cities } from '@/data/cities';
import { scoreCity, countrySummaries, climateIndex } from '@/lib/exploration';
import { getHiddenStemsByBranch } from '@/lib/hiddenStems';
import { combinationMeaning } from '@/data/ziweiMeanings';
const pillar = (stem: string, branch: string) => ({
  heavenlyStem: stem,
  earthlyBranch: branch,
  label: '',
  hiddenStems: getHiddenStemsByBranch(branch),
});
test('Sites heat/moisture thresholds and opposite target remain explicit', () => {
  const chart = climateIndex({
    year: pillar('丙', '午'),
    month: pillar('丁', '未'),
    day: pillar('丙', '巳'),
    hour: pillar('丁', '戌'),
  });
  assert.equal(chart.heat, 3);
  assert.equal(chart.moisture, -3);
  const score = scoreCity(cities[0], chart);
  assert.deepEqual(score.target, { heat: -3, moisture: 3 });
  assert.equal(score.heat, 0);
  assert.equal(score.moisture, 3);
  assert.equal(score.total, 3);
});
test('each axis and total is bounded for all exploration inputs', () => {
  for (let heat = -3; heat <= 3; heat++)
    for (let moisture = -3; moisture <= 3; moisture++)
      for (const city of cities) {
        const score = scoreCity(city, { heat, moisture });
        assert.ok(score.heat >= 0 && score.heat <= 4);
        assert.ok(score.moisture >= 0 && score.moisture <= 4);
        assert.ok(score.total >= 0 && score.total <= 8);
        assert.equal(score.formalScore, null);
      }
});
test('country results only contain the actual catalog sample', () => {
  const sample = cities.filter((c) => c.country === '日本');
  const chart = { heat: 0, moisture: 0 };
  const country = countrySummaries(chart, sample)[0];
  assert.deepEqual(
    country.included,
    sample.map((c) => c.name)
  );
  assert.equal(country.included.length, 3);
  assert.equal(
    country.mean,
    sample.map((c) => scoreCity(c, chart).total).reduce((a, b) => a + b, 0) / sample.length
  );
  assert.deepEqual(countrySummaries(chart, []), []);
});
test('palace/star combinations change with actual stars and domain', () => {
  const a = combinationMeaning('官祿', ['紫微'], ['左輔']);
  const b = combinationMeaning('夫妻', ['天機'], ['火星']);
  assert.notDeepEqual(a, b);
  assert.ok(a.some((s) => s.includes('分工')));
  assert.ok(b.some((s) => s.includes('核對')));
  assert.ok(combinationMeaning('福德', [], ['地空']).some((s) => s.includes('無主星')));
});
