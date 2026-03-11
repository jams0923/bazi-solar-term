export type Gender = 'male' | 'female' | 'other';
export type FiveElementName = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

export type TenGodName =
  | '比肩'
  | '劫財'
  | '食神'
  | '傷官'
  | '偏財'
  | '正財'
  | '七殺'
  | '正官'
  | '偏印'
  | '正印';

export interface ChartFormInput {
  name?: string;
  gender: Gender;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  calendarType: 'solar' | 'lunar';
  includeSolarTerm: boolean;
}

export interface HiddenStem {
  stem: string;
  element: FiveElementName;
}

export interface HiddenStemTenGod {
  stem: string;
  element: FiveElementName;
  tenGod: TenGodName;
}

export interface Pillar {
  heavenlyStem: string;
  earthlyBranch: string;
  label: string;
  hiddenStems?: HiddenStem[];
}

export interface PillarTenGods {
  stemTenGod: TenGodName;
  hiddenStemTenGods: HiddenStemTenGod[];
}

export interface FiveElements {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

export interface BaziResult {
  name?: string;
  gender: Gender;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  calendarType: 'solar' | 'lunar';
  pillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar;
  };
  dayMaster: string;
  fiveElements: FiveElements;
  solarTerm?: {
    current: string;
    previous: string;
    next: string;
    note: string;
  };
  tenGods: {
    year: PillarTenGods;
    month: PillarTenGods;
    day: PillarTenGods;
    hour: PillarTenGods;
  };
  summary: string;
}