import { getCollection, type CollectionEntry } from 'astro:content'
import { createMarkdownProcessor } from '@astrojs/markdown-remark'
import remarkCjkFriendly from 'remark-cjk-friendly'

export async function getStaticPaths() {
  return (await getCollection('blog')).map((post) => ({ params: { id: post.id }, props: { post } }))
}
const processor = createMarkdownProcessor({
  gfm: true,
  remarkPlugins: [remarkCjkFriendly],
  shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } }
})
export async function GET({ props }: { props: { post: CollectionEntry<'blog'> } }) {
  const result = await (await processor).render(props.post.body ?? '')
  return new Response(JSON.stringify({ html: result.code, headings: result.metadata.headings }), {
    headers: { 'Content-Type': 'application/json' }
  })
}
