import projectData from './projects.json';

export interface Project {
  id: string; name: string; url: string; tech: string; status: string;
  description: string; focus: string; boundary: string; group: string; updated: string;
}
export const projects: Project[] = projectData;
export const site = {
  title: 'Home · Zaixi', name: '李在希', englishName: 'Zaixi Li', nickname: 'Zaixi',
  description: 'All in on AI Agents.',
  introduction: '电子科技大学在读，关注 Agent 的执行流程、上下文管理与可验证交付。通过真实使用中的问题，练习把模型能力变成可靠、顺手的产品。',
  email: 'lizaixi@gmail.com', github: 'https://github.com/lizaixi01',
  university: '电子科技大学', major: '电子信息科学与技术', graduation: '2029 年秋季',
  location: '成都', cities: ['北京', '上海', '杭州', '深圳', '成都'],
};
