import type { ChartFormInput } from '@/types/bazi';

export function validateChartForm(input: ChartFormInput) {
  const errors: string[] = [];

  if (!input.birthDate) errors.push('請輸入出生日期');
  if (!input.birthTime) errors.push('請輸入出生時間');
  if (!input.birthPlace) errors.push('請輸入出生地區');

  return {
    valid: errors.length === 0,
    errors,
  };
}