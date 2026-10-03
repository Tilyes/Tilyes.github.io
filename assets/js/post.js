/* =============================================================
 *  文章详情页：post.html?p=slug
 * ============================================================= */
(async function () {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => miniMarkdown.escapeHtml(String(s == null ? '' : s));
  const slug = new URLSearchParams(location.search).get('p');

  async function fail(msg) {
    $('post-title').textContent = '文章没找到';
    $('post-body').innerHTML = `<p>${esc(msg)}</p><p><a href="blog.html">← 返回文章列表</a></p>`;
  }

  if (!slug) { fail('链接里缺少文章参数，试试从博客列表点进来。'); return; }

  try {
    const metaRes = await fetch('posts/index.json', { cache: 'no-store' });
    const data = await metaRes.json();
    const meta = (data.posts || []).find((p) => p.slug === slug);
    if (!meta) { fail('posts/index.json 里没有登记这篇文章：' + slug); return; }

    const mdRes = await fetch('posts/' + encodeURIComponent(slug) + '.md', { cache: 'no-store' });
    if (!mdRes.ok) { fail('找不到文件 posts/' + slug + '.md'); return; }
    const md = await mdRes.text();

    document.title = meta.title + ' · ' + SITE.name;
    $('post-title').textContent = meta.title;
    $('post-meta').textContent =
      [meta.date, (meta.tags || []).join(' / '), meta.readingTime || ''].filter(Boolean).join('  ·  ');

    /* 知乎链接：单篇文章可在 index.json 里用 zhihu 指定，没填就指向主页 */
    const links = $('post-links');
    if (links) {
      const zhihu = meta.zhihu || SITE.zhihu;
      links.innerHTML = zhihu
        ? `<a class="zhihu-link" href="${esc(zhihu)}" target="_blank" rel="noopener">${
            meta.zhihu ? '在知乎读这篇' : '我的知乎主页'
          } ↗</a>`
        : '';
    }

    $('post-body').innerHTML = miniMarkdown.render(md);
  } catch (e) {
    fail('加载失败：' + e.message + '。如果是直接双击打开的本地文件，需要用一个本地服务器访问。');
  }
})();
