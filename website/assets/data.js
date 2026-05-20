// HTX Skill Hub — skill catalog

window.HTX_SKILLS = [
  // ===== Spot =====
  {
    slug: 'spot-market', name: 'Spot Market', nameEn: 'Spot Market', category: 'spot', icon: '📈', auth: false,
    desc: 'Query HTX spot real-time prices, candlesticks, order book depth, and 24-hour stats. Get any token\'s live market data in one sentence.',
    scenarios: ['What\'s the price of BTC right now?', 'Show me the 4-hour candles for ETH/USDT', 'What\'s the best ask price for SOL?', 'What are the top 5 gainers today?'],
    install: 'npx -y @sheerl/htx-cli skill install spot-market', pkg: '@htx-skills/spot-market',
    tags: ['Market Data', 'Candlesticks', 'Spot', 'No Auth'],
  },
  {
    slug: 'spot-account', name: 'Spot Account', nameEn: 'Spot Account', category: 'spot', icon: '👤', auth: true,
    desc: 'Query spot account balances, holdings, and asset valuations, with support for transfers between spot and futures accounts.',
    scenarios: ['How much USDT do I have left in my account?', 'What\'s my total spot asset value in USD?', 'Transfer 500 USDT to my futures account'],
    install: 'npx -y @sheerl/htx-cli skill install spot-account', pkg: '@htx-skills/spot-account',
    tags: ['Account', 'Transfer', 'Auth Required'],
  },
  {
    slug: 'spot-trading', name: 'Spot Trading', nameEn: 'Spot Trading', category: 'spot', icon: '🛒', auth: true,
    desc: 'Spot market/limit orders, cancel, modify, and order queries. All write operations require manual confirmation.',
    scenarios: ['Market buy BTC with 100 USDT', 'Place a limit order to buy 1 ETH at 3500', 'Cancel all my BTC open orders', 'Show me my fills for today'],
    install: 'npx -y @sheerl/htx-cli skill install spot-trading', pkg: '@htx-skills/spot-trading',
    tags: ['Order Placement', 'High Risk', 'Auth Required'],
  },

  // ===== Futures =====
  {
    slug: 'futures-market', name: 'Futures Market', nameEn: 'Futures Market', category: 'futures', icon: '📊', auth: false,
    desc: 'Query USDT perpetual real-time prices, candlesticks, order book depth, index price, contract metadata, and system status.',
    scenarios: ['What\'s the premium of BTC perp over spot?', 'Show me 1H candles for ETH perp', 'How much BTC is in one BTC perp contract?', 'Is the system accepting orders right now?'],
    install: 'npx -y @sheerl/htx-cli skill install futures-market', pkg: '@htx-skills/futures-market',
    tags: ['Perpetual', 'Candlesticks', 'Market Data'],
  },
  {
    slug: 'funding-rate', name: 'Funding Rate', nameEn: 'Funding Rate', category: 'futures', icon: '💸', auth: false,
    desc: 'Real-time and historical perpetual funding rates with full-market scanning to spot arbitrage opportunities and sentiment turns.',
    scenarios: ['What\'s the next funding rate for BTC?', 'How has BTC funding trended over the last 30 periods?', 'Which tokens have negative funding (longs get paid)?', 'Top 5 perps with the highest funding right now'],
    install: 'npx -y @sheerl/htx-cli skill install funding-rate', pkg: '@htx-skills/funding-rate',
    tags: ['Funding Rate', 'Perpetual', 'Arbitrage'],
  },
  {
    slug: 'oi-tracker', name: 'OI Tracker', nameEn: 'OI Tracker', category: 'futures', icon: '📡', auth: false,
    desc: 'Track perpetual Open Interest snapshots and historical time series to detect trend shifts and sudden spikes or drops.',
    scenarios: ['How much has BTC perp OI changed in the last 24 hours?', 'Which tokens have unusually surging OI?', 'Is ETH OI higher or lower than last week?'],
    install: 'npx -y @sheerl/htx-cli skill install oi-tracker', pkg: '@htx-skills/oi-tracker',
    tags: ['OI', 'Open Interest', 'Trend'],
  },
  {
    slug: 'elite-positioning', name: 'Elite Positioning', nameEn: 'Elite Positioning', category: 'futures', icon: '🎯', auth: false,
    desc: 'Top trader long/short ratio with dual measures (account count + position size) to track where smart money is positioned.',
    scenarios: ['Are top traders leaning long or short on BTC right now?', 'What\'s the smart-money long/short ratio for ETH?', 'Has the elite long share changed?'],
    install: 'npx -y @sheerl/htx-cli skill install elite-positioning', pkg: '@htx-skills/elite-positioning',
    tags: ['Long/Short Ratio', 'Smart Money', 'Sentiment'],
  },
  {
    slug: 'liquidation-stream', name: 'Liquidation Stream', nameEn: 'Liquidation Stream', category: 'futures', icon: '⚡', auth: false,
    desc: 'Monitor perpetual forced-liquidation order flow to spot short/long squeezes, dense liquidation zones, and cascading blowups.',
    scenarios: ['How much BTC was liquidated in the last hour (USD)?', 'Were a lot of shorts just force-liquidated?', 'Which token is currently seeing cascading liquidations?'],
    install: 'npx -y @sheerl/htx-cli skill install liquidation-stream', pkg: '@htx-skills/liquidation-stream',
    tags: ['Liquidation', 'Squeeze', 'Risk'],
  },
  {
    slug: 'mark-price', name: 'Mark Price / Premium / Basis', nameEn: 'Mark Price & Premium', category: 'futures', icon: '🎚️', auth: false,
    desc: 'Perpetual fair-pricing series: mark price, premium index, and basis candlesticks for liquidation reference and basis arbitrage.',
    scenarios: ['What\'s the BTC perp basis in bps right now?', 'How far is mark price from the index?', 'Premium index trend over the last 24h'],
    install: 'npx -y @sheerl/htx-cli skill install mark-price', pkg: '@htx-skills/mark-price',
    tags: ['Mark Price', 'Basis', 'Arbitrage'],
  },
  {
    slug: 'settlement', name: 'Settlement & Insurance Fund', nameEn: 'Settlement & Insurance Fund', category: 'futures', icon: '🛡️', auth: false,
    desc: 'Query estimated settlement price, historical settlement records, and insurance fund balance to monitor platform health and tail risk.',
    scenarios: ['What\'s the estimated next BTC settlement price?', 'Has the insurance fund been tapped recently?', 'Is the insurance fund big enough for an extreme move?'],
    install: 'npx -y @sheerl/htx-cli skill install settlement', pkg: '@htx-skills/settlement',
    tags: ['Settlement', 'Insurance Fund', 'Risk'],
  },
  {
    slug: 'futures-account', name: 'Futures Account', nameEn: 'Futures Account', category: 'futures', icon: '🗂️', auth: true,
    desc: 'Query futures account balance, positions, leverage tiers, and risk parameters, with support for unified-account mode switching.',
    scenarios: ['What\'s my margin ratio on the futures account?', 'What\'s the unrealized PnL on my BTC perp position?', 'What\'s the max leverage I can use?', 'Am I in isolated or cross margin?'],
    install: 'npx -y @sheerl/htx-cli skill install futures-account', pkg: '@htx-skills/futures-account',
    tags: ['Account', 'Positions', 'Leverage'],
  },
  {
    slug: 'futures-trading', name: 'Futures Trading', nameEn: 'Futures Trading', category: 'futures', icon: '⚙️', auth: true,
    desc: 'Open/close futures positions, set TP/SL, batch cancel, and trigger orders. All write operations require manual confirmation.',
    scenarios: ['Open 0.1 BTC long on the perp at 10x leverage', 'Set TP 4000 / SL 3200 on my ETH position', 'Close my entire SOL perp position', 'Place a trigger order on BTC at 60000'],
    install: 'npx -y @sheerl/htx-cli skill install futures-trading', pkg: '@htx-skills/futures-trading',
    tags: ['Futures Orders', 'TP/SL', 'High Risk'],
  },

  // ===== Analyst =====
  {
    slug: 'technical-analysis', name: 'Technical Analysis Engine', nameEn: 'Technical Analysis Engine', category: 'analyst', icon: '📐', auth: false,
    desc: 'Foundational indicator engine — pulls candles and computes 51 indicators + 12 candlestick patterns + 5 BTC cycle indicators + auto divergence detection locally, returning raw values for the AI to interpret. Zero API consumption.',
    scenarios: ['What\'s the RSI on the BTC 4H?', 'Compute MACD and Bollinger Bands for ETH', 'Scan BTC 1H for any pattern signals', 'What\'s the current AHR999 for BTC?'],
    install: 'npx -y @sheerl/htx-cli skill install technical-analysis', pkg: '@htx-skills/technical-analysis',
    tags: ['Indicator Engine', 'Local Compute', 'AI Analysis'],
  },
  {
    slug: 'ta-master', name: 'TA Master', nameEn: 'TA Master', category: 'analyst', icon: '🎓', auth: false,
    desc: 'Composite analysis app — orchestrates 6 underlying skills (indicator engine + funding + OI + liquidations + long/short ratio + basis) and outputs a 0-100 composite score with bullish/bearish call.',
    scenarios: ['Give me a composite score for BTC right now', 'Should I jump into ETH or wait?', 'Filter long opportunities with composite score > 70', 'What are BTC\'s three-pillar scores?'],
    install: 'npx -y @sheerl/htx-cli skill install ta-master', pkg: '@htx-skills/ta-master',
    tags: ['Composite Score', 'Three Pillars', 'AI Analysis'],
  },
  {
    slug: 'derivatives-analyst', name: 'Derivatives Stress Analyst', nameEn: 'Derivatives Analyst', category: 'analyst', icon: '🧪', auth: false,
    desc: 'Combines 5 derivatives signals — funding, OI, liquidations, basis, long/short ratio — into a 0-100 crowding score and squeeze-risk verdict.',
    scenarios: ['Are BTC derivatives over-crowded right now?', 'Which perp is most likely to see a squeeze?', 'What\'s ETH\'s derivatives stress score?'],
    install: 'npx -y @sheerl/htx-cli skill install derivatives-analyst', pkg: '@htx-skills/derivatives-analyst',
    tags: ['Derivatives', 'Squeeze', 'AI Analysis'],
  },
  {
    slug: 'sentiment-analyst', name: 'Market Sentiment', nameEn: 'Sentiment Analyst', category: 'analyst', icon: '🌡️', auth: false,
    desc: 'Combines the Fear & Greed Index, elite long/short ratio, and 24h breadth into a market sentiment reading with divergence signals.',
    scenarios: ['Is the market in fear or greed right now?', 'How severe is the FOMO?', 'Is there divergence between sentiment and price?'],
    install: 'npx -y @sheerl/htx-cli skill install sentiment-analyst', pkg: '@htx-skills/sentiment-analyst',
    tags: ['Sentiment', 'Fear & Greed', 'AI Analysis'],
  },
  {
    slug: 'market-overview', name: 'Market Overview', nameEn: 'Market Overview', category: 'analyst', icon: '🌐', auth: false,
    desc: 'Full-market scan: spot + futures gainers/losers, volume anomalies, and sector rotation cues — grasp the whole market in one sentence.',
    scenarios: ['How\'s the market today, give me an overview', 'Which sectors are rotating?', 'Which tokens have abnormal volume spikes?', 'What are today\'s top 5 gainers?'],
    install: 'npx -y @sheerl/htx-cli skill install market-overview', pkg: '@htx-skills/market-overview',
    tags: ['Market Overview', 'Sectors', 'AI Analysis'],
  },
];

window.HTX_CATEGORIES = [
  { id: 'all',     label: 'All',      count: () => window.HTX_SKILLS.length },
  { id: 'spot',    label: 'Spot',     count: () => window.HTX_SKILLS.filter(s => s.category === 'spot').length },
  { id: 'futures', label: 'Futures',  count: () => window.HTX_SKILLS.filter(s => s.category === 'futures').length },
  { id: 'analyst', label: 'Analysts', count: () => window.HTX_SKILLS.filter(s => s.category === 'analyst').length },
];

window.GITHUB_BASE = 'https://github.com/sheerl/htx-skills-hub/tree/main/htx-cli/skills/htx';

window.HTX_FAQS = [
  {
    q: 'What is a Skill?',
    a: 'HTX AI Skills is an open marketplace of AI trading skills. You can browse, search, and install modular skills here to extend your AI trading assistant with capabilities such as market data, trade execution, derivatives analytics, and risk monitoring. HTX and community developers continuously contribute new skills — you just pick one and install it with a single command.',
  },
  {
    q: 'Are these Skills safe?',
    a: 'Every skill goes through automated security scanning before listing — including malicious code detection, prompt injection checks, and data leak scans — and receives a security score visible on its detail page. All listed skills are digitally signed by the HTX platform, and the signature is verified at install time to ensure the skill has not been tampered with.',
  },
  {
    q: 'How do I find and install a Skill?',
    a: 'You can filter by category, search by keyword, or browse the popular ranking on this page. If you\'re using an AI assistant, it will proactively recommend relevant skills at the right moment — once you confirm, the skill installs locally with a single command.',
  },
  {
    q: 'How do I tell whether a Skill is reliable before installing?',
    a: 'Every listed skill ships with a security scan score visible on its detail page, alongside install counts and community feedback to help you gauge maturity and popularity. We recommend prioritizing skills with high security scores and large install bases.',
  },
];
