import type { SolarTermDynamicRule } from '@/lib/solarTermRuleEngine';

export const SOLAR_TERM_DYNAMIC_RULES: SolarTermDynamicRule[] = [
  {
    id: 'STD001',
    name: '前節氣回顧通用規則',
    enabled: true,
    type: 'solar_term_dynamic',
    priority: 'P3',
    phase: 'previous',
    category: 'term_transition',
    trigger: {
      phase: 'previous',
    },
    effects: {
      add_tags: ['前節氣回顧'],
      scores: {
        reflection: 1,
      },
      focusThemes: ['回顧', '整理', '承接'],
      situationTags: ['延續感', '剛走過', '仍有餘波'],
    },
    output: {
      title: '前個節氣影響',
      subtitle: '剛走過的節奏',
      summaryTemplate:
        '你剛走過的上一個節氣，重點偏向{termEnergy1}。雖然節氣已經往前推進，但上一段節奏的餘波，通常還會留在最近這段時間裡。',
      detailTemplate:
        '前一節氣不會在切換當下就完全退場。若你的命盤本身又帶有{chartTag1}、{chartTag2}，那最近這段時間，往往還會延續上一段的{focusTheme}感，像是還在整理、還在消化，或還在承接前一段留下來的節奏。',
      situationsTemplate: [
        '最近仍可能延續上一段的情緒或壓力感',
        '事情節奏未必會在節氣切換後立刻改變',
        '比起直接往前衝，這段時間更適合先整理前一段留下的東西',
      ],
      adviceTemplate:
        '這一段比較適合回頭收整，而不是急著全面切換。先把上一段真正整理完，下一段通常會更順。',
    },
  },

  {
    id: 'STD002',
    name: '前節氣 × 木日主延續感規則',
    enabled: true,
    type: 'solar_term_dynamic',
    priority: 'P2',
    phase: 'previous',
    category: 'term_day_master',
    trigger: {
      phase: 'previous',
      'chart.day_master_element': '木',
    },
    conditions: [
      {
        field: 'solarTerm.element',
        operator: 'in',
        value: ['金', '木'],
      },
    ],
    effects: {
      add_tags: ['木日主前節氣延續'],
      scores: {
        reflection: 1,
        adaptation: 1,
      },
      focusThemes: ['自我調整', '節奏轉換'],
      situationTags: ['最近較敏感', '仍在消化前一段狀態'],
    },
    output: {
      title: '前個節氣影響',
      subtitle: '剛走過的節奏',
      summaryTemplate:
        '對木性日主來說，前一節氣留下來的感受通常不會立刻退掉，所以最近這段時間，仍比較像在一邊前進、一邊調整自己。',
      detailTemplate:
        '木日主本身就比較容易感受到環境變化，而前一節氣若又帶有明顯的{termElement}氣，最近這段時間常會延續那種邊修邊走、邊感受邊調整的狀態。很多時候不是你切不開，而是上一段的節奏還沒有真正散去。',
      situationsTemplate: [
        '最近容易還在回想前一段的感受或事件',
        '做事節奏較像慢慢校正，而不是一次切到新模式',
        '內在容易維持一種邊走邊修的狀態',
      ],
      adviceTemplate:
        '這段時間不需要逼自己一下子完全切換，先讓前一段真正消化完，通常會比硬切更穩。',
    },
  },

  {
    id: 'STD003',
    name: '前節氣 × 有官殺延續壓力規則',
    enabled: true,
    type: 'solar_term_dynamic',
    priority: 'P2',
    phase: 'previous',
    category: 'term_ten_god',
    trigger: {
      phase: 'previous',
      'strength.has_officer_kill': true,
    },
    effects: {
      add_tags: ['前節氣壓力延續'],
      scores: {
        pressure: 1,
        reflection: 1,
      },
      focusThemes: ['要求感', '責任感', '回頭檢視'],
      situationTags: ['最近仍有壓力殘留', '容易回頭檢查'],
    },
    output: {
      title: '前個節氣影響',
      subtitle: '剛走過的節奏',
      summaryTemplate:
        '對你這張命盤來說，前一節氣留下的要求感與責任感，最近這段時間通常還會有延續感。',
      detailTemplate:
        '若命盤本身有官殺結構，前一節氣帶來的外界要求、責任感與標準壓力，往往不會在節氣切換後瞬間消失。所以最近這段時間，仍容易保有一種要顧好、要確認、要把事情處理到位的感覺。',
      situationsTemplate: [
        '最近容易仍然在意事情有沒有做好',
        '心裡可能還留有上一段壓力的餘波',
        '對責任、細節與進度的敏感度仍偏高',
      ],
      adviceTemplate:
        '如果你最近還覺得某種壓力沒有退掉，不一定只是自己放不下，也可能是前一段節氣的節奏仍在延續。',
    },
  },

  {
    id: 'STD004',
    name: '當前節氣 × 金氣作用木日主',
    enabled: true,
    type: 'solar_term_dynamic',
    priority: 'P1',
    phase: 'current',
    category: 'term_day_master',
    trigger: {
      phase: 'current',
      'solarTerm.element': '金',
      'chart.day_master_element': '木',
    },
    effects: {
      add_tags: ['金氣制木', '外界要求感上升'],
      scores: {
        pressure: 2,
        reflection: 1,
        execution: 1,
      },
      focusThemes: ['標準', '修整', '成果檢視'],
      situationTags: ['感受到要求', '做事更在意結果', '情緒較收斂'],
    },
    output: {
      title: '當前節氣重點',
      subtitle: '現在最有感的影響',
      summaryTemplate:
        '你目前正處於{termName}，這段時間最明顯的感受，往往會落在標準感、修整感與成果意識被放大。',
      detailTemplate:
        '{termName}帶有{termElement}氣，對木日主而言，現在這段時間通常會把做事節奏拉向修整、聚焦與結果判斷。若命盤本身又帶有{chartTag1}、{chartTag2}，你現在更容易明顯感受到被要求、被檢視，或對成果品質特別敏感。',
      situationsTemplate: [
        '現在容易更在意事情做得夠不夠好',
        '做事方式會偏向修正、聚焦與調整',
        '情緒表達可能較收，傾向先整理再外放',
      ],
      adviceTemplate:
        '這段時間最適合把重點放在方法優化、進度整理與成果檢視，不必一味求快，求準通常更有利。',
    },
  },

  {
    id: 'STD005',
    name: '當前節氣 × 木氣作用木日主',
    enabled: true,
    type: 'solar_term_dynamic',
    priority: 'P1',
    phase: 'current',
    category: 'term_day_master',
    trigger: {
      phase: 'current',
      'solarTerm.element': '木',
      'chart.day_master_element': '木',
    },
    effects: {
      add_tags: ['木氣助木', '伸展感上升'],
      scores: {
        activation: 2,
        adaptation: 1,
        expression: 1,
      },
      focusThemes: ['展開', '啟動', '恢復動能'],
      situationTags: ['比較想動', '想展開事情', '節奏打開'],
    },
    output: {
      title: '當前節氣重點',
      subtitle: '現在最有感的影響',
      summaryTemplate:
        '你目前所在的{termName}，會明顯放大木性日主的伸展感與啟動感，很多事情會比前一段更有想打開的衝動。',
      detailTemplate:
        '{termName}屬{termElement}氣，並帶有{termEnergy1}與{termEnergy2}特質。對木日主而言，現在這段時間通常比較容易感受到動能回升、事情想展開、停滯狀態想重新打開的傾向。',
      situationsTemplate: [
        '現在比較容易想做事、想推動',
        '腦中想法與行動感都會增加',
        '適合啟動、重啟或展開新的節奏',
      ],
      adviceTemplate:
        '這段時間很適合把原本卡住的事重新推動，但也要記得留意節奏，不要只顧著往前開。',
    },
  },

  {
    id: 'STD006',
    name: '當前節氣 × 火氣放大輸出',
    enabled: true,
    type: 'solar_term_dynamic',
    priority: 'P2',
    phase: 'current',
    category: 'term_ten_god',
    trigger: {
      phase: 'current',
      'solarTerm.element': '火',
      'strength.has_output': true,
    },
    effects: {
      add_tags: ['火氣助輸出', '表達欲提升'],
      scores: {
        activation: 2,
        expression: 2,
      },
      focusThemes: ['表達', '展現', '輸出'],
      situationTags: ['想說', '想做', '想表現'],
    },
    output: {
      title: '當前節氣重點',
      subtitle: '現在最有感的影響',
      summaryTemplate:
        '{termName}這段時間，會明顯把你命盤中的輸出與表達感往外推，讓你更容易想說、想做、想讓事情被看見。',
      detailTemplate:
        '火氣本身帶有外放、展現與推動感，而命盤若本身具備食傷力量，現在這段時間更容易出現表達增加、想法外放、想讓事情具體成形的傾向。',
      situationsTemplate: [
        '現在比較容易有表達衝動',
        '做事會更想看到進展與呈現',
        '適合把想法變成具體行動或作品',
      ],
      adviceTemplate:
        '這段時間很適合輸出與展現，但也要留意節奏過快時，別把細節一起甩掉。',
    },
  },

  {
    id: 'STD007',
    name: '當前節氣 × 金氣放大官殺感',
    enabled: true,
    type: 'solar_term_dynamic',
    priority: 'P2',
    phase: 'current',
    category: 'term_ten_god',
    trigger: {
      phase: 'current',
      'solarTerm.element': '金',
      'strength.has_officer_kill': true,
    },
    effects: {
      add_tags: ['金氣助官殺', '要求感加重'],
      scores: {
        pressure: 2,
        execution: 1,
      },
      focusThemes: ['責任', '要求', '秩序'],
      situationTags: ['被要求感上升', '自我要求上升'],
    },
    output: {
      title: '當前節氣重點',
      subtitle: '現在最有感的影響',
      summaryTemplate:
        '現在這個節氣，會把你命盤中的責任感、要求感與秩序意識再往上推一層。',
      detailTemplate:
        '若命盤本身已有官殺結構，金氣節氣通常會讓你對規則、責任、成果與外界標準的敏感度再提高一些。所以現在這段期間，更容易感到事情不能隨便做、需要更精準處理。',
      situationsTemplate: [
        '現在更容易在意規範、細節與責任',
        '事情不一定變多，但壓力感可能更清楚',
        '容易出現想把事情顧好的緊繃感',
      ],
      adviceTemplate:
        '現在這段時間適合把壓力轉成秩序與執行力，但也要避免因為想做好而一直對自己施壓。',
    },
  },

  {
    id: 'STD008',
    name: '當前節氣 × 水氣放大印星內化',
    enabled: true,
    type: 'solar_term_dynamic',
    priority: 'P2',
    phase: 'current',
    category: 'term_ten_god',
    trigger: {
      phase: 'current',
      'solarTerm.element': '水',
      'strength.has_print': true,
    },
    effects: {
      add_tags: ['水氣助印', '思考加深'],
      scores: {
        reflection: 2,
        stability: 1,
      },
      focusThemes: ['思考', '吸收', '內化'],
      situationTags: ['想比較多', '傾向先消化'],
    },
    output: {
      title: '當前節氣重點',
      subtitle: '現在最有感的影響',
      summaryTemplate:
        '你現在這段時間，會比較明顯進入思考、吸收與內部整理的模式。',
      detailTemplate:
        '水氣本身帶有沉澱與內收感，而命盤若本身有印星，現在這段時間通常更容易進入先觀察、先吸收、先在心裡整理的狀態。很多感受不一定會立刻講出來，但會先在內部轉一圈。',
      situationsTemplate: [
        '現在比較容易想很多或反覆思考',
        '傾向先在心裡整理，再決定怎麼做',
        '適合學習、閱讀、整理方法與觀點',
      ],
      adviceTemplate:
        '這段時間很適合深度整理與學習，但要提醒自己別一直停在想，適時把整理好的內容往前推。',
    },
  },

  {
    id: 'STD009',
    name: '當前節氣 × 財星存在',
    enabled: true,
    type: 'solar_term_dynamic',
    priority: 'P2',
    phase: 'current',
    category: 'term_ten_god',
    trigger: {
      phase: 'current',
      'strength.has_wealth': true,
    },
    effects: {
      add_tags: ['節氣放大成果意識'],
      scores: {
        practicality: 2,
        execution: 1,
      },
      focusThemes: ['成果', '效率', '落地'],
      situationTags: ['更看結果', '更重實際效益'],
    },
    output: {
      title: '當前節氣重點',
      subtitle: '現在最有感的影響',
      summaryTemplate:
        '現在這段時間，你會更自然把注意力放在成果、效率與實際落地上。',
      detailTemplate:
        '命盤中若已有財星結構，節氣一旦推動外在行動或結果感時，現在更容易讓你去思考事情有沒有做成、值不值得投入、資源該怎麼配置，而不只是停在想法本身。',
      situationsTemplate: [
        '現在會更在意投入與回報',
        '做事較容易評估是否值得繼續',
        '比起空談，更希望看到實際進度與結果',
      ],
      adviceTemplate:
        '這段時間很適合把想法往落地推進，但也要避免讓結果壓力蓋過原本的節奏與耐心。',
    },
  },

  {
    id: 'STD010',
    name: '當前節氣 × 失令盤',
    enabled: true,
    type: 'solar_term_dynamic',
    priority: 'P2',
    phase: 'current',
    category: 'term_strength',
    trigger: {
      phase: 'current',
      'strength.seasonal_status': '失令',
    },
    effects: {
      add_tags: ['節氣易牽動失令盤'],
      scores: {
        pressure: 1,
        adaptation: 1,
      },
      focusThemes: ['環境牽動', '自我調整'],
      situationTags: ['容易被節氣帶動', '體感較明顯'],
    },
    output: {
      title: '當前節氣重點',
      subtitle: '現在最有感的影響',
      summaryTemplate:
        '由於你的命盤本身偏失令，所以現在這段節氣，體感通常會比一般人更明顯一些。',
      detailTemplate:
        '失令的命盤本來就比較容易受到外部節奏牽動，因此在節氣變化明顯的時候，現在更容易感受到自己狀態像是在被推著調整、被推著修正，或對外在環境特別有感。',
      situationsTemplate: [
        '現在更容易感到節奏不完全由自己決定',
        '情緒與行動可能較受外部情況影響',
        '對節氣的轉換感通常會比較明顯',
      ],
      adviceTemplate:
        '現在這段時間的重點不在硬撐，而在看懂外在節奏後，找到自己可以穩住的位置。',
    },
  },

  {
    id: 'STD011',
    name: '當前節氣 × 失令但有根',
    enabled: true,
    type: 'solar_term_dynamic',
    priority: 'P2',
    phase: 'current',
    category: 'term_strength',
    trigger: {
      phase: 'current',
      'strength.seasonal_status': '失令',
      'strength.has_root': true,
    },
    effects: {
      add_tags: ['失令有根仍可承接'],
      scores: {
        stability: 1,
        reflection: 1,
      },
      focusThemes: ['穩住', '承接', '回穩'],
      situationTags: ['有壓但不至於失控'],
    },
    output: {
      title: '當前節氣重點',
      subtitle: '現在最有感的影響',
      summaryTemplate:
        '雖然你現在容易感受到外部節奏的牽動，但命盤裡仍有可以承接與回穩的位置。',
      detailTemplate:
        '失令會讓你比較容易感受節氣影響，但若本身仍有根氣，表示你不是完全沒有支撐。現在這段期間，比較像是在壓力中調整，而不是被完全壓垮。',
      situationsTemplate: [
        '現在雖然有壓力，但仍能慢慢把自己拉回來',
        '很多狀況更像調整過程，而不是失控',
        '只要不急著證明自己，通常能慢慢找到穩定節奏',
      ],
      adviceTemplate:
        '這段時間適合穩定承接、慢慢修正，不需要用極端方式證明自己有沒有能力。',
    },
  },

  {
    id: 'STD012',
    name: '當前節氣 × 得令盤',
    enabled: true,
    type: 'solar_term_dynamic',
    priority: 'P2',
    phase: 'current',
    category: 'term_strength',
    trigger: {
      phase: 'current',
      'strength.seasonal_status': '得令',
    },
    effects: {
      add_tags: ['得令盤節氣順勢發揮'],
      scores: {
        stability: 2,
        execution: 1,
      },
      focusThemes: ['順勢發揮', '自然展現'],
      situationTags: ['比較順手', '狀態較自然'],
    },
    output: {
      title: '當前節氣重點',
      subtitle: '現在最有感的影響',
      summaryTemplate:
        '由於你的命盤本身較得令，所以現在這段節氣，通常更容易被你順勢化用，而不只是感到壓力。',
      detailTemplate:
        '得令代表你的結構本身較容易與外在時節互相呼應，因此在節氣明顯變動時，現在通常比較容易把外部能量轉成自己的節奏與表現，而不是只被動承受。',
      situationsTemplate: [
        '現在比較容易感到事情推進得動',
        '做事狀態通常較自然、不那麼卡',
        '較容易把節氣帶來的外部動能接住',
      ],
      adviceTemplate:
        '這段時間可以更主動地推進自己想做的事，通常會比平常更容易上手。',
    },
  },

  {
    id: 'STD013',
    name: '下節氣預告通用規則',
    enabled: true,
    type: 'solar_term_dynamic',
    priority: 'P3',
    phase: 'next',
    category: 'term_transition',
    trigger: {
      phase: 'next',
    },
    effects: {
      add_tags: ['下節氣預告'],
      scores: {
        adaptation: 1,
        execution: 1,
      },
      focusThemes: ['轉向', '準備', '調整'],
      situationTags: ['即將轉段', '提早準備'],
    },
    output: {
      title: '下個節氣預告',
      subtitle: '接下來的轉向',
      summaryTemplate:
        '下一個節氣將進入{termName}，接下來的整體重心，會逐漸由現在的狀態轉向新的節奏。',
      detailTemplate:
        '當節氣從{fromTerm}轉入{termName}後，外在能量會慢慢朝向{termEnergy1}與{termEnergy2}發展。對你的命盤來說，接下來較容易開始感受到{focusTheme}相關的主題變得更明顯。',
      situationsTemplate: [
        '接下來做事重心可能會開始改變',
        '原本不明顯的主題會慢慢浮現',
        '若能提早整理與準備，切換通常會更順',
      ],
      adviceTemplate:
        '下節氣還沒正式到來前，現在就可以先做一些準備、盤點或收尾，讓下一段節奏更容易銜接。',
    },
  },

  {
    id: 'STD014',
    name: '下節氣由收斂轉升發',
    enabled: true,
    type: 'solar_term_dynamic',
    priority: 'P2',
    phase: 'next',
    category: 'term_transition',
    trigger: {
      phase: 'next',
    },
    conditions: [
      {
        field: 'solarTerm.energyPattern',
        operator: 'contains',
        value: '升發',
      },
    ],
    effects: {
      add_tags: ['下節氣轉向啟動'],
      scores: {
        activation: 1,
        adaptation: 1,
      },
      focusThemes: ['啟動', '展開', '恢復動能'],
      situationTags: ['即將打開', '節奏將轉快'],
    },
    output: {
      title: '下個節氣預告',
      subtitle: '接下來的轉向',
      summaryTemplate:
        '下一個節氣開始後，整體節奏多半會逐漸由收整轉向啟動與展開。',
      detailTemplate:
        '若下個節氣本身帶有{termEnergy1}與{termEnergy2}特徵，通常意味著接下來外部能量會比現在更偏向行動、推進與打開局面。對你的命盤來說，某些原本停著的事，也可能會慢慢開始動起來。',
      situationsTemplate: [
        '接下來較容易有重新開始的感覺',
        '事情可能會從整理期轉入推進期',
        '想法與行動感都可能逐漸增加',
      ],
      adviceTemplate:
        '現在就可以先把資源、時間與重點準備好，等節氣真正切換後，行動會更順。',
    },
  },

  {
    id: 'STD015',
    name: '下節氣由升發轉收斂',
    enabled: true,
    type: 'solar_term_dynamic',
    priority: 'P2',
    phase: 'next',
    category: 'term_transition',
    trigger: {
      phase: 'next',
    },
    conditions: [
      {
        field: 'solarTerm.energyPattern',
        operator: 'contains',
        value: '收斂',
      },
    ],
    effects: {
      add_tags: ['下節氣轉向收整'],
      scores: {
        reflection: 1,
        closure: 1,
      },
      focusThemes: ['整理', '聚焦', '收束'],
      situationTags: ['節奏會慢下來', '更重結果與修整'],
    },
    output: {
      title: '下個節氣預告',
      subtitle: '接下來的轉向',
      summaryTemplate:
        '下一個節氣開始後，整體重心多半會逐漸由外放推進，轉向整理、聚焦與收束。',
      detailTemplate:
        '當下節氣帶有{termEnergy1}與{termEnergy2}特徵時，通常意味著接下來外部能量會從展開感轉向修整感。對你的命盤來說，某些原本正在推進的事，之後也可能慢慢進入檢視、整理與重新聚焦。',
      situationsTemplate: [
        '接下來可能更在意事情做得好不好',
        '重心會從往前衝轉成收整細節',
        '對成果、秩序與取捨的敏感度會增加',
      ],
      adviceTemplate:
        '現在就可以先盤點哪些事需要收尾、聚焦或重新安排，會比等節氣完全切換後再處理更從容。',
    },
  },

  {
    id: 'STD016',
    name: '節氣五行不可單獨定論規則',
    enabled: true,
    type: 'solar_term_dynamic',
    priority: 'P4',
    phase: 'current',
    category: 'term_structure',
    trigger: {
      phase: 'current',
    },
    effects: {
      add_tags: ['節氣僅為階段加乘'],
    },
    output: {
      title: '當前節氣重點',
      subtitle: '現在最有感的影響',
      summaryTemplate:
        '節氣帶來的是階段性加乘，真正的感受仍然要和你的命盤結構一起看。',
      detailTemplate:
        '同樣的節氣，落在不同命盤上，體感不一定一樣。節氣比較像是外在環境的風向，會放大某些結構，但不會完全取代命盤原本的底子。',
      situationsTemplate: [
        '不同人對同一節氣的感受不一定相同',
        '節氣更像放大器，而不是唯一原因',
        '解讀時仍要回到命盤本身的底子來看',
      ],
      adviceTemplate:
        '看節氣時，不需要把它當成絕對預言，而是把它理解成一段時間內較容易被放大的主題。',
    },
  },

  {
    id: 'STD017',
    name: '當前節氣 × 多結構同時命中合併規則',
    enabled: true,
    type: 'solar_term_dynamic',
    priority: 'P4',
    phase: 'current',
    category: 'term_structure',
    trigger: {
      phase: 'current',
    },
    conditions: [
      {
        field: 'tags_present',
        operator: 'contains',
        value: '食傷透出',
      },
      {
        field: 'tags_present',
        operator: 'contains',
        value: '財星存在',
      },
    ],
    effects: {
      add_tags: ['多主題並行'],
      focusThemes: ['表達', '成果', '推進'],
    },
    output: {
      title: '當前節氣重點',
      subtitle: '現在最有感的影響',
      summaryTemplate:
        '現在這段時間，你的命盤不只會放大單一主題，而比較像是表達、推進與結果意識一起被拉高。',
      detailTemplate:
        '當節氣同時觸發多個命盤結構時，實際感受通常不會只落在一件事上，而是表達想做、事情想推、結果也想顧，形成多線並行的狀態。',
      situationsTemplate: [
        '現在容易同時想做很多事',
        '既想表現，也想把成果顧好',
        '節奏感可能變強，但也較容易分散',
      ],
      adviceTemplate:
        '這段時間不是不能多線推進，而是要先排出優先順序，不然很容易把自己拉得太滿。',
    },
  },

  {
    id: 'STD018',
    name: '前現下三段語氣修正规則',
    enabled: true,
    type: 'solar_term_dynamic',
    priority: 'P4',
    phase: 'current',
    category: 'term_transition',
    trigger: {
      phase: 'current',
    },
    effects: {
      add_tags: ['當下語氣優先'],
    },
    output: {
      title: '當前節氣重點',
      subtitle: '現在最有感的影響',
      summaryTemplate:
        '目前節氣的重點，不在回顧，也不在預測，而在你現在最容易有感的地方。',
      detailTemplate:
        '前節氣偏回顧，下節氣偏預告，而當前節氣最重要的，是把你現在這段時間真正有感的主題說清楚。先看當下，通常最貼近你現在的實際狀態。',
      situationsTemplate: [
        '回顧與預告都重要，但當下最值得先看',
        '現在的體感通常最直接',
        '先看當前節氣，再延伸到前後節氣會更順',
      ],
      adviceTemplate:
        '如果只想先看一塊，優先看當前節氣就好，它通常最貼近你現在的實際狀態。',
    },
  },
];