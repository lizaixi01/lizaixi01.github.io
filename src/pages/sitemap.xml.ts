import { getCollection } from 'astro:content';
import { projects } from '../data/site';
export async function GET() {
  const articles = await getCollection('articles');
  const paths = ['','articles/','projects/','about/','links/',...articles.map(p=>`articles/${p.id}/`),...projects.map(p=>`projects/${p.id}/`)];
  const xml=`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(p=>`<url><loc>https://lizaixi01.github.io/${p}</loc></url>`).join('')}</urlset>`;
  return new Response(xml,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
}
