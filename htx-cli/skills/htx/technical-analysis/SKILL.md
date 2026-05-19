---
name: htx-technical-analysis
version: 1.0.0
description: Technical analysis on HTX kline data — computes 12 indicators locally (MA, EMA, MACD, RSI, BOLL, ATR, ADX, KDJ, OBV, VWAP, Fibonacci, Donchian) and synthesizes a directional view with key levels and divergences. Public, no API key required.
auth_required: false
risk_level: none
---

# HTX Technical Analysis

Layer 2 analytical skill. Pulls kline data via `htx-cli` (spot or futures) and runs a **local Python indicator engine** to produce a synthesized read on trend, momentum, volatility, and key levels — without consuming any API quota for indicator computation.

## When to use this skill

Load this skill when the user asks for:

- "Technical analysis on BTC 4h"
- "Is ETH trend up or down?"
- "BTC RSI / MACD / Bollinger / Fibonacci levels"
- "Multi-timeframe view on SOL (1h + 4h + 1d)"
- "Detect divergence on BTC-USDT"
- "Where are the key support/resistance levels for ETH?"

## Underlying tools

1. **`htx-cli`** — fetches klines (spot from `htx-cli spot market klines`, futures via `htx-cli futures call ... mark/kline`)
2. **`indicators.py`** (bundled, pure Python stdlib, **no numpy required**) — local indicator engine

The script is installed alongside SKILL.md at `~/.claude/skills/htx/technical-analysis/scripts/indicators.py`.

## Indicator catalog (12)

| Key | Indicator | Output |
|-----|-----------|--------|
| `ma` | Simple Moving Average (SMA20) | series |
| `ema` | Exponential Moving Average (EMA20) | series |
| `macd` | MACD (12,26,9) | macd / signal_line / hist |
| `rsi` | Relative Strength Index (14) | 0-100 series |
| `boll` | Bollinger Bands (20, 2σ) | upper / middle / lower |
| `atr` | Average True Range (14) | volatility series |
| `adx` | ADX + DI± (14) | trend strength |
| `kdj` | KDJ Stochastic (9,3,3) | k / d / j |
| `obv` | On-Balance Volume | cumulative series |
| `vwap` | Volume-Weighted Average Price | session series |
| `fib` | Fibonacci retracement (last 100 bars) | 23.6/38.2/50/61.8/78.6 levels |
| `dc` | Donchian Channel (20) | upper / middle / lower |

## Standard workflow

### Step 1 — Fetch klines

For **spot** symbols (e.g. `btcusdt`):

```bash
htx-cli spot market klines btcusdt --period 4hour --size 200 --json
```

For **USDT-M futures** (e.g. `BTC-USDT`):

```bash
htx-cli futures call GET /linear-swap-ex/market/history/kline \
  -p contract_code=BTC-USDT -p period=240min -p size=200 --json
```

Period values:
- spot: `1min, 5min, 15min, 30min, 60min, 4hour, 1day, 1mon, 1week, 1year`
- futures: `1min, 5min, 15min, 30min, 60min, 4hour, 1day` (note: 4hour expressed as `240min` in some endpoints; the convenience `htx-cli spot market klines` uses spot's set)

### Step 2 — Pipe to indicator engine

```bash
htx-cli spot market klines btcusdt --period 4hour --size 200 --json \
  | python3 ~/.claude/skills/htx/technical-analysis/scripts/indicators.py --all
```

Or pick specific indicators:

```bash
htx-cli spot market klines btcusdt --period 4hour --size 200 --json \
  | python3 ~/.claude/skills/htx/technical-analysis/scripts/indicators.py \
      --include rsi,macd,boll,fib --tail 3
```

### Step 3 — Synthesize and respond

The script returns:

```json
{
  "meta": {"count": 200, "first_ts": ..., "last_ts": ..., "last_close": 67890.0, ...},
  "indicators": {
    "rsi": {"length": 14, "series": [..., 62.4]},
    "macd": {"macd": [...], "signal_line": [...], "hist": [...]},
    "boll": {"upper": [...], "middle": [...], "lower": [...]},
    ...
  }
}
```

## Multi-timeframe alignment

For a higher-confidence view, run the engine on 3 timeframes:

```bash
for p in 60min 4hour 1day; do
  htx-cli spot market klines btcusdt --period $p --size 200 --json \
    | python3 ~/.claude/skills/htx/technical-analysis/scripts/indicators.py \
        --include rsi,macd --tail 1 \
    | jq --arg p "$p" '. + {tf: $p}'
done
```

Then combine: if RSI direction agrees on 1h/4h/1d → `confidence = high`; if disagrees → `confidence = low`.

## Output guidance

Synthesize into a structured JSON for downstream Skills:

```json
{
  "skill": "technical-analysis",
  "symbol": "btcusdt",
  "timeframe": "4hour",
  "summary": {
    "direction": "bullish | bearish | neutral",
    "confidence": "high | medium | low",
    "signal_strength": 0-100,
    "one_liner": "short conclusion"
  },
  "trend": {
    "direction": "up | down | sideways",
    "ema_alignment": "bullish | bearish | mixed",
    "adx_strength": "strong | moderate | weak"
  },
  "indicators": {
    "rsi": {"value": ..., "zone": "overbought | oversold | neutral"},
    "macd": {"signal": "golden | death | none", "hist_direction": "rising | falling"},
    "boll": {"position": "above_upper | middle | below_lower"}
  },
  "key_levels": {
    "support": [..., ...],
    "resistance": [..., ...],
    "fib_50": ...,
    "fib_618": ...
  },
  "patterns": {
    "divergence": "bullish | bearish | none"
  },
  "risk_warning": "..."
}
```

### Direction-classification rule of thumb

| Condition | Direction |
|-----------|-----------|
| EMA20 > EMA60 AND MACD hist > 0 AND RSI > 55 AND price > BOLL middle | bullish |
| Reverse all above | bearish |
| Mixed signals | neutral |

### Divergence detection

| Pattern | Setup |
|---------|-------|
| Bullish divergence | Price makes lower low, RSI makes higher low |
| Bearish divergence | Price makes higher high, RSI makes lower high |

The engine returns RSI / MACD series; let the agent compare last 2-3 swing pivots against price highs/lows.

## Related skills

- `@htx-skills/spot-market` / `@htx-skills/futures-market` — kline data sources
- `@htx-skills/mark-price` — for futures, prefer mark price kline over last-price kline (less noise)
- `@htx-skills/derivatives-analyst` — pair technicals with derivatives pressure for full view
- `@htx-skills/market-overview` — find which symbol to analyze first

## Notes

- Indicators are **deterministic & reproducible** — same kline input = same output, byte-for-byte
- Pure Python stdlib; no `pip install` required
- Output values are deliberately trimmed to last N (default 5) per series to keep agent context lean — agent can request `--tail 0` for full series if needed
