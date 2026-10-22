import type { BaziResult, Pillar } from '@/types/bazi';
import { cities, type City } from '@/data/cities';
// Sites reference v1 heuristic: transparent, intentionally not an empirical climate model.
export function climateIndex(pillars: Record<string, Pillar>): BaziResult['climate'] {
  const month = pillars.month.earthlyBranch;
  const season = '巳午未'.includes(month) ? 2 : '亥子丑'.includes(month) ? -2 : 0;
  const fireStems = '丙丁',
    waterStems = '壬癸';
  const all = Object.values(pillars);
  let fire = 0,
    water = 0,
    hiddenFire = 0,
    hiddenWater = 0;
  for (const p of all) {
    fire += Number(fireStems.includes(p.heavenlyStem)) + Number('巳午'.includes(p.earthlyBranch));
    water += Number(waterStems.includes(p.heavenlyStem)) + Number('亥子'.includes(p.earthlyBranch));
    const weights =
      p.hiddenStems?.length === 1
        ? [1]
        : p.hiddenStems?.length === 2
          ? [0.7, 0.3]
          : [0.6, 0.3, 0.1];
    // Existing 巳 display order is 丙庚戊, while Sites weights 丙戊庚. Keep presentation and weight by stem.
    if (p.earthlyBranch === '巳') {
      weights[1] = 0.1;
      weights[2] = 0.3;
    }
    p.hiddenStems?.forEach((h, i) => {
      hiddenFire += Number(fireStems.includes(h.stem)) * weights[i];
      hiddenWater += Number(waterStems.includes(h.stem)) * weights[i];
    });
  }
  // Sites uses 巳 main/middle/residual weights .6/.3/.1; hidden-stem order is deliberate.
  const delta = Math.round((fire - water + hiddenFire - hiddenWater) * 10) / 10;
  const supplement = delta >= 2 ? 1 : delta <= -2 ? -1 : 0;
  const monthMoisture: Record<string, number> = {
    子: 1,
    丑: 2,
    辰: 2,
    巳: -1,
    午: -1,
    未: -2,
    戌: -2,
    亥: 1,
  };
  const other = Object.entries(pillars)
    .filter(([key]) => key !== 'month')
    .map(([, p]) => p.earthlyBranch);
  const secondary =
    other.filter((b) => '子丑辰亥'.includes(b)).length -
    other.filter((b) => '巳午未戌'.includes(b)).length;
  const branchSupplement = secondary >= 2 ? 1 : secondary <= -2 ? -1 : 0;
  return {
    heat: season + supplement,
    moisture: (monthMoisture[month] || 0) + branchSupplement,
    reasons: [
      `月支 ${month}：冬 −2、夏 +2、春秋 0，本盤季節基分 ${season}`,
      `表層火 ${fire} − 水 ${water}，加藏干火 ${hiddenFire.toFixed(1)} − 水 ${hiddenWater.toFixed(1)} = ${delta.toFixed(1)}；差 ≥2 加1、≤−2 減1，本盤補分 ${supplement}`,
      '藏干按本氣／中氣／餘氣探索權重：單干1、雙干0.7/0.3、三干0.6/0.3/0.1；並非流派公認強度。',
      `燥濕月支 ${monthMoisture[month] || 0} + 其他三支濕(子丑辰亥)減燥(巳午未戌)差 ${secondary}（差≥2 加1、≤−2 減1）= ${(monthMoisture[month] || 0) + branchSupplement}`,
      '兩軸 −3..3；≤−2 偏寒／燥，≥2 偏熱／濕，−1..1 未達門檻。為 Sites v1 探索規則，非醫療診斷或完整調候定論。',
    ],
  };
}
export function scoreCity(city: City, chart: Pick<BaziResult['climate'], 'heat' | 'moisture'>) {
  const target = { heat: -chart.heat, moisture: -chart.moisture };
  const heat = Math.max(0, 4 - Math.abs(city.heat - target.heat));
  const moisture = Math.max(0, 4 - Math.abs(city.moisture - target.moisture));
  const verified = city.status === 'verified' && city.normal?.verification === 'verified';
  return {
    city,
    target,
    heat,
    moisture,
    total: heat + moisture,
    percent: explorationPercent(heat + moisture),
    formalScore: verified ? heat + moisture : null,
    reasons: [
      `互補目標 = 命盤兩軸取相反值：寒熱 ${target.heat}，乾濕 ${target.moisture}`,
      `寒熱 max(0, 4 − |${city.heat} − (${target.heat})|) = ${heat}`,
      `乾濕 max(0, 4 − |${city.moisture} − (${target.moisture})|) = ${moisture}`,
      `探索總分 ${heat} + ${moisture} = ${heat + moisture} / 8；不是適居機率`,
    ],
  };
}
// The percentage is a display scale for the site's 8-point heuristic, never a probability.
export function explorationPercent(points: number) {
  return Math.round((Math.max(0, Math.min(8, points)) / 8) * 100);
}
export function countrySummaries(
  chart: Pick<BaziResult['climate'], 'heat' | 'moisture'>,
  catalog = cities
) {
  return [...new Set(catalog.map((c) => c.country))].map((country) => {
    const included = catalog.filter((c) => c.country === country).map((c) => scoreCity(c, chart));
    const mean = included.reduce((s, c) => s + c.total, 0) / included.length;
    return {
      country,
      included: included.map((c) => c.city.name),
      mean,
      percent: explorationPercent(mean),
    };
  });
}
