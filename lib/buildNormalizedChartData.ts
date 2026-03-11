import type { BaziResult, FiveElementName, TenGodName } from '@/types/bazi';
import type {
  FiveElement,
  Gender,
  NormalizedChartData,
  RootLevel,
  StrengthLevel,
} from '@/lib/baziRuleEngine';

const STEM_ELEMENT_MAP: Record<string, FiveElement> = {
  甲: '木',
  乙: '木',
  丙: '火',
  丁: '火',
  戊: '土',
  己: '土',
  庚: '金',
  辛: '金',
  壬: '水',
  癸: '水',
};

const STEM_YINYANG_MAP: Record<string, '陰' | '陽'> = {
  甲: '陽',
  乙: '陰',
  丙: '陽',
  丁: '陰',
  戊: '陽',
  己: '陰',
  庚: '陽',
  辛: '陰',
  壬: '陽',
  癸: '陰',
};

const BRANCH_ELEMENT_MAP: Record<string, FiveElement> = {
  子: '水',
  丑: '土',
  寅: '木',
  卯: '木',
  辰: '土',
  巳: '火',
  午: '火',
  未: '土',
  申: '金',
  酉: '金',
  戌: '土',
  亥: '水',
};

const EN_TO_ZH_ELEMENT_MAP: Record<FiveElementName, FiveElement> = {
  wood: '木',
  fire: '火',
  earth: '土',
  metal: '金',
  water: '水',
};

function countTenGods(items: string[]): Record<string, number> {
  const base: Record<string, number> = {
    比肩: 0,
    劫財: 0,
    食神: 0,
    傷官: 0,
    正財: 0,
    偏財: 0,
    正官: 0,
    七殺: 0,
    正印: 0,
    偏印: 0,
    日主: 0,
  };

  for (const item of items) {
    if (!item) continue;
    if (base[item] !== undefined) {
      base[item] += 1;
    } else {
      base[item] = 1;
    }
  }

  return base;
}

function getResourceElement(dayElement: FiveElement): FiveElement {
  const map: Record<FiveElement, FiveElement> = {
    木: '水',
    火: '木',
    土: '火',
    金: '土',
    水: '金',
  };
  return map[dayElement];
}

function inferSeasonalStatus(dayElement: FiveElement, monthElement: FiveElement): string {
  const resource = getResourceElement(dayElement);
  if (monthElement === dayElement || monthElement === resource) {
    return '得令';
  }
  return '失令';
}

function inferRootInfo(result: BaziResult, dayElement: FiveElement) {
  const rootSources: string[] = [];

  const pillars = [
    { key: '年', pillar: result.pillars.year },
    { key: '月', pillar: result.pillars.month },
    { key: '日', pillar: result.pillars.day },
    { key: '時', pillar: result.pillars.hour },
  ];

  for (const item of pillars) {
    const branchElement = BRANCH_ELEMENT_MAP[item.pillar.earthlyBranch];
    if (branchElement === dayElement) {
      rootSources.push(`${item.key}支${item.pillar.earthlyBranch}`);
    }

    for (const hidden of item.pillar.hiddenStems || []) {
      const zhElement = EN_TO_ZH_ELEMENT_MAP[hidden.element];
      if (zhElement === dayElement) {
        rootSources.push(`${item.key}支藏干${hidden.stem}`);
      }
    }
  }

  let rootLevel: RootLevel = '無';
  if (rootSources.length >= 3) rootLevel = '強';
  else if (rootSources.length >= 2) rootLevel = '中';
  else if (rootSources.length >= 1) rootLevel = '弱';

  return {
    hasRoot: rootSources.length > 0,
    rootSources,
    rootLevel,
  };
}

function collectTenGodSources(
  result: BaziResult,
  targets: TenGodName[]
): string[] {
  const sources: string[] = [];

  const rows = [
    { key: '年柱', data: result.tenGods.year },
    { key: '月柱', data: result.tenGods.month },
    { key: '日柱', data: result.tenGods.day },
    { key: '時柱', data: result.tenGods.hour },
  ];

  for (const row of rows) {
    if (targets.includes(row.data.stemTenGod)) {
      sources.push(`${row.key}天干`);
    }

    for (const item of row.data.hiddenStemTenGods) {
      if (targets.includes(item.tenGod)) {
        sources.push(`${row.key}藏干${item.stem}`);
      }
    }
  }

  return sources;
}

function inferStrengthLevel(
  seasonalStatus: string,
  hasRoot: boolean,
  hasPrint: boolean
): StrengthLevel {
  if (seasonalStatus === '得令' && hasRoot && hasPrint) return '偏強';
  if (seasonalStatus === '得令' && (hasRoot || hasPrint)) return '中和';
  if (seasonalStatus === '失令' && hasRoot && hasPrint) return '偏弱';
  if (seasonalStatus === '失令' && (hasRoot || hasPrint)) return '偏弱';
  return '極弱';
}

function buildStrengthNote(
  seasonalStatus: string,
  hasRoot: boolean,
  hasPrint: boolean
): string {
  if (seasonalStatus === '得令' && hasRoot && hasPrint) {
    return '得令且有根、有印，整體承接力較穩。';
  }
  if (seasonalStatus === '失令' && hasRoot && hasPrint) {
    return '失令但有根、有印，不屬極弱。';
  }
  if (seasonalStatus === '失令' && hasRoot) {
    return '失令但仍有根氣支撐。';
  }
  if (seasonalStatus === '失令' && hasPrint) {
    return '失令但仍有印星回補。';
  }
  return '整體仍需結合更多結構細節判斷。';
}

function inferSeasonalPowerHint(
  monthElement: FiveElement,
  surfaceCount: Record<FiveElement, number>
): Record<FiveElement, string> {
  const result: Record<FiveElement, string> = {
    木: '中',
    火: '中',
    土: '中',
    金: '中',
    水: '中',
  };

  for (const key of Object.keys(surfaceCount) as FiveElement[]) {
    if (surfaceCount[key] <= 15) result[key] = '偏弱';
    if (surfaceCount[key] >= 30) result[key] = '偏強';
  }

  result[monthElement] = '偏強';
  return result;
}

export function buildNormalizedChartData(result: BaziResult): NormalizedChartData {
  const dayStem = result.pillars.day.heavenlyStem;
  const monthBranch = result.pillars.month.earthlyBranch;
  const monthElement = BRANCH_ELEMENT_MAP[monthBranch];
  const dayElement = STEM_ELEMENT_MAP[dayStem];

  const seasonalStatus = inferSeasonalStatus(dayElement, monthElement);
  const rootInfo = inferRootInfo(result, dayElement);

  const printSources = collectTenGodSources(result, ['正印', '偏印']);
  const outputSources = collectTenGodSources(result, ['食神', '傷官']);
  const wealthSources = collectTenGodSources(result, ['正財', '偏財']);
  const officerKillSources = collectTenGodSources(result, ['正官', '七殺']);

  const visibleList = [
    result.tenGods.year.stemTenGod,
    result.tenGods.month.stemTenGod,
    result.tenGods.hour.stemTenGod,
  ].filter(Boolean);

  const hiddenList = [
    ...result.tenGods.year.hiddenStemTenGods.map((i) => i.tenGod),
    ...result.tenGods.month.hiddenStemTenGods.map((i) => i.tenGod),
    ...result.tenGods.day.hiddenStemTenGods.map((i) => i.tenGod),
    ...result.tenGods.hour.hiddenStemTenGods.map((i) => i.tenGod),
  ].filter(Boolean);

  const visibleCount = countTenGods(visibleList);
  const allCount = countTenGods([...visibleList, ...hiddenList]);

  const hasPrint = printSources.length > 0;
  const hasOutput = outputSources.length > 0;
  const hasWealth = wealthSources.length > 0;
  const hasOfficerKill = officerKillSources.length > 0;

  const strengthLevel = inferStrengthLevel(seasonalStatus, rootInfo.hasRoot, hasPrint);
  const strengthNote = buildStrengthNote(seasonalStatus, rootInfo.hasRoot, hasPrint);

  const surfaceCount: Record<FiveElement, number> = {
    木: result.fiveElements.wood,
    火: result.fiveElements.fire,
    土: result.fiveElements.earth,
    金: result.fiveElements.metal,
    水: result.fiveElements.water,
  };

  const surfacePercent: Record<FiveElement, number> = {
    木: result.fiveElements.wood,
    火: result.fiveElements.fire,
    土: result.fiveElements.earth,
    金: result.fiveElements.metal,
    水: result.fiveElements.water,
  };

  const mainPatternTags: string[] = [
    `${dayStem}${dayElement}日主`,
    `${monthBranch}月`,
    `日主${seasonalStatus}`,
  ];

  if (rootInfo.hasRoot) mainPatternTags.push('日主有根');
  if (hasPrint) mainPatternTags.push('有印星');
  if (hasOutput) mainPatternTags.push('食傷透出');
  if ((visibleCount['食神'] ?? 0) >= 2) mainPatternTags.push('食神雙透');
  if (hasWealth) mainPatternTags.push('財星透出');
  if (hasOfficerKill) mainPatternTags.push('官殺存在');
  mainPatternTags.push(`${monthElement}當令`);

  return {
    meta: {
      gender: result.gender as Gender,
      calendar_type: result.calendarType,
      timezone: 'Asia/Taipei',
      birth_place: result.birthPlace,
      birth_datetime: `${result.birthDate}T${result.birthTime}:00+08:00`,
      day_rollover_rule: '00:00',
      solar_term_mode: 'jieqi',
    },
    chart: {
      year_pillar: `${result.pillars.year.heavenlyStem}${result.pillars.year.earthlyBranch}`,
      month_pillar: `${result.pillars.month.heavenlyStem}${result.pillars.month.earthlyBranch}`,
      day_pillar: `${result.pillars.day.heavenlyStem}${result.pillars.day.earthlyBranch}`,
      hour_pillar: `${result.pillars.hour.heavenlyStem}${result.pillars.hour.earthlyBranch}`,
      day_master: dayStem,
      day_master_element: dayElement,
      day_master_yin_yang: STEM_YINYANG_MAP[dayStem],
    },
    pillars: {
      year: {
        stem: result.pillars.year.heavenlyStem,
        branch: result.pillars.year.earthlyBranch,
      },
      month: {
        stem: result.pillars.month.heavenlyStem,
        branch: result.pillars.month.earthlyBranch,
      },
      day: {
        stem: result.pillars.day.heavenlyStem,
        branch: result.pillars.day.earthlyBranch,
      },
      hour: {
        stem: result.pillars.hour.heavenlyStem,
        branch: result.pillars.hour.earthlyBranch,
      },
    },
    hidden_stems: {
      year: (result.pillars.year.hiddenStems || []).map((i) => i.stem),
      month: (result.pillars.month.hiddenStems || []).map((i) => i.stem),
      day: (result.pillars.day.hiddenStems || []).map((i) => i.stem),
      hour: (result.pillars.hour.hiddenStems || []).map((i) => i.stem),
    },
    ten_gods: {
      visible: {
        year_stem: result.tenGods.year.stemTenGod,
        month_stem: result.tenGods.month.stemTenGod,
        day_stem: '日主',
        hour_stem: result.tenGods.hour.stemTenGod,
      },
      hidden: {
        year_branch: result.tenGods.year.hiddenStemTenGods.map((i) => i.tenGod),
        month_branch: result.tenGods.month.hiddenStemTenGods.map((i) => i.tenGod),
        day_branch: result.tenGods.day.hiddenStemTenGods.map((i) => i.tenGod),
        hour_branch: result.tenGods.hour.hiddenStemTenGods.map((i) => i.tenGod),
      },
      visible_list: visibleList,
      hidden_list: hiddenList,
      visible_count: visibleCount,
      all_count: allCount,
    },
    five_elements: {
      surface_count: surfaceCount,
      surface_percent: surfacePercent,
      seasonal_power_hint: inferSeasonalPowerHint(monthElement, surfaceCount),
    },
    season: {
      current_solar_term: result.solarTerm?.current || '',
      previous_solar_term: result.solarTerm?.previous || '',
      next_solar_term: result.solarTerm?.next || '',
      month_branch: monthBranch,
      month_element: monthElement,
      seasonal_status: seasonalStatus,
    },
    strength: {
      has_root: rootInfo.hasRoot,
      root_sources: rootInfo.rootSources,
      root_level: rootInfo.rootLevel,
      has_print: hasPrint,
      print_sources: printSources,
      has_output: hasOutput,
      output_sources: outputSources,
      has_wealth: hasWealth,
      wealth_sources: wealthSources,
      has_officer_kill: hasOfficerKill,
      officer_kill_sources: officerKillSources,
      strength_level: strengthLevel,
      strength_note: strengthNote,
    },
    structure: {
      main_pattern_tags: mainPatternTags,
      core_summary_seed: [],
    },
    derived_tags: [],
  };
}