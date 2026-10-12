import test from 'node:test';
import assert from 'node:assert/strict';
import { localTimeOptions, resolveBirth, solarInputDate } from '@/lib/birthTime';
import type { ChartFormInput } from '@/types/bazi';
const input: ChartFormInput = {
  birthDate: '2000-01-01',
  birthTime: '12:00',
  birthPlace: '臺北',
  gender: 'other',
  calendarType: 'solar',
  includeSolarTerm: true,
};
test('Taipei historical summer time is date dependent', () => {
  assert.equal(resolveBirth({ ...input, birthDate: '1979-07-01' }).offset, 540);
  assert.equal(resolveBirth({ ...input, birthDate: '1979-12-01' }).offset, 480);
  assert.equal(
    resolveBirth({ ...input, birthDate: '1987-09-23', birthTime: '01:05' }).instant.toString(),
    '1987-09-22T17:05:00Z'
  );
});
test('NY autumn clock repeats: explicit choice required, ordered by instant', () => {
  const data = { ...input, cityId: 'new-york', birthDate: '2024-11-03', birthTime: '01:30' };
  assert.equal(localTimeOptions(data.birthDate, data.birthTime, 'America/New_York').length, 2);
  assert.throws(() => resolveBirth(data), /出現兩次/);
  assert.equal(
    resolveBirth({ ...data, disambiguation: 'earlier' }).instant.toString(),
    '2024-11-03T05:30:00Z'
  );
  assert.equal(
    resolveBirth({ ...data, disambiguation: 'later' }).instant.toString(),
    '2024-11-03T06:30:00Z'
  );
});
test('NY spring clock and Apia dateline jump reject nonexistent times', () => {
  assert.throws(
    () =>
      resolveBirth({ ...input, cityId: 'new-york', birthDate: '2024-03-10', birthTime: '02:30' }),
    /不存在/
  );
  assert.throws(
    () => resolveBirth({ ...input, cityId: 'apia', birthDate: '2011-12-30' }),
    /不存在/
  );
});
test('manual offset is explicit, bounded, and can override a gap with a warning', () => {
  const resolved = resolveBirth({
    ...input,
    cityId: 'new-york',
    birthDate: '2024-03-10',
    birthTime: '02:30',
    offsetMinutes: -300,
  });
  assert.equal(resolved.instant.toString(), '2024-03-10T07:30:00Z');
  assert.ok(resolved.warnings.some((w) => w.includes('不存在')));
  for (const offsetMinutes of [NaN, Infinity, 900])
    assert.throws(() => resolveBirth({ ...input, offsetMinutes }), /時差/);
});
test('historical Singapore and second-based pre-1970 offsets are preserved', () => {
  assert.equal(
    resolveBirth({ ...input, cityId: 'singapore', birthDate: '1980-01-01' }).offset,
    450
  );
  const london = resolveBirth({ ...input, cityId: 'london', birthDate: '1900-01-01' });
  assert.ok(london.warnings.some((w) => w.includes('1970')));
  assert.equal(
    resolveBirth({ ...input, timeZone: 'Europe/Paris', birthDate: '1900-01-01' }).offset,
    9.35
  );
});
test('invalid dates, times, unsupported years and lunar leap months fail', () => {
  for (const birthDate of ['2024-02-30', '2000-13-01', '1800-01-01', ''])
    assert.throws(() => resolveBirth({ ...input, birthDate }));
  for (const birthTime of ['24:00', '12:60', ''])
    assert.throws(() => resolveBirth({ ...input, birthTime }));
  assert.throws(() =>
    solarInputDate({ ...input, calendarType: 'lunar', birthDate: '2024-02-01', leapMonth: true })
  );
});
test('lunar input round trips known new year and leap second month', () => {
  assert.equal(
    solarInputDate({ ...input, calendarType: 'lunar', birthDate: '2024-01-01' }),
    '2024-02-10'
  );
  assert.equal(
    solarInputDate({ ...input, calendarType: 'lunar', birthDate: '2023-02-01', leapMonth: true }),
    '2023-03-22'
  );
});
test('optional true solar time uses city longitude, preserves instant and can move date', () => {
  const normal = resolveBirth({
    ...input,
    cityId: 'sydney',
    birthDate: '2024-01-01',
    birthTime: '00:15',
  });
  const solar = resolveBirth({
    ...input,
    cityId: 'sydney',
    birthDate: '2024-01-01',
    birthTime: '00:15',
    trueSolarTime: true,
  });
  assert.equal(solar.instant.toString(), normal.instant.toString());
  assert.equal(solar.chartDate, '2023-12-31');
  assert.ok(solar.correctionMinutes < -50);
});
