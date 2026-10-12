// Interpretive editorial vocabulary, not empirically validated predictions.
export const starMeanings: Record<string, { theme: string; limit: string; observe: string }> = {
  紫微: {
    theme: '整合資源、承擔主導角色',
    limit: '可能過度在意控制與認可',
    observe: '能否分工並聽取反饋',
  },
  天機: {
    theme: '分析、規劃與調整策略',
    limit: '想法多可能延遲決定',
    observe: '把方案轉成可執行的下一步',
  },
  太陽: {
    theme: '公開表達、照顧他人',
    limit: '付出太多可能忽略界線',
    observe: '投入和休息是否平衡',
  },
  武曲: {
    theme: '資源紀律、務實執行',
    limit: '效率優先可能壓縮情感交流',
    observe: '決策除了數字是否考量人的需求',
  },
  天同: {
    theme: '協調、舒適與支持關係',
    limit: '追求安穩可能迴避衝突',
    observe: '能否直接表達自己的需要',
  },
  廉貞: {
    theme: '規範、辨識界線與關係張力',
    limit: '立場鮮明可能造成僵持',
    observe: '遇分歧時是否容許協商',
  },
  天府: {
    theme: '保存資源、穩定安排',
    limit: '穩健可能變成保守',
    observe: '何時需要重新分配存量資源',
  },
  太陰: {
    theme: '細緻觀察、照料與累積',
    limit: '顧慮多可能不易表達',
    observe: '把感受說明而非等待被理解',
  },
  貪狼: {
    theme: '探索、人際連結與多元興趣',
    limit: '選項多可能分散投入',
    observe: '為探索設定優先順序與預算',
  },
  巨門: {
    theme: '提問、論證與辨明問題',
    limit: '質疑過密可能使溝通緊張',
    observe: '在反駁之前確認對方原意',
  },
  天相: {
    theme: '協調、公平與制度支持',
    limit: '顧全關係可能壓低自身主張',
    observe: '合作時的權責是否清楚',
  },
  天梁: {
    theme: '經驗傳承、保護與原則',
    limit: '建議太多可能像在指導別人',
    observe: '先問對方需要哪一種協助',
  },
  七殺: {
    theme: '決斷、突破與處理壓力',
    limit: '快速切換可能增加不確定性',
    observe: '重大調整是否保留退路',
  },
  破軍: {
    theme: '重整、試驗與淘汰舊模式',
    limit: '改動頻繁可能消耗累積成果',
    observe: '用小規模試驗取代一次全改',
  },
  左輔: {
    theme: '合作支援與補位',
    limit: '倚賴協助可能模糊責任',
    observe: '分工後是否仍有人負責收尾',
  },
  右弼: {
    theme: '人際協調與補充觀點',
    limit: '人情考量可能使取捨困難',
    observe: '把彼此期待講清楚',
  },
  文昌: {
    theme: '條理、寫作與文件表達',
    limit: '形式完整不等於內容正確',
    observe: '檢查證據與文字是否一致',
  },
  文曲: {
    theme: '感受、審美與敘事表達',
    limit: '感染力可能掩蓋具體需求',
    observe: '把感受轉成可討論的事項',
  },
  天魁: {
    theme: '正式資源與前輩協助',
    limit: '等待支持可能延後自主行動',
    observe: '準備好具體的協助請求',
  },
  天鉞: {
    theme: '機會引介與支持網絡',
    limit: '機會仍需要能力與行動承接',
    observe: '機會到來前累積哪些準備',
  },
  祿存: {
    theme: '保存與資源管理',
    limit: '害怕損失可能限制流動',
    observe: '安全儲備與可投入資源的比例',
  },
  天馬: {
    theme: '移動、轉換與跨域連結',
    limit: '奔波可能降低持續性',
    observe: '移動是否有明確目的',
  },
  擎羊: { theme: '直接處理阻力', limit: '表達尖銳可能增加摩擦', observe: '分清問題和對人的評價' },
  陀羅: {
    theme: '持續磨合與耐力',
    limit: '拖延或反覆可能耗損',
    observe: '為卡住的議題設定檢查時間',
  },
  火星: { theme: '快速反應與行動張力', limit: '急切可能忽略驗證', observe: '行動前加一道核對' },
  鈴星: {
    theme: '警覺與潛在壓力',
    limit: '持續緊繃可能難以休息',
    observe: '辨識實際風險與預期焦慮',
  },
  地空: { theme: '抽離既有框架', limit: '想法與現實資源可能有落差', observe: '先驗證最小可行步驟' },
  地劫: {
    theme: '重新評估資源風險',
    limit: '投入需要考量承受損失的能力',
    observe: '避免不可逆的集中投入',
  },
};
export const palaceMeanings: Record<string, string> = {
  命宮: '自我定位、回應環境的方式',
  兄弟: '同輩互動、互助與界線',
  夫妻: '親密關係中的期待與協商',
  子女: '照顧、教養與作品投入',
  財帛: '資源取得、支出與價值取捨',
  疾厄: '日常照料與壓力觀察，不能診斷疾病',
  遷移: '外部環境與移動經驗',
  交友: '合作網絡與相處界線',
  僕役: '合作網絡與相處界線',
  官祿: '責任承擔與工作方式，不等於職業推薦',
  田宅: '居住、安全感與生活安排',
  福德: '內在滿足與休息方式',
  父母: '長輩、支持與制度互動',
};
export const mutagenMeanings: Record<string, string> = {
  祿: '資源與投入較容易聚焦的象徵；仍需行動與條件，不保證財富。',
  權: '主動、責任及影響力的象徵；留意是否過度控制。',
  科: '可見度、條理與名聲的象徵；形式認可不代表實質能力。',
  忌: '牽掛、反覆與需修正之處的象徵；不表示必然災禍。',
};
const pairExamples: Record<string, string> = {
  '紫微|左輔':
    '統籌時若有人分擔執行，可把決策權、交付內容與回報節點分開列明，避免所有事都回到自己。',
  '天機|文昌': '把多個方案寫成比較表與檢核步驟，可能減少反覆思考；同時設定停止蒐集資料的條件。',
  '武曲|文曲': '資源規劃可以搭配較易理解的敘事，但需要把表達魅力與財務假設分開核對。',
  '貪狼|火星': '新想法容易迅速付諸行動，可先設定試驗預算與退出條件，避免一時興奮帶來持續負擔。',
  '太陰|鈴星': '細膩觀察可能伴隨不說出口的緊張，先區分已確認的問題與猜測，再表達需要的支持。',
  '七殺|擎羊': '面對阻力可能傾向快速切入，適合先界定問題與代價；涉及他人時先確認權責與同意。',
  '破軍|地劫': '重整過程可能反覆調整投入，先保留必要資源並分阶段驗證，避免每次推翻都重頭累積。',
};
export function pairMeaning(palace: string, major: string, minor: string) {
  const main = starMeanings[major],
    auxiliary = starMeanings[minor];
  if (!main || !auxiliary)
    return `${major} × ${minor}：此組合暫未編寫核實的解讀，不套用其他星曜文字。`;
  const domain = palaceMeanings[palace] || '此宮生活主題';
  return `${major} × ${minor}（${palace}）：${pairExamples[`${major}|${minor}`] || `在「${domain}」中，${main.theme}可能透過${auxiliary.theme}表現；可具體觀察${main.observe}與${auxiliary.observe}是否能相互支持。`}限制：${main.limit}，加上${auxiliary.limit}時需分別處理；不把兩星效果當作直接相加。`;
}
export function combinationMeaning(palace: string, major: string[], minor: string[]) {
  const topic = palaceMeanings[palace] || '此宮所代表的生活議題';
  const stars = major
    .map((name) => ({ name, meaning: starMeanings[name] }))
    .filter((s) => s.meaning);
  return [
    `${palace}觀察主題：${topic}。`,
    ...(stars.length
      ? stars.map(
          (s) =>
            `${s.name}在此宮可用來觀察${s.meaning.theme}；限制是${s.meaning.limit}，可留意${s.meaning.observe}。`
        )
      : ['此宮無主星：不能當作沒有作用，需另外參看對宮與三方四正，本段不以借星假冒本宮主星。']),
    ...major.flatMap((star) => minor.map((auxiliary) => pairMeaning(palace, star, auxiliary))),
    ...(minor.length && !major.length
      ? minor.map((name) => {
          const m = starMeanings[name];
          return m
            ? `${name}在空宮可先觀察${m.theme}；留意${m.limit}，並回頭核對對宮。`
            : `${name}暫無解讀。`;
        })
      : []),
    '以上為文化解讀假設，尚未整合全部三方四正、煞忌及流年，請用實際生活經驗驗證，不作保證式預言。',
  ];
}
