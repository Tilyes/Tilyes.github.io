/* =============================================================
 *  只改这一个文件，整站内容就换成你的了
 * ============================================================= */

const SITE = {
  /* ---------- 基本信息 ---------- */
  username: 'Tilyes',
  name: 'Jum',
  nameEn: 'Jum',
  avatar: '',                       // 留空 = 自动用 GitHub 头像
  tagline: '结构工程 · 参数化建模 · 有限元可视化',
  location: '',                     // 想显示城市就填，例如 '中国 · 上海'
  status: '开放新机会中',
  statusOpen: false,                // 改成 true 就会在首页显示上面那句状态

  /* ---------- 关于我 ---------- */
  about: [
    '我是雷浚（Jum），华南理工大学土木与交通学院结构工程专业博士研究生，本科与硕士也都读在这里。研究方向是结构与构件的冲击动力学：装配式混凝土柱在水平冲击下的动力失效机理与加固方法，此前还做过广府古建木结构的抗震性能。日常的构成大致是试验、有限元建模，以及大量的数据处理。',
    '我特别感兴趣的一件事，是把机器学习用到结构工程里。做过的工作包括：用图神经网络结合 Transformer 预测钢筋混凝土构件的冲击力时程响应；用 GRU 从公开试验数据中预测柱的滞回曲线；用 U-Net 做混凝土裂缝的像素级分割。熟悉 RNN、CNN、Transformer 等网络结构，日常用 PyTorch 与 TensorFlow，也在用 LangChain、Dify 搭一些小的智能体应用。',
    '工程侧的工具箱是 LS-DYNA、ABAQUS、ANSYS、OpenSees、SAP2000 与 PKPM，语言上主要用 Python 和 C++，也写一点 JavaScript。有个改不掉的习惯：看到两处代码在重复算同一件事，就想把它们合并成一处——因为这种重复不会报错，只会在某天悄悄给出一个对不上的结果。'
  ],

  /* ---------- 技能栈 ---------- */
  skills: [
    { group: '编程', items: ['Python', 'C++20', 'LaTeX', 'Git'] },
    { group: '工程分析', items: ['OpenSees', 'Abaqus', 'SAP2000', '有限元分析'] },
    { group: '图形 / 工具链', items: ['Vulkan', 'ImGui', 'CMake', 'vcpkg', 'GLSL'] },
    { group: '研究方向', items: ['空间结构', '短程线网壳', '参数化建模'] }
  ],

  /* ---------- 项目作品集 ---------- */
  projects: [
    {
      name: 'Geodesic-Shell-Parametric-Modeling',
      desc: '短程线网壳参数化建模脚本。按正二十面体五重对称做 Class I 弦分法生成球面杆系，自动搜索最优分角让杆长尽可能均匀，再导出 Abaqus / SAP2000 模型。重构后几何只算一遍，两个下游共用，450 行压到 280 行。',
      url: 'https://github.com/Tilyes/Geodesic-Shell-Parametric-Modeling',
      tags: ['Python', '空间结构', '参数化建模'],
      highlight: true
    },
    {
      name: 'OpenSees-GPU-Solver',
      desc: '在 OpenSees 有限元框架之上接入自研的 cuSPARSE GPU 迭代求解器：CG / BiCGStab 迭代 + Jacobi / ILU(0) 预条件，SpMV 走 cuSPARSE generic API。三个 3D 场景相较串行 SuperLU 最高加速 212×，并定位了 sm_120 平台上两个损坏的官方 API。上游 OpenSees 版权属 UC Regents，本仓库为研究用途。',
      url: 'https://github.com/Tilyes/OpenSees-GPU-Solver',
      tags: ['CUDA', 'OpenSees', '高性能计算'],
      highlight: false
    },
    {
      name: 'OpenSees_viewer',
      desc: '基于 C++20 + Vulkan 的 OpenSees 有限元模型 3D 可视化工具。自己做 TCL 模型解析、离屏渲染到 ImGui 视口、轨道相机，目前支持杆系结构与节点的显示，应力云图和时间步动画在路上。',
      url: 'https://github.com/Tilyes/OpenSees_viewer',
      tags: ['C++20', 'Vulkan', 'OpenSees'],
      highlight: false
    },
    {
      name: 'Tilyes.github.io',
      desc: '你现在看的这个站点。零依赖纯静态，不引构建工具，Markdown 渲染器是自己写的，十年后打开还能跑。',
      url: 'https://github.com/Tilyes/Tilyes.github.io',
      tags: ['HTML/CSS', 'JavaScript'],
      highlight: false
    }
  ],

  /* ---------- 论文与专利 ---------- */
  pubSummary: 'SCI 5 篇（一作 1 篇）· EI 3 篇 · 中文核心 1 篇　｜　实用新型专利授权 1 项 · 发明专利申请 1 项',
  pubShow: 3,                        // 首页默认展示几条，其余的收在「展开全部」里
  publications: [
    {
      title: 'Predicting impact response of reinforced concrete members using an AEGCN-dynamicformer network',
      authors: 'Lei J, Chen Q, Liu X, Gao W, Li M, Wang Y, et al.',
      venue: 'Structures, 2026, 85: 111253',
      badges: ['一作', 'SCI', 'JCR Q1', '中科院 2 区'],
      lead: true
    },
    {
      title: 'Dynamic performance of precast concrete columns with pressed sleeve connections under horizontal impact loads',
      authors: 'Chen Q, Lei J, Wang Y, et al.',
      venue: 'Engineering Structures, 2026, 346: 121707',
      badges: ['导师一作', 'SCI', 'JCR Q1', '中科院 1 区']
    },
    {
      title: 'Study on Dynamic Behavior of Precast Concrete Columns with Pressed Sleeve Connections Under Impact Loading',
      authors: 'Lei J, Chen Q, Yao M, et al.',
      venue: 'Springer Nature Switzerland, Cham, 2025（会议论文）',
      badges: ['一作', 'EI', '会议'],
      lead: true
    },
    {
      title: 'Experimental study on seismic performance of spatial and planar hoop-head mortise and tenon timber joints in historical architecture',
      authors: 'Chen Q, Lei J, Bradford M A, et al.',
      venue: 'Construction and Building Materials, 2024, 438: 136989',
      badges: ['导师一作', 'SCI', 'JCR Q1', '中科院 1 区']
    },
    {
      title: '增设角部阻尼器箍头榫木节点的抗震性能',
      authors: '陈庆军, 雷浚, 李冰州, 等',
      venue: '华南理工大学学报（自然科学版）, 2024, 52(7): 119-134',
      badges: ['导师一作', 'EI']
    },
    {
      title: 'Behaviour of reinforced concrete beams utilising waste marble powder subjected to impact loads',
      authors: 'Wang Y, Chen Q, Liu X, Lei J, et al.',
      venue: 'Construction and Building Materials, 2025, 472: 140969',
      badges: ['SCI', 'JCR Q1', '中科院 1 区']
    },
    {
      title: 'Dynamic response and sectional forces of reinforced concrete frames subjected to impact loads',
      authors: 'Wang Y, Huang X, Chen Q, Liu X, Lei J.',
      venue: 'Engineering Structures, 2026, 352: 122160',
      badges: ['SCI', 'JCR Q1', '中科院 1 区']
    },
    {
      title: '装配式构件新旧混凝土界面动态性能分析',
      authors: '陈庆军, 张雨圻, 雷浚, 等',
      venue: '华南理工大学学报（自然科学版）, 2025(10): 60-73',
      badges: ['EI']
    },
    {
      title: 'CFRP 布加固广府古建木结构残损箍头榫节点抗震性能研究',
      authors: '陈庆军, 张雨圻, 雷浚, 等',
      venue: '西安建筑科技大学学报（自然科学版）, 2024, 56(05): 642-649',
      badges: ['中文核心']
    },
    {
      title: '基于 AEGCN-Dynamiformer 的冲击力时程响应预测方法、系统、存储介质及计算机设备',
      authors: '雷浚, 陈庆军, 张雨圻, 李名铠, 蔡健',
      venue: '发明专利',
      badges: ['第一发明人', '申请'],
      lead: true
    },
    {
      title: '一种预张拉钢绞线充气膜结构',
      authors: '陈庆军, 雷浚, 李晨慧, 等',
      venue: '实用新型专利',
      badges: ['已授权']
    }
  ],

  /* ---------- 联系方式与社交链接 ---------- */
  email: 'leijun0601@foxmail.com',
  social: [
    { label: 'GitHub', url: 'https://github.com/Tilyes' }
    // 想加别的就照格式补：{ label: '掘金', url: 'https://juejin.cn/user/xxx' }
  ],

  /* ---------- 其他 ---------- */
  footer: '基于 GitHub Pages 搭建 · 内容均为原创',
  since: 2026
};
