import { featuredProjects, site } from '@/data/site'

export const ROOT_LABEL = 'zaixi.devserver'
export const SOCIAL_LINKS = [
  { label: 'github', href: site.github },
  { label: 'contact', href: '/contact/' }
]
export const ABOUT_TEXT = [
  site.name + ' / ' + site.englishName,
  site.introduction,
  site.university + ' · ' + site.major,
  '预计毕业：' + site.graduation,
  ...site.experiences.map((experience) => `${experience.company} · ${experience.role}`),
  site.email
].join('\n')
export const NOW_TEXT = `${featuredProjects.map((project) => project.name).join(' · ')}\n任务协作、CAD 运行时与 Agent 教学实践。`
export const README_TEXT =
  'Zaixi Personal Blog\nhelp · ls /blog · ls /projects · cat about · search Agent'
