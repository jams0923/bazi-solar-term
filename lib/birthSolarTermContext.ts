import { solarTerms } from '@/data/solarTerms';
import type { NormalizedChartData, FiveElement } from '@/lib/baziRuleEngine';
import type { SolarTermMeta } from '@/types/solarTerm';

export interface BirthSolarTermContext {
  previous: SolarTermMeta;
  current: SolarTermMeta;
  next: SolarTermMeta;
  monthBranch: string;
  dayMaster: string;
  dayElement: FiveElement;
  relation: string;
}

const GENERATES: Record<FiveElement, FiveElement> = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const CONTROLS: Record<FiveElement, FiveElement> = { 木: '土', 火: '金', 土: '水', 金: '木', 水: '火' };
const byName = new Map(solarTerms.map((term) => [term.name, term]));

export function buildBirthSolarTermContext(chart: NormalizedChartData): BirthSolarTermContext | null {
  const current = byName.get(chart.season.current_solar_term);
  if (!current) return null;
  const previous = solarTerms.find((term) => term.id === current.previousSolarTerm);
  const next = solarTerms.find((term) => term.id === current.nextSolarTerm);
  if (!previous || !next) return null;
  const termElement = current.element as FiveElement;
  const dayElement = chart.chart.day_master_element;
  let relation = '兩者在這套五行關係中相互制約。';
  if (termElement === dayElement) relation = '兩者在這套五行關係中同類。';
  else if (GENERATES[termElement] === dayElement) relation = '依五行相生，節氣象徵元素生助日主元素。';
  else if (GENERATES[dayElement] === termElement) relation = '依五行相生，日主元素生出節氣象徵元素。';
  else if (CONTROLS[termElement] === dayElement) relation = '依五行相剋，節氣象徵元素剋日主元素。';
  else if (CONTROLS[dayElement] === termElement) relation = '依五行相剋，日主元素剋節氣象徵元素。';
  return {
    previous, current, next,
    monthBranch: chart.pillars.month.branch,
    dayMaster: chart.chart.day_master,
    dayElement,
    relation,
  };
}
