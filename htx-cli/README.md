# @sheerl/htx-cli

> HTX exchange CLI for AI agents — wraps HTX REST API into a clean command interface for use with Claude Code, Cursor, etc.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](../LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)

## Install

No npm publish yet. Install directly from GitHub:

```bash
# One-shot run
npx -y github:sheerl/htx-skills-hub#main htx-cli spot-market timestamp

# Or clone and use
git clone https://github.com/sheerl/htx-skills-hub.git
cd htx-skills-hub/htx-cli
node bin/htx-cli.js spot-market market-detail-merged -p symbol=btcusdt
```

## Phase 3a — implemented (45 public endpoints, 8 skills)

| Skill | Endpoints | Status |
|---|---|---|
| `spot-market` | 13 | ✅ live |
| `futures-market` | 15 | ✅ live |
| `funding-rate` | 4 | ✅ live |
| `oi-tracker` | 2 | ✅ live |
| `elite-positioning` | 2 | ✅ live |
| `liquidation-stream` | 1 | ✅ live |
| `mark-price` | 3 | ✅ live |
| `settlement` | 4 | ✅ live |

All tested against real HTX API on 2026-05-19.

## Phase 3b — TODO (signed/private endpoints)

| Skill | Endpoints | Status |
|---|---|---|
| `spot-account` | 10 | ⏳ HMAC client ready, handlers TBD |
| `spot-trading` | 11 | ⏳ |
| `futures-account` | 30 | ⏳ |
| `futures-trading` | ~50 | ⏳ |

## Quick start

```bash
# Real-time BTC spot price
htx-cli spot-market market-detail-merged -p symbol=btcusdt

# All-market funding rates
htx-cli funding-rate batch

# BTC perpetual 4H kline (200 bars)
htx-cli futures-market kline -p contract_code=BTC-USDT -p period=4hour -p size=200

# Top trader L/S ratio
htx-cli elite-positioning account-ratio -p contract_code=BTC-USDT -p period=60min

# Recent BTC liquidation orders
htx-cli liquidation-stream recent -p contract=BTC-USDT
```

## Skill installer

Install one of the 17 skill bundles to `~/.claude/skills/htx/<name>/`:

```bash
htx-cli skill list                      # all 17 names
htx-cli skill install spot-market       # single
htx-cli skill install all               # all 17
```

After install, your AI agent (Claude Code etc.) will pick up the SKILL.md automatically.

## Configuration

For private endpoints (account/trading — Phase 3b):

```bash
export HTX_ACCESS_KEY="your-access-key"
export HTX_SECRET_KEY="your-secret-key"
```

Network host overrides (default: `api.huobi.pro` / `api.hbdm.vn`):

```bash
export HTX_HOST_SPOT="api.huobi.pro"
export HTX_HOST_FUTURES="api.hbdm.vn"   # or api.hbdm.com depending on region
```

## Architecture

```
htx-cli/
├── bin/htx-cli.js      # entry, arg parsing, dispatch
├── src/
│   ├── client/
│   │   └── http.js     # fetch wrapper + HMAC-SHA256 signer
│   ├── commands/
│   │   ├── spot-market.js
│   │   ├── futures-market.js
│   │   ├── funding-rate.js
│   │   └── derivatives.js  # oi/elite/liq/mark/settlement
│   └── installer.js    # skill installer
└── skills/htx/         # 17 skill bundles (SKILL.md + scripts)
```

Zero external dependencies. Uses Node 18+ built-in `fetch` and `crypto`.

## License

MIT
