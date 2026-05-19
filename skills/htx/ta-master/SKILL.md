---
name: htx/ta-master
version: 1.0.0
description: HTX 技术分析大师 — 三支柱加权评分（价量 50% + 衍生品 30% + BTC 周期 20%）→ 0-100 综合评分 + 详细解读
auth: false
risk: low
---

# Technical Analysis Master — 技术分析大师

Layer 2 编排型 skill，**无需 API Key**。综合 6 个 L1 skill 输出三支柱评分，给出 0-100 综合判断。

> **合规声明**：评分为机械算法输出，**不构成投资建议**。市场有风险，决策由用户自行做出。

## 三支柱评分体系

| 支柱 | 权重 | 数据源 | 输出 |
|---|---|---|---|
| 价量因子 | **50%** | `htx/technical-analysis`（51 指标 + 12 形态 + 背离） | 0-100 子分 |
| 衍生品 | **30%** | `funding-rate` / `oi-tracker` / `liquidation-stream` / `elite-positioning` / `mark-price` | 0-100 子分 |
| BTC 周期 | **20%** | `htx/technical-analysis cycle.py`（仅 BTC-USDT 适用） | 0-100 子分 |

非 BTC 时自动重新分配权重为 价量 62.5% + 衍生品 37.5%。

## 综合评分解读

| 综合评分 | 标签 |
|---|---|
| ≥ 70 | **STRONG BULLISH** |
| 55-70 | MILD BULLISH |
| 45-55 | NEUTRAL |
| 30-45 | MILD BEARISH |
| < 30 | **STRONG BEARISH** |

## 工作流

### 完整版（BTC，三支柱）

```bash
# 1. 拉日 K（周期支柱需 350+ 日 K）
htx-cli spot-market kline -p symbol=btcusdt -p period=1day -p size=400 | jq '.data' > /tmp/btc1d.json
htx-cli spot-market kline -p symbol=btcusdt -p period=4hour -p size=300 | jq '.data' > /tmp/btc4h.json

# 2. 计算价量特征 → pv.json
python -c "
import json
import indicators, patterns
df = indicators._df(json.load(open('/tmp/btc4h.json')))
out = {
    'rsi': indicators.rsi(df)['rsi'].iloc[-1],
    'macd_hist': indicators.macd(df)['macd'].iloc[-1],
    'ema_fast': indicators.ema(df, periods=(20,))['ema20'].iloc[-1],
    'ema_slow': indicators.ema(df, periods=(60,))['ema60'].iloc[-1],
    'adx': indicators.adx(df)['adx'].iloc[-1],
    'divergence': str(indicators.divergence(df)['divergence'].iloc[-1]),
    'patterns_bullish_count': sum(1 for p in patterns.scan(df) if p.startswith('bull') or p in ('three-soldiers','inverted-hammer')),
    'patterns_bearish_count': sum(1 for p in patterns.scan(df) if p.startswith('bear') or p in ('three-crows','shooting-star','hanging-man')),
}
json.dump(out, open('/tmp/pv.json', 'w'))
"

# 3. 拉衍生品 → deriv.json
htx-cli funding-rate current -p contract_code=BTC-USDT --json > /tmp/fr.json
htx-cli oi-tracker history -p contract_code=BTC-USDT -p period=60min -p size=24 --json > /tmp/oi.json
htx-cli liquidation-stream recent -p contract=BTC-USDT --json > /tmp/liq.json
htx-cli elite-positioning ratio -p contract_code=BTC-USDT --json > /tmp/elite.json
htx-cli mark-price basis -p contract_code=BTC-USDT --json > /tmp/basis.json
# 然后聚合成 deriv.json（参考 references/derivatives-features.md）

# 4. 计算周期支柱 → cycle.json (BTC only)
python scripts/cycle.py all --kline /tmp/btc1d.json > /tmp/cycle_raw.json
# 提取关键字段成 cycle.json: ahr999 / mayer / pi_cycle_signal / rainbow_band

# 5. 三支柱合并评分
python scripts/scoring.py --pricevol /tmp/pv.json --derivatives /tmp/deriv.json --cycle /tmp/cycle.json
```

### 简版（非 BTC，两支柱）

```bash
python scripts/scoring.py --pricevol pv.json --derivatives deriv.json
```

输出示例（BTC 完整三支柱）：

```json
{
  "composite": {
    "composite": 62.4,
    "label": "MILD BULLISH",
    "weights": {"pv": 0.5, "deriv": 0.3, "cycle": 0.2}
  },
  "pillars": {
    "price_volume": {
      "score": 65.0,
      "notes": ["RSI 58.3 bullish", "MACD hist > 0", "EMA fast > slow (uptrend)"]
    },
    "derivatives": {
      "score": 55.0,
      "notes": ["Funding 0.012% — bullish bias", "Elite L/S 1.18 — leaning long"]
    },
    "cycle": {
      "score": 70.0,
      "notes": ["AHR999 1.05 — DCA zone", "Mayer 1.32 — fair", "Rainbow: HODL!"]
    }
  }
}
```

## 评分细则

详见 `scripts/scoring.py` 源码。每个支柱都列出贡献分项与说明。

### 价量支柱评分项

| 信号 | 加分 / 减分 |
|---|---|
| RSI > 70 (超买) | -10 |
| RSI > 55 (偏多) | +5 |
| RSI < 30 (超卖) | +10 |
| RSI < 45 (偏空) | -5 |
| MACD hist > 0 / < 0 | ±7 |
| EMA fast 上 / 下 slow | ±8 |
| ADX > 25 | 强趋势放大器（不直接打分） |
| 看涨规则背离 (`bull_reg`) | +12 |
| 看跌规则背离 (`bear_reg`) | -12 |
| 看涨 / 看跌隐藏背离 | ±6 |
| 每个看涨形态 | +4 |
| 每个看跌形态 | -4 |

### 衍生品支柱评分项

| 信号 | 加分 / 减分 |
|---|---|
| Funding > 0.05% | -12（多头过度） |
| Funding < -0.05% | +12（空头过度） |
| OI 24h +15% | -8（挤仓风险） |
| OI 24h -10% | -6（资金离场） |
| Elite L/S > 1.5 | +10（聪明钱多） |
| Elite L/S < 0.7 | -10（聪明钱空） |
| 1h 多头清算占比 > 80% | +8（底部信号） |
| 1h 空头清算占比 > 80% | -8（顶部信号） |
| Basis 偏离 ±0.5% | ±4 |

### BTC 周期支柱评分项

| 信号 | 加分 / 减分 |
|---|---|
| AHR999 < 0.45 | +20（抄底区） |
| AHR999 > 1.6 | -20（泡沫预警） |
| Pi Cycle TOP 触发 | -25 ⚠️ |
| Mayer < 1 | +8 |
| Mayer > 2.4 | -12 |
| Rainbow 在 Fire Sale / BUY / Accumulate | +10 |
| Rainbow 在 FOMO / Sell / Bubble | -10 |

## 数据缺口（诚实声明）

ta-master **不覆盖**以下指标（HTX 无原生 endpoint，需付费数据源）：

| 缺口 | 来源 |
|---|---|
| MVRV / NUPL / SOPR | Glassnode（链上） |
| Hash Ribbon / 矿工算力 | Mempool.space |
| LTH/STH 持仓供应 | Glassnode |
| 全账户多空比（散户口径） | HTX 仅提供精英口径 |
| Taker 主动买卖量 | HTX 未提供 |
| 清算热力图密度 | 我们用清算订单流本地聚合，密度比 Coinglass 低 |

未来可选：通过 `--external-source glassnode` 等扩展集成。

## 依赖 skill

安装本 skill 前，确保已安装：
- `htx/spot-market`（K线源）
- `htx/futures-market`（K线源）
- `htx/technical-analysis`（指标计算引擎）
- `htx/funding-rate`
- `htx/oi-tracker`
- `htx/liquidation-stream`
- `htx/elite-positioning`
- `htx/mark-price`

## 安装

```bash
npx -y @sheerl/htx-cli skill install ta-master
```

## 典型问法

- "BTC 现在技术 + 衍生品 + 周期综合看怎么样？"
- "ETH 4H 综合评分"
- "全市场扫描，给我 ta-master 评分 > 70 的币种"
- "BTC 现在 AHR999 + 资金费率 + RSI 三个一起判断"
