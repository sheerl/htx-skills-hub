# K线形态识别（12 个）

```bash
python scripts/patterns.py <name> --kline kline.json [--list]
python scripts/patterns.py scan --kline kline.json   # 扫描全部，返回最新匹配
```

返回 `{"match": true|false, "ts": ...}` 或 scan 模式 `{"patterns": ["doji", "bull-engulf"], "ts": ...}`。

## 12 种形态

### 反转类

| 名称 | 信号 | 判定 |
|---|---|---|
| `doji` | 中性 / 反转征兆 | 实体 < 影线 10% |
| `hanging-man` | 顶部反转 | 上涨末端，小实体 + 长下影 |
| `inverted-hammer` | 底部反转 | 下跌末端，小实体 + 长上影 |
| `shooting-star` | 顶部反转 | 上涨末端，小实体 + 长上影 |
| `bull-engulf` | 看涨吞没 | 长阳完全吞没前一根阴 |
| `bear-engulf` | 看跌吞没 | 长阴完全吞没前一根阳 |

### 孕线类

| 名称 | 信号 | 判定 |
|---|---|---|
| `bull-harami` | 看涨孕线 | 大阴后小阳完全包含其中 |
| `bear-harami` | 看跌孕线 | 大阳后小阴完全包含其中 |
| `bull-harami-cross` | 加强看涨 | bull-harami 且小阳为 doji |
| `bear-harami-cross` | 加强看跌 | bear-harami 且小阴为 doji |

### 持续类

| 名称 | 信号 | 判定 |
|---|---|---|
| `three-soldiers` | 强势看涨 | 连续 3 根阳，每根收于前一根之上，小上影 |
| `three-crows` | 强势看跌 | 连续 3 根阴，每根收于前一根之下，小下影 |

## 使用建议

- **形态 ≠ 信号**：单独形态不可作为交易信号，必须配合上下文（趋势 / 关键位 / 成交量）
- **多周期确认**：1H 出现 bull-engulf，先看 4H 趋势是否一致
- **位置至关重要**：在支撑位 / 历史底部 + bull-engulf > 横盘中部 + bull-engulf
- **结合背离**：形态 + RSI 看涨背离 = 高概率反转

## 与 ta-master 集成

ta-master 在「价量评分支柱」中累计形态匹配数：
- 看涨形态匹配 +4 分/个
- 看跌形态匹配 -4 分/个
