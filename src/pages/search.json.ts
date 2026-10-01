import { getCollection } from 'astro:content';
import { projects } from '../data/site';
export async function GET() {
  const articles = await getCollection('articles');
  const cases = await getCollection('cases');
  const data = [
    ...articles.map(a => ({title:a.data.title,description:a.data.description,text:a.body,type:'文章',url:`/articles/${a.id}/`})),
    ...projects.map(p => ({title:p.name,description:p.description,text:`${p.focus} ${p.boundary} ${cases.find(c=>c.data.project===p.id)?.body || ''}`,type:'项目',url:`/projects/${p.id}/`})),
  ];
  return new Response(JSON.stringify(data),{headers:{'Content-Type':'application/json; charset=utf-8'}});
}
