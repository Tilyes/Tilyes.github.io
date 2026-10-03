# 给 LS-PrePost 写一套参数化建模脚本

之前做过一个基于 Python 的 ABAQUS 参数化建模项目，改尺寸就是改几个变量、重跑一次脚本。后来课题要换到 LS-DYNA，我没有去碰 APDL，从头到现在一直在 LS-PrePost（下面简称 LSPP）里建模——点着界面建一个预制混凝土柱的冲击模型，网格尺寸想换一换、箍筋间距想调一调，就得从头再点一遍。

于是就有了这篇：能不能在 LSPP 上也做参数化。

## 现成的两条路

### SCL 脚本

在下载 LSPP 安装包时发现官网附带了几个 SCL 示例。丢进 LSPP 里试了一下，读取脚本、自动建模，能跑。

![LSPP 的 Run SCL 窗口：1 唤起窗口，2 读取脚本，3 运行](assets/img/lspp/run-scl.png)

*图 1　SCL 脚本的运行入口：Misc. → Run SCL → Load 选文件 → Run。*

把示例脚本拿去加注释，能看出它主要由三部分组成：脚本头注释、函数定义、函数调用，函数内部还能声明变量。比如官方那个建 25 个壳单元平板的例子：

```c
define:
Float MyExpressFunc(Float tt)
{
   Int numnodes, numelem;
   char p[128];

   strcpy(p,"meshing 4pshell create 5 5 0 0 0 10 0 0 10 10 0 0 10  0");
   ExecuteCommand(p);
   strcpy(p,"meshing 4pshell accept 1 101 501 shell_4p");
   ExecuteCommand(p);

   numnodes = SCLGetDataCenterInt("num_nodes");
   sprintf(p,"No. of nodes in model = %d",numnodes);
   Echo(p);
   return (1.0);
}
MyExpressFunc(1.0);
```

三个 API 基本覆盖了它需要的全部能力：`ExecuteCommand()` 把一条命令串发给 LSPP，`SCLGetDataCenterInt()` 从模型数据库里读一个整数（节点数、单元数、最大 ID 都是这么来的），`Echo()` 往输出窗口打信息。**能声明变量、能循环、能拼字符串**，参数化的口子就在这儿。

### cfile 命令行

第二条路是偶然撞上的。用 GUI 的 Shape Mesher 建网格时会发现，界面上每一步操作都同步出现在下方的滑动窗口里：

![Shape Mesher 的 GUI 操作与下方同步输出的命令行](assets/img/lspp/shape-mesher.png)

*图 2　GUI 操作与命令行是同步的。*

而保存模型时，这个窗口里的内容会一起写进 k 文件同目录下的 `lspost.cfile` 和 `lspost.msg`。于是只要把它另存一份（`lspost.cfile` 每次保存都会被覆盖，得改个名），下次就能靠 `File → Open → Command File` 直接重放：

```
$# LS-PrePost command file created by LS-PrePost(R) 2025 R1
cemptymodel
genselect target node
genselect clear
meshing boxsolid create 0.000000 0.000000 0.000000 100.000000 100.000000 100.000000 10 10 10 0.000000
ac
meshing boxsolid accept 1 1 1 boxsolid
ac
save keyword "temp_model.k"
```

cfile 和 ABAQUS 建模留下的 `.jnl` 是同一种东西——都是 CAE 的 GUI 操作日志，用来记录和重放建模过程。但两者有个明显区别：`.jnl` 可以转成 `.py` 再来做参数化，而 cfile 我到现在还没弄清该怎么在里面定义参数。所以单独用 cfile 建模，仍然只是「把点击录下来重放」，换尺寸还得改文本。

## 那就拼起来

既然 SCL 能定义参数、cfile 不能；而 cfile 里能放大段的关键字、SCL 不行——那为什么不只用 SCL 呢？因为在 SCL 里导入 `*MAT` 这类关键字时，LSPP 会直接卡死。

权衡之后就成了现在的写法：

| 谁 | 管什么 |
| --- | --- |
| SCL 脚本 | 建几何：实体 Part、钢筋 Part，以及后面要用的 `Part_List` / `Node_Set` |
| cfile 脚本 | 配关键字：`MAT` / `SECTION` / `CONTACT` / `CONSTRAINED` / `DATABASE` / `CONTROL` |

先跑 SCL 生成模型，再跑 cfile 把材料截面接触一次性配好。

![cfile 的运行入口：Command File → Open → Start](assets/img/lspp/cfile-run.png)

*图 3　cfile 的运行入口：File → Open → Command File，选中文件后点 Start。*

## 拿预制混凝土柱试一遍

用一个预制混凝土（PC）柱的水平冲击模型来验证：基础 + 后浇带 + 柱 + 落锤小车，柱内配纵筋、套筒段钢筋和箍筋。

### 参数

改尺寸只需要动脚本开头这几行：

| 变量 | 取值 | 含义 |
| --- | --- | --- |
| `h` / `b` / `l` | 250 / 250 / 1500 | 柱截面高、宽、柱长（mm） |
| `basea` / `baseb` / `basel` | 900 / 600 / 400 | 基础的长、宽、高（mm） |
| `linkl` / `linkrl` | 300 / 100 | 后浇带长度、套筒长度（mm） |
| `meshsize` | 12.5 | 实体网格尺寸（mm） |
| `c` / `c2` | 37.5 / 50 | 纵筋到混凝土边缘的距离、常用构造距离（mm） |
| `choopspace` | 75 | 柱箍筋加密区间距（mm） |
| `bhoopaspace` / `bhoopbspace` | 50 / 50 | 基础箍筋两个方向的间距（mm） |
| `numbhoopa` / `numbhoopb` | 11 / 17 | 基础箍筋两个方向的根数 |

### 实体：boxsolid

实体 Part 靠 `meshing boxsolid create` 建，前 6 个参数是包围盒的坐标上下限，后 3 个是三个方向的网格数；再用 `accept` 收下，3 个整数依次是 Part ID、起始单元 ID、起始节点 ID：

```c
sprintf(p, "meshing boxsolid create %d %d %d %d %d 0 %f %f %f 0",
    -basea/2,-baseb/2,-basel,basea/2,baseb/2,
    basea/meshsize,baseb/meshsize,basel/meshsize);
ExecuteCommand(p);
strcpy(p,"meshing boxsolid accept 1 1 1 Foundation");
ExecuteCommand(p);
```

只有第一个 Part 的 ID 是 1。后面每建一个 Part，起始 ID 都得从数据库里现取再加一：

```c
numnodes = SCLGetDataCenterInt("num_nodes");
numelem  = SCLGetDataCenterInt("num_elem");
numelem  = numelem + 1;
numnodes = numnodes + 1;
```

### 钢筋：先画线，再生成梁

钢筋的做法是先用 `line param` 建线，把那几条线选中，再用 `elgenerate beam bycurve` 生成梁单元：

```c
sprintf(p,"line param %d %d %d %d %d %d",
    (h/2-c),(b/2-c), c2,-(h/2-c),(b/2-c), c2);
ExecuteCommand(p);
...
ExecuteCommand("genselect geomobject add geomobject 1e 2 3 4");
sprintf(p,"elgenerate beam bycurve 6 %d 0 1 %f", numelem, meshsize);
ExecuteCommand(p);
ExecuteCommand("elgenerate accept");
```

箍筋沿高度分了几个区段，间距不同，所以代码里是 5 大块。复制靠 `occtransform translate`，前三个数是阵列方向：

```c
sprintf(p,"occtransform translate 0 0 -1 %d copy %d %de %d %d %d",
    choopspace, 14,(numedges+1),(numedges+2),(numedges+3),(numedges+4));
```

### 集合：给 cfile 留好接口

cfile 里要按组指定接触和约束，所以 SCL 里顺手把 Part 集合和节点集合建出来：

```c
ExecuteCommand("setpart");
ExecuteCommand("genselect target part");
ExecuteCommand("genselect clear");
ExecuteCommand("genselect part add part 1/0");
ExecuteCommand("setpart createset 1 1 0 0 0 0");   /* 集合 1 = 基础 + 后浇带 + 柱 */
```

### 出来是这样

![脚本建出的 PC 柱模型，含基础、后浇带、柱、小车与六组钢筋 Part](assets/img/lspp/pc-column-model.png)

*图 4　跑完两个脚本得到的模型：`Assembly 1` 下是 Foundation、CIPC、Column、Truck 四个实体 Part，加上六组钢筋 Part。*

## 踩到的坑

**线的 ID 只能手工数。** 到现在还没找到从数据库索引里取 line ID 的办法，所以阵列后面那几条线的编号只能靠 `numedges = numedges + 4*15` 这样累加推算。改任何一段箍筋的高度或间距，都得把后面的计数重算一遍——这是目前整套脚本里最脆弱的地方。

**材料关键字不能进 SCL，边界条件不能进 cfile。** 前者会让 LSPP 卡死，所以材料、截面、接触只能分手到 cfile；后者同样会卡死，最后 cfile 里的 BOUNDARY 段只能注释掉，运行完再到界面里手动加约束。

**没有做健壮性处理。** 脚本里不校验返回值，也没有错误分支，直接拿来用可能出意外。跑最终 k 文件之前得逐项检查一遍。

代码整理在这里：[LSPP-Parametric-Modeling](https://github.com/Tilyes/LSPP-Parametric-Modeling)，包含 SCL 与 cfile 两份脚本、官方示例改写和参数说明。
