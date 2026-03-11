import type { CSSProperties } from 'react';
import type { BaziResult, TenGodName } from '@/types/bazi';
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

function buildTagStyle(tenGod: TenGodName): CSSProperties {
  const meta = TEN_GOD_META[tenGod];

  return {
    color: meta.color,
    background: meta.bg,
    borderColor: meta.border,
    boxShadow: `inset 0 0 0 1px ${meta.border.replace('0.32', '0.12')}`,
  };
}

function buildDualChipStyle(tenGod: TenGodName): CSSProperties {
  const meta = TEN_GOD_META[tenGod];

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
      style={buildTagStyle(text)}
    />
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

function TenGodTable({
  label,
  data,
}: {
  label: string;
  data: BaziResult['tenGods']['year'];
}) {
  return (
    <div className="pillar-table-card">
      <div className="pillar-table-head">{label}</div>

      <div className="pillar-table-body">
        <div className="pillar-table-row">
          <div className="pillar-table-label">天干十神</div>
          <div className="pillar-table-value">
            <TenGodTag text={data.stemTenGod} />
          </div>
        </div>

        <div className="pillar-table-row ten-gods-table-row-tall">
          <div className="pillar-table-label">藏干十神</div>
          <div className="pillar-table-value pillar-table-wrap ten-gods-table-wrap">
            {data.hiddenStemTenGods.length ? (
              data.hiddenStemTenGods.map((item) => (
                <HiddenStemTenGodDualChip
                  key={`${label}-${item.stem}-${item.tenGod}`}
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

export default function TenGodsCard({ result }: { result: BaziResult }) {
  const rows = [
    { label: '年柱', data: result.tenGods.year },
    { label: '月柱', data: result.tenGods.month },
    { label: '日柱', data: result.tenGods.day },
    { label: '時柱', data: result.tenGods.hour },
  ];

  return (
    <div className="card" style={{ padding: 24 }}>
      <div className="section-head-inline">
        <h2 className="title-lg" style={{ marginBottom: 0 }}>
          十神分析
        </h2>
        <span className="badge">可點擊說明</span>
      </div>

      <div className="ten-gods-table-note">
        以日主為核心，將四柱中的天干十神與藏干十神分開整理。點擊任一十神標籤，可快速查看該十神的基本意思。
      </div>

      <div className="pillar-table-grid ten-gods-table-grid">
        {rows.map((row) => (
          <TenGodTable key={row.label} label={row.label} data={row.data} />
        ))}
      </div>
    </div>
  );
}