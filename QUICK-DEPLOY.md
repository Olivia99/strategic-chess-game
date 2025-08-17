# 🚀 快速部署指南

## 📋 准备工作清单

### ✅ 已完成
- [x] 项目代码准备完毕
- [x] Git 仓库初始化
- [x] 部署配置文件创建

### 🔲 需要你完成的步骤

## 第1步：创建 GitHub 仓库

**选项A：使用建议的仓库名**
1. 访问：https://github.com/new
2. 仓库名称：`strategic-chess-game`
3. 设置为 Public
4. **重要**：不要勾选任何初始化选项
5. 点击 "Create repository"

**选项B：如果想用其他名称**
- 创建后需要更新远程仓库地址：
```bash
git remote set-url origin https://github.com/Olivia99/YOUR_REPO_NAME.git
```

## 第2步：推送代码

创建仓库后，在终端运行：
```bash
git push -u origin main
```

## 第3步：自动创建 Neon 数据库

**最简单的方法 - 使用 Neon 的 GitHub 集成：**

1. 访问：https://console.neon.tech/signup
2. 选择 "Continue with GitHub"  
3. 在创建项目时，选择 "Import from GitHub"
4. 选择你的 `strategic-chess-game` 仓库
5. Neon 会自动：
   - 创建数据库
   - 设置环境变量
   - 执行建表脚本（如果检测到）

## 第4步：一键部署到 Vercel

1. 访问：https://vercel.com/new
2. 导入你的 GitHub 仓库
3. **关键配置**：
   - Root Directory: `apps/web`
   - Framework Preset: `Other`
   - Build Command: `npm run build`
   - Output Directory: `build/client`

4. 环境变量会从 Neon 自动同步！

## 🎉 完成！

部署完成后，你会得到：
- 线上游戏地址：`https://your-project.vercel.app`
- 数据库管理：Neon 控制台
- 项目管理：Vercel 仪表板

## 🆘 如果遇到问题

**常见问题解决：**

1. **GitHub 推送失败**
   - 确保仓库已创建
   - 检查仓库是否为 Public

2. **Vercel 构建失败**
   - 检查 Root Directory 是否设置为 `apps/web`
   - 确认环境变量 `DATABASE_URL` 已设置

3. **数据库连接失败**
   - 验证 Neon 数据库连接字符串
   - 确保建表脚本已执行

## 📱 测试你的游戏

部署成功后测试以下功能：
- [x] 首页加载
- [x] 创建游戏房间
- [x] 加入游戏房间  
- [x] 选择英雄
- [x] 下棋和实时同步

---

**需要帮助？** 随时告诉我你在哪一步遇到了问题！