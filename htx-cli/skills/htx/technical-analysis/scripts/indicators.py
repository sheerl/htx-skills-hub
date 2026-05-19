#!/usr/bin/env python3
"""HTX kline → technical indicators.

Reads kline JSON (HTX format) from stdin or a file, computes a configurable
set of indicators, and emits a single JSON document to stdout.

Pure stdlib — no numpy / pandas required. Indicators are intentionally
implemented with simple recurrences so behavior matches Bitget / TradingView
within rounding error.

Usage:
  htx-cli spot market klines btcusdt --period 4hour --size 200 --json \
    | python3 indicators.py --include rsi,macd,boll,ema

  python3 indicators.py --file kline.json --all
"""
from __future__ import annotations

import argparse
import json
import math
import sys
from typing import Iterable


# --------------------- helpers ---------------------

def _ema(values: list[float], length: int) -> list[float]:
    if not values:
        return []
    k = 2.0 / (length + 1)
    out = [values[0]]
    for v in values[1:]:
        out.append(out[-1] + k * (v - out[-1]))
    return out


def _sma(values: list[float], length: int) -> list[float]:
    if len(values) < length:
        return [float('nan')] * len(values)
    out = [float('nan')] * (length - 1)
    s = sum(values[:length])
    out.append(s / length)
    for i in range(length, len(values)):
        s += values[i] - values[i - length]
        out.append(s / length)
    return out


def _stdev(values: list[float], length: int) -> list[float]:
    out = [float('nan')] * len(values)
    for i in range(length - 1, len(values)):
        window = values[i - length + 1:i + 1]
        m = sum(window) / length
        var = sum((x - m) ** 2 for x in window) / length
        out[i] = math.sqrt(var)
    return out


def _rma(values: list[float], length: int) -> list[float]:
    """Wilder's smoothing (used by RSI / ATR / ADX)."""
    if not values:
        return []
    out = [float('nan')] * (length - 1)
    seed = sum(values[:length]) / length
    out.append(seed)
    for v in values[length:]:
        out.append((out[-1] * (length - 1) + v) / length)
    return out


# --------------------- indicators ---------------------

def ma(closes, length=20):
    return {'length': length, 'series': _sma(closes, length)}


def ema(closes, length=20):
    return {'length': length, 'series': _ema(closes, length)}


def macd(closes, fast=12, slow=26, signal=9):
    fast_ema = _ema(closes, fast)
    slow_ema = _ema(closes, slow)
    macd_line = [a - b for a, b in zip(fast_ema, slow_ema)]
    signal_line = _ema(macd_line, signal)
    hist = [a - b for a, b in zip(macd_line, signal_line)]
    return {'fast': fast, 'slow': slow, 'signal': signal,
            'macd': macd_line, 'signal_line': signal_line, 'hist': hist}


def rsi(closes, length=14):
    if len(closes) < length + 1:
        return {'length': length, 'series': [float('nan')] * len(closes)}
    deltas = [closes[i] - closes[i - 1] for i in range(1, len(closes))]
    gains = [max(d, 0.0) for d in deltas]
    losses = [-min(d, 0.0) for d in deltas]
    avg_g = _rma(gains, length)
    avg_l = _rma(losses, length)
    out = [float('nan')]
    for g, l in zip(avg_g, avg_l):
        if math.isnan(g) or math.isnan(l) or l == 0:
            out.append(100.0 if (l == 0 and not math.isnan(g)) else float('nan'))
        else:
            rs = g / l
            out.append(100 - 100 / (1 + rs))
    return {'length': length, 'series': out}


def bollinger(closes, length=20, mult=2.0):
    mid = _sma(closes, length)
    sd = _stdev(closes, length)
    upper = [m + mult * s if not math.isnan(m) else float('nan') for m, s in zip(mid, sd)]
    lower = [m - mult * s if not math.isnan(m) else float('nan') for m, s in zip(mid, sd)]
    return {'length': length, 'mult': mult, 'upper': upper, 'middle': mid, 'lower': lower}


def atr(highs, lows, closes, length=14):
    trs = [highs[0] - lows[0]] if highs else []
    for i in range(1, len(highs)):
        tr = max(highs[i] - lows[i],
                 abs(highs[i] - closes[i - 1]),
                 abs(lows[i] - closes[i - 1]))
        trs.append(tr)
    return {'length': length, 'series': _rma(trs, length)}


def adx(highs, lows, closes, length=14):
    plus_dm, minus_dm, trs = [0.0], [0.0], [highs[0] - lows[0] if highs else 0]
    for i in range(1, len(highs)):
        up_move = highs[i] - highs[i - 1]
        down_move = lows[i - 1] - lows[i]
        plus_dm.append(up_move if (up_move > down_move and up_move > 0) else 0.0)
        minus_dm.append(down_move if (down_move > up_move and down_move > 0) else 0.0)
        trs.append(max(highs[i] - lows[i],
                       abs(highs[i] - closes[i - 1]),
                       abs(lows[i] - closes[i - 1])))
    sm_p = _rma(plus_dm, length)
    sm_m = _rma(minus_dm, length)
    sm_tr = _rma(trs, length)
    plus_di, minus_di, dx = [], [], []
    for p, m, t in zip(sm_p, sm_m, sm_tr):
        if math.isnan(t) or t == 0:
            plus_di.append(float('nan')); minus_di.append(float('nan')); dx.append(float('nan'))
            continue
        pdi = 100 * p / t
        mdi = 100 * m / t
        plus_di.append(pdi); minus_di.append(mdi)
        denom = pdi + mdi
        dx.append(100 * abs(pdi - mdi) / denom if denom else 0.0)
    adx_series = _rma([0.0 if math.isnan(x) else x for x in dx], length)
    return {'length': length, 'plus_di': plus_di, 'minus_di': minus_di,
            'dx': dx, 'adx': adx_series}


def kdj(highs, lows, closes, length=9, k_smooth=3, d_smooth=3):
    n = len(closes)
    rsv = [float('nan')] * n
    for i in range(length - 1, n):
        h = max(highs[i - length + 1:i + 1])
        l = min(lows[i - length + 1:i + 1])
        rsv[i] = 100 * (closes[i] - l) / (h - l) if h != l else 50.0
    k_series = [50.0] * n
    d_series = [50.0] * n
    for i in range(n):
        if math.isnan(rsv[i]):
            continue
        k_series[i] = (k_series[i - 1] * (k_smooth - 1) + rsv[i]) / k_smooth if i > 0 else rsv[i]
        d_series[i] = (d_series[i - 1] * (d_smooth - 1) + k_series[i]) / d_smooth if i > 0 else k_series[i]
    j_series = [3 * k - 2 * d for k, d in zip(k_series, d_series)]
    return {'length': length, 'k': k_series, 'd': d_series, 'j': j_series}


def obv(closes, volumes):
    out = [0.0]
    for i in range(1, len(closes)):
        if closes[i] > closes[i - 1]:
            out.append(out[-1] + volumes[i])
        elif closes[i] < closes[i - 1]:
            out.append(out[-1] - volumes[i])
        else:
            out.append(out[-1])
    return {'series': out}


def vwap(highs, lows, closes, volumes):
    typical = [(h + l + c) / 3 for h, l, c in zip(highs, lows, closes)]
    cum_pv, cum_v, out = 0.0, 0.0, []
    for tp, v in zip(typical, volumes):
        cum_pv += tp * v
        cum_v += v
        out.append(cum_pv / cum_v if cum_v else float('nan'))
    return {'series': out}


def fibonacci(highs, lows, lookback=100):
    if len(highs) < 2:
        return {}
    window_h = highs[-lookback:] if lookback else highs
    window_l = lows[-lookback:] if lookback else lows
    hi = max(window_h)
    lo = min(window_l)
    diff = hi - lo
    levels = {f'{int(p*1000)/10}%': hi - diff * p
              for p in (0.236, 0.382, 0.5, 0.618, 0.786)}
    return {'high': hi, 'low': lo, 'levels': levels}


def donchian(highs, lows, length=20):
    n = len(highs)
    upper = [float('nan')] * n
    lower = [float('nan')] * n
    for i in range(length - 1, n):
        upper[i] = max(highs[i - length + 1:i + 1])
        lower[i] = min(lows[i - length + 1:i + 1])
    middle = [(u + l) / 2 if not math.isnan(u) else float('nan')
              for u, l in zip(upper, lower)]
    return {'length': length, 'upper': upper, 'middle': middle, 'lower': lower}


# --------------------- driver ---------------------

INDICATOR_FUNCS = {
    'ma': lambda c, h, l, v: ma(c),
    'ema': lambda c, h, l, v: ema(c),
    'macd': lambda c, h, l, v: macd(c),
    'rsi': lambda c, h, l, v: rsi(c),
    'boll': lambda c, h, l, v: bollinger(c),
    'atr': lambda c, h, l, v: atr(h, l, c),
    'adx': lambda c, h, l, v: adx(h, l, c),
    'kdj': lambda c, h, l, v: kdj(h, l, c),
    'obv': lambda c, h, l, v: obv(c, v),
    'vwap': lambda c, h, l, v: vwap(h, l, c, v),
    'fib': lambda c, h, l, v: fibonacci(h, l),
    'dc': lambda c, h, l, v: donchian(h, l),
}


def parse_klines(payload: dict) -> tuple[list, list, list, list, list]:
    """HTX kline format → (timestamps, opens, highs, lows, closes, volumes).

    Spot:    payload['data'] = [{'id', 'open', 'close', 'low', 'high', 'amount', 'vol', ...}]
    Futures: payload['data'] = [{'id', 'open', 'close', 'low', 'high', 'amount', 'vol', 'count'}]
    Both use ascending or descending order — we sort ascending by id.
    """
    items = payload.get('data') or []
    items = sorted(items, key=lambda x: x.get('id', 0))
    ts = [int(x['id']) for x in items]
    o = [float(x['open']) for x in items]
    h = [float(x['high']) for x in items]
    l = [float(x['low']) for x in items]
    c = [float(x['close']) for x in items]
    v = [float(x.get('vol', x.get('amount', 0))) for x in items]
    return ts, o, h, l, c, v


def trim_tail(obj, n=5):
    """For compact agent output, keep last N values of any list inside the indicator dict."""
    if isinstance(obj, list):
        return obj[-n:] if len(obj) > n else obj
    if isinstance(obj, dict):
        return {k: trim_tail(v, n) for k, v in obj.items()}
    return obj


def main(argv: list[str]) -> int:
    p = argparse.ArgumentParser(description='Compute technical indicators on HTX klines.')
    p.add_argument('--file', help='Read kline JSON from this path (else stdin).')
    p.add_argument('--include', default='', help='Comma-separated indicator keys (default: all).')
    p.add_argument('--all', action='store_true', help='Include all indicators.')
    p.add_argument('--tail', type=int, default=5, help='Trim each series to last N values.')
    args = p.parse_args(argv)

    raw = open(args.file).read() if args.file else sys.stdin.read()
    payload = json.loads(raw)
    if payload.get('status') and payload['status'] != 'ok':
        print(json.dumps({'error': payload}, ensure_ascii=False))
        return 1

    ts, o, h, l, c, v = parse_klines(payload)
    if not c:
        print(json.dumps({'error': 'no kline data'}))
        return 1

    if args.all or not args.include:
        keys = list(INDICATOR_FUNCS)
    else:
        keys = [k.strip() for k in args.include.split(',') if k.strip()]

    out = {
        'meta': {'count': len(c), 'first_ts': ts[0], 'last_ts': ts[-1],
                 'last_close': c[-1], 'last_high': h[-1], 'last_low': l[-1]},
        'indicators': {},
    }
    for k in keys:
        fn = INDICATOR_FUNCS.get(k)
        if not fn:
            out['indicators'][k] = {'error': 'unknown indicator'}
            continue
        try:
            out['indicators'][k] = trim_tail(fn(c, h, l, v), args.tail)
        except Exception as e:
            out['indicators'][k] = {'error': str(e)}

    print(json.dumps(out, ensure_ascii=False, default=str))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
