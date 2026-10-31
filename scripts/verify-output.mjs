import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('dist')
const files = []
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(file)
    else files.push(file)
  }
}
walk(root)
const htmlFiles = files.filter((f) => f.endsWith('.html'))
const errors = []
if (JSON.parse(fs.readFileSync('vercel.json', 'utf8')).git.deploymentEnabled !== false)
  errors.push('Vercel automatic deployments must remain disabled')
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8')
  const redirect = /http-equiv="refresh"/i.test(html)
  if (!redirect && [...html.matchAll(/<h1[\s>]/g)].length !== 1)
    errors.push(`${file}: expected one h1`)
  if (!redirect && !html.includes('rel="canonical"')) errors.push(`${file}: missing canonical`)
  const targets = [...html.matchAll(/(?:href|src)="([^"?#]+)(?:[?#][^"]*)?"/g)].map((m) => m[1])
  for (const target of targets.filter((t) => t.startsWith('/'))) {
    const resolved = path.resolve(root, '.' + decodeURIComponent(target))
    if (!resolved.startsWith(root + path.sep) && resolved !== root) {
      errors.push(`Outside root: ${target}`)
      continue
    }
    if (
      !fs.existsSync(resolved) ||
      (fs.statSync(resolved).isDirectory() && !fs.existsSync(path.join(resolved, 'index.html')))
    )
      errors.push(`${path.relative(root, file)}: broken target ${target}`)
  }
}
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
const projectData = JSON.parse(fs.readFileSync('src/data/projects.json', 'utf8'))
if (projectData[0]?.id !== 'Legion') errors.push('Legion must remain first')
let lastFeaturedPosition = -1
for (const project of projectData.slice(0, 3)) {
  const position = home.indexOf(`href="/projects/${project.id}/"`)
  if (position < 0 || position <= lastFeaturedPosition)
    errors.push(`Featured project missing or out of order: ${project.id}`)
  lastFeaturedPosition = position
}
if (new Set(projectData.map((project) => project.id)).size !== projectData.length)
  errors.push('Duplicate project IDs')
for (const project of projectData) {
  const file = path.join(root, 'projects', project.id, 'index.html')
  if (!fs.existsSync(file)) {
    errors.push(`Project detail missing: ${project.id}`)
    continue
  }
  const html = fs.readFileSync(file, 'utf8')
  for (const target of [project.url, project.demoUrl, project.downloadUrl].filter(Boolean))
    if (!html.includes(`href="${target}"`))
      errors.push(`${project.id}: project destination missing: ${target}`)
}
const search = JSON.parse(fs.readFileSync(path.join(root, 'search.json'), 'utf8'))
const articleCount = fs
  .readdirSync('src/content/articles')
  .filter((file) => file.endsWith('.md')).length
const projectCount = projectData.length
const commentServer = (
  process.env.PUBLIC_WALINE_SERVER_URL ||
  JSON.parse(fs.readFileSync('src/data/waline.json', 'utf8')).serverURL
)
  .trim()
  .replace(/\/+$/, '')
for (const source of fs
  .readdirSync('src/content/articles')
  .filter((file) => file.endsWith('.md'))) {
  const id = source.slice(0, -3)
  const html = fs.readFileSync(path.join(root, 'blog', id, 'index.html'), 'utf8')
  if (commentServer) {
    if (!html.includes(`data-server-url="${commentServer}"`))
      errors.push(`${id}: comment server missing`)
    if (!html.includes(`data-path="/blog/${id}/"`)) errors.push(`${id}: unstable comment path`)
    if (!html.includes('<joye-comment') || !html.includes('id="waline"'))
      errors.push(`${id}: template comment section missing`)
  } else if (html.includes('<joye-comment')) errors.push(`${id}: unconfigured comments visible`)
}
if (home.includes('data-server-url=')) errors.push('Comments must only load on article pages')
if (search.filter((p) => p.type === '文章').length !== articleCount)
  errors.push('Article search index incomplete')
if (new Set(search.map((p) => p.url)).size !== search.length) errors.push('Duplicate search URLs')
if (search.filter((p) => p.type === '项目').length !== projectCount)
  errors.push('Project search index incomplete')
for (const source of process.argv.includes('--preserve-original-content')
  ? fs.readdirSync('src/content/articles')
  : []) {
  const before = path.join('work/template-backup-20261001/src/content/articles', source)
  if (
    fs.existsSync(before) &&
    !fs.readFileSync(before).equals(fs.readFileSync(path.join('src/content/articles', source)))
  )
    errors.push(`Original article changed: ${source}`)
}
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'api/knowledge/index.json'), 'utf8'))
if (manifest.tree.children.find((node) => node.name === 'blog').children.length !== articleCount)
  errors.push('Terminal article manifest incomplete')
const terminalProjects = manifest.tree.children.find((node) => node.name === 'projects').children
if (
  terminalProjects.length !== projectCount ||
  projectData.some((project) => !terminalProjects.some((node) => node.name === project.id))
)
  errors.push('Terminal project manifest incomplete')
if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
console.log(
  `Verified ${htmlFiles.length} HTML pages, internal targets, ${search.length} search entries and project order.`
)
