'use client';
import { useState } from 'react';
import BirthForm from './BirthForm';
import { calculateBazi } from '@/lib/bazi';
import { buildNormalizedChartData } from '@/lib/buildNormalizedChartData';
import { generateBaziInterpretation } from '@/lib/baziRuleEngine';
import { buildSolarTermInterpretation } from '@/lib/buildSolarTermInterpretation';
import type { BaziResult } from '@/types/bazi';
import BaziChartCard from '@/components/result/BaziChartCard';
import FiveElementsCard from '@/components/result/FiveElementsCard';
import TenGodsCard from '@/components/result/TenGodsCard';
import ResultSummary from '@/components/result/ResultSummary';
import SolarTermCard from '@/components/result/SolarTermCard';
import BaziInterpretationCard from '@/components/result/BaziInterpretationCard';
import SolarTermInterpretationCard from '@/components/result/SolarTermInterpretationCard';
import ChartContext from '@/components/result/ChartContext';
import CityExplorer from '@/components/explore/CityExplorer';
export default function ChartForm() {
  const [result, setResult] = useState<BaziResult>();
  const normalized = result ? buildNormalizedChartData(result) : undefined;
  const solar =
    normalized && result?.solarTerm ? buildSolarTermInterpretation(normalized) : undefined;
  return (
    <>
      <BirthForm
        mode="bazi"
        onCalculate={(input) => {
          const chart = calculateBazi(input);
          if (!input.includeSolarTerm) delete chart.solarTerm;
          setResult(chart);
        }}
      />
      {result && normalized && (
        <div className="chart-output" aria-live="polite">
          <h1>你的命盤結果已生成</h1>
          <ChartContext result={result} />
          <ResultSummary result={result} />
          <div className="explore-grid">
            <BaziChartCard result={result} />
            <FiveElementsCard result={result} />
          </div>
          <TenGodsCard result={result} />
          {result.solarTerm && <SolarTermCard result={result} />}
          <BaziInterpretationCard result={generateBaziInterpretation(normalized)} />
          {solar && <SolarTermInterpretationCard {...solar} />}
          <CityExplorer chart={result.climate} />
        </div>
      )}
    </>
  );
}
