// HTX Skill Hub — skill catalog

window.HTX_SKILLS = [
  // ===== Spot =====
  {
    slug: 'spot-market', name: '现货行情', nameEn: 'Spot Market', category: 'spot', icon: '📈', auth: false,
    desc: '查询 HTX 现货实时价格、K线、盘口深度、24 小时统计。让 AI 一句话拿到任意币种的实时行情。',
    scenarios: ['BTC 现在多少钱', '帮我看下 ETH/USDT 的 4 小时 K 线', 'SOL 的卖一价是多少', '今天涨幅榜前 5 的币是什么'],
    install: 'npx -y github:sheerl/htx-skills-hub htx-cli skill install spot-market', pkg: '@htx-skills/spot-market',
    tags: ['行情', 'K线', '现货', '免鉴权'],
  },
  {
    slug: 'spot-account', name: '现货账户', nameEn: 'Spot Account', category: 'spot', icon: '👤', auth: true,
    desc: '查询现货账户余额、持仓、资产估值，并支持现货 ↔ 合约账户之间的资金划转。',
    scenarios: ['我账户里还有多少 USDT', '我现货总资产折合美元多少', '把 500 U 划到合约账户'],
    install: 'npx -y github:sheerl/htx-skills-hub htx-cli skill install spot-account', pkg: '@htx-skills/spot-account',
    tags: ['账户', '划转', '鉴权'],
  },
  {
    slug: 'spot-trading', name: '现货交易', nameEn: 'Spot Trading', category: 'spot', icon: '🛒', auth: true,
    desc: '现货市价 / 限价下单、撤单、改单与订单查询。所有交易写操作必须人工二次确认。',
    scenarios: ['用 100 U 市价买入 BTC', '在 3500 挂单买 1 个 ETH', '撤掉我所有 BTC 挂单', '查我今天的成交记录'],
    install: 'npx -y github:sheerl/htx-skills-hub htx-cli skill install spot-trading', pkg: '@htx-skills/spot-trading',
    tags: ['下单', '高风险', '鉴权'],
  },

  // ===== Futures =====
  {
    slug: 'futures-market', name: '合约行情', nameEn: 'Futures Market', category: 'futures', icon: '📊', auth: false,
    desc: '查询 USDT 永续合约的实时价格、K线、盘口深度、索引价、合约元数据与系统状态。',
    scenarios: ['BTC 永续比现货溢价多少', '帮我看下 ETH 永续 1H K 线', 'BTC 永续合约一张多少 BTC', '系统现在能正常下单吗'],
    install: 'npx -y github:sheerl/htx-skills-hub htx-cli skill install futures-market', pkg: '@htx-skills/futures-market',
    tags: ['永续', 'K线', '行情'],
  },
  {
    slug: 'funding-rate', name: '资金费率', nameEn: 'Funding Rate', category: 'futures', icon: '💸', auth: false,
    desc: '永续合约实时资金费率与历史走势，支持全市场扫描，捕捉套利机会与情绪拐点。',
    scenarios: ['BTC 下次结算费率多少', '过去 30 期 BTC 费率走势如何', '现在哪些币费率为负，做多反而拿钱', '全市场费率最高的 5 个永续'],
    install: 'npx -y github:sheerl/htx-skills-hub htx-cli skill install funding-rate', pkg: '@htx-skills/funding-rate',
    tags: ['资金费率', '永续', '套利'],
  },
  {
    slug: 'oi-tracker', name: '持仓量追踪', nameEn: 'OI Tracker', category: 'futures', icon: '📡', auth: false,
    desc: '追踪永续合约 Open Interest 当前快照与历史时序，识别趋势变化与急升急降事件。',
    scenarios: ['BTC 永续 OI 最近 24 小时变化多少', '哪些币种持仓量异常飙升', 'ETH 持仓量比上周多还是少'],
    install: 'npx -y github:sheerl/htx-skills-hub htx-cli skill install oi-tracker', pkg: '@htx-skills/oi-tracker',
    tags: ['OI', '持仓量', '趋势'],
  },
  {
    slug: 'elite-positioning', name: '精英多空比', nameEn: 'Elite Positioning', category: 'futures', icon: '🎯', auth: false,
    desc: '顶级交易者多空比双口径数据（账户数 + 持仓量），识别「聪明钱」资金方向。',
    scenarios: ['顶级交易者 BTC 现在偏多还是偏空', '聪明钱 ETH 多空比是多少', '精英持仓的多头占比有变化吗'],
    install: 'npx -y github:sheerl/htx-skills-hub htx-cli skill install elite-positioning', pkg: '@htx-skills/elite-positioning',
    tags: ['多空比', '聪明钱', '情绪'],
  },
  {
    slug: 'liquidation-stream', name: '清算流', nameEn: 'Liquidation Stream', category: 'futures', icon: '⚡', auth: false,
    desc: '永续合约强制平仓订单流监控，识别多空挤仓、清算密集区与级联爆仓事件。',
    scenarios: ['BTC 过去 1 小时爆仓多少 USD', '是不是有大批空头被强平', '哪个币种正在出现级联清算'],
    install: 'npx -y github:sheerl/htx-skills-hub htx-cli skill install liquidation-stream', pkg: '@htx-skills/liquidation-stream',
    tags: ['清算', '挤仓', '风险'],
  },
  {
    slug: 'mark-price', name: '标记价 / 溢价 / 基差', nameEn: 'Mark Price & Premium', category: 'futures', icon: '🎚️', auth: false,
    desc: '永续合约公允定价系列：标记价、溢价指数、基差 K线，用于清算参考与基差套利。',
    scenarios: ['BTC 永续基差现在多少 bp', '当前标记价和指数价偏离多少', '溢价指数 24h 变化趋势'],
    install: 'npx -y github:sheerl/htx-skills-hub htx-cli skill install mark-price', pkg: '@htx-skills/mark-price',
    tags: ['标记价', '基差', '套利'],
  },
  {
    slug: 'settlement', name: '结算与保险基金', nameEn: 'Settlement & Insurance Fund', category: 'futures', icon: '🛡️', auth: false,
    desc: '查询预估结算价、历史结算记录与保险基金余额，监控平台稳健性与极端行情风险。',
    scenarios: ['下一次 BTC 结算价预估多少', '保险基金最近被动用过吗', '保险基金余额够不够覆盖极端行情'],
    install: 'npx -y github:sheerl/htx-skills-hub htx-cli skill install settlement', pkg: '@htx-skills/settlement',
    tags: ['结算', '保险基金', '风险'],
  },
  {
    slug: 'futures-account', name: '合约账户', nameEn: 'Futures Account', category: 'futures', icon: '🗂️', auth: true,
    desc: '查询合约账户余额、持仓、杠杆档位与风险参数，支持统一账户类型切换。',
    scenarios: ['我合约账户保证金率多少', '我 BTC 永续仓位浮盈浮亏多少', '我能开的最大杠杆是多少', '我现在是逐仓还是全仓'],
    install: 'npx -y github:sheerl/htx-skills-hub htx-cli skill install futures-account', pkg: '@htx-skills/futures-account',
    tags: ['账户', '持仓', '杠杆'],
  },
  {
    slug: 'futures-trading', name: '合约交易', nameEn: 'Futures Trading', category: 'futures', icon: '⚙️', auth: true,
    desc: '合约开仓 / 平仓、止盈止损、批量撤单、计划委托。所有写操作必须人工二次确认。',
    scenarios: ['BTC 永续 10 倍杠杆开多 0.1 个', '我 ETH 仓位挂止盈 4000 / 止损 3200', '把 SOL 永续仓位全平了', 'BTC 在 60000 挂个计划委托'],
    install: 'npx -y github:sheerl/htx-skills-hub htx-cli skill install futures-trading', pkg: '@htx-skills/futures-trading',
    tags: ['合约下单', '止盈止损', '高风险'],
  },

  // ===== Analyst =====
  {
    slug: 'technical-analysis', name: '技术指标引擎', nameEn: 'Technical Analysis Engine', category: 'analyst', icon: '📐', auth: false,
    desc: '底层指标计算引擎 — 拉 K线本地算 51 指标 + 12 K线形态 + 5 BTC 周期指标 + 自动背离检测，输出原始数值供 AI 自由解读。零 API 消耗。',
    scenarios: ['BTC 4H 的 RSI 是多少', '帮我算下 ETH 的 MACD 和布林带', '扫一下 BTC 1H 有没有形态信号', 'BTC 当前 AHR999 是多少'],
    install: 'npx -y github:sheerl/htx-skills-hub htx-cli skill install technical-analysis', pkg: '@htx-skills/technical-analysis',
    tags: ['指标引擎', '本地计算', 'AI 分析'],
  },
  {
    slug: 'ta-master', name: '技术分析大师', nameEn: 'TA Master', category: 'analyst', icon: '🎓', auth: false,
    desc: '综合分析应用 — 编排 6 个底层 skill（指标引擎 + 资金费率 + OI + 清算 + 多空比 + 基差），直接输出 0-100 综合评分与看多/看空判断。',
    scenarios: ['给我 BTC 现在的综合评分', 'ETH 是该上车还是观望', '帮我筛出综合评分 > 70 的多头机会', 'BTC 三支柱评分各是多少'],
    install: 'npx -y github:sheerl/htx-skills-hub htx-cli skill install ta-master', pkg: '@htx-skills/ta-master',
    tags: ['综合评分', '三支柱', 'AI 分析'],
  },
  {
    slug: 'derivatives-analyst', name: '衍生品压力分析', nameEn: 'Derivatives Analyst', category: 'analyst', icon: '🧪', auth: false,
    desc: '综合资金费率、OI、清算、基差、多空比 5 维信号，输出 0-100 拥挤度评分与挤仓风险判定。',
    scenarios: ['BTC 衍生品现在是不是过度拥挤', '哪个永续最容易出现挤仓', 'ETH 衍生品压力评分多少'],
    install: 'npx -y github:sheerl/htx-skills-hub htx-cli skill install derivatives-analyst', pkg: '@htx-skills/derivatives-analyst',
    tags: ['衍生品', '挤仓', 'AI 分析'],
  },
  {
    slug: 'sentiment-analyst', name: '市场情绪', nameEn: 'Sentiment Analyst', category: 'analyst', icon: '🌡️', auth: false,
    desc: '结合恐惧贪婪指数、精英多空比、24h 涨跌广度，给出市场情绪读数与背离信号。',
    scenarios: ['现在是恐惧还是贪婪', 'FOMO 程度有多严重', '情绪和价格之间出现背离了吗'],
    install: 'npx -y github:sheerl/htx-skills-hub htx-cli skill install sentiment-analyst', pkg: '@htx-skills/sentiment-analyst',
    tags: ['情绪', '恐惧贪婪', 'AI 分析'],
  },
  {
    slug: 'market-overview', name: '市场总览', nameEn: 'Market Overview', category: 'analyst', icon: '🌐', auth: false,
    desc: '全市场扫描：现货 + 合约涨跌榜、成交量异动、板块轮动提示，一句话掌握市场全貌。',
    scenarios: ['今天行情怎么样，给我个总览', '哪些板块在轮动', '哪些币成交量异常放大', '今天涨幅最大的 5 个币是什么'],
    install: 'npx -y github:sheerl/htx-skills-hub htx-cli skill install market-overview', pkg: '@htx-skills/market-overview',
    tags: ['行情总览', '板块', 'AI 分析'],
  },
];

window.HTX_CATEGORIES = [
  { id: 'all',     label: '全部',   count: () => window.HTX_SKILLS.length },
  { id: 'spot',    label: '现货',   count: () => window.HTX_SKILLS.filter(s => s.category === 'spot').length },
  { id: 'futures', label: '合约',   count: () => window.HTX_SKILLS.filter(s => s.category === 'futures').length },
  { id: 'analyst', label: '分析',   count: () => window.HTX_SKILLS.filter(s => s.category === 'analyst').length },
];

window.GITHUB_BASE = 'https://github.com/sheerl/htx-skills-hub/tree/main/htx-cli/skills/htx';

window.HTX_FAQS = [
  {
    q: '什么是 Skill？',
    a: 'HTX AI Skills 是一个开放的 AI 交易 Skill 市场。您可以在这里浏览、搜索和安装各类模块化 Skill，扩展 AI 交易助手的能力，覆盖行情查询、交易执行、衍生品分析、风险监控等场景。HTX 与社区开发者会持续贡献 Skill，您只需挑选并一行命令安装即可。',
  },
  {
    q: '这些 Skill 安全吗？',
    a: '每个 Skill 在上架前都会经过自动化安全扫描，包括恶意代码检测、Prompt 注入检查与数据泄露扫描，扫描完成后会获得安全评分，可在详情页查看。所有上架的 Skill 均通过 HTX 平台数字签名，安装时系统会自动校验签名，确保 Skill 内容未被篡改。',
  },
  {
    q: '如何查找并安装 Skill？',
    a: '您可以在本页按分类筛选、搜索关键词或浏览热门排行找到合适的 Skill。如果您正在使用 AI 助手，助手会在合适的时机主动推荐相关 Skill，您确认后即可一行命令安装到本地。',
  },
  {
    q: '安装前如何判断 Skill 是否可靠？',
    a: '每个上架的 Skill 都附带安全扫描评分，可在详情页查看。详情页同时会展示安装量与社区评价，帮助您快速判断 Skill 的成熟度与受欢迎程度。建议优先选择安全评分高、安装量大的 Skill。',
  },
];
