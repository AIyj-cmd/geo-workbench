# 新亦源 · GEO 内容工作台

AI 驱动的 SEO 内容生成与多平台分发工具，基于小米 MiMo 大模型。

## 功能

- 📋 **客户提问词库** — 49 个行业问题管理，支持 Excel 导入导出
- 🎯 **卖点弹药库** — 14 条核心卖点，按维度分类
- ✍️ **内容工作台** — AI 生成母稿（7 段式结构 + 事实库 + 数据纪律）
- 📡 **一稿多发** — 6 个平台专属 Prompt，一键生成知乎/百家号/官网/公众号/小红书/抖音版本
- ⚡ **批量生成** — 选题范围 + 模型 + 并发控制
- 📊 **数据看板** — 统计指标 + 词频分析
- 📌 **看板** — 任务拖拽管理（未开始/进行中/已发布）
- 🧪 **测试记录** — AI 搜索实测数据追踪
- 💾 **数据管理** — JSON/Excel 导入导出 + Word 文稿导出

## 技术栈

- 前端：原生 HTML + CSS + JavaScript（单页应用）
- 后端：Node.js（API 代理，保护密钥）
- 存储：浏览器 localStorage
- AI：小米 MiMo v2.5 系列模型

## 启动

```bash
npm install
node server.js
# 访问 http://localhost:3010
```

## 配置

服务端 `config.json` 存储 API 密钥（已 gitignore）：

```json
{
  "apiKey": "your-api-key",
  "endpoint": "https://token-plan-sgp.xiaomimimo.com/v1",
  "model": "mimo-v2.5-pro"
}
```
