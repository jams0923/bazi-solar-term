import type { ChartFormInput } from '@/types/bazi';

export type BirthMode = 'bazi' | 'ziwei';
type CommonBirth = Pick<ChartFormInput, 'name' | 'gender' | 'birthDate' | 'birthTime' | 'birthPlace' | 'cityId' | 'timeZone' | 'calendarType' | 'leapMonth' | 'offsetMinutes' | 'disambiguation' | 'trueSolarTime'>;
type ModeSettings = Pick<ChartFormInput, 'dayRollover' | 'leapRule' | 'ziweiGender' | 'includeSolarTerm'>;
export type BirthSession = { common: CommonBirth; manual: boolean; settings: Partial<Record<BirthMode, ModeSettings>> };
export const BIRTH_SESSION_KEY = 'birth-session-v1';

export function updateBirthSession(previous: BirthSession | null, form: ChartFormInput, manual: boolean, mode: BirthMode): BirthSession {
  const { name, gender, birthDate, birthTime, birthPlace, cityId, timeZone, calendarType, leapMonth, offsetMinutes, disambiguation, trueSolarTime, dayRollover, leapRule, ziweiGender, includeSolarTerm } = form;
  return {
    common: { name, gender, birthDate, birthTime, birthPlace, cityId, timeZone, calendarType, leapMonth, offsetMinutes: manual ? offsetMinutes : undefined, disambiguation, trueSolarTime },
    manual,
    settings: { ...previous?.settings, [mode]: { dayRollover, leapRule, ziweiGender, includeSolarTerm } },
  };
}

export function restoreBirthSession(base: ChartFormInput, session: BirthSession, mode: BirthMode): ChartFormInput {
  const restored = { ...base, ...session.common, ...session.settings?.[mode] };
  if (mode === 'ziwei' && !restored.ziweiGender && restored.gender !== 'other') {
    restored.ziweiGender = restored.gender;
  }
  return restored;
}

export function readBirthSession(): BirthSession | null {
  try {
    const raw = sessionStorage.getItem(BIRTH_SESSION_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as BirthSession;
    return value && typeof value.common === 'object' && value.common !== null && typeof value.manual === 'boolean' && typeof value.settings === 'object' && value.settings !== null ? value : null;
  } catch { return null; }
}

export function writeBirthSession(form: ChartFormInput, manual: boolean, mode: BirthMode) {
  try { sessionStorage.setItem(BIRTH_SESSION_KEY, JSON.stringify(updateBirthSession(readBirthSession(), form, manual, mode))); } catch { /* Storage may be unavailable in private browsing. */ }
}

export function clearBirthSession() {
  try {
    sessionStorage.removeItem(BIRTH_SESSION_KEY);
    sessionStorage.removeItem('birth-transfer-bazi');
    sessionStorage.removeItem('birth-transfer-ziwei');
  } catch { /* Storage may be unavailable in private browsing. */ }
}
