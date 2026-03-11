import type { FiveElementName, HiddenStem, PillarTenGods, TenGodName } from '@/types/bazi';
import { getElementByStem } from '@/lib/fiveElementColors';

const STEM_YINYANG: Record<string, 'yang' | 'yin'> = {
  甲: 'yang',
  乙: 'yin',
  丙: 'yang',
  丁: 'yin',
  戊: 'yang',
  己: 'yin',
  庚: 'yang',
  辛: 'yin',
  壬: 'yang',
  癸: 'yin',
};

const ELEMENT_GENERATES: Record<FiveElementName, FiveElementName> = {
  wood: 'fire',
  fire: 'earth',
  earth: 'metal',
  metal: 'water',
  water: 'wood',
};

const ELEMENT_CONTROLS: Record<FiveElementName, FiveElementName> = {
  wood: 'earth',
  fire: 'metal',
  earth: 'water',
  metal: 'wood',
  water: 'fire',
};

function isSameYinYang(a: string, b: string) {
  return STEM_YINYANG[a] === STEM_YINYANG[b];
}

export function getTenGod(dayStem: string, targetStem: string): TenGodName {
  const dayElement = getElementByStem(dayStem);
  const targetElement = getElementByStem(targetStem);
  const samePolarity = isSameYinYang(dayStem, targetStem);

  if (dayElement === targetElement) {
    return samePolarity ? '比肩' : '劫財';
  }

  // 我生者為食傷
  if (ELEMENT_GENERATES[dayElement] === targetElement) {
    return samePolarity ? '食神' : '傷官';
  }

  // 我剋者為財
  if (ELEMENT_CONTROLS[dayElement] === targetElement) {
    return samePolarity ? '偏財' : '正財';
  }

  // 生我者為印
  if (ELEMENT_GENERATES[targetElement] === dayElement) {
    return samePolarity ? '偏印' : '正印';
  }

  // 剋我者為官殺
  return samePolarity ? '七殺' : '正官';
}

export function getTenGodsForHiddenStems(dayStem: string, hiddenStems?: HiddenStem[]) {
  if (!hiddenStems?.length) return [];

  return hiddenStems.map((item) => ({
    stem: item.stem,
    element: item.element,
    tenGod: getTenGod(dayStem, item.stem),
  }));
}

export function buildPillarTenGods(dayStem: string, pillar: {
  heavenlyStem: string;
  hiddenStems?: HiddenStem[];
}): PillarTenGods {
  return {
    stemTenGod: getTenGod(dayStem, pillar.heavenlyStem),
    hiddenStemTenGods: getTenGodsForHiddenStems(dayStem, pillar.hiddenStems),
  };
}