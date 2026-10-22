import ResultSummary from '@/components/result/ResultSummary';
import BaziChartCard from '@/components/result/BaziChartCard';
import FiveElementsCard from '@/components/result/FiveElementsCard';
import SolarTermCard from '@/components/result/SolarTermCard';
import TenGodsCard from '@/components/result/TenGodsCard';
import BaziInterpretationCard from '@/components/result/BaziInterpretationCard';
import CareerDirectionsCard from '@/components/result/CareerDirectionsCard';
import SolarTermInterpretationCard from '@/components/result/SolarTermInterpretationCard';
import { calculateBazi } from '@/lib/bazi';
import { buildNormalizedChartData } from '@/lib/buildNormalizedChartData';
import { generateBaziNarrative } from '@/lib/baziNarrative';
import { getCareerOverview } from '@/lib/careerDirections';
import { buildBirthSolarTermContext } from '@/lib/birthSolarTermContext';
import Link from 'next/link';
import ChartContext from '@/components/result/ChartContext';
import { parseBirthQuery } from '@/lib/birthQuery';

interface ResultPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const params = (await searchParams) || {};

  if (!params.birthDate || !params.birthTime)
    return (
      <section className="section">
        <div className="container">
          <h1>請先輸入出生資料</h1>
          <p>此入口不預設任何人的出生日期。</p>
          <Link className="btn" href="/paipan">
            前往八字排盤
          </Link>
        </div>
      </section>
    );
  let input;
  let result;
  try {
    input = parseBirthQuery(params);
    result = calculateBazi(input);
  } catch (error) {
    return (
      <section className="section">
        <div className="container">
          <h1>無法排盤</h1>
          <p role="alert">{error instanceof Error ? error.message : '出生資料無效'}</p>
          <Link className="btn" href="/paipan">
            重新輸入
          </Link>
        </div>
      </section>
    );
  }

  if (!input.includeSolarTerm) {
    delete result.solarTerm;
  }

  const normalized = buildNormalizedChartData(result);
  const interpretationResult = generateBaziNarrative(normalized);
  const careerOverview = getCareerOverview(normalized);
  const solarTermInterpretationPayload = result.solarTerm
    ? buildBirthSolarTermContext(normalized)
    : undefined;

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
                <span className="badge">出生節氣對照</span>
              </div>

              <h1 className="title-xl result-page-title">你的命盤結果已生成</h1>

              <p className="result-page-intro">
                這份結果會先呈現基礎命盤結構，再整理五行、十神、職業探索與節氣資訊。每項職業方向都有命盤依據與實際檢核問題，幫你從多種角度認識自己的選項。
              </p>
            </div>

            <div className="result-page-hero-side">
              <div className="result-page-highlight-card">
                <div className="result-page-highlight-label">本頁閱讀順序</div>
                <div className="result-page-highlight-list">
                  <span>1. 基礎命盤結果</span>
                  <span>2. 結構與五行輔助資訊</span>
                  <span>3. 進階命理解讀</span>
                  <span>4. 職業方向探索</span>
                  <span>5. 出生節氣對照</span>
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
              <ChartContext result={result} />
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
              逐段對照月令、日主、十神位置與藏干，明列盤面來源及核對問題；不以相同的性格文案套用所有命盤。
            </p>
          </div>

          <div className="result-page-analysis-block">
            <BaziInterpretationCard result={interpretationResult} />
          </div>
        </section>

        <section className="result-page-section" id="career-directions">
          <CareerDirectionsCard overview={careerOverview} />
        </section>

        {solarTermInterpretationPayload && (
          <section className="result-page-section result-page-section-analysis">
            <div className="result-page-section-head">
              <div>
                <div className="result-page-section-kicker">節氣動態</div>
                <h2 className="result-page-section-title">核對出生時的節氣位置</h2>
              </div>

              <p className="result-page-section-desc">
                依出生時間顯示所屬節氣與前後相鄰節氣，並列出月支、日干及本站採用的五行象徵關係。
              </p>
            </div>

            <div className="result-page-analysis-block">
              <SolarTermInterpretationCard context={solarTermInterpretationPayload} />
            </div>
          </section>
        )}

        <footer className="result-page-footer-note">
          <p>
            本頁按輸入的出生時間排盤；進階文字列出規則依據，節氣欄位用來核對出生時節。命理描述適合當作探索題目，仍請以實際經驗核對。
          </p>
        </footer>
      </div>
    </section>
  );
}
