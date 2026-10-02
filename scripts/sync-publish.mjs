import fs from 'node:fs'
import path from 'node:path'

const repo = fs.existsSync('work/github-pages/.git')
  ? path.resolve('work/github-pages')
  : path.resolve('.')
if (repo === path.resolve('.') && !fs.existsSync('.site-files.json'))
  throw new Error('No managed publishing target')
if (!fs.existsSync(path.join(repo, '.git'))) throw new Error('Expected managed GitHub checkout')
const manifestPath = path.join(repo, '.site-files.json')
const previous = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  : ['index.html', 'app.js', 'config.js', 'articles.js', 'styles.css', 'favicon.svg']
// Only remove files previously published by this build, with checked containment.
for (const relative of previous) {
  const target = path.resolve(repo, relative)
  if (!target.startsWith(repo + path.sep) || relative.startsWith('.git'))
    throw new Error('Invalid generated-file path')
  if (fs.existsSync(target) && fs.statSync(target).isFile()) fs.rmSync(target)
}
const published = []
function copyBuild(dir, prefix = '') {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const relative = path.join(prefix, entry.name)
    if (entry.isDirectory()) copyBuild(path.join(dir, entry.name), relative)
    else {
      fs.mkdirSync(path.dirname(path.join(repo, relative)), { recursive: true })
      fs.copyFileSync(path.join(dir, entry.name), path.join(repo, relative))
      published.push(relative.replaceAll('\\', '/'))
    }
  }
}
copyBuild('dist')
if (repo !== path.resolve('.')) {
  for (const dir of ['src', 'public', 'scripts']) {
    const target = path.resolve(repo, dir)
    if (
      !target.startsWith(repo + path.sep) ||
      !['src', 'public', 'scripts'].includes(path.basename(target))
    )
      throw new Error('Invalid source directory')
    fs.rmSync(target, { recursive: true, force: true })
    fs.cpSync(dir, target, { recursive: true })
  }
  for (const file of [
    'package.json',
    'package-lock.json',
    'astro.config.ts',
    'uno.config.ts',
    'prettier.config.mjs',
    'tsconfig.json',
    'vercel.json',
    'README.md',
    'NOTICE.md',
    'LICENSE',
    '.gitignore',
    '.env.example'
  ])
    fs.copyFileSync(file, path.join(repo, file))
  // Copy the comment server's sources explicitly, never its local secrets or dependencies.
  for (const file of [
    'package.json',
    'package-lock.json',
    'index.cjs',
    'vercel.json',
    'robots.txt',
    'waline.pgsql',
    '.env.example',
    '.vercelignore',
    'LICENSE',
    'README.md'
  ]) {
    const relative = path.join('services', 'waline', file)
    fs.mkdirSync(path.dirname(path.join(repo, relative)), { recursive: true })
    fs.copyFileSync(relative, path.join(repo, relative))
  }
  const oldConfig = path.resolve(repo, 'astro.config.mjs')
  if (!oldConfig.startsWith(repo + path.sep)) throw new Error('Invalid legacy configuration path')
  if (fs.existsSync(oldConfig)) fs.rmSync(oldConfig)
}
fs.writeFileSync(manifestPath, JSON.stringify(published, null, 2) + '\n')
console.log(`Synced ${published.length} static files and source to ${repo}.`)
