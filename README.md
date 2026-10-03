# Tilyes.github.io

Jum 的个人主页 —— [tilyes.github.io](https://tilyes.github.io)

零依赖纯静态站点，没有构建步骤，也没有 `node_modules`。

## 结构

```
├── index.html          首页：简介 / 技能 / 论文 / 项目 / 最新文章 / 联系方式
├── blog.html           文章列表
├── post.html           文章详情（post.html?p=<slug>）
├── GUIDE.md            这个站怎么改
├── assets/
│   ├── css/style.css       主题变量 + 全部样式（暗色 / 亮色）
│   ├── img/<主题>/         文章配图
│   └── js/
│       ├── config.js       ★ 所有个人信息都在这里
│       ├── markdown.js     自己写的迷你 Markdown 渲染器
│       ├── main.js         首页与列表渲染、主题切换
│       └── post.js         文章页渲染
└── posts/
    ├── index.json      文章索引
    └── *.md            文章正文
```

## 本地预览

文章是运行时 fetch 加载的，直接双击 HTML 会被浏览器的同源策略拦住，需要起一个本地服务：

```bash
python -m http.server 8000
# 打开 http://localhost:8000
```

## 写一篇新文章

1. 在 `posts/` 下新建 `my-post.md`
2. 在 `posts/index.json` 里加一条：

```json
{
  "slug": "my-post",
  "title": "文章标题",
  "date": "2026-10-03",
  "summary": "一句话摘要",
  "tags": ["随笔"],
  "readingTime": "5 分钟"
}
```

列表会按日期自动倒序排列。

## 部署

推送到 `main` 分支即可，GitHub Pages 会自动更新：

```bash
git add .
git commit -m "update"
git push
```
