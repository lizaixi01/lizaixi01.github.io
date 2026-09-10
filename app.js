const config = window.BLOG_CONFIG;
const posts = window.POSTS;
const githubIcon = `<svg class="github-icon" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.4-5.5-6a4.7 4.7 0 0 1 1.2-3.2c-.1-.3-.5-1.6.1-3.3 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 3 .1 3.3a4.7 4.7 0 0 1 1.2 3.2c0 4.6-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.4c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z"/></svg>`;
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
}[c]));
function safeUrl(value) {
  try { const u = new URL(value); return u.protocol === 'https:' ? u.href : ''; }
  catch { return ''; }
}
let theme;
try { theme = localStorage.getItem('loop-theme'); } catch {}
if (!['light','dark'].includes(theme)) {
  theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
document.documentElement.dataset.theme = theme;
let design = 'anthropic';
const url = (page = 'home', slug = '') => `#/${page}${slug ? '/' + slug : ''}`;
const oldArticles = {
  'goal-driven':'verified-collaboration', 'zero-trust':'verified-collaboration',
  'verifier-eval':'verified-collaboration', 'code-review':'verified-collaboration',
  'environment':'closed-environments', 'tools':'closed-environments',
  'human-loop':'human-in-open-systems', 'structured-state':'human-in-open-systems',
  'formal-worlds':'mathematical-search'
};
function readTime(post) {
  const text = post.sections.map(s => s.title + s.paragraphs.join('') +
    (s.table ? s.table.rows.flat().join('') : '')).join('');
  return Math.max(1, Math.ceil(text.length / 300));
}
function paragraph(text, post) {
  return escapeHtml(text).replace(/\[(\d+)\]/g, (match, number) => {
    const ref = post.references[Number(number) - 1];
    return ref ? `<sup><a class="citation" href="${escapeHtml(safeUrl(ref.url))}" target="_blank" rel="noopener noreferrer" aria-label="来源 ${number}：${escapeHtml(ref.title)}">[${number}]</a></sup>` : match;
  });
}
function card(post) {
  return `<a class="post-card" href="${url('post', post.id)}">
    <div class="card-meta"><span>${post.category}</span><span>约 ${readTime(post)} 分钟</span></div>
    <h2>${post.title}</h2><p>${post.summary}</p>
    <div class="card-bottom"><span>${post.label.split(' / ')[0]}</span><span aria-hidden="true">↗</span></div>
  </a>`;
}
function contactLinks() {
  return `<div class="actions"><button class="solid-link" type="button" data-contact>联系我 <span aria-hidden="true">↗</span></button><a class="outline-link" href="${url('projects')}">了解 Learn-Agent →</a></div>`;
}
function projectRow(repo, index) {
 const target = repo.id === 'Learn-Agent' ? url('case','learn-agent') : safeUrl(repo.url);
 return `<a class="repo-row" href="${target}"${repo.id !== 'Learn-Agent' ? ' target="_blank" rel="noopener noreferrer"' : ''}><span class="row-number">${String(index+1).padStart(2,'0')}</span><div><div class="repo-title"><h3>${escapeHtml(repo.name)}</h3><span class="repo-status">${escapeHtml(repo.status)}</span></div><p>${escapeHtml(repo.description)}</p><span class="repo-tech">${escapeHtml(repo.tech)}</span></div><span class="row-arrow" aria-hidden="true">↗</span></a>`;
}
function essayRow(post) {
 return `<a class="essay-row" href="${url('post',post.id)}"><span class="essay-category">${post.category}</span><h3>${post.title}</h3><span class="essay-time">${readTime(post)} 分钟</span><span class="row-arrow" aria-hidden="true">↗</span></a>`;
}
function home() {
 return `<section class="compact-intro"><img class="small-portrait" src="assets/zaixi.jpg" width="1280" height="1280" alt="Zaixi 在雪山前的旅行照片"><div class="identity"><div class="eyebrow">李在希 / ZAIXI LI</div><h1>Zaixi</h1><p class="identity-meta">成都 <span>·</span> 电子科技大学 <span>·</span> 2029 秋季预计毕业</p><p class="intro-role">寻找 Agent Harness 工程师实习</p></div><button class="contact-pill" type="button" data-contact><span class="status-dot"></span>联系我 <span aria-hidden="true">↗</span></button></section>
 <div class="home-layout"><div class="home-primary"><section class="home-section intro-section"><div class="section-label"><h2>关于我</h2></div><div class="section-content"><p class="intro-text">电子科技大学在读，关注 Agent 的执行流程、上下文管理与可验证交付。通过真实使用中的问题，练习把模型能力变成可靠、顺手的产品。</p><div class="inline-links"><a href="${url('about')}">更多介绍 <span aria-hidden="true">→</span></a><a href="${config.githubUrl}" target="_blank" rel="noopener noreferrer">GitHub ↗</a></div></div></section>
 <section class="home-section"><div class="section-label"><h2>代表项目</h2></div><div class="section-content"><div class="compact-repos">${config.repositories.slice(0,1).map(projectRow).join('')}<a class="text-link" href="${url('case','learn-agent')}">阅读设计取舍与迭代 →</a></div><a class="more-link" href="${url('projects')}">查看全部 ${config.repositories.length} 个项目 <span aria-hidden="true">→</span></a></div></section>
 <section class="home-section"><div class="section-label"><h2>思考记录</h2></div><div class="section-content">${posts.map(essayRow).join('')}<a class="more-link" href="${url('articles')}">浏览文章目录 <span aria-hidden="true">→</span></a></div></section></div>
 <aside class="home-rail"><section class="rail-block"><span class="eyebrow">实习意向</span><h2>一起做有用的产品。</h2><p>可长期实习 · 随时到岗<br>接受异地线下实习</p><p class="city-list">北京 / 上海 / 杭州<br>深圳 / 成都</p><span class="email-display rail-email" aria-label="邮箱：${config.email}"><svg class="gmail-icon" viewBox="0 0 24 18" aria-hidden="true"><path fill="#4285f4" d="M0 4v12a2 2 0 0 0 2 2h3V7Z"/><path fill="#34a853" d="M19 7v11h3a2 2 0 0 0 2-2V4Z"/><path fill="#ea4335" d="M5 3v4l7 5 7-5V3l-7 5Z"/><path fill="#c5221f" d="M0 4V2a2 2 0 0 1 3-1.7L5 3v4Z"/><path fill="#fbbc04" d="M19 3l2-2.7A2 2 0 0 1 24 2v2l-5 3Z"/></svg><span>${config.email}</span></span></section></aside></div>`;
}
function articles() {
  return `<header class="page-intro"><div class="eyebrow">INDEX / ${posts.length} ESSAYS</div>
    <h1>思考记录</h1><p>从个人项目与学习中提出问题，记录当前判断和待验证的假设。企业环境中的协作、成本与运行约束，还需要在真实实践中检验。</p></header>
    <div class="filters" aria-label="文章分类">${['全部', ...new Set(posts.map(p => p.category))].map((c,i) =>
      `<button data-filter="${c}" aria-pressed="${i === 0}">${c}</button>`).join('')}</div>
    <p class="result-count" aria-live="polite">共 ${posts.length} 篇文章</p>
    <div class="post-grid" id="results">${posts.map(card).join('')}</div>`;
}
function tableView(table) {
  return `<div class="table-wrap" role="region" aria-label="领域比较表，可横向滚动" tabindex="0"><table>
    <thead><tr>${table.headers.map(h => `<th scope="col">${escapeHtml(h)}</th>`).join('')}</tr></thead>
    <tbody>${table.rows.map(row => `<tr>${row.map((cell,i) => i === 0 ?
      `<th scope="row">${escapeHtml(cell)}</th>` : `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></div>`;
}
function article(slug) {
  const post = posts.find(p => p.id === slug);
  if (!post) return `<section class="page-intro"><div class="eyebrow">ARCHIVE</div>
    <h1>${slug === 'learning' ? '这篇随笔已撤下。' : '没有找到这篇文章。'}</h1>
    <p>${slug === 'learning' ? '尚未充分展开的内容暂不收录。' : '请从文章列表继续阅读。'}</p>
    <a class="text-link" href="${url('articles')}">浏览现有文章 →</a></section>`;
  const next = posts[(posts.indexOf(post) + 1) % posts.length];
  return `<div class="article-layout"><article class="article">
    <a class="back" href="${url('articles')}">← 全部文章</a>
    <header><div class="eyebrow">${post.label}</div><h1>${post.title}</h1><p class="dek">${post.summary}</p>
      <div class="article-meta"><span>${post.category}</span><span>约 ${readTime(post)} 分钟</span><span>修订于 ${post.updated || '2026.09.09'}</span></div></header>
    <p class="thesis">${post.thesis}</p>
    <nav class="mobile-toc" aria-label="本文目录"><details><summary>本文目录 · ${post.sections.length} 节</summary>${toc(post)}</details></nav>
    <div class="article-body">${post.sections.map((s,i) => `<section id="section-${i}">
      <h2 tabindex="-1">${s.title}</h2>${s.paragraphs.map(p => `<p>${paragraph(p,post)}</p>`).join('')}
      ${s.table ? tableView(s.table) : ''}${s.callout ? `<aside class="callout">${escapeHtml(s.callout)}</aside>` : ''}
    </section>`).join('')}</div>
    ${post.references.length ? `<section class="references"><h2>参考资料</h2><ol>${post.references.map(r =>
      `<li><a href="${escapeHtml(safeUrl(r.url))}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.title)} ↗</a></li>`).join('')}</ol></section>` : ''}
    <a class="next-post" href="${url('post',next.id)}"><small>继续阅读</small><strong>${next.title} →</strong></a>
    </article><nav class="toc" aria-label="本文目录"><span class="eyebrow">IN THIS ESSAY</span>${toc(post)}</nav></div>`;
}
function toc(post) {
  return post.sections.map((s,i) => `<button data-section="section-${i}"><span>${String(i + 1).padStart(2,'0')}</span>${s.title}</button>`).join('');
}
function about() {
  return `<header class="page-intro"><div class="eyebrow">ABOUT / ZAIXI</div><h1>李在希 <span class="muted">Zaixi Li</span></h1><p>从真实问题出发，构建主动、可检查的 Agent 产品。</p></header><div class="about-layout"><div class="prose"><h2>你好，我是 Zaixi。</h2><p>我在电子科技大学学习电子信息科学与技术，预计于 2029 年秋季毕业，目前在成都。我正在寻找 Agent Harness 工程师实习机会，希望参与将模型能力转化为可靠产品的工程工作。</p><p>Learn-Agent 是我从自己的编程学习需求出发做的项目。我关注的并不只是回答是否生成，还包括上下文如何进入系统、任务何时执行、失败如何恢复，以及用户能否检查和修正结果。</p><h2>我的产品判断</h2><p>工具应该主动承担整理工作，而不把每一步操作交还给用户。与此同时，知识是否准确、自己是否理解，仍应由学习者判断。自动化与用户控制需要同时存在。</p><h2>我希望参与的工作</h2><p>Agent 执行流程、上下文与记忆管理、后台任务、工具接口，以及围绕真实失败建立的测试与评估。我也在通过文章梳理多 Agent 协作、形式化验证与开放工程的边界。</p><h2>实习与联系</h2><p>可长期实习、随时到岗，接受北京、上海、杭州、深圳、成都的异地线下实习。</p>${contactLinks()}<p class="email-line"><span class="email-display " aria-label="邮箱：${config.email}"><svg class="gmail-icon" viewBox="0 0 24 18" aria-hidden="true"><path fill="#4285f4" d="M0 4v12a2 2 0 0 0 2 2h3V7Z"/><path fill="#34a853" d="M19 7v11h3a2 2 0 0 0 2-2V4Z"/><path fill="#ea4335" d="M5 3v4l7 5 7-5V3l-7 5Z"/><path fill="#c5221f" d="M0 4V2a2 2 0 0 1 3-1.7L5 3v4Z"/><path fill="#fbbc04" d="M19 3l2-2.7A2 2 0 0 1 24 2v2l-5 3Z"/></svg><span>${config.email}</span></span> · <a href="${config.githubUrl}" target="_blank" rel="noopener noreferrer">GitHub ↗</a></p></div><aside class="profile-note"><img class="about-photo" src="assets/zaixi.jpg" width="1280" height="1280" alt="Zaixi 的雪山旅行照片"><h2>Zaixi</h2><dl><dt>教育</dt><dd>电子科技大学</dd><dt>专业</dt><dd>电子信息科学与技术</dd><dt>预计毕业</dt><dd>2029 年秋季</dd><dt>目前所在</dt><dd>成都</dd></dl></aside></div>`;
}
function learnCase() {
 return `<header class="page-intro case-intro"><div class="eyebrow">PROJECT CASE STUDY / LEARN-AGENT</div><h1>让学习继续，<br>让知识留下。</h1><p>一个源于个人编程学习的 VS Code 学习助手。<br>从即时问答到后台知识整理，再到可追溯的学习日志。</p><div class="actions"><a class="solid-link" href="${config.repositories[0].url}" target="_blank" rel="noopener noreferrer">查看 GitHub 源码 ↗</a><span class="email-display outline-link" aria-label="邮箱：${config.email}"><svg class="gmail-icon" viewBox="0 0 24 18" aria-hidden="true"><path fill="#4285f4" d="M0 4v12a2 2 0 0 0 2 2h3V7Z"/><path fill="#34a853" d="M19 7v11h3a2 2 0 0 0 2-2V4Z"/><path fill="#ea4335" d="M5 3v4l7 5 7-5V3l-7 5Z"/><path fill="#c5221f" d="M0 4V2a2 2 0 0 1 3-1.7L5 3v4Z"/><path fill="#fbbc04" d="M19 3l2-2.7A2 2 0 0 1 24 2v2l-5 3Z"/></svg><span>${config.email}</span></span></div></header><figure class="case-figure"><img src="assets/learn-agent.png" width="2880" height="1824" alt="Learn-Agent 实际界面：知识点胶囊选择、折叠例子和理解检查、查看原始问答与代码"><figcaption>实际使用界面 · 按知识点切换，按需展开详细内容。</figcaption></figure><div class="case-body prose"><section><span class="eyebrow">01 / THE PROBLEM</span><h2>提问结束后，不应该再多一道整理任务。</h2><p>在学习编程时，我希望带着代码和上下文直接提问，并自然地留下可以回看的知识。但早期界面仍需要手动点击“整理这条对话”：提问已经完成，工具却又要求我决定是否整理、等待生成，再管理记录。</p><p>这个阻力决定了后来的设计方向：知识整理应当是学习的后台过程。主动性体现在替用户承担可自动完成的工作，而不是增加一个需要被照看的助手。</p></section><section><span class="eyebrow">02 / THE DECISION</span><h2>先展示完整回答，再自动后台整理。</h2><div class="decision-grid"><div><h3>手动整理</h3><p>调用可控，但多一步操作，也容易遗漏。</p></div><div><h3>与回答一同等待</h3><p>结果一次齐全，但整理耗时进入学习等待。</p></div><div class="chosen"><span class="eyebrow">最终选择</span><h3>完整回答后后台整理</h3><p>学习继续，卡片随后出现；由系统处理重试与恢复。</p></div></div><p>完整真实回答结束后，先保留问答，再安排知识卡生成。前台的新对话拥有更高优先级，后台整理等待合适时机。自动标题复用整理请求，减少一次额外调用。</p></section><section><span class="eyebrow">03 / THE HARNESS</span><h2>把生成能力接到可管理的执行流程里。</h2><p>VS Code Webview 负责交互，扩展侧处理模型请求和本地状态。后台整理队列把原始问答转换成结构化知识卡，再同步到学习日志。生成失败时保留原始记录，结合有限重试、退避与重启恢复，避免用户重新承担整理工作。</p><div class="system-flow"><span>提问与上下文</span><b>→</b><span>完整回答与保存</span><b>→</b><span>后台队列</span><b>→</b><span>知识卡与日志</span></div><p>跨会话记忆从当前工作区检索最多三张已确认的相关知识卡；用户修改和删除卡片后，检索结果也随之变化。知识卡保留原始来源，自动化产出仍然可以修正。</p></section><section><span class="eyebrow">04 / THE ITERATION</span><h2>自动出现只是起点，读起来方便同样重要。</h2><p>实际使用中，自动整理确实减少了操作，但有些按钮仍不方便，部分知识卡过长。我把不同知识点拆为胶囊按钮，把例子、理解检查与原始问答做成可折叠内容：先看到核心概念，再按需要展开。</p><p>这是根据个人使用反馈做出的交互迭代。目前没有量化的学习效果实验，因此我将它描述为操作与阅读体验的改进，而不把它等同于学习成效的提升。</p></section><section><span class="eyebrow">05 / EVIDENCE & BOUNDARIES</span><h2>区分工程检查与学习效果。</h2><p>项目 README 记录了 94 项离线工程测试与 12 个合成记忆回归案例。它们为行为回归提供依据，但不代表模型回答质量或实际学习效果已经得到全面评估。这里引用项目文档记录，本站改版没有重新运行项目测试。</p><p>学习者的“懂了”是一种自评，记录确认也不等于掌握。项目保留编辑、删除与来源追溯，尚未把真正的掌握验证、间隔复习或完整记忆压缩包装成已实现的能力。</p><a class="text-link" href="${config.repositories[0].url}#readme" target="_blank" rel="noopener noreferrer">阅读项目说明与实现边界 ↗</a></section><section class="case-end"><h2>我想继续做好的是，能力与体验之间的工程。</h2><p>让模型产生内容只是其中一环。把上下文、执行时机、失败恢复与用户判断组织起来，才是我希望在 Agent Harness 实习中深入的工作。</p>${contactLinks()}</section></div>`;
}
function projects() {
 return `<header class="page-intro"><div class="eyebrow">PROJECTS / OPEN SOURCE</div><h1>从想法，到可检查的实现。</h1><p>Agent 工程原型、个人产品与学习实践。</p></header><section class="project-index">${config.repositories.map((r,i)=>`<article class="project-entry"><div class="project-entry-head"><span class="row-number">${String(i+1).padStart(2,'0')}</span><div><span class="repo-status">${escapeHtml(r.status)}</span><h2>${escapeHtml(r.name)}</h2></div></div><p>${escapeHtml(r.description)}</p><div class="project-focus">${escapeHtml(r.focus)}</div><p class="project-boundary">${escapeHtml(r.boundary)}</p><div class="project-entry-bottom"><span class="repo-tech">${escapeHtml(r.tech)}</span><a href="${safeUrl(r.url)}" target="_blank" rel="noopener noreferrer">${r.id==='PenguinMayhem-Releases'?'发布仓库':'GitHub'} ↗</a>${r.id==='Learn-Agent'?`<a href="${url('case','learn-agent')}">设计案例 →</a>`:''}</div></article>`).join('')}</section><p class="source-note">项目介绍依据公开仓库 README 整理。原型与 Demo 的当前边界见各仓库说明。</p>`;
}
function resolveRoute() {
  const parts = location.hash.replace(/^#\/?/,'').split('/');
  if (['anthropic','joye','openai'].includes(parts[0])) parts.shift();
  design = 'anthropic';
  if (parts[0] === 'a' || parts[0] === 'b') parts.shift();
  document.body.dataset.design = design;
  const page = parts[0] || 'home';
  const slug = ['post','case'].includes(page) ? oldArticles[parts[1]] || parts[1] || '' : '';
  const canonical = url(page,slug);
  if (location.hash !== canonical) history.replaceState(null,'',canonical);
  return {page,slug};
}
function render() {
  const {page,slug} = resolveRoute();
  const nav = [['home','首页'],['articles','文章'],['projects','项目'],['about','关于']];
  const views = {home,articles,about,projects};
  const content = page === 'post' ? article(slug) : page === 'case' && slug === 'learn-agent' ? learnCase() : views[page] ? views[page]() :
    `<section class="page-intro"><h1>页面未找到。</h1><a class="text-link" href="${url()}">回到首页 →</a></section>`;
  document.getElementById('app').innerHTML = `<div class="site-shell"><header class="site-header">
    <a class="brand" href="${url()}">${escapeHtml(config.title)}</a><span class="site-subtitle">Agent Harness / Portfolio</span>
    <nav aria-label="主导航">${nav.map(([id,name]) => `<a href="${url(id)}"${page === id || (page === 'post' && id === 'articles') || (page === 'case' && id === 'projects') ? ' aria-current="page"' : ''}>${name}</a>`).join('')}</nav>
    <a class="github-nav" href="${safeUrl(config.githubUrl) ? escapeHtml(safeUrl(config.githubUrl)) : url('projects')}">GitHub ↗</a>
    <button class="theme-toggle" aria-label="切换至${theme === 'dark' ? '浅' : '深'}色模式">${theme === 'dark' ? '☀ 浅色' : '◐ 深色'}</button>
    </header><main id="main" tabindex="-1">${content}</main>
    <footer><span>© ${new Date().getFullYear()} ${escapeHtml(config.name || config.title)} · 工程与思考</span></footer></div><dialog class="contact-dialog" aria-labelledby="contact-title"><button class="dialog-close" aria-label="关闭联系窗口" autofocus>×</button><h2 id="contact-title">联系 Zaixi</h2><p>微信扫码添加好友</p><img src="assets/wechat.jpg" width="818" height="1215" alt="Zaixi 的微信好友二维码"><span class="email-display email-contact" aria-label="邮箱：${config.email}"><svg class="gmail-icon" viewBox="0 0 24 18" aria-hidden="true"><path fill="#4285f4" d="M0 4v12a2 2 0 0 0 2 2h3V7Z"/><path fill="#34a853" d="M19 7v11h3a2 2 0 0 0 2-2V4Z"/><path fill="#ea4335" d="M5 3v4l7 5 7-5V3l-7 5Z"/><path fill="#c5221f" d="M0 4V2a2 2 0 0 1 3-1.7L5 3v4Z"/><path fill="#fbbc04" d="M19 3l2-2.7A2 2 0 0 1 24 2v2l-5 3Z"/></svg><span>${config.email}</span></span></dialog>`;
  const title = page === 'post' ? posts.find(p => p.id === slug)?.title || '文章归档' :
    {home:'Agent Harness 工程师实习',articles:'文章',about:'关于',projects:'项目',case:'Learn-Agent 设计案例'}[page] || '页面未找到';
  document.title = page === 'home' ? config.title : `${title} · Zaixi`;
  const post = posts.find(p => p.id === slug);
  document.querySelector('meta[name="description"]').content = post?.summary || '关于 Agent 的自治边界、独立验证、开放工程与形式化数学的思考。';
  const contactDialog = document.querySelector('.contact-dialog');
  document.querySelectorAll('[data-contact]').forEach(button => button.onclick = () => contactDialog.showModal());
  document.querySelector('.dialog-close').onclick = () => contactDialog.close();
  contactDialog.onclick = event => { if (event.target === contactDialog) { const r = contactDialog.getBoundingClientRect(); if(event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom) contactDialog.close(); } };
  document.querySelectorAll('a').forEach(link => {
    if (link.href.startsWith('https://github.com/') && link.textContent.includes('GitHub')) {
      link.classList.add('github-link');
      link.insertAdjacentHTML('afterbegin', githubIcon);
    }
  });
  document.querySelector('.theme-toggle').onclick = event => {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('loop-theme',theme); } catch {}
    event.currentTarget.textContent = theme === 'dark' ? '☀ 浅色' : '◐ 深色';
    event.currentTarget.setAttribute('aria-label',`切换至${theme === 'dark' ? '浅' : '深'}色模式`);
  };
  document.querySelectorAll('[data-filter]').forEach(button => button.onclick = () => {
    document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed',String(b === button)));
    const filtered = posts.filter(p => button.dataset.filter === '全部' || p.category === button.dataset.filter);
    document.querySelector('#results').innerHTML = filtered.map(card).join('');
    document.querySelector('.result-count').textContent = `共 ${filtered.length} 篇文章`;
  });
  document.querySelectorAll('[data-section]').forEach(button => button.onclick = () => {
    const section = document.getElementById(button.dataset.section);
    const details = button.closest('details');
    if (details) details.open = false;
    section.querySelector('h2').focus({preventScroll:true});
    section.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
  });
}
document.querySelector('.skip').onclick = event => {
  event.preventDefault(); document.querySelector('main').focus(); document.querySelector('main').scrollIntoView();
};
addEventListener('hashchange',() => {
  const update = () => { render(); scrollTo(0,0); document.querySelector('main').focus({preventScroll:true}); };
  update();
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelector('main').animate([{opacity:.88,transform:'translateY(3px)'},{opacity:1,transform:'translateY(0)'}],{duration:180,easing:'cubic-bezier(.2,.7,.3,1)'});
  }
});
render();
