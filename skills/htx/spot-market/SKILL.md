---
name: htx/spot-market
version: 2.0.0
description: HTX 现货行情查询 — Ticker / K线 / 盘口 / 最新成交 / 币种与交易对元数据
auth: false
risk: low
---

# Spot Market — 现货行情

读取 HTX 现货公开行情数据。**无需 API Key**，所有 endpoint 均为公开接口。

## 何时使用

- 查询单个交易对实时价格、24h 涨跌幅、成交量
- 拉取 K线（minute / hour / day / week / month 周期）
- 查看盘口深度（买卖五/十/二十档）
- 全市场扫描（所有交易对 ticker 快照）
- 解析币种 / 交易对元数据（精度、最小下单量）

## 快速开始

```bash
# 查询 BTC/USDT 最新行情
htx-cli spot-market market-detail-merged -p symbol=btcusdt

# 拉取 ETH/USDT 4 小时 K线，最近 100 根
htx-cli spot-market kline -p symbol=ethusdt -p period=4hour -p size=100

# 查询全市场 ticker
htx-cli spot-market tickers
```

## 可用命令（13 个 endpoint）

### 行情类

| 命令 | HTX endpoint | 描述 |
|------|--------------|------|
| `market-detail-merged` | `GET /market/detail/merged` | 单个交易对实时摘要（最新价 + 24h 统计） |
| `market-detail` | `GET /market/detail` | 单个交易对 24h 统计明细 |
| `tickers` | `GET /market/tickers` | 全市场所有交易对 ticker 快照 |
| `kline` | `GET /market/history/kline` | 历史 K线（period: 1min / 5min / 15min / 30min / 60min / 4hour / 1day / 1week / 1mon） |
| `depth` | `GET /market/depth` | 盘口深度（type: step0 / step1 / step2 / step3 / step4 / step5） |
| `trade` | `GET /market/trade` | 最新一笔成交 |
| `history-trade` | `GET /market/history/trade` | 历史成交（最多 2000 条） |

### 元数据类

| 命令 | HTX endpoint | 描述 |
|------|--------------|------|
| `symbols` | `GET /v1/common/symbols` | 所有可交易币对列表（精度、最小下单量、状态） |
| `currencys` | `GET /v1/common/currencys` | 所有币种列表 |
| `currencies-v2` | `GET /v2/reference/currencies` | 币种详细信息（含充提币状态） |
| `market-status` | `GET /v2/market-status` | 市场状态（normal / halted / cancel-only） |
| `timestamp` | `GET /v1/common/timestamp` | 服务器时间戳 |
| `chains` | `GET /v1/settings/common/chains` | 链信息 |

## 参数说明

- `symbol` — 交易对小写无分隔符，如 `btcusdt` / `ethusdt` / `solusdt`
- `period` — K线周期：`1min` `5min` `15min` `30min` `60min` `4hour` `1day` `1week` `1mon`
- `size` — 返回条数，1-2000
- `type` — depth 聚合精度：`step0`（无聚合）到 `step5`（最粗）
- `depth` — 档位数：5 / 10 / 20

## 典型场景

**「BTC 现在多少钱？」**
```bash
htx-cli spot-market market-detail-merged -p symbol=btcusdt
# → close 字段为最新价
```

**「ETH 4h K线趋势」**
```bash
htx-cli spot-market kline -p symbol=ethusdt -p period=4hour -p size=200
```

**「24h 涨幅最大的 10 个币」**
```bash
htx-cli spot-market tickers
# 由 AI Agent 解析 data 数组，按 (close-open)/open 排序取前 10
```

**「SOL 盘口深度」**
```bash
htx-cli spot-market depth -p symbol=solusdt -p type=step0 -p depth=20
```

## 输出 schema 摘录

`market-detail-merged` 返回：
```json
{
  "ch": "market.btcusdt.detail.merged",
  "ts": 1712345678901,
  "tick": {
    "id": 12345,
    "open": 65000.0,
    "close": 66100.0,
    "high": 66500.0,
    "low": 64800.0,
    "amount": 12345.67,
    "vol": 815432100.5,
    "count": 102345,
    "bid": [66099.5, 0.5],
    "ask": [66100.5, 0.3]
  }
}
```

## 注意事项

- 公开接口频控：单 IP 每秒约 100 次，建议聚合查询使用 `tickers` 一次性获取
- 币本位永续 / 交割合约行情请用 `htx/futures-market`
- 资金费率、持仓量、清算等专项数据见独立 skill（`htx/funding-rate` / `htx/oi-tracker` / `htx/liquidation-stream`）

## 安装

```bash
npx -y github:sheerl/htx-skills-hub skill install spot-market
```

## 相关文档

- HTX 官方 API: https://huobiapi.github.io/docs/spot/v1/cn/
- 完整 README: ./README.md
