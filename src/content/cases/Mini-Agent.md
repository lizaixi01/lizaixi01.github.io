---
title: "Mini-Agent：从零搭建一个教学 Agent"
description: "用六课 Python 实现理解会话、工具、权限、Memory 与 Skills。"
project: "Mini-Agent"
---

## 从一个最小循环开始

Mini-Agent 把 Agent 的基础机制拆成六课：Agent 循环、工具调用、会话与事件、权限管理、跨会话记忆，以及 Skills 的按需加载。读者可以一边阅读课程，一边查看简化的 Python 实现。

项目借鉴 Codex 与 Claude Code 的公开功能，用于解释这些机制如何连接起来。它是教学实现，不是对完整产品能力的复刻。

## 固定剧本与真实模型分开

固定剧本演示不需要密钥，适合先观察执行流程；接入真实 DeepSeek 模型时才需要安装 SDK 并配置自己的模型账户。演示能够说明流程，不等于真实模型已经完成同一任务。

会话、Memory 和 Skills 分别负责当前任务记录、跨会话信息与按需读取的说明。课程将这些机制逐步加入，避免一开始就把全部功能放进同一个复杂框架。

## 下载与版本

首个发布版本为 **v0.1.0 教学源码版**。下载源码 ZIP 并完整解压，进入 `Mini-Agent-v0.1.0` 文件夹。需要 Python 3.10 或更高版本，运行以下命令即可体验无需密钥的固定剧本：

```sh
python agent.py --demo
```

压缩包包含 Python 实现、六课正文、示例技能、测试与许可证。

- [下载 v0.1.0 源码包](https://github.com/lizaixi01/Mini-Agent/releases/download/v0.1.0/mini-agent-v0.1.0-source.zip)
- [最新版本、说明与文件校验值](https://github.com/lizaixi01/Mini-Agent/releases/latest)
- [全部历史版本](https://github.com/lizaixi01/Mini-Agent/releases)

## 当前实现范围

上下文压缩、子 Agent、后台任务、Goal 和定时任务仍列在后续计划中。权限确认也不构成系统沙箱：批准的终端命令使用当前本机用户权限。

课程可以作为动手起点，进一步的可靠性、隔离和长期运行需要另外设计与验证。本次博客更新未运行真实模型调用。

- [发布版本的项目 README 与六课入口](https://github.com/lizaixi01/Mini-Agent/blob/221827fd2524d3574bdfb7dcbb888464d75ad95d/README.md)
