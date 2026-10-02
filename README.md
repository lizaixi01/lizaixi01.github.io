# Zaixi Personal Blog

李在希的个人博客与 Agent Harness 工程作品集。**All in on AI Agents.**

网站：https://lizaixi01.github.io/ 。发布仓库：https://github.com/lizaixi01/lizaixi01.github.io 。

直接采用 [joyehuang/blog](https://github.com/joyehuang/blog) 开源模板（来源提交 `17e0eda5d7befe82682072ba5e3b18991e80bc45`）。保留模板的 Pure 主题、顶部导航、居中头像、分栏首页、文章卡片、阅读目录、深浅主题、粒子入场和交互终端，替换为李在希的个人资料、7 个公开项目和 5 篇文章。此前的网站设计已被取代。

## 本地开发

使用 Node.js 22.12+（当前已在 Node.js 24 验证）：先运行 `npm ci`，再运行 `npm start`，打开 http://127.0.0.1:4173/ 。

生产检查：npm run check、npm run build、npm run verify。npm run preview 预览生产产物。

## 内容维护

- src/data/site.ts：个人资料与品牌文案。
- src/data/projects.json：精选公开项目，PiLoop 保持第一位。
- src/content/articles/*.md：正式文章与修订日期。
- src/content/cases/*.md：项目设计记录。
- src/site.config.ts：模板配置、导航与集成开关。
- src/components、src/layouts、src/assets/styles：模板组件、页面框架和主题。
- uno.config.ts：模板的 UnoCSS 样式配置。
- public/assets：用户照片、微信二维码和本地优化图片。

文章与项目详情在构建时生成。搜索索引、RSS、sitemap 都是本地静态文件；页面不在访问时调用 GitHub API，也不加载外部字体、分析或评论脚本。原始文章、引用、Learn-Agent 设计记录保留，旧 #/home、#/post/... 等分享地址转到新路径。

主题读取模板的 theme 偏好，并兼容此前 loop-theme 的深浅设置。邮箱是可选择纯文本，另提供复制按钮；微信在联系页的模板二维码卡片展示。

模板终端通过首页窗口、顶部按钮或反引号打开，支持 help、ls、cat、open、whoami、search、connect、mail、theme、clear 和 exit；使用静态生成的站内内容，不执行操作系统命令。Ctrl/Cmd K 打开独立搜索页。减少动态效果设置有对应适配；禁用 JavaScript 后文章仍可阅读。

采用 Astro 7、Pure 1.4 与 React 19，并为 Pure 对旧 Astro 配置字段的读取保留一个兼容适配。模板作者的文章、照片、联系人、统计服务、评论服务与私人角色包没有接入本站。

## 发布约定

仅发布 GitHub / GitHub Pages。vercel.json 的 git.deploymentEnabled=false 保持关闭 Vercel 自动部署。

本工作区发布副本为 work/github-pages。完成检查与构建后运行 npm run publish:files，将静态站点和源码同步到该独立仓库，再提交和推送。Pages 继续读取 main 分支根目录。不要同步 .openai、work 或私人资料。

在发布仓库直接维护时，构建输出 dist，再运行 npm run publish:files 将产物同步到根目录；不要提交 node_modules。生成文件由 .site-files.json 记录。

项目能力介绍依据公开 README。私人项目未发布，fork 不作为原创作品；本站改版未重新执行被展示项目的模型实验。Pages 发布成功不代表大陆各网络均已验证可达。

模板归属、改动说明和内容授权范围见 `NOTICE.md`；模板 Apache-2.0 授权见 `LICENSE`。
