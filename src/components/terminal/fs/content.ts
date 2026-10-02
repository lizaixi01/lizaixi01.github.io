import { site } from '@/data/site'

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
  '寻找 Agent Harness 工程师实习',
  site.email
].join('\n')
export const NOW_TEXT = 'Legion · PiLoop · Learn-Agent\n执行、上下文管理、记忆与独立验证。'
export const README_TEXT =
  'Zaixi Personal Blog\nhelp · ls /blog · ls /projects · cat about · search Agent'
