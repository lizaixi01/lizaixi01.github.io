// Preserve existing share URLs without carrying forward the old design.
const aliases: Record<string, string> = {
  'goal-driven': 'verified-collaboration',
  'zero-trust': 'verified-collaboration',
  'verifier-eval': 'verified-collaboration',
  'code-review': 'verified-collaboration',
  environment: 'closed-environments',
  tools: 'closed-environments',
  'human-loop': 'human-in-open-systems',
  'structured-state': 'human-in-open-systems',
  'formal-worlds': 'mathematical-search'
}
if (location.hash.startsWith('#/')) {
  const parts = location.hash.slice(2).split('/')
  if (['anthropic', 'joye', 'openai', 'a', 'b'].includes(parts[0])) parts.shift()
  const [page = 'home', id = ''] = parts
  const paths: Record<string, string> = {
    home: '/',
    articles: '/blog/',
    projects: '/projects/',
    about: '/about/',
    links: '/links/',
    post: `/blog/${aliases[id] ?? id}/`,
    case: `/projects/${id === 'learn-agent' ? 'Learn-Agent' : id}/`
  }
  if (paths[page]) location.replace(paths[page])
}
document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    location.href = '/search/'
  }
})
document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const original = button.textContent
    try {
      await navigator.clipboard.writeText(button.dataset.copy ?? '')
      button.textContent = '已复制'
    } catch {
      button.textContent = '请选择文字手动复制'
    }
    setTimeout(() => {
      button.textContent = original
    }, 2400)
  })
})
