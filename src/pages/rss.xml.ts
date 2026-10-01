import { getCollection } from 'astro:content'
import rss from '@astrojs/rss'

import config from '@/site-config'

export async function GET() {
  const posts = await getCollection('blog')
  return rss({
    title: config.title,
    description: config.description ?? '',
    site: 'https://lizaixi01.github.io',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `/blog/${post.id}/`
    }))
  })
}
