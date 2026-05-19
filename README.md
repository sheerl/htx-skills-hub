# HTX AI Skills

> HTX 面向 AI Agent 生态推出的开放交易协议 —— 一行命令安装，让 AI Agent 通过自然语言查询行情、管理资产、执行现货与合约交易。

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Skills](https://img.shields.io/badge/skills-16-blue.svg)](htx-cli/skills/htx)
[![Demo](https://img.shields.io/badge/demo-live-brightgreen.svg)](https://htx-skills-hub.vercel.app)

## 简介

HTX AI Skills 是 HTX 推出的开放 AI 交易 Skill 市场。开发者可以浏览、安装各类模块化 Skill，扩展 AI 交易助手的能力，覆盖行情查询、交易执行、衍生品分析、风险监控等场景。

- 🚀 一行命令安装到 AI Agent
- 🔒 本地运行 / API Key 不出本机
- ✅ 写操作强制人工二次确认
- 📜 MIT 开源，可审计可定制

## Skills 目录

### 现货
- [`spot-market`](htx-cli/skills/htx/spot-market) — 现货行情
- [`spot-account`](htx-cli/skills/htx/spot-account) — 现货账户
- [`spot-trading`](htx-cli/skills/htx/spot-trading) — 现货交易

### 合约
- [`futures-market`](htx-cli/skills/htx/futures-market) — 合约行情
- [`funding-rate`](htx-cli/skills/htx/funding-rate) — 资金费率
- [`oi-tracker`](htx-cli/skills/htx/oi-tracker) — 持仓量追踪
- [`elite-positioning`](htx-cli/skills/htx/elite-positioning) — 精英多空比
- [`liquidation-stream`](htx-cli/skills/htx/liquidation-stream) — 清算流
- [`mark-price`](htx-cli/skills/htx/mark-price) — 标记价 / 溢价 / 基差
- [`settlement`](htx-cli/skills/htx/settlement) — 结算与保险基金
- [`futures-account`](htx-cli/skills/htx/futures-account) — 合约账户
- [`futures-trading`](htx-cli/skills/htx/futures-trading) — 合约交易

### 分析
- [`technical-analysis`](htx-cli/skills/htx/technical-analysis) — 技术指标分析
- [`derivatives-analyst`](htx-cli/skills/htx/derivatives-analyst) — 衍生品压力分析
- [`sentiment-analyst`](htx-cli/skills/htx/sentiment-analyst) — 市场情绪
- [`market-overview`](htx-cli/skills/htx/market-overview) — 市场总览

## 快速开始

```bash
# 以 spot-market 为例
npx -y @htx-skills/spot-market install
```

安装后，在 AI Agent 中直接用自然语言提问：

> "BTC 现在什么价格？"
> "ETH/USDT 4H K线走势"
> "全市场资金费率扫描"

## Demo 站点

访问 https://htx-skills-hub.vercel.app 浏览所有 16 个 Skill。

## 开发

```bash
git clone https://github.com/sheerl/htx-skills-hub.git
cd htx-skills-hub/website
python3 -m http.server 8000
# 打开 http://localhost:8000
```

## License

MIT — see [LICENSE](LICENSE).
