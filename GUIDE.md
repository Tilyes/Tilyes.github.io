# 站点维护说明

日常改动只需要碰 `assets/js/config.js` 一个文件，其余都是骨架。

## 改基本信息

```js
username: 'Tilyes',              // GitHub 用户名，影响头像、导航和页脚链接
name: 'Jum',                     // 页面上显示的名字
tagline: '结构工程 · 参数化建模 · 有限元可视化',
location: '',                    // 想显示城市就填，例如 '中国 · 上海'；留空则不显示
email: 'leijun0601@foxmail.com',
statusOpen: false,               // 改成 true，首页会显示 status 那句「开放新机会中」
```

`avatar` 留空时会自动用 `https://github.com/<username>.png`，换头像只要去 GitHub 改。

## 写「关于我」

`about` 是数组，一段话一个元素，写多少段都行：

```js
about: [
  '第一段：你是谁，主要做什么。',
  '第二段：最近在做什么、对什么感兴趣。'
]
```

## 填项目

```js
projects: [
  {
    name: '项目名',
    desc: '一句话说清它解决什么问题',
    url: 'https://github.com/Tilyes/xxx',
    tags: ['Python', '空间结构'],
    highlight: true      // true 会加一圈描边，用来强调主打项目
  }
]
```

## 加文章

1. 在 `posts/` 下新建 `my-post.md`，用 Markdown 写正文
2. 在 `posts/index.json` 里登记一条：

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

`slug` 必须和文件名一致（不含 `.md`），列表会自动按日期倒序排。

## 本地预览

别直接双击 HTML —— 文章是 fetch 加载的，会被浏览器同源策略拦住。在目录下起个服务：

```bash
python -m http.server 8000
```

然后打开 `http://localhost:8000`。

## 部署

改完推到 `main` 分支，GitHub Pages 一两分钟内自动更新：

```bash
git add .
git commit -m "update"
git push
```

站点地址：<https://jumjumblog.com>（备用：<https://tilyes.github.io>）
