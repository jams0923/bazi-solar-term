import type { NormalizedChartData, FiveElement } from '@/lib/baziRuleEngine';

type TenGod = '食神' | '傷官' | '正印' | '偏印' | '正財' | '偏財' | '正官' | '七殺' | '比肩' | '劫財';

export interface CareerDirection {
  title: string;
  roles: string[];
  reason: string;
  evidence: string[];
  check: string;
}

export interface CareerOverview {
  chartBasis: string;
  combination: string;
  directions: CareerDirection[];
}

const PROFILES: Array<{
  title: string;
  roles: string[];
  signals: Partial<Record<TenGod, number>>;
  elements: FiveElement[];
  reason: string;
  check: string;
}> = [
  {
    title: '技術開發與產品設計',
    roles: ['工程師', '產品設計', '系統規劃'],
    signals: { 食神: 2, 傷官: 2, 正印: 1, 偏印: 1, 正財: 0.5 },
    elements: ['金', '土'],
    reason: '可觀察是否喜歡把知識轉成具體方法、作品或可改善的流程。',
    check: '實際是否喜歡技術問題、持續練習及交付成果？',
  },
  {
    title: '設計與內容創作',
    roles: ['視覺／工業設計', '內容企劃', '品牌創作'],
    signals: { 食神: 2, 傷官: 2, 偏印: 1, 劫財: 0.5 },
    elements: ['木', '火'],
    reason: '可觀察是否有持續輸出作品、表達想法並迭代形式的意願。',
    check: '是否願意累積作品集，並接收具體回饋？',
  },
  {
    title: '研究與資料分析',
    roles: ['研究助理', '資料分析', '市場研究'],
    signals: { 正印: 2, 偏印: 2, 食神: 1, 傷官: 1 },
    elements: ['水', '金'],
    reason: '可觀察是否享受蒐集資料、理解原理，再形成可檢查的結論。',
    check: '是否喜歡長時間查證與整理資料？',
  },
  {
    title: '專案與營運整合',
    roles: ['專案管理', '營運管理', '供應鏈協調'],
    signals: { 正財: 2, 偏財: 2, 正官: 1, 比肩: 1, 劫財: 0.5 },
    elements: ['土'],
    reason: '可觀察是否擅長把資源、進度與不同人的工作接起來。',
    check: '是否能接受跨部門協調、時程與資源限制？',
  },
  {
    title: '教育與顧問服務',
    roles: ['教育訓練', '技術顧問', '客戶成功'],
    signals: { 正印: 2, 偏印: 1, 食神: 2, 正官: 0.5 },
    elements: ['木', '火'],
    reason: '可觀察是否喜歡先理解問題，再用對方聽得懂的方式分享。',
    check: '是否樂於說明、傾聽並因對象調整表達？',
  },
  {
    title: '品質與制度管理',
    roles: ['品質管理', '法規／稽核協作', '流程改善'],
    signals: { 正官: 2, 七殺: 1.5, 正印: 1, 食神: 0.5 },
    elements: ['金', '土'],
    reason: '可觀察是否願意檢查標準、找出偏差並建立可重複的方法。',
    check: '是否能在細節要求與實務效率之間取得平衡？',
  },
];

const PILLARS = [
  ['年', 'year'], ['月', 'month'], ['時', 'hour'],
] as const;
const BRANCHES = [
  ['年', 'year', 'year_branch'], ['月', 'month', 'month_branch'],
  ['日', 'day', 'day_branch'], ['時', 'hour', 'hour_branch'],
] as const;

function sourcesFor(chart: NormalizedChartData, god: TenGod): string[] {
  const visible = PILLARS.flatMap(([label, key]) =>
    chart.ten_gods.visible[`${key}_stem`] === god
      ? [`${label}干${chart.pillars[key].stem}（${god}）`] : []
  );
  const hidden = BRANCHES.flatMap(([label, key, dataKey]) =>
    chart.ten_gods.hidden[dataKey].flatMap((g, index) =>
      g === god ? [`${label}支${chart.pillars[key].branch}藏${chart.hidden_stems[key][index]}（${god}）`] : []
    )
  );
  return [...visible, ...hidden];
}

/** Scores order cultural exploration prompts only; they are not aptitude measurements. */
export function getCareerDirections(chart: NormalizedChartData): CareerDirection[] {
  return PROFILES.map((profile, index) => {
    let score = 0;
    const evidence: string[] = [];
    for (const [god, weight] of Object.entries(profile.signals) as [TenGod, number][]) {
      const matches = sourcesFor(chart, god);
      const visible = matches.filter((item) => item.includes('干'));
      const hidden = matches.filter((item) => item.includes('藏'));
      score += weight * (visible.length * 2 + Math.min(hidden.length, 2) * 0.35);
      evidence.push(...visible, ...hidden.slice(0, 1));
    }
    if (profile.elements.includes(chart.chart.day_master_element)) score += 0.5;
    return { ...profile, score, evidence: [...new Set(evidence)].slice(0, 4), index };
  })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 3)
    .map((item) => ({
      title: item.title,
      roles: item.roles,
      reason: item.reason,
      evidence: item.evidence,
      check: item.check,
    }));
}

const GOD_THEME: Record<TenGod, string> = {
  食神: '將想法整理成作品或可分享的方法',
  傷官: '表達觀點與調整現有做法',
  正印: '系統學習與整理知識',
  偏印: '探索不同線索與方法',
  正財: '管理明確的資源與進度',
  偏財: '連結機會與各種資源',
  正官: '建立規範與承擔職責',
  七殺: '在壓力下處理具體問題',
  比肩: '自主實作與持續投入',
  劫財: '與他人合作及競合',
};

export function getCareerOverview(chart: NormalizedChartData): CareerOverview {
  const visible = PILLARS.map(([label, key]) => ({
    label,
    stem: chart.pillars[key].stem,
    god: chart.ten_gods.visible[`${key}_stem`] as TenGod,
  })).filter(({ god }) => god in GOD_THEME);
  const counts = new Map<TenGod, number>();
  for (const { god } of visible) counts.set(god, (counts.get(god) ?? 0) + 1);
  const prominent = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const [first, second] = prominent;
  let combination = '明干未提供足夠的十神訊號；下列方向主要取自地支藏干，請以實際能力與興趣篩選。';
  if (first && second) {
    combination = `${first[0]}所提示的「${GOD_THEME[first[0]]}」與${second[0]}所提示的「${GOD_THEME[second[0]]}」同時可見；可先找需要兩種工作方式交會的職務。這是探索線索，不能據此斷定職業能力。`;
  } else if (first) {
    combination = `${first[0]}在${first[1]}個明干出現，可先觀察自己是否喜歡「${GOD_THEME[first[0]]}」這種工作方式；仍須用經驗和作品驗證。`;
  }
  return {
    chartBasis: `日主${chart.chart.day_master}（${chart.chart.day_master_element}），月支${chart.pillars.month.branch}；明干：${visible.map(({ label, stem, god }) => `${label}干${stem}為${god}`).join('、') || '無可用十神'}。`,
    combination,
    directions: getCareerDirections(chart),
  };
}
