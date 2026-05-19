---
name: htx/spot-account
version: 2.0.0
description: HTX 现货账户 — 余额 / 持仓 / 资产估值 / 现货 ↔ 合约划转
auth: true
risk: medium
---

# Spot Account — 现货账户

查询现货账户与子账户余额、估值、流水，以及账户间资金划转。

> **鉴权**：所有 endpoint 需要 API Key（read 权限即可，划转需 trade 权限）
> **风险**：read 类无副作用；transfer 类必须二次确认

## 何时使用

- 查询账户列表 / 单账户余额 / 全资产估值
- 现货账户内不同币种间查询
- 现货 ↔ USDT-M / COIN-M 永续合约的资金划转
- 子账户余额查询、子账户间划转

## 快速开始

```bash
# 列出所有账户
htx-cli spot account list

# 查询某账户余额（需先获取 account-id）
htx-cli spot account balance <account-id>

# 全资产 USD 估值
htx-cli spot account valuation
```

## Endpoint 目录（10 个）

### 账户查询 — read (5)

| # | Method | Endpoint | CLI | 描述 |
|---|--------|----------|-----|------|
| 1 | GET | `/v1/account/accounts` | `htx-cli spot account list` | 列出所有账户（spot / margin / otc / point） |
| 2 | GET | `/v1/account/accounts/{id}/balance` | `htx-cli spot account balance <id>` | 单账户币种余额 |
| 3 | GET | `/v2/account/asset-valuation` | `htx-cli spot account valuation` | 全资产折算（USD / BTC） |
| 4 | GET | `/v1/account/history` | `htx-cli spot account history` | 账户流水（最近 7 天） |
| 5 | GET | `/v1/query/deposit-withdraw` | `htx-cli spot account deposit-withdraw` | 充提币记录 |

### 资金划转 — write (5)

| # | Method | Endpoint | CLI invocation | Description |
|---|--------|----------|----------------|-------------|
| 6 | POST | `/v1/account/transfer` | `htx-cli spot call /v1/account/transfer --method POST --auth --body '{"from-account-id":...,"to-account-id":...,"currency":"usdt","amount":"..."}' --json` | Transfer between user's own spot/margin/otc accounts |
| 7 | POST | `/v1/futures/transfer` | `htx-cli spot call /v1/futures/transfer --method POST --auth --body '{"currency":"btc","amount":"...","type":"pro-to-futures"}' --json` | Spot ↔ **COIN-M** (coin-margined delivery) futures transfer ONLY. Does NOT work for USDT-M. |
| 8 | POST | `/v2/account/transfer` | `htx-cli spot call /v2/account/transfer --method POST --auth --body '{"from":"spot","to":"linear-swap","currency":"usdt","amount":"5","margin-account":"USDT"}' --json` | **Spot ↔ USDT-M linear perpetual** / cross-margin / super-margin, etc. Use for any USDT-M futures transfer. |
| 9 | GET | `/v1/point/account` | `htx-cli spot call /v1/point/account --auth --json` | HTX points balance |
| 10 | POST | `/v1/point/transfer` | `htx-cli spot call /v1/point/transfer --method POST --auth --body '{"fromUid":"...","toUid":"...","amount":"..."}' --json` | Transfer points |

> **Important**: For USDT-M perpetual swap (linear perpetual), you MUST use `/v2/account/transfer` with `from`/`to` = `spot` ↔ `linear-swap` and `margin-account` = `USDT` (cross) or `USDT-<symbol>` (isolated, e.g. `USDT-BTC`). The `/v1/futures/transfer` endpoint is reserved for COIN-M delivery contracts and will return `Transfer service is temporarily suspended for USDT account` if misused.

## Workflow patterns

### Show total balance

```bash
htx-cli spot account list --json               # find account id with type=spot
htx-cli spot account balance <id> --json       # detailed per-currency balance
htx-cli spot account valuation --json          # single USD total
```

### Spot → USDT-M futures transfer (most common)

Use `/v2/account/transfer`:

```bash
htx-cli spot call /v2/account/transfer --method POST --auth \
  --body '{"from":"spot","to":"linear-swap","currency":"usdt","amount":"5","margin-account":"USDT"}' --json
```

- `from` / `to`: `spot`, `linear-swap`, `margin`, `super-margin`, etc. Reverse them to transfer back.
- `margin-account`: `USDT` for cross-margin, `USDT-BTC` (etc.) for isolated margin.

### Spot → COIN-M futures transfer

Use `/v1/futures/transfer` with `type` = `pro-to-futures` or `futures-to-pro` (currency is the coin symbol, e.g. `btc`, `eth`).

Before calling any transfer endpoint, **display to the user** source, destination, currency, amount, direction. Only proceed after explicit user confirmation.

## Safety

- All transfers are write operations. AI Agent MUST show the user source / destination / currency / amount before calling, and only proceed after explicit confirmation.
- Wrong-direction transfers can cause margin shortfall or forced liquidation.
- API Key never leaves your machine.

## 安装

```bash
npx -y @sheerl/htx-cli skill install spot-account
```
