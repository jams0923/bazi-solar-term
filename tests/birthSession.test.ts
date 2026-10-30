import test from 'node:test';
import assert from 'node:assert/strict';
import { updateBirthSession, restoreBirthSession, readBirthSession, writeBirthSession, clearBirthSession, BIRTH_SESSION_KEY } from '../lib/birthSession';
import type { ChartFormInput } from '../types/bazi';

const base: ChartFormInput = { gender: 'other', birthDate: '', birthTime: '', birthPlace: '台北', cityId: 'taipei', calendarType: 'solar', includeSolarTerm: true, dayRollover: '00:00', leapRule: 'split' };

test('common birth data and independent mode settings survive round trips', () => {
  const bazi = { ...base, name: '測試', gender: 'female' as const, birthDate: '1997-11-02', birthTime: '15:02', cityId: 'new-york', birthPlace: '紐約', offsetMinutes: -300, trueSolarTime: true, dayRollover: '23:00' as const };
  const first = updateBirthSession(null, bazi, true, 'bazi');
  const ziwei = restoreBirthSession({ ...base, dayRollover: '23:00' }, first, 'ziwei');
  assert.equal(ziwei.birthDate, bazi.birthDate);
  assert.equal(ziwei.offsetMinutes, -300);
  assert.equal(ziwei.ziweiGender, 'female');
  const second = updateBirthSession(first, { ...ziwei, dayRollover: '00:00', ziweiGender: 'male', birthTime: '15:03' }, true, 'ziwei');
  const back = restoreBirthSession(base, second, 'bazi');
  assert.equal(back.dayRollover, '23:00');
  assert.equal(back.birthTime, '15:03');
  assert.equal(restoreBirthSession(base, second, 'ziwei').ziweiGender, 'male');
  assert.equal(restoreBirthSession(base, second, 'ziwei').dayRollover, '00:00');
});

test('clearing the session removes current and legacy transfers without touching other keys', () => {
  const values = new Map<string, string>([['unrelated', 'keep'], ['birth-transfer-bazi', 'old'], ['birth-transfer-ziwei', 'old']]);
  Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, value: { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value), removeItem: (key: string) => values.delete(key) } });
  writeBirthSession({ ...base, birthDate: '2000-01-01' }, false, 'bazi');
  assert.equal(readBirthSession()?.common.birthDate, '2000-01-01');
  clearBirthSession();
  assert.equal(values.has(BIRTH_SESSION_KEY), false);
  assert.equal(values.has('birth-transfer-bazi'), false);
  assert.equal(values.has('birth-transfer-ziwei'), false);
  assert.equal(values.get('unrelated'), 'keep');
});
