export interface SearchResult {
  collection: 'blog' | 'project'
  type: '文章' | '项目'
  title: string
  description: string
  url: string
  date: string
  tags: string[]
  excerpt: string
  text: string
}
let index: Promise<SearchResult[]> | undefined
export async function searchContent(query: string, limit = 10): Promise<SearchResult[]> {
  index ??= fetch('/search.json')
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return response.json() as Promise<SearchResult[]>
    })
    .catch((error) => {
      index = undefined
      throw error
    })
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean)
  if (!terms.length) return []
  return (await index)
    .filter((item) =>
      terms.every((term) =>
        `${item.title} ${item.description} ${item.text}`.toLocaleLowerCase().includes(term)
      )
    )
    .slice(0, limit)
}
