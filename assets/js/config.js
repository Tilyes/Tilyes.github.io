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
    '我是 Jum，做结构工程的，方向是空间结构与短程线网壳。日常在 Python 里算几何，再把模型丢进有限元软件里验证结构性能。',
    '最近在写一个 OpenSees 模型的 3D 可视化工具，C++20 + Vulkan，从 Instance 创建、Swapchain 到离屏渲染整条链路自己搭了一遍，界面用 ImGui。',
    '有点强迫症地喜欢把重复代码收拾干净：网壳脚本里「搜索最优系数」和「建模」原本各算一遍几何，现在只算一次，Abaqus 和 SAP2000 两个下游共用同一份拓扑。'
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
