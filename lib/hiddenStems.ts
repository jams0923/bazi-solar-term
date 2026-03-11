import { getElementByStem } from '@/lib/fiveElementColors';
import type { HiddenStem } from '@/types/bazi';

const HIDDEN_STEMS_MAP: Record<string, string[]> = {
  子: ['癸'],
  丑: ['己', '癸', '辛'],
  寅: ['甲', '丙', '戊'],
  卯: ['乙'],
  辰: ['戊', '乙', '癸'],
  巳: ['丙', '庚', '戊'],
  午: ['丁', '己'],
  未: ['己', '丁', '乙'],
  申: ['庚', '壬', '戊'],
  酉: ['辛'],
  戌: ['戊', '辛', '丁'],
  亥: ['壬', '甲'],
};

export function getHiddenStemsByBranch(branch: string): HiddenStem[] {
  const stems = HIDDEN_STEMS_MAP[branch] ?? [];
  return stems.map((stem) => ({
    stem,
    element: getElementByStem(stem),
  }));
}