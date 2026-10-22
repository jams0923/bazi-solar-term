import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBazi } from '@/lib/bazi';
import { buildNormalizedChartData } from '@/lib/buildNormalizedChartData';
import { generateBaziNarrative } from '@/lib/baziNarrative';

function chart(birthDate: string) {
  return buildNormalizedChartData(calculateBazi({
    birthDate, birthTime: '12:00', birthPlace: '臺北', gender: 'other',
    calendarType: 'solar', includeSolarTerm: false,
  }));
}

test('distinct charts produce evidence backed narrative paragraphs, not the same stock text', () => {
  const variants = ['2000-01-01', '2000-05-15', '2001-02-15'].map(chart);
  const outputs = variants.map(generateBaziNarrative);
  assert.equal(new Set(outputs.map((o) => o.headline)).size, 3);
  for (let i = 0; i < variants.length; i++) {
    const data = variants[i];
    const output = outputs[i];
    assert.equal(output.sections.length, 4);
    assert.ok(output.sections.every((s) => s.reading && s.evidence.length && s.question));
    assert.ok(output.sections[0].evidence.includes(`日干${data.pillars.day.stem}（${data.chart.day_master_element}）`));
    assert.ok(output.sections[3].evidence[0].includes(data.chart.month_pillar));
  }
  for (let i = 1; i < outputs.length; i++) {
    const changed = outputs[0].sections.filter((s, j) => s.reading !== outputs[i].sections[j].reading);
    assert.ok(changed.length >= 2);
  }
});

test('visible and hidden ten gods are distinguished without inventing aptitude', () => {
  const visible = chart('2000-01-01');
  visible.ten_gods.visible.month_stem = '食神';
  const hidden = structuredClone(visible);
  hidden.ten_gods.visible.month_stem = '日主';
  hidden.ten_gods.visible.year_stem = '日主';
  hidden.ten_gods.visible.hour_stem = '日主';
  const a = generateBaziNarrative(visible);
  const b = generateBaziNarrative(hidden);
  assert.ok(a.sections[1].evidence.some((s) => s.includes('月干') && s.includes('食神')));
  assert.match(b.introduction, /沒有可用的明干十神/);
  assert.match(b.sections[2].reading, /只有地支藏干/);
  assert.doesNotMatch(a.sections[1].reading, /天分|適職機率/);
});
