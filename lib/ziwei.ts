import { astro } from 'iztro';
import { Temporal } from '@js-temporal/polyfill';
import { resolveBirth, solarAt } from '@/lib/birthTime';
import type { ChartFormInput } from '@/types/bazi';
export function calculateZiwei(input: ChartFormInput) {
  const birth = resolveBirth(input);
  const gender = input.ziweiGender || (input.gender === 'other' ? undefined : input.gender);
  if (!gender) throw new Error('紫微大限順逆需要選擇傳統男／女排盤規則；此選項不代表性別認同。');
  const hour = Number(birth.chartTime.slice(0, 2));
  let date = birth.chartDate;
  if (hour === 23 && birth.dayRollover === '23:00')
    date = Temporal.PlainDate.from(date).add({ days: 1 }).toString();
  const lunar = solarAt(date, '00:00').getLunar();
  const previous = astro.getConfig();
  try {
    const chart = astro.withOptions({
      type: 'lunar',
      dateStr: `${lunar.getYear()}-${Math.abs(lunar.getMonth())}-${lunar.getDay()}`,
      isLeapMonth: lunar.getMonth() < 0,
      timeIndex: Math.floor((hour + 1) / 2) % 12,
      gender: gender === 'male' ? '男' : '女',
      fixLeap: input.leapRule !== 'same',
      language: 'zh-TW',
      config: {
        yearDivide: 'normal',
        dayDivide: 'current',
        algorithm: 'default',
        ageDivide: 'normal',
        horoscopeDivide: 'normal',
      },
    });
    return {
      chart: chart.toJSON(),
      timing: { ...birth, instant: birth.instant.toString() },
      lunar: lunar.toString(),
      solar: birth.localDate,
      convention: `iztro 2.6.1 預設安星及生年四化；農曆正月切年；${birth.dayRollover} 換日；${input.leapRule === 'same' ? '閏月全月沿用本月' : '閏月十五日（含）前沿用本月，十六日起算下月'}；大限採虛歲、陽男陰女順行／陰男陽女逆行。未聲稱所有流派一致。`,
    };
  } finally {
    astro.config({
      yearDivide: previous.yearDivide,
      dayDivide: previous.dayDivide,
      ageDivide: previous.ageDivide,
      horoscopeDivide: previous.horoscopeDivide,
      algorithm: previous.algorithm,
    });
  }
}
export type ZiweiResult = ReturnType<typeof calculateZiwei>;
