import type { NormalizedChartData } from '@/lib/baziRuleEngine';
import {
  generateSolarTermInterpretation,
  type SolarTermInterpretationResult,
} from '@/lib/solarTermRuleEngine';
import { solarTerms } from '@/data/solarTerms';
import { SOLAR_TERM_DYNAMIC_RULES } from '@/data/solarTermDynamicRules';
import type { SolarTermMeta } from '@/types/solarTerm';

const SOLAR_TERM_LIST: SolarTermMeta[] = solarTerms as SolarTermMeta[];

const SOLAR_TERM_MAP: Record<string, SolarTermMeta> = Object.fromEntries(
  SOLAR_TERM_LIST.map((term) => [term.id, term])
);

const SOLAR_TERM_NAME_TO_ID: Record<string, string> = Object.fromEntries(
  SOLAR_TERM_LIST.map((term) => [term.name, term.id])
);

function normalizeTermName(name: string): string {
  return (name || '').trim();
}

function getTermById(termId: string): SolarTermMeta | null {
  return SOLAR_TERM_MAP[termId] ?? null;
}

function getTermByName(termName: string): SolarTermMeta | null {
  const normalizedName = normalizeTermName(termName);
  if (!normalizedName) return null;

  const directId = SOLAR_TERM_NAME_TO_ID[normalizedName];
  if (directId) {
    return getTermById(directId);
  }

  const matched = SOLAR_TERM_LIST.find((term) => term.name === normalizedName);
  return matched ?? null;
}

function getFallbackCurrentTerm(normalizedChartData: NormalizedChartData): SolarTermMeta {
  const monthBranch = normalizedChartData.season.month_branch;

  if (monthBranch === '寅' || monthBranch === '卯' || monthBranch === '辰') {
    return SOLAR_TERM_MAP['jingzhe'] ?? SOLAR_TERM_LIST[0];
  }

  if (monthBranch === '巳' || monthBranch === '午' || monthBranch === '未') {
    return SOLAR_TERM_MAP['xiazhi'] ?? SOLAR_TERM_LIST[0];
  }

  if (monthBranch === '申' || monthBranch === '酉' || monthBranch === '戌') {
    return SOLAR_TERM_MAP['bailu'] ?? SOLAR_TERM_LIST[0];
  }

  return SOLAR_TERM_MAP['dongzhi'] ?? SOLAR_TERM_LIST[0];
}

function resolveCurrentTerm(normalizedChartData: NormalizedChartData): SolarTermMeta {
  const currentSolarTermName = normalizeTermName(normalizedChartData.season.current_solar_term);
  const byName = getTermByName(currentSolarTermName);

  if (byName) return byName;

  return getFallbackCurrentTerm(normalizedChartData);
}

function resolvePreviousTerm(currentTerm: SolarTermMeta): SolarTermMeta {
  return getTermById(currentTerm.previousSolarTerm) ?? currentTerm;
}

function resolveNextTerm(currentTerm: SolarTermMeta): SolarTermMeta {
  return getTermById(currentTerm.nextSolarTerm) ?? currentTerm;
}

export interface BuiltSolarTermInterpretationPayload {
  previousTerm: SolarTermMeta;
  currentTerm: SolarTermMeta;
  nextTerm: SolarTermMeta;
  interpretation: SolarTermInterpretationResult;
}

export function buildSolarTermInterpretation(
  normalizedChartData: NormalizedChartData
): BuiltSolarTermInterpretationPayload {
  const currentTerm = resolveCurrentTerm(normalizedChartData);
  const previousTerm = resolvePreviousTerm(currentTerm);
  const nextTerm = resolveNextTerm(currentTerm);

  const interpretation = generateSolarTermInterpretation({
    previousTerm,
    currentTerm,
    nextTerm,
    normalizedChartData,
    rules: SOLAR_TERM_DYNAMIC_RULES,
  });

  return {
    previousTerm,
    currentTerm,
    nextTerm,
    interpretation,
  };
}