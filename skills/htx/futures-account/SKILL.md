---
name: htx/futures-account
version: 2.0.0
description: HTX USDT-M 永续合约账户 — 余额 / 持仓 / 杠杆档位 / 调整因子 / 统一账户类型切换
auth: true
risk: medium
---

# Futures Account — 合约账户

查询 USDT-M 永续合约账户与持仓，包含杠杆档位、调整因子、统一账户切换等参考数据。Read permission is enough for 26 of 30 endpoints. Transfers (4) need write.

## Endpoint catalog (30)

All paths in this skill have base `/linear-swap-api` unless noted. "Mode" column: `I` = isolated, `C` = cross, `*` = either.

### Account & position query — read (8)

| # | Method | Path | CLI invocation | Mode |
|---|--------|------|----------------|------|
| 1 | POST | `/v1/swap_account_info` | `htx-cli futures call /v1/swap_account_info --auth -p contract_code=BTC-USDT` | I |
| 2 | POST | `/v1/swap_cross_account_info` | `htx-cli futures call /v1/swap_cross_account_info --auth -p margin_account=USDT` | C |
| 3 | POST | `/v1/swap_position_info` | `htx-cli futures call /v1/swap_position_info --auth -p contract_code=BTC-USDT` | I |
| 4 | POST | `/v1/swap_cross_position_info` | `htx-cli futures call /v1/swap_cross_position_info --auth -p contract_code=BTC-USDT` | C |
| 5 | POST | `/v1/swap_account_position_info` | `htx-cli futures call /v1/swap_account_position_info --auth` | I |
| 6 | POST | `/v1/swap_cross_account_position_info` | `htx-cli futures call /v1/swap_cross_account_position_info --auth` | C |
| 7 | POST | `/v1/swap_position_limit` | `htx-cli futures call /v1/swap_position_limit --auth` | I |
| 8 | POST | `/v1/swap_cross_position_limit` | `htx-cli futures call /v1/swap_cross_position_limit --auth` | C |

### Tier-margin & risk — read (6)

| # | Method | Path | CLI invocation | Mode |
|---|--------|------|----------------|------|
| 9 | GET | `/v1/swap_adjustfactor` | `htx-cli futures call /v1/swap_adjustfactor --method GET -p contract_code=BTC-USDT` | I |
| 10 | GET | `/v1/swap_cross_adjustfactor` | `htx-cli futures call /v1/swap_cross_adjustfactor --method GET -p contract_code=BTC-USDT` | C |
| 11 | GET | `/v1/swap_ladder_margin` | `htx-cli futures call /v1/swap_ladder_margin --method GET -p contract_code=BTC-USDT` | I |
| 12 | GET | `/v1/swap_cross_ladder_margin` | `htx-cli futures call /v1/swap_cross_ladder_margin --method GET -p margin_account=USDT` | C |
| 13 | POST | `/v1/swap_available_level_rate` | `htx-cli futures call /v1/swap_available_level_rate --auth -p contract_code=BTC-USDT` | * |
| 14 | POST | `/v1/swap_user_settlement_records` | `htx-cli futures call /v1/swap_user_settlement_records --auth` | * |

### Financial records — read (8)

| # | Method | Path | CLI invocation |
|---|--------|------|----------------|
| 15 | POST | `/v1/swap_financial_record` | `htx-cli futures call /v1/swap_financial_record --auth -p mar_acct=BTC-USDT` |
| 16 | POST | `/v1/swap_financial_record_exact` | `htx-cli futures call /v1/swap_financial_record_exact --auth -p contract=BTC-USDT` |
| 17 | POST | `/v3/swap_financial_record_exact` | `htx-cli futures call /v3/swap_financial_record_exact --auth -p contract=BTC-USDT` |
| 18 | POST | `/v1/swap_user_fee` | `htx-cli futures call /v1/swap_user_fee --auth -p contract_code=BTC-USDT` |
| 19 | POST | `/v1/swap_funding_record` | `htx-cli futures call /v1/swap_funding_record --auth` |
| 20 | POST | `/v1/swap_api_trading_status` | `htx-cli futures call /v1/swap_api_trading_status --auth` |
| 21 | POST | `/v1/swap_position_mode` | `htx-cli futures call /v1/swap_position_mode --auth -p margin_account=USDT` |
| 22 | POST | `/v1/swap_master_sub_transfer_record` | `htx-cli futures call /v1/swap_master_sub_transfer_record --auth` |

### Unified account toggle — read + write (4)

| # | Method | Path | Description |
|---|--------|------|-------------|
| 23 | POST | `/v3/unified_account_info` | Unified account aggregated info (read) |
| 24 | POST | `/v3/swap_switch_account_type` | Switch account type (single → cross-margin → unified) — write |
| 25 | POST | `/v3/unified_account_switch_status` | Query switch status |
| 26 | POST | `/v3/swap_switch_position_mode` | Switch position mode (one-way ↔ hedge) — write |

### Master ↔ sub transfer — write (4)

| # | Method | Path |
|---|--------|------|
| 27 | POST | `/v1/swap_master_sub_transfer` |
| 28 | POST | `/v1/swap_sub_auth` |
| 29 | POST | `/v1/swap_sub_account_info_list` |
| 30 | POST | `/v1/swap_sub_account_info` |

## Workflow patterns

### 查询全仓账户 + 持仓总览

```bash
htx-cli futures call /v1/swap_cross_account_info --auth -p margin_account=USDT --json
htx-cli futures call /v1/swap_cross_account_position_info --auth --json
```

### 查询逐仓 BTC-USDT 持仓

```bash
htx-cli futures call /v1/swap_position_info --auth -p contract_code=BTC-USDT --json
```

### 查询 BTC-USDT 杠杆档位

```bash
htx-cli futures call /v1/swap_ladder_margin --method GET -p contract_code=BTC-USDT --json
```

## Safety

- 切换账户类型 / 切换仓位模式 / 主子账户划转都是**写操作**。AI Agent 必须先向用户展示当前状态、目标状态，得到明确确认后再执行。
- 切换前需检查无持仓与挂单（系统会校验，但提前告知用户更友好）。

## 安装

```bash
npx -y github:sheerl/htx-skills-hub htx-cli skill install futures-account
```
