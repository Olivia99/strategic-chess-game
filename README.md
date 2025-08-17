# Strategic Chess Game

一个基于历史英雄的6x6棋类游戏，支持实时多人对战。

## 🎮 游戏特色

- **6x6网格**: 49个可下棋位置的创新棋盘
- **6位历史英雄**: 亚历山大、成吉思汗、拿破仑、华盛顿、安妮·邦妮、切·格瓦拉
- **实时对战**: Server-Sent Events实现的实时同步
- **独特能力**: 每个英雄都有被动和主动技能
- **多种胜利条件**: 击败指挥官或获得21点奖杯

## 🚀 快速开始

### 在线体验
项目部署后的访问地址将在这里显示。

### 本地运行

1. **安装依赖**
   ```bash
   cd apps/web
   npm install
   ```

2. **配置数据库**
   - 创建 Neon 数据库：https://console.neon.tech
   - 复制连接字符串到 `.env.local`
   - 在数据库中执行 `database-setup.sql`

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

## 📦 部署指南

详细部署步骤请查看 `README-DEPLOYMENT.md`

### 推荐部署方案：

1. **Railway** - 一键部署，自带数据库
2. **Vercel + Neon** - 适合静态前端 + 数据库
3. **Netlify** - 适合前端项目

## 🎯 游戏规则

- 棋子放置在网格交叉点上
- 每个英雄有独特的被动和主动能力
- 通过击败对方指挥官或获得21奖杯获胜
- 支持棋子转换系统

## 🛠 技术栈

- **前端**: React + React Router + Tailwind CSS
- **后端**: Node.js API Routes
- **数据库**: PostgreSQL (Neon)
- **实时通信**: Server-Sent Events
- **部署**: Vercel/Railway/Netlify

## 📝 开发状态

✅ 核心游戏逻辑完成
✅ 实时多人对战
✅ 英雄能力系统
✅ 数据库设计
🚀 准备部署

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License