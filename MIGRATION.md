# JDS Monorepo 迁移指南

## 概述

本指南将帮助你将现有的 Jackery Design System 迁移到新的 Monorepo 架构。

## 迁移步骤

### 1. 安装依赖

```bash
# 删除现有的 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 安装 pnpm（如果尚未安装）
npm install -g pnpm

# 安装所有依赖
pnpm install
```

### 2. 迁移现有代码

#### 2.1 迁移组件到 packages/core

```bash
# 将现有组件迁移到 core 包
cp -r src/components/* packages/core/src/components/
cp -r src/styles/* packages/core/src/styles/
```

#### 2.2 迁移工具函数到 packages/utils

```bash
# 将工具函数迁移到 utils 包
cp -r src/utils/* packages/utils/src/
```

#### 2.3 迁移国际化到 packages/i18n

```bash
# 将国际化相关代码迁移到 i18n 包
cp -r src/i18n/* packages/i18n/src/
```

#### 2.4 迁移 Storybook 配置

```bash
# 将 Storybook 配置迁移到 apps/storybook
cp -r .storybook apps/storybook/
cp -r src/examples apps/storybook/stories
```

### 3. 更新导入路径

在迁移后，需要更新所有的导入路径：

```typescript
// 旧的导入方式
import { JackeryButton } from '../components/button';
import { formatDate } from '../utils/common';

// 新的导入方式
import { JackeryButton } from '@jackery/core/button';
import { formatDate } from '@jackery/utils/common';
```

### 4. 构建和测试

```bash
# 构建所有包
pnpm build

# 运行测试
pnpm test

# 启动 Storybook
pnpm storybook
```

### 5. 发布流程

#### 5.1 创建变更集

```bash
# 为你的更改创建变更集
pnpm changeset
```

#### 5.2 版本更新

```bash
# 更新版本号
pnpm changeset:version
```

#### 5.3 发布

```bash
# 发布到 NPM
pnpm release
```

## 包结构说明

### @jackery/core
- **用途**: 核心 Web Components 组件
- **导出**: Button, Badge, Dialog, Popover, Spinner, Toast, Tooltip
- **样式**: 包含所有组件样式和主题令牌

### @jackery/icons
- **用途**: 图标库
- **导出**: SVG 图标、图标组件、字体文件

### @jackery/i18n
- **用途**: 国际化功能
- **导出**: 核心 i18n 功能、装饰器、语言包

### @jackery/utils
- **用途**: 通用工具函数
- **导出**: 通用工具、DOM 操作、事件处理、表单控制

## 开发工作流

### 本地开发

```bash
# 启动所有包的开发模式
pnpm dev

# 启动 Storybook
pnpm storybook
```

### 添加新组件

1. 在 `packages/core/src/components/` 中创建新组件
2. 在 `packages/core/src/index.ts` 中导出
3. 在 `apps/storybook/stories/` 中添加 Story
4. 运行测试确保一切正常

### 发布新版本

1. 进行代码更改
2. 运行 `pnpm changeset` 创建变更集
3. 提交代码到 Git
4. 合并到主分支后，CI 会自动处理版本更新和发布

## 故障排除

### 依赖问题

如果遇到依赖解析问题：

```bash
# 清理所有依赖
pnpm clean
rm -rf node_modules
pnpm install
```

### 构建问题

如果构建失败：

```bash
# 检查 TypeScript 类型
pnpm type-check

# 运行 lint
pnpm lint
```

### 路径解析问题

确保 `tsconfig.json` 中的路径映射正确配置，并且所有包都正确引用了共享的 TypeScript 配置。

## 注意事项

1. **不要直接修改 `dist/` 目录**：这些是构建产物，会被自动生成
2. **使用 workspace 协议**：在 package.json 中使用 `workspace:*` 引用内部包
3. **遵循语义化版本**：使用 Changesets 确保版本更新符合语义化版本规范
4. **保持包的独立性**：每个包应该能够独立构建和测试

## 获取帮助

如果在迁移过程中遇到问题，请：

1. 查看 Turborepo 文档：https://turbo.build/repo/docs
2. 查看 Changesets 文档：https://github.com/changesets/changesets
3. 联系 Jackery F2E Team