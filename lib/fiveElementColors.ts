export type FiveElementName = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

export const FIVE_ELEMENT_META: Record<
  FiveElementName,
  {
    label: string;
    color: string;
    className: string;
  }
> = {
  wood: {
    label: '木',
    color: '#4CAF50',
    className: 'element-wood',
  },
  fire: {
    label: '火',
    color: '#E53935',
    className: 'element-fire',
  },
  earth: {
    label: '土',
    color: '#C8A96B',
    className: 'element-earth',
  },
  metal: {
    label: '金',
    color: '#D4AF37',
    className: 'element-metal',
  },
  water: {
    label: '水',
    color: '#42A5F5',
    className: 'element-water',
  },
};

const STEM_TO_ELEMENT: Record<string, FiveElementName> = {
  甲: 'wood',
  乙: 'wood',
  丙: 'fire',
  丁: 'fire',
  戊: 'earth',
  己: 'earth',
  庚: 'metal',
  辛: 'metal',
  壬: 'water',
  癸: 'water',
};

const BRANCH_TO_ELEMENT: Record<string, FiveElementName> = {
  子: 'water',
  丑: 'earth',
  寅: 'wood',
  卯: 'wood',
  辰: 'earth',
  巳: 'fire',
  午: 'fire',
  未: 'earth',
  申: 'metal',
  酉: 'metal',
  戌: 'earth',
  亥: 'water',
};

export function getElementByStem(stem: string): FiveElementName {
  return STEM_TO_ELEMENT[stem] ?? 'earth';
}

export function getElementByBranch(branch: string): FiveElementName {
  return BRANCH_TO_ELEMENT[branch] ?? 'earth';
}

export function getElementMetaByStem(stem: string) {
  return FIVE_ELEMENT_META[getElementByStem(stem)];
}

export function getElementMetaByBranch(branch: string) {
  return FIVE_ELEMENT_META[getElementByBranch(branch)];
}