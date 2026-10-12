import { Temporal } from '@js-temporal/polyfill';
import { Lunar, Solar } from 'lunar-typescript';
import { getCity } from '@/data/cities';
import type { ChartFormInput } from '@/types/bazi';

export function solarInputDate(input: ChartFormInput): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.birthDate)) throw new Error('請輸入完整出生日期。');
  const [y, m, d] = input.birthDate.split('-').map(Number);
  if (y < 1900 || y > 2100) throw new Error('目前支援 1900–2100 年；超出範圍不提供排盤。');
  if (input.calendarType === 'lunar') {
    const lunar = Lunar.fromYmd(y, input.leapMonth ? -m : m, d);
    if (
      lunar.getYear() !== y ||
      lunar.getMonth() !== (input.leapMonth ? -m : m) ||
      lunar.getDay() !== d
    )
      throw new Error('農曆日期或閏月不存在。');
    return lunar.getSolar().toYmd();
  }
  return Temporal.PlainDate.from(input.birthDate, { overflow: 'reject' }).toString();
}

export function localTimeOptions(date: string, time: string, zone: string) {
  if (!/^\d{2}:\d{2}$/.test(time)) throw new Error('請輸入 24 小時制出生時間。');
  const wall = Temporal.PlainDateTime.from(`${date}T${time}:00`, { overflow: 'reject' });
  const earlier = wall.toZonedDateTime(zone, { disambiguation: 'earlier' });
  const later = wall.toZonedDateTime(zone, { disambiguation: 'later' });
  const candidates = [earlier, later].filter((z) => z.toPlainDateTime().equals(wall));
  return candidates.filter(
    (z, i) => candidates.findIndex((c) => c.epochMilliseconds === z.epochMilliseconds) === i
  );
}

export function resolveBirth(input: ChartFormInput) {
  const city = getCity(input.cityId);
  const date = solarInputDate(input);
  const zone = input.timeZone || city.zone;
  const candidates = localTimeOptions(date, input.birthTime, zone);
  const warnings: string[] = [];
  let instant: Temporal.Instant;
  let offset: number;
  if (input.offsetMinutes !== undefined) {
    offset = input.offsetMinutes;
    if (!Number.isFinite(offset) || Math.abs(offset) > 14 * 60)
      throw new Error('手動 UTC 時差需在 −840 至 840 分鐘內。');
    const wall = Temporal.PlainDateTime.from(`${date}T${input.birthTime}:00`);
    instant = wall
      .toZonedDateTime('UTC')
      .toInstant()
      .subtract({ milliseconds: offset * 60000 });
    warnings.push('使用手動時差，已覆蓋城市歷史時區規則。');
    if (!candidates.length) warnings.push('此城市鐘錶時間不存在；手動時差僅作自訂固定時差解讀。');
  } else {
    if (!candidates.length)
      throw new Error('此鐘錶時間因夏令跳時或歷史日期跳躍而不存在，請更正或明確使用手動時差。');
    if (candidates.length > 1 && !input.disambiguation)
      throw new Error('此鐘錶時間出現兩次，請選擇第一次或第二次。');
    const chosen =
      input.disambiguation === 'later' ? candidates[candidates.length - 1] : candidates[0];
    instant = chosen.toInstant();
    offset = chosen.offsetNanoseconds / 60e9;
    if (candidates.length > 1)
      warnings.push(`重複時間：採${input.disambiguation === 'later' ? '第二' : '第一'}次。`);
  }
  if (Number(date.slice(0, 4)) < 1970)
    warnings.push('1970 年前 IANA 歷史時區可能不完整；請對照出生紀錄，可手動修正。');
  const local = instant
    .toZonedDateTimeISO('UTC')
    .toPlainDateTime()
    .add({ milliseconds: offset * 60000 });
  let correctionMinutes = 0;
  if (input.trueSolarTime) {
    const dayOfYear = local.dayOfYear;
    const b = (2 * Math.PI * (dayOfYear - 81)) / 364;
    const equation = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
    correctionMinutes = city.longitude * 4 - offset + equation;
    warnings.push('真太陽時使用城市中心經度及均時差近似公式；不是精密天文時刻。');
  }
  const chart = local.add({ milliseconds: Math.round(correctionMinutes * 60000) });
  const minutes = chart.hour * 60 + chart.minute + chart.second / 60;
  const distances = [
    Math.min(minutes, 1440 - minutes),
    ...Array.from({ length: 12 }, (_, i) => Math.abs(minutes - (i * 120 + 60))),
  ];
  if (Math.min(...distances) <= 10)
    warnings.push('距時辰或換日邊界不超過 10 分鐘；時間誤差、時差或真太陽時可能改變命盤。');
  return {
    instant,
    offset,
    timeZone: zone,
    chartDate: chart.toPlainDate().toString(),
    chartTime: chart.toPlainTime().toString().slice(0, 8),
    correctionMinutes,
    warnings,
    dayRollover: input.dayRollover || ('00:00' as const),
    localDate: date,
  };
}
export function solarAt(date: string, time: string) {
  const [y, m, d] = date.split('-').map(Number);
  const [h, min, sec = 0] = time.split(':').map(Number);
  return Solar.fromYmdHms(y, m, d, h, min, sec);
}
