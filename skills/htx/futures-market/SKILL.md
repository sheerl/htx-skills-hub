---
name: htx/futures-market
version: 2.0.0
description: HTX USDT 永续合约核心行情 — 合约信息 / K线 / Ticker / 盘口 / 索引价 / 系统状态
auth: false
risk: low
---

# Futures Market — 合约行情

读取 HTX USDT-M 永续合约公开行情数据。**无需 API Key**。

> 资金费率、持仓量、清算、标记价 / 基差等**专项**数据已拆分到独立 skill，本 skill 只覆盖通用行情。

## 何时使用

- 查询永续合约实时价格、24h 统计、索引价
- 拉取 K线（标准 K线，非标记价 / 溢价指数）
- 查看盘口深度
- 检查合约元数据（合约 size、精度、上线状态）
- 检查交易所系统状态

## 快速开始

```bash
# BTC 永续最新行情
htx-cli futures-market detail-merged -p contract_code=BTC-USDT

# ETH 永续 1h K线
htx-cli futures-market kline -p contract_code=ETH-USDT -p period=60min -p size=200

# 所有永续合约信息
htx-cli futures-market contract-info
```

## 可用命令（15 个 endpoint）

### 行情数据

| 命令 | HTX endpoint | 描述 |
|------|--------------|------|
| `detail-merged` | `GET /linear-swap-ex/market/detail/merged` | 单合约实时摘要 |
| `detail-batch-merged` | `GET /linear-swap-ex/market/detail/batch_merged` | 批量合约实时摘要 |
| `kline` | `GET /linear-swap-ex/market/history/kline` | 历史 K线 |
| `depth` | `GET /linear-swap-ex/market/depth` | 盘口深度 |
| `bbo` | `GET /linear-swap-ex/market/bbo` | 最优买卖价 |
| `trade` | `GET /linear-swap-ex/market/trade` | 最新一笔成交 |
| `history-trade` | `GET /linear-swap-ex/market/history/trade` | 历史成交 |

### 索引与公允价格

| 命令 | HTX endpoint | 描述 |
|------|--------------|------|
| `index-price` | `GET /linear-swap-api/v1/swap_index` | 实时指数价格 |

> 标记价 / 溢价指数 / 基差 K线请用 `htx/mark-price`

### 元数据

| 命令 | HTX endpoint | 描述 |
|------|--------------|------|
| `contract-info` | `GET /linear-swap-api/v1/swap_contract_info` | 合约元信息 |
| `query-elements` | `GET /linear-swap-api/v1/swap_query_elements` | 合约要素（精度、size） |
| `risk-info` | `GET /linear-swap-api/v1/swap_risk_info` | 平台风险准备金 |
| `funding-rate-cap` | `GET /linear-swap-api/v1/swap_funding_rate_cap_info` | 资金费率上下限 |

### 系统状态

| 命令 | HTX endpoint | 描述 |
|------|--------------|------|
| `timestamp` | `GET /api/v1/timestamp` | 服务器时间 |
| `heartbeat` | `GET /heartbeat/` | 系统心跳与状态 |
| `transfer-state` | `GET /linear-swap-api/v1/swap_transfer_state` | 划转开关状态 |

## 参数说明

- `contract_code` — 合约代码大写连字符，如 `BTC-USDT` / `ETH-USDT` / `SOL-USDT`
- `period` — `1min` `5min` `15min` `30min` `60min` `4hour` `1day` `1week` `1mon`
- `size` — K线返回条数 1-2000
- `type` — 盘口聚合：`step0` 到 `step19`
- `business_type` — `swap` (USDT 永续) / `futures` (交割) / `all`

## 典型场景

**「BTC 永续比现货溢价多少？」**
```bash
# 永续最新价
htx-cli futures-market detail-merged -p contract_code=BTC-USDT
# 现货最新价
htx-cli spot-market market-detail-merged -p symbol=btcusdt
# AI Agent 比对两者计算溢价百分比
```

**「ETH 永续 24h 成交额最大几个币？」**
```bash
htx-cli futures-market detail-batch-merged -p business_type=swap
# 解析 vol 字段排序
```

**「BTC 永续合约 size 是多少？」**
```bash
htx-cli futures-market contract-info -p contract_code=BTC-USDT
# contract_size 字段：BTC-USDT = 0.001 BTC/张
```

## 注意事项

- 本 skill 只覆盖**通用行情**。专项数据请用独立 skill：
  - 资金费率 → `htx/funding-rate`
  - 持仓量 → `htx/oi-tracker`
  - 多空比 → `htx/elite-positioning`
  - 清算订单 → `htx/liquidation-stream`
  - 标记价 / 基差 → `htx/mark-price`
  - 结算 / 保险基金 → `htx/settlement`
- 写操作（下单、改杠杆）请用 `htx/futures-trading`
- 账户查询请用 `htx/futures-account`

## 安装

```bash
npx -y github:sheerl/htx-skills-hub skill install futures-market
```

## 相关文档

- HTX 永续合约 API: https://huobiapi.github.io/docs/usdt_swap/v1/cn/
