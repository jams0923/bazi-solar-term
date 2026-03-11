import type { NormalizedChartData } from '@/lib/baziRuleEngine';
import type { SolarTermMeta } from '@/types/solarTerm';

export type SolarTermPhaseType = 'previous' | 'current' | 'next';

export type SolarTermDynamicScoreKey =
  | 'activation'
  | 'pressure'
  | 'expression'
  | 'stability'
  | 'reflection'
  | 'adaptation'
  | 'execution'
  | 'closure'
  | 'practicality';

export interface SolarTermDynamicCondition {
  field: string;
  operator: '=' | '!=' | 'contains' | 'in' | '>=' | '<=';
  value: unknown;
}

export interface SolarTermRuleOutput {
  title?: string;
  subtitle?: string;
  summaryTemplate: string;
  detailTemplate: string;
  situationsTemplate: string[];
  adviceTemplate: string;
}

export interface SolarTermRuleEffects {
  add_tags?: string[];
  remove_tags?: string[];
  scores?: Partial<Record<SolarTermDynamicScoreKey, number>>;
  focusThemes?: string[];
  situationTags?: string[];
  templateVars?: Record<string, string>;
}

export interface SolarTermDynamicRule {
  id: string;
  name: string;
  enabled: boolean;
  type: 'solar_term_dynamic';
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  phase: SolarTermPhaseType;
  category:
    | 'term_base'
    | 'term_day_master'
    | 'term_strength'
    | 'term_ten_god'
    | 'term_structure'
    | 'term_transition';
  trigger: Record<string, unknown>;
  conditions?: SolarTermDynamicCondition[];
  effects: SolarTermRuleEffects;
  output: SolarTermRuleOutput;
  notes?: string;
}

export interface SolarTermRuleContext {
  phase: SolarTermPhaseType;
  solarTerm: SolarTermMeta;
  transition: {
    fromTerm?: SolarTermMeta | null;
    toTerm?: SolarTermMeta | null;
  };
  chart: {
    day_master: string;
    day_master_element: '木' | '火' | '土' | '金' | '水';
  };
  strength: {
    seasonal_status: string;
    has_root: boolean;
    has_print: boolean;
    has_output: boolean;
    has_wealth: boolean;
    has_officer_kill: boolean;
    strength_level: string;
  };
  structure: {
    main_pattern_tags: string[];
  };
  tags_present: string[];
}

export interface SolarTermRuleStatement {
  rule_id: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  output: SolarTermRuleOutput;
  templateVars: Record<string, string>;
}

export interface SolarTermRuleState {
  tags: string[];
  scores: Record<SolarTermDynamicScoreKey, number>;
  focusThemes: string[];
  situationTags: string[];
  statements: SolarTermRuleStatement[];
  matched_rules: string[];
}

export interface SolarTermInterpretationBlock {
  type: SolarTermPhaseType;
  title: string;
  subtitle: string;
  summary: string;
  detail: string;
  situations: string[];
  advice: string;
  matchedRules: string[];
  tags: string[];
  scores: Record<SolarTermDynamicScoreKey, number>;
}

export interface SolarTermInterpretationResult {
  previous: SolarTermInterpretationBlock;
  current: SolarTermInterpretationBlock;
  next: SolarTermInterpretationBlock;
}

const PRIORITY_ORDER: Record<'P1' | 'P2' | 'P3' | 'P4', number> = {
  P1: 1,
  P2: 2,
  P3: 3,
  P4: 4,
};

function uniqueStrings(arr: string[]): string[] {
  return Array.from(new Set(arr.filter(Boolean)));
}

function safeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
}

function safeString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
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
  operator: SolarTermDynamicCondition['operator'],
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
      if (Array.isArray(actualValue)) return anyInArray(actualValue, expectedValue);
      return Array.isArray(expectedValue) ? expectedValue.includes(actualValue) : false;
    case '>=':
      return Number(actualValue) >= Number(expectedValue);
    case '<=':
      return Number(actualValue) <= Number(expectedValue);
    default:
      return false;
  }
}

function evaluateCondition(
  condition: SolarTermDynamicCondition,
  context: Record<string, unknown>
): boolean {
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

function initSolarTermScoreBoard(): Record<SolarTermDynamicScoreKey, number> {
  return {
    activation: 0,
    pressure: 0,
    expression: 0,
    stability: 0,
    reflection: 0,
    adaptation: 0,
    execution: 0,
    closure: 0,
    practicality: 0,
  };
}

function renderTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? '');
}

function sortRulesByPriority(rules: SolarTermDynamicRule[]): SolarTermDynamicRule[] {
  return [...rules].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
}

function getTermEnergyPattern(term: SolarTermMeta): string[] {
  return safeStringArray((term as unknown as Record<string, unknown>).energyPattern);
}

function getTermInterpretationFocus(term: SolarTermMeta): string[] {
  return safeStringArray((term as unknown as Record<string, unknown>).interpretationFocus);
}

function buildBaseTemplateVars(context: SolarTermRuleContext): Record<string, string> {
  const energyPattern = getTermEnergyPattern(context.solarTerm);
  const interpretationFocus = getTermInterpretationFocus(context.solarTerm);
  const chartTags = safeStringArray(context.structure.main_pattern_tags);

  return {
    termName: safeString(context.solarTerm.name),
    termElement: safeString(context.solarTerm.element),
    termEnergy1: energyPattern[0] ?? '',
    termEnergy2: energyPattern[1] ?? '',
    focusTheme: interpretationFocus[0] ?? '',
    dayMaster: safeString(context.chart.day_master),
    dayMasterElement: safeString(context.chart.day_master_element),
    strengthStatus: safeString(context.strength.seasonal_status),
    chartTag1: chartTags[0] ?? '',
    chartTag2: chartTags[1] ?? '',
    chartTag3: chartTags[2] ?? '',
    fromTerm: safeString(context.transition.fromTerm?.name),
    toTerm: safeString(context.transition.toTerm?.name),
  };
}

export function buildSolarTermRuleContext(
  phase: SolarTermPhaseType,
  solarTerm: SolarTermMeta,
  transition: { fromTerm?: SolarTermMeta | null; toTerm?: SolarTermMeta | null },
  normalizedChartData: NormalizedChartData,
  runtimeTags: string[] = []
): SolarTermRuleContext {
  return {
    phase,
    solarTerm,
    transition,
    chart: {
      day_master: normalizedChartData.chart.day_master,
      day_master_element: normalizedChartData.chart.day_master_element,
    },
    strength: {
      seasonal_status: normalizedChartData.season.seasonal_status,
      has_root: normalizedChartData.strength.has_root,
      has_print: normalizedChartData.strength.has_print,
      has_output: normalizedChartData.strength.has_output,
      has_wealth: normalizedChartData.strength.has_wealth,
      has_officer_kill: normalizedChartData.strength.has_officer_kill,
      strength_level: normalizedChartData.strength.strength_level,
    },
    structure: {
      main_pattern_tags: normalizedChartData.structure.main_pattern_tags,
    },
    tags_present: runtimeTags,
  };
}

export function runSolarTermRulePhase(
  phase: SolarTermPhaseType,
  context: SolarTermRuleContext,
  rules: SolarTermDynamicRule[]
): SolarTermRuleState {
  const phaseRules = sortRulesByPriority(
    rules.filter((rule) => rule.enabled && rule.phase === phase)
  );

  let state: SolarTermRuleState = {
    tags: [],
    scores: initSolarTermScoreBoard(),
    focusThemes: [],
    situationTags: [],
    statements: [],
    matched_rules: [],
  };

  for (const rule of phaseRules) {
    const runtimeContext = {
      ...context,
      tags_present: [...context.tags_present, ...state.tags],
    };

    if (!matchTrigger(rule.trigger, runtimeContext)) continue;

    let matched = true;
    for (const condition of rule.conditions || []) {
      if (!evaluateCondition(condition, runtimeContext)) {
        matched = false;
        break;
      }
    }

    if (!matched) continue;

    if (rule.effects.add_tags?.length) {
      state.tags = uniqueStrings([...state.tags, ...rule.effects.add_tags]);
    }

    if (rule.effects.remove_tags?.length) {
      state.tags = state.tags.filter((tag) => !rule.effects.remove_tags!.includes(tag));
    }

    if (rule.effects.focusThemes?.length) {
      state.focusThemes = uniqueStrings([...state.focusThemes, ...rule.effects.focusThemes]);
    }

    if (rule.effects.situationTags?.length) {
      state.situationTags = uniqueStrings([...state.situationTags, ...rule.effects.situationTags]);
    }

    if (rule.effects.scores) {
      for (const [key, value] of Object.entries(rule.effects.scores) as [
        SolarTermDynamicScoreKey,
        number
      ][]) {
        state.scores[key] += value;
      }
    }

    const baseVars = buildBaseTemplateVars(context);

    const templateVars = {
      ...baseVars,
      ...(rule.effects.templateVars ?? {}),
      focusTheme:
        state.focusThemes[0] ??
        baseVars.focusTheme ??
        '',
    };

    state.statements.push({
      rule_id: rule.id,
      priority: rule.priority,
      output: rule.output,
      templateVars,
    });

    state.matched_rules.push(rule.id);
  }

  return state;
}

function dedupeStringsKeepOrder(items: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of items) {
    const normalized = item.trim();
    if (!normalized) continue;
    if (!seen.has(normalized)) {
      seen.add(normalized);
      result.push(normalized);
    }
  }

  return result;
}

function composeSolarTermBlock(
  phase: SolarTermPhaseType,
  state: SolarTermRuleState
): SolarTermInterpretationBlock {
  const sortedStatements = [...state.statements].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  );

  const first = sortedStatements[0];

  const title = first?.output.title ?? getDefaultTitle(phase);
  const subtitle = first?.output.subtitle ?? getDefaultSubtitle(phase);

  const summaries = dedupeStringsKeepOrder(
    sortedStatements.map((s) => renderTemplate(s.output.summaryTemplate, s.templateVars))
  );

  const details = dedupeStringsKeepOrder(
    sortedStatements.map((s) => renderTemplate(s.output.detailTemplate, s.templateVars))
  );

  const situations = dedupeStringsKeepOrder(
    sortedStatements.flatMap((s) =>
      s.output.situationsTemplate.map((item) => renderTemplate(item, s.templateVars))
    )
  ).slice(0, 3);

  const advices = dedupeStringsKeepOrder(
    sortedStatements.map((s) => renderTemplate(s.output.adviceTemplate, s.templateVars))
  );

  return {
    type: phase,
    title,
    subtitle,
    summary: summaries[0] ?? '',
    detail: details.slice(0, 2).join(' '),
    situations,
    advice: advices.slice(0, 2).join(' '),
    matchedRules: state.matched_rules,
    tags: state.tags,
    scores: state.scores,
  };
}

function getDefaultTitle(phase: SolarTermPhaseType): string {
  if (phase === 'previous') return '前個節氣影響';
  if (phase === 'current') return '當前節氣重點';
  return '下個節氣預告';
}

function getDefaultSubtitle(phase: SolarTermPhaseType): string {
  if (phase === 'previous') return '剛走過的節奏';
  if (phase === 'current') return '現在最有感的影響';
  return '接下來的轉向';
}

export function generateSolarTermInterpretation(params: {
  previousTerm: SolarTermMeta;
  currentTerm: SolarTermMeta;
  nextTerm: SolarTermMeta;
  normalizedChartData: NormalizedChartData;
  rules: SolarTermDynamicRule[];
}): SolarTermInterpretationResult {
  const { previousTerm, currentTerm, nextTerm, normalizedChartData, rules } = params;

  const previousContext = buildSolarTermRuleContext(
    'previous',
    previousTerm,
    {
      fromTerm: null,
      toTerm: currentTerm,
    },
    normalizedChartData
  );

  const currentContext = buildSolarTermRuleContext(
    'current',
    currentTerm,
    {
      fromTerm: previousTerm,
      toTerm: nextTerm,
    },
    normalizedChartData
  );

  const nextContext = buildSolarTermRuleContext(
    'next',
    nextTerm,
    {
      fromTerm: currentTerm,
      toTerm: null,
    },
    normalizedChartData
  );

  const previousState = runSolarTermRulePhase('previous', previousContext, rules);
  const currentState = runSolarTermRulePhase('current', currentContext, rules);
  const nextState = runSolarTermRulePhase('next', nextContext, rules);

  return {
    previous: composeSolarTermBlock('previous', previousState),
    current: composeSolarTermBlock('current', currentState),
    next: composeSolarTermBlock('next', nextState),
  };
}