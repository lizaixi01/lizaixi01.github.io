interface SearchItem { title: string; description: string; text: string; type: string; url: string }
let searchData: Promise<SearchItem[]> | undefined;
let pageEvents: AbortController | undefined;
let tocObserver: IntersectionObserver | undefined;
let toastTimer: ReturnType<typeof setTimeout>;

function applyTheme() {
  let saved: string | null = null;
  try { saved = localStorage.getItem('loop-theme'); } catch {}
  const theme = saved === 'dark' || saved === 'light' ? saved : matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
  document.querySelector('button[data-theme]')?.setAttribute('aria-label', `切换至${theme === 'dark' ? '浅' : '深'}色模式`);
}
function legacyRoute() {
  if (!location.hash.startsWith('#/')) return;
  const parts = location.hash.slice(2).split('/');
  if (['anthropic','joye','openai','a','b'].includes(parts[0])) parts.shift();
  const aliases: Record<string, string> = { 'goal-driven':'verified-collaboration','zero-trust':'verified-collaboration','verifier-eval':'verified-collaboration','code-review':'verified-collaboration',environment:'closed-environments',tools:'closed-environments','human-loop':'human-in-open-systems','structured-state':'human-in-open-systems','formal-worlds':'mathematical-search' };
  const [page = 'home', id = ''] = parts;
  const paths: Record<string, string> = { home:'/',articles:'/articles/',projects:'/projects/',about:'/about/',links:'/links/',post:`/articles/${aliases[id] || id}/`,case:`/case/${id}/` };
  const target = paths[page];
  if (target) location.replace(target);
}
function init() {
  legacyRoute(); applyTheme();
  pageEvents?.abort(); tocObserver?.disconnect();
  pageEvents = new AbortController();
  const signal = pageEvents.signal;
  const contact = document.querySelector<HTMLDialogElement>('.contact-dialog')!;
  const search = document.querySelector<HTMLDialogElement>('.search-dialog')!;
  const input = document.querySelector<HTMLInputElement>('#site-search')!;
  const resultBox = document.querySelector<HTMLElement>('#search-results')!;
  let lastTrigger: HTMLElement | null = null;
  const show = (dialog: HTMLDialogElement, trigger?: HTMLElement) => { lastTrigger = trigger || document.activeElement as HTMLElement; dialog.showModal(); if(dialog === search) input.focus(); };
  for (const dialog of [contact,search]) {
    dialog.addEventListener('close', () => lastTrigger?.focus(), { signal });
    dialog.addEventListener('click', e => {
      if(e.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if(e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
    }, { signal });
    dialog.querySelector('[data-close]')?.addEventListener('click', () => dialog.close(), { signal });
  }
  document.querySelectorAll<HTMLElement>('[data-contact]').forEach(button => button.addEventListener('click', () => show(contact, button), { signal }));
  document.querySelectorAll<HTMLElement>('[data-search]').forEach(button => button.addEventListener('click', () => show(search, button), { signal }));
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape' && (search.open || contact.open)) { e.preventDefault(); if(search.open) search.close(); if(contact.open) contact.close(); }
    if((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if(!search.open) show(search); }
  }, { signal });
  document.querySelector('button[data-theme]')?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('loop-theme', next); } catch {}
    document.querySelector('button[data-theme]')?.setAttribute('aria-label', `切换至${next === 'dark' ? '浅' : '深'}色模式`);
  }, { signal });
  document.querySelectorAll<HTMLElement>('[data-copy]').forEach(button => button.addEventListener('click', async () => {
    const toast = document.querySelector<HTMLElement>('.toast')!;
    try { await navigator.clipboard.writeText(button.dataset.copy || ''); toast.textContent = '已复制'; }
    catch { toast.textContent = '复制未完成，请选择文字手动复制。'; }
    clearTimeout(toastTimer); toast.classList.add('visible'); toastTimer = setTimeout(() => toast.classList.remove('visible'),2500);
  }, { signal }));
  let queryVersion = 0;
  input.addEventListener('input', async () => {
    const version = ++queryVersion;
    const query = input.value.trim().toLocaleLowerCase();
    if(!query) { resultBox.replaceChildren(Object.assign(document.createElement('p'), {textContent:'输入关键词，查找本站文章与项目。'})); return; }
    searchData ||= fetch('/search.json').then(r => { if(!r.ok) throw new Error('Search unavailable'); return r.json() as Promise<SearchItem[]>; });
    try {
      const data = await searchData;
      if(version !== queryVersion || signal.aborted) return;
      const matches = data.filter(item => `${item.title} ${item.description} ${item.text}`.toLocaleLowerCase().includes(query));
      resultBox.replaceChildren();
      for(const item of matches.slice(0,15)) {
        const link = document.createElement('a'); link.href = item.url;
        const type = document.createElement('small'); type.textContent = item.type;
        const title = document.createElement('strong'); title.textContent = item.title;
        const desc = document.createElement('span'); desc.textContent = item.description;
        link.append(type,title,desc); resultBox.append(link);
      }
      if(!matches.length) resultBox.append(Object.assign(document.createElement('p'),{textContent:'没有找到相关内容，试试其他关键词。'}));
    } catch { searchData = undefined; resultBox.replaceChildren(Object.assign(document.createElement('p'),{textContent:'搜索暂时不可用，请从文章或项目页浏览。'})); }
  }, { signal });
  const articleSearch = document.querySelector<HTMLInputElement>('[data-article-search]');
  let category = '全部';
  const filter = () => {
    let count = 0;
    document.querySelectorAll<HTMLElement>('[data-article]').forEach(row => {
      row.hidden = !(category === '全部' || row.dataset.category === category) || !row.textContent?.toLowerCase().includes(articleSearch?.value.toLowerCase() || '');
      if(!row.hidden) count++;
    });
    const countEl = document.querySelector('[data-result-count]'); if(countEl) countEl.textContent = `共 ${count} 篇文章`;
  };
  articleSearch?.addEventListener('input',filter,{signal});
  document.querySelectorAll<HTMLButtonElement>('[data-category]').forEach(button => button.addEventListener('click', () => {
    category = button.dataset.category!;
    document.querySelectorAll('[data-category]').forEach(b => b.setAttribute('aria-pressed', String(b === button))); filter();
  },{signal}));
  const top = document.querySelector<HTMLElement>('.back-top')!;
  const updateScroll = () => { top.classList.toggle('visible',scrollY > 500); document.querySelector('.site-header')?.classList.toggle('scrolled',scrollY > 15); };
  window.addEventListener('scroll',updateScroll,{signal,passive:true}); updateScroll();
  top.addEventListener('click', () => scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'}),{signal});
  const headings = document.querySelectorAll('.prose h2[id]');
  if(headings.length) {
    tocObserver = new IntersectionObserver(entries => { for(const entry of entries) if(entry.isIntersecting) { document.querySelectorAll('.toc a').forEach(link => link.setAttribute('aria-current',String(link.getAttribute('href') === '#'+entry.target.id))); } },{rootMargin:'-15% 0px -65% 0px'});
    headings.forEach(h => tocObserver!.observe(h));
  }
}
document.addEventListener('astro:page-load', init);
document.addEventListener('astro:before-swap', ((e: Event) => { const event = e as Event & { newDocument: Document }; event.newDocument.documentElement.dataset.theme = document.documentElement.dataset.theme; }) as EventListener);
init();
