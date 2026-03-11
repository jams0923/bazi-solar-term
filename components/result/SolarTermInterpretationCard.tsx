import type { SolarTermInterpretationResult } from '@/lib/solarTermRuleEngine';
import type { SolarTermMeta } from '@/types/solarTerm';

interface SolarTermInterpretationCardProps {
  previousTerm: SolarTermMeta;
  currentTerm: SolarTermMeta;
  nextTerm: SolarTermMeta;
  interpretation: SolarTermInterpretationResult;
}

function safeString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function safeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
}

function InfoChip({
  text,
  emphasis = 'normal',
}: {
  text: string;
  emphasis?: 'normal' | 'soft' | 'strong';
}) {
  const className = [
    'solar-interpretation-chip',
    emphasis === 'soft'
      ? 'solar-interpretation-chip-soft'
      : emphasis === 'strong'
        ? 'solar-interpretation-chip-strong'
        : 'solar-interpretation-chip-normal',
  ].join(' ');

  return <span className={className}>{text}</span>;
}

function getPhaseLead(type: 'previous' | 'current' | 'next') {
  if (type === 'previous') {
    return {
      eyebrow: '回看上一段',
      intro:
        '這一段偏向回顧與承接，重點是看你最近剛走過的節奏，哪些感受其實還在延續。',
    };
  }

  if (type === 'current') {
    return {
      eyebrow: '現在最有感',
      intro:
        '這一段是目前最值得優先看的部分，因為它最接近你現在實際感受到的節奏與重點。',
    };
  }

  return {
    eyebrow: '接下來會轉向',
    intro:
      '這一段偏向預告與準備，不是要直接下定論，而是幫你先看到下一步可能放大的主題。',
  };
}

function getPhaseMeta(type: 'previous' | 'current' | 'next') {
  if (type === 'current') {
    return {
      badge: '本段重點',
      badgeEmphasis: 'strong' as const,
      cardClass: 'solar-interpretation-subcard solar-interpretation-subcard-current',
      introClass: 'solar-interpretation-intro-box solar-interpretation-intro-box-current',
    };
  }

  if (type === 'next') {
    return {
      badge: '下一步準備',
      badgeEmphasis: 'soft' as const,
      cardClass: 'solar-interpretation-subcard solar-interpretation-subcard-next',
      introClass: 'solar-interpretation-intro-box',
    };
  }

  return {
    badge: '承接觀察',
    badgeEmphasis: 'soft' as const,
    cardClass: 'solar-interpretation-subcard solar-interpretation-subcard-previous',
    introClass: 'solar-interpretation-intro-box',
  };
}

function TermMetaChips({ term }: { term: SolarTermMeta }) {
  const season = safeString((term as any)?.season);
  const phase = safeString((term as any)?.phase);
  const element = safeString((term as any)?.element);
  const subElement = safeString((term as any)?.subElement);
  const termName = safeString((term as any)?.name);
  const energyPattern = safeStringArray((term as any)?.energyPattern);

  return (
    <div className="solar-interpretation-meta-chips">
      {termName ? <InfoChip text={termName} emphasis="strong" /> : null}
      {season || phase ? (
        <InfoChip text={`${season}${season && phase ? '・' : ''}${phase}`} emphasis="soft" />
      ) : null}
      {element ? (
        <InfoChip text={`五行：${element}${subElement ? ` / ${subElement}` : ''}`} emphasis="soft" />
      ) : null}
      {energyPattern.slice(0, 2).map((item) => (
        <InfoChip key={item} text={item} emphasis="soft" />
      ))}
    </div>
  );
}

function SectionTitle({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="solar-interpretation-section-title-wrap">
      <h4 className="solar-interpretation-section-title">{children}</h4>
      {hint ? <p className="solar-interpretation-section-hint">{hint}</p> : null}
    </div>
  );
}

function ContentPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="solar-interpretation-panel">
      <div className="solar-interpretation-panel-label">{title}</div>
      <div className="solar-interpretation-panel-body">{children}</div>
    </div>
  );
}

function SituationList({ items }: { items: string[] }) {
  if (!items.length) {
    return <p className="solar-interpretation-empty-text">—</p>;
  }

  return (
    <ul className="solar-interpretation-bullets">
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
    <details className="solar-interpretation-disclosure">
      <summary className="solar-interpretation-disclosure-summary">
        查看本段判讀依據
      </summary>

      <div className="solar-interpretation-disclosure-body">
        <div>
          <div className="solar-interpretation-disclosure-label">命中規則</div>
          <div className="solar-interpretation-chip-list">
            {matchedRules.length ? (
              matchedRules.map((rule) => (
                <InfoChip key={rule} text={rule} emphasis="soft" />
              ))
            ) : (
              <span className="solar-interpretation-empty-text">無</span>
            )}
          </div>
        </div>

        <div>
          <div className="solar-interpretation-disclosure-label">結構標籤</div>
          <div className="solar-interpretation-chip-list">
            {tags.length ? (
              tags.map((tag) => <InfoChip key={tag} text={tag} emphasis="soft" />)
            ) : (
              <span className="solar-interpretation-empty-text">無</span>
            )}
          </div>
        </div>
      </div>
    </details>
  );
}

function SubCard({
  type,
  title,
  subtitle,
  term,
  summary,
  detail,
  situations,
  advice,
  matchedRules,
  tags,
}: {
  type: 'previous' | 'current' | 'next';
  title: string;
  subtitle: string;
  term: SolarTermMeta;
  summary: string;
  detail: string;
  situations: string[];
  advice: string;
  matchedRules: string[];
  tags: string[];
}) {
  const phaseLead = getPhaseLead(type);
  const phaseMeta = getPhaseMeta(type);

  return (
    <article className={phaseMeta.cardClass}>
      <div className="solar-interpretation-subcard-header">
        <div className="solar-interpretation-subcard-header-main">
          <div className="solar-interpretation-subcard-eyebrow">{phaseLead.eyebrow}</div>

          <h3
            className={[
              'solar-interpretation-subcard-title',
              type === 'current' ? 'solar-interpretation-subcard-title-current' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {title}
          </h3>

          <p className="solar-interpretation-subcard-subtitle">{subtitle}</p>
        </div>

        <InfoChip text={phaseMeta.badge} emphasis={phaseMeta.badgeEmphasis} />
      </div>

      <TermMetaChips term={term} />

      <div className={phaseMeta.introClass}>
        <p className="solar-interpretation-intro-text">{phaseLead.intro}</p>
      </div>

      <ContentPanel title="本段主結論">
        <p className="solar-interpretation-summary-text">{summary || '—'}</p>
      </ContentPanel>

      <ContentPanel title="延伸說明">
        <p className="solar-interpretation-body-text">{detail || '—'}</p>
      </ContentPanel>

      <ContentPanel title="可能較容易出現的狀況">
        <SituationList items={situations} />
      </ContentPanel>

      <ContentPanel title="建議方向">
        <p className="solar-interpretation-body-text">{advice || '—'}</p>
      </ContentPanel>

      <div className="solar-interpretation-subcard-footer">
        <RuleDisclosure matchedRules={matchedRules} tags={tags} />
      </div>
    </article>
  );
}

export default function SolarTermInterpretationCard({
  previousTerm,
  currentTerm,
  nextTerm,
  interpretation,
}: SolarTermInterpretationCardProps) {
  return (
    <section className="solar-interpretation-card">
      <div className="solar-interpretation-glow" />

      <div className="solar-interpretation-header">
        <div className="solar-interpretation-header-main">
          <div className="solar-interpretation-header-badge">
            <InfoChip text="節氣 × 命盤動態判讀" emphasis="strong" />
          </div>

          <h2 className="solar-interpretation-title">節氣動態解讀</h2>

          <p className="solar-interpretation-intro">
            依據前節氣、當前節氣與下節氣，結合你的命盤結構，整理這段時間較容易被放大的感受、節奏與判讀重點。重點不是絕對定論，而是幫你看清目前所處的階段性變化。
          </p>
        </div>

        <div className="solar-interpretation-header-chips">
          <InfoChip text="回顧 → 當下 → 預告" emphasis="soft" />
          <InfoChip text="偏向階段觀察" emphasis="soft" />
        </div>
      </div>

      <div className="solar-interpretation-grid">
        <SubCard
          type="previous"
          title={interpretation.previous.title}
          subtitle={interpretation.previous.subtitle}
          term={previousTerm}
          summary={interpretation.previous.summary}
          detail={interpretation.previous.detail}
          situations={interpretation.previous.situations}
          advice={interpretation.previous.advice}
          matchedRules={interpretation.previous.matchedRules}
          tags={interpretation.previous.tags}
        />

        <SubCard
          type="current"
          title={interpretation.current.title}
          subtitle={interpretation.current.subtitle}
          term={currentTerm}
          summary={interpretation.current.summary}
          detail={interpretation.current.detail}
          situations={interpretation.current.situations}
          advice={interpretation.current.advice}
          matchedRules={interpretation.current.matchedRules}
          tags={interpretation.current.tags}
        />

        <SubCard
          type="next"
          title={interpretation.next.title}
          subtitle={interpretation.next.subtitle}
          term={nextTerm}
          summary={interpretation.next.summary}
          detail={interpretation.next.detail}
          situations={interpretation.next.situations}
          advice={interpretation.next.advice}
          matchedRules={interpretation.next.matchedRules}
          tags={interpretation.next.tags}
        />
      </div>
    </section>
  );
}