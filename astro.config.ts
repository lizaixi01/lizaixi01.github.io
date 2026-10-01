import react from '@astrojs/react'
import AstroPureIntegration from 'astro-pure'
import { defineConfig } from 'astro/config'
import rehypeKatex from 'rehype-katex'
import remarkCjkFriendly from 'remark-cjk-friendly'
import remarkMath from 'remark-math'

import rehypeAutolinkHeadings from './src/plugins/rehype-auto-link-headings'
import remarkReadingTime from './src/plugins/remark-reading-time'
import {
  addCopyButton,
  addLanguage,
  addTitle,
  transformerNotationDiff,
  transformerNotationHighlight,
  updateStyle
} from './src/plugins/shiki-transformers'
import config from './src/site.config'

const pure = AstroPureIntegration(config)
const setupPure = pure.hooks['astro:config:setup']
// Pure still reads Astro 6's removed legacy flag; these are modern collections.
pure.hooks['astro:config:setup'] = (context) =>
  setupPure?.({
    ...context,
    config: Object.assign({}, context.config, { legacy: { collectionsBackwardsCompat: false } })
  })

// Static hosting adaptation of joyehuang/blog with its original Pure theme.
export default defineConfig({
  site: 'https://lizaixi01.github.io',
  output: 'static',
  trailingSlash: 'always',
  redirects: {
    '/articles': '/blog',
    '/articles/[...id]': '/blog/[...id]',
    '/case/learn-agent': '/projects/Learn-Agent'
  },
  integrations: [pure, react()],
  prefetch: true,
  markdown: {
    remarkPlugins: [remarkMath, remarkCjkFriendly, remarkReadingTime],
    rehypePlugins: [
      rehypeKatex,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: { className: ['anchor'] },
          content: { type: 'text', value: '#' }
        }
      ]
    ],
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      transformers: [
        transformerNotationDiff(),
        transformerNotationHighlight(),
        updateStyle(),
        addTitle(),
        addLanguage(),
        addCopyButton(2000)
      ]
    }
  }
})
