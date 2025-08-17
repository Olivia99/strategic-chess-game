# 部署指南

## 第一步：创建 Neon 数据库

1. **注册 Neon 账号**
   - 访问：https://console.neon.tech/signup
   - 使用 GitHub 或邮箱注册
   - 选择免费计划

2. **创建数据库**
   - 进入控制台后点击 "Create a project"
   - 选择区域（推荐 US East 或离你最近的）
   - 等待数据库创建完成（通常几秒钟）

3. **获取连接字符串**
   - 在项目仪表板中找到 "Connection string"
   - 复制类似这样的字符串：
     ```
     postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb
     ```

## 第二步：初始化数据库

1. **连接到数据库**
   - 在 Neon 控制台中打开 "SQL Editor"
   - 或使用任何 PostgreSQL 客户端

2. **执行建表脚本**
   - 复制 `database-setup.sql` 文件中的内容
   - 在 SQL Editor 中执行

## 第三步：配置环境变量

1. **本地测试**
   - 编辑 `.env.local` 文件
   - 将 `DATABASE_URL` 设置为你的连接字符串

2. **测试本地运行**
   ```bash
   npm run dev
   ```

## 第四步：部署到 Vercel

1. **初始化 Git 仓库（如果没有）**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **推送到 GitHub**
   - 在 GitHub 创建新仓库
   - 推送代码

3. **连接 Vercel**
   ```bash
   vercel
   ```

4. **设置环境变量**
   - 在 Vercel 仪表板中设置 `DATABASE_URL`

## 常见问题

- **数据库连接失败**：检查 DATABASE_URL 格式
- **构建失败**：确保所有依赖已安装
- **实时同步不工作**：检查 SSE 端点是否正常