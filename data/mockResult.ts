import type { BaziResult } from '@/types/bazi';

export const mockBaziResult: BaziResult = {
  name: '命主',
  gender: 'male',
  birthDate: '1990-01-01',
  birthTime: '12:00',
  birthPlace: '台灣 台北',
  calendarType: 'solar',
  pillars: {
    year: {
      heavenlyStem: '庚',
      earthlyBranch: '午',
      label: '年柱',
    },
    month: {
      heavenlyStem: '乙',
      earthlyBranch: '卯',
      label: '月柱',
    },
    day: {
      heavenlyStem: '甲',
      earthlyBranch: '子',
      label: '日柱',
    },
    hour: {
      heavenlyStem: '丙',
      earthlyBranch: '辰',
      label: '時柱',
    },
  },
  dayMaster: '甲木',
  fiveElements: {
    wood: 32,
    fire: 24,
    earth: 18,
    metal: 10,
    water: 16,
  },
  solarTerm: {
    current: '驚蟄',
    previous: '雨水',
    next: '春分',
    note: '此命盤接近節氣交界，後續正式版可加入更精準的節氣切換判斷。',
  },
  summary:
    '此命盤以甲木日主為核心，木氣偏旺，火土適中，金水略弱。若搭配節氣切換觀察，可進一步分析五行流轉與時令對命局的影響。',
};