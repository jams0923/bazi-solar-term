import type { NormalizedChartData } from '@/lib/baziRuleEngine';

type Category = '輸出' | '學習' | '資源' | '規範' | '同儕';
type PillarKey = 'year' | 'month' | 'day' | 'hour';
type Signal = { category: Category; god: string; source: string; visible: boolean; weight: number };
export interface NarrativeSection { title: string; reading: string; evidence: string[]; question: string }
export interface BaziNarrative { headline: string; introduction: string; sections: NarrativeSection[]; method: string }

const NAMES: Record<PillarKey, string> = { year: '年', month: '月', day: '日', hour: '時' };
const CATEGORY: Record<string, Category> = {
  食神: '輸出', 傷官: '輸出', 正印: '學習', 偏印: '學習',
  正財: '資源', 偏財: '資源', 正官: '規範', 七殺: '規範',
  比肩: '同儕', 劫財: '同儕',
};
const THEMES: Record<Category, { action: string; question: string }> = {
  輸出: { action: '把想法做成作品、表達或流程', question: '你是否曾持續完成可展示的作品或改善一項流程？' },
  學習: { action: '吸收資料並建立自己的理解方法', question: '學到新東西時，你會怎麼驗證自己真的理解了？' },
  資源: { action: '衡量資源、成本及可執行的條件', question: '最近哪次決策需要你取捨預算、時間或人力？' },
  規範: { action: '處理責任、標準與外部要求', question: '面對截止日或規範，你通常如何安排順序？' },
  同儕: { action: '自主投入或與他人分工協作', question: '你在團隊中通常負責哪部分，這是自己選的嗎？' },
};
const COMBINATION: Record<string, string> = {
  '學習|輸出': '可先觀察「學習後再產出」是否是你熟悉的節奏：蒐集資料與把它講清楚是兩件事，兩者都需要用實際成果核對。',
  '資源|輸出': '可先觀察作品或提案如何受到資源條件限制，以及你是否願意反覆調整使它可執行。',
  '規範|輸出': '可先觀察在標準與表達之間如何取捨：提出新做法時，也要能回應既有要求。',
  '同儕|輸出': '可先觀察獨立產出與團隊協作如何分工，避免只從單一訊號推論工作能力。',
  '學習|資源': '可先觀察研究與實作成本之間的取捨：資料充分時，是否也能做出決定？',
  '學習|規範': '可先觀察學習與標準如何互相支援，例如先理解規範的原理，再確認自己的做法。',
  '同儕|學習': '可先觀察自主學習與請教他人之間的節奏，兩者都是可以練習的做法。',
  '規範|資源': '可先觀察資源配置和責任要求是否需要一起處理，例如預算、交期與品質標準。',
  '同儕|資源': '可先觀察團隊分工與資源協調是否同時出現，並用具體專案檢查自己的角色。',
  '同儕|規範': '可先觀察自主判斷如何與團隊規則並行，例如何時需要承擔、何時需要協商。',
};

function collectSignals(chart: NormalizedChartData): Signal[] {
  const signals: Signal[] = [];
  for (const key of ['month', 'hour', 'year'] as const) {
    const god = chart.ten_gods.visible[`${key}_stem`];
    if (CATEGORY[god]) signals.push({
      category: CATEGORY[god], god, visible: true,
      source: `${NAMES[key]}干${chart.pillars[key].stem}（${god}）`,
      weight: key === 'month' ? 3 : 2,
    });
  }
  for (const key of ['month', 'day', 'hour', 'year'] as const) {
    chart.ten_gods.hidden[`${key}_branch`].forEach((god, index) => {
      if (CATEGORY[god]) signals.push({
        category: CATEGORY[god], god, visible: false,
        source: `${NAMES[key]}支${chart.pillars[key].branch}藏${chart.hidden_stems[key][index]}（${god}）`,
        weight: key === 'month' ? 0.75 : 0.35,
      });
    });
  }
  return signals;
}

function unique(items: string[]): string[] { return [...new Set(items)]; }

export function generateBaziNarrative(chart: NormalizedChartData): BaziNarrative {
  const signals = collectSignals(chart);
  const visible = signals.filter((signal) => signal.visible);
  const ranked = (Object.keys(THEMES) as Category[]).map((category) => ({
    category,
    points: signals.filter((s) => s.category === category).reduce((sum, s) => sum + s.weight, 0),
    matches: signals.filter((s) => s.category === category),
  })).sort((a, b) => b.points - a.points);
  const [first, second] = ranked;
  const main = first.points > 0 ? first.category : undefined;
  const counterpart = second.points > 0 ? second.category : undefined;
  const mainSource = first.matches[0];
  const secondSource = second.matches[0];
  const pairKey = main && counterpart ? [main, counterpart].sort().join('|') : '';
  const pairReading = COMBINATION[pairKey] || (main
    ? `目前以「${THEMES[main].action}」這一類訊號較突出；其他訊號較少，先從具體經驗核對。`
    : '十神來源不足，暫不推論行為模式。');
  const rootSources = chart.strength.root_sources;
  const anchor = rootSources.length
    ? `本次簡化規則找到${rootSources.length}處同類根氣（例如${rootSources[0]}）；這只表示盤面有對應來源，不等於個性一定穩定。`
    : '本次簡化規則未找到同類根氣；這不能推論個人的毅力或能力不足。';
  const hiddenOnly = !visible.length;
  return {
    headline: `${chart.chart.day_master}${chart.chart.day_master_element}日主 × ${chart.pillars.month.branch}月${main ? ` × ${main}訊號` : ''}`,
    introduction: `出生時落在${chart.pillars.month.branch}月（本站以${chart.season.month_element}為月支本氣），日干為${chart.chart.day_master}。${mainSource ? `較先讀到的訊號是${mainSource.source}；` : ''}${hiddenOnly ? '目前沒有可用的明干十神，以下只列藏干線索；' : ''}下列是傳統命理規則的觀察題目，不是性格測驗結論。`,
    sections: [
      {
        title: '月令與日主',
        reading: `${chart.chart.day_master}的日主五行是${chart.chart.day_master_element}，月支${chart.pillars.month.branch}本氣為${chart.season.month_element}。本站的簡化五行關係標為「${chart.season.seasonal_status}」。${anchor}「得令／失令」是這套簡化規則的分類，沒有單獨考慮完整藏干旺衰，不能據此判斷一個人的強弱。`,
        evidence: unique([`日干${chart.pillars.day.stem}（${chart.chart.day_master_element}）`, `月支${chart.pillars.month.branch}（${chart.season.month_element}）`, ...rootSources.slice(0, 2)]),
        question: '與自己過去的實際選擇相比，這個時節分類有提供什麼可檢查的線索？',
      },
      {
        title: '十神如何組合',
        reading: main ? `${mainSource.source}對應「${THEMES[main].action}」。${counterpart && secondSource ? `${secondSource.source}對應「${THEMES[counterpart].action}」。` : ''}${pairReading}${mainSource.visible ? '前者出現在明干。' : '前者只見於藏干，證據層級較低。'}` : pairReading,
        evidence: unique([...(mainSource ? [mainSource.source] : []), ...(secondSource && counterpart ? [secondSource.source] : [])]),
        question: main ? THEMES[main].question : '你是否有具體的經驗能支持任何一種工作方式？',
      },
      {
        title: '可觀察的行動方式',
        reading: visible.length
          ? `明干依位置讀到${visible.map((s) => `${s.source}`).join('、')}。${visible.length >= 2 ? '它們提供不同的探索題目，不能只挑其中一個貼標籤。' : '其餘線索多在藏干，不能和明干當作同等強度。'}實際行為仍應以你的工作經驗與回饋核對。`
          : `本次只有地支藏干可用（例如${signals[0]?.source ?? '無'}），不足以說明你平常必然如何行動。可先比對自己的經驗。`,
        evidence: unique([...visible.map((s) => s.source), ...signals.filter((s) => !s.visible).slice(0, 1).map((s) => s.source)]).slice(0, 4),
        question: counterpart ? THEMES[counterpart].question : '你在最近一個專案中的真實行動是什麼？',
      },
      {
        title: '這次判讀的限制',
        reading: `明干${visible.length}處、藏干${signals.length - visible.length}處被納入；藏干只作輔助線索。月支${chart.pillars.month.branch}、${chart.season.seasonal_status}與根氣來源讓這份命盤和其他盤不同，但這套規則沒有推出職涯成敗、心理特質或人生事件。若時間接近交節或時辰邊界，應先核對出生時間與時區。`,
        evidence: [`四柱：${chart.chart.year_pillar}、${chart.chart.month_pillar}、${chart.chart.day_pillar}、${chart.chart.hour_pillar}`, `明干${visible.length}處／藏干${signals.length - visible.length}處`],
        question: '哪些描述可由你的經驗驗證？哪些與你不符，應保留或捨棄？',
      },
    ],
    method: '排序只用月干、其他明干、月支藏干與其他藏干的相對權重選出先讀的訊號；沒有計算個人天賦、吉凶或適職機率。',
  };
}
