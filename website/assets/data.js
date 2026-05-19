// HTX Skill Hub — skill catalog

window.HTX_SKILLS = [
  // ===== Spot =====
  {
    slug: 'spot-market', name: '现货行情', nameEn: 'Spot Market', category: 'spot', icon: '📈', auth: false,
    desc: '查询 HTX 现货实时价格、K线、盘口深度、24 小时统计。让 AI 一句话拿到任意币种的实时行情。',
    scenarios: ['BTC 现在什么价格？', 'ETH/USDT 4H K线走势', 'SOL 盘口深度怎么样？', '24 小时涨幅最大的币种'],
    install: 'npx -y @htx-skills/spot-market install', pkg: '@htx-skills/spot-market',
    tags: ['行情', 'K线', '现货', '免鉴权'],
  },
  {
    slug: 'spot-account', name: '现货账户', nameEn: 'Spot Account', category: 'spot', icon: '👤', auth: true,
    desc: '查询现货账户余额、持仓、资产估值，并支持现货 ↔ 合约账户之间的资金划转。',
    scenarios: ['我账户里有多少 USDT？', '帮我查总资产估值', '把 1000 USDT 转到合约账户'],
    install: 'npx -y @htx-skills/spot-account install', pkg: '@htx-skills/spot-account',
    tags: ['账户', '划转', '鉴权'],
  },
  {
    slug: 'spot-trading', name: '现货交易', nameEn: 'Spot Trading', category: 'spot', icon: '🛒', auth: true,
    desc: '现货市价 / 限价下单、撤单、改单与订单查询。所有交易写操作必须人工二次确认。',
    scenarios: ['市价买入 0.1 BTC', 'ETH 3500 USDT 挂限价买单', '撤掉所有 BTC/USDT 挂单'],
    install: 'npx -y @htx-skills/spot-trading install', pkg: '@htx-skills/spot-trading',
    tags: ['下单', '高风险', '鉴权'],
  },

  // ===== Futures =====
  {
    slug: 'futures-market', name: '合约行情', nameEn: 'Futures Market', category: 'futures', icon: '📊', auth: false,
    desc: '查询 USDT 永续合约的实时价格、K线、盘口深度、索引价、合约元数据与系统状态。',
    scenarios: ['BTC 永续现在多少？', 'ETH 永续 1h K线', 'SOL 永续盘口深度'],
    install: 'npx -y @htx-skills/futures-market install', pkg: '@htx-skills/futures-market',
    tags: ['永续', 'K线', '行情'],
  },
  {
    slug: 'funding-rate', name: '资金费率', nameEn: 'Funding Rate', category: 'futures', icon: '💸', auth: false,
    desc: '永续合约实时资金费率与历史走势，支持全市场扫描，捕捉套利机会与情绪拐点。',
    scenarios: ['BTC 永续当前资金费率多少', '近 7 天 ETH 永续资金费率走势', '哪些币种资金费率为负'],
    install: 'npx -y @htx-skills/funding-rate install', pkg: '@htx-skills/funding-rate',
    tags: ['资金费率', '永续', '套利'],
  },
  {
    slug: 'oi-tracker', name: '持仓量追踪', nameEn: 'OI Tracker', category: 'futures', icon: '📡', auth: false,
    desc: '追踪永续合约 Open Interest 当前快照与历史时序，识别趋势变化与急升急降事件。',
    scenarios: ['BTC 永续 OI 最近 24h 变化', '哪些币种 OI 异常飙升', 'ETH 永续持仓量比上周怎么样'],
    install: 'npx -y @htx-skills/oi-tracker install', pkg: '@htx-skills/oi-tracker',
    tags: ['OI', '持仓量', '趋势'],
  },
  {
    slug: 'elite-positioning', name: '精英多空比', nameEn: 'Elite Positioning', category: 'futures', icon: '🎯', auth: false,
    desc: '顶级交易者多空比双口径数据（账户数 + 持仓量），识别「聪明钱」资金方向。',
    scenarios: ['顶级交易者现在 BTC 多空比', '精英多空比和散户分歧吗', 'ETH 永续聪明钱什么方向'],
    install: 'npx -y @htx-skills/elite-positioning install', pkg: '@htx-skills/elite-positioning',
    tags: ['多空比', '聪明钱', '情绪'],
  },
  {
    slug: 'liquidation-stream', name: '清算流', nameEn: 'Liquidation Stream', category: 'futures', icon: '⚡', auth: false,
    desc: '永续合约强制平仓订单流监控，识别多空挤仓、清算密集区与级联爆仓事件。',
    scenarios: ['BTC 永续过去 1h 清算了多少', '是不是有大规模空头被爆仓', '哪些币种正在级联清算'],
    install: 'npx -y @htx-skills/liquidation-stream install', pkg: '@htx-skills/liquidation-stream',
    tags: ['清算', '挤仓', '风险'],
  },
  {
    slug: 'mark-price', name: '标记价 / 溢价 / 基差', nameEn: 'Mark Price & Premium', category: 'futures', icon: '🎚️', auth: false,
    desc: '永续合约公允定价系列：标记价、溢价指数、基差 K线，用于清算参考与基差套利。',
    scenarios: ['BTC 永续基差现在多少', 'ETH 标记价和最新价差多少', '溢价指数最近怎么变'],
    install: 'npx -y @htx-skills/mark-price install', pkg: '@htx-skills/mark-price',
    tags: ['标记价', '基差', '套利'],
  },
  {
    slug: 'settlement', name: '结算与保险基金', nameEn: 'Settlement & Insurance Fund', category: 'futures', icon: '🛡️', auth: false,
    desc: '查询预估结算价、历史结算记录与保险基金余额，监控平台稳健性与极端行情风险。',
    scenarios: ['下一次结算价预估多少', '保险基金最近有动用吗', 'BTC 永续历史结算价'],
    install: 'npx -y @htx-skills/settlement install', pkg: '@htx-skills/settlement',
    tags: ['结算', '保险基金', '风险'],
  },
  {
    slug: 'futures-account', name: '合约账户', nameEn: 'Futures Account', category: 'futures', icon: '🗂️', auth: true,
    desc: '查询合约账户余额、持仓、杠杆档位与风险参数，支持统一账户类型切换。',
    scenarios: ['我合约账户里有多少 USDT？', '我的 BTC 永续仓位多少', '当前杠杆档位限制是多少'],
    install: 'npx -y @htx-skills/futures-account install', pkg: '@htx-skills/futures-account',
    tags: ['账户', '持仓', '杠杆'],
  },
  {
    slug: 'futures-trading', name: '合约交易', nameEn: 'Futures Trading', category: 'futures', icon: '⚙️', auth: true,
    desc: '合约开仓 / 平仓、止盈止损、批量撤单、计划委托。所有写操作必须人工二次确认。',
    scenarios: ['BTC 永续 10 倍杠杆开多 0.1 个', 'ETH 永续止盈 4000 / 止损 3200', '平掉所有 SOL 永续持仓'],
    install: 'npx -y @htx-skills/futures-trading install', pkg: '@htx-skills/futures-trading',
    tags: ['合约下单', '止盈止损', '高风险'],
  },

  // ===== Analyst =====
  {
    slug: 'technical-analysis', name: '技术指标分析', nameEn: 'Technical Analysis', category: 'analyst', icon: '📐', auth: false,
    desc: '51 技术指标 + 12 K线形态 + 5 BTC 周期指标 + 自动背离检测，全部本地 Python 计算，零 API 消耗。',
    scenarios: ['BTC 4H 技术面怎么看', 'ETH 是否超买', '扫描所有 K线形态', 'BTC 当前 AHR999 处在什么区间'],
    install: 'npx -y @htx-skills/technical-analysis install', pkg: '@htx-skills/technical-analysis',
    tags: ['技术分析', '指标', 'AI 分析'],
  },
  {
    slug: 'ta-master', name: '技术分析大师', nameEn: 'TA Master', category: 'analyst', icon: '🎓', auth: false,
    desc: '三支柱加权评分（价量 50% + 衍生品 30% + BTC 周期 20%），输出 0-100 综合评分 + 详细解读。',
    scenarios: ['BTC 综合评分多少', '现在 ETH 综合面看怎么样', '帮我扫一下市场上 ta-master 评分 >70 的币'],
    install: 'npx -y @htx-skills/ta-master install', pkg: '@htx-skills/ta-master',
    tags: ['综合评分', '三支柱', 'AI 分析'],
  },
  {
    slug: 'derivatives-analyst', name: '衍生品压力分析', nameEn: 'Derivatives Analyst', category: 'analyst', icon: '🧪', auth: false,
    desc: '综合资金费率、OI、清算、基差、多空比 5 维信号，输出 0-100 拥挤度评分与挤仓风险判定。',
    scenarios: ['BTC 永续现在拥挤吗', '是不是要发生挤仓', '衍生品市场整体压力如何'],
    install: 'npx -y @htx-skills/derivatives-analyst install', pkg: '@htx-skills/derivatives-analyst',
    tags: ['衍生品', '挤仓', 'AI 分析'],
  },
  {
    slug: 'sentiment-analyst', name: '市场情绪', nameEn: 'Sentiment Analyst', category: 'analyst', icon: '🌡️', auth: false,
    desc: '结合恐惧贪婪指数、精英多空比、24h 涨跌广度，给出市场情绪读数与背离信号。',
    scenarios: ['现在市场是贪婪还是恐惧', 'FOMO 情绪有多严重', '情绪和价格有背离吗'],
    install: 'npx -y @htx-skills/sentiment-analyst install', pkg: '@htx-skills/sentiment-analyst',
    tags: ['情绪', '恐惧贪婪', 'AI 分析'],
  },
  {
    slug: 'market-overview', name: '市场总览', nameEn: 'Market Overview', category: 'analyst', icon: '🌐', auth: false,
    desc: '全市场扫描：现货 + 合约涨跌榜、成交量异动、板块轮动提示，一句话掌握市场全貌。',
    scenarios: ['今天涨得最多的是哪些币', '哪些币种成交量异常放大', '当前板块轮动方向'],
    install: 'npx -y @htx-skills/market-overview install', pkg: '@htx-skills/market-overview',
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
