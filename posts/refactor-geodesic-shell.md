# 从 450 行到 280 行：一次网壳建模脚本的重构

短程线网壳（geodesic shell）的参数化建模脚本，我前后改过好几版。第一版能跑，但有两处几乎一样的几何计算——一处用来搜索最优分角，一处用来真正建模。任何几何改动都得同步改两个地方，漏一次就是几个小时的排查。

这次把它彻底拆开了。

## 原来的问题

原脚本 450 行，核心结构是这样：

| 函数 | 行数 | 干什么 |
| --- | --- | --- |
| `xyz_coordinates` | 27 | 把点缩放到球面 |
| `search_best_adc` | 175 | 复制了一遍 `part()` 的坐标计算，只为算杆长方差 |
| `part` | — | 又算一遍同样的几何，然后连成线 |

`search_best_adc` 那 175 行几乎是从建模函数里抄过来的。它们本该产生完全相同的结果，但只要有一处笔误，搜索出来的"最优分角"就和实际建的模型对不上——而且这种错误不会报错，只会静默地给你一个不太均匀的网壳。

## 拆成四层

重构后按职责分成四层，从下往上谁也不认识谁：

```
vec helpers            向量运算原语（纯函数）
    ↓
ShellGeometry          纯几何：节点坐标 + 杆件拓扑，不 import 任何 CAE 库
    ↓
search_best_adjustment 用 ShellGeometry 搜最优系数
    ↓
GeodesicShellPart      把几何结果落地成 Abaqus Part
```

关键约束是第三层只依赖第二层。`ShellGeometry` 里没有一个 `mdb`、没有一个 `abaqus` 字样。

## 三个具体手法

### 1. 几何只算一遍

`search_best_adjustment` 从 175 行变成 14 行：

```python
def search_best_adjustment(f1, f2, span, rise, candidates=None):
    if candidates is None:
        candidates = [i / 100.0 for i in range(-2, 13)]
    best_adj, best_var = 0.0, float('inf')
    for adj in candidates:
        geom = ShellGeometry(f1, f2, span, rise, adj)
        var = _variance(geom.bar_lengths())
        if var < best_var:
            best_var, best_adj = var, adj
    return best_adj
```

因为它不再自己算几何，只是「构造 15 个实例，取杆长方差最小的那个」。

### 2. 用回调注入差异，一份拓扑服务两种用途

这是整个重构里最值的一招。几何类发射杆件时走一个统一的出口：

```python
@staticmethod
def _emit(out, connect_only, connect, a, b):
    if connect_only:
        connect(a, b)        # 建模模式：连成线单元
    else:
        out.append(distance(a, b))   # 搜索模式：只记长度
```

于是搜索时传 `out=lengths`，建模时传一个 `connect=WirePolyLine` 的 lambda。**同一份拓扑代码，两种消费方式**——从根源上保证"优化的杆长"和"最终建出的几何"绝对一致。

Abaqus 和 SAP2000 两个版本也是靠这个派生的，换一个 `AddByCoord` 的 lambda 就行。

### 3. 构造参数而非可变状态

`adjustment` 通过 `__init__` 注入，不作为对象状态被反复重设：

```python
def __init__(self, f1, f2, span, rise, adjustment):
    ...
    self.radius = rise / 2.0 + (span * span / 8.0) / rise
    self.z_angle = math.acos((self.radius - rise) / self.radius)
    base_split = f1 / float(f1 + f2)
    self.z_angle_upper = (base_split + adjustment) * self.z_angle
```

一个实例 = 一组确定的几何。这样"搜索"就退化成了"构造一系列干净的新实例取最优"，不用去操心对象被改脏了。

## 顺手修掉的几个坑

重构时顺手处理了几个一直潜伏的问题：

- **零向量 bug**：原 `xyz_coordinates` 在 `x=y=0` 时角度未定义，靠"那条分支从不被触达"苟活。新写法就是把点缩放到半径 r，没有分支可错。
- **`pi` 未定义**：原文件用了 `pi` 却只 `import math`，同样是靠分支不可达在蒙混。
- **Abaqus 内嵌 Python 的生成器不兼容**：`sum()` 传生成器表达式会抛 `TypeError: arg1; found 'generator'`，必须换成列表推导。这个只能踩出来，文档里没有。
- **Python 2 的整型除法隐患**：补上 `from __future__ import division`。

## 结果

| 维度 | 重构前 | 重构后 |
| --- | --- | --- |
| 总行数 | 450 | 280 |
| 几何代码 | 搜索、建模各一份 | 单一来源 |
| `search_best_adc` | 175 行 | 14 行 |
| 依赖 | numpy | 纯 math |
| 命名 | `c1/c2/c3/c4/c00/c21` | `ring_top/ring_bot/seeds/layers` |
| 扩展性 | 绑死 Abaqus | 已派生 SAP2000 版 |

> 教训是：**能不能改对，很大程度上取决于几何算了几遍。**只要有两份，就一定会有对不上的那天。
