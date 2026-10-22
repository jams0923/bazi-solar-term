import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBazi } from '@/lib/bazi';
import { buildNormalizedChartData } from '@/lib/buildNormalizedChartData';
import { buildBirthSolarTermContext } from '@/lib/birthSolarTermContext';

test('birth term context follows the birth instant, not the date of viewing', () => {
  const outcomes = ['2000-01-01', '2000-05-15'].map((birthDate) => {
    const result = calculateBazi({ birthDate, birthTime: '12:00', birthPlace: '臺北', gender: 'other', calendarType: 'solar', includeSolarTerm: true });
    return { result, context: buildBirthSolarTermContext(buildNormalizedChartData(result)) };
  });
  for (const { result, context } of outcomes) {
    assert.ok(context);
    assert.equal(context.current.name, result.solarTerm?.current);
    assert.equal(context.previous.name, result.solarTerm?.previous);
    assert.equal(context.next.name, result.solarTerm?.next);
    assert.equal(context.dayMaster, result.pillars.day.heavenlyStem);
  }
  assert.notEqual(outcomes[0].context?.current.name, outcomes[1].context?.current.name);
});
