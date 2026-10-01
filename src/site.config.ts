import type { Config, IntegrationUserConfig, ThemeUserConfig } from 'astro-pure/types'

import { site } from './data/site'

export const theme: ThemeUserConfig = {
  title: 'Zaixi Personal Blog',
  author: site.nickname,
  description: site.description,
  favicon: '/favicon.svg',
  locale: {
    lang: 'zh-CN',
    attrs: 'zh_CN',
    dateLocale: 'zh-CN',
    dateOptions: { day: 'numeric', month: 'short', year: 'numeric' }
  },
  logo: { src: 'src/assets/avatar.webp', alt: 'Zaixi' },
  titleDelimiter: '•',
  prerender: true,
  npmCDN: 'https://cdn.jsdelivr.net/npm',
  head: [],
  customCss: [],
  header: {
    menu: [
      { title: 'Blog', link: '/blog/' },
      { title: 'Projects', link: '/projects/' },
      { title: 'Links', link: '/links/' },
      { title: 'About', link: '/about/' },
      { title: 'Contact', link: '/contact/' }
    ]
  },
  footer: {
    year: '© 2026\u00a0',
    links: [],
    credits: true,
    social: [
      { icon: 'github', label: 'GitHub', href: site.github },
      { icon: 'rss', label: 'RSS', href: '/rss.xml' }
    ]
  },
  content: {
    externalLinks: { content: ' ↗', properties: { target: '_blank', rel: 'noopener noreferrer' } },
    blogPageSize: 8,
    share: []
  }
}

export const integ: IntegrationUserConfig = {
  links: {
    logbook: [],
    applyTip: [
      { name: 'Name', val: theme.title },
      { name: 'Desc', val: site.description },
      { name: 'Link', val: 'https://lizaixi01.github.io/' },
      { name: 'Avatar', val: 'https://lizaixi01.github.io/assets/avatar.webp' }
    ]
  },
  pagefind: false,
  quote: { server: '', target: '' },
  typography: { class: 'prose text-base text-muted-foreground' },
  mediumZoom: { enable: true, selector: '.prose .zoomable', options: { className: 'zoomable' } },
  waline: { enable: false, server: '' }
}

export default { ...theme, integ } as Config
