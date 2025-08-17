# 部署步骤记录

## 账号信息
- **GitHub 用户名**: Olivia99
- **Vercel 账号**: vercel.com/jieyingyang1-5495

## 第一步：创建 GitHub 仓库并推送代码

### 1.1 创建 GitHub 仓库
1. 访问：https://github.com/new
2. 仓库名称：`strategic-chess-game`（或你喜欢的名称）
3. 设置为 Public
4. 不要勾选任何初始化选项（README、.gitignore、license）
5. 点击 "Create repository"

### 1.2 推送代码到 GitHub
```bash
# 添加远程仓库（替换为你的实际仓库地址）
git remote add origin https://github.com/Olivia99/strategic-chess-game.git

# 重命名分支为 main
git branch -M main

# 推送代码
git push -u origin main
```

## 第二步：创建 Neon 数据库

### 2.1 注册 Neon 账号
1. 访问：https://console.neon.tech/signup
2. 使用 GitHub 账号登录（推荐）
3. 创建新项目，命名为 `chess-game-db`

### 2.2 获取数据库连接字符串
1. 在 Neon 控制台中，点击 "Connection string"
2. 复制 PostgreSQL 连接字符串，格式类似：
   ```
   postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb
   ```

### 2.3 初始化数据库表
1. 在 Neon 控制台中打开 "SQL Editor"
2. 复制 `apps/web/database-setup.sql` 文件内容
3. 执行SQL脚本创建表结构

## 第三步：Vercel 部署配置

### 3.1 在 Vercel 中导入项目
1. 访问：https://vercel.com/jieyingyang1-5495
2. 点击 "New Project"
3. 选择 "Import Git Repository"
4. 连接你的 GitHub 账号
5. 选择 `strategic-chess-game` 仓库
6. 选择 `apps/web` 作为项目根目录

### 3.2 配置项目设置
- **Framework Preset**: Other
- **Root Directory**: `apps/web`
- **Build Command**: `npm run build`
- **Output Directory**: `build/client`
- **Install Command**: `npm install`

### 3.3 设置环境变量
在 Vercel 项目设置中添加：
- **DATABASE_URL**: 你的 Neon 数据库连接字符串
- **NODE_ENV**: `production`

## 第四步：验证部署

### 4.1 检查构建状态
- 确保 Vercel 构建成功
- 查看部署日志排查任何错误

### 4.2 测试功能
1. 访问部署的网址
2. 测试创建游戏房间
3. 测试加入房间
4. 测试游戏功能

## 预期结果
完成后，你应该能通过类似 `https://strategic-chess-game.vercel.app` 的网址访问你的游戏。

## 如遇问题
- 检查 Vercel 构建日志
- 确认数据库连接字符串正确
- 验证环境变量设置