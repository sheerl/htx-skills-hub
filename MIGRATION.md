# Migration v1 → v2

> v2.0.0 于 2026-05 发布。本文档说明 v2 在结构、命名、CLI 用法上的变化。

## 一句话总结

v1 把所有合约功能塞在一个 `futures-market`（36 endpoints）里，v2 拆成 7 个聚焦的 atomic skills，并新增 4 个 Layer 2 分析引擎。

## 主要变化

### 1. CLI flag 统一

| v1 | v2 |
|----|----|
| `--query key=val&key=val` | `--param key=val` 或 `-p key=val`（可重复） |

```bash
# v1
htx-cli futures call /v1/swap_funding_rate --query "contract_code=BTC-USDT"

# v2
htx-cli futures call /v1/swap_funding_rate -p contract_code=BTC-USDT
```

### 2. Futures market 拆分

v1 的 `futures-market` 包含全部 36 endpoint，过于庞大。v2 拆为：

| v2 skill | endpoint 数 | 关注点 |
|----------|------------|--------|
| `futures-market` | 15 | 通用行情：合约信息 / K线 / 盘口 / 索引 / 系统状态 |
| `funding-rate` | 4 | 资金费率（当前 / 批量 / 历史 / 估算 K线） |
| `oi-tracker` | 2 | Open Interest 快照 + 历史 |
| `elite-positioning` | 2 | 精英多空比（账户 / 持仓口径） |
| `liquidation-stream` | 1 | 强平订单流 |
| `mark-price` | 3 | 标记价 / 溢价指数 / 基差 K线 |
| `settlement` | 4 | 结算价 / 保险基金 |

之前提到过的 `basis-monitor` 在 v2 中已合并到 `mark-price`（共 3 个 endpoint，含 basis）。

### 3. Layer 2 分析引擎（新增）

v2 新增 4 个 Layer 2 skill，组合 L1 atomic skills 输出综合判断：

- `technical-analysis` — 本地计算 12 个经典技术指标（含 `scripts/indicators.py` 纯 Python 实现）
- `derivatives-analyst` — 资金费率 + OI + 多空比 + 清算 + 基差 5 维拥挤度评分（0-100）
- `sentiment-analyst` — 恐惧贪婪指数 + 精英多空比 + 涨跌广度
- `market-overview` — 全市场扫描 + 板块轮动（参考 `references/sectors.md`）

Layer 2 不直接调 HTX API，而是通过 htx-cli 调用 L1 skills 拉数据，再本地组合分析。

### 4. 安全增强

- 所有 L0 写操作 skill（`spot-trading` / `futures-trading` / `spot-account` / `futures-account` 中的转账类接口）SKILL.md 都明确要求 AI Agent **强制人工二次确认**
- API Key 仅在本机使用，不外发

## 升级步骤

```bash
# 卸载 v1
htx-cli skills uninstall htx/futures-market

# 安装 v2
npx -y @htx-skills/futures-market install
npx -y @htx-skills/funding-rate install
npx -y @htx-skills/oi-tracker install
# ... 按需安装其他 skills
```

## 不兼容变化清单

| 项 | v1 | v2 | 影响 |
|---|----|----|------|
| CLI flag | `--query` | `--param` / `-p` | 重写 prompt 模板 |
| `futures-market` skill | 单一 36 endpoint | 拆为 7 skills | 分别安装 |
| `basis-monitor` skill | 独立 1 endpoint | 合并入 `mark-price` | 改安装名 |

## 反馈

发现问题请提 issue: https://github.com/sheerl/htx-skills-hub/issues
