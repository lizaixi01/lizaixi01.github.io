import { getCollection } from 'astro:content'
import { projects, site } from '@/data/site'

import { ABOUT_TEXT, NOW_TEXT, README_TEXT, ROOT_LABEL } from '@/components/terminal/fs/content'
import type { FsNode } from '@/components/terminal/fs/types'

export async function GET() {
  const posts = (await getCollection('blog')).sort((a, b) => a.data.order - b.data.order)
  const tree: FsNode = {
    type: 'dir',
    name: ROOT_LABEL,
    children: [
      { type: 'file', name: 'README', content: README_TEXT, href: '/' },
      { type: 'file', name: 'about', content: ABOUT_TEXT, href: '/about/' },
      { type: 'file', name: 'now', content: NOW_TEXT },
      {
        type: 'file',
        name: 'contact',
        content: `${site.name}\n${site.email}\n${site.github}`,
        href: '/contact/'
      },
      {
        type: 'dir',
        name: 'blog',
        description: `${posts.length} 篇文章`,
        children: posts.map((post) => ({
          type: 'dir',
          name: post.id,
          description: post.data.title,
          children: [
            { type: 'file', name: 'summary', content: post.data.description },
            {
              type: 'file',
              name: 'post',
              endpoint: `/api/blog/${post.id}.json`,
              href: `/blog/${post.id}/`,
              meta: { title: post.data.title, date: post.data.updated, slug: post.id }
            }
          ]
        }))
      },
      {
        type: 'dir',
        name: 'projects',
        description: `${projects.length} 个项目`,
        children: projects.map((project) => ({
          type: 'file',
          name: project.id,
          description: project.description,
          content: `${project.name}\n${project.description}\n${project.tech}\n${project.boundary}`,
          href: `/projects/${project.id}/`
        }))
      },
      { type: 'file', name: 'links', href: '/links/' }
    ]
  }
  return new Response(JSON.stringify({ tree }), { headers: { 'Content-Type': 'application/json' } })
}
