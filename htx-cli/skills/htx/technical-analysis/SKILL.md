---
name: htx/technical-analysis
version: 3.0.0
description: HTX 技术指标分析引擎 — 51 指标 + 12 K线形态 + 5 BTC 周期指标 + 自动背离检测，全部本地 Python 计算
auth: false
risk: low
---

# Technical Analysis — 技术指标分析引擎 v3

本地计算引擎，**无需 API Key**。从 HTX K线 endpoint 拉数据，本地用 numpy/pandas 算指标 / 形态 / 周期。

> **合规声明**：本 skill 提供原始指标数值，不嵌入任何策略推荐或交易建议。所有判断由用户结合自身风险承受能力做出。

## 能力总览

| 类别 | 数量 | 文件 |
|---|---|---|
| 移动均线 | 8 (ma, ema, wma, dema, tema, hma, kama, zlema) | `scripts/indicators.py` |
| 趋势 | 8 (macd, adx, aroon, cci, supertrend, sar, dpo, envelope) | 同上 |
| 动量 | 10 (rsi, stoch-rsi, stoch, kdj, roc, mom, ppo, trix, wr, uo) | 同上 |
| 波动率 | 8 (bb, bbwidth, bbpct, atr, keltner, donchian, hv, stddev) | 同上 |
| 成交量 | 6 (obv, vwap, mvwap, cmf, mfi, ad) | 同上 |
| 统计 | 5 (lr, slope, angle, variance, sigma) | 同上 |
| 其他 | 5 (fisher, tr, tp, mp, cho) + divergence | 同上 |
| **K线形态** | 12 (doji / engulfing / harami / 3-soldiers / 3-crows ...) | `scripts/patterns.py` |
| **BTC 周期** | 5 (ahr999 / ahr999x / rainbow / pi-cycle / mayer) | `scripts/cycle.py` |
| **指标合计** | **51 指标 + 12 形态 + 5 周期 = 68** | |

## 快速上手

### 拉 K线 + 算指标

```bash
# 1. 拉 BTC/USDT 4小时 K线
htx-cli spot-market kline -p symbol=btcusdt -p period=4hour -p size=300 \
  | jq '.data' > /tmp/btc4h.json

# 2. 算 RSI
python scripts/indicators.py rsi --kline /tmp/btc4h.json --params 14
# → {"rsi": 62.4, "ts": 1779000000000}

# 3. 算 MACD（默认 12,26,9）
python scripts/indicators.py macd --kline /tmp/btc4h.json
# → {"dif": 320.1, "dea": 245.3, "macd": 149.6, "ts": ...}

# 4. 扫描所有 K线形态
python scripts/patterns.py scan --kline /tmp/btc4h.json
# → {"patterns": ["doji", "bull-engulf"], "ts": ...}

# 5. BTC 周期一键全测
python scripts/cycle.py all --kline /tmp/btc1d.json
```

### 列出所有指标

```bash
python scripts/indicators.py list
# → ["ma", "ema", "rsi", "macd", "supertrend", ...]
```

## 命令参考

详见 `references/`：
- `references/indicators.md` — 51 个技术指标的参数 / 返回字段 / 公式说明
- `references/patterns.md` — 12 个 K线形态的判定规则与典型场景
- `references/cycle.md` — BTC 5 个周期指标的公式与解读区间
- `references/divergence.md` — 自动背离检测的算法 + 使用建议

## 自动背离检测

```bash
python scripts/indicators.py divergence --kline /tmp/btc4h.json --params 14
# → {"divergence": "bull_reg", ...}
```

返回值：
- `bull_reg` — 价格创新低，指标未创新低（**底部反转信号**）
- `bear_reg` — 价格创新高，指标未创新高（**顶部反转信号**）
- `bull_hid` — 价格更高低点，指标更低低点（**回调延续多头**）
- `bear_hid` — 价格更低高点，指标更高高点（**反弹延续空头**）

## BTC 周期指标（仅 BTC-USDT 适用）

5 个指标全部基于价格 + 时间公式，无需链上数据：

| 指标 | 用途 | 解读 |
|---|---|---|
| `ahr999` | 定投择时 | <0.45 抄底 / 0.45-1.2 定投 / >1.2 顶部预警 |
| `ahr999x` | 纯周期信号 | 与 fitted curve 比值 |
| `rainbow` | 9 段彩虹估值带 | "Fire Sale" → "Maximum Bubble" |
| `pi-cycle` | 周期顶预警 | 111d MA 上穿 350d MA × 2 = 历史顶 |
| `mayer` | 长期估值 | <1 低估 / >2.4 历史泡沫 |

## 数据需求

| 指标类型 | 最少 K线数 |
|---|---|
| 短周期指标（RSI 14, MACD 26, ATR 14） | 50 根 |
| 长周期指标（MA200, KAMA） | 200+ 根 |
| BTC 周期（Pi Cycle 350d, Mayer 200d） | 350+ 根日 K |
| 背离检测 | 50+ 根 |

## 典型场景

**「BTC 4H 技术面怎么看」**
```bash
htx-cli spot-market kline -p symbol=btcusdt -p period=4hour -p size=200 | jq '.data' > btc.json
python scripts/indicators.py rsi --kline btc.json
python scripts/indicators.py macd --kline btc.json
python scripts/indicators.py supertrend --kline btc.json
python scripts/patterns.py scan --kline btc.json
python scripts/indicators.py divergence --kline btc.json
# AI 综合所有输出做判断
```

**「ETH 是否超买」**
```bash
python scripts/indicators.py rsi --kline eth4h.json
# rsi > 70 即超买
```

**「BTC 现在长期估值水平」**
```bash
htx-cli spot-market kline -p symbol=btcusdt -p period=1day -p size=400 | jq '.data' > btc1d.json
python scripts/cycle.py all --kline btc1d.json
```

## 与其他 skill 的关系

- **数据来源**：依赖 `htx/spot-market` 或 `htx/futures-market` 提供 K线
- **上层编排**：被 `htx/ta-master` 调用，作为「价量因子」支柱

## 安装

```bash
npx -y @htx-skills/technical-analysis install
```
