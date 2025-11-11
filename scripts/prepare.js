#!/usr/bin/env node

// 安装 Git hooks
const fs = require('fs');
const path = require('path');

const hooksDir = path.join(__dirname, '..', '.git', 'hooks');
const preCommitHook = path.join(hooksDir, 'pre-commit');

// 创建 hooks 目录（如果不存在）
if (!fs.existsSync(hooksDir)) {
  fs.mkdirSync(hooksDir, { recursive: true });
}

// 创建 pre-commit hook
const hookContent = `#!/bin/sh
# Pre-commit hook: 构建文档
# 使用 SKIP_BUILD=1 可以跳过构建，例如: SKIP_BUILD=1 git commit

if [ "$SKIP_BUILD" = "1" ]; then
  echo "⏭️  Skipping build (SKIP_BUILD=1)"
  exit 0
fi

echo "🔨 Building documentation..."
npm run docs:build

if [ $? -ne 0 ]; then
  echo "❌ Build failed! Please fix errors before committing."
  echo "💡 Tip: Use SKIP_BUILD=1 git commit to skip build"
  exit 1
fi

echo "✅ Build successful!"
exit 0
`;

fs.writeFileSync(preCommitHook, hookContent);
fs.chmodSync(preCommitHook, '755');

console.log('✅ Git hooks installed successfully!');

