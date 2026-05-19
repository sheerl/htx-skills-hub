---
name: htx/funding-rate
version: 2.0.0
description: HTX USDT 永续合约资金费率 — 当前 / 全市场批量 / 历史 / 估算下一期 K线
auth: false
risk: low
---

# Funding Rate — 资金费率

监控 HTX USDT-M 永续合约资金费率。**无需 API Key**。

资金费率每 8 小时结算一次（UTC 0:00 / 8:00 / 16:00），**正费率**多头付给空头，**负费率**空头付给多头。可用于：
- 套利（费率为正时做空 + 现货做多套保）
- 情绪信号（极端正费率 = 多头过热，潜在挤仓）
- 持仓成本测算

## 何时使用

- 查询单合约当前资金费率
- 全市场扫描，发现费率异常合约
- 拉取历史费率序列做趋势分析
- 估算下一期资金费率走势（K线形式）

## 快速开始

```bash
# BTC 永续当前费率
htx-cli funding-rate current -p contract_code=BTC-USDT

# 全市场所有永续费率
htx-cli funding-rate batch

# BTC 历史费率（最近 30 期 = 10 天）
htx-cli funding-rate history -p contract_code=BTC-USDT -p page_size=30
```

## 可用命令（4 个 endpoint）

| 命令 | HTX endpoint | 描述 |
|------|--------------|------|
| `current` | `GET /linear-swap-api/v1/swap_funding_rate` | 单合约当前费率 + 下次结算时间 |
| `batch` | `GET /linear-swap-api/v1/swap_batch_funding_rate` | 全市场所有合约批量费率 |
| `history` | `GET /linear-swap-api/v1/swap_historical_funding_rate` | 历史费率序列（分页） |
| `estimated-kline` | `GET /linear-swap-ex/market/history/funding_rate` | 估算下一期费率 K线 |

## 参数说明

- `contract_code` — `BTC-USDT` / `ETH-USDT` / `SOL-USDT` 等
- `page_index` — 页码，从 1 开始
- `page_size` — 每页条数，最大 50
- `period` — K线周期（`estimated-kline` 用）：`1min` `5min` `15min` `30min` `60min` `4hour` `1day`
- `size` — K线条数 1-2000

## 典型场景

**「BTC 永续当前资金费率多少？」**
```bash
htx-cli funding-rate current -p contract_code=BTC-USDT
# 返回 funding_rate（当前期）+ estimated_rate（预估下一期）+ next_funding_time
```

**「哪些币资金费率为负？做多反而拿钱？」**
```bash
htx-cli funding-rate batch
# AI Agent 过滤 funding_rate < 0 的合约
```

**「BTC 近 7 天资金费率走势」**
```bash
# 7 天 = 21 期
htx-cli funding-rate history -p contract_code=BTC-USDT -p page_size=21
# 数组按时间倒序
```

**「全市场最热（费率最高）的 5 个永续」**
```bash
htx-cli funding-rate batch
# 按 funding_rate 降序取前 5
```

## 输出 schema 摘录

`current` 返回：
```json
{
  "status": "ok",
  "data": {
    "contract_code": "BTC-USDT",
    "fee_asset": "USDT",
    "funding_time": "1712345600000",
    "funding_rate": "0.00012500",
    "estimated_rate": "0.00009800",
    "settlement_time": "1712376000000",
    "next_funding_time": "1712376000000"
  }
}
```

## 解读建议

| funding_rate 区间 | 含义 |
|------------------|------|
| > 0.0005 (0.05%) | 多头过热，警惕回调 |
| 0.0001 ~ 0.0005 | 偏多氛围 |
| -0.0001 ~ 0.0001 | 中性 |
| < -0.0001 | 偏空氛围 |
| < -0.0005 | 空头过热，潜在反弹 |

> 注：判断需结合现货 / 衍生品价差、持仓量变化等，单一指标不足。

## 安装

```bash
npx -y github:sheerl/htx-skills-hub htx-cli skill install funding-rate
```
