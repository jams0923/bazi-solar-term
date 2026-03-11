import type { CSSProperties } from 'react';
import type { BaziResult, Pillar, TenGodName } from '@/types/bazi';
import {
  getElementMetaByBranch,
  getElementMetaByStem,
  FIVE_ELEMENT_META,
} from '@/lib/fiveElementColors';
import TenGodGlossaryTag from '@/components/ui/TenGodGlossaryTag';

const TEN_GOD_META: Record<
  TenGodName,
  { color: string; bg: string; border: string; stemBg: string }
> = {
  比肩: {
    color: '#4FC3F7',
    bg: 'rgba(79,195,247,0.10)',
    border: 'rgba(79,195,247,0.32)',
    stemBg: 'rgba(79,195,247,0.12)',
  },
  劫財: {
    color: '#29B6F6',
    bg: 'rgba(41,182,246,0.10)',
    border: 'rgba(41,182,246,0.32)',
    stemBg: 'rgba(41,182,246,0.12)',
  },
  食神: {
    color: '#66BB6A',
    bg: 'rgba(102,187,106,0.10)',
    border: 'rgba(102,187,106,0.32)',
    stemBg: 'rgba(102,187,106,0.12)',
  },
  傷官: {
    color: '#EF5350',
    bg: 'rgba(239,83,80,0.10)',
    border: 'rgba(239,83,80,0.32)',
    stemBg: 'rgba(239,83,80,0.12)',
  },
  偏財: {
    color: '#FFB74D',
    bg: 'rgba(255,183,77,0.10)',
    border: 'rgba(255,183,77,0.32)',
    stemBg: 'rgba(255,183,77,0.12)',
  },
  正財: {
    color: '#FFA726',
    bg: 'rgba(255,167,38,0.10)',
    border: 'rgba(255,167,38,0.32)',
    stemBg: 'rgba(255,167,38,0.12)',
  },
  七殺: {
    color: '#AB47BC',
    bg: 'rgba(171,71,188,0.10)',
    border: 'rgba(171,71,188,0.32)',
    stemBg: 'rgba(171,71,188,0.12)',
  },
  正官: {
    color: '#7E57C2',
    bg: 'rgba(126,87,194,0.10)',
    border: 'rgba(126,87,194,0.32)',
    stemBg: 'rgba(126,87,194,0.12)',
  },
  偏印: {
    color: '#26A69A',
    bg: 'rgba(38,166,154,0.10)',
    border: 'rgba(38,166,154,0.32)',
    stemBg: 'rgba(38,166,154,0.12)',
  },
  正印: {
    color: '#26C6DA',
    bg: 'rgba(38,198,218,0.10)',
    border: 'rgba(38,198,218,0.32)',
    stemBg: 'rgba(38,198,218,0.12)',
  },
};

function buildTenGodTagStyle(text: TenGodName): CSSProperties {
  const meta = TEN_GOD_META[text];

  return {
    color: meta.color,
    background: meta.bg,
    borderColor: meta.border,
    boxShadow: `inset 0 0 0 1px ${meta.border.replace('0.32', '0.12')}`,
  };
}

function buildDualChipStyle(text: TenGodName): CSSProperties {
  const meta = TEN_GOD_META[text];

  return {
    color: meta.color,
    borderColor: meta.border,
    background: `linear-gradient(180deg, ${meta.bg}, rgba(255,255,255,0.02))`,
    boxShadow: `inset 0 0 0 1px ${meta.border.replace('0.32', '0.10')}`,
    ['--ten-god-stem-bg' as string]: meta.stemBg,
  };
}

function TenGodTag({ text }: { text: TenGodName }) {
  return (
    <TenGodGlossaryTag
      tenGod={text}
      className="pillar-table-tag ten-god-clickable-tag"
      style={buildTenGodTagStyle(text)}
    />
  );
}

function HiddenStemChip({
  stem,
  element,
}: {
  stem: string;
  element: keyof typeof FIVE_ELEMENT_META;
}) {
  const meta = FIVE_ELEMENT_META[element];

  return (
    <span
      className="pillar-hidden-chip"
      style={{
        color: meta.color,
        borderColor: `${meta.color}66`,
        background: `linear-gradient(180deg, ${meta.color}16, ${meta.color}08)`,
        boxShadow: `inset 0 0 0 1px ${meta.color}22, 0 0 10px ${meta.color}10`,
      }}
    >
      {stem}
    </span>
  );
}

function HiddenStemTenGodDualChip({
  stem,
  tenGod,
}: {
  stem: string;
  tenGod: TenGodName;
}) {
  return (
    <TenGodGlossaryTag
      tenGod={tenGod}
      className="ten-gods-dual-chip ten-god-clickable-tag"
      style={buildDualChipStyle(tenGod)}
    >
      <span className="ten-gods-dual-chip-stem">{stem}</span>
      <span className="ten-gods-dual-chip-divider">｜</span>
      <span className="ten-gods-dual-chip-god">{tenGod}</span>
    </TenGodGlossaryTag>
  );
}

function PillarTable({
  pillar,
  tenGods,
}: {
  pillar: Pillar;
  tenGods: BaziResult['tenGods']['year'];
}) {
  const stemMeta = getElementMetaByStem(pillar.heavenlyStem);
  const branchMeta = getElementMetaByBranch(pillar.earthlyBranch);

  return (
    <div className="pillar-table-card">
      <div className="pillar-table-head">{pillar.label}</div>

      <div className="pillar-table-body">
        <div className="pillar-table-row">
          <div className="pillar-table-label">天干十神</div>
          <div className="pillar-table-value">
            <TenGodTag text={tenGods.stemTenGod} />
          </div>
        </div>

        <div className="pillar-table-row">
          <div className="pillar-table-label">天干</div>
          <div className="pillar-table-value">
            <span
              className="pillar-table-main-char"
              style={{
                color: stemMeta.color,
                textShadow: `0 0 10px ${stemMeta.color}55, 0 0 22px ${stemMeta.color}22`,
              }}
            >
              {pillar.heavenlyStem}
            </span>
          </div>
        </div>

        <div className="pillar-table-row">
          <div className="pillar-table-label">地支</div>
          <div className="pillar-table-value">
            <span
              className="pillar-table-main-char"
              style={{
                color: branchMeta.color,
                textShadow: `0 0 10px ${branchMeta.color}55, 0 0 22px ${branchMeta.color}22`,
              }}
            >
              {pillar.earthlyBranch}
            </span>
          </div>
        </div>

        <div className="pillar-table-row">
          <div className="pillar-table-label">藏干</div>
          <div className="pillar-table-value pillar-table-wrap">
            {pillar.hiddenStems?.length ? (
              pillar.hiddenStems.map((item) => (
                <HiddenStemChip
                  key={`${pillar.label}-${item.stem}`}
                  stem={item.stem}
                  element={item.element}
                />
              ))
            ) : (
              <span className="text-muted">無</span>
            )}
          </div>
        </div>

        <div className="pillar-table-row">
          <div className="pillar-table-label">藏干十神</div>
          <div className="pillar-table-value pillar-table-wrap">
            {tenGods.hiddenStemTenGods.length ? (
              tenGods.hiddenStemTenGods.map((item) => (
                <HiddenStemTenGodDualChip
                  key={`${pillar.label}-${item.stem}-${item.tenGod}`}
                  stem={item.stem}
                  tenGod={item.tenGod}
                />
              ))
            ) : (
              <span className="text-muted">無</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BaziChartCard({ result }: { result: BaziResult }) {
  const pillars = [
    { pillar: result.pillars.year, tenGods: result.tenGods.year },
    { pillar: result.pillars.month, tenGods: result.tenGods.month },
    { pillar: result.pillars.day, tenGods: result.tenGods.day },
    { pillar: result.pillars.hour, tenGods: result.tenGods.hour },
  ];

  return (
    <div className="card" style={{ padding: 24 }}>
      <div className="section-head-inline">
        <h2 className="title-lg" style={{ marginBottom: 0 }}>
          四柱命盤
        </h2>
        <span className="badge">可點擊十神說明</span>
      </div>

      <div className="pillar-table-grid">
        {pillars.map(({ pillar, tenGods }) => (
          <PillarTable key={pillar.label} pillar={pillar} tenGods={tenGods} />
        ))}
      </div>
    </div>
  );
}