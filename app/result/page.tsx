import ResultSummary from '@/components/result/ResultSummary';
import BaziChartCard from '@/components/result/BaziChartCard';
import FiveElementsCard from '@/components/result/FiveElementsCard';
import SolarTermCard from '@/components/result/SolarTermCard';
import TenGodsCard from '@/components/result/TenGodsCard';
import BaziInterpretationCard from '@/components/result/BaziInterpretationCard';
import SolarTermInterpretationCard from '@/components/result/SolarTermInterpretationCard';
import { calculateBazi } from '@/lib/bazi';
import { buildNormalizedChartData } from '@/lib/buildNormalizedChartData';
import { generateBaziInterpretation } from '@/lib/baziRuleEngine';
import { buildSolarTermInterpretation } from '@/lib/buildSolarTermInterpretation';
import type { ChartFormInput } from '@/types/bazi';

interface ResultPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const params = (await searchParams) || {};

  const input: ChartFormInput = {
    name: typeof params.name === 'string' ? params.name : '',
    gender:
      params.gender === 'female'
        ? 'female'
        : params.gender === 'other'
          ? 'other'
          : 'male',
    birthDate: typeof params.birthDate === 'string' ? params.birthDate : '1990-01-01',
    birthTime: typeof params.birthTime === 'string' ? params.birthTime : '12:00',
    birthPlace: typeof params.birthPlace === 'string' ? params.birthPlace : '台灣 台北',
    calendarType: params.calendarType === 'lunar' ? 'lunar' : 'solar',
    includeSolarTerm: params.includeSolarTerm === 'false' ? false : true,
  };

  const result = calculateBazi(input);

  if (!input.includeSolarTerm) {
    delete result.solarTerm;
  }

  const normalized = buildNormalizedChartData(result);
  const interpretationResult = generateBaziInterpretation(normalized);
  const solarTermInterpretationPayload = buildSolarTermInterpretation(normalized);

  return (
    <section className="section result-page-shell">
      <div className="container">
        <header className="result-page-hero">
          <div className="result-page-hero-glow" />

          <div className="result-page-hero-head">
            <div className="result-page-hero-main">
              <div className="result-page-hero-badges">
                <span className="badge">四柱排盤結果</span>
                <span className="badge">24 小時制顯示</span>
                <span className="badge">節氣整合判讀</span>
              </div>

              <h1 className="title-xl result-page-title">你的命盤結果已生成</h1>

              <p className="result-page-intro">
                這份結果會先呈現基礎命盤結構，再整理五行、十神與節氣資訊，最後進一步延伸到命盤結構解讀與節氣動態判讀。重點不是絕對定論，而是幫你更清楚看見自己的核心傾向、當前節奏與後續轉向。
              </p>
            </div>

            <div className="result-page-hero-side">
              <div className="result-page-highlight-card">
                <div className="result-page-highlight-label">本頁閱讀順序</div>
                <div className="result-page-highlight-list">
                  <span>1. 基礎命盤結果</span>
                  <span>2. 結構與五行輔助資訊</span>
                  <span>3. 進階命理解讀</span>
                  <span>4. 節氣動態解讀</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="result-page-section">
          <div className="result-page-section-head">
            <div>
              <div className="result-page-section-kicker">基礎結果</div>
              <h2 className="result-page-section-title">先看命盤與核心結構</h2>
            </div>

            <p className="result-page-section-desc">
              這一區先整理出生資訊、四柱命盤、十神關係與基本結構，讓你先掌握整體盤面，再往下看更深一層的解讀。
            </p>
          </div>

          <div className="result-grid">
            <div className="result-main-col">
              <ResultSummary result={result} />
              <BaziChartCard result={result} />
              <TenGodsCard result={result} />
            </div>

            <div className="result-side-col">
              <FiveElementsCard result={result} />
              <SolarTermCard result={result} />
            </div>
          </div>
        </section>

        <section className="result-page-section result-page-section-analysis">
          <div className="result-page-section-head">
            <div>
              <div className="result-page-section-kicker">進階分析</div>
              <h2 className="result-page-section-title">命盤結構的延伸解讀</h2>
            </div>

            <p className="result-page-section-desc">
              這一段會把命盤結構整理成更容易閱讀的主結論、個性底色、優勢傾向與平衡建議，幫你從盤面進一步看到較穩定的內在輪廓。
            </p>
          </div>

          <div className="result-page-analysis-block">
            <BaziInterpretationCard result={interpretationResult} />
          </div>
        </section>

        <section className="result-page-section result-page-section-analysis">
          <div className="result-page-section-head">
            <div>
              <div className="result-page-section-kicker">節氣動態</div>
              <h2 className="result-page-section-title">把節氣節奏一起放進來看</h2>
            </div>

            <p className="result-page-section-desc">
              這一段不是只看固定命盤，而是把前節氣、當前節氣與下節氣一起納入，觀察最近較容易被放大的感受、事件節奏與轉場方向。
            </p>
          </div>

          <div className="result-page-analysis-block">
            <SolarTermInterpretationCard
              previousTerm={solarTermInterpretationPayload.previousTerm}
              currentTerm={solarTermInterpretationPayload.currentTerm}
              nextTerm={solarTermInterpretationPayload.nextTerm}
              interpretation={solarTermInterpretationPayload.interpretation}
            />
          </div>
        </section>

        <footer className="result-page-footer-note">
          <p>
            本頁內容以命盤結構與節氣節奏為基礎進行整理，適合用來理解個人傾向、階段感受與觀察方向；若後續你還要再做文案統一、版面細修或規則擴充，這一版已經可以作為正式結果頁骨架往下延伸。
          </p>
        </footer>
      </div>
    </section>
  );
}