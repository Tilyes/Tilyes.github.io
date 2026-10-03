# 用不到 100 行写一个够用的 Markdown 渲染器

博客只需要十来种语法：标题、段落、列表、代码块、链接、引用。为一个个人站点引入 `marked` 或 `markdown-it` 当然可以，但那意味着多一个 CDN 依赖、多一次网络请求。

于是我自己写了一个，放在 `assets/js/markdown.js`，压缩前不到 100 行。

## 思路：逐行状态机

不去写正则大爆炸，而是**一行一行往下读**，遇到什么结构就吃进去一段：

```js
while (i < lines.length) {
  const line = lines[i];

  if (/^```/.test(line.trim())) { /* 一直吃到下一个 ``` */ }
  if (/^(#{1,6})\s/.test(line))  { /* 标题 */ }
  if (/^>\s?/.test(line))        { /* 引用 */ }
  // ...
}
```

这样每种语法的处理是独立的，加一种新语法就是加一个 `if`。

## 三个容易踩的坑

### 1. 先转义，再解析

顺序反了会被 XSS，或者把用户写的 `<div>` 渲染成真标签：

```js
function inline(s) {
  s = escapeHtml(s);                                  // 先转义
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');    // 再生成标签
  // ...
}
```

### 2. 代码块里的内容不能被当 Markdown 解析

```js
const buf = [];
i++;
while (i < lines.length && !/^```/.test(lines[i].trim())) {
  buf.push(escapeHtml(lines[i]));   // 整段当成纯文本
  i++;
}
```

### 3. 段落要吃掉连续的非空行

否则"换行"会被拆成两个 `<p>`：

```js
const buf = [];
while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) {
  buf.push(lines[i]);
  i++;
}
out.push('<p>' + inline(buf.join(' ')) + '</p>');
```

## 效果对比

| 语法 | 支持情况 |
| --- | --- |
| `#` ~ `###` 标题 | 支持 |
| 有序 / 无序列表 | 支持 |
| 围栏代码块 | 支持 |
| 表格 | 支持 |
| 图片、链接、粗斜体 | 支持 |
| 嵌套列表 | 不支持（个人博客用不上） |

> 够用就停手。这是个会被长期维护的小项目，代码越少，五年后越不想重写它。
