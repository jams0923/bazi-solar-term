import type { ChartFormInput } from '@/types/bazi';
export function parseBirthQuery(
  params: Record<string, string | string[] | undefined>
): ChartFormInput {
  const text = (key: string) =>
    typeof params[key] === 'string' ? (params[key] as string) : undefined;
  const offset = text('offsetMinutes');
  return {
    name: text('name') || '',
    gender: text('gender') === 'female' ? 'female' : text('gender') === 'male' ? 'male' : 'other',
    birthDate: text('birthDate') || '',
    birthTime: text('birthTime') || '',
    birthPlace: text('birthPlace') || '台北',
    cityId: text('cityId') || 'taipei',
    timeZone: text('timeZone'),
    calendarType: text('calendarType') === 'lunar' ? 'lunar' : 'solar',
    includeSolarTerm: text('includeSolarTerm') !== 'false',
    offsetMinutes: offset === undefined ? undefined : Number(offset),
    disambiguation:
      text('disambiguation') === 'earlier'
        ? 'earlier'
        : text('disambiguation') === 'later'
          ? 'later'
          : undefined,
    dayRollover: text('dayRollover') === '23:00' ? '23:00' : '00:00',
    leapMonth: text('leapMonth') === 'true',
    trueSolarTime: text('trueSolarTime') === 'true',
  };
}
