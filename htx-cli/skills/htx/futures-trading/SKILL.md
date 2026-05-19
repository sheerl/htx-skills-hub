---
name: htx/futures-trading
version: 2.0.0
description: HTX USDT-M 永续合约下单 — 开仓 / 平仓 / 止盈止损 / 计划委托 / 改单 / 撤单
auth: true
risk: high
---

# Futures Trading — 合约交易

USDT-M 永续合约下单、撤单、改单、止盈止损、计划委托、平仓全部操作。

> ⚠️ **极高风险写操作 skill**。永续合约带杠杆，错误下单可造成快速亏损或强平。每次操作前必须人工二次确认。

## 鉴权与权限

- API Key 需 **futures-trade** 权限
- 部分查询接口需 **futures-read** 权限即可

## Endpoint 概览（按功能分组，约 50 个 endpoint）

> 路径基础 `/linear-swap-api`。`cross_` 前缀 = 全仓；无前缀 = 逐仓。

### 1. 下单（Place Order）— 写

| Method | Path | 描述 |
|--------|------|------|
| POST | `/v1/swap_order` | 逐仓单笔下单 |
| POST | `/v1/swap_cross_order` | 全仓单笔下单 |
| POST | `/v1/swap_batchorder` | 逐仓批量下单（最多 10 笔） |
| POST | `/v1/swap_cross_batchorder` | 全仓批量下单 |

### 2. 撤单（Cancel）— 写

| Method | Path | 描述 |
|--------|------|------|
| POST | `/v1/swap_cancel` | 逐仓单笔撤单 |
| POST | `/v1/swap_cross_cancel` | 全仓单笔撤单 |
| POST | `/v1/swap_cancelall` | 逐仓全撤 |
| POST | `/v1/swap_cross_cancelall` | 全仓全撤 |

### 3. 改单（Modify）— 写

| Method | Path |
|--------|------|
| POST | `/v1/swap_switch_lever_rate`（修改杠杆倍数） |
| POST | `/v1/swap_cross_switch_lever_rate` |

### 4. 止盈止损 / 跟踪止损 — 写

| Method | Path | 描述 |
|--------|------|------|
| POST | `/v1/swap_tpsl_order` | 逐仓止盈止损 |
| POST | `/v1/swap_cross_tpsl_order` | 全仓止盈止损 |
| POST | `/v1/swap_tpsl_cancel` | 撤销止盈止损 |
| POST | `/v1/swap_cross_tpsl_cancel` | 撤销全仓止盈止损 |
| POST | `/v1/swap_track_order` | 跟踪止损单 |
| POST | `/v1/swap_cross_track_order` | 全仓跟踪止损 |

### 5. 计划委托（Trigger）— 写

| Method | Path |
|--------|------|
| POST | `/v1/swap_trigger_order` |
| POST | `/v1/swap_cross_trigger_order` |
| POST | `/v1/swap_trigger_cancel` |
| POST | `/v1/swap_cross_trigger_cancel` |
| POST | `/v1/swap_trigger_cancelall` |
| POST | `/v1/swap_cross_trigger_cancelall` |

### 6. 闪电平仓 — 写

| Method | Path | 描述 |
|--------|------|------|
| POST | `/v1/swap_lightning_close_position` | 逐仓闪电平仓 |
| POST | `/v1/swap_cross_lightning_close_position` | 全仓闪电平仓 |

### 7. 订单查询（读）

| Method | Path |
|--------|------|
| POST | `/v1/swap_openorders` (逐仓挂单) |
| POST | `/v1/swap_cross_openorders` (全仓挂单) |
| POST | `/v1/swap_order_info` (单笔详情) |
| POST | `/v1/swap_cross_order_info` |
| POST | `/v1/swap_order_detail` (订单明细) |
| POST | `/v1/swap_cross_order_detail` |
| POST | `/v1/swap_hisorders` (历史订单) |
| POST | `/v1/swap_cross_hisorders` |
| POST | `/v1/swap_matchresults` (成交明细) |
| POST | `/v1/swap_cross_matchresults` |
| POST | `/v1/swap_hisorders_exact` (精确查询) |
| POST | `/v1/swap_cross_hisorders_exact` |
| POST | `/v3/swap_hisorders_exact` |
| POST | `/v3/swap_cross_hisorders_exact` |
| POST | `/v3/swap_matchresults_exact` |
| POST | `/v3/swap_cross_matchresults_exact` |
| POST | `/v1/swap_tpsl_openorders` |
| POST | `/v1/swap_cross_tpsl_openorders` |
| POST | `/v1/swap_tpsl_hisorders` |
| POST | `/v1/swap_cross_tpsl_hisorders` |
| POST | `/v1/swap_relation_tpsl_order` |

## 下单参数（核心）

```json
{
  "contract_code": "BTC-USDT",
  "direction": "buy | sell",
  "offset": "open | close",
  "lever_rate": 10,
  "order_price_type": "limit | post_only | optimal_5 | optimal_10 | optimal_20 | ioc | fok | opponent | lightning",
  "price": "65000",
  "volume": 1,
  "client_order_id": <int64 optional>,
  "tp_trigger_price": "70000",  
  "tp_order_price": "70100",
  "sl_trigger_price": "62000",
  "sl_order_price": "61900"
}
```

- `direction + offset` 组合：
  - `buy + open` = 开多
  - `sell + open` = 开空
  - `buy + close` = 平空
  - `sell + close` = 平多
- `volume` 单位：**张**（`BTC-USDT` 1 张 = 0.001 BTC，需查 `contract_size`）

## Workflow patterns

### 全仓 BTC 永续 10 倍开多 0.1 BTC

```bash
# 1. 先查 contract_size：BTC-USDT = 0.001 BTC/张
htx-cli futures-market contract-info -p contract_code=BTC-USDT
# 0.1 BTC = 100 张

# 2. 下单（开多）
htx-cli futures call /v1/swap_cross_order --auth \
  --body '{
    "contract_code": "BTC-USDT",
    "direction": "buy",
    "offset": "open",
    "lever_rate": 10,
    "order_price_type": "optimal_5",
    "volume": 100
  }' --json
```

### 同时挂止盈 + 止损（全仓）

```bash
htx-cli futures call /v1/swap_cross_tpsl_order --auth \
  --body '{
    "contract_code": "BTC-USDT",
    "direction": "sell",
    "tp_trigger_price": "70000",
    "tp_order_price": "70100",
    "tp_order_price_type": "limit",
    "sl_trigger_price": "62000",
    "sl_order_price": "61900",
    "sl_order_price_type": "limit",
    "volume": 100
  }' --json
```

### 平掉所有 SOL-USDT 持仓

```bash
# 闪电平仓（市价）
htx-cli futures call /v1/swap_cross_lightning_close_position --auth \
  --body '{
    "contract_code": "SOL-USDT",
    "direction": "sell"
  }' --json
```

### 撤掉所有 BTC-USDT 挂单

```bash
htx-cli futures call /v1/swap_cross_cancelall --auth \
  --body '{"contract_code":"BTC-USDT"}' --json
```

## 安全约束（必读）

每次下单前，AI Agent **必须**：

1. 计算并显示：
   - 合约 / 方向 / 杠杆 / 张数 / 标的数量（张 × contract_size）/ 委托价
   - 预估保证金需求
   - 当前标记价 + 与限价的偏离
   - 强平价（如果可计算）
2. 警示风险：杠杆倍数高于 5x 必须明示「高杠杆 = 高强平风险」
3. 显示账户当前可用保证金（调 futures-account）
4. 等待用户明确「确认下单」
5. 仅在确认后执行

每次平仓 / 闪电平仓：
- 显示当前持仓量、成本价、当前盈亏
- 确认是「全平」还是「部分平仓」
- 闪电平仓 = 市价立即成交，无价格保护

每次改杠杆：
- 显示当前杠杆 → 目标杠杆
- 检查持仓 / 挂单是否会被影响
- 提示风险（提高杠杆 = 强平价更近）

## 错误码

- `position-empty` — 无持仓，无法平仓
- `volume-precision-error` — 张数必须为整数
- `lever-rate-too-high` — 超过该合约杠杆档位上限
- `available-margin-insufficient` — 保证金不足，划入更多 USDT 或降低杠杆
- 限频：每秒最多约 30 次下单 / 撤单

## 安装

```bash
npx -y @htx-skills/futures-trading install
```

## 相关文档

- HTX 永续合约 API: https://huobiapi.github.io/docs/usdt_swap/v1/cn/
