# BTC 周期指标参考

5 个指标全部基于 BTC 历史价格 + 时间公式（创世日期 2009-01-03），无需链上数据。**仅适用于 BTC-USDT**。

```bash
python scripts/cycle.py <name> --kline btc1d.json
python scripts/cycle.py all --kline btc1d.json   # 一键全测
```

## AHR999

```
AHR999 = (price / MA200) × (price / fitted_price)
fitted_price = 10 ^ (5.84 × log10(days_since_genesis) - 17.01)
```

| 区间 | 含义 |
|---|---|
| < 0.45 | **抄底区**（accumulate） |
| 0.45 - 1.2 | 定投区（DCA） |
| > 1.2 | 顶部预警 / bubble |

## AHR999X

仅取 cycle 因子：`price / fitted_price`，去掉 MA200 比值，更纯粹反映周期位置。

## BTC Rainbow Chart

9 段对数估值带：

| 颜色 | 名称 | 含义 |
|---|---|---|
| 蓝 | Fire Sale | 极端低估，4 年一遇 |
| 浅蓝 | BUY! | 低估买入 |
| 绿 | Accumulate | 累积区 |
| 浅绿 | Still Cheap | 仍偏便宜 |
| 黄 | HODL! | 公允价 |
| 橙 | Hot | 偏热 |
| 红橙 | FOMO Intensifies | FOMO 升温 |
| 红 | Sell. Seriously. | 严肃考虑减仓 |
| 紫 | Maximum Bubble | 极端泡沫 |

## Pi Cycle Top

```
Signal: 111-day MA crosses ABOVE 350-day MA × 2
```

历史上 BTC 三次顶（2013 / 2017 / 2021）都在此信号触发后 3 天内见顶。极其罕见，一旦触发为强烈减仓信号。

## Mayer Multiple

```
Mayer = price / 200d_MA
```

| 区间 | 含义 |
|---|---|
| < 1.0 | 低估 |
| 1.0 - 1.5 | 公允 |
| 1.5 - 2.0 | 偏高 |
| 2.0 - 2.4 | 过热 |
| > 2.4 | 历史泡沫区 |

## 数据要求

- AHR999 / AHR999X / Mayer：≥ 200 根日 K
- Pi Cycle：≥ 350 根日 K
- Rainbow：任意根
- 创世前价格不存在，HTX K线 2017+ 完整。再早期价格可补 CoinMarketCap CSV
