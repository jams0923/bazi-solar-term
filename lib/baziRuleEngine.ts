export type FiveElement = '木' | '火' | '土' | '金' | '水';
export type YinYang = '陰' | '陽';
export type StrengthLevel = '極弱' | '偏弱' | '中和' | '偏強' | '極強';
export type RootLevel = '無' | '弱' | '中' | '強';
export type CalendarType = 'solar' | 'lunar';
export type Gender = 'male' | 'female';

export type RuleType = 'base' | 'combo' | 'revision' | 'output';
export type RulePriority = 'P1' | 'P2' | 'P3' | 'P4';
export type RuleCategory =
  | 'day_master'
  | 'month_order'
  | 'ten_god'
  | 'strength'
  | 'pillar'
  | 'five_elements'
  | 'revision'
  | 'summary';
export type RuleScope =
  | 'core'
  | 'personality'
  | 'career'
  | 'relationship'
  | 'mindset'
  | 'advice';

export type UiBlock =
  | 'core_summary'
  | 'personality'
  | 'strengths'
  | 'risks'
  | 'revision_note'
  | 'advice'
  | 'mindset';

export interface MetaInfo {
  gender: Gender;
  calendar_type: CalendarType;
  timezone: string;
  birth_place: string;
  birth_datetime: string;
  day_rollover_rule: '00:00' | '23:00';
  solar_term_mode: 'jieqi' | 'lunar_month';
}

export interface PillarUnit {
  stem: string;
  branch: string;
}

export interface ChartCore {
  year_pillar: string;
  month_pillar: string;
  day_pillar: string;
  hour_pillar: string;
  day_master: string;
  day_master_element: FiveElement;
  day_master_yin_yang: YinYang;
}

export interface TenGodData {
  visible: Record<string, string>;
  hidden: Record<string, string[]>;
  visible_list: string[];
  hidden_list: string[];
  visible_count: Record<string, number>;
  all_count: Record<string, number>;
}

export interface FiveElementData {
  surface_count: Record<FiveElement, number>;
  surface_percent: Record<FiveElement, number>;
  seasonal_power_hint: Record<FiveElement, string>;
}

export interface StrengthData {
  has_root: boolean;
  root_sources: string[];
  root_level: RootLevel;
  has_print: boolean;
  print_sources: string[];
  has_output: boolean;
  output_sources: string[];
  has_wealth: boolean;
  wealth_sources: string[];
  has_officer_kill: boolean;
  officer_kill_sources: string[];
  strength_level: StrengthLevel;
  strength_note: string;
}

export interface NormalizedChartData {
  meta: MetaInfo;
  chart: ChartCore;
  pillars: {
    year: PillarUnit;
    month: PillarUnit;
    day: PillarUnit;
    hour: PillarUnit;
  };
  hidden_stems: Record<'year' | 'month' | 'day' | 'hour', string[]>;
  ten_gods: TenGodData;
  five_elements: FiveElementData;
  season: {
    current_solar_term: string;
    previous_solar_term: string;
    next_solar_term: string;
    month_branch: string;
    month_element: FiveElement;
    seasonal_status: string;
  };
  strength: StrengthData;
  structure: {
    main_pattern_tags: string[];
    core_summary_seed: string[];
  };
  derived_tags: string[];
}

export interface RuleCondition {
  field: string;
  operator: '=' | '!=' | 'contains' | 'in' | '>=' | '<=';
  value: unknown;
}

export interface RuleEffects {
  add_tags?: string[];
  remove_tags?: string[];
  override_tags?: string[];
  scores?: Partial<Record<ScoreKey, number>>;
}

export interface RuleOutput {
  summary: string;
  detail: string;
  advice: string;
  ui_block: UiBlock;
}

export interface RuleDefinition {
  id: string;
  name: string;
  enabled: boolean;
  type: RuleType;
  priority: RulePriority;
  category: RuleCategory;
  scope: RuleScope;
  trigger: Record<string, unknown>;
  conditions?: RuleCondition[];
  effects: RuleEffects;
  output: RuleOutput;
}

export type ScoreKey =
  | 'self_strength'
  | 'expression'
  | 'practicality'
  | 'pressure'
  | 'flexibility'
  | 'introspection'
  | 'discipline';

export interface EngineStatement {
  rule_id: string;
  priority: RulePriority;
  category: RuleCategory;
  scope: RuleScope;
  output: RuleOutput;
}

export interface RuleEngineState {
  tags: string[];
  scores: Record<ScoreKey, number>;
  statements: EngineStatement[];
  matched_rules: string[];
}

export interface FrontendResult {
  headline: string;
  core_summary: string;
  personality: string;
  strengths: string[];
  mindset: string;
  risks: string[];
  revision_note: string;
  advice: string;
  matched_rules: string[];
  tags: string[];
  scores: Record<ScoreKey, number>;
}

const PRIORITY_ORDER: Record<RulePriority, number> = {
  P1: 1,
  P2: 2,
  P3: 3,
  P4: 4,
};

function uniqueStrings(arr: string[]): string[] {
  return Array.from(new Set(arr.filter(Boolean)));
}

function getField(obj: unknown, path: string): unknown {
  if (!path) return undefined;
  const segments = path.split('.');
  let current: unknown = obj;

  for (const segment of segments) {
    if (current === null || current === undefined) return undefined;
    if (typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[segment];
  }

  return current;
}

function arrayContains(target: unknown, expected: unknown): boolean {
  if (!Array.isArray(target)) return false;
  return target.includes(expected);
}

function anyInArray(target: unknown, expectedList: unknown): boolean {
  if (!Array.isArray(target) || !Array.isArray(expectedList)) return false;
  return target.some((item) => expectedList.includes(item));
}

function compareValues(
  actualValue: unknown,
  operator: RuleCondition['operator'],
  expectedValue: unknown
): boolean {
  switch (operator) {
    case '=':
      return actualValue === expectedValue;
    case '!=':
      return actualValue !== expectedValue;
    case 'contains':
      return arrayContains(actualValue, expectedValue);
    case 'in':
      if (Array.isArray(actualValue)) {
        return anyInArray(actualValue, expectedValue);
      }
      return Array.isArray(expectedValue) ? expectedValue.includes(actualValue) : false;
    case '>=':
      return Number(actualValue) >= Number(expectedValue);
    case '<=':
      return Number(actualValue) <= Number(expectedValue);
    default:
      return false;
  }
}

function evaluateCondition(condition: RuleCondition, context: Record<string, unknown>): boolean {
  const actualValue = getField(context, condition.field);
  return compareValues(actualValue, condition.operator, condition.value);
}

function matchTrigger(
  trigger: Record<string, unknown>,
  context: Record<string, unknown>
): boolean {
  const entries = Object.entries(trigger);

  for (const [field, expected] of entries) {
    const actual = getField(context, field);

    if (Array.isArray(expected)) {
      if (Array.isArray(actual)) {
        const allExist = expected.every((item) => actual.includes(item));
        if (!allExist) return false;
      } else {
        if (!expected.includes(actual)) return false;
      }
    } else if (typeof expected === 'object' && expected !== null) {
      if (actual === undefined || actual === null) return false;
    } else {
      if (actual !== expected) return false;
    }
  }

  return true;
}

function initScoreBoard(): Record<ScoreKey, number> {
  return {
    self_strength: 0,
    expression: 0,
    practicality: 0,
    pressure: 0,
    flexibility: 0,
    introspection: 0,
    discipline: 0,
  };
}

function dedupeOutputs(outputs: RuleOutput[]): RuleOutput[] {
  const seen = new Set<string>();
  const result: RuleOutput[] = [];

  for (const item of outputs) {
    const key = `${item.ui_block}::${item.summary}::${item.detail}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }

  return result;
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

function mergeSentences(items: string[], maxItems = 2): string {
  const cleaned = uniqueStrings(items.map((s) => s.trim()).filter(Boolean));
  return cleaned.slice(0, maxItems).join(' ');
}

function composeParagraph(outputs: RuleOutput[], type: 'summary' | 'detail' | 'advice'): string {
  if (!outputs.length) return '';
  const texts = outputs.map((o) => o[type]).filter(Boolean);
  return mergeSentences(texts, 3);
}

function composeList(outputs: RuleOutput[], type: 'summary' | 'detail', maxItems = 4): string[] {
  const texts = uniqueStrings(outputs.map((o) => o[type]).filter(Boolean));
  return texts.slice(0, maxItems);
}

function buildRuntimeContext(
  normalizedData: NormalizedChartData,
  runtimeTags: string[]
): Record<string, unknown> {
  return {
    ...normalizedData,
    day_master: normalizedData.chart.day_master,
    day_master_element: normalizedData.chart.day_master_element,
    month_branch: normalizedData.season.month_branch,
    month_element: normalizedData.season.month_element,
    seasonal_status: normalizedData.season.seasonal_status,
    has_root: normalizedData.strength.has_root,
    has_print: normalizedData.strength.has_print,
    has_output: normalizedData.strength.has_output,
    has_wealth: normalizedData.strength.has_wealth,
    has_officer_kill: normalizedData.strength.has_officer_kill,
    strength_level: normalizedData.strength.strength_level,
    visible_ten_gods: normalizedData.ten_gods.visible_list,
    hidden_ten_gods: normalizedData.ten_gods.hidden_list,
    visible_ten_gods_count: normalizedData.ten_gods.visible_count,
    all_ten_gods_count: normalizedData.ten_gods.all_count,
    surface_element_count: normalizedData.five_elements.surface_count,
    tags_present: runtimeTags,
  };
}

function applyRule(rule: RuleDefinition, state: RuleEngineState): RuleEngineState {
  const nextState: RuleEngineState = {
    ...state,
    tags: [...state.tags],
    scores: { ...state.scores },
    statements: [...state.statements],
    matched_rules: [...state.matched_rules],
  };

  if (rule.effects.add_tags?.length) {
    nextState.tags = uniqueStrings([...nextState.tags, ...rule.effects.add_tags]);
  }

  if (rule.effects.remove_tags?.length) {
    nextState.tags = nextState.tags.filter((t) => !rule.effects.remove_tags!.includes(t));
  }

  if (rule.effects.override_tags?.length) {
    nextState.tags = uniqueStrings([...nextState.tags, ...rule.effects.override_tags]);
  }

  if (rule.effects.scores) {
    for (const [key, value] of Object.entries(rule.effects.scores) as [ScoreKey, number][]) {
      nextState.scores[key] += value;
    }
  }

  nextState.statements.push({
    rule_id: rule.id,
    priority: rule.priority,
    category: rule.category,
    scope: rule.scope,
    output: rule.output,
  });

  nextState.matched_rules.push(rule.id);
  return nextState;
}

const RULES_V1: RuleDefinition[] = [
  {
    id: 'R001',
    name: '甲木日主基礎規則',
    enabled: true,
    type: 'base',
    priority: 'P2',
    category: 'day_master',
    scope: 'personality',
    trigger: { day_master: '甲' },
    effects: {
      add_tags: ['甲木日主', '直向成長', '主見', '承擔'],
      scores: { flexibility: 1, discipline: 1 },
    },
    output: {
      summary: '你本質上較重視方向、原則與承擔感。',
      detail:
        '甲木日主通常會自然把注意力放在方向感、責任感與事情能不能撐住。很多時候不是只想感受，而是會本能地想把事情做好、顧好、往前推。',
      advice: '適合把主見與責任感轉成穩定輸出，而不是只靠一時硬撐。',
      ui_block: 'personality',
    },
  },
  {
    id: 'R002',
    name: '乙木日主基礎規則',
    enabled: true,
    type: 'base',
    priority: 'P2',
    category: 'day_master',
    scope: 'personality',
    trigger: { day_master: '乙' },
    effects: {
      add_tags: ['乙木日主', '細膩', '柔性', '重感受', '重適應'],
      scores: { flexibility: 2, introspection: 1 },
    },
    output: {
      summary: '你本質上偏向細膩、柔性與重感受。',
      detail:
        '乙木日主通常較重視感受、互動與環境變化。做事不一定高調，但常會先觀察情勢，再用比較細緻的方式調整自己的做法。',
      advice: '適合在保有彈性的前提下，慢慢建立自己的節奏與判斷。',
      ui_block: 'personality',
    },
  },
  {
    id: 'R010',
    name: '酉月主軸規則',
    enabled: true,
    type: 'base',
    priority: 'P1',
    category: 'month_order',
    scope: 'core',
    trigger: { month_branch: '酉' },
    effects: {
      add_tags: ['酉月', '規則感', '收斂', '標準', '結果要求'],
      scores: { discipline: 2, pressure: 1, practicality: 1 },
    },
    output: {
      summary: '你的主環境傾向規則、標準與結果要求。',
      detail:
        '酉月帶有較明顯的收斂、秩序與成果判斷感。這通常表示你所在的主要場域，不太容易完全照感覺走，而會一直面對效率、比較與要求。',
      advice: '與其抗拒規則，不如建立自己的應對方法與輸出節奏。',
      ui_block: 'core_summary',
    },
  },
  {
    id: 'R011',
    name: '得令規則',
    enabled: true,
    type: 'base',
    priority: 'P1',
    category: 'strength',
    scope: 'core',
    trigger: { seasonal_status: '得令' },
    effects: {
      add_tags: ['日主得令'],
      scores: { self_strength: 2 },
    },
    output: {
      summary: '你的日主在時節上較有承接力。',
      detail:
        '得令表示你的核心結構較容易和外在時令互相呼應，因此整體承接力通常較穩，也比較容易把自己的特質自然發揮出來。',
      advice: '可把優勢放在持續輸出與穩定累積，而不只是短期爆發。',
      ui_block: 'core_summary',
    },
  },
  {
    id: 'R012',
    name: '失令規則',
    enabled: true,
    type: 'base',
    priority: 'P1',
    category: 'strength',
    scope: 'core',
    trigger: { seasonal_status: '失令' },
    effects: {
      add_tags: ['日主失令'],
      scores: { self_strength: -2, pressure: 1 },
    },
    output: {
      summary: '你的自我節奏較容易受外在影響。',
      detail:
        '失令時，日主能量不完全順著時節發展，因此更容易感受到環境、條件與外部要求的牽動。很多時候不是你不想照自己走，而是情勢會逼你一直調整。',
      advice: '遇到壓力時，不必只靠硬撐，先建立補強自己的節奏會更穩。',
      ui_block: 'core_summary',
    },
  },
  {
    id: 'R013',
    name: '有根規則',
    enabled: true,
    type: 'base',
    priority: 'P1',
    category: 'strength',
    scope: 'core',
    trigger: { has_root: true },
    effects: {
      add_tags: ['日主有根'],
      scores: { self_strength: 2, flexibility: 1 },
    },
    output: {
      summary: '你不是沒有底氣，只是力量較需要時間站穩。',
      detail:
        '有根表示你的內在並不是完全浮動的，仍有承接點與穩住自己的位置。即使外在有壓力，也不代表你會完全失去主軸。',
      advice: '適合用穩定累積的方式建立自信與結果。',
      ui_block: 'core_summary',
    },
  },
  {
    id: 'R014',
    name: '有印規則',
    enabled: true,
    type: 'base',
    priority: 'P2',
    category: 'strength',
    scope: 'mindset',
    trigger: { has_print: true },
    effects: {
      add_tags: ['有印星', '吸收內化', '思考補給'],
      scores: { self_strength: 1, introspection: 2 },
    },
    output: {
      summary: '你遇到事情時，往往會先吸收與消化。',
      detail:
        '命盤中有印星，通常表示思考、吸收與內化能力較明顯。你未必會立刻把情緒或想法外放，而是比較容易先在心裡整理過一輪。',
      advice: '適合學習與深度整理，但也要注意別把壓力全部悶在心裡。',
      ui_block: 'mindset',
    },
  },
  {
    id: 'R015',
    name: '食傷透出規則',
    enabled: true,
    type: 'base',
    priority: 'P2',
    category: 'ten_god',
    scope: 'career',
    trigger: { has_output: true },
    effects: {
      add_tags: ['食傷透出', '表達能力', '輸出能力'],
      scores: { expression: 2 },
    },
    output: {
      summary: '你的命盤有不錯的輸出與表達傾向。',
      detail:
        '食傷力量出現時，通常代表表達、整理觀點、輸出內容與把想法說清楚的能力比較容易被看見。',
      advice: '若能把表達力連結到實際成果，這份優勢通常會更穩定。',
      ui_block: 'strengths',
    },
  },
  {
    id: 'R016',
    name: '財星存在規則',
    enabled: true,
    type: 'base',
    priority: 'P2',
    category: 'ten_god',
    scope: 'career',
    trigger: { has_wealth: true },
    effects: {
      add_tags: ['財星存在', '成果導向', '現實感'],
      scores: { practicality: 2 },
    },
    output: {
      summary: '你做事通常會自然考慮成果與落地。',
      detail:
        '財星存在時，通常表示你不太會只停在想法層面，而會自然去思考資源、成本、效率與最後能不能真正做成。',
      advice: '這是很強的實務能力，但也要避免一直被結果壓著走。',
      ui_block: 'strengths',
    },
  },
  {
    id: 'R018',
    name: '官殺存在規則',
    enabled: true,
    type: 'base',
    priority: 'P2',
    category: 'ten_god',
    scope: 'core',
    trigger: { has_officer_kill: true },
    effects: {
      add_tags: ['官殺存在', '要求感', '壓力框架'],
      scores: { pressure: 1, discipline: 1 },
    },
    output: {
      summary: '你命盤裡也帶有明顯的要求感。',
      detail:
        '官殺存在時，通常表示你對規則、責任、外界標準與自我要求都比較有感。這種力量常讓人不容易完全鬆散。',
      advice: '若能把壓力轉成秩序與責任感，反而會成為穩定推進力。',
      ui_block: 'core_summary',
    },
  },
  {
    id: 'R019',
    name: '甲木 × 財星組合規則',
    enabled: true,
    type: 'combo',
    priority: 'P2',
    category: 'ten_god',
    scope: 'career',
    trigger: { day_master: '甲', has_wealth: true },
    effects: {
      add_tags: ['甲木配財星', '理想落地', '務實推進'],
      scores: { practicality: 1 },
    },
    output: {
      summary: '你不只會想，也傾向把事情真正做成。',
      detail:
        '甲木配財星時，常見把原則、方向感與現實落地結合，形成既想推進事情、也願意為成果負責的傾向。',
      advice: '適合用階段成果的方式建立自己的成就感與信心。',
      ui_block: 'strengths',
    },
  },
  {
    id: 'R020',
    name: '乙木 × 財星組合規則',
    enabled: true,
    type: 'combo',
    priority: 'P2',
    category: 'ten_god',
    scope: 'career',
    trigger: { day_master: '乙', has_wealth: true },
    effects: {
      add_tags: ['乙木配財星', '柔性務實', '會衡量可行性'],
      scores: { practicality: 1 },
    },
    output: {
      summary: '你不是只憑感覺做事的人。',
      detail:
        '乙木配財星時，常見做事不只是看感受，也會自然去衡量成本、資源、執行條件與實際可行性。',
      advice: '適合把想法轉成成果，但也要避免什麼都先從成本壓自己。',
      ui_block: 'strengths',
    },
  },
  {
    id: 'R021',
    name: '失令但有根修正规則',
    enabled: true,
    type: 'revision',
    priority: 'P3',
    category: 'revision',
    scope: 'core',
    trigger: { seasonal_status: '失令', has_root: true },
    effects: {
      add_tags: ['失令有根', '非極弱'],
      scores: { self_strength: 1 },
    },
    output: {
      summary: '你雖然不算得勢，但也不是站不住。',
      detail:
        '失令但有根時，不宜直接判為極弱。這代表你雖然容易受環境影響，但內在仍有可承接、可回穩的位置。',
      advice: '這類命盤更適合走穩定累積，而不是用極端方式證明自己。',
      ui_block: 'revision_note',
    },
  },
  {
    id: 'R022',
    name: '表層五行修正规則',
    enabled: true,
    type: 'revision',
    priority: 'P3',
    category: 'revision',
    scope: 'core',
    trigger: { surface_element_count: {} },
    effects: {
      add_tags: ['五行表層統計僅供參考'],
    },
    output: {
      summary: '五行比例可參考，但不能直接當成最終強弱。',
      detail:
        '五行比例若只是表層統計，只能作為快速觀察依據，不能直接等同真實旺衰。真正判讀仍要結合月令、根氣、藏干與十神結構。',
      advice: '解讀時要避免只看數量，而忽略位置、時節與整體結構。',
      ui_block: 'revision_note',
    },
  },
];

export function runRuleEngine(normalizedData: NormalizedChartData): RuleEngineState {
  const sortedRules = [...RULES_V1].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  );

  let state: RuleEngineState = {
    tags: uniqueStrings([
      ...normalizedData.structure.main_pattern_tags,
      ...normalizedData.derived_tags,
    ]),
    scores: initScoreBoard(),
    statements: [],
    matched_rules: [],
  };

  for (const rule of sortedRules) {
    const context = buildRuntimeContext(normalizedData, state.tags);

    if (!matchTrigger(rule.trigger, context)) continue;

    let matched = true;
    for (const condition of rule.conditions || []) {
      if (!evaluateCondition(condition, context)) {
        matched = false;
        break;
      }
    }

    if (matched) {
      state = applyRule(rule, state);
    }
  }

  return state;
}

export function composeFrontendResult(engineState: RuleEngineState): FrontendResult {
  const grouped: Record<UiBlock, RuleOutput[]> = {
    core_summary: [],
    personality: [],
    strengths: [],
    risks: [],
    revision_note: [],
    advice: [],
    mindset: [],
  };

  for (const s of engineState.statements) {
    grouped[s.output.ui_block].push(s.output);
  }

  for (const key of Object.keys(grouped) as UiBlock[]) {
    grouped[key] = dedupeOutputs(grouped[key]);
  }

  const coreSummaries = grouped.core_summary.map((o) => o.summary).filter(Boolean);
  const headline = coreSummaries.length
    ? truncateText(coreSummaries[0], 26)
    : '此命盤已有初步解讀結果。';

  return {
    headline,
    core_summary: composeParagraph(grouped.core_summary, 'detail'),
    personality: composeParagraph(grouped.personality, 'detail'),
    strengths: composeList(grouped.strengths, 'summary', 4),
    mindset: composeParagraph(grouped.mindset, 'detail'),
    risks: composeList(grouped.risks, 'summary', 3),
    revision_note: composeParagraph(grouped.revision_note, 'detail'),
    advice: mergeSentences(
      [
        composeParagraph(grouped.core_summary, 'advice'),
        composeParagraph(grouped.strengths, 'advice'),
        composeParagraph(grouped.mindset, 'advice'),
        composeParagraph(grouped.revision_note, 'advice'),
      ].filter(Boolean),
      3
    ),
    matched_rules: engineState.matched_rules,
    tags: engineState.tags,
    scores: engineState.scores,
  };
}

export function generateBaziInterpretation(
  normalizedData: NormalizedChartData
): FrontendResult {
  const engineState = runRuleEngine(normalizedData);
  return composeFrontendResult(engineState);
}