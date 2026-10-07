import projectData from './projects.json'

export interface Project {
  id: string
  name: string
  url: string
  tech: string
  status: string
  description: string
  focus: string
  boundary: string
  group: string
  updated: string
}
export const projects: Project[] = projectData
export const site = {
  title: 'Zaixi Personal Blog',
  name: '李在希',
  englishName: 'Zaixi Li',
  nickname: 'Zaixi',
  description: 'AI Agent & Full-Stack Developer',
  introduction: '构建 Agent 系统，用更多 token 换取 10 倍以上的生产力。',
  englishIntroduction: 'Building agent systems for 10×+ productivity through token scaling.',
  email: 'lizaixi@gmail.com',
  github: 'https://github.com/lizaixi01',
  university: '电子科技大学',
  major: '电子信息科学与技术',
  graduation: '2029 年秋季',
  location: '成都',
  cities: ['北京', '上海', '杭州', '深圳', '成都']
}
