---
name: htx/spot-trading
version: 2.0.0
description: HTX 现货交易 — 限价 / 市价下单 / 撤单 / 改单 / 订单查询 / 杠杆借贷
auth: true
risk: high
---

# Spot Trading — 现货交易

现货下单、撤单、改单、订单查询，以及杠杆借贷操作。

> ⚠️ **高风险写操作 skill**。每次执行下单 / 撤单 / 借贷前，AI Agent 必须向用户展示完整参数（symbol、side、type、price、amount）并获得明确确认。

## 鉴权与权限

- API Key 需 **trade** 权限
- 部分查询接口需 **read** 权限即可
- API Key 仅在本机使用，不上传

## Endpoint 目录（11 个）

### 下单 / 撤单（核心写操作）

| # | Method | Endpoint | 描述 |
|---|--------|----------|------|
| 1 | POST | `/v1/order/orders/place` | 单笔下单（限价 / 市价 / 止盈止损 / IOC / FOK） |
| 2 | POST | `/v1/order/batch-orders` | 批量下单（最多 10 笔） |
| 3 | POST | `/v1/order/orders/{order-id}/submitcancel` | 按订单 ID 撤单 |
| 4 | POST | `/v1/order/orders/submitCancelClientOrder` | 按 client-order-id 撤单 |
| 5 | POST | `/v1/order/orders/batchcancel` | 批量撤单（按订单 ID 列表） |
| 6 | POST | `/v1/order/orders/batchCancelOpenOrders` | 撤掉全部未成交（按 symbol） |

### 订单查询（读）

| # | Method | Endpoint | 描述 |
|---|--------|----------|------|
| 7 | GET | `/v1/order/openOrders` | 当前未成交订单 |
| 8 | GET | `/v1/order/orders/{order-id}` | 单笔订单详情 |
| 9 | GET | `/v1/order/orders` | 历史订单（按时间窗口） |
| 10 | GET | `/v1/order/matchresults` | 历史成交明细 |

### 杠杆借贷

| # | Method | Endpoint | 描述 |
|---|--------|----------|------|
| 11 | POST | `/v1/margin/orders` | 借入杠杆资金（写） |

## 下单参数（核心）

```json
{
  "account-id": "<spot-account-id>",
  "symbol": "btcusdt",
  "type": "buy-limit | sell-limit | buy-market | sell-market | buy-ioc | sell-ioc | buy-limit-fok | sell-limit-fok",
  "amount": "0.001",
  "price": "65000.00",
  "client-order-id": "<optional 32 chars>",
  "source": "spot-api"
}
```

- `buy-limit` / `sell-limit`：限价单，必须带 `price`
- `buy-market` / `sell-market`：市价单。**买入** `amount` = USDT 金额；**卖出** `amount` = 币种数量
- `buy-ioc` / `sell-ioc`：立即成交剩余撤单
- `buy-limit-fok` / `sell-limit-fok`：全成或全撤

## Workflow patterns

### 限价买单

```bash
htx-cli spot trading place \
  --account-id <id> \
  --symbol btcusdt --type buy-limit \
  --price 65000 --amount 0.001 \
  --json
```

### 市价买入 100 USDT 的 BTC

```bash
# market 买单 amount = 报价币(USDT) 数量
htx-cli spot trading place \
  --account-id <id> \
  --symbol btcusdt --type buy-market \
  --amount 100 \
  --json
```

### 撤单

```bash
htx-cli spot trading cancel <order-id> --json
```

### 撤掉所有 BTC/USDT 挂单

```bash
htx-cli spot call /v1/order/orders/batchCancelOpenOrders \
  --method POST --auth \
  --body '{"account-id":"<id>","symbol":"btcusdt"}' --json
```

### 查询当前挂单

```bash
htx-cli spot trading open-orders --symbol btcusdt --json
```

## 安全约束（必读）

每次下单前，AI Agent **必须**：

1. 显示完整订单：交易对、方向（买/卖）、类型（限价/市价）、数量、限价、预估成交金额、当前盘口价（参照）
2. 等待用户明确确认（"确认 / yes / 下单" 等）
3. 仅在收到确认后才调用 API

每次撤单：
- 单笔撤单：显示订单 ID + 剩余数量 + 价格
- 批量撤单：显示影响订单数量 + 涉及交易对

每次借贷：
- 显示币种、金额、当前利率、潜在风险
- 强烈建议先查现货账户余额确认借贷必要性

## 错误处理

- `account-frozen` — 账户被冻结，停止操作
- `order-amountmin-error` — 数量低于最小下单量，参考 `htx-cli spot-market symbols` 查 `min-order-amt`
- `order-pricemin-error` — 价格精度错误，参考 `price-precision`
- 部分错误是限频导致：每秒最多 10 次下单，失败时退避 1 秒重试

## 安装

```bash
npx -y github:sheerl/htx-skills-hub skill install spot-trading
```

## 相关文档

- HTX 现货交易 API: https://huobiapi.github.io/docs/spot/v1/cn/#orders
