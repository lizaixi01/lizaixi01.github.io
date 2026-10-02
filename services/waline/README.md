# Zaixi 的 Waline 评论服务

博客继续使用 GitHub Pages，本目录单独部署到 Vercel，数据库使用 Neon PostgreSQL。Vercel 项目名为 `zaixi-waline`，数据库使用 Free 方案，数据库和函数均选新加坡区域。

## 部署与初始化

1. 在本目录登录 Vercel 并连接 `zaixi-waline` 项目。只部署本目录，不能把博客根目录当作评论服务。
2. 创建 Neon Free 数据库并连接到项目的 production 环境。集成提供 `DATABASE_URL` 或 `POSTGRES_URL`，入口会将其转换为 Waline 的 PG 配置，使用 TLS 和 5432 端口。
3. 在新建的专用数据库执行 `waline.pgsql`。该文件来自 [Waline 官方初始化脚本](https://github.com/walinejs/waline/blob/main/assets/waline.pgsql)，仅供第一次初始化；已有数据库不要重复执行或删除重建表。
4. 在 Vercel 服务端环境中填写 `.env.example` 的网站名称、地址和游客登录模式。数据库密码、连接字符串以及 JWT 密钥只保存在服务端环境中，不得写入博客的 `PUBLIC_*` 变量。
5. 部署生产版本。确认 `/api/comment` 和 `/api/article` 正常，再由站主亲自访问 `<服务地址>/ui/register` 完成首个账号注册，该账号会成为管理员；之后通过 `/ui` 管理评论。
6. 把服务地址写入博客 `src/data/waline.json` 的 `serverURL`，重新检查、构建并发布 GitHub Pages。

## 行为与维护

游客只需昵称即可留言，邮箱选填；登录为可选项。文章点赞固定使用 `reaction0`，不要改变其顺序或含义，以免旧计数对应错误。评论和点赞按固定文章路径 `/blog/<id>/` 分开保存，网址查询参数或标题变化不会产生新的评论区。

评论客户端使用本地打包的 `@waline/client`，不依赖外部脚本 CDN；接近文章底部才加载。服务来源限制为博客域名、Vercel 服务域名和 Waline 默认允许的本地调试地址。浏览量统计没有启用。

更新服务依赖后需重新部署并检查评论读取、游客发布、回复和点赞。Neon 保留原数据库；删除 Vercel 部署不能代替数据库备份。服务故障先查看 Vercel 日志、Neon 状态和环境连接，再重新部署；博客正文仍可阅读。

锁定 Waline 服务端版本，并覆盖 request、protobufjs、qs 和 axios 的上游旧依赖；request 使用保留原接口的 Cypress 维护分支。依赖审计仍标记未启用的 CloudBase/LeanCloud 驱动中的 lodash.set、lodash.unset 和 uuid，不能把该结果描述为零漏洞；本服务只配置 PostgreSQL，后续更新应继续核查上游修复。

Waline 服务端和官方 SQL 来自 [walinejs/waline](https://github.com/walinejs/waline)，遵循其 GPL-2.0 授权。博客的 Apache-2.0 模板授权不会替代 Waline 自身的授权。
