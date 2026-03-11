import type { BaziResult } from '@/types/bazi';

function getGenderLabel(gender: string) {
  if (gender === 'female') return '女';
  if (gender === 'other') return '其他';
  return '男';
}

export default function ResultSummary({ result }: { result: BaziResult }) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div className="section-head-inline" style={{ marginBottom: 16 }}>
        <h2 className="title-lg" style={{ marginBottom: 0 }}>
          命盤摘要
        </h2>
        <span className="badge">24 小時制顯示</span>
      </div>

      <div
        style={{
          display: 'grid',
          gap: 14,
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        }}
      >
        <SummaryItem label="姓名" value={result.name || '命主'} />
        <SummaryItem label="性別" value={getGenderLabel(result.gender)} />
        <SummaryItem label="出生日期" value={result.birthDate} />
        <SummaryItem label="出生時間" value={`${result.birthTime}（24 小時制）`} />
        <SummaryItem label="出生地" value={result.birthPlace} />
        <SummaryItem
          label="曆法"
          value={result.calendarType === 'lunar' ? '農曆' : '國曆'}
        />
      </div>

      {result.summary ? (
        <div style={{ marginTop: 18 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#f3ead8',
              marginBottom: 8,
            }}
          >
            初步摘要
          </div>
          <p
            className="text-muted"
            style={{
              margin: 0,
              lineHeight: 1.95,
            }}
          >
            {result.summary}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        borderRadius: 14,
        padding: 14,
        border: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.02)',
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: 'rgba(240, 232, 214, 0.58)',
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 14,
          lineHeight: 1.75,
          color: '#f5f1e8',
          fontWeight: 600,
          wordBreak: 'break-word',
        }}
      >
        {value}
      </div>
    </div>
  );
}