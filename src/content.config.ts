import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

// Keep the author's original Markdown intact, adapting its metadata to Pure.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      category: z.string(),
      updated: z.string(),
      order: z.number()
    })
    .transform((data) => ({
      ...data,
      publishDate: new Date(`${data.updated}T00:00:00+08:00`),
      updatedDate: new Date(`${data.updated}T00:00:00+08:00`),
      tags: [data.category],
      draft: false,
      comment: false
    }))
})
const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({ title: z.string(), description: z.string(), project: z.string() })
})
export const collections = { blog, cases }
