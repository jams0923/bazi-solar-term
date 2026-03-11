import type { FrontendResult } from '@/lib/baziRuleEngine';

function InfoChip({
  text,
  emphasis = 'normal',
}: {
  text: string;
  emphasis?: 'normal' | 'soft' | 'strong';
}) {
  const className = [
    'bazi-interpretation-chip',
    emphasis === 'soft'
      ? 'bazi-interpretation-chip-soft'
      : emphasis === 'strong'
        ? 'bazi-interpretation-chip-strong'
        : 'bazi-interpretation-chip-normal',
  ].join(' ');

  return <span className={className}>{text}</span>;
}

function SectionTitle({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="bazi-interpretation-section-title-wrap">
      <h3 className="bazi-interpretation-section-title">{children}</h3>
      {hint ? <p className="bazi-interpretation-section-hint">{hint}</p> : null}
    </div>
  );
}

function SubCard({
  title,
  hint,
  children,
  highlighted = false,
  minHeight,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  highlighted?: boolean;
  minHeight?: number;
}) {
  const className = [
    'bazi-interpretation-subcard',
    highlighted ? 'bazi-interpretation-subcard-highlighted' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={className} style={minHeight ? { minHeight } : undefined}>
      <SectionTitle hint={hint}>{title}</SectionTitle>
      <div className="bazi-interpretation-subcard-body">{children}</div>
    </div>
  );
}

function ScoreBar({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  const percent = Math.max(0, Math.min(100, 50 + value * 10));

  return (
    <div className="bazi-interpretation-score-card">
      <div className="bazi-interpretation-score-head">
        <div>
          <div className="bazi-interpretation-score-label">{label}</div>
          <div className="bazi-interpretation-score-description">{description}</div>
        </div>

        <div className="bazi-interpretation-score-value">{value}</div>
      </div>

      <div className="bazi-interpretation-score-track">
        <div
          className="bazi-interpretation-score-fill"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (!items.length) {
    return <span>—</span>;
  }

  return (
    <ul className="bazi-interpretation-bullets">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function RuleDisclosure({
  matchedRules,
  tags,
}: {
  matchedRules: string[];
  tags: string[];
}) {
  return (
    <details className="bazi-interpretation-disclosure">
      <summary className="bazi-interpretation-disclosure-summary">
        查看本次判讀依據
      </summary>

      <div className="bazi-interpretation-disclosure-body">
        <div>
          <div className="bazi-interpretation-disclosure-label">命中規則</div>
          <div className="bazi-interpretation-chip-list">
            {matchedRules.length ? (
              matchedRules.map((rule) => (
                <InfoChip key={rule} text={rule} emphasis="soft" />
              ))
            ) : (
              <span className="bazi-interpretation-empty-text">無</span>
            )}
          </div>
        </div>

        <div>
          <div className="bazi-interpretation-disclosure-label">結構標籤</div>
          <div className="bazi-interpretation-chip-list">
            {tags.length ? (
              tags.map((tag) => <InfoChip key={tag} text={tag} emphasis="soft" />)
            ) : (
              <span className="bazi-interpretation-empty-text">無</span>
            )}
          </div>
        </div>
      </div>
    </details>
  );
}

export default function BaziInterpretationCard({ result }: { result: FrontendResult }) {
  return (
    <section className="bazi-interpretation-card">
      <div className="bazi-interpretation-glow" />

      <div className="bazi-interpretation-header">
        <div className="bazi-interpretation-header-main">
          <div className="bazi-interpretation-header-badge">
            <InfoChip text="命盤 × 結構判讀" emphasis="strong" />
          </div>

          <h2 className="bazi-interpretation-title">進階命理解讀</h2>

          <p className="bazi-interpretation-intro">
            這份解讀會從命盤結構出發，整理你較容易展現的個性底色、優勢傾向、思維模式與平衡方向。重點不是絕對定論，而是幫你更清楚看見自己的穩定特質與容易被放大的面向。
          </p>
        </div>

        <div className="bazi-interpretation-header-chips">
          <InfoChip text="偏向結構觀察" emphasis="soft" />
          <InfoChip text="不做神斷式定論" emphasis="soft" />
        </div>
      </div>

      <div className="bazi-interpretation-hero">
        <div className="bazi-interpretation-hero-label">本次主結論</div>

        <h3 className="bazi-interpretation-hero-title">{result.headline || '—'}</h3>

        <p className="bazi-interpretation-hero-summary">
          {result.core_summary || '—'}
        </p>
      </div>

      <div className="bazi-interpretation-grid bazi-interpretation-grid-3">
        <SubCard
          title="個性底色"
          hint="偏向你平常自然呈現出來的內在基調與感受方式。"
          minHeight={188}
        >
          {result.personality || '—'}
        </SubCard>

        <SubCard
          title="優勢傾向"
          hint="偏向你在互動、處理事情或表現能力上，較容易展現出來的強項。"
          minHeight={188}
        >
          <BulletList items={result.strengths} />
        </SubCard>

        <SubCard
          title="思考與內在模式"
          hint="偏向你在思考、承受壓力與面對環境時，內在比較容易採取的節奏。"
          minHeight={188}
        >
          {result.mindset || '—'}
        </SubCard>
      </div>

      <div className="bazi-interpretation-grid bazi-interpretation-grid-2">
        <SubCard
          title="解讀修正提醒"
          hint="這一段是避免過度單一化解讀，提醒哪些條件會影響前面判讀的強弱。"
        >
          {result.revision_note || '—'}
        </SubCard>

        <SubCard
          title="平衡建議"
          hint="不是要完全改變自己，而是提供你更穩定地運用自身結構的方向。"
          highlighted
        >
          {result.advice || '—'}
        </SubCard>
      </div>

      <div className="bazi-interpretation-scores-wrap">
        <SectionTitle hint="分數不是吉凶高低，而是用來協助你看出不同傾向在命盤中的相對存在感。">
          傾向分數
        </SectionTitle>

        <div className="bazi-interpretation-scores-grid">
          <ScoreBar
            label="自我承接力"
            value={result.scores.self_strength}
            description="自我穩定、承擔與維持自身節奏的傾向。"
          />
          <ScoreBar
            label="表達輸出"
            value={result.scores.expression}
            description="把想法、能力或行動往外釋放的傾向。"
          />
          <ScoreBar
            label="現實落地"
            value={result.scores.practicality}
            description="把事情做成、落實到具體結果的傾向。"
          />
          <ScoreBar
            label="壓力感"
            value={result.scores.pressure}
            description="對責任、規範或外在要求較有感的程度。"
          />
          <ScoreBar
            label="彈性適應"
            value={result.scores.flexibility}
            description="面對變動、轉向與調整時的適應傾向。"
          />
          <ScoreBar
            label="內省思考"
            value={result.scores.introspection}
            description="偏向觀察、回看與內在整理的傾向。"
          />
          <ScoreBar
            label="規則感"
            value={result.scores.discipline}
            description="偏向秩序、框架與穩定方法的重視程度。"
          />
        </div>
      </div>

      <RuleDisclosure matchedRules={result.matched_rules} tags={result.tags} />
    </section>
  );
}