export default function FeatureSection() {
  const items = [
    {
      title: '四柱命盤展示',
      desc: '先建立年月日時四柱顯示卡片與命盤摘要區，後續直接替換為正式計算結果。',
    },
    {
      title: '五行強弱分析',
      desc: '先以 mock data 呈現木火土金水比例，未來可接十神、喜忌與用神判讀。',
    },
    {
      title: '節氣資訊整合',
      desc: '排盤不只看日期，也保留節氣切換的分析可能，方便未來補入節氣演算邏輯。',
    },
  ];

  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
          {items.map((item) => (
            <div key={item.title} className="card" style={{ padding: 24 }}>
              <h3 className="title-md">{item.title}</h3>
              <p className="text-muted" style={{ lineHeight: 1.8 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}