export function listingMetadata(
  _collection: string,
  _english: boolean,
  page: number,
  titles: string[],
  tag?: string
) {
  return {
    title: tag ? `Tags: ${tag}` : 'Blog',
    description: `${tag ?? 'Zaixi 的文章'} · 第 ${page} 页 · ${titles.join('、')}`
  }
}
