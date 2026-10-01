import { getCollection } from 'astro:content'
import { projects } from '@/data/site'
import type { SearchResult } from '@/lib/search'

export async function GET() {
  const posts = await getCollection('blog')
  const results: SearchResult[] = [
    ...posts.map((post) => ({
      collection: 'blog' as const,
      type: '文章' as const,
      title: post.data.title,
      description: post.data.description,
      url: `/blog/${post.id}/`,
      date: post.data.updated,
      tags: post.data.tags,
      excerpt: post.data.description,
      text: post.body ?? ''
    })),
    ...projects.map((project) => ({
      collection: 'project' as const,
      type: '项目' as const,
      title: project.name,
      description: project.description,
      url: `/projects/${project.id}/`,
      date: project.updated,
      tags: [project.group],
      excerpt: project.description,
      text: `${project.tech} ${project.focus} ${project.boundary}`
    }))
  ]
  return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } })
}
