---
title: "AgentCAD：给 Agent 一个可以检查与撤销的 CAD 运行时"
description: "把二维图纸与参数化三维零件接进工具调用、独立校验和变更历史。"
project: "AgentCAD"
---

## 把 CAD 接进 Agent 的工作流

AgentCAD 是安装在本机的 CAD 运行时。Agent 通过 MCP 调用工具，创建、修改、检查和导出工程图与三维零件；同一套服务也提供 CLI、Python 和 HTTP 接口。

二维图纸以 ezdxf 为核心，可以处理图层、图块、尺寸、图框和布局；参数化三维零件使用可选的 FreeCAD 后端。用户仍然在自己的 Agent 客户端中提出需求，AgentCAD 负责执行具体的 CAD 操作。

## 每次变更可以检查与撤销

一批操作作为原子事务提交：其中一步失败，文件保持原状。编辑前保存检查点，编辑后记录差异和持久化日志，后续会话可以查看历史并回滚。

独立校验器从磁盘重新读取文件，检查图形完整性、几何、尺寸和指定要求。三维零件还会检查实体有效性、大小、体积与重建失败的特征。只读查看器展示当前图纸、零件和变更时间线，帮助人和 Agent 对照结果。

## 二维图纸与三维零件

二维工作流支持 DXF、SVG、JSON 与 PDF 出图；DWG 导入、导出和 AutoCAD AUDIT 依赖本机安装的 AutoCAD。三维工作流支持参数调整、特征重建、预览和 STEP / STL 导出。

当前三维范围是单实体零件，尚不支持装配，也不能自动从三维生成二维工程图。行业符号库覆盖常用内容，不能视为完整行业目录。

## 当前证据与使用入口

公开仓库提供安装器、操作文档与评测记录。项目仍处于早期阶段，三维评测主要来自小样本；几何检查和局部任务结果不能替代制造验收，出图布局仍需人工复核。本页整理公开资料，没有重新执行 CAD 后端或模型实验。

- [核对时的项目 README](https://github.com/lizaixi01/AgentCAD/blob/fa04950630481b43d984b833405faf83013bc9d9/README.md)
- [使用教程](https://github.com/lizaixi01/AgentCAD/blob/main/docs/tutorial.md)
- [当前限制与路线图](https://github.com/lizaixi01/AgentCAD/blob/main/docs/limitations-roadmap.md)
