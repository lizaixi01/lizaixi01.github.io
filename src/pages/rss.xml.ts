import { getCollection } from 'astro:content';
const escape = (s: string) => s.replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]!));
export async function GET() {
  const items = (await getCollection('articles')).sort((a,b)=>b.data.updated.localeCompare(a.data.updated));
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Home · Zaixi</title><link>https://lizaixi01.github.io/</link><description>All in on AI Agents.</description><language>zh-CN</language>${items.map(p=>`<item><title>${escape(p.data.title)}</title><link>https://lizaixi01.github.io/articles/${p.id}/</link><guid>https://lizaixi01.github.io/articles/${p.id}/</guid><description>${escape(p.data.description)}</description><pubDate>${new Date(p.data.updated+'T00:00:00+08:00').toUTCString()}</pubDate></item>`).join('')}</channel></rss>`;
  return new Response(xml,{headers:{'Content-Type':'application/rss+xml; charset=utf-8'}});
}
