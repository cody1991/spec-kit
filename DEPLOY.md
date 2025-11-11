# GitHub Pages 部署指南

## 自动部署配置

项目已配置 GitHub Actions，当推送到 `main` 分支时会自动构建并部署到 GitHub Pages。

## 首次设置

1. **启用 GitHub Pages**：
   - 访问仓库设置：https://github.com/cody1991/spec-kit/settings/pages
   - Source 选择：`Deploy from a branch`
   - Branch 选择：`gh-pages`，文件夹选择：`/ (root)`
   - 点击 Save

2. **等待首次部署**：
   - 推送代码到 main 分支
   - GitHub Actions 会自动运行
   - 查看 Actions：https://github.com/cody1991/spec-kit/actions
   - 部署完成后，访问：https://cody1991.github.io/spec-kit/

## Git Hooks

### Pre-commit Hook

每次 `git commit` 时会自动构建文档，确保提交的代码可以正常构建。

**跳过构建**（如果需要快速提交）：
```bash
SKIP_BUILD=1 git commit -m "your message"
```

**手动触发构建**：
```bash
npm run docs:build
```

## 工作流程

1. **本地开发**：
   ```bash
   npm run docs:dev  # 启动开发服务器
   ```

2. **提交代码**：
   ```bash
   git add .
   git commit -m "更新文档"  # 会自动构建
   git push origin main
   ```

3. **自动部署**：
   - GitHub Actions 检测到 push
   - 自动构建文档
   - 部署到 GitHub Pages
   - 几分钟后即可访问新版本

## 访问地址

部署成功后，文档将发布在：
- **GitHub Pages**: https://cody1991.github.io/spec-kit/

## 故障排查

### 构建失败

如果 GitHub Actions 构建失败：
1. 查看 Actions 日志：https://github.com/cody1991/spec-kit/actions
2. 检查错误信息
3. 本地测试构建：`npm run docs:build`

### 本地构建失败

如果 pre-commit hook 构建失败：
1. 检查错误信息
2. 修复问题后重新提交
3. 或使用 `SKIP_BUILD=1 git commit` 跳过构建（不推荐）

### Pages 未更新

1. 检查 Actions 是否成功运行
2. 检查 Pages 设置是否正确
3. 等待几分钟（GitHub Pages 更新有延迟）

## 自定义域名（可选）

如果需要使用自定义域名：

1. 在仓库根目录创建 `CNAME` 文件：
   ```
   your-domain.com
   ```

2. 更新 `.github/workflows/deploy.yml` 中的 `cname` 字段

3. 在 DNS 提供商处配置 CNAME 记录

