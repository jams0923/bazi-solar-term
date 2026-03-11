export type SolarTermSeason = '春' | '夏' | '秋' | '冬';

export type SolarTermPhase =
  | '初春'
  | '仲春'
  | '晚春'
  | '初夏'
  | '仲夏'
  | '晚夏'
  | '初秋'
  | '仲秋'
  | '晚秋'
  | '初冬'
  | '仲冬'
  | '晚冬';

export type SolarTermEnergyPattern =
  | '升發'
  | '啟動'
  | '外展'
  | '旺盛'
  | '高張'
  | '穩定'
  | '過渡'
  | '轉折'
  | '收斂'
  | '修整'
  | '沉澱'
  | '蓄積'
  | '寒凝'
  | '內聚';

export type SolarTermElement = '木' | '火' | '土' | '金' | '水';

export interface SolarTermMeta {
  id: string;
  name: string;
  order: number;
  season: SolarTermSeason;
  phase: SolarTermPhase;
  element: SolarTermElement;
  subElement?: SolarTermElement | null;
  yinYangBias?: '陽' | '陰' | '轉換';
  energyPattern: SolarTermEnergyPattern[];
  climateKeywords: string[];
  actionKeywords: string[];
  bodySenseKeywords: string[];
  previousSolarTerm: string;
  nextSolarTerm: string;
  description: string;
  interpretationFocus: string[];
  uiAccent?: string;
  enabled: boolean;
}