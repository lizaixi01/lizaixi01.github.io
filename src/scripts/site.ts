import { navigate } from 'astro:transitions/client';

interface SearchItem { title: string; description: string; text: string; type: string; url: string }
let searchData: Promise<SearchItem[]> | undefined;
let events: AbortController | undefined;
let reveals: IntersectionObserver | undefined;
let sections: IntersectionObserver | undefined;
let scrollFrame = 0;
let toastTimer: ReturnType<typeof setTimeout>;

function setTheme(theme: 'light' | 'dark', save = false) {
  document.documentElement.dataset.theme = theme;
  document.querySelector<HTMLButtonElement>('button[data-theme]')?.setAttribute('aria-label', `切换至${theme === 'dark' ? '浅' : '深'}色模式`);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0e1117' : '#fbfcfd');
  if (save) { try { localStorage.setItem('loop-theme', theme); } catch {} }
}
function loadTheme() {
  let saved: string | null = null;
  try { saved = localStorage.getItem('loop-theme'); } catch {}
  setTheme(saved === 'dark' || saved === 'light' ? saved : matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
}
function legacyRoute() {
  if (!location.hash.startsWith('#/')) return;
  const parts = location.hash.slice(2).split('/');
  if (['anthropic','joye','openai','a','b'].includes(parts[0])) parts.shift();
  const aliases: Record<string,string> = {
    'goal-driven':'verified-collaboration', 'zero-trust':'verified-collaboration',
    'verifier-eval':'verified-collaboration', 'code-review':'verified-collaboration',
    environment:'closed-environments', tools:'closed-environments',
    'human-loop':'human-in-open-systems', 'structured-state':'human-in-open-systems',
    'formal-worlds':'mathematical-search',
  };
  const [page = 'home', id = ''] = parts;
  const paths: Record<string,string> = {
    home:'/', articles:'/articles/', projects:'/projects/', about:'/about/', links:'/links/',
    post:`/articles/${aliases[id] || id}/`, case:`/case/${id}/`,
  };
  if (paths[page]) location.replace(paths[page]);
}
function init() {
  legacyRoute();
  loadTheme();
  events?.abort(); reveals?.disconnect(); sections?.disconnect(); cancelAnimationFrame(scrollFrame);
  events = new AbortController();
  const signal = events.signal;
  const contact = document.querySelector<HTMLDialogElement>('.contact-dialog')!;
  const search = document.querySelector<HTMLDialogElement>('.search-dialog')!;
  const terminal = document.querySelector<HTMLDialogElement>('.terminal-dialog')!;
  const dialogs = [contact,search,terminal];
  const searchInput = document.querySelector<HTMLInputElement>('#site-search')!;
  const resultBox = document.querySelector<HTMLElement>('#search-results')!;
  const terminalInput = document.querySelector<HTMLInputElement>('#terminal-input')!;
  const terminalOutput = document.querySelector<HTMLElement>('.terminal-output')!;
  const triggers = new WeakMap<HTMLDialogElement,HTMLElement>();
  const show = (dialog: HTMLDialogElement, trigger?: HTMLElement) => {
    dialogs.forEach(other => { if (other !== dialog && other.open) other.close(); });
    if (dialog.open) return;
    triggers.set(dialog, trigger || document.activeElement as HTMLElement);
    dialog.showModal();
    if (dialog === search) searchInput.focus();
    if (dialog === terminal) terminalInput.focus();
  };
  dialogs.forEach(dialog => {
    dialog.addEventListener('close', () => {
      const trigger = triggers.get(dialog);
      if (!dialogs.some(other => other.open) && trigger?.isConnected) trigger.focus({preventScroll:true});
    }, {signal});
    dialog.querySelector('[data-close]')?.addEventListener('click', () => dialog.close(), {signal});
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    }, {signal});
  });
  for (const [selector,dialog] of [['[data-contact]',contact],['[data-search]',search],['[data-terminal]',terminal]] as const) {
    document.querySelectorAll<HTMLElement>(selector).forEach(button => button.addEventListener('click', () => show(dialog,button), {signal}));
  }
  document.querySelector('button[data-theme]')?.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark',true), {signal});
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && dialogs.some(dialog => dialog.open)) {
      event.preventDefault(); dialogs.forEach(dialog => { if(dialog.open) dialog.close(); });
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); show(search); }
    const target = event.target as HTMLElement;
    if (event.key === '`' && !target.closest('input,textarea,[contenteditable]')) { event.preventDefault(); show(terminal); }
  }, {signal});
  document.querySelectorAll<HTMLElement>('[data-copy]').forEach(button => button.addEventListener('click', async () => {
    let message = '已复制';
    try { await navigator.clipboard.writeText(button.dataset.copy || ''); }
    catch { message = '请选择邮箱文字手动复制。'; }
    if (signal.aborted) return;
    const toast = document.querySelector<HTMLElement>('.toast')!;
    toast.textContent = message; toast.classList.add('visible');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('visible'),2500);
  }, {signal}));

  let queryVersion = 0;
  let selectedIndex = -1;
  const emptySearch = (message: string) => {
    const p = document.createElement('p'); p.className = 'empty-state'; p.textContent = message;
    resultBox.replaceChildren(p);
  };
  async function findContent() {
    const version = ++queryVersion;
    selectedIndex = -1;
    const query = searchInput.value.trim().toLocaleLowerCase();
    if (!query) { emptySearch('输入关键词，找到感兴趣的内容。'); return; }
    searchData ||= fetch('/search.json').then(response => {
      if (!response.ok) throw new Error('Search unavailable');
      return response.json() as Promise<SearchItem[]>;
    });
    try {
      const data = await searchData;
      if (version !== queryVersion || signal.aborted) return;
      const matches = data.filter(item => `${item.title} ${item.description} ${item.text}`.toLocaleLowerCase().includes(query));
      resultBox.replaceChildren();
      matches.slice(0,15).forEach(item => {
        const link = document.createElement('a'); link.href = item.url;
        const type = document.createElement('small'); type.textContent = item.type;
        const title = document.createElement('strong'); title.textContent = item.title;
        const description = document.createElement('span'); description.textContent = item.description;
        link.append(type,title,description); resultBox.append(link);
      });
      if (!matches.length) emptySearch('没有找到相关内容，试试其他关键词。');
    } catch {
      searchData = undefined;
      if (version === queryVersion && !signal.aborted) emptySearch('搜索暂时不可用，请从文章或项目页浏览。');
    }
  }
  searchInput.addEventListener('input',findContent,{signal});
  searchInput.addEventListener('keydown', event => {
    const links = Array.from(resultBox.querySelectorAll<HTMLAnchorElement>('a'));
    if (!links.length) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      selectedIndex = (selectedIndex + (event.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
      links.forEach((link,i) => link.classList.toggle('selected',i === selectedIndex));
      links[selectedIndex].scrollIntoView({block:'nearest'});
    }
    if (event.key === 'Enter' && selectedIndex >= 0) { event.preventDefault(); links[selectedIndex].click(); }
  }, {signal});

  const destinations: Record<string,[string,string]> = {
    home:['/','首页'], articles:['/articles/','文章'], projects:['/projects/','项目'],
    about:['/about/','关于'], links:['/links/','友链'],
  };
  const history: string[] = [];
  let historyIndex = 0;
  const output = (text: string, className = '') => {
    const p = document.createElement('p'); p.textContent = text; p.className = className;
    terminalOutput.append(p); return p;
  };
  function command(raw: string) {
    const value = raw.trim();
    if (!value) return;
    history.push(value); historyIndex = history.length;
    terminalInput.value = '';
    output('~ $ ' + value,'command-echo');
    const [action,...args] = value.toLowerCase().split(/\s+/);
    if (action === 'clear') terminalOutput.replaceChildren();
    else if (action === 'help') output('ls                 浏览本站目录\nopen projects      打开项目（也可用 home / articles / about / links）\nwhoami             关于 Zaixi\nsearch 关键词       搜索本站\ncontact            联系我\ntheme dark|light   切换主题\nclear              清空终端');
    else if (action === 'ls') {
      const p = document.createElement('p');
      Object.entries(destinations).forEach(([key,[href,label]]) => {
        const a = document.createElement('a'); a.href = href; a.textContent = key + ' / ' + label; p.append(a);
      });
      terminalOutput.append(p);
    } else if (action === 'whoami') output('Zaixi Li / 李在希\n电子科技大学 · 电子信息科学与技术 · 2029 年秋季预计毕业\n成都 · 寻找 Agent Harness 工程师实习');
    else if (action === 'open' && destinations[args[0]]) { terminal.close(); void navigate(destinations[args[0]][0]); }
    else if (action === 'contact') show(contact);
    else if (action === 'theme' && ['dark','light'].includes(args[0])) { setTheme(args[0] as 'dark'|'light',true); output('主题已切换。'); }
    else if (action === 'search') { show(search); searchInput.value = value.split(/\s+/).slice(1).join(' '); void findContent(); }
    else output('未识别的命令。输入 help 查看可用命令。');
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    if (terminal.open) terminalInput.focus();
  }
  document.querySelector('.terminal-form')?.addEventListener('submit', event => { event.preventDefault(); command(terminalInput.value); },{signal});
  document.querySelectorAll<HTMLElement>('[data-command]').forEach(button => button.addEventListener('click', () => command(button.dataset.command || ''),{signal}));
  terminalInput.addEventListener('keydown', event => {
    if (!['ArrowUp','ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    historyIndex = Math.max(0,Math.min(history.length,historyIndex + (event.key === 'ArrowUp' ? -1 : 1)));
    terminalInput.value = history[historyIndex] || '';
  },{signal});

  const articleSearch = document.querySelector<HTMLInputElement>('[data-article-search]');
  let category = '全部';
  const filterArticles = () => {
    let count = 0;
    document.querySelectorAll<HTMLElement>('[data-article]').forEach(row => {
      row.hidden = !(category === '全部' || row.dataset.category === category) || !row.textContent?.toLocaleLowerCase().includes(articleSearch?.value.toLocaleLowerCase() || '');
      if (!row.hidden) count++;
    });
    const countElement = document.querySelector('[data-result-count]');
    if (countElement) countElement.textContent = `共 ${count} 篇文章`;
  };
  articleSearch?.addEventListener('input',filterArticles,{signal});
  document.querySelectorAll<HTMLButtonElement>('[data-category]').forEach(button => button.addEventListener('click', () => {
    category = button.dataset.category!;
    document.querySelectorAll('[data-category]').forEach(other => other.setAttribute('aria-pressed',String(other === button)));
    filterArticles();
  },{signal}));
  document.querySelectorAll<HTMLButtonElement>('[data-project-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-project-filter]').forEach(other => other.setAttribute('aria-pressed',String(other === button)));
    let count = 0;
    document.querySelectorAll<HTMLElement>('[data-project]').forEach(project => {
      project.hidden = !(button.dataset.projectFilter === '全部' || project.dataset.group === button.dataset.projectFilter);
      if (!project.hidden) count++;
    });
    const countElement = document.querySelector('[data-project-count]');
    if (countElement) countElement.textContent = `共 ${count} 个项目`;
  },{signal}));

  const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
  document.body.classList.add('reveal-ready');
  const revealItems = document.querySelectorAll<HTMLElement>('[data-reveal]');
  reveals = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveals?.unobserve(entry.target); }
  }),{threshold:.05,rootMargin:'0px 0px 30px 0px'});
  revealItems.forEach(item => {
    if (reduced || item.getBoundingClientRect().top < innerHeight) item.classList.add('is-visible');
    else reveals!.observe(item);
  });
  const topButton = document.querySelector<HTMLButtonElement>('.back-top')!;
  const progress = document.querySelector<HTMLElement>('.reading-progress')!;
  const isArticle = !!document.querySelector('.article-layout');
  function updateScroll() {
    scrollFrame = 0;
    topButton.classList.toggle('visible',scrollY > 500);
    document.querySelector('.topbar')?.classList.toggle('scrolled',scrollY > 15);
    const total = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${isArticle && total > 0 ? Math.min(scrollY / total,1) : 0})`;
  }
  window.addEventListener('scroll', () => { if(!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); },{signal,passive:true});
  window.addEventListener('resize',updateScroll,{signal,passive:true}); updateScroll();
  topButton.addEventListener('click', () => scrollTo({top:0,behavior:reduced?'instant':'smooth'}),{signal});
  const toc = document.querySelector('.toc');
  if (toc) {
    sections = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) toc.querySelectorAll('a').forEach(link => link.setAttribute('aria-current',String(link.getAttribute('href') === '#' + entry.target.id)));
    }),{rootMargin:'-12% 0px -65% 0px'});
    document.querySelectorAll('.prose h2[id]').forEach(heading => sections!.observe(heading));
  }
}
document.addEventListener('astro:page-load',init);
document.addEventListener('astro:before-swap',((event: Event) => {
  const swap = event as Event & {newDocument: Document};
  swap.newDocument.documentElement.dataset.theme = document.documentElement.dataset.theme;
}) as EventListener);
init();

