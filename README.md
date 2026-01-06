# 高中工作台 · AI助手

这是一个基于 Next.js 的 AI 助手工作台页面。

## 本地开发

```bash
cd frontend
npm install
npm run dev
```

访问 http://localhost:3000/scrm/default-panel

## 构建静态文件

```bash
cd frontend
npm run build
node fix-paths.js
```

构建后的文件在 `frontend/out` 目录中。

## 部署到 GitHub Pages

1. 在 GitHub 上创建新仓库
2. 将代码推送到仓库：
   ```bash
   git remote add origin https://github.com/你的用户名/仓库名.git
   git branch -M main
   git push -u origin main
   ```
3. 在 GitHub 仓库设置中：
   - 进入 Settings > Pages
   - Source 选择 "GitHub Actions"
4. 推送代码后，GitHub Actions 会自动构建并部署到 GitHub Pages

## 访问页面

部署完成后，页面可以通过以下 URL 访问：
- `https://你的用户名.github.io/仓库名/scrm/default-panel/`






