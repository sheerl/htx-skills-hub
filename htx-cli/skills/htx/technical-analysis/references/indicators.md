# 技术指标参考（51 个）

通用调用：
```bash
python scripts/indicators.py <name> --kline <kline.json> [--params <p1,p2,...>] [--list] [--limit 10]
```

`--list` 返回历史序列（默认最后 10 根），不加返回最新值。

## 移动均线（8）

| 名称 | 默认参数 | 返回字段 | 用途 |
|---|---|---|---|
| `ma` | `5,20,60` | `ma5, ma20, ma60` | 简单均线，多周期叠加判断趋势 |
| `ema` | `5,20` | `ema5, ema20` | 指数均线，权重偏近期 |
| `wma` | `20` | `wma` | 线性加权均线 |
| `dema` | `20` | `dema` | 双重 EMA，减少滞后 |
| `tema` | `20` | `tema` | 三重 EMA，更激进 |
| `hma` | `20` | `hma` | Hull MA，平滑且响应快 |
| `kama` | `10` | `kama` | 自适应均线，趋势期跟随、震荡期平稳 |
| `zlema` | `20` | `zlema` | 零滞后 EMA |

## 趋势（8）

| 名称 | 参数 | 返回 | 用途 |
|---|---|---|---|
| `macd` | `12,26,9` | `dif, dea, macd` | 经典趋势 + 动量，金叉死叉 |
| `adx` | `14` | `adx, plus_di, minus_di` | 趋势强度，>25 强趋势 |
| `aroon` | `14` | `aroon_up, aroon_down, aroon_osc` | 趋势开始/结束识别 |
| `cci` | `20` | `cci` | 顺势指标，±100 为常见阈值 |
| `supertrend` | `10,3` | `supertrend, direction` | 趋势跟随 + 买卖信号 |
| `sar` | — | `sar` | 抛物线转向 |
| `dpo` | `20` | `dpo` | 去趋势震荡器 |
| `envelope` | `20,0.1` | `upper, middle, lower` | 简单包络线 |

## 动量（10）

| 名称 | 参数 | 返回 | 用途 |
|---|---|---|---|
| `rsi` | `14` | `rsi` | 相对强弱，>70 超买 / <30 超卖 |
| `stoch-rsi` | `14` | `k, d` | RSI 的随机指标 |
| `stoch` | `14,3,3` | `k, d` | 随机指标 |
| `kdj` | `9,3,3` | `k, d, j` | 中国市场最常用 |
| `roc` | `12` | `roc` | 变化率 |
| `mom` | `10` | `mom` | 动量（差值） |
| `ppo` | `12,26,9` | `ppo, signal, hist` | 价格百分比震荡器 |
| `trix` | `15` | `trix` | 三重平滑动量 |
| `wr` | `14` | `wr` | Williams %R |
| `uo` | `7,14,28` | `uo` | Ultimate Oscillator |

## 波动率（8）

| 名称 | 参数 | 返回 | 用途 |
|---|---|---|---|
| `bb` (alias `boll`) | `20,2` | `upper, middle, lower` | 布林带 |
| `bbwidth` | `20,2` | `bbwidth` | 布林带宽，挤压识别 |
| `bbpct` | `20,2` | `bbpct` | 布林 %B（位置） |
| `atr` | `14` | `atr` | 真实波幅，止损用 |
| `keltner` | `20,2` | `upper, middle, lower` | Keltner 通道 |
| `donchian` | `20` | `upper, middle, lower` | 唐奇安通道 |
| `hv` | `20` | `hv` | 历史波动率（年化）  |
| `stddev` | `20` | `stddev` | 标准差 |

## 成交量（6）

| 名称 | 返回 | 用途 |
|---|---|---|
| `obv` | `obv` | 量能累加 |
| `vwap` | `vwap` | 成交量加权均价 |
| `mvwap` | `mvwap` | 滚动 VWAP |
| `cmf` | `cmf` | Chaikin Money Flow |
| `mfi` | `mfi` | 资金流量指数 |
| `ad` | `ad` | 累积/派发线 |

## 统计（5）

| 名称 | 返回 |
|---|---|
| `lr` | `lr` (Linear Regression endpoint) |
| `slope` | `slope` |
| `angle` | `angle_deg` |
| `variance` | `variance` |
| `sigma` | `sigma` (z-score) |

## 其他（5）

| 名称 | 返回 |
|---|---|
| `fisher` | `fisher, trigger` |
| `tr` | True Range |
| `tp` | Typical Price |
| `mp` | Median Price |
| `cho` | Chaikin Oscillator |

## 参数注意

- 大部分指标 `--params 14` 直接传周期
- `macd` / `ppo` / `kdj` 传 3 个数：`--params 12,26,9`
- `supertrend` 传 `--params 10,3`（period, multiplier）
- `bb` / `envelope` 传 `--params 20,2`（period, dev）
