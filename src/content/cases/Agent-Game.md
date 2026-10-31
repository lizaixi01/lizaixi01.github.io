---
title: "归途灯塔：在地牢中动手理解 Agent 机制"
description: "用知识挑战或 AI Coding 完成交互实验，再由运行结果与迁移用例验收。"
project: "Agent-Game"
---

## 先观察机制，再作出判断

归途灯塔把 Agent 学习放进像素地牢。十个实验房间覆盖工具循环、上下文、Checkpoint、长期记忆、Skills、Hooks、MCP、Plugin、多 Agent 和 Eval。

玩家可以改变参数、预测结果，并沿时间线查看消息、内存、磁盘和数据库的变化。可视化实验中的模型决策使用本地确定性程序，让机制能够重复观察。

## 知识挑战与 AI Coding

知识挑战通过选择、预测和方案组合完成任务，无需模型账户。AI Coding 则引导玩家提出需求、阅读真实 diff、找出失败案例，再向模型补充修正要求；也可以导入外部编程工具的实现。

两条路线使用当前案例和迁移用例检查结果。仅阅读源码、播放动画或生成代码，不会自动通关。

## 本机运行与课程边界

知识挑战、本地实验和带练可以离线完成；选做游戏内 AI Coding 时，才使用自己的模型配置。Windows 游玩包包含运行环境，源码版需要 Python；本机服务负责文件、进程和实验状态，直接双击 HTML 不能运行完整实验。

课程依据李博杰《深入理解 AI Agent：设计原理与工程实践》v2.0，仓库提供出处与实现边界。它用于学习与实验，不代表完整生产系统，也不构成教学效果评估。

- [核对时的玩法与实现边界](https://github.com/lizaixi01/Agent-Game/blob/9fcfcc76fc10497eb199f52a71876748dac37799/README.md)
- [Windows 游玩包与版本说明](https://github.com/lizaixi01/Agent-Game/releases/latest)
