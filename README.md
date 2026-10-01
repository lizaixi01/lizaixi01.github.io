# Home · Zaixi

李在希的个人博客与 Agent Harness 工程作品集。**All in on AI Agents.**

网站：https://lizaixi01.github.io/ 。发布仓库：https://github.com/lizaixi01/lizaixi01.github.io 。

参考 joyehuang/blog 的 Astro 结构、分栏内容组织与阅读体验，保留米白／深绿主题。静态 HTML 页面、独立 Markdown 文章、类型明确的项目配置和共享组件。

## 本地开发

Node.js 22.12+：先运行 npm ci，再运行 npm start，打开 http://127.0.0.1:4173/ 。

生产检查：npm run check、npm run build、npm run verify。npm run preview 预览生产产物。

## 内容维护

- src/data/site.ts：个人资料与品牌文案。
- src/data/projects.json：精选公开项目，PiLoop 保持第一位。
- src/content/articles/*.md：正式文章与修订日期。
- src/content/cases/*.md：项目设计记录。
- src/components、src/layouts、src/styles：组件、页面框架、主题。
- public/assets：用户照片、微信二维码和本地优化图片。

文章与项目详情在构建时生成。搜索索引、RSS、sitemap 都是本地静态文件；页面不在访问时调用 GitHub API，也不加载外部字体、分析或评论脚本。原始文章、引用、Learn-Agent 设计记录保留，旧 #/home、#/post/... 等分享地址转到新路径。

全站隐藏文档滚动条，保留滚轮、触控和键盘滚动。深色模式保留原 loop-theme 偏好。邮箱是可选择纯文本，另提供复制按钮；微信在联系弹窗展示。

## 发布约定

仅发布 GitHub / GitHub Pages。vercel.json 的 git.deploymentEnabled=false 保持关闭 Vercel 自动部署。

本工作区发布副本为 work/github-pages。完成检查与构建后运行 npm run publish:files，将静态站点和源码同步到该独立仓库，再提交和推送。Pages 继续读取 main 分支根目录。不要同步 .openai、work 或私人资料。

在发布仓库直接维护时，构建输出 dist，再运行 npm run publish:files 将产物同步到根目录；不要提交 node_modules。生成文件由 .site-files.json 记录。

项目能力介绍依据公开 README。私人项目未发布，fork 不作为原创作品；本站改版未重新执行被展示项目的模型实验。Pages 发布成功不代表大陆各网络均已验证可达。

参考和授权见 NOTICE.md。
