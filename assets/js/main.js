/* =============================================================
 *  首页 / 博客列表渲染 + 主题切换
 * ============================================================= */
(function () {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => miniMarkdown.escapeHtml(String(s == null ? '' : s));

  /* ---------- 主题 ---------- */
  const THEME_KEY = 'site-theme';
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    const btn = $('theme-toggle');
    if (btn) btn.textContent = t === 'light' ? '🌙' : '☀';
  }
  const saved = localStorage.getItem(THEME_KEY);
  applyTheme(saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
  const btn = $('theme-toggle');
  if (btn) {
    btn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'light' ? 'dark' : 'light';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  /* ---------- 页面标题 ---------- */
  const page = document.body.getAttribute('data-page');
  if (page === 'home') document.title = SITE.name + ' · ' + SITE.tagline;
  else if (page === 'blog') document.title = '博客 · ' + SITE.name;

  /* ---------- 头像 ---------- */
  const avatarUrl = SITE.avatar || 'https://github.com/' + SITE.username + '.png?size=200';

  /* ---------- 导航 ---------- */
  if ($('nav-brand')) $('nav-brand').textContent = SITE.nameEn || SITE.name;
  const gh = $('nav-github');
  if (gh) gh.href = 'https://github.com/' + SITE.username;

  /* ---------- Hero ---------- */
  const hero = $('hero');
  if (hero) {
    hero.innerHTML = `
      <div class="hero-top">
        <img class="avatar" src="${esc(avatarUrl)}" alt="${esc(SITE.name)}">
        <div>
          <h1>${esc(SITE.name)}</h1>
          <p class="hero-sub">${esc(SITE.tagline)}</p>
          <div class="hero-meta">
            <span>${esc(SITE.location)}</span>
            ${SITE.statusOpen && SITE.status ? `<span class="status-dot">${esc(SITE.status)}</span>` : ''}
          </div>
        </div>
      </div>
      <div class="hero-actions">
        <a class="btn primary" href="mailto:${esc(SITE.email)}">发邮件给我</a>
        <a class="btn" href="blog.html">读我的博客</a>
      </div>`;
  }

  /* ---------- 关于我 ---------- */
  const about = $('about-body');
  if (about) {
    about.innerHTML = SITE.about.map((p) => `<p>${esc(p)}</p>`).join('');
  }

  /* ---------- 技能 ---------- */
  const skills = $('skills-body');
  if (skills) {
    skills.innerHTML = SITE.skills
      .map(
        (g) => `<div class="skill-group">
          <span class="sg-name">${esc(g.group)}</span>
          <div class="skill-items">${g.items.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
        </div>`
      )
      .join('');
  }

  /* ---------- 项目 ---------- */
  const projects = $('projects-body');
  if (projects) {
    projects.innerHTML = SITE.projects
      .map(
        (p) => `<a class="card ${p.highlight ? 'highlight' : ''}" href="${esc(p.url)}" target="_blank" rel="noopener">
          <span class="card-title">${esc(p.name)} <span class="arrow">↗</span></span>
          <p class="card-desc">${esc(p.desc)}</p>
          <div class="card-tags">${(p.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
        </a>`
      )
      .join('');
  }

  /* ---------- 联系方式 ---------- */
  const contact = $('contact-body');
  if (contact) {
    const links = SITE.social.filter((s) => s.url);
    contact.innerHTML = `
      <p style="margin:0 0 6px">想聊聊技术、合作或者只是打个招呼，邮件是最快的方式。</p>
      <a class="btn primary" href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>
      <div class="social-grid">
        ${links.map((s) => `<a class="btn" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)} ↗</a>`).join('')}
      </div>`;
  }

  /* ---------- 文章列表 ---------- */
  function postItemHtml(p) {
    return `<a class="post-item" href="post.html?p=${encodeURIComponent(p.slug)}">
      <span class="post-date">${esc(p.date)}</span>
      <span>
        <span class="post-title">${esc(p.title)}</span>
        ${p.summary ? `<span class="post-sum" style="display:block">${esc(p.summary)}</span>` : ''}
      </span>
    </a>`;
  }

  async function loadPosts() {
    try {
      const res = await fetch('posts/index.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('bad status');
      const data = await res.json();
      return (data.posts || []).slice().sort((a, b) => (a.date < b.date ? 1 : -1));
    } catch (e) {
      return [];
    }
  }

  (async () => {
    const posts = await loadPosts();

    const latest = $('latest-posts');
    if (latest) {
      latest.innerHTML = posts.length
        ? `<div class="post-list">${posts.slice(0, 3).map(postItemHtml).join('')}</div>
           <p style="margin-top:18px"><a href="blog.html">查看全部 ${posts.length} 篇 →</a></p>`
        : '<p style="color:var(--text-dim)">还没有文章，往 posts/ 里加一个 .md 并在 posts/index.json 里登记就行。</p>';
    }

    const all = $('all-posts');
    if (all) {
      all.innerHTML = posts.length
        ? `<div class="post-list">${posts.map(postItemHtml).join('')}</div>`
        : '<p style="color:var(--text-dim)">还没有文章，往 posts/ 里加一个 .md 并在 posts/index.json 里登记就行。</p>';
    }
  })();

  /* ---------- 页脚 ---------- */
  const foot = $('footer-text');
  if (foot) {
    const year = new Date().getFullYear();
    const span = year > SITE.since ? SITE.since + '–' + year : String(year);
    foot.textContent = `© ${span} ${SITE.name} · ${SITE.footer}`;
  }
  const footGh = $('footer-github');
  if (footGh) footGh.href = 'https://github.com/' + SITE.username;
})();
